import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"
import { Navbar } from "@/components/navbar"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://ominisphere.com'),
  title: {
    default: "OmniSphere - Your Global News Platform",
    template: "%s | OmniSphere News"
  },
  description: "Stay informed with the latest breaking news, trending stories, and in-depth analysis from around the world. OmniSphere delivers real-time updates on global events, technology, business, and more.",
  keywords: [
    "news", "global news", "breaking news", "trending news", "world news",
    "technology news", "business news", "AI news", "digital media",
    "current events", "real-time updates", "news analysis", "trending stories",
    "international news", "news platform", "news aggregator"
  ],
  authors: [{ name: "OmniSphere News" }],
  creator: "OmniSphere Team",
  publisher: "OmniSphere News Network",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'OmniSphere',
    title: 'OmniSphere - AI-Powered Global News Platform',
    description: 'Your source for real-time news, trending stories, and in-depth analysis powered by AI.',
    images: ['/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OmniSphere News',
    description: 'AI-Powered Global News Platform',
    creator: '@ominisphere',
    images: ['/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'news',
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
    },
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
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#000000" />

        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="/favicon.ico" />
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

