import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const globalContent = {
  site: {
    name: slot4BrandConfig.siteName,
    tagline: slot4BrandConfig.tagline || '',
    domain: slot4BrandConfig.domain,
    baseUrl: slot4BrandConfig.baseUrl,
  },
  nav: {
    tagline: 'Premium media distribution',
    primaryLinks: [
      { label: 'Newsroom', href: '/mediaDistribution' },
      { label: 'Services', href: '/article' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'About Us', href: '/about' },
    ],
    actions: {
      primary: { label: 'Register', href: '/signup' },
      secondary: { label: 'Sign In', href: '/login' },
    },
  },
  footer: {
    tagline: 'Luxury editorial distribution for modern media teams.',
    description: 'Distribute stories, publish announcements, and organize media-ready updates through a refined editorial experience built for visibility and trust.',
    columns: [
      {
        title: 'Services',
        links: [
          { label: 'Media Distribution', href: '/mediaDistribution' },
          { label: 'Articles', href: '/article' },
          { label: 'Image Desk', href: '/image' },
          { label: 'Document Library', href: '/pdf' },
        ],
      },
      {
        title: 'Company',
        links: [
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
          { label: 'Search', href: '/search' },
        ],
      },
    ],
    bottomNote: 'Designed for thoughtful releases, clearer reach, and stronger public presence.',
  },
  commonLabels: {
    readMore: 'Read more',
    viewAll: 'View all',
    explore: 'Explore',
    latest: 'Latest',
    related: 'Related',
    published: 'Published',
  },
} as const
