// Suppress warnings
if (process.env.NODE_ENV === 'development') {
  process.env.NODE_NO_WARNINGS = '1';
}

// Handle warnings
if (typeof process !== 'undefined') {
  process.on('warning', (warning) => {
    if (warning.name === 'DeprecationWarning' && warning.message.includes('punycode')) {
      return;
    }
    console.warn(warning);
  });
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'firebasestorage.googleapis.com',
      'api.dicebear.com',
      'picsum.photos',
      'upload.wikimedia.org',
      'electrek.co',
      'assets.nintendo.com',
      'images.unsplash.com',
      'images.pexels.com',
      'wp-content',
      'ui-avatars.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      }
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    minimumCacheTTL: 60,
    unoptimized: true
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb'
    }
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
    };
    return config;
  },
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-DNS-Prefetch-Control',
          value: 'on'
        },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=63072000; includeSubDomains; preload'
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block'
        },
        {
          key: 'X-Frame-Options',
          value: 'SAMEORIGIN'
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff'
        },
        {
          key: 'Referrer-Policy',
          value: 'origin-when-cross-origin'
        },
        {
          key: 'Content-Security-Policy',
          value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://pagead2.googlesyndication.com https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: http: blob:; media-src 'none'; connect-src 'self' https://firestore.googleapis.com https://www.googleapis.com; font-src 'self' data:; frame-src 'self' https://pagead2.googlesyndication.com;"
        }
      ]
    }
  ],
  // Add a rewrite rule to proxy external images
  async rewrites() {
    return [
      {
        source: '/api/proxy-image/:path*',
        destination: '/api/proxy-image',
      },
    ]
  },
}

module.exports = nextConfig 