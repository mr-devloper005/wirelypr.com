import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const pagesContent = {
  home: {
    metadata: {
      title: 'Media distribution, releases, and public updates',
      description: 'Discover media-ready announcements, editorial features, public updates, and distribution-focused content through a premium newsroom experience.',
      openGraphTitle: 'Media distribution, releases, and public updates',
      openGraphDescription: 'A premium editorial surface for releases, stories, visuals, and media distribution content.',
      keywords: ['media distribution', 'press release platform', 'newsroom content', 'editorial archive'],
    },
    hero: {
      badge: 'Media distribution platform',
      title: ['Press release distribution', 'with a premium editorial feel.'],
      description: 'Reach media buyers, distribution partners, and public audiences through structured releases, polished story presentation, and easier archive discovery.',
      primaryCta: { label: 'Send a Press Release', href: '/signup' },
      secondaryCta: { label: 'Request a Demo', href: '/contact' },
      searchPlaceholder: 'Search releases, categories, and public updates',
      focusLabel: 'Focus',
      featureCardBadge: 'Featured distribution',
      featureCardTitle: 'Stronger structure for higher-visibility announcements.',
      featureCardDescription: 'Present the latest releases with more authority, better scanning, and a cleaner editorial rhythm.',
    },
    intro: {
      badge: 'What this platform supports',
      title: 'Built to help distribution teams publish, organize, and amplify stories.',
      paragraphs: [
        'The experience blends newsroom structure with premium product presentation so releases feel discoverable, intentional, and easier to trust.',
        'Large feature moments, cleaner archive views, and sharper content blocks help visitors move from overview to detail without friction.',
        'Every section stays connected, from major announcements to supporting visuals, company listings, and downloadable documents.',
      ],
      sideBadge: 'Platform highlights',
      sidePoints: [
        'Feature-led homepage with search and editorial sections.',
        'Archive pages that balance discovery, filtering, and hierarchy.',
        'Detail pages built for readable releases and supporting media.',
        'A calmer premium interface that still works with live post feeds.',
      ],
      primaryLink: { label: 'Browse releases', href: '/mediaDistribution' },
      secondaryLink: { label: 'Open articles', href: '/article' },
    },
    cta: {
      badge: 'Ready to publish',
      title: 'Shape how your next story is seen, scanned, and shared.',
      description: 'Move from announcement to polished distribution with a platform designed for premium presentation and practical discovery.',
      primaryCta: { label: 'Create account', href: '/signup' },
      secondaryCta: { label: 'Talk to us', href: '/contact' },
    },
    taskSection: {
      heading: 'Latest {label}',
      descriptionSuffix: 'Browse the newest posts in this section.',
    },
  },
  about: {
    badge: 'About the platform',
    title: 'A refined distribution experience for modern media workflows.',
    description: `${slot4BrandConfig.siteName} brings together announcements, newsroom updates, supporting media, and resource content in one polished editorial system.`,
    paragraphs: [
      'The platform is designed to make releases feel easier to browse and stronger to present, with cleaner hierarchy from the homepage through the archive and detail layers.',
      'Whether visitors arrive for a story, a company profile, a resource, or a visual post, they can keep exploring through a connected and readable interface.',
    ],
    values: [
      {
        title: 'Editorial clarity',
        description: 'Every surface prioritizes hierarchy, pacing, and readability so important updates feel easier to understand.',
      },
      {
        title: 'Distribution-ready structure',
        description: 'Cards, detail pages, and archive patterns are tuned for media discovery instead of generic blog presentation.',
      },
      {
        title: 'Connected content ecosystem',
        description: 'Releases, visuals, listings, documents, and profiles stay discoverable as part of one consistent public experience.',
      },
    ],
  },
  contact: {
    eyebrow: `Contact ${slot4BrandConfig.siteName}`,
    title: 'Talk through your next release, campaign, or publishing workflow.',
    description: 'Share what you are preparing and we will guide you toward the right publishing, distribution, or support path.',
    formTitle: 'Send a message',
  },
  search: {
    metadata: {
      title: 'Search',
      description: 'Search posts, topics, categories, and content across the site.',
    },
    hero: {
      badge: 'Search the archive',
      title: 'Find releases, features, visuals, and resources faster.',
      description: 'Use keywords and categories to move through every active content stream from one search surface.',
      placeholder: 'Search by keyword, category, title, or topic',
    },
    resultsTitle: 'Search results',
  },
  create: {
    metadata: {
      title: 'Create',
      description: 'Create and submit new content for the site.',
    },
    locked: {
      badge: 'Creator access',
      title: 'Login to open the publishing workspace.',
      description: 'Use your account to prepare releases, upload details, and manage content submission through the site.',
    },
    hero: {
      badge: 'Publishing workspace',
      title: 'Create content for every active distribution lane.',
      description: 'Choose the content type, add supporting details, and prepare a clean, media-ready post.',
    },
    formTitle: 'Content details',
    submitLabel: 'Submit content',
    successTitle: 'Content submitted successfully.',
  },
  auth: {
    login: {
      metadataDescription: 'Login page for this site.',
      badge: 'Member access',
      title: 'Welcome back to your publishing desk.',
      description: 'Login to continue browsing, managing submissions, and creating new content from your account.',
      formTitle: 'Login',
      submitLabel: 'Continue',
      noAccount: 'No account matched these details. Create an account first, then login.',
      success: 'Login successful. Redirecting...',
      createCta: 'Create an account',
    },
    signup: {
      metadataDescription: 'Signup page for this site.',
      badge: 'Site access',
      title: 'Create your account and start distributing stories.',
      description: 'Create an account to access the publishing workspace, save details, and submit content through the site.',
      formTitle: 'Create account',
      submitLabel: 'Create account',
      passwordShort: 'Use at least 4 characters for the password.',
      success: 'Account created successfully. Redirecting...',
      loginCta: 'Login',
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'Related articles',
      fallbackTitle: 'Article details',
    },
    listing: {
      relatedTitle: 'Related listings',
      fallbackTitle: 'Listing details',
    },
    image: {
      relatedTitle: 'Related visuals',
      fallbackTitle: 'Image details',
    },
    profile: {
      relatedTitle: 'Suggested articles',
      fallbackDescription: 'Profile details will appear here once available.',
      visitButton: 'Visit Official Site',
    },
  },
} as const
