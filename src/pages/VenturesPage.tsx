import ContactButton from '../components/ContactButton';
import FadeIn from '../components/FadeIn';
import PageHeader from '../components/PageHeader';
import Sheet from '../components/Sheet';
import VentureCard from '../components/VentureCard';
import { ventures } from '../data/ventures';
import { usePageTitle } from '../hooks/usePageTitle';

export default function VenturesPage() {
  usePageTitle('Ventures');
  return (
    <>
      <PageHeader
        eyebrow="Ventures"
        title="Ventures"
        intro="My entrepreneurships and start-ups: products and businesses I've founded, built and run."
      />

      <Sheet z="z-10">
        <ul className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ventures.map((venture, i) => (
            <FadeIn as="li" key={venture.name} delay={(i % 3) * 0.1}>
              <VentureCard venture={venture} />
            </FadeIn>
          ))}
        </ul>

        <FadeIn className="mx-auto mt-20 flex max-w-3xl flex-col items-center text-center md:mt-28">
          <h2 className="font-black uppercase leading-none tracking-tight" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}>
            Building something?
          </h2>
          <p className="mt-5 max-w-xl font-light leading-relaxed opacity-60" style={{ fontSize: 'clamp(1rem, 1.5vw, 1.2rem)' }}>
            I&apos;m always open to partnering on new ideas, from technical co-founding to advising on architecture and AI.
          </p>
          <ContactButton label="Let's talk" className="mt-10" />
        </FadeIn>
      </Sheet>
    </>
  );
}
