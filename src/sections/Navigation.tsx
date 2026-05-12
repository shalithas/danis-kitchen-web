import { useEffect, useRef, useState } from 'react';
import content from '../lib/content';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 w-full transition-all duration-300"
      style={{
        zIndex: 50,
        backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
        borderBottom: scrolled ? '1px solid rgba(246, 238, 0, 0.1)' : '1px solid transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        boxShadow: scrolled ? '0 20px 40px rgba(0,0,0,0.8)' : 'none',
      }}
    >
      <div className="flex items-center justify-between px-6 md:px-12 py-4">
        {/* Left nav */}
        <div className="hidden md:flex items-center gap-6">
          {content.navigation.links.slice(0, 3).map((link) => (
            <button
              key={link}
              onClick={() => scrollTo(link.toLowerCase().replace(/\s+/g, '-'))}
              className="font-display text-xs uppercase tracking-widest text-offwhite/70 hover:text-text-yellow transition-colors duration-200"
            >
              {link}
            </button>
          ))}
        </div>

        {/* Center logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="font-display text-lg md:text-2xl font-bold uppercase tracking-widest text-text-yellow"
          style={{ letterSpacing: '0.15em' }}
        >
          {content.brand.name}
        </button>

        {/* Right nav */}
        <div className="hidden md:flex items-center gap-6">
          {content.navigation.links.slice(3).map((link) => (
            <button
              key={link}
              onClick={() => scrollTo(link.toLowerCase().replace(/\s+/g, '-').replace('order-online', 'menu'))}
              className="font-display text-xs uppercase tracking-widest text-offwhite/70 hover:text-text-yellow transition-colors duration-200"
            >
              {link}
            </button>
          ))}
          <button
            onClick={() => scrollTo('menu')}
            className="btn-pill btn-yellow text-xs"
          >
            {content.navigation.buttons.orderNow}
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => scrollTo('menu')}
          className="md:hidden btn-pill btn-yellow text-xs px-4 py-2"
        >
          {content.navigation.buttons.order}
        </button>
      </div>
    </nav>
  );
}
