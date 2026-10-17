import { ArrowDown, Mail } from 'lucide-react';
import ContactButton from '../components/ContactButton';
import FadeIn from '../components/FadeIn';
import PageHeader from '../components/PageHeader';
import Sheet from '../components/Sheet';
import ServiceCard from '../components/ServiceCard';
import { droneUseCases, serviceGroups, type ServiceGroup } from '../data/services';
import { usePageTitle } from '../hooks/usePageTitle';

const headingStyle = { fontSize: 'clamp(2rem, 5vw, 4rem)' };
const DRONE_MAIL = 'mailto:serhatkumas@outlook.com?subject=Drone%20video%20inquiry';

const droneSteps = [
  { title: 'Plan', text: 'We agree on the shots, story and timing; I scout the location and plan a safe flight.' },
  { title: 'Fly', text: 'On-site capture of aerial video and stills, timed for the best light.' },
  { title: 'Edit', text: 'Colour grading, cuts and music into a polished film or short reels.' },
  { title: 'Deliver', text: 'Ready-to-post files in the formats you need, from website to Instagram.' },
];

function GroupIntro({ group, index, tone }: { group: ServiceGroup; index: number; tone: 'light' | 'dark' }) {
  return (
    <FadeIn className="mx-auto mb-12 max-w-6xl md:mb-16">
      <p className="text-xs uppercase tracking-widest opacity-60 sm:text-sm">
        {String(index + 1).padStart(2, '0')} / {group.services.length} services
      </p>
      <h2
        className={`mt-3 font-black uppercase leading-[0.9] tracking-tight ${tone === 'dark' ? 'hero-heading' : ''}`}
        style={{ fontSize: 'clamp(2.2rem, 7vw, 6rem)' }}
      >
        {group.name}
      </h2>
      <p className="mt-5 max-w-2xl font-light opacity-70" style={{ fontSize: 'clamp(1rem, 1.5vw, 1.25rem)' }}>
        {group.tagline}
      </p>
    </FadeIn>
  );
}

function ServiceGrid({ group, tone }: { group: ServiceGroup; tone: 'light' | 'dark' }) {
  const odd = group.services.length % 2 === 1;
  return (
    <ul className="mx-auto grid max-w-6xl gap-4 md:grid-cols-2">
      {group.services.map((service, i) => (
        <FadeIn
          as="li"
          key={service.name}
          delay={(i % 2) * 0.1}
          // An odd last card spans the full row so the grid never ends with a gap.
          className={odd && i === group.services.length - 1 ? 'md:col-span-2' : ''}
        >
          <ServiceCard service={service} number={i + 1} tone={tone} />
        </FadeIn>
      ))}
    </ul>
  );
}

export default function ServicesPage() {
  usePageTitle('Services');
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Services"
        intro="Two sides of what I do: software and AI systems that run businesses, and social media and content that grow them."
      >
        <FadeIn immediate delay={0.45} y={20} className="mt-10 flex flex-wrap justify-center gap-3">
          {serviceGroups.map((group) => (
            <a
              key={group.id}
              href={`#${group.id}`}
              className="inline-flex items-center gap-2 rounded-full border-2 border-[#D7E2EA]/40 px-6 py-3 text-xs font-medium uppercase tracking-widest text-[#D7E2EA] transition-colors duration-200 hover:border-[#D7E2EA] sm:text-sm"
            >
              {group.name}
              <ArrowDown size={16} aria-hidden="true" />
            </a>
          ))}
        </FadeIn>
      </PageHeader>

      <Sheet z="z-10" id="software">
        <GroupIntro group={serviceGroups[0]} index={0} tone="light" />
        <ServiceGrid group={serviceGroups[0]} tone="light" />
      </Sheet>

      <Sheet tone="dark" z="z-20" id="social">
        <GroupIntro group={serviceGroups[1]} index={1} tone="dark" />
        <ServiceGrid group={serviceGroups[1]} tone="dark" />

        <div id="drone" className="mx-auto mt-24 grid max-w-6xl scroll-mt-20 items-center gap-12 md:mt-32 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <FadeIn>
            <p className="text-xs uppercase tracking-widest opacity-60 sm:text-sm">Shot on a DJI Mini 5 Pro</p>
            <h2 className="hero-heading mt-3 font-black uppercase leading-[0.9] tracking-tight" style={{ fontSize: 'clamp(1.75rem, 9vw, 6rem)' }}>
              Drone videography
            </h2>
            <p className="mt-6 font-light leading-relaxed opacity-80" style={{ fontSize: 'clamp(1rem, 1.5vw, 1.2rem)' }}>
              Cinematic aerial video and photos for businesses, real estate, events and tourism. I handle everything from flight
              planning to the final edit, so you get footage that is ready for your website, listings and social media.
            </p>
            <div className="mt-10">
              <ContactButton label="Book a drone shoot" href={DRONE_MAIL} icon={<Mail size={18} aria-hidden="true" />} />
            </div>
          </FadeIn>
          <FadeIn delay={0.15}>
            <img
              src="/services/drone-sunset.webp"
              alt="Drone flying over the sea at sunset"
              loading="lazy"
              className="w-full rounded-[40px] object-cover md:rounded-[60px]"
              style={{ height: 'clamp(280px, 40vw, 560px)' }}
            />
          </FadeIn>
        </div>

        <ul className="mx-auto mt-20 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4 md:mt-28">
          {droneUseCases.map((useCase, i) => (
            <FadeIn as="li" key={useCase.title} delay={i * 0.1} className="flex flex-col">
              <img src={useCase.image.src} alt={useCase.image.alt} loading="lazy" className="aspect-[4/3] w-full rounded-[30px] object-cover" />
              <h3 className="mt-5 font-medium uppercase" style={{ fontSize: 'clamp(1rem, 1.4vw, 1.2rem)' }}>
                {useCase.title}
              </h3>
              <p className="mt-2 font-light leading-relaxed opacity-70">{useCase.text}</p>
            </FadeIn>
          ))}
        </ul>
      </Sheet>

      <Sheet z="z-30">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <FadeIn>
            <img
              src="/services/drone-mountains.webp"
              alt="Drone hovering above snowy mountains"
              loading="lazy"
              className="w-full rounded-[40px] object-cover md:rounded-[60px]"
              style={{ height: 'clamp(260px, 36vw, 520px)' }}
            />
          </FadeIn>
          <div>
            <FadeIn>
              <h2 className="font-black uppercase leading-none tracking-tight" style={headingStyle}>
                How a shoot works
              </h2>
            </FadeIn>
            <ol className="mt-10">
              {droneSteps.map((step, i) => (
                <FadeIn
                  as="li"
                  key={step.title}
                  delay={i * 0.1}
                  className="flex gap-5 py-5"
                  style={{ borderTop: i === 0 ? 'none' : '1px solid rgba(12,12,12,0.15)' }}
                >
                  <span className="font-black leading-none" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="font-medium uppercase">{step.title}</h3>
                    <p className="mt-1 font-light leading-relaxed opacity-60">{step.text}</p>
                  </div>
                </FadeIn>
              ))}
            </ol>
          </div>
        </div>
      </Sheet>
    </>
  );
}
