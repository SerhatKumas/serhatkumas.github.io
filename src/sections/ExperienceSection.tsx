import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useRef } from 'react';
import { useCardStack } from '../hooks/useCardStack';
import FadeIn from '../components/FadeIn';
import MoreLink from '../components/MoreLink';
import ProjectImage from '../components/ProjectImage';
import { BRAND_GRADIENT } from '../constants';
import { experience, type Experience } from '../data/experience';

type ExperienceCardProps = {
  job: Experience;
  index: number;
  total: number;
  progress: MotionValue<number>;
};

function ExperienceCard({ job, index, total, progress }: ExperienceCardProps) {
  const targetScale = 1 - (total - 1 - index) * 0.03;
  const scale = useTransform(progress, [index / total, 1], [1, targetScale]);

  return (
    <div className="sticky top-24 mb-8 md:top-32 md:mb-[10vh]">
      <motion.article
        data-stack-card
        className="relative flex origin-top flex-col gap-6 rounded-[40px] border-2 border-[#0C0C0C] bg-white p-5 sm:rounded-[50px] sm:p-6 md:rounded-[60px] md:p-8"
        style={{ scale }}
      >
        <div className="flex items-center gap-4 px-1 sm:gap-6 sm:px-4 md:gap-8">
          <span className="shrink-0 font-black leading-none" style={{ fontSize: 'clamp(3rem, 10vw, 140px)', minWidth: '1.3em' }}>
            {job.number}
          </span>
          <div className="flex min-w-0 flex-col gap-1.5">
            <span className="text-xs uppercase tracking-widest opacity-60 sm:text-sm">
              {job.company}
              {job.location && ` -- ${job.location}`}
            </span>
            <h3 className="font-medium uppercase leading-tight" style={{ fontSize: 'clamp(1.1rem, 2.4vw, 2.2rem)' }}>
              {job.role}
            </h3>
            <span className="flex flex-wrap items-center gap-2 text-xs font-light uppercase tracking-wider sm:text-sm">
              <span className="opacity-60">{job.dates}</span>
              {job.current && (
                <span className="rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase text-white" style={{ background: BRAND_GRADIENT }}>
                  Now
                </span>
              )}
            </span>
          </div>
        </div>

        <div className="flex flex-1 gap-3 sm:gap-4">
          <div className="flex flex-1 flex-col justify-between gap-6 rounded-[30px] p-5 sm:rounded-[40px] sm:p-8" style={{ background: '#F2F4F6' }}>
            <ul className="flex flex-col gap-3">
              {job.highlights.map((h) => (
                <li key={h} className="flex gap-3 font-light leading-relaxed" style={{ fontSize: 'clamp(0.85rem, 1.4vw, 1.1rem)' }}>
                  <span aria-hidden="true" className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-[#B600A8]" />
                  <span className="opacity-70">{h}</span>
                </li>
              ))}
            </ul>
            <ul className="flex flex-wrap gap-1.5" aria-label="Technologies">
              {job.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full px-3 py-1 text-[10px] uppercase tracking-wider sm:text-xs"
                  style={{ border: '1px solid rgba(12,12,12,0.3)' }}
                >
                  {tag}
                </li>
              ))}
            </ul>
          </div>
          <ProjectImage
            image={job.image}
            icon={job.icon}
            className="hidden w-[32%] shrink-0 self-stretch sm:block"
            style={{ minHeight: 'clamp(180px, 20vw, 300px)' }}
          />
        </div>
      </motion.article>
    </div>
  );
}

export default function ExperienceSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });
  useCardStack(containerRef);

  return (
    <section
      id="experience"
      className="relative z-20 -mt-10 rounded-t-[40px] bg-white px-5 pb-20 pt-20 text-[#0C0C0C] sm:-mt-12 sm:rounded-t-[50px] sm:px-8 sm:pt-24 md:-mt-14 md:rounded-t-[60px] md:px-10 md:pt-32"
    >
      <FadeIn y={40}>
        <h2
          className="mb-16 text-center font-black uppercase leading-none tracking-tight sm:mb-20 md:mb-28"
          style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
        >
          Experience
        </h2>
      </FadeIn>

      <div ref={containerRef} className="mx-auto max-w-7xl">
        {experience.map((job, index) => (
          <ExperienceCard key={job.number} job={job} index={index} total={experience.length} progress={scrollYProgress} />
        ))}
      </div>
      <div className="mt-6 flex justify-center">
        <MoreLink to="/experience" label="Full experience" tone="light" />
      </div>
    </section>
  );
}
