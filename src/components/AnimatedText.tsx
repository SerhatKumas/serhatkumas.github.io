import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useRef, type CSSProperties } from 'react';

type AnimatedTextProps = {
  text: string;
  className?: string;
  style?: CSSProperties;
};

function Char({
  char,
  progress,
  range,
}: {
  char: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.2, 1]);
  return (
    <span className="relative">
      <span className="invisible">{char}</span>
      <motion.span className="absolute left-0 top-0" style={{ opacity }}>
        {char}
      </motion.span>
    </span>
  );
}

export default function AnimatedText({ text, className, style }: AnimatedTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.2'] });

  if (reduceMotion) {
    return (
      <p ref={ref} className={className} style={style}>
        {text}
      </p>
    );
  }

  const words = text.split(' ');
  const total = text.length;
  let charIndex = 0;

  return (
    <p ref={ref} className={className} style={style} aria-label={text}>
      {words.map((word, wi) => {
        const wordStart = charIndex;
        charIndex += word.length + 1; // +1 for the trailing space
        return (
          <span key={wi} aria-hidden="true">
            <span className="inline-block whitespace-nowrap">
              {word.split('').map((char, ci) => {
                const i = wordStart + ci;
                return <Char key={ci} char={char} progress={scrollYProgress} range={[i / total, (i + 1) / total]} />;
              })}
            </span>
            {wi < words.length - 1 && ' '}
          </span>
        );
      })}
    </p>
  );
}
