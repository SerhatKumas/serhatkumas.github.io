import type { ReactNode } from 'react';

type SheetProps = {
  tone?: 'light' | 'dark';
  /** Stacking order; each later sheet needs a higher one so its rounded top overlaps the previous. */
  z: 'z-10' | 'z-20' | 'z-30' | 'z-40';
  id?: string;
  className?: string;
  children: ReactNode;
};

/** Rounded-top content panel that slides over the section before it (used on detail pages). */
export default function Sheet({ tone = 'light', z, id, className = '', children }: SheetProps) {
  const colors = tone === 'light' ? 'bg-white text-[#0C0C0C]' : 'bg-[#0C0C0C] text-[#D7E2EA]';
  return (
    <section
      id={id}
      className={`relative ${z} -mt-10 rounded-t-[40px] px-5 py-20 sm:-mt-12 sm:rounded-t-[50px] sm:px-8 sm:py-24 md:-mt-14 md:rounded-t-[60px] md:px-10 md:py-32 ${colors} ${className}`}
    >
      {children}
    </section>
  );
}
