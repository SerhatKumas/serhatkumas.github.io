import ContactButton from '../components/ContactButton';
import FadeIn from '../components/FadeIn';
import PageHeader from '../components/PageHeader';
import { usePageTitle } from '../hooks/usePageTitle';

export default function NotFoundPage() {
  usePageTitle('Page not found');
  return (
    <PageHeader eyebrow="404" title="Lost?" intro="This page doesn't exist, or it has moved.">
      <FadeIn immediate delay={0.45} y={20} className="mt-10">
        <ContactButton label="Back home" to="/" />
      </FadeIn>
    </PageHeader>
  );
}
