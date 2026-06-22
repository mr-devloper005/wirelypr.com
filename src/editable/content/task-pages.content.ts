import type { TaskKey } from '@/lib/site-config'

export type TaskPageVoice = {
  eyebrow: string
  headline: string
  description: string
  filterLabel: string
  secondaryNote: string
  chips: string[]
}

export const taskPageVoices = {
  mediaDistribution: {
    eyebrow: 'Newswire desk',
    headline: 'Distribution-ready releases with stronger editorial presence.',
    description: 'Browse announcements, updates, and media stories through a premium archive built for scanning, trust, and clarity.',
    filterLabel: 'Choose release category',
    secondaryNote: 'Every category received from the live feed remains supported automatically.',
    chips: ['Press-ready', 'Public updates', 'Distribution'],
  },
  article: {
    eyebrow: 'Editorial desk',
    headline: 'Long-form stories presented with a calmer premium rhythm.',
    description: 'Use this archive for feature writing, explainers, interviews, and supporting thought-leadership content.',
    filterLabel: 'Choose article topic',
    secondaryNote: 'Reading surfaces need space, hierarchy, and consistent flow.',
    chips: ['Feature stories', 'Analysis', 'Readable archive'],
  },
  classified: {
    eyebrow: 'Notice board',
    headline: 'Fast-moving listings with clear commercial signals.',
    description: 'Classified content should scan quickly while still feeling polished and dependable.',
    filterLabel: 'Filter classified category',
    secondaryNote: 'Prioritize urgency, summary, and clear response paths.',
    chips: ['Offers', 'Practical', 'Action-ready'],
  },
  sbm: {
    eyebrow: 'Curated links',
    headline: 'Saved resources arranged like an editorial reference shelf.',
    description: 'Bookmark pages should feel collected, organized, and genuinely useful for repeat discovery.',
    filterLabel: 'Filter collection',
    secondaryNote: 'Curated resources benefit from calm metadata and compact cards.',
    chips: ['Collections', 'Resources', 'Reference'],
  },
  profile: {
    eyebrow: 'Profile desk',
    headline: 'People and brand profiles with stronger identity cues.',
    description: 'Profile pages should foreground who or what the visitor is viewing before the supporting body content begins.',
    filterLabel: 'Filter profile category',
    secondaryNote: 'Make identity, trust, and recognition easier to scan.',
    chips: ['Identity', 'Trust', 'Visibility'],
  },
  pdf: {
    eyebrow: 'Document library',
    headline: 'Reports, guides, and files presented as a premium library.',
    description: 'Document pages should feel structured, browsable, and clearly distinct from standard article content.',
    filterLabel: 'Filter document type',
    secondaryNote: 'Document surfaces need archive cues and direct access.',
    chips: ['Documents', 'Guides', 'Library'],
  },
  listing: {
    eyebrow: 'Directory desk',
    headline: 'Business listings built for discovery, comparison, and contact.',
    description: 'Directory content should make location, service cues, and direct actions feel immediate.',
    filterLabel: 'Filter business category',
    secondaryNote: 'Prioritize comparison, location, and practical next steps.',
    chips: ['Directory', 'Discovery', 'Business'],
  },
  image: {
    eyebrow: 'Visual desk',
    headline: 'Image-led stories with a gallery-forward presentation.',
    description: 'Visual pages should let imagery lead while keeping metadata and summary accessible.',
    filterLabel: 'Filter visual category',
    secondaryNote: 'Let images carry the experience before long text does.',
    chips: ['Gallery', 'Visual-first', 'Portfolio'],
  },
} satisfies Record<TaskKey, TaskPageVoice>
