import type { CSSProperties } from 'react'

export const editableRootStyle = {
  '--slot4-page-bg': '#f6f0e4',
  '--slot4-page-text': '#1d1714',
  '--slot4-panel-bg': '#efe3cf',
  '--slot4-surface-bg': '#fbf8f1',
  '--slot4-muted-text': '#645750',
  '--slot4-soft-muted-text': '#8f8176',
  '--slot4-accent': '#9b0f06',
  '--slot4-accent-fill': '#5e0006',
  '--slot4-accent-soft': '#eed9b9',
  '--slot4-dark-bg': '#2a0d0f',
  '--slot4-dark-text': '#fffaf3',
  '--slot4-media-bg': '#eadcca',
  '--slot4-cream': '#f6f0e4',
  '--slot4-warm': '#fbf8f1',
  '--slot4-lavender': '#d53e0f',
  '--slot4-gray': '#f1e8d8',
  '--slot4-body-gradient': 'radial-gradient(circle at top, rgba(238,217,185,0.6) 0%, rgba(246,240,228,0.92) 38%, #f8f4ec 100%)',
} as CSSProperties

export const editablePalette = {
  pageBg: 'bg-[var(--slot4-page-bg)]',
  pageText: 'text-[var(--slot4-page-text)]',
  panelBg: 'bg-[var(--slot4-panel-bg)]',
  panelText: 'text-[var(--slot4-page-text)]',
  surfaceBg: 'bg-[var(--slot4-surface-bg)]',
  surfaceText: 'text-[var(--slot4-page-text)]',
  mutedText: 'text-[var(--slot4-muted-text)]',
  softMutedText: 'text-[var(--slot4-soft-muted-text)]',
  accentText: 'text-[var(--slot4-accent)]',
  accentBg: 'bg-[var(--slot4-accent-fill)]',
  accentSoftBg: 'bg-[var(--slot4-accent-soft)]',
  accentSoftText: 'text-[var(--slot4-accent-soft)]',
  darkBg: 'bg-[var(--slot4-dark-bg)]',
  darkText: 'text-[var(--slot4-dark-text)]',
  mediaBg: 'bg-[var(--slot4-media-bg)]',
  creamBg: 'bg-[var(--slot4-cream)]',
  warmBg: 'bg-[var(--slot4-warm)]',
  lavenderBg: 'bg-[var(--slot4-lavender)]',
  grayBg: 'bg-[var(--slot4-gray)]',
  border: 'border-[rgba(94,0,6,0.14)]',
  darkBorder: 'border-[rgba(255,250,243,0.18)]',
  shadow: 'shadow-[0_18px_45px_rgba(94,0,6,0.08)]',
  shadowStrong: 'shadow-[0_34px_90px_rgba(94,0,6,0.16)]',
  overlay: 'bg-[linear-gradient(180deg,rgba(29,23,20,0.05),rgba(29,23,20,0.82))]',
} as const

export const editableDesignContract = {
  shell: {
    page: `min-h-screen ${editablePalette.pageBg} ${editablePalette.pageText}`,
    section: 'mx-auto w-full max-w-[1480px] px-4 sm:px-6 lg:px-10',
    sectionY: 'py-12 sm:py-16 lg:py-20',
    capsule: 'rounded-[2.6rem] border border-[rgba(94,0,6,0.14)] bg-[var(--slot4-surface-bg)] shadow-[0_24px_70px_rgba(94,0,6,0.08)]',
  },
  layout: {
    safeGrid: 'grid gap-5 md:grid-cols-2 xl:grid-cols-3',
    featureGrid: 'grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-start',
    rail: 'grid gap-4 md:grid-cols-2 xl:grid-cols-4',
    minRailCard: 'min-w-0',
  },
  type: {
    eyebrow: 'text-[11px] font-bold uppercase tracking-[0.24em]',
    heroTitle: 'text-[clamp(3.3rem,7vw,6.25rem)] font-semibold leading-[0.92] tracking-[-0.06em]',
    sectionTitle: 'text-[clamp(2.2rem,4vw,4rem)] font-semibold leading-[0.96] tracking-[-0.05em]',
    body: 'text-base leading-8',
  },
  surface: {
    card: `border ${editablePalette.border} ${editablePalette.surfaceBg} ${editablePalette.shadow}`,
    soft: `border ${editablePalette.border} bg-white/70 backdrop-blur-sm`,
    dark: `${editablePalette.darkBg} ${editablePalette.darkText}`,
  },
  button: {
    primary: 'inline-flex items-center justify-center gap-2 rounded-full bg-[var(--slot4-dark-bg)] px-7 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-[var(--slot4-dark-text)] transition hover:-translate-y-0.5 hover:bg-[var(--slot4-accent-fill)]',
    secondary: 'inline-flex items-center justify-center gap-2 rounded-full border border-[var(--slot4-accent-fill)]/30 bg-transparent px-7 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-[var(--slot4-page-text)] transition hover:-translate-y-0.5 hover:bg-[var(--slot4-accent-soft)]',
    accent: 'inline-flex items-center justify-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] px-7 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:-translate-y-0.5 hover:bg-[var(--slot4-dark-bg)]',
  },
  media: {
    frame: 'relative overflow-hidden rounded-[2rem] bg-[var(--slot4-media-bg)]',
    ratio: 'aspect-[4/3]',
  },
  motion: {
    lift: 'transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_55px_rgba(94,0,6,0.12)]',
    fade: 'transition duration-300 hover:opacity-80',
  },
} as const

export const aiLayoutRules = [
  'All visible layout decisions belong inside src/editable; keep data, SEO, API, and route logic untouched.',
  'Use the warm luxury-editorial palette with rounded panel modules, refined typography, and restrained motion.',
  'Keep dynamic post fetching intact and never replace backend posts with mock arrays.',
  'Use postHref() for all post links so route aliases and task-specific detail pages remain functional.',
  'Provide multiple post card styles across home, archive, and related content instead of repeating a single card layout.',
  'Branding must remain dynamic from SITE_CONFIG; never hardcode a reference publication name or logo.',
] as const
