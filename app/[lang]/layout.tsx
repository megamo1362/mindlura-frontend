import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return [{ lang: 'fa' }];
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (lang !== 'fa') notFound();

  return <>{children}</>;
}
