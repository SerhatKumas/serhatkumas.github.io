import { ArrowLeft } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { PURPLE_GLOW } from '../constants';
import FadeIn from './FadeIn';
import Navbar from './Navbar';

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  intro: string;
  children?: ReactNode;
};

/** Dark top section of every detail page: navbar, breadcrumb, giant title and intro. */
export default function PageHeader({ eyebrow, title, intro, children }: PageHeaderProps) {
  return (
    <header id="home" className="relative overflow-hidden pb-24 sm:pb-28 md:pb-36">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[60%] aspect-square w-[120vw] max-w-[1200px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{ background: PURPLE_GLOW }}
      />
      <Navbar />
      <div className="relative mx-auto flex max-w-6xl flex-col items-center px-5 pt-16 text-center sm:px-8 sm:pt-20 md:px-10 md:pt-24">
        <FadeIn immediate delay={0.1} y={20}>
          <Link
            to="/"
            className="group relative -mx-4 -my-3 inline-flex cursor-pointer select-none items-center gap-2 px-4 py-3 text-xs font-light uppercase tracking-widest text-[#D7E2EA] opacity-60 transition-opacity hover:opacity-100 before:absolute before:-inset-2 before:content-[''] sm:text-sm"
          >
            <ArrowLeft size={14} aria-hidden="true" className="transition-transform duration-200 group-hover:-translate-x-1" />
            <span>Home / {eyebrow}</span>
          </Link>
        </FadeIn>
        <FadeIn immediate delay={0.2} y={40}>
          <h1
            className="hero-heading mt-6 font-black uppercase leading-[0.9] tracking-tight"
            style={{ fontSize: 'clamp(3rem, 13vw, 200px)' }}
          >
            {title}
          </h1>
        </FadeIn>
        <FadeIn immediate delay={0.35} y={20}>
          <p
            className="mt-8 max-w-[640px] font-light text-[#D7E2EA] opacity-80"
            style={{ fontSize: 'clamp(1rem, 1.6vw, 1.3rem)' }}
          >
            {intro}
          </p>
        </FadeIn>
        {children}
      </div>
    </header>
  );
}
