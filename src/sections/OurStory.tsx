import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
          className="font-serif text-text-yellow mb-16 md:mb-24"
          style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', lineHeight: 1.1 }}
        >
          Our Story
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          <div className="space-y-8">
            <p
              ref={(el) => { textRefs.current[0] = el; }}
              className="text-offwhite/80 text-lg leading-relaxed"
            >
              Dani has always been a talented chef with a profound love for baking. Her journey began in small home kitchens, crafting the perfect croissants and experimenting with flavor combinations that would bring joy to her friends and family.
            </p>
            <p
              ref={(el) => { textRefs.current[1] = el; }}
              className="text-offwhite/80 text-lg leading-relaxed"
            >
              The food truck idea has been her dream for some time. She wanted to take her passion on the road, creating a cozy space where people could grab an expertly brewed coffee and a freshly baked treat to start their day right.
            </p>
          </div>

          <div className="space-y-8">
            <p
              ref={(el) => { textRefs.current[3] = el; }}
              className="text-offwhite/80 text-lg leading-relaxed"
            >
              Today, Dani's Kitchen is a reality. We serve an array of freshly baked goods, hearty toasties, and specialty coffee. Every item is made with the same love and attention to detail that Dani pours into all her creations.
            </p>
            <div className="flex items-center gap-4 pt-4">
              <span className="font-accent text-text-yellow text-2xl">Dani's Kitchen</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
