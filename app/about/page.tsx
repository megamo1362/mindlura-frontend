import { getServerGeoLang } from '@/lib/geo';
import { AboutPageContent } from '@/components/pages/AboutPage';

export const metadata = {
  title: { absolute: 'About — Mindlura' },
  description:
    "Mindlura was built by people who worked inside brokerages and watched traders lose accounts not because of bad strategy, but because of behavioral patterns they couldn't see.",
  openGraph: { locale: 'en_US' },
};

export default async function AboutPage() {
  const lang = await getServerGeoLang();
  return <AboutPageContent lang={lang} />;
}
