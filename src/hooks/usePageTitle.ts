import { useEffect } from 'react';

const SITE = 'Serhat Kumas';

export function usePageTitle(page?: string) {
  useEffect(() => {
    document.title = page ? `${page} -- ${SITE}` : `${SITE} -- Solutions Architect`;
  }, [page]);
}
