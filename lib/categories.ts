import { 
  Globe2, 
  Briefcase, 
  Film, 
  Trophy, 
  Cpu, 
  Heart, 
  Car, 
  Plane, 
  Utensils, 
  Music, 
  Gamepad2, 
  GraduationCap,
  Microscope,
  Shirt,
  DollarSign,
  Building2,
  LandPlot,
  BarChart3,
  Atom,
  Users,
  type LucideIcon
} from "lucide-react"

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string; // Change to string instead of component
  color: string;
  gradient: string;
  description: string;
  count?: number;
}

export interface CategoryWithStats extends Category {
  count: number;
  latestArticle?: {
    title: string;
    image: string;
  };
}

// Icon map for client components
export const ICON_MAP: Record<string, LucideIcon> = {
  Globe2,
  Briefcase,
  Film,
  Trophy,
  Cpu,
  Heart,
  Car,
  Plane,
  Utensils,
  Music,
  Gamepad2,
  GraduationCap,
  Microscope,
  Shirt,
  DollarSign,
  Building2,
  LandPlot,
  BarChart3,
  Atom,
  Users
};

// Centralized category configuration - Single source of truth
export const CATEGORIES: Category[] = [
  {
    id: "global",
    name: "Global",
    slug: "global",
    iconName: "Globe2", // Use string instead of component
    color: "text-blue-500",
    gradient: "from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20",
    description: "International news and global affairs"
  },
  {
    id: "politics",
    name: "Politics",
    slug: "politics",
    iconName: "Users", // Use string instead of component
    color: "text-red-500",
    gradient: "from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20",
    description: "Political news and government affairs"
  },
  {
    id: "business",
    name: "Business",
    slug: "business",
    iconName: "Briefcase",
    color: "text-green-500",
    gradient: "from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20",
    description: "Business news, markets, and corporate updates"
  },
  {
    id: "technology",
    name: "Technology",
    slug: "technology",
    iconName: "Cpu",
    color: "text-blue-600",
    gradient: "from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20",
    description: "Tech news, innovations, and digital trends"
  },
  {
    id: "science",
    name: "Science",
    slug: "science",
    iconName: "Atom",
    color: "text-purple-500",
    gradient: "from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20",
    description: "Scientific discoveries and research"
  },
  {
    id: "health",
    name: "Health",
    slug: "health",
    iconName: "Heart",
    color: "text-pink-500",
    gradient: "from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20",
    description: "Health, wellness, and medical news"
  },
  {
    id: "entertainment",
    name: "Entertainment",
    slug: "entertainment",
    iconName: "Film",
    color: "text-purple-600",
    gradient: "from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20",
    description: "Movies, TV, celebrities, and entertainment news"
  },
  {
    id: "sports",
    name: "Sports",
    slug: "sports",
    iconName: "Trophy",
    color: "text-orange-500",
    gradient: "from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20",
    description: "Sports news, scores, and athlete updates"
  },
  {
    id: "finance",
    name: "Finance",
    slug: "finance",
    iconName: "DollarSign",
    color: "text-emerald-500",
    gradient: "from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20",
    description: "Financial markets, investing, and economic news"
  },
  {
    id: "automotive",
    name: "Automotive",
    slug: "automotive",
    iconName: "Car",
    color: "text-gray-600",
    gradient: "from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20",
    description: "Car news, reviews, and automotive industry updates"
  },
  {
    id: "travel",
    name: "Travel",
    slug: "travel",
    iconName: "Plane",
    color: "text-sky-500",
    gradient: "from-sky-50 to-sky-100 dark:from-sky-900/20 dark:to-sky-800/20",
    description: "Travel guides, destinations, and tourism news"
  },
  {
    id: "food",
    name: "Food",
    slug: "food",
    iconName: "Utensils",
    color: "text-amber-500",
    gradient: "from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20",
    description: "Food, recipes, restaurants, and culinary trends"
  },
  {
    id: "music",
    name: "Music",
    slug: "music",
    iconName: "Music",
    color: "text-violet-500",
    gradient: "from-violet-50 to-violet-100 dark:from-violet-900/20 dark:to-violet-800/20",
    description: "Music news, artist updates, and industry trends"
  },
  {
    id: "gaming",
    name: "Gaming",
    slug: "gaming",
    iconName: "Gamepad2",
    color: "text-indigo-500",
    gradient: "from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20",
    description: "Video games, esports, and gaming industry news"
  },
  {
    id: "education",
    name: "Education",
    slug: "education",
    iconName: "GraduationCap",
    color: "text-blue-700",
    gradient: "from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20",
    description: "Education news, learning resources, and academic updates"
  },
  {
    id: "fashion",
    name: "Fashion",
    slug: "fashion",
    iconName: "Shirt",
    color: "text-pink-600",
    gradient: "from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20",
    description: "Fashion trends, style guides, and industry news"
  },
  {
    id: "real-estate",
    name: "Real Estate",
    slug: "real-estate",
    iconName: "Building2",
    color: "text-stone-600",
    gradient: "from-stone-50 to-stone-100 dark:from-stone-900/20 dark:to-stone-800/20",
    description: "Property market, real estate trends, and housing news"
  },
  {
    id: "lifestyle",
    name: "Lifestyle",
    slug: "lifestyle",
    iconName: "LandPlot",
    color: "text-teal-500",
    gradient: "from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20",
    description: "Lifestyle, culture, and personal development"
  }
];

// Helper functions
export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find(cat => cat.slug.toLowerCase() === slug.toLowerCase());
}

export function getCategoryById(id: string): Category | undefined {
  return CATEGORIES.find(cat => cat.id === id);
}

export function getCategoryByName(name: string): Category | undefined {
  return CATEGORIES.find(cat => cat.name.toLowerCase() === name.toLowerCase());
}

export function getAllCategoryNames(): string[] {
  return CATEGORIES.map(cat => cat.name);
}

export function getAllCategorySlugs(): string[] {
  return CATEGORIES.map(cat => cat.slug);
}

export function getCategoriesForTabs() {
  return [
    { value: "all", label: "All" },
    ...CATEGORIES.map(cat => ({
      value: cat.slug,
      label: cat.name
    }))
  ];
}

export function getCategoriesForHomePage() {
  // Return the top 4 most important categories for the home page
  return CATEGORIES.filter(cat => 
    ['technology', 'business', 'science', 'global'].includes(cat.id)
  );
}

// Legacy name mappings for backward compatibility
export const LEGACY_NAME_MAPPINGS: Record<string, string> = {
  "Sport": "Sports",
  "World": "Global",
  "World News": "Global",
  "Tech": "Technology",
  "Politics": "Politics",
  "Entertainment": "Entertainment",
  "Business": "Business",
  "Science": "Science",
  "Health": "Health"
};

export function normalizeCategoryName(name: string): string {
  return LEGACY_NAME_MAPPINGS[name] || name;
}

// Color mappings for backward compatibility
export const categoryColors: Record<string, string> = {
  Technology: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
  Business: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400',
  Science: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
  Global: 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
  Politics: 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400',
  Entertainment: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
  Sports: 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
  Health: 'bg-pink-100 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400',
  Finance: 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
  Education: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
  Lifestyle: 'bg-teal-100 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400'
};
