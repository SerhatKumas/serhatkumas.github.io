import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

type MoreLinkProps = {
  to: string;
  label: string;
  /** 'dark' for dark backgrounds, 'light' for white ones. */
  tone?: 'dark' | 'light';
  className?: string;
};

/** "See more" link from a home-page section to its detail page. */
export default function MoreLink({ to, label, tone = 'dark', className = '' }: MoreLinkProps) {
  const colors = tone === 'dark' ? 'text-[#D7E2EA] border-[#D7E2EA]/40 hover:border-[#D7E2EA]' : 'text-[#0C0C0C] border-[#0C0C0C]/30 hover:border-[#0C0C0C]';
  return (
    <Link
      to={to}
      className={`group inline-flex items-center gap-3 rounded-full border-2 py-3 pl-6 pr-3 text-xs font-medium uppercase tracking-widest transition-colors duration-200 sm:text-sm ${colors} ${className}`}
    >
      {label}
      <span
        aria-hidden="true"
        className="flex h-8 w-8 items-center justify-center rounded-full text-white transition-transform duration-300 group-hover:translate-x-1"
        style={{ background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)' }}
      >
        <ArrowRight size={16} />
      </span>
    </Link>
  );
}
