import type { LucideIcon } from 'lucide-react';

type GhostButtonProps = {
  href: string;
  label: string;
  icon: LucideIcon;
  /** 'dark' = light outline for dark backgrounds, 'light' = dark outline for white backgrounds. */
  tone?: 'dark' | 'light';
};

/** Outline pill link to an external page (GitHub, live demo). */
export default function GhostButton({ href, label, icon: Icon, tone = 'dark' }: GhostButtonProps) {
  const colors =
    tone === 'dark'
      ? 'border-[#D7E2EA] text-[#D7E2EA] hover:bg-[#D7E2EA]/10'
      : 'border-[#0C0C0C] text-[#0C0C0C] hover:bg-[#0C0C0C]/5';
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border-2 px-6 py-3 text-xs font-medium uppercase tracking-widest transition-colors duration-200 sm:px-8 sm:py-3.5 sm:text-sm ${colors}`}
    >
      <Icon size={18} aria-hidden="true" />
      {label}
    </a>
  );
}
