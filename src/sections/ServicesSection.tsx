import { useRef, useState, type KeyboardEvent } from 'react';
import FadeIn from '../components/FadeIn';
import MoreLink from '../components/MoreLink';
import { serviceGroups } from '../data/services';

export default function ServicesSection() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const group = serviceGroups[active];

  // Arrow keys move between tabs (WAI-ARIA tabs pattern).
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const next = (active + (e.key === 'ArrowRight' ? 1 : -1) + serviceGroups.length) % serviceGroups.length;
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <section
      id="services"
      className="rounded-t-[40px] bg-white px-5 py-20 text-[#0C0C0C] sm:rounded-t-[50px] sm:px-8 sm:py-24 md:rounded-t-[60px] md:px-10 md:py-32"
    >
      <FadeIn y={40}>
        <h2 className="text-center font-black uppercase leading-none tracking-tight text-[#0C0C0C]" style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}>
          Services
        </h2>
      </FadeIn>

      <FadeIn delay={0.1} className="mb-12 mt-10 flex justify-center sm:mb-16 md:mb-20">
        <div role="tablist" aria-label="Service types" className="flex w-full max-w-md rounded-full border-2 border-[#0C0C0C] p-1" onKeyDown={onKeyDown}>
          {serviceGroups.map((g, i) => {
            const selected = i === active;
            return (
              <button
                key={g.id}
                ref={(el) => (tabs.current[i] = el)}
                type="button"
                role="tab"
                id={`services-tab-${g.id}`}
                aria-selected={selected}
                aria-controls={`services-panel-${g.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(i)}
                className={`flex-1 whitespace-nowrap rounded-full px-2 py-2.5 text-[11px] font-medium uppercase tracking-wide transition-colors duration-200 min-[360px]:text-xs min-[360px]:tracking-widest sm:px-7 sm:py-3 sm:text-sm ${
                  selected ? 'bg-[#0C0C0C] text-white' : 'text-[#0C0C0C] hover:bg-[#0C0C0C]/5'
                }`}
              >
                {g.shortName}
              </button>
            );
          })}
        </div>
      </FadeIn>

      <div role="tabpanel" id={`services-panel-${group.id}`} aria-labelledby={`services-tab-${group.id}`} className="mx-auto max-w-5xl">
        <p className="mb-4 text-center font-light opacity-60" style={{ fontSize: 'clamp(0.95rem, 1.5vw, 1.2rem)' }}>
          {group.tagline}
        </p>
        <ul key={group.id}>
          {group.services.map((service, i) => (
            <FadeIn
              as="li"
              key={service.name}
              delay={i * 0.08}
              y={20}
              className="group flex items-center gap-5 py-8 sm:gap-8 sm:py-10 md:gap-12 md:py-12"
              style={{ borderTop: i === 0 ? 'none' : '1px solid rgba(12, 12, 12, 0.15)' }}
            >
              <span className="relative shrink-0 font-black leading-none" style={{ fontSize: 'clamp(3rem, 10vw, 140px)', minWidth: '1.3em' }}>
                <span className="transition-opacity duration-300 group-hover:opacity-0">{String(i + 1).padStart(2, '0')}</span>
                <span aria-hidden="true" className="gradient-text absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </span>
              <div className="flex flex-col gap-2">
                <h3 className="font-medium uppercase" style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}>
                  {service.name}
                </h3>
                <p className="max-w-2xl font-light leading-relaxed opacity-60" style={{ fontSize: 'clamp(0.85rem, 1.6vw, 1.25rem)' }}>
                  {service.description}
                </p>
              </div>
            </FadeIn>
          ))}
        </ul>
      </div>

      <div className="mt-10 flex justify-center">
        <MoreLink to={`/services#${group.id}`} label={`All ${group.shortName} services`} tone="light" />
      </div>
    </section>
  );
}
