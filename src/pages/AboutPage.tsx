import { Users } from 'lucide-react';
import FadeIn from '../components/FadeIn';
import PageHeader from '../components/PageHeader';
import Sheet from '../components/Sheet';
import { BRAND_GRADIENT, PURPLE_GLOW } from '../constants';
import { bio, skills, stats } from '../data/profile';
import { usePageTitle } from '../hooks/usePageTitle';
import EducationSection from '../sections/EducationSection';

const headingStyle = { fontSize: 'clamp(2rem, 5vw, 4rem)' };

export default function AboutPage() {
  usePageTitle('About');
  return (
    <>
      <PageHeader eyebrow="About" title="About me" intro="Solutions Architect, AI engineer and community founder, based in Passau, Germany.">
        <FadeIn immediate delay={0.45} y={20}>
          <dl className="mt-14 flex flex-wrap justify-center gap-8 sm:gap-14">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center">
                <dt className="sr-only">{stat.label}</dt>
                <dd className="hero-heading whitespace-nowrap font-black leading-none" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}>
                  {stat.value}
                </dd>
                <dd aria-hidden="true" className="mt-2 max-w-[140px] text-xs font-light uppercase tracking-wider text-[#D7E2EA] opacity-70 sm:text-sm">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </FadeIn>
      </PageHeader>

      <Sheet z="z-10">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
          <FadeIn>
            <h2 className="font-black uppercase leading-none tracking-tight" style={headingStyle}>
              My story
            </h2>
            <div className="mt-8 flex flex-col gap-5">
              {bio.map((paragraph) => (
                <p key={paragraph.slice(0, 20)} className="font-light leading-relaxed opacity-75" style={{ fontSize: 'clamp(1rem, 1.5vw, 1.2rem)' }}>
                  {paragraph}
                </p>
              ))}
            </div>
          </FadeIn>
          <FadeIn delay={0.15} className="relative mx-auto w-full max-w-[420px]">
            <div className="relative overflow-hidden rounded-[40px] bg-[#0C0C0C] pt-10">
              <div aria-hidden="true" className="absolute left-1/2 top-1/2 aspect-square w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" style={{ background: PURPLE_GLOW }} />
              <img src="/serhat_avatar.png" alt="3D avatar of Serhat Kumas" loading="lazy" className="relative mx-auto block w-[85%]" />
            </div>
          </FadeIn>
        </div>

        <div className="mx-auto mt-24 max-w-6xl md:mt-32">
          <FadeIn>
            <h2 className="font-black uppercase leading-none tracking-tight" style={headingStyle}>
              Skills & tools
            </h2>
          </FadeIn>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {skills.map((group, i) => (
              <FadeIn key={group.group} delay={i * 0.1} className="rounded-[30px] border-2 border-[#0C0C0C] p-6 sm:p-8">
                <h3 className="text-xs font-medium uppercase tracking-widest opacity-60 sm:text-sm">{group.group}</h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li key={item} className="rounded-full border border-[#0C0C0C]/25 px-3.5 py-1.5 text-sm">
                      {item}
                    </li>
                  ))}
                </ul>
              </FadeIn>
            ))}
          </div>
        </div>

        <FadeIn className="mx-auto mt-24 max-w-6xl md:mt-32">
          <div className="relative overflow-hidden rounded-[40px] bg-[#0C0C0C] p-8 text-[#D7E2EA] sm:p-12 md:rounded-[60px] md:p-16">
            <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -right-24 h-96 w-96 rounded-full opacity-40 blur-3xl" style={{ background: BRAND_GRADIENT }} />
            <div className="relative max-w-2xl">
              <span className="flex h-14 w-14 items-center justify-center rounded-full text-white" style={{ background: BRAND_GRADIENT }}>
                <Users size={26} strokeWidth={1.5} aria-hidden="true" />
              </span>
              <p className="mt-8 text-xs uppercase tracking-widest opacity-60 sm:text-sm">Founder</p>
              <h2 className="hero-heading mt-2 font-black uppercase leading-[0.95] tracking-tight" style={headingStyle}>
                GDGoC Passau
              </h2>
              <p className="mt-6 font-light leading-relaxed opacity-80" style={{ fontSize: 'clamp(1rem, 1.5vw, 1.2rem)' }}>
                I started Google Developer Groups on Campus Passau to grow the local developer ecosystem: a place for students to learn
                together, build real projects and connect with the wider tech community through events and technical collaboration.
              </p>
            </div>
          </div>
        </FadeIn>
      </Sheet>

      <EducationSection />
    </>
  );
}
