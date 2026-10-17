import { Check } from 'lucide-react';
import { BRAND_GRADIENT } from '../constants';
import type { Service } from '../data/services';

type ServiceCardProps = {
  service: Service;
  number: number;
  /** 'light' = card on a white section, 'dark' = card on a dark section. */
  tone?: 'light' | 'dark';
  className?: string;
};

/** Detailed service card for the Services page. */
export default function ServiceCard({ service, number, tone = 'light', className = '' }: ServiceCardProps) {
  const Icon = service.icon;
  const border = tone === 'light' ? 'border-[#0C0C0C]' : 'border-[#D7E2EA]/30 hover:border-[#D7E2EA]';
  const label = String(number).padStart(2, '0');

  return (
    <div className={`group flex h-full flex-col rounded-[30px] border-2 p-6 transition-colors duration-200 sm:p-8 md:rounded-[40px] md:p-10 ${border} ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <span className={`relative font-black leading-none ${tone === 'dark' ? 'hero-heading' : ''}`} style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>
          <span className="transition-opacity duration-300 group-hover:opacity-0">{label}</span>
          <span aria-hidden="true" className="gradient-text absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {label}
          </span>
        </span>
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-white" style={{ background: BRAND_GRADIENT }}>
          <Icon size={26} strokeWidth={1.5} aria-hidden="true" />
        </span>
      </div>
      <h3 className="mt-6 font-medium uppercase leading-tight" style={{ fontSize: 'clamp(1.2rem, 2.2vw, 1.9rem)' }}>
        {service.name}
      </h3>
      <p className={`mt-3 font-light leading-relaxed ${tone === 'light' ? 'opacity-60' : 'opacity-70'}`} style={{ fontSize: 'clamp(0.9rem, 1.4vw, 1.1rem)' }}>
        {service.description}
      </p>
      <ul className="mt-6 flex flex-col gap-2.5">
        {service.deliverables.map((d) => (
          <li key={d} className="flex items-start gap-3 font-light">
            <Check size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-[#B600A8]" />
            {d}
          </li>
        ))}
      </ul>
    </div>
  );
}
