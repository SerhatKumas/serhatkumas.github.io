import { motion, useReducedMotion } from 'framer-motion';
import { Download, GraduationCap } from 'lucide-react';
import ContactButton from '../components/ContactButton';
import FadeIn from '../components/FadeIn';
import { BRAND_GRADIENT } from '../constants';

const education = [
  { school: 'Universität Passau', degree: 'M.Sc. in Computer Science', years: '2025 - Current', current: true },
  { school: 'Izmir Institute of Technology', degree: 'B.Sc. in Computer Engineering', years: '2018 - 2023' },
  { school: 'Anadolu University', degree: 'B.Sc. in Business Administration', years: '2020 - 2025' },
];

const languages = [
  { name: 'Turkish', level: 'Native', value: 100 },
  { name: 'English', level: 'C1 Advanced', value: 85 },
  { name: 'German', level: 'A2 Beginner', value: 30 },
];

const subHeadingStyle = { fontSize: 'clamp(1.6rem, 3vw, 2.6rem)' };

export default function EducationSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="education"
      className="relative z-30 -mt-10 rounded-t-[40px] bg-[#0C0C0C] px-5 py-20 text-[#D7E2EA] sm:-mt-12 sm:rounded-t-[50px] sm:px-8 sm:py-24 md:-mt-14 md:rounded-t-[60px] md:px-10 md:py-32"
    >
      <FadeIn y={40}>
        <h2
          className="hero-heading mb-16 text-center font-black uppercase leading-none tracking-tight sm:mb-20 md:mb-28"
          style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
        >
          Education
        </h2>
      </FadeIn>

      <div className="mx-auto grid max-w-6xl items-start gap-16 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <h3 className="mb-6 font-black uppercase leading-none" style={subHeadingStyle}>
            Studies
          </h3>
          <ul className="flex flex-col gap-4">
            {education.map((ed, i) => (
              <FadeIn
                as="li"
                key={ed.school}
                delay={i * 0.1}
                className="flex items-center gap-5 rounded-[30px] border-2 border-[#D7E2EA]/30 p-6 transition-colors duration-200 hover:border-[#D7E2EA] sm:gap-6 sm:p-8"
              >
                <span
                  aria-hidden="true"
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full sm:h-16 sm:w-16"
                  style={{ background: BRAND_GRADIENT }}
                >
                  <GraduationCap size={26} strokeWidth={1.5} color="#FFFFFF" />
                </span>
                <div className="flex min-w-0 flex-col gap-1">
                  <span className="font-medium uppercase leading-tight" style={{ fontSize: 'clamp(1rem, 1.8vw, 1.4rem)' }}>
                    {ed.school}
                  </span>
                  <span className="font-light opacity-80">{ed.degree}</span>
                  <span className="flex items-center gap-2 text-sm font-light">
                    <span className="opacity-60">{ed.years}</span>
                    {ed.current && (
                      <span className="rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase text-white" style={{ background: BRAND_GRADIENT }}>
                        Now
                      </span>
                    )}
                  </span>
                </div>
              </FadeIn>
            ))}
          </ul>
        </div>

        <FadeIn delay={0.15}>
          <h3 className="mb-6 font-black uppercase leading-none" style={subHeadingStyle}>
            Languages
          </h3>
          <ul className="flex flex-col gap-6">
            {languages.map((lang) => (
              <li key={lang.name}>
                <div className="mb-2 flex justify-between">
                  <span className="font-medium uppercase">{lang.name}</span>
                  <span className="font-light opacity-60">{lang.level}</span>
                </div>
                <div
                  role="progressbar"
                  aria-label={`${lang.name} proficiency`}
                  aria-valuenow={lang.value}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  className="h-1.5 overflow-hidden rounded-full"
                  style={{ background: 'rgba(215,226,234,0.12)' }}
                >
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: BRAND_GRADIENT }}
                    initial={{ width: reduceMotion ? `${lang.value}%` : 0 }}
                    whileInView={{ width: `${lang.value}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: reduceMotion ? 0 : 1, ease: [0.25, 0.1, 0.25, 1] }}
                  />
                </div>
              </li>
            ))}
          </ul>

          <ContactButton
            label="Download CV"
            href="/Serhat_Kumas_CV.pdf"
            download
            icon={<Download size={18} aria-hidden="true" />}
            className="mt-12"
          />
        </FadeIn>
      </div>
    </section>
  );
}
