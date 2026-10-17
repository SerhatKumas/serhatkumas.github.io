import { BarChart3, Bot, MessagesSquare, type LucideIcon } from 'lucide-react';

export const GITHUB_URL = 'https://github.com/SerhatKumas';
export const GITHUB_USER = 'SerhatKumas';

export type ProjectImage = {
  /** Local image in /public. Used first. */
  src: string;
  /** Remote fallback, used if the local image fails to load. */
  placeholder: string;
  alt: string;
};

export type Project = {
  slug: string;
  number: string;
  name: string;
  category: string;
  description: string;
  /** Longer write-up for the Projects page. */
  overview: string;
  features: string[];
  tags: string[];
  icon: LucideIcon;
  repo: string;
  live?: string;
  images: [ProjectImage, ProjectImage, ProjectImage];
};

/** Original photo on the Unsplash CDN, used if the local copy fails to load. */
const unsplash = (id: string) => `https://images.unsplash.com/photo-${id}?w=1800&q=85&fm=webp&fit=max`;

export const projects: Project[] = [
  {
    slug: 'social-media-analytics-api',
    number: '01',
    name: 'Social Media Analytics API',
    category: 'Open source -- Data & APIs',
    description:
      'A Flask REST API that collects follower and following metrics from six platforms with Selenium and BeautifulSoup scrapers, served as reports or raw numbers.',
    overview:
      'One API for audience numbers across the major social networks. Each platform module scrapes its site with Selenium and BeautifulSoup, a business layer turns the raw page data into numbers and readable reports, and an API layer exposes both through clean REST endpoints. Every module follows the same scraping, business and API layering, wired together with constructor injection.',
    features: [
      'Six platforms: Instagram, LinkedIn, GitHub, TikTok, Twitter and YouTube',
      'Browser-based scraping with Selenium and BeautifulSoup',
      'Twelve REST endpoints: a text report and a numeric array per platform',
      'Scraping, business and API layers per module, connected with constructor injection',
    ],
    tags: ['Python', 'Flask', 'Selenium', 'BeautifulSoup', 'REST API'],
    icon: BarChart3,
    repo: 'https://github.com/SerhatKumas/Flask--UserFollowerCountApi',
    images: [
      {
        src: '/projects/social-1.webp',
        placeholder: unsplash('1675352161865-27816c76141a'),
        alt: 'Phone with a social media folder of Instagram, LinkedIn and Twitter apps',
      },
      {
        src: '/projects/social-2.webp',
        placeholder: unsplash('1551288049-bebda4e38f71'),
        alt: 'Audience analytics dashboard on a dark laptop screen',
      },
      {
        src: '/projects/social-3.webp',
        placeholder: unsplash('1643503640904-75c1a2093570'),
        alt: 'Glowing 3D YouTube, Instagram, Twitter and Facebook icons',
      },
    ],
  },
  {
    slug: 'ai-agent-sop-workspace',
    number: '02',
    name: 'AI Agent SOP & Audit Workspace',
    category: 'Open source -- AI engineering',
    description:
      'A source of truth for AI-assisted engineering: system prompts for specialised coding agents, nine system-audit checklists and strict naming conventions.',
    overview:
      'A workspace that makes AI-assisted development predictable. It packages Standard Operating Procedures as system prompts for specialised coding agents, a suite of audit checklists that keep production systems healthy, and naming rules that keep APIs, databases and releases consistent, so teams can hand work to AI agents without losing their standards.',
    features: [
      'SOP system prompts for Base, Frontend, Backend, DevOps, Testing and LLM-integration agents',
      'Nine audit checklists: AWS architecture, security & IAM, DevOps, frontend and backend health, databases, privacy compliance',
      'Naming conventions for APIs, databases, Git branches and semantic releases',
      'Built to plug into Cursor, GitHub Copilot or custom autonomous agents',
    ],
    tags: ['LLM Agents', 'Prompt Engineering', 'AWS', 'DevOps', 'Security'],
    icon: Bot,
    repo: 'https://github.com/SerhatKumas/AI--AgentSOPandAuditWorkspace',
    images: [
      {
        src: '/projects/agents-1.webp',
        placeholder: unsplash('1674027444485-cec3da58eef4'),
        alt: '3D neural network shaped like a brain above a pedestal',
      },
      {
        src: '/projects/agents-2.webp',
        placeholder: unsplash('1647356191320-d7a1f80ca777'),
        alt: 'Purple network of connected nodes on a dark background',
      },
      {
        src: '/projects/agents-3.webp',
        placeholder: unsplash('1734597949889-f8e2ec87c8ea'),
        alt: 'Glass AI chip glowing purple',
      },
    ],
  },
  {
    slug: 'dialogflow-chatbot-api',
    number: '03',
    name: 'Dialogflow Chatbot API',
    category: 'Open source -- Conversational AI',
    description:
      'A Flask REST API to query a Google Dialogflow chatbot and manage its intents, built on a layered API, manager and repository architecture.',
    overview:
      'A backend for running a Google Dialogflow chatbot from your own systems. Clients ask questions through a simple endpoint, while a second API manages the bot itself: listing intents, bulk-creating them from JSON, renaming and deleting them. Each domain follows the same API, manager and repository layering, with configurable data-access objects.',
    features: [
      'Ask the chatbot through /ask-question and get its answer back',
      'Full intent management: list, bulk-create from JSON, rename and delete',
      'Layered architecture: API, manager and repository for each domain',
      'Configurable data-access objects for answers and intents',
    ],
    tags: ['Python', 'Flask', 'Dialogflow', 'REST API'],
    icon: MessagesSquare,
    repo: 'https://github.com/SerhatKumas/Flask--ExternalDialogflowApi',
    images: [
      {
        src: '/projects/chatbot-1.webp',
        placeholder: unsplash('1675865254433-6ba341f0f00b'),
        alt: 'Chatbot interface on a dark blue screen',
      },
      {
        src: '/projects/chatbot-2.webp',
        placeholder: unsplash('1763810021881-49b45b0717d5'),
        alt: 'Hand holding a smartphone with a chat conversation',
      },
      {
        src: '/projects/chatbot-3.webp',
        placeholder: unsplash('1684369175833-4b445ad6bfb5'),
        alt: '3D chatbot robot working on a laptop',
      },
    ],
  },
];
