import { useReducedMotion } from 'framer-motion';
import {
  ArrowLeftRight, Atom, Bot, Boxes, Braces, Cloud, Code2, Coffee, Container, Database, FlaskConical,
  Gamepad2, Hash, Leaf, Link, MessagesSquare, Network, Server, ShieldCheck, Sparkles, Video, Webhook,
  type LucideIcon,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { BRAND_GRADIENT } from '../constants';

type Tech = { label: string; icon: LucideIcon };

const rowOne: Tech[] = [
  { label: 'Python', icon: Code2 },
  { label: 'Java', icon: Coffee },
  { label: 'C#', icon: Hash },
  { label: 'JavaScript', icon: Braces },
  { label: 'React.js', icon: Atom },
  { label: 'Node.js', icon: Server },
  { label: 'Flask', icon: FlaskConical },
  { label: 'Spring Boot', icon: Leaf },
  { label: 'PostgreSQL', icon: Database },
  { label: 'Docker', icon: Container },
  { label: 'AWS', icon: Cloud },
];

const rowTwo: Tech[] = [
  { label: 'Google ADK', icon: Bot },
  { label: 'Multi-Agent Systems', icon: Network },
  { label: 'A2A Protocols', icon: ArrowLeftRight },
  { label: 'Dialogflow CX', icon: MessagesSquare },
  { label: 'ChatGPT API', icon: Sparkles },
  { label: 'Microservices', icon: Boxes },
  { label: 'REST APIs', icon: Webhook },
  { label: 'OAuth & SSO', icon: ShieldCheck },
  { label: 'Unity', icon: Gamepad2 },
  { label: 'Solidity', icon: Link },
  { label: 'Drone Video', icon: Video },
];

function TechTile({ tech, accent, hidden }: { tech: Tech; accent: boolean; hidden: boolean }) {
  const Icon = tech.icon;
  return (
    <div
      aria-hidden={hidden || undefined}
      className="flex h-[180px] w-[280px] shrink-0 flex-col justify-between rounded-2xl p-6 sm:h-[270px] sm:w-[420px] sm:p-8"
      style={
        accent
          ? { background: BRAND_GRADIENT }
          : {
              background: 'linear-gradient(145deg, #15151A 0%, #0F0F12 100%)',
              border: '1px solid rgba(215, 226, 234, 0.12)',
            }
      }
    >
      <Icon
        aria-hidden="true"
        strokeWidth={1.5}
        className="h-10 w-10 sm:h-14 sm:w-14"
        color={accent ? '#FFFFFF' : '#BBCCD7'}
      />
      <span
        className={`font-black uppercase leading-none ${accent ? 'text-white' : 'hero-heading'}`}
        style={{ fontSize: 'clamp(1.6rem, 3vw, 2.8rem)' }}
      >
        {tech.label}
      </span>
    </div>
  );
}

function TechRow({ items, transform }: { items: Tech[]; transform: string }) {
  const tripled = [...items, ...items, ...items];
  return (
    <div className="flex w-max gap-3" style={{ transform, willChange: 'transform' }}>
      {tripled.map((tech, i) => (
        <TechTile key={i} tech={tech} accent={i % 3 === 2} hidden={i < items.length || i >= items.length * 2} />
      ))}
    </div>
  );
}

export default function MarqueeSection() {
  const ref = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) {
      setOffset(0);
      return;
    }
    let frame = 0;
    const update = () => {
      const el = ref.current;
      if (!el) return;
      const sectionTop = el.getBoundingClientRect().top + window.scrollY;
      setOffset((window.scrollY - sectionTop + window.innerHeight) * 0.3);
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [reduceMotion]);

  const shift = reduceMotion ? -200 : offset - 200;

  return (
    <section ref={ref} aria-label="Tech stack" className="overflow-hidden bg-[#0C0C0C] pb-10 pt-24 sm:pt-32 md:pt-40">
      <div className="flex flex-col gap-3">
        <TechRow items={rowOne} transform={`translateX(calc(-33.333% + ${shift}px))`} />
        <TechRow items={rowTwo} transform={`translateX(calc(-33.333% + ${-shift}px))`} />
      </div>
    </section>
  );
}
