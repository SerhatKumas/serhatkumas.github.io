import { ArrowUpRight, FolderGit2, Github, Users } from 'lucide-react';
import { BRAND_GRADIENT } from '../constants';
import { GITHUB_URL, GITHUB_USER } from '../data/projects';
import { useGitHubProfile } from '../hooks/useGitHubProfile';
import ContactButton from './ContactButton';
import FadeIn from './FadeIn';

/** Closing card of the Projects section: live GitHub stats, a ticker of repo names and a link out. */
export default function GitHubCta() {
  const { publicRepos, followers, repoNames } = useGitHubProfile();
  const ticker = [...repoNames, ...repoNames];

  return (
    <FadeIn className="mx-auto mt-10 max-w-7xl md:mt-16">
      <div className="relative overflow-hidden rounded-[40px] border-2 border-[#D7E2EA]/30 bg-[#0C0C0C] sm:rounded-[50px] md:rounded-[60px]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full opacity-40 blur-3xl"
          style={{ background: BRAND_GRADIENT }}
        />
        <div className="relative flex flex-col gap-8 p-6 sm:p-10 md:flex-row md:items-end md:justify-between md:p-14">
          <div className="max-w-2xl">
            <Github aria-hidden="true" className="h-10 w-10 text-[#D7E2EA] md:h-12 md:w-12" strokeWidth={1.5} />
            <h3
              className="hero-heading mt-6 font-black uppercase leading-[0.95] tracking-tight"
              style={{ fontSize: 'clamp(2rem, 6vw, 5rem)' }}
            >
              There&apos;s more on GitHub
            </h3>
            <p className="mt-4 font-light text-[#D7E2EA] opacity-70" style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.15rem)' }}>
              AI tooling, APIs, algorithms, games and learning resources, all open source.
            </p>
            <dl className="mt-6 flex flex-wrap gap-6 text-[#D7E2EA]">
              <div className="flex items-center gap-2">
                <FolderGit2 size={18} aria-hidden="true" className="opacity-60" />
                <dt className="sr-only">Public repositories</dt>
                <dd className="font-medium">{publicRepos} public repositories</dd>
              </div>
              {followers > 0 && (
                <div className="flex items-center gap-2">
                  <Users size={18} aria-hidden="true" className="opacity-60" />
                  <dt className="sr-only">Followers</dt>
                  <dd className="font-medium">{followers} followers</dd>
                </div>
              )}
            </dl>
          </div>
          <ContactButton
            label="Visit my GitHub"
            href={GITHUB_URL}
            external
            icon={<ArrowUpRight size={18} aria-hidden="true" />}
            className="self-start md:self-auto"
          />
        </div>

        {/* Repo-name ticker: decorative, the list itself is on GitHub */}
        <div aria-hidden="true" className="relative overflow-hidden border-t border-[#D7E2EA]/15 py-4">
          <div className="ticker flex w-max gap-3">
            {ticker.map((name, i) => (
              <span
                key={i}
                className="whitespace-nowrap rounded-full border border-[#D7E2EA]/20 px-4 py-1.5 font-mono text-xs text-[#D7E2EA]/70 sm:text-sm"
              >
                {GITHUB_USER}/<span className="text-[#D7E2EA]">{name}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </FadeIn>
  );
}
