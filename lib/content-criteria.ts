// Content criteria for checking articles and posts

export const contentCriteria = {
  minTitleLength: 10,
  maxTitleLength: 100,
  minContentLength: 100,
  maxContentLength: 10000,
  requiredFields: ['title', 'content', 'category'],
  bannedWords: ['spam', 'scam', 'hack', 'inappropriate'],
  allowedCategories: [
    'business',
    'technology',
    'science',
    'health',
    'entertainment',
    'sports',
    'politics',
    'world',
    'lifestyle',
    'education'
  ]
};

export function validateContent(content: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check required fields
  for (const field of contentCriteria.requiredFields) {
    if (!content[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  }
  
  // Check title length
  if (content.title) {
    if (content.title.length < contentCriteria.minTitleLength) {
      errors.push(`Title too short (minimum ${contentCriteria.minTitleLength} characters)`);
    }
    if (content.title.length > contentCriteria.maxTitleLength) {
      errors.push(`Title too long (maximum ${contentCriteria.maxTitleLength} characters)`);
    }
  }
  
  // Check content length
  if (content.content) {
    if (content.content.length < contentCriteria.minContentLength) {
      errors.push(`Content too short (minimum ${contentCriteria.minContentLength} characters)`);
    }
    if (content.content.length > contentCriteria.maxContentLength) {
      errors.push(`Content too long (maximum ${contentCriteria.maxContentLength} characters)`);
    }
  }
  
  // Check for banned words
  if (content.content) {
    for (const word of contentCriteria.bannedWords) {
      if (content.content.toLowerCase().includes(word.toLowerCase())) {
        errors.push(`Content contains banned word: ${word}`);
      }
    }
  }
  
  // Check category is allowed
  if (content.category && !contentCriteria.allowedCategories.includes(content.category.toLowerCase())) {
    errors.push(`Invalid category: ${content.category}. Allowed categories: ${contentCriteria.allowedCategories.join(', ')}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
} 