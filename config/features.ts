export interface FeatureConfig {
  enabled: boolean;
  description?: string;
}

export interface Features {
  [key: string]: FeatureConfig;
}

const features: Features = {
  userProfile: {
    enabled: true,
    description: "User profile management"
  },
  socialSharing: {
    enabled: true,
    description: "Social media sharing"
  },
  comments: {
    enabled: true,
    description: "Article comments"
  },
  bookmarks: {
    enabled: true,
    description: "Article bookmarks"
  },
  notifications: {
    enabled: true,
    description: "Push notifications"
  },
  darkMode: {
    enabled: true,
    description: "Dark mode support"
  },
  search: {
    enabled: true,
    description: "Advanced search"
  },
  analytics: {
    enabled: process.env.NODE_ENV === 'production',
    description: "Analytics tracking"
  }
};

export function isFeatureEnabled(featureName: string): boolean {
  const feature = features[featureName];
  return feature ? feature.enabled : false;
}

export function getFeature(featureName: string): FeatureConfig | undefined {
  return features[featureName];
}

export function getAllFeatures(): Features {
  return features;
}