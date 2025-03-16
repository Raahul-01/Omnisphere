import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"
import { Navbar } from "@/components/navbar"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FF5722" },
    { media: "(prefers-color-scheme: dark)", color: "#FF5722" }
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export const metadata: Metadata = {
  title: {
    default: 'OmniSphere - AI-Powered News & Content Platform | Latest News, Analysis & Insights',
    template: '%s | OmniSphere - Your Trusted News Source'
  },
  description: 'OmniSphere delivers real-time, AI-powered news and analysis across global events, technology, business, and more. Get personalized updates, expert insights, and comprehensive coverage of breaking news. Your trusted source for accurate, timely information.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'OmniSphere - AI-Powered News & Content Platform | Latest News & Analysis',
    description: 'Stay ahead with OmniSphere - Your AI-powered news platform delivering real-time updates, in-depth analysis, and personalized content across global events, technology, business, and more.',
    url: '/',
    siteName: 'OmniSphere',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'OmniSphere - Your Trusted Source for News and Analysis'
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OmniSphere - Your AI-Powered News Source | Breaking News & Analysis',
    description: 'Get real-time news updates, in-depth analysis, and personalized content from OmniSphere. Your trusted source for global news, technology updates, and breaking stories.',
    images: ['/twitter-image.jpg'],
    creator: '@omnisphere',
    site: '@omnisphere',
  },
  keywords: [
    "breaking news", "latest news", "global news", "world news", "technology news",
    "business news", "AI news", "digital media", "current events", "real-time updates",
    "news analysis", "trending stories", "international news", "news platform",
    "news aggregator", "artificial intelligence news", "tech updates", "business insights",
    "market analysis", "political news", "economic news", "science news", "entertainment news",
    "sports updates", "health news", "environmental news", "education news", "innovation news",
    "startup news", "industry trends", "market trends", "OmniSphere news"
  ],
  authors: [
    { name: "OmniSphere News", url: "https://omnisphere.com/about" }
  ],
  creator: "OmniSphere Team",
  publisher: "OmniSphere News Network",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': 400,
      noimageindex: false,
    },
  },
  category: 'news',
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
  },
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
      'en-GB': '/en-GB',
      'es': '/es',
      'fr': '/fr',
    },
  },
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/fevicon.ico',
    apple: '/apple-touch-icon.png',
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#FF5722'
      }
    ]
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'OmniSphere - News & Analysis'
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="google-adsense-account" content={process.env.NEXT_PUBLIC_ADSENSE_ID} />
        <meta name="application-name" content="OmniSphere" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="OmniSphere" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#FF5722" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#FF5722" />

        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-16x16.png" type="image/png" sizes="16x16" />
        <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/favicon-192x192.png" type="image/png" sizes="192x192" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#FF5722" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.className} h-full`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          <Providers>
            {children}
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}

