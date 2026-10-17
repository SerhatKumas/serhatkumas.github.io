import { MapPin } from 'lucide-react';
import ContactButton from '../components/ContactButton';
import FadeIn from '../components/FadeIn';
import Magnet from '../components/Magnet';
import Navbar from '../components/Navbar';
import { PURPLE_GLOW } from '../constants';


export default function HeroSection() {
  return (
    <section id="home" className="hero-section relative flex flex-col" style={{ overflowX: 'clip' }}>
      <Navbar />

      <div className="overflow-hidden">
        <FadeIn immediate delay={0.15} y={40}>
          <h1 className="hero-heading mt-6 w-full whitespace-nowrap text-center text-[12vw] font-black uppercase leading-none tracking-tight sm:mt-4 sm:text-[12.8vw] md:mt-4 md:text-[13.7vw] lg:mt-[max(2rem,2vw)] lg:text-[15vw]">
            Hi, i&apos;m serhat
          </h1>
        </FadeIn>
      </div>

      {/* The stage is the free space between heading and bottom; the avatar is sized to fit it (see .hero-avatar) */}
      <div className="hero-stage relative z-10 min-h-0 flex-1">
        <div className="hero-avatar [--avatar-max:260px] [--bar-reserve:400px] sm:[--avatar-max:340px] sm:[--bar-reserve:460px] md:[--avatar-max:400px] md:[--bar-reserve:540px] lg:[--avatar-max:max(460px,24vw)] lg:[--bar-reserve:max(560px,30vw)]">
        <FadeIn immediate delay={0.6} y={30}>
          <Magnet padding={150} strength={3} activeTransition="transform 0.3s ease-out" inactiveTransition="transform 0.6s ease-in-out">
            <div className="relative">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
                style={{ background: PURPLE_GLOW }}
              />
              <img
                src="/serhat_avatar.png"
                alt="3D avatar of Serhat Kumas"
                loading="eager"
                fetchPriority="high"
                draggable={false}
                className="relative block h-auto w-full select-none"
                style={{
                  filter: 'grayscale(0.25) contrast(1.05)',
                  // The avatar is cut off flat at the bottom; fade it out like the original portrait
                  maskImage: 'linear-gradient(to bottom, #000 78%, transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(to bottom, #000 78%, transparent 100%)',
                }}
              />
            </div>
          </Magnet>
        </FadeIn>
        </div>
      </div>

      <div className="hero-bar z-20 flex flex-wrap items-end justify-between gap-4 px-6 pb-7 sm:pb-8 md:px-10 md:pb-10">
        <FadeIn immediate delay={0.35} y={20}>
          <p
            className="max-w-[160px] font-light uppercase leading-snug tracking-wide text-[#D7E2EA] sm:max-w-[220px] md:max-w-[260px] min-[1920px]:max-w-[18vw]"
            style={{ fontSize: 'clamp(0.75rem, 1.4vw, 2.4rem)' }}
          >
            a solutions architect crafting intelligent, scalable ai systems
          </p>
          <p className="mt-2 flex items-center gap-1 text-xs uppercase tracking-wide text-[#D7E2EA] opacity-60 sm:text-sm min-[1920px]:text-[0.9vw]">
            <MapPin size={14} aria-hidden="true" />
            Passau, DE
          </p>
        </FadeIn>
        <FadeIn immediate delay={0.5} y={20}>
          <ContactButton className="min-[1920px]:px-[3vw] min-[1920px]:py-[1.1vw] min-[1920px]:text-[1vw]" />
        </FadeIn>
      </div>
    </section>
  );
}
