import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Truck, Users, Calendar, Utensils } from 'lucide-react';
import content from '../lib/content';

gsap.registerPlugin(ScrollTrigger);

const FEATURE_ICONS = [Truck, Users, Calendar, Utensils];

export default function Catering() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const formRef = useRef<HTMLFormElement>(null);

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

      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.from(card, {
          y: 50,
          opacity: 0,
          duration: 0.8,
          delay: i * 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
          },
        });
      });

      gsap.from(formRef.current, {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: formRef.current,
          start: 'top 85%',
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="catering"
      ref={sectionRef}
      className="relative py-32 md:py-48 px-6 md:px-12 lg:px-24"
      style={{ backgroundColor: '#030305', zIndex: 30 }}
    >
      <div className="max-w-7xl mx-auto">
        <h2
          ref={headingRef}
          className="font-serif text-text-yellow mb-6"
          style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', lineHeight: 1.1 }}
        >
          {content.catering.title}
        </h2>
        <p className="text-offwhite/60 text-lg max-w-2xl mb-16">
          {content.catering.description}
        </p>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {content.catering.features.map((feature, i) => {
            const Icon = FEATURE_ICONS[i];
            return (
              <div
                key={feature.label}
                ref={(el) => { cardsRef.current[i] = el; }}
                className="p-6 transition-colors duration-200 hover:bg-white/5"
                style={{ border: '1px solid var(--text-yellow)' }}
              >
                <Icon className="w-8 h-8 text-text-yellow mb-4" />
                <h4 className="font-display font-semibold text-offwhite uppercase tracking-wide text-sm mb-2">
                  {feature.label}
                </h4>
                <p className="text-offwhite/50 text-sm">{feature.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Enquiry form */}
        <form
          ref={formRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl"
          onSubmit={(e) => e.preventDefault()}
        >
          <div>
            <label className="font-display text-xs uppercase tracking-widest text-offwhite/50 block mb-2">
              {content.catering.form.labels.name}
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-transparent text-offwhite font-body focus:outline-none focus:ring-1 focus:ring-text-yellow border border-border"
              placeholder={content.catering.form.placeholders.name}
            />
          </div>
          <div>
            <label className="font-display text-xs uppercase tracking-widest text-offwhite/50 block mb-2">
              {content.catering.form.labels.email}
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 bg-transparent text-offwhite font-body focus:outline-none focus:ring-1 focus:ring-text-yellow border border-border"
              placeholder={content.catering.form.placeholders.email}
            />
          </div>
          <div>
            <label className="font-display text-xs uppercase tracking-widest text-offwhite/50 block mb-2">
              {content.catering.form.labels.phone}
            </label>
            <input
              type="tel"
              className="w-full px-4 py-3 bg-transparent text-offwhite font-body focus:outline-none focus:ring-1 focus:ring-text-yellow border border-border"
              placeholder={content.catering.form.placeholders.phone}
            />
          </div>
          <div>
            <label className="font-display text-xs uppercase tracking-widest text-offwhite/50 block mb-2">
              {content.catering.form.labels.date}
            </label>
            <input
              type="date"
              className="w-full px-4 py-3 bg-transparent text-offwhite font-body focus:outline-none focus:ring-1 focus:ring-text-yellow border border-border"
            />
          </div>
          <div className="md:col-span-2 flex items-center gap-3">
            <input
              type="checkbox"
              id="privateEvent"
              className="w-5 h-5 accent-text-yellow"
            />
            <label htmlFor="privateEvent" className="font-display text-sm text-offwhite/80 cursor-pointer">
              {content.catering.form.labels.privateEvent}
            </label>
          </div>
          <div className="md:col-span-2">
            <label className="font-display text-xs uppercase tracking-widest text-offwhite/50 block mb-2">
              {content.catering.form.labels.details}
            </label>
            <textarea
              rows={4}
              className="w-full px-4 py-3 bg-transparent text-offwhite font-body focus:outline-none focus:ring-1 focus:ring-text-yellow resize-none border border-border"
              placeholder={content.catering.form.placeholders.details}
            />
          </div>
          <div className="md:col-span-2">
            <button type="submit" className="btn-pill btn-yellow text-sm">
              {content.catering.form.buttonText}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
