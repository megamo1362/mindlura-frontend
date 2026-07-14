import type { Lang } from './copy';

export type { Lang };

// Shared props every redesign section receives from RedesignHomePage.
export interface SectionChrome {
  lang: Lang;
  isFa: boolean;
  accent: string;
  displayFont: string;
  bodyFont: string;
  localizeHref: (href: string) => string;
}
