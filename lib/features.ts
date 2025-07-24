// Feature flags configuration
export interface FeatureFlags {
  Categories: boolean;
  Trending: boolean;
  Breaking: boolean;
  Home: boolean;
  Articles: boolean;
  Jobs: boolean;
  Bookmarks: boolean;
  Profile: boolean;
  Search: boolean;
}

// Default feature flags - all enabled
const defaultFeatures: FeatureFlags = {
  Categories: true,
  Trending: true,
  Breaking: true,
  Home: true,
  Articles: true,
  Jobs: true,
  Bookmarks: true,
  Profile: true,
  Search: true,
};

// Get feature flags from environment or use defaults
const getFeatureFlags = (): FeatureFlags => {
  if (typeof window === 'undefined') {
    // Server-side: use defaults
    return defaultFeatures;
  }
  
  // Client-side: could be extended to read from localStorage, API, etc.
  return defaultFeatures;
};

// Check if a feature is enabled
export function isFeatureEnabled(feature: keyof FeatureFlags): boolean {
  const features = getFeatureFlags();
  return features[feature] ?? false;
}

// Get all feature flags
export function getFeatures(): FeatureFlags {
  return getFeatureFlags();
}

// Enable/disable a feature (for future use)
export function setFeatureEnabled(feature: keyof FeatureFlags, enabled: boolean): void {
  if (typeof window !== 'undefined') {
    // Could store in localStorage for persistence
    console.log(`Feature ${feature} ${enabled ? 'enabled' : 'disabled'}`);
  }
}
