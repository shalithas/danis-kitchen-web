import { useEffect, useRef } from 'react';

const VERTEX_SHADER = `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mo;

vec2 crot(vec2 uv, float a) {
  return vec2(cos(a), -sin(a)) * uv.x + vec2(sin(a), cos(a)) * uv.y;
}

float sdRoundBox(vec2 p, vec2 b, float r) {
  vec2 d = abs(p) - b + r;
  return min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) - r;
}

float be(vec2 p, vec2 a, vec2 b, float lw) {
  vec2 pa = p - a;
  vec2 ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return 1.0 - smoothstep(0.0, lw, length(pa - ba * h));
}

float bcs(float a, float b, float c, float d) {
  return smoothstep(c, c + d, a) * (1.0 - smoothstep(b, b + d, a));
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv -= vec2(0.5);
  uv *= vec2(1.0, u_resolution.y / u_resolution.x);

  float t = u_time;
  vec2 mo = u_mo;

  vec2 p = crot(uv, sin(t * 0.5 + length(uv * 0.25) * 0.5) * 0.5 + mo.x) * 3.0;
  p.y += t * 0.25;

  float g = bcs(fract(p.y), 0.1, 0.35, 0.05) * bcs(fract(p.x + fract(p.y) * 0.5), 0.1, 0.35, 0.05);

  float lw = mix(0.02, 0.03, fract(p.y * 13.0));
  float l = max(be(fract(p), vec2(0.0), vec2(0.0, 1.0), lw), be(fract(p), vec2(0.0, 0.5), vec2(1.0, 0.5), lw));

  p.x += fract(p.y) > 0.5 ? 0.0 : 0.5;
  p = floor(p) / 10.0;

  vec3 ra = vec3(
    fract(sin(dot(p.xy, vec2(12.9898, 78.233))) * 43758.5453123),
    fract(sin(dot(p.yx, vec2(12.9898, 78.233))) * 43758.5453123),
    fract(sin(dot(p.xy + 0.5, vec2(12.9898, 78.233))) * 43758.5453123)
  );

  float id = (sin(p.x * 5.0 + t * 0.2 + mo.x) + cos(p.y * 5.0 + t * 0.15 + mo.y)) * 0.5;

  float gl_val = l * smoothstep(0.1, 0.3, fract(p.x + t * 0.1)) * smoothstep(0.2, 0.4, id + l) * 0.5;

  float tp = exp(-pow(abs(fract(p.x * 10.0 + t * 0.05) - 0.5), 2.0) * 10.0) * exp(-pow(abs(fract(p.y * 13.0 + t * 0.03) - 0.5), 2.0) * 10.0);

  float lbc = 0.0;
  lbc += 0.02 / (abs(sdRoundBox(fract(p) - 0.5, vec2(0.3), 0.05)) + 0.01);
  lbc += 0.02 / (abs(sdRoundBox(fract(p) - 0.5, vec2(0.2, 0.4), 0.02)) + 0.01);
  lbc += 0.02 / (abs(sdRoundBox(fract(p) - 0.5, vec2(0.4, 0.2), 0.02)) + 0.01);
  lbc += 0.02 / (abs(sdRoundBox(fract(p) - vec2(0.5, 0.25), vec2(0.15), 0.02)) + 0.01);

  vec4 fcol = mix(vec4(0.01, 0.01, 0.02, 1.0), vec4(0.0, 0.0, 0.0, 1.0), smoothstep(0.0, 1.0, length(uv)));

  vec3 colYellow = vec3(0.96, 0.875, 0.0);
  vec3 colRed = vec3(0.96, 0.125, 0.125);

  fcol.rgb += colYellow * smoothstep(0.0, 0.5, tp) * 0.2 * (1.0 + smoothstep(0.3, 0.7, id));
  fcol.rgb += colYellow * lbc * (1.0 + 0.5 * sin(t + p.x * 20.0)) * 0.1;

  float glow = 0.8;

  vec4 redGlow = vec4(colRed, 1.0) * glow * smoothstep(0.0, 0.5, l) * (1.0 + smoothstep(0.3, 0.7, id));
  vec4 yellowGlow = vec4(colYellow, 1.0) * glow * 0.5 * smoothstep(0.0, 0.5, l) * (0.5 + 0.5 * smoothstep(0.4, 0.6, id)) * (1.0 + 0.2 * sin(t * 2.0 + p.y * 10.0));

  fcol += gl_val * glow * smoothstep(0.0, 0.5, l) * (1.0 + 0.5 * sin(t + p.y * 10.0)) * vec4(colYellow, 1.0);

  fcol = mix(fcol, vec4(mix(colRed, colYellow, smoothstep(0.4, 0.6, id)), fcol.a), g);

  fcol += redGlow;
  fcol += yellowGlow;
  fcol += vec4(colRed, 1.0) * 0.1 * (1.0 + 0.5 * sin(t * 0.5 + p.x * 5.0)) * smoothstep(0.5, 0.8, id);
  fcol += vec4(0.8, 0.9, 1.0, 1.0) * exp(-length(uv) * 3.0) * 0.1 * (1.0 + sin(t * 0.2));

  gl_FragColor = fcol;
}
`;

class Quad {
  gl: WebGLRenderingContext;
  buffer: WebGLBuffer;
  size: number;
  count: number;

  constructor(gl: WebGLRenderingContext) {
    this.gl = gl;
    this.buffer = gl.createBuffer()!;
    this.size = 2;
    this.count = 4;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  }
}

interface UniformInfo {
  location: WebGLUniformLocation | null;
  type: number;
}

class Program {
  gl: WebGLRenderingContext;
  programs: WebGLProgram;
  samplers: string[];
  uniforms: Record<string, UniformInfo>;

  constructor(gl: WebGLRenderingContext, program: WebGLProgram, samplers: string[] = []) {
    this.gl = gl;
    this.programs = program;
    this.samplers = samplers;
    this.uniforms = {};

    const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < count; i++) {
      const info = gl.getActiveUniform(program, i);
      if (info) {
        const name = info.name.replace('[0]', '');
        this.uniforms[name] = {
          location: gl.getUniformLocation(program, info.name),
          type: info.type,
        };
      }
    }
  }

  render(x: number, y: number) {
    const gl = this.gl;
    gl.useProgram(this.programs);

    if (this.uniforms['u_resolution']) {
      gl.uniform2f(this.uniforms['u_resolution'].location, gl.canvas.width, gl.canvas.height);
    }
    if (this.uniforms['u_time']) {
      gl.uniform1f(this.uniforms['u_time'].location, performance.now() * 0.001);
    }
    if (this.uniforms['u_mo']) {
      gl.uniform2f(this.uniforms['u_mo'].location, x, y);
    }

    for (let i = 0; i < this.samplers.length; i++) {
      const name = this.samplers[i];
      const uniform = this.uniforms[name];
      if (uniform) {
        gl.activeTexture(gl.TEXTURE0 + i);
        gl.uniform1i(uniform.location, i);
      }
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, (this as any).quad.buffer);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  destroy() {
    this.gl.deleteProgram(this.programs);
  }
}

class ShadingSystem {
  gl: WebGLRenderingContext;
  width: number;
  height: number;
  programs: Program[];
  quad: Quad;
  samplers: string[];
  private destroyed: boolean;

  constructor(canvas: HTMLCanvasElement) {
    this.destroyed = false;
    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false });
    if (!gl) {
      this.gl = null as any;
      this.width = 0;
      this.height = 0;
      this.programs = [];
      this.quad = null as any;
      this.samplers = [];
      return;
    }

    gl.getExtension('OES_standard_derivatives');
    this.gl = gl;
    this.width = 0;
    this.height = 0;
    this.programs = [];
    this.quad = new Quad(gl);
    this.samplers = ['u_image', 'u_flareTexture', 'u_godraysTexture'];

    this.resize = this.resize.bind(this);
    window.addEventListener('resize', this.resize);
    this.resize();
  }

  resize() {
    if (this.destroyed || !this.gl) return;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.gl.canvas.width = this.width;
    this.gl.canvas.height = this.height;
    this.gl.viewport(0, 0, this.width, this.height);
  }

  createShader(type: number, source: string): WebGLShader | null {
    if (!this.gl) return null;
    const shader = this.gl.createShader(type);
    if (!shader) return null;
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error('Shader compile error:', this.gl.getShaderInfoLog(shader));
      this.gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  createProgram(vs: WebGLShader, fs: WebGLShader, samplers: string[] = []): Program | null {
    if (!this.gl) return null;
    const program = this.gl.createProgram();
    if (!program) return null;
    this.gl.attachShader(program, vs);
    this.gl.attachShader(program, fs);
    this.gl.bindAttribLocation(program, 0, 'a_pos');
    this.gl.linkProgram(program);
    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      console.error('Program link error:', this.gl.getProgramInfoLog(program));
      return null;
    }

    const p = new Program(this.gl, program, samplers);
    (p as any).quad = this.quad;
    this.programs.push(p);
    return p;
  }

  render(dx: number, dy: number) {
    if (this.destroyed || !this.gl || this.programs.length === 0) return;
    const x = dx * 0.5 * this.width;
    const y = dy * 0.5 * this.height;
    this.gl.depthMask(false);
    this.programs.forEach((p) => {
      const gl = this.gl;
      gl.useProgram(p.programs);

      if (p.uniforms['u_resolution']) {
        gl.uniform2f(p.uniforms['u_resolution'].location, this.width, this.height);
      }
      if (p.uniforms['u_time']) {
        gl.uniform1f(p.uniforms['u_time'].location, performance.now() * 0.001);
      }
      if (p.uniforms['u_mo']) {
        gl.uniform2f(p.uniforms['u_mo'].location, x, y);
      }

      for (let i = 0; i < p.samplers.length; i++) {
        const name = p.samplers[i];
        const uniform = p.uniforms[name];
        if (uniform) {
          gl.activeTexture(gl.TEXTURE0 + i);
          gl.uniform1i(uniform.location, i);
        }
      }

      gl.bindBuffer(gl.ARRAY_BUFFER, this.quad.buffer);
      gl.enableVertexAttribArray(0);
      gl.vertexAttribPointer(0, this.quad.size, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.quad.count);
    });
    this.gl.depthMask(true);
  }

  destroy() {
    this.destroyed = true;
    window.removeEventListener('resize', this.resize);
    this.programs.forEach((p) => p.destroy());
    this.programs = [];
  }
}

export default function CrystalAbyss() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const systemRef = useRef<ShadingSystem | null>(null);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const system = new ShadingSystem(canvas);
    systemRef.current = system;

    const vs = system.createShader(system.gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = system.createShader(system.gl.FRAGMENT_SHADER, FRAGMENT_SHADER);

    if (vs && fs) {
      system.createProgram(vs, fs, []);
    }

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('mousemove', onMouseMove);

    const animate = () => {
      system.render(mouseRef.current.x * 0.1, mouseRef.current.y * 0.1);
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', onMouseMove);
      system.destroy();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 10,
      }}
    />
  );
}
