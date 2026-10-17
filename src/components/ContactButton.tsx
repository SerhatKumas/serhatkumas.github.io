import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { BRAND_GRADIENT } from '../constants';

type ContactButtonProps = {
  label?: string;
  /** Plain link (anchors, files, external). */
  href?: string;
  /** Internal route, rendered with React Router. */
  to?: string;
  icon?: ReactNode;
  download?: boolean | string;
  external?: boolean;
  className?: string;
};

const MotionLink = motion.create(Link);

export default function ContactButton({
  label = 'Contact Me',
  href = '#contact',
  to,
  icon,
  download,
  external,
  className = '',
}: ContactButtonProps) {
  const shared = {
    whileHover: { scale: 1.04 },
    whileTap: { scale: 0.97 },
    className: `inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full px-8 py-3 text-xs font-medium uppercase tracking-widest text-white sm:px-10 sm:py-3.5 sm:text-sm md:px-12 md:py-4 md:text-base ${className}`,
    style: {
      background: BRAND_GRADIENT,
      boxShadow: '0px 4px 4px rgba(181, 1, 167, 0.25), 4px 4px 12px #7721B1 inset',
      outline: '2px solid #FFFFFF',
      outlineOffset: '-3px',
    },
  };

  if (to) {
    return (
      <MotionLink to={to} {...shared}>
        {label}
        {icon}
      </MotionLink>
    );
  }

  return (
    <motion.a
      href={href}
      download={download === true ? '' : download || undefined}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...shared}
    >
      {label}
      {icon}
    </motion.a>
  );
}
