import { Lightbulb, Rocket, Sparkles, type LucideIcon } from 'lucide-react';

export type VentureStatus = 'Active' | 'In development' | 'Exited' | 'Paused';

export type Venture = {
  name: string;
  tagline: string;
  description: string;
  role: string;
  year: string;
  status: VentureStatus;
  tags: string[];
  icon: LucideIcon;
  link?: string;
  /** Optional cover image in /public/ventures. */
  image?: { src: string; alt: string };
  /** Template entry: rendered as a "coming soon" card until real details are filled in. */
  placeholder?: boolean;
};

/*
 * TEMPLATE: replace these entries with your real ventures.
 * For each one: set name, tagline, description, role, year, status, tags and link,
 * optionally add a cover image (put it in public/ventures/), and remove `placeholder: true`.
 */
export const ventures: Venture[] = [
  {
    name: 'Venture One',
    tagline: 'One-line pitch of what it does',
    description: 'Two or three sentences on the problem, the product and the traction so far.',
    role: 'Founder',
    year: '20XX',
    status: 'Active',
    tags: ['Tag', 'Tag'],
    icon: Rocket,
    placeholder: true,
  },
  {
    name: 'Venture Two',
    tagline: 'One-line pitch of what it does',
    description: 'Two or three sentences on the problem, the product and the traction so far.',
    role: 'Co-founder',
    year: '20XX',
    status: 'In development',
    tags: ['Tag', 'Tag'],
    icon: Lightbulb,
    placeholder: true,
  },
  {
    name: 'Venture Three',
    tagline: 'One-line pitch of what it does',
    description: 'Two or three sentences on the problem, the product and the traction so far.',
    role: 'Founder',
    year: '20XX',
    status: 'Active',
    tags: ['Tag', 'Tag'],
    icon: Sparkles,
    placeholder: true,
  },
];
