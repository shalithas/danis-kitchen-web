import { ChevronDown } from 'lucide-react';
import content from '../lib/content';

export default function Hero() {
  const scrollDown = () => {
    const el = document.getElementById('story');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      className="relative flex flex-col items-center justify-center"
      style={{
        height: '100vh',
        zIndex: 20,
        pointerEvents: 'none',
      }}
    >
      <div className="text-center px-6" style={{ pointerEvents: 'auto' }}>
        <h1
          className="font-display font-bold uppercase text-offwhite leading-none"
          style={{
            fontSize: 'clamp(2.5rem, 8vw, 7rem)',
            letterSpacing: '0.05em',
            textShadow: '0 4px 30px rgba(0,0,0,0.1)',
          }}
        >
          {content.brand.name.split(' ')[0]}
          <br />
          <span className="text-text-yellow">{content.brand.name.split(' ')[1]}</span>
        </h1>
        <p
          className="mt-6 font-accent text-offwhite/80 text-lg md:text-xl"
          style={{ textShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
        >
          {content.brand.tagline}
        </p>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={scrollDown}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-chevron"
        style={{ pointerEvents: 'auto', zIndex: 20 }}
        aria-label={content.hero.scrollLabel}
      >
        <ChevronDown className="w-8 h-8 text-text-yellow" />
      </button>
    </section>
  );
}
