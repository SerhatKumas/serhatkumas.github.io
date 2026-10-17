import { Check, ExternalLink, Github } from 'lucide-react';
import FadeIn from '../components/FadeIn';
import GhostButton from '../components/GhostButton';
import GitHubCta from '../components/GitHubCta';
import PageHeader from '../components/PageHeader';
import ProjectImage from '../components/ProjectImage';
import Sheet from '../components/Sheet';
import { projects } from '../data/projects';
import { usePageTitle } from '../hooks/usePageTitle';

export default function ProjectsPage() {
  usePageTitle('Projects');
  return (
    <>
      <PageHeader
        eyebrow="Projects"
        title="Projects"
        intro="Open-source work from my GitHub: AI engineering, conversational AI and interactive 3D on the web. My client work is internal; you'll find it under Experience."
      />

      <Sheet z="z-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-10 md:gap-16">
          {projects.map((project) => {
            const [first, second, tall] = project.images;
            return (
              <FadeIn
                as="article"
                key={project.slug}
                id={project.slug}
                className="rounded-[40px] bg-[#0C0C0C] p-4 text-[#D7E2EA] sm:rounded-[50px] sm:p-6 md:rounded-[60px] md:p-10"
              >
                <div className="flex flex-wrap items-center justify-between gap-6 px-2 pt-2 sm:px-4">
                  <div className="flex min-w-0 items-center gap-4 sm:gap-6 md:gap-8">
                    <span className="hero-heading shrink-0 font-black leading-none" style={{ fontSize: 'clamp(3rem, 9vw, 120px)' }}>
                      {project.number}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-widest opacity-60 sm:text-sm">{project.category}</p>
                      <h2 className="mt-1 font-medium uppercase leading-tight" style={{ fontSize: 'clamp(1.3rem, 2.8vw, 2.6rem)' }}>
                        {project.name}
                      </h2>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <GhostButton href={project.repo} label="View code" icon={Github} />
                    {project.live && <GhostButton href={project.live} label="Live site" icon={ExternalLink} />}
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-[1.5fr_1fr] sm:gap-4">
                  <ProjectImage image={tall} icon={project.icon} className="h-[clamp(220px,34vw,520px)] w-full" />
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-1 sm:gap-4">
                    <ProjectImage image={first} icon={project.icon} className="h-[clamp(130px,16.5vw,252px)] w-full" />
                    <ProjectImage image={second} icon={project.icon} className="h-[clamp(130px,16.5vw,252px)] w-full" />
                  </div>
                </div>

                <div className="grid gap-10 px-2 pb-2 pt-10 sm:px-4 md:grid-cols-[1.4fr_1fr] md:gap-16 md:pt-14">
                  <div>
                    <h3 className="text-xs uppercase tracking-widest opacity-60 sm:text-sm">Overview</h3>
                    <p className="mt-4 font-light leading-relaxed opacity-85" style={{ fontSize: 'clamp(1rem, 1.4vw, 1.15rem)' }}>
                      {project.overview}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xs uppercase tracking-widest opacity-60 sm:text-sm">Highlights</h3>
                    <ul className="mt-4 flex flex-col gap-3">
                      {project.features.map((f) => (
                        <li key={f} className="flex items-start gap-3 font-light leading-relaxed">
                          <Check size={18} aria-hidden="true" className="mt-1 shrink-0 text-[#B600A8]" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <ul className="mt-6 flex flex-wrap gap-1.5" aria-label="Technologies">
                      {project.tags.map((tag) => (
                        <li key={tag} className="rounded-full px-3 py-1 text-[10px] uppercase tracking-wider sm:text-xs" style={{ border: '1px solid rgba(215,226,234,0.3)' }}>
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </Sheet>

      <Sheet tone="dark" z="z-20" className="!pt-10 sm:!pt-14 md:!pt-16">
        <GitHubCta />
      </Sheet>
    </>
  );
}
