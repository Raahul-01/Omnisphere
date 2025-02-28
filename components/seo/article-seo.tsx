"use client"

import Head from 'next/head'
import { usePathname } from 'next/navigation'

interface ArticleSEOProps {
  title: string
  description: string
  content: string
  author: {
    name: string
    image?: string
  }
  category: string
  publishedAt: string
  modifiedAt?: string
  image?: string
  tags?: string[]
  trendingKeywords?: string[]
  relatedQueries?: string[]
}

export function ArticleSEO({
  title,
  description,
  content,
  author,
  category,
  publishedAt,
  modifiedAt,
  image,
  tags = [],
  trendingKeywords = [],
  relatedQueries = []
}: ArticleSEOProps) {
  const pathname = usePathname()
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ominisphere.com'
  const url = `${baseUrl}${pathname}`

  // Generate optimized meta description
  const metaDescription = description || content.slice(0, 160).trim() + '...'

  // Combine all keywords for maximum SEO impact
  const allKeywords = Array.from(new Set([
    ...tags,
    ...trendingKeywords,
    ...relatedQueries,
    category,
    ...content.split(' ').slice(0, 20)
  ])).join(', ')

  // Enhanced schema markup for better search visibility
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: title,
    description: metaDescription,
    image: image ? [image] : undefined,
    datePublished: publishedAt,
    dateModified: modifiedAt || publishedAt,
    author: {
      '@type': 'Person',
      name: author.name,
      image: author.image
    },
    publisher: {
      '@type': 'Organization',
      name: 'OminiSphere',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url
    },
    articleSection: category,
    keywords: allKeywords,
    inLanguage: 'en',
    isAccessibleForFree: 'True',
    potentialAction: {
      '@type': 'ReadAction',
      target: [url]
    }
  }

  return (
    <Head>
      {/* Enhanced Meta Tags */}
      <title>{`${title} | Latest News & Analysis | OminiSphere`}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={allKeywords} />
      
      {/* SEO-optimized meta tags */}
      <meta name="robots" content="index, follow, max-image-preview:large" />
      <meta name="googlebot" content="index, follow" />
      <meta name="news_keywords" content={trendingKeywords.join(', ')} />

      {/* Open Graph Tags with enhanced properties */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content="article" />
      <meta property="og:url" content={url} />
      {image && <meta property="og:image" content={image} />}
      <meta property="og:site_name" content="OminiSphere" />
      <meta property="article:publisher" content={baseUrl} />
      <meta property="article:author" content={author.name} />

      {/* Enhanced Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@ominisphere" />
      <meta name="twitter:creator" content="@ominisphere" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={metaDescription} />
      {image && <meta name="twitter:image" content={image} />}

      {/* Article Specific Meta Tags */}
      <meta property="article:published_time" content={publishedAt} />
      {modifiedAt && <meta property="article:modified_time" content={modifiedAt} />}
      <meta property="article:section" content={category} />
      {tags.map(tag => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}

      {/* Schema.org JSON-LD with enhanced markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Canonical URL */}
      <link rel="canonical" href={url} />

      {/* Alternate language versions if you add them later */}
      <link rel="alternate" href={url} hrefLang="en" />
    </Head>
  )
} 