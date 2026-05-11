import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const MENU_CATEGORIES = [
  {
    title: 'FOOD',
    items: [
      { name: 'Croissant', desc: 'Almond, Chocolate, or Plain', price: '$4.50', tag: 'FRESH BAKED' },
      { name: 'Toasties', desc: 'Ham and cheese', price: '$6.50', tag: null },
      { name: 'Banana Bread', desc: 'Warm slice of homemade banana bread', price: '$4.00', tag: null },
      { name: 'Signature Cookies', desc: 'Choc chip, Almond bliss, Velvet crave, Midnight double chocolate', price: '$3.50', tag: 'SWEET' },
    ],
  },
  {
    title: 'COFFEE',
    items: [
      { name: 'Espresso / Long Black', desc: 'A double shot of our specialty blend', price: '$3.50', tag: null },
      { name: 'Flat White / Cappuccino', desc: 'Perfectly textured milk with espresso', price: '$4.50', tag: 'POPULAR' },
      { name: 'Latte / Mocha', desc: 'Smooth, creamy, and balanced', price: '$4.50', tag: null },
      { name: 'Iced Drinks', desc: 'Iced Latte, Iced Long Black', price: '$5.00', tag: 'COLD' },
      { name: 'Alternatives', desc: 'Chai Latte, Hot Choc', price: '$4.50', tag: null },
    ],
  },
  {
    title: 'MILK OPTIONS',
    items: [
      { name: 'Dairy', desc: 'Full cream, Light, Lactose-free', price: '+$0.00', tag: null },
      { name: 'Plant-Based', desc: 'Oat, Almond, Soy', price: '+$0.50', tag: 'VEGAN' },
    ],
  },
];

export default function MenuStack() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Header animation
      gsap.from(headerRef.current, {
        y: 80,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: headerRef.current,
          start: 'top 80%',
        },
      });

      // Card entrance animations
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.from(card, {
          y: 100,
          opacity: 0,
          scale: 0.95,
          duration: 1,
          delay: i * 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
          },
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="menu"
      ref={sectionRef}
      className="relative py-32 md:py-48 px-6 md:px-12 lg:px-24"
      style={{
        backgroundColor: '#030305',
        backgroundImage: 'url(/images/menu-texture.jpg)',
        backgroundSize: '400px',
        backgroundBlendMode: 'overlay',
        zIndex: 30,
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div ref={headerRef} className="mb-20 md:mb-32 text-center">
          <span className="font-accent text-text-yellow text-xl md:text-2xl block mb-4">
            Must Haves
          </span>
          <h2
            className="font-display font-bold uppercase text-offwhite"
            style={{
              fontSize: 'clamp(3rem, 8vw, 7rem)',
              letterSpacing: '0.05em',
              lineHeight: 1.1,
            }}
          >
            Our Menu
          </h2>
          <div className="mt-8 flex items-center justify-center gap-4">
            <div className="w-12 h-px bg-text-yellow/40" />
            <span className="font-display text-xs uppercase tracking-widest text-offwhite/50">
              Pressed fresh. Served hot.
            </span>
            <div className="w-12 h-px bg-text-yellow/40" />
          </div>
        </div>

        {/* Menu cards - grid layout for accessibility */}
        <div className="space-y-8">
          {MENU_CATEGORIES.map((category, catIndex) => (
            <div
              key={category.title}
              ref={(el) => { cardsRef.current[catIndex] = el; }}
              className="relative"
              style={{
                border: '1px solid #f6ee0040',
                backgroundColor: 'rgba(3, 3, 5, 0.95)',
              }}
            >
              {/* Category title */}
              <div
                className="px-6 md:px-12 py-6"
                style={{ borderBottom: '1px solid #f6ee0030' }}
              >
                <h3
                  className="font-display font-bold uppercase text-text-yellow"
                  style={{
                    fontSize: 'clamp(1.5rem, 4vw, 3rem)',
                    letterSpacing: '0.1em',
                  }}
                >
                  {category.title}
                </h3>
              </div>

              {/* Items grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                {category.items.map((item, itemIndex) => (
                  <div
                    key={item.name}
                    className="group flex items-start justify-between p-6 md:p-8 transition-colors duration-200 hover:bg-white/5"
                    style={{
                      borderBottom: '1px solid #f6ee0010',
                      borderRight: itemIndex % 2 === 0 ? '1px solid #f6ee0010' : 'none',
                    }}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-display font-semibold text-offwhite text-lg group-hover:text-text-yellow transition-colors duration-200">
                          {item.name}
                        </span>
                        {item.tag && (
                          <span
                            className="font-display text-[10px] uppercase tracking-widest px-2 py-0.5"
                            style={{
                              color: '#f6ee00',
                              border: '1px solid #f6ee0060',
                            }}
                          >
                            {item.tag}
                          </span>
                        )}
                      </div>
                      <p className="text-offwhite/50 text-sm">{item.desc}</p>
                    </div>
                    <span className="font-display font-bold text-text-yellow text-lg ml-4">
                      {item.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Order CTA */}
        <div className="mt-20 text-center">
          <p className="text-offwhite/60 mb-6 font-body">
            All tacos served on handmade flour or corn tortillas. Gluten-free available.
          </p>
          <button className="btn-pill btn-yellow text-sm">
            Order Online Now
          </button>
        </div>
      </div>
    </section>
  );
}
