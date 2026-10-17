import { Code2, Gamepad2, Link, Server, Sparkles, type LucideIcon } from 'lucide-react';
import type { ProjectImage } from './projects';

const unsplash = (id: string) => `https://images.unsplash.com/photo-${id}?w=1200&q=85&fm=webp&fit=max`;

export type Experience = {
  number: string;
  role: string;
  company: string;
  location?: string;
  dates: string;
  current?: boolean;
  /** Short bullets for the home page cards. */
  highlights: string[];
  /** Full bullets for the Experience page. */
  details: string[];
  tags: string[];
  icon: LucideIcon;
  image: ProjectImage;
};

export const experience: Experience[] = [
  {
    number: '01',
    role: 'Solution Architect',
    company: 'BSH Hausgeräte',
    location: 'Munich',
    dates: 'Jan 2026 - Present',
    current: true,
    highlights: [
      'Built an AWS-deployed video management platform (React.js, Node.js) with SSO/OAuth, batch uploads and analytics; secured an enterprise YouTube API quota increase.',
      'Designed a hierarchical multi-agent architecture with Google ADK, A2A protocols, intent routing and guardrails.',
      'Delivered no-code AI agents for help desk and code assistance for non-technical staff.',
    ],
    details: [
      'Architected and implemented a full-stack, AWS-deployed video management platform (React.js, Node.js) with SSO and OAuth for multi-channel batch uploading, CRUD operations and analytics, and secured an enterprise YouTube API quota increase.',
      'Developed targeted no-code AI solutions with strict safety guardrails and robust context-feeding, including a company-wide help desk agent and a code-helper agent for non-technical staff.',
      'Engineered a scalable, hierarchical multi-agent architecture in Python with the Google Agent Development Kit (ADK), implementing Agent-to-Agent (A2A) protocols, dynamic intent routing and advanced contextual guardrails.',
    ],
    tags: ['React.js', 'Node.js', 'AWS', 'Google ADK', 'A2A'],
    icon: Sparkles,
    image: { src: '/experience/bsh.webp', placeholder: unsplash('1639405069836-f82aa6dcb900'), alt: 'Modern kitchen with built-in ovens and premium appliances' },
  },
  {
    number: '02',
    role: 'Software Developer',
    company: 'DC Academy',
    dates: 'Mar 2022 - Feb 2023',
    highlights: [
      'Built a Python/Flask REST API integrating Dialogflow CX for enterprise NLP.',
      'Integrated the ChatGPT API in a microservices architecture and built a real-time async chat UI.',
    ],
    details: [
      'Engineered a Python/Flask REST API integrating Google Dialogflow CX to process NLP requests and enable enterprise data exchange.',
      'Built an interactive web UI (HTML, CSS, JavaScript ES6+) that consumes backend APIs asynchronously for real-time chatbot interactions.',
      'Integrated the ChatGPT API within a microservices architecture to process complex queries asynchronously and extend NLP capabilities.',
    ],
    tags: ['Python', 'Flask', 'Dialogflow CX', 'ChatGPT API'],
    icon: Code2,
    image: { src: '/experience/dc-academy.webp', placeholder: unsplash('1515879218367-8466d910aaa4'), alt: 'Python code on a dark editor screen' },
  },
  {
    number: '03',
    role: 'Intern Game Developer',
    company: 'Spike Games',
    dates: 'Jan 2022 - Feb 2022',
    highlights: [
      'Built core 2D mechanics in Unity/C#: state-driven character controller, inventory system and FSM-based enemy AI.',
    ],
    details: [
      'Engineered core 2D game mechanics in Unity with performant C#: a state-driven character controller, event-based interaction systems and a customisable inventory module.',
      'Architected C# scripts for complex character animation state machines and finite-state-machine (FSM) enemy behaviour.',
    ],
    tags: ['Unity', 'C#', 'Game AI'],
    icon: Gamepad2,
    image: { src: '/experience/spike-games.webp', placeholder: unsplash('1612287230202-1ff1d85d1bdf'), alt: 'Game controller lit by cyan and magenta neon' },
  },
  {
    number: '04',
    role: 'Intern Software Developer',
    company: 'DC Academy',
    dates: 'Nov 2021 - Jan 2022',
    highlights: ['Built and tested Solidity smart contracts and designed service logic for a ride-sharing app.'],
    details: [
      'Built and tested smart contracts in Solidity, gaining hands-on experience with transaction execution and gas optimisation.',
      'Led the design of service logic and user-flow architecture for a ride-sharing app, modelling driver-passenger matching, payment processing and trip status management.',
    ],
    tags: ['Solidity', 'Smart Contracts'],
    icon: Link,
    image: { src: '/experience/dc-academy-intern.webp', placeholder: unsplash('1642104704074-907c0698cbd9'), alt: 'Ethereum logo on a purple gradient' },
  },
  {
    number: '05',
    role: 'Intern Backend Developer',
    company: 'Delta Smart Technologies',
    dates: 'Jan 2021 - Feb 2021',
    highlights: ['Built Spring Boot REST APIs with Spring Data JPA and optimized SQL queries and stored procedures.'],
    details: [
      'Built Spring Boot REST APIs with data persistence through Spring Data JPA, applying strict layered architecture to reduce complexity and bugs.',
      'Optimised SQL queries and stored procedures for high-performance, consistent data access across Java and Python backend services.',
    ],
    tags: ['Java', 'Spring Boot', 'JPA', 'SQL'],
    icon: Server,
    image: { src: '/experience/delta.webp', placeholder: unsplash('1782094673136-5198a372980c'), alt: 'Server cooling fans in a data center' },
  },
];
