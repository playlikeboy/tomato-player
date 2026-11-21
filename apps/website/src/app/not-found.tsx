import { NotFound } from '@/components/pages/NotFound';

export const metadata = { title: 'Page not found', robots: { index: false } };

export default function Page() {
  return <NotFound />;
}
