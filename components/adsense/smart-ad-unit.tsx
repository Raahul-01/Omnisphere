"use client"

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { AdUnit } from './ad-unit'

interface SmartAdUnitProps {
  contentType?: 'article' | 'category' | 'trending'
  position?: 'header' | 'sidebar' | 'in-content' | 'footer'
  className?: string
}

export function SmartAdUnit({ 
  contentType = 'article',
  position = 'in-content',
  className 
}: SmartAdUnitProps) {
  const { theme } = useTheme()
  const [viewability, setViewability] = useState(0)
  const [hasInteracted, setHasInteracted] = useState(false)

  useEffect(() => {
    // Track viewability
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          setViewability(entry.intersectionRatio)
        })
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    )

    // Track user interaction
    const handleInteraction = () => setHasInteracted(true)
    document.addEventListener('scroll', handleInteraction)
    document.addEventListener('click', handleInteraction)

    return () => {
      observer.disconnect()
      document.removeEventListener('scroll', handleInteraction)
      document.removeEventListener('click', handleInteraction)
    }
  }, [])

  // Get optimal ad format based on content type and position
  const getAdFormat = () => {
    switch (position) {
      case 'header':
        return 'horizontal'
      case 'sidebar':
        return 'vertical'
      case 'in-content':
        return contentType === 'article' ? 'in-article' : 'rectangle'
      case 'footer':
        return 'horizontal'
      default:
        return 'auto'
    }
  }

  // Get ad slot based on position and content type
  const getAdSlot = () => {
    const slots = {
      header: process.env.AD_HEADER_SLOT,
      sidebar: process.env.AD_SIDEBAR_SLOT,
      'in-content': process.env.AD_IN_ARTICLE_SLOT,
      footer: process.env.AD_FOOTER_SLOT
    }
    return slots[position] || process.env.AD_IN_ARTICLE_SLOT
  }

  // Optimize layout based on content type
  const getLayout = () => {
    if (contentType === 'article' && position === 'in-content') {
      return 'in-article'
    }
    return 'default'
  }

  // Only render ad if viewability is good and user has interacted
  if (viewability < 0.5 && !hasInteracted) {
    return null
  }

  return (
    <div className={className}>
      <AdUnit
        slot={getAdSlot()}
        format={getAdFormat()}
        layout={getLayout()}
        style={{
          opacity: Math.min(1, viewability + 0.2), // Fade in based on viewability
          transition: 'opacity 0.3s ease-in-out'
        }}
      />
    </div>
  )
} 