import { BarChart3, Bot, Boxes, CalendarDays, Cloud, MessagesSquare, Server, Video, Wand2, Workflow, type LucideIcon } from 'lucide-react';

export type Service = {
  name: string;
  description: string;
  /** What a client gets, shown on the Services page. */
  deliverables: string[];
  icon: LucideIcon;
};

export type ServiceGroup = {
  id: 'software' | 'social';
  name: string;
  /** Compact label for the home-page tabs. */
  shortName: string;
  tagline: string;
  services: Service[];
};

export const serviceGroups: ServiceGroup[] = [
  {
    id: 'software',
    name: 'Software & AI',
    shortName: 'Software & AI',
    tagline: 'Architecture, AI agents and the backends and platforms that run them.',
    services: [
      {
        name: 'Solutions Architecture',
        description:
          'Designing scalable, maintainable system architectures, from microservices and distributed systems to secure SSO and OAuth flows, built to grow with the business.',
        deliverables: ['Architecture reviews and target designs', 'Microservice and API boundaries', 'SSO, OAuth and security flows', 'Cloud cost and scaling plans'],
        icon: Boxes,
      },
      {
        name: 'AI Agents',
        description:
          'Hierarchical multi-agent systems with Google ADK and A2A protocols, dynamic intent routing, and strict guardrails that keep AI helpful, safe, and on-task.',
        deliverables: ['Multi-agent architectures (Google ADK, A2A)', 'Intent routing and orchestration', 'Guardrails and context-feeding', 'No-code agents for non-technical teams'],
        icon: Bot,
      },
      {
        name: 'Conversational AI',
        description:
          'NLP-powered assistants and help desk agents using Dialogflow CX, the ChatGPT API, and context-feeding pipelines that give users reliable answers.',
        deliverables: ['Help desk and support assistants', 'Dialogflow CX and LLM integrations', 'Knowledge and context pipelines', 'Real-time chat interfaces'],
        icon: MessagesSquare,
      },
      {
        name: 'Backend & APIs',
        description:
          'Clean, high-performance REST APIs with Python/Flask and Java/Spring Boot, optimized SQL, and layered architecture that minimizes bugs and complexity.',
        deliverables: ['REST APIs in Flask or Spring Boot', 'Database design and SQL tuning', 'Layered, testable codebases', 'Third-party API integrations'],
        icon: Server,
      },
      {
        name: 'Full-Stack & Cloud',
        description:
          'End-to-end web platforms with React.js and Node.js, deployed on AWS with Docker, including analytics, batch processing, and third-party API integrations.',
        deliverables: ['React.js and Node.js platforms', 'AWS deployments with Docker', 'Analytics and batch processing', 'Auth, dashboards and admin tools'],
        icon: Cloud,
      },
    ],
  },
  {
    id: 'social',
    name: 'Social Media & Content',
    shortName: 'Social & Content',
    tagline: 'AI-powered content, smart planning and aerial video that grow your audience.',
    services: [
      {
        name: 'AI Post Creation',
        description:
          'On-brand posts produced with AI: captions, visuals and carousels generated, refined and reviewed, so you publish more often without losing your voice.',
        deliverables: ['AI-written captions and hashtags', 'AI-assisted visuals and carousels', 'Brand voice and style guides for AI', 'Human review before anything goes live'],
        icon: Wand2,
      },
      {
        name: 'Social Media Planning',
        description:
          'A clear content strategy and calendar for every platform: what to post, when, and why, built around your goals, audience and launches.',
        deliverables: ['Content strategy and pillars', 'Monthly content calendars', 'Platform-specific formats', 'Campaign and launch planning'],
        icon: CalendarDays,
      },
      {
        name: 'Social Media Automation',
        description:
          'Workflows that run on their own: scheduling and cross-posting, AI-assisted replies, content repurposing and lead capture, so your channels stay active without the manual work.',
        deliverables: ['Scheduling and cross-posting pipelines', 'AI-assisted replies and message triage', 'Content repurposing across platforms', 'Custom and no-code automations'],
        icon: Workflow,
      },
      {
        name: 'Analytics & Reporting',
        description:
          'Follower growth, engagement and performance tracked across platforms and turned into clear reports with concrete next steps.',
        deliverables: ['Cross-platform follower and engagement tracking', 'Monthly performance reports', 'Competitor benchmarking', 'Data-driven recommendations'],
        icon: BarChart3,
      },
      {
        name: 'Drone Videography',
        description:
          'Cinematic aerial video and photos with a DJI Mini 5 Pro for businesses, real estate and properties, events and tourism, from flight planning to edited, ready-to-post footage.',
        deliverables: ['Real estate and property tours', 'Business and brand promo videos', 'Event and venue coverage', 'Edited reels for social media'],
        icon: Video,
      },
    ],
  },
];

export const droneUseCases = [
  {
    title: 'Real estate & properties',
    text: 'Show a property, its surroundings and the neighbourhood in a way ground photos never can.',
    image: { src: '/services/aerial-property.webp', alt: 'Aerial view of a waterfront house with a long garden' },
  },
  {
    title: 'Hotels & estates',
    text: 'Top-down and orbit shots that make grounds, pools and architecture stand out.',
    image: { src: '/services/aerial-estate.webp', alt: 'Top-down aerial view of an estate with a pool among trees' },
  },
  {
    title: 'Events & tourism',
    text: 'Dynamic coverage of events, boats, beaches and destinations, cut into shareable clips.',
    image: { src: '/services/aerial-events.webp', alt: 'Aerial view of boats and jet skis making patterns on the water' },
  },
  {
    title: 'Businesses & sites',
    text: 'Company campuses, shops and construction progress filmed from above for marketing and reports.',
    image: { src: '/services/aerial-business.webp', alt: 'Aerial view of a business park and roads' },
  },
];
