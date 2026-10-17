import { ArrowUpRight } from 'lucide-react';
import { BRAND_GRADIENT } from '../constants';
import type { Venture } from '../data/ventures';

/** One venture. Template entries (placeholder: true) render as a dashed "coming soon" card. */
export default function VentureCard({ venture }: { venture: Venture }) {
  const Icon = venture.icon;

  if (venture.placeholder) {
    return (
      <div className="flex h-full flex-col rounded-[30px] border-2 border-dashed border-[#0C0C0C]/25 p-6 sm:p-8">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0C0C0C]/5">
          <Icon size={26} strokeWidth={1.5} aria-hidden="true" className="opacity-40" />
        </span>
        <span className="mt-6 self-start rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-white sm:text-xs" style={{ background: BRAND_GRADIENT }}>
          Coming soon
        </span>
        <h3 className="mt-4 font-medium uppercase leading-tight opacity-40" style={{ fontSize: 'clamp(1.2rem, 2vw, 1.6rem)' }}>
          {venture.name}
        </h3>
        <p className="mt-2 font-light leading-relaxed opacity-40">Details about this venture are on their way.</p>
      </div>
    );
  }

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[30px] border-2 border-[#0C0C0C] bg-white">
      {venture.image && <img src={venture.image.src} alt={venture.image.alt} loading="lazy" className="h-48 w-full object-cover" />}
      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-full text-white" style={{ background: BRAND_GRADIENT }}>
            <Icon size={26} strokeWidth={1.5} aria-hidden="true" />
          </span>
          <span className="rounded-full border border-[#0C0C0C]/30 px-3 py-1 text-[10px] uppercase tracking-widest sm:text-xs">{venture.status}</span>
        </div>
        <p className="mt-6 text-xs uppercase tracking-widest opacity-60">
          {venture.role} -- {venture.year}
        </p>
        <h3 className="mt-2 font-medium uppercase leading-tight" style={{ fontSize: 'clamp(1.2rem, 2vw, 1.6rem)' }}>
          {venture.name}
        </h3>
        <p className="mt-1 font-medium opacity-80">{venture.tagline}</p>
        <p className="mt-3 font-light leading-relaxed opacity-60">{venture.description}</p>
        <ul className="mt-5 flex flex-wrap gap-1.5">
          {venture.tags.map((tag) => (
            <li key={tag} className="rounded-full border border-[#0C0C0C]/30 px-3 py-1 text-[10px] uppercase tracking-wider sm:text-xs">
              {tag}
            </li>
          ))}
        </ul>
        {venture.link && (
          <a
            href={venture.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-medium uppercase tracking-widest hover:opacity-70"
          >
            Visit <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        )}
      </div>
    </article>
  );
}
