import FadeIn from '../components/FadeIn';
import MoreLink from '../components/MoreLink';
import VentureCard from '../components/VentureCard';
import { ventures } from '../data/ventures';

export default function VenturesSection() {
  return (
    <section
      id="ventures"
      className="relative z-40 -mt-10 rounded-t-[40px] bg-white px-5 py-20 text-[#0C0C0C] sm:-mt-12 sm:rounded-t-[50px] sm:px-8 sm:py-24 md:-mt-14 md:rounded-t-[60px] md:px-10 md:py-32"
    >
      <FadeIn y={40}>
        <h2 className="text-center font-black uppercase leading-none tracking-tight" style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}>
          Ventures
        </h2>
        <p className="mx-auto mb-16 mt-6 max-w-xl text-center font-light opacity-60 sm:mb-20 md:mb-24" style={{ fontSize: 'clamp(1rem, 1.6vw, 1.25rem)' }}>
          My entrepreneurships and start-ups: things I&apos;ve founded, built and run.
        </p>
      </FadeIn>
      <ul className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ventures.map((venture, i) => (
          <FadeIn as="li" key={venture.name} delay={i * 0.1}>
            <VentureCard venture={venture} />
          </FadeIn>
        ))}
      </ul>
      <div className="mt-14 flex justify-center">
        <MoreLink to="/ventures" label="All ventures" tone="light" />
      </div>
    </section>
  );
}
