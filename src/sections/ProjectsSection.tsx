import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import { useRef } from 'react';
import { useCardStack } from '../hooks/useCardStack';
import FadeIn from '../components/FadeIn';
import GhostButton from '../components/GhostButton';
import GitHubCta from '../components/GitHubCta';
import MoreLink from '../components/MoreLink';
import ProjectImage from '../components/ProjectImage';
import { projects, type Project } from '../data/projects';

type ProjectCardProps = {
  project: Project;
  index: number;
  total: number;
  progress: MotionValue<number>;
};

function ProjectCard({ project, index, total, progress }: ProjectCardProps) {
  const targetScale = 1 - (total - 1 - index) * 0.03;
  const scale = useTransform(progress, [index / total, 1], [1, targetScale]);
  const [first, second, tall] = project.images;

  return (
    <div className="sticky top-24 mb-8 md:top-32 md:mb-[10vh]">
      <motion.article
        data-stack-card
        className="relative flex origin-top flex-col gap-4 rounded-[40px] border-2 border-[#D7E2EA] bg-[#0C0C0C] p-4 sm:gap-6 sm:rounded-[50px] sm:p-6 md:rounded-[60px] md:p-8"
        style={{ scale }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4 px-2 sm:flex-nowrap sm:px-4">
          <div className="flex min-w-0 items-center gap-4 sm:gap-6 md:gap-8">
            <span className="hero-heading shrink-0 font-black leading-none" style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}>
              {project.number}
            </span>
            <div className="flex min-w-0 flex-col gap-1.5 text-[#D7E2EA]">
              <span className="text-xs uppercase tracking-widest opacity-60 sm:text-sm">{project.category}</span>
              <h3 className="font-medium uppercase leading-tight" style={{ fontSize: 'clamp(1.1rem, 2.4vw, 2.2rem)' }}>
                {project.name}
              </h3>
              <p className="hidden max-w-2xl font-light opacity-70 sm:block" style={{ fontSize: 'clamp(0.8rem, 1.2vw, 1rem)' }}>
                {project.description}
              </p>
              <ul className="mt-1 flex flex-wrap gap-1.5" aria-label="Technologies">
                {project.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full px-3 py-1 text-[10px] uppercase tracking-wider sm:text-xs"
                    style={{ border: '1px solid rgba(215,226,234,0.3)' }}
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 sm:flex-col sm:items-stretch">
            <GhostButton href={project.repo} label="GitHub" icon={Github} />
            {project.live && <GhostButton href={project.live} label="Live Site" icon={ExternalLink} />}
          </div>
        </div>

        <div className="flex gap-3 sm:gap-4">
          <div className="flex w-[40%] flex-col gap-3 sm:gap-4">
            <ProjectImage image={first} icon={project.icon} className="w-full" style={{ height: 'clamp(130px, 16vw, 230px)' }} />
            <ProjectImage image={second} icon={project.icon} className="w-full" style={{ height: 'clamp(160px, 22vw, 340px)' }} />
          </div>
          <div className="w-[60%]">
            <ProjectImage image={tall} icon={project.icon} className="h-full w-full" />
          </div>
        </div>
      </motion.article>
    </div>
  );
}

export default function ProjectsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });
  useCardStack(containerRef);

  return (
    <section
      id="projects"
      className="relative z-10 -mt-10 rounded-t-[40px] bg-[#0C0C0C] px-5 pb-20 pt-20 sm:-mt-12 sm:rounded-t-[50px] sm:px-8 sm:pt-24 md:-mt-14 md:rounded-t-[60px] md:px-10 md:pt-32"
    >
      <FadeIn y={40}>
        <h2
          className="hero-heading mb-16 text-center font-black uppercase leading-none tracking-tight sm:mb-20 md:mb-28"
          style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
        >
          Projects
        </h2>
      </FadeIn>

      <div ref={containerRef} className="mx-auto max-w-7xl">
        {projects.map((project, index) => (
          <ProjectCard key={project.number} project={project} index={index} total={projects.length} progress={scrollYProgress} />
        ))}
      </div>

      <GitHubCta />
      <div className="mt-10 flex justify-center">
        <MoreLink to="/projects" label="Project details" />
      </div>
    </section>
  );
}
