import { ArrowUp, Check, Copy, Github, Linkedin, Mail, Phone } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import FadeIn from '../components/FadeIn';
import { BRAND_GRADIENT, PURPLE_GLOW } from '../constants';

const EMAIL = 'serhatkumas@outlook.com';

const contacts = [
  { icon: Mail, label: 'Email', value: EMAIL, href: `mailto:${EMAIL}`, external: false },
  { icon: Phone, label: 'Phone', value: '+49 176 86075720', href: 'tel:+4917686075720', external: false },
  { icon: Linkedin, label: 'LinkedIn', value: '/in/serhatkumas', href: 'https://www.linkedin.com/in/serhatkumas/', external: true },
  { icon: Github, label: 'GitHub', value: '@SerhatKumas', href: 'https://github.com/SerhatKumas', external: true },
];

export default function ContactSection() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number>();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable (e.g. insecure context); the mailto link still works.
    }
  };

  return (
    <section
      id="contact"
      className="relative z-50 -mt-10 overflow-hidden rounded-t-[40px] border-t border-[#D7E2EA]/15 bg-[#0C0C0C] px-5 pb-8 pt-20 sm:-mt-12 sm:rounded-t-[50px] sm:px-8 sm:pt-28 md:-mt-14 md:rounded-t-[60px] md:px-10 md:pt-36"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[35%] aspect-square w-[140vw] max-w-[1400px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{ background: PURPLE_GLOW }}
      />

      <div className="relative flex flex-col items-center">
        <FadeIn delay={0} y={40}>
          <h2
            className="hero-heading text-center font-black uppercase leading-[0.9] tracking-tight"
            style={{ fontSize: 'clamp(2.6rem, 10vw, 140px)' }}
          >
            Let&apos;s build
            <br />
            something great
          </h2>
        </FadeIn>

        <FadeIn delay={0.1}>
          <p
            className="mt-8 max-w-[520px] text-center font-light text-[#D7E2EA] opacity-80"
            style={{ fontSize: 'clamp(0.95rem, 1.6vw, 1.2rem)' }}
          >
            Open to Solutions Architecture, AI engineering and backend roles, freelance projects, and community collaborations.
          </p>
        </FadeIn>

        <FadeIn delay={0.2} className="mt-12 flex max-w-full items-center gap-3 sm:gap-5">
          <a
            href={`mailto:${EMAIL}`}
            className="group relative min-w-0 break-all py-2 font-medium sm:break-normal"
            style={{ fontSize: 'clamp(1.2rem, 4vw, 3.4rem)' }}
          >
            <span className="hero-heading">{EMAIL}</span>
            <span
              aria-hidden="true"
              className="absolute bottom-1 left-0 h-[2px] w-full origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
              style={{ background: BRAND_GRADIENT }}
            />
          </a>
          <button
            type="button"
            onClick={copyEmail}
            aria-label={copied ? 'Email copied' : 'Copy email address'}
            className="shrink-0 rounded-full border-2 border-[#D7E2EA] p-3 text-[#D7E2EA] transition-colors duration-200 hover:bg-[#D7E2EA]/10"
          >
            {copied ? <Check size={18} aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}
          </button>
          <span className="sr-only" aria-live="polite">
            {copied ? 'Email address copied to clipboard' : ''}
          </span>
        </FadeIn>

        <ul className="mt-16 grid w-full max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {contacts.map(({ icon: Icon, label, value, href, external }, i) => (
            <FadeIn as="li" key={label} delay={i * 0.1}>
              <a
                href={href}
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="flex h-full flex-col gap-4 rounded-[30px] border-2 border-[#D7E2EA]/30 p-6 text-[#D7E2EA] transition-colors duration-200 hover:border-[#D7E2EA] hover:bg-[#D7E2EA]/5"
              >
                <Icon size={24} aria-hidden="true" />
                <div className="flex flex-col gap-1">
                  <span className="text-xs uppercase tracking-widest opacity-60">{label}</span>
                  <span className="break-words text-sm font-medium sm:text-base">
                    {/* Let the email wrap after the @ instead of mid-word */}
                    {value.includes('@') && !value.startsWith('@') ? value.replace('@', '@\u200B') : value}
                  </span>
                </div>
              </a>
            </FadeIn>
          ))}
        </ul>
      </div>

      <footer
        className="relative mt-24 flex flex-col items-center justify-between gap-4 pt-6 text-xs font-light uppercase tracking-wider text-[#D7E2EA] opacity-60 sm:flex-row sm:text-sm"
        style={{ borderTop: '1px solid rgba(215,226,234,0.15)' }}
      >
        <span>© 2026 Serhat Kumas</span>
        <span>Passau, Germany</span>
        <a href="#top" className="-my-3 flex items-center gap-1.5 py-3 transition-opacity duration-200 hover:opacity-70">
          Back to top
          <ArrowUp size={14} aria-hidden="true" />
        </a>
      </footer>
    </section>
  );
}
