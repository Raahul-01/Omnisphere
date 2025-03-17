interface FeatureFlags {
  [key: string]: boolean;
}

const features: FeatureFlags = {
  Categories: true,
  Search: true,
  Authentication: true,
  DarkMode: true,
  Comments: true,
  Bookmarks: true,
  Share: true,
  Analytics: process.env.NODE_ENV === 'production',
};

export function isFeatureEnabled(featureName: string): boolean {
  return features[featureName] ?? false;
}

export const featureFlags = {
  Home: true,
  Articles: true,
  'Jobs/Careers': false,
  'Trending News': true,
  'Best of Week': false,
  History: false,
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

export function isPageEnabled(path: string): boolean {
  const feature = pageFeatureMapping[path];
  return feature ? isFeatureEnabled(feature) : false;
} 