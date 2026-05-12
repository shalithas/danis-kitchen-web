import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import content from '../lib/content';

gsap.registerPlugin(ScrollTrigger);

export default function OurStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const textRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.from(headingRef.current, {
        y: 80,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
        },
      });

      textRefs.current.forEach((p, i) => {
        if (!p) return;
        gsap.from(p, {
          y: 40,
          opacity: 0,
          duration: 1,
          delay: i * 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: p,
            start: 'top 80%',
          },
        });
      });

      if (videoRef.current) {
        gsap.from(videoRef.current, {
          scale: 0.95,
          opacity: 0,
          duration: 1.4,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: videoRef.current,
            start: 'top 80%',
          },
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="story"
      ref={sectionRef}
      className="relative py-32 md:py-48 px-6 md:px-12 lg:px-24"
      style={{ zIndex: 30 }}
    >
      <div className="max-w-7xl mx-auto">
        <h2
          ref={headingRef}
          className="font-serif text-text-yellow mb-16 md:mb-24"
          style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', lineHeight: 1.1 }}
        >
          {content.ourStory.title}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          <div className="space-y-8">
            {content.ourStory.paragraphs.slice(0, 2).map((paragraph, i) => (
              <p
                key={i}
                ref={(el) => { textRefs.current[i] = el; }}
                className="text-offwhite/80 text-lg leading-relaxed"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <div className="space-y-8">
            {content.ourStory.paragraphs.slice(2).map((paragraph, i) => (
              <p
                key={i + 2}
                ref={(el) => { textRefs.current[i + 2] = el; }}
                className="text-offwhite/80 text-lg leading-relaxed"
              >
                {paragraph}
              </p>
            ))}
            <div className="flex items-center gap-4 pt-4">
              <span className="font-accent text-text-yellow text-2xl">{content.brand.name}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
