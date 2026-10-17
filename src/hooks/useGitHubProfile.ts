import { useEffect, useState } from 'react';
import { GITHUB_USER } from '../data/projects';

type GitHubProfile = { publicRepos: number; followers: number; repoNames: string[] };

// Shown until (or if) the live request fails, e.g. offline or rate-limited.
const FALLBACK: GitHubProfile = {
  publicRepos: 43,
  followers: 0,
  repoNames: [
    'serhatkumas.github.io',
    'AI--AgentSOPandAuditWorkspace',
    'Flask--ExternalDialogflowApi',
    'SoftwareEngineering--CryptographyAndCryptographicAlgorithms',
    'SoftwareEngineering--DataStructures',
    'SpringBoot--BasicReservationSystem',
    'Flask--UserFollowerCountApi',
    'FrontendDev--BasicsOfVue',
    'Python--BasicsCourseInTurkish',
    'Javascript--SMTPMailerApplications',
  ],
};

let cache: GitHubProfile | null = null;

/** Public GitHub stats, fetched once per page load (unauthenticated API, 60 requests/hour per visitor). */
export function useGitHubProfile() {
  const [profile, setProfile] = useState<GitHubProfile>(cache ?? FALLBACK);

  useEffect(() => {
    if (cache) return;
    const controller = new AbortController();
    const base = `https://api.github.com/users/${GITHUB_USER}`;
    Promise.all([
      fetch(base, { signal: controller.signal }).then((r) => (r.ok ? r.json() : Promise.reject(r.status))),
      fetch(`${base}/repos?per_page=100&sort=pushed`, { signal: controller.signal }).then((r) => (r.ok ? r.json() : Promise.reject(r.status))),
    ])
      .then(([user, repos]: [{ public_repos: number; followers: number }, { name: string; fork: boolean }[]]) => {
        cache = {
          publicRepos: user.public_repos,
          followers: user.followers,
          repoNames: repos.filter((r) => !r.fork && r.name !== GITHUB_USER).map((r) => r.name),
        };
        setProfile(cache);
      })
      .catch(() => {
        /* keep the fallback */
      });
    return () => controller.abort();
  }, []);

  return profile;
}
