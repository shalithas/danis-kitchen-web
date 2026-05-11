import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Truck, Users, Calendar, Utensils } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const FEATURES = [
  { icon: Truck, label: 'Food Truck Catering', desc: 'We roll up, fire up the griddle, and serve your guests fresh.' },
  { icon: Users, label: 'Any Size Event', desc: 'From 20-person office lunches to 500-person festivals.' },
  { icon: Calendar, label: 'Flexible Scheduling', desc: 'Book us for breakfast, lunch, dinner, or late-night service.' },
  { icon: Utensils, label: 'Custom Menu', desc: 'Work with our team to craft the perfect menu for your event.' },
];

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
          Book the Truck
        </h2>
        <p className="text-offwhite/60 text-lg max-w-2xl mb-16">
          Bring the Dani's Kitchen experience to your next event. Weddings, corporate mornings,
          or private parties — we handle it all. Fresh coffee and pastries, served on-site.
        </p>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {FEATURES.map((feature, i) => (
            <div
              key={feature.label}
              ref={(el) => { cardsRef.current[i] = el; }}
              className="p-6 transition-colors duration-200 hover:bg-white/5"
              style={{ border: '1px solid var(--text-yellow)' }}
            >
              <feature.icon className="w-8 h-8 text-text-yellow mb-4" />
              <h4 className="font-display font-semibold text-offwhite uppercase tracking-wide text-sm mb-2">
                {feature.label}
              </h4>
              <p className="text-offwhite/50 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Enquiry form */}
        <form
          ref={formRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl"
          onSubmit={(e) => e.preventDefault()}
        >
          <div>
            <label className="font-display text-xs uppercase tracking-widest text-offwhite/50 block mb-2">
              Your Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-transparent text-offwhite font-body focus:outline-none focus:ring-1 focus:ring-text-yellow border border-border"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="font-display text-xs uppercase tracking-widest text-offwhite/50 block mb-2">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 bg-transparent text-offwhite font-body focus:outline-none focus:ring-1 focus:ring-text-yellow border border-border"
              placeholder="john@example.com"
            />
          </div>
          <div>
            <label className="font-display text-xs uppercase tracking-widest text-offwhite/50 block mb-2">
              Contact Number
            </label>
            <input
              type="tel"
              className="w-full px-4 py-3 bg-transparent text-offwhite font-body focus:outline-none focus:ring-1 focus:ring-text-yellow border border-border"
              placeholder="(555) 555-5555"
            />
          </div>
          <div>
            <label className="font-display text-xs uppercase tracking-widest text-offwhite/50 block mb-2">
              Event Date
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
              This is a private event
            </label>
          </div>
          <div className="md:col-span-2">
            <label className="font-display text-xs uppercase tracking-widest text-offwhite/50 block mb-2">
              More Details
            </label>
            <textarea
              rows={4}
              className="w-full px-4 py-3 bg-transparent text-offwhite font-body focus:outline-none focus:ring-1 focus:ring-text-yellow resize-none border border-border"
              placeholder="Guest count, location, special requests..."
            />
          </div>
          <div className="md:col-span-2">
            <button type="submit" className="btn-pill btn-yellow text-sm">
              Send Enquiry
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
