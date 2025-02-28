"use client"

import { useEffect } from 'react'
import { useTheme } from 'next-themes'

interface AdUnitProps {
  slot: string
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical'
  layout?: 'in-article' | 'in-feed' | 'default'
  style?: React.CSSProperties
  className?: string
}

export function AdUnit({ 
  slot, 
  format = 'auto',
  layout = 'default',
  style,
  className 
}: AdUnitProps) {
  const { theme } = useTheme()

  useEffect(() => {
    try {
      // Load AdSense script if not already loaded
      if (!(window as any).adsbygoogle) {
        const script = document.createElement('script')
        script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'
        script.async = true
        script.crossOrigin = 'anonymous'
        script.dataset.adClient = process.env.NEXT_PUBLIC_ADSENSE_ID || ''
        document.head.appendChild(script)
      }

      // Push the ad unit
      ;(window as any).adsbygoogle = (window as any).adsbygoogle || []
      ;(window as any).adsbygoogle.push({})
    } catch (error) {
      console.error('AdSense error:', error)
    }
  }, [])

  const getAdStyle = () => {
    const baseStyle: React.CSSProperties = {
      display: 'block',
      textAlign: 'center',
      ...style
    }

    // Add format-specific styles
    switch (format) {
      case 'horizontal':
        return {
          ...baseStyle,
          minHeight: '90px',
          width: '100%',
          maxWidth: '728px',
          margin: '0 auto'
        }
      case 'vertical':
        return {
          ...baseStyle,
          minHeight: '600px',
          width: '160px'
        }
      case 'rectangle':
        return {
          ...baseStyle,
          minHeight: '250px',
          width: '300px'
        }
      default:
        return baseStyle
    }
  }

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={getAdStyle()}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
        data-ad-layout={layout !== 'default' ? layout : undefined}
        data-theme-mode={theme}
      />
    </div>
  )
} 