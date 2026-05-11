import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Clock } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const SCHEDULE = [
  { day: 'Monday', time: '7:00 AM - 2:00 PM', location: 'Rainey Street (near Craft Pride)', address: '61 Rainey St, Austin, TX 78701' },
  { day: 'Tuesday', time: '7:00 AM - 2:00 PM', location: 'South Congress (near Jo\'s Coffee)', address: '1300 S Congress Ave, Austin, TX 78704' },
  { day: 'Wednesday', time: '7:00 AM - 2:00 PM', location: 'East 6th Street (near Whisler\'s)', address: '1816 E 6th St, Austin, TX 78702' },
  { day: 'Thursday', time: '7:00 AM - 2:00 PM', location: 'Barton Springs (near Zilker Park)', address: '2100 Barton Springs Rd, Austin, TX 78704' },
  { day: 'Friday', time: '7:00 AM - 3:00 PM', location: 'Rainey Street (Weekend Special)', address: '61 Rainey St, Austin, TX 78701' },
  { day: 'Saturday', time: '8:00 AM - 3:00 PM', location: 'Farmers Market at Mueller', address: '4209 Airport Blvd, Austin, TX 78722' },
  { day: 'Sunday', time: 'CLOSED', location: 'Family Day', address: '' },
];

export default function Location() {
  const showLocation = false; // TODO: Make this authorable (show/hide) from a CMS or config

  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const todayRef = useRef<HTMLDivElement>(null);
  const rowsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!showLocation) return;
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.from(headingRef.current, {
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
        },
      });

      gsap.from(todayRef.current, {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: todayRef.current,
          start: 'top 80%',
        },
      });

      rowsRef.current.forEach((row, i) => {
        if (!row) return;
        gsap.from(row, {
          x: -40,
          opacity: 0,
          duration: 0.8,
          delay: i * 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: row,
            start: 'top 90%',
          },
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const today = new Date().getDay();
  const todaySchedule = SCHEDULE[today === 0 ? 6 : today - 1];

  if (!showLocation) return null;

  return (
    <section
      id="location"
      ref={sectionRef}
      className="relative py-32 md:py-48 px-6 md:px-12 lg:px-24"
      style={{ backgroundColor: '#f7f6f2', zIndex: 30 }}
    >
      <div className="max-w-7xl mx-auto">
        <h2
          ref={headingRef}
          className="font-display font-bold uppercase mb-16 md:mb-24"
          style={{
            fontSize: 'clamp(3rem, 8vw, 7rem)',
            color: '#030305',
            letterSpacing: '0.05em',
            lineHeight: 1.1,
          }}
        >
          Join the Hustle
        </h2>

        {/* Today's location highlight */}
        <div
          ref={todayRef}
          className="mb-16 p-8 md:p-12"
          style={{
            border: '2px solid #f6ee00',
            backgroundColor: '#030305',
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="font-display text-xs uppercase tracking-widest text-text-yellow">
              Today&apos;s Location
            </span>
            <div className="w-2 h-2 rounded-full bg-primary-red animate-pulse" />
          </div>
          <h3 className="font-display font-bold text-2xl md:text-4xl text-offwhite uppercase tracking-wide mb-2">
            {todaySchedule.location}
          </h3>
          <div className="flex items-center gap-6 text-offwhite/70">
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-text-yellow" />
              {todaySchedule.time}
            </span>
            {todaySchedule.address && (
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-text-yellow" />
                {todaySchedule.address}
              </span>
            )}
          </div>
        </div>

        {/* Schedule grid */}
        <div className="grid grid-cols-1 gap-0">
          {/* Header */}
          <div
            className="hidden md:grid grid-cols-12 gap-4 py-4 px-4"
            style={{ borderBottom: '1px solid #03030520' }}
          >
            <span className="col-span-2 font-display text-xs uppercase tracking-widest text-offwhite/50" style={{ color: '#03030560' }}>
              Day
            </span>
            <span className="col-span-3 font-display text-xs uppercase tracking-widest text-offwhite/50" style={{ color: '#03030560' }}>
              Hours
            </span>
            <span className="col-span-4 font-display text-xs uppercase tracking-widest text-offwhite/50" style={{ color: '#03030560' }}>
              Location
            </span>
            <span className="col-span-3 font-display text-xs uppercase tracking-widest text-offwhite/50" style={{ color: '#03030560' }}>
              Address
            </span>
          </div>

          {/* Rows */}
          {SCHEDULE.map((item, i) => (
            <div
              key={item.day}
              ref={(el) => { rowsRef.current[i] = el; }}
              className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 py-6 px-4 transition-colors duration-200 hover:bg-black/5"
              style={{ borderBottom: '1px solid #03030515' }}
            >
              <span
                className="col-span-2 font-display font-semibold uppercase tracking-wide"
                style={{ color: '#030305' }}
              >
                {item.day}
              </span>
              <span className="col-span-3 text-sm" style={{ color: '#03030590' }}>
                {item.time}
              </span>
              <span className="col-span-4 location-link font-medium cursor-default" style={{ color: '#030305' }}>
                {item.location}
              </span>
              <span className="col-span-3 text-sm" style={{ color: '#03030570' }}>
                {item.address || '-'}
              </span>
            </div>
          ))}
        </div>

        {/* Map embed placeholder */}
        <div className="mt-16 overflow-hidden" style={{ height: '400px', backgroundColor: '#e8e7e3' }}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d220448.684064075!2d-97.8934853392578!3d30.30798271068981!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8644b599a0cc032f%3A0x5d9b464bd469d57a!2sAustin%2C%20TX!5e0!3m2!1sen!2sus!4v1699900000000!5m2!1sen!2sus"
            width="100%"
            height="100%"
            style={{ border: 0, filter: 'grayscale(100%) contrast(1.2)' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Side Hustle Locations"
          />
        </div>
      </div>
    </section>
  );
}
