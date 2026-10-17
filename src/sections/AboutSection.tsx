import AnimatedText from '../components/AnimatedText';
import ContactButton from '../components/ContactButton';
import FadeIn from '../components/FadeIn';
import MoreLink from '../components/MoreLink';
import { ABOUT_TEXT, stats } from '../data/profile';

const ASSET_BASE = 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7';

const decorations = [
  {
    src: `${ASSET_BASE}/moon_icon.11395d36.png`,
    className: 'top-[4%] left-[1%] sm:left-[2%] md:left-[4%] w-[120px] sm:w-[160px] md:w-[210px]',
    delay: 0.1,
    x: -80,
  },
  {
    src: `${ASSET_BASE}/p59_1.4659672e.png`,
    className: 'bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%] w-[100px] sm:w-[140px] md:w-[180px]',
    delay: 0.25,
    x: -80,
  },
  {
    src: `${ASSET_BASE}/lego_icon-1.703bb594.png`,
    className: 'top-[4%] right-[1%] sm:right-[2%] md:right-[4%] w-[120px] sm:w-[160px] md:w-[210px]',
    delay: 0.15,
    x: 80,
  },
  {
    src: `${ASSET_BASE}/Group_134-1.2e04f3ce.png`,
    className: 'bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%] w-[130px] sm:w-[170px] md:w-[220px]',
    delay: 0.3,
    x: 80,
  },
];

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 py-20 sm:px-8 md:px-10"
    >
      {decorations.map((d) => (
        <FadeIn
          key={d.src}
          aria-hidden="true"
          delay={d.delay}
          x={d.x}
          y={0}
          duration={0.9}
          className={`pointer-events-none absolute ${d.className}`}
        >
          <img src={d.src} alt="" loading="lazy" className="h-auto w-full opacity-50 sm:opacity-100" />
        </FadeIn>
      ))}

      <div className="relative z-10 flex flex-col items-center gap-16 sm:gap-20 md:gap-24">
        <div className="flex flex-col items-center gap-12 sm:gap-14">
          <div className="flex flex-col items-center gap-10 sm:gap-14 md:gap-16">
            <FadeIn delay={0} y={40}>
              <h2
                className="hero-heading text-center font-black uppercase leading-none tracking-tight"
                style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
              >
                About me
              </h2>
            </FadeIn>
            <AnimatedText
              text={ABOUT_TEXT}
              className="max-w-[600px] text-center font-medium leading-relaxed text-[#D7E2EA]"
              style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)' }}
            />
          </div>

          <dl className="flex justify-center gap-5 min-[360px]:gap-8 sm:gap-14">
            {stats.map((stat, i) => (
              <FadeIn key={stat.label} delay={i * 0.1} className="flex flex-col items-center text-center">
                <dt className="sr-only">{stat.label}</dt>
                <dd className="hero-heading whitespace-nowrap font-black leading-none" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}>
                  {stat.value}
                </dd>
                <dd aria-hidden="true" className="mt-2 max-w-[140px] text-xs font-light uppercase tracking-wider text-[#D7E2EA] opacity-70 sm:text-sm">
                  {stat.label}
                </dd>
              </FadeIn>
            ))}
          </dl>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <ContactButton />
          <MoreLink to="/about" label="More about me" />
        </div>
      </div>
    </section>
  );
}
