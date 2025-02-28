export const featureFlags = {
  Home: true,
  Articles: true,
  'Jobs/Careers': false,
  'Trending News': true,
  Categories: true,
  'Best of Week': false,
  History: false,
  Bookmarks: false,
  Biography: true
} as const;

export type FeatureFlag = keyof typeof featureFlags;

export const pageFeatureMapping: Record<string, FeatureFlag> = {
  '/': 'Home',
  '/articles': 'Articles',
  '/jobs': 'Jobs/Careers',
  '/trending': 'Trending News',
  '/categories': 'Categories',
  '/best-of-week': 'Best of Week',
  '/history': 'History',
  '/bookmarks': 'Bookmarks',
  '/biography': 'Biography'
};

export function isFeatureEnabled(feature: FeatureFlag): boolean {
  return featureFlags[feature] ?? false;
}

export function isPageEnabled(path: string): boolean {
  const feature = pageFeatureMapping[path];
  return feature ? isFeatureEnabled(feature) : false;
} 