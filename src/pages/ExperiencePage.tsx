import FadeIn from '../components/FadeIn';
import PageHeader from '../components/PageHeader';
import ProjectImage from '../components/ProjectImage';
import Sheet from '../components/Sheet';
import { BRAND_GRADIENT } from '../constants';
import { experience } from '../data/experience';
import { usePageTitle } from '../hooks/usePageTitle';
import EducationSection from '../sections/EducationSection';

export default function ExperiencePage() {
  usePageTitle('Experience');
  return (
    <>
      <PageHeader
        eyebrow="Experience"
        title="Experience"
        intro="From enterprise solution architecture and AI agents to backend APIs, blockchain and game development."
      />

      <Sheet z="z-10">
        <ol className="mx-auto max-w-6xl">
          {experience.map((job, i) => (
            <FadeIn
              as="li"
              key={`${job.role}-${job.dates}`}
              className="grid gap-6 py-10 sm:py-14 md:grid-cols-[minmax(0,320px)_1fr] md:gap-12"
              style={{ borderTop: i === 0 ? 'none' : '1px solid rgba(12,12,12,0.15)' }}
            >
              <ProjectImage image={job.image} icon={job.icon} className="h-52 w-full sm:h-64 md:h-full md:min-h-[260px]" />
              <div>
                <div className="flex items-start gap-4 sm:gap-6">
                  <span className="font-black leading-none" style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>
                    {job.number}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-widest opacity-60 sm:text-sm">
                      {job.company}
                      {job.location && ` -- ${job.location}`}
                    </p>
                    <h2 className="mt-1 font-medium uppercase leading-tight" style={{ fontSize: 'clamp(1.2rem, 2.4vw, 2.1rem)' }}>
                      {job.role}
                    </h2>
                    <p className="mt-1 flex flex-wrap items-center gap-2 text-xs font-light uppercase tracking-wider sm:text-sm">
                      <span className="opacity-60">{job.dates}</span>
                      {job.current && (
                        <span className="rounded-full px-2.5 py-0.5 text-[10px] font-medium text-white" style={{ background: BRAND_GRADIENT }}>
                          Now
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <ul className="mt-6 flex flex-col gap-3">
                  {job.details.map((d) => (
                    <li key={d} className="flex gap-3 font-light leading-relaxed" style={{ fontSize: 'clamp(0.9rem, 1.3vw, 1.1rem)' }}>
                      <span aria-hidden="true" className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-[#B600A8]" />
                      <span className="opacity-75">{d}</span>
                    </li>
                  ))}
                </ul>
                <ul className="mt-6 flex flex-wrap gap-1.5" aria-label="Technologies">
                  {job.tags.map((tag) => (
                    <li key={tag} className="rounded-full border border-[#0C0C0C]/30 px-3 py-1 text-[10px] uppercase tracking-wider sm:text-xs">
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          ))}
        </ol>
      </Sheet>

      <EducationSection />
    </>
  );
}
