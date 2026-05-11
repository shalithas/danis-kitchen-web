import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SLIDES = [
  { text: 'Where flavor gets loud', image: '/images/hero-shatter-a.jpg' },
  { text: 'Stacked. Sauced. Straight fire.', image: '/images/hero-shatter-b.jpg' },
  { text: 'Real food, no filter.', image: '/images/hero-shatter-c.jpg' },
];

const SHATTER_VS = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const SHATTER_FS = `
precision highp float;
varying vec2 v_uv;
uniform sampler2D u_texture;
uniform float u_progress;
uniform float u_shatterProgress;
uniform float u_scale;
uniform float u_desat;
uniform float u_greyout;
uniform vec2 u_resolution;

#define PI 3.14159265359

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

mat2 rot2(float a) {
  float c = cos(a), s = sin(a);
  return mat2(c, -s, s, c);
}

void main() {
  vec2 uv = v_uv;
  vec2 centered = uv * 2.0 - 1.0;
  centered.x *= u_resolution.x / u_resolution.y;

  float scaleMix = mix(1.3, 1.0, u_scale);
  vec2 texUV = (centered / scaleMix) * 0.5 + 0.5;
  texUV += 0.5;
  texUV = clamp(texUV, 0.0, 1.0);

  vec4 texColor = texture2D(u_texture, texUV);

  float lum = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
  vec3 desat = mix(texColor.rgb, vec3(lum), u_desat);
  vec3 greyed = mix(desat, vec3(lum), u_greyout);

  float shatter = u_shatterProgress;
  float shardCount = 12.0;
  vec2 cellId = floor(uv * shardCount);
  float shardHash = hash(cellId);
  vec2 shardCenter = (cellId + 0.5) / shardCount;

  float shardAngle = (shardHash - 0.5) * 6.0 * shatter;
  vec2 shardOffset = (shardCenter - vec2(0.5)) * shatter * 0.8;
  float shardScale = 1.0 - shatter * 0.3 * shardHash;

  vec2 shardUV = (uv - shardCenter) * rot2(shardAngle) / shardScale + shardCenter + shardOffset;

  float shardEdge = smoothstep(0.0, 0.05, shardUV.x) *
                    smoothstep(1.0, 0.95, shardUV.x) *
                    smoothstep(0.0, 0.05, shardUV.y) *
                    smoothstep(1.0, 0.95, shardUV.y);
  float shardMask = shardEdge * (1.0 - shatter);

  if (shardMask < 0.01 && shatter > 0.01) {
    discard;
  }

  float distFromCenter = length(centered);
  float vig = smoothstep(0.0, 1.0, pow(distFromCenter, 0.5));
  float progFade = 1.0 - u_progress;

  vec3 finalColor = greyed * progFade * (1.0 - vig) * 1.5;
  finalColor = mix(finalColor, texColor.rgb, 0.3 * (1.0 - u_progress));

  gl_FragColor = vec4(finalColor, texColor.a * shardMask);
}
`;

function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl: WebGLRenderingContext, vs: string, fs: string): WebGLProgram | null {
  const vsShader = createShader(gl, gl.VERTEX_SHADER, vs);
  const fsShader = createShader(gl, gl.FRAGMENT_SHADER, fs);
  if (!vsShader || !fsShader) return null;
  const prog = gl.createProgram();
  if (!prog) return null;
  gl.attachShader(prog, vsShader);
  gl.attachShader(prog, fsShader);
  gl.bindAttribLocation(prog, 0, 'a_pos');
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error('Program error:', gl.getProgramInfoLog(prog));
    return null;
  }
  return prog;
}

function loadTexture(gl: WebGLRenderingContext, url: string): Promise<WebGLTexture> {
  return new Promise((resolve) => {
    const texture = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 255]));

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      resolve(texture);
    };
    img.src = url;
  });
}

export default function ScrollMorph() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef = useRef<number>(0);
  const uniformsRef = useRef<Record<string, WebGLUniformLocation | null>>({});
  const texturesRef = useRef<WebGLTexture[]>([]);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const currentIndexRef = useRef(0);
  const progressRef = useRef({
    shatter: 0,
    scale: 1,
    desat: 0,
    greyout: 0,
    prevDesat: 0,
    prevGreyout: 0,
    prevProgress: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false });
    if (!gl) return;
    glRef.current = gl;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);

    const program = createProgram(gl, SHATTER_VS, SHATTER_FS);
    if (!program) return;
    programRef.current = program;

    const uniforms: Record<string, WebGLUniformLocation | null> = {};
    const uNames = ['u_texture', 'u_progress', 'u_shatterProgress', 'u_scale', 'u_desat', 'u_greyout', 'u_resolution'];
    uNames.forEach((name) => {
      uniforms[name] = gl.getUniformLocation(program, name);
    });
    uniformsRef.current = uniforms;

    // Create quad buffer
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    // Load textures
    Promise.all(SLIDES.map((s) => loadTexture(gl, s.image))).then((textures) => {
      texturesRef.current = textures;
    });

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    window.addEventListener('resize', resize);

    const render = () => {
      const p = progressRef.current;
      const idx = currentIndexRef.current;
      const texs = texturesRef.current;

      gl.clearColor(0.01, 0.01, 0.02, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);

      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(0);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

      if (texs.length > 0) {
        // Draw current image
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texs[idx]);
        gl.uniform1i(uniforms['u_texture'], 0);
        gl.uniform1f(uniforms['u_progress'], p.prevProgress);
        gl.uniform1f(uniforms['u_shatterProgress'], p.shatter);
        gl.uniform1f(uniforms['u_scale'], p.scale);
        gl.uniform1f(uniforms['u_desat'], p.desat);
        gl.uniform1f(uniforms['u_greyout'], p.greyout);
        gl.uniform2f(uniforms['u_resolution'], canvas.width, canvas.height);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        // Draw previous image (fading out)
        if (idx > 0) {
          gl.enable(gl.BLEND);
          gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, texs[idx - 1]);
          gl.uniform1f(uniforms['u_progress'], p.prevProgress);
          gl.uniform1f(uniforms['u_shatterProgress'], 1.0);
          gl.uniform1f(uniforms['u_scale'], 1.0);
          gl.uniform1f(uniforms['u_desat'], p.prevDesat);
          gl.uniform1f(uniforms['u_greyout'], p.prevGreyout);
          gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
          gl.disable(gl.BLEND);
        }
      }

      rafRef.current = requestAnimationFrame(render);
    };
    rafRef.current = requestAnimationFrame(render);

    // GSAP ScrollTrigger
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 2.5,
          pin: '.sequence-wrapper',
        },
      });

      SLIDES.forEach((_slide, index) => {
        tl.add(() => {
          currentIndexRef.current = index;
          progressRef.current.shatter = 1.0;
          progressRef.current.scale = 0;
          progressRef.current.desat = 0;
          progressRef.current.greyout = 0;
          progressRef.current.prevProgress = 0;

          const localTl = gsap.timeline();

          // Animate text
          if (textRefs.current[index]) {
            gsap.set(textRefs.current[index], { yPercent: 120, opacity: 0 });
            localTl.to(textRefs.current[index], {
              yPercent: 0,
              opacity: 1,
              duration: 1.2,
              ease: 'power3.inOut',
            });
          }

          // Shatter reassemble
          localTl.to(
            progressRef.current,
            {
              shatter: 0,
              duration: 1.2,
              ease: 'power2.inOut',
            },
            '<'
          );

          // Scale
          localTl.to(
            progressRef.current,
            {
              scale: 1,
              duration: 1.5,
              ease: 'power1.inOut',
            },
            '<0.75'
          );

          // Fade out previous
          if (index > 0) {
            if (textRefs.current[index - 1]) {
              localTl.to(
                textRefs.current[index - 1],
                { yPercent: -120, opacity: 0, duration: 1, ease: 'power3.inOut' },
                '<'
              );
            }
            localTl.to(
              progressRef.current,
              { prevDesat: 1, prevGreyout: 1, duration: 1 },
              '<'
            );
            localTl.to(
              progressRef.current,
              { prevProgress: 1, duration: 1 },
              '<'
            );
          }

          return localTl;
        }, index === 0 ? 0 : '+=0.8');
      });
    }, container);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      ctx.revert();
      if (program) gl.deleteProgram(program);
      if (buffer) gl.deleteBuffer(buffer);
    };
  }, []);

  return (
    <div
      id="scroll-morph"
      ref={containerRef}
      className="sequence-container"
      style={{ height: '400vh' }}
    >
      <div className="sequence-wrapper" style={{ height: '100vh', position: 'relative' }}>
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1,
          }}
        />

        {/* Text overlays */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ zIndex: 20, pointerEvents: 'none' }}
        >
          {SLIDES.map((slide, i) => (
            <div
              key={i}
              ref={(el) => { textRefs.current[i] = el; }}
              className="absolute text-center px-6"
              style={{
                opacity: i === 0 ? 1 : 0,
                transform: i === 0 ? 'translateY(0)' : 'translateY(120%)',
              }}
            >
              <h2
                className="font-display font-bold uppercase text-offwhite"
                style={{
                  fontSize: 'clamp(2rem, 6vw, 5rem)',
                  letterSpacing: '0.05em',
                  textShadow: '0 4px 40px rgba(0,0,0,0.8)',
                }}
              >
                {slide.text}
              </h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
