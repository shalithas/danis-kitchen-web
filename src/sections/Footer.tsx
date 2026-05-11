import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Instagram, Twitter, Facebook, Mail, Phone } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const ctx = gsap.context(() => {
      if (textRef.current) {
        gsap.from(textRef.current, {
          y: 60,
          opacity: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: footer,
            start: 'top 80%',
          },
        });
      }
    }, footer);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      id="contact"
      ref={footerRef}
      className="relative py-24 md:py-40 px-6 md:px-12 lg:px-24 overflow-hidden"
      style={{ backgroundColor: '#030305', zIndex: 30 }}
    >
      {/* Giant repeating text */}
      <div ref={textRef} className="overflow-hidden mb-20 select-none pointer-events-none">
        <div
          className="font-display font-bold uppercase whitespace-nowrap"
          style={{
            fontSize: 'clamp(4rem, 12vw, 10rem)',
            color: 'transparent',
            WebkitTextStroke: '1px rgba(246, 238, 0, 0.15)',
            lineHeight: 1,
            letterSpacing: '0.05em',
          }}
        >
          DANI'S KITCHEN &mdash; DANI'S KITCHEN &mdash; DANI'S KITCHEN &mdash;
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <h3
              className="font-display font-bold uppercase text-text-yellow mb-4"
              style={{ letterSpacing: '0.15em', fontSize: '1.5rem' }}
            >
              Dani's Kitchen
            </h3>
            <p className="text-offwhite/50 text-sm leading-relaxed mb-6">
              Fresh coffee and artisanal baked goods, served from our truck to your hands.
              Austin-born, flavor-obsessed.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-xs uppercase tracking-widest text-offwhite/40 mb-4">
              Navigate
            </h4>
            <ul className="space-y-3">
              {['About', 'Menu', 'Locations', 'Order Online', 'Catering'].map((link) => (
                <li key={link}>
                  <button
                    onClick={() => {
                      const id = link.toLowerCase().replace(/\s+/g, '-').replace('order-online', 'menu');
                      const el = document.getElementById(id === 'order-online' ? 'menu' : id);
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-offwhite/60 hover:text-text-yellow transition-colors duration-200 text-sm"
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-xs uppercase tracking-widest text-offwhite/40 mb-4">
              Contact
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="tel:+15125551234"
                  className="flex items-center gap-2 text-offwhite/60 hover:text-text-yellow transition-colors duration-200 text-sm"
                >
                  <Phone className="w-4 h-4" />
                  (512) 555-1234
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@daniskitchen.com"
                  className="flex items-center gap-2 text-offwhite/60 hover:text-text-yellow transition-colors duration-200 text-sm"
                >
                  <Mail className="w-4 h-4" />
                  hello@daniskitchen.com
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-display text-xs uppercase tracking-widest text-offwhite/40 mb-4">
              Follow Dani
            </h4>
            <div className="flex items-center gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-offwhite/60 hover:text-text-yellow transition-colors duration-200"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-offwhite/60 hover:text-text-yellow transition-colors duration-200"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-offwhite/60 hover:text-text-yellow transition-colors duration-200"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
            <p className="mt-4 font-accent text-text-yellow text-sm">
              #DanisKitchen
            </p>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-16 pt-12" style={{ borderTop: '1px solid #f6ee0015' }}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h4 className="font-display font-semibold text-offwhite uppercase tracking-wide text-sm mb-1">
                Get the Weekly Schedule
              </h4>
              <p className="text-offwhite/40 text-sm">
                Know where we are before everyone else does.
              </p>
            </div>
            <form
              className="flex gap-3 w-full md:w-auto"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="your@email.com"
                className="px-4 py-3 bg-transparent text-offwhite font-body text-sm focus:outline-none focus:ring-1 focus:ring-text-yellow flex-1 md:w-64"
                style={{ border: '1px solid #f6ee0030' }}
              />
              <button type="submit" className="btn-pill btn-yellow text-xs whitespace-nowrap">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderTop: '1px solid #f6ee0010' }}>
          <p className="text-offwhite/30 text-xs">
            &copy; {new Date().getFullYear()} Dani's Kitchen. All rights reserved.
          </p>
          <p className="text-offwhite/30 text-xs">
            Austin, Texas
          </p>
        </div>
      </div>
    </footer>
  );
}
