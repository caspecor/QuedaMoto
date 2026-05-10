import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/dashboard', '/profile', '/api', '/auth', '/test-role', '/test-session'],
    },
    sitemap: 'https://quedamoto.vercel.app/sitemap.xml',
  }
}
