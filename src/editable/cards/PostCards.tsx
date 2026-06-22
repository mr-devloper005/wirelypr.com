import Link from 'next/link'
import { ArrowRight, Clock3, Play, Sparkles } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'
import { CoverMedia } from '@/editable/cards/CoverMedia.client'

function getPostContent(post?: SitePost | null) {
  return post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
}

function isImageUrl(value: unknown): value is string {
  return typeof value === 'string' && Boolean(value) && (value.startsWith('/') || /^https?:\/\//i.test(value))
}

export function getEditableCoverImage(post?: SitePost | null) {
  const media = Array.isArray(post?.media) ? post.media : []
  const mediaUrl = media.find((item) => isImageUrl(item?.url))?.url
  const content = getPostContent(post)
  const images = Array.isArray(content.images) ? content.images.filter(isImageUrl) : []
  const directImage = ['featuredImage', 'image', 'thumbnail', 'coverImage']
    .map((key) => content[key])
    .find(isImageUrl)
  return mediaUrl || directImage || images[0] || null
}

export function hasEditableCoverImage(post?: SitePost | null) {
  const image = getEditableCoverImage(post)
  return Boolean(image) && !String(image).includes('/placeholder.svg')
}

export function getEditablePostImage(post?: SitePost | null) {
  const coverImage = getEditableCoverImage(post)
  if (coverImage) return coverImage
  const content = getPostContent(post)
  const fallbackImage = ['logo', 'avatar']
    .map((key) => content[key])
    .find(isImageUrl)
  return fallbackImage || '/placeholder.svg?height=900&width=1400'
}

export function getEditableExcerpt(post?: SitePost | null, limit = 150) {
  const content = getPostContent(post)
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    (typeof content.excerpt === 'string' && content.excerpt) ||
    (typeof content.body === 'string' && content.body) ||
    post?.summary ||
    ''
  const clean = raw.replace(/<[^>]*>/g, ' ').replace(/&[a-z]+;/gi, ' ').replace(/\s+/g, ' ').trim()
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean || 'Explore the full story inside this release.'
}

export function getEditableCategory(post?: SitePost | null) {
  const content = getPostContent(post)
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || 'Latest'
}

export function postHref(task: TaskKey, post: SitePost, route = `/${task}`) {
  return `${route}/${post.slug}`
}

function DecorativeVisual({ label = 'Distribution' }: { label?: string }) {
  return (
    <div className="relative flex h-full min-h-[14rem] items-center justify-center bg-[linear-gradient(180deg,rgba(238,217,185,0.55),rgba(255,255,255,0.9))]">
      <div className="wirely-outline relative flex aspect-[16/9] w-[78%] max-w-[28rem] items-center justify-center rounded-[1.8rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.65),rgba(213,62,15,0.08))]">
        <div className="wirely-knot -left-7 bottom-[-0.8rem]" />
        <div className="absolute -top-16 right-[-2%] h-36 w-px bg-[rgba(94,0,6,0.7)]" />
        <div className="absolute -left-16 bottom-0 h-px w-24 bg-[rgba(94,0,6,0.7)]" />
        <div className="wirely-orb flex h-16 w-16 items-center justify-center rounded-full shadow-[0_18px_40px_rgba(94,0,6,0.12)]">
          <Play className="ml-1 h-7 w-7 text-[var(--slot4-accent-fill)]" fill="currentColor" />
        </div>
        <div className="absolute inset-x-0 bottom-10 text-center">
          <p className="text-3xl font-semibold tracking-[-0.05em] text-[var(--slot4-page-text)]">{label}</p>
          <p className="mt-2 text-sm font-medium text-[var(--slot4-muted-text)]">Send your story with clarity.</p>
        </div>
      </div>
    </div>
  )
}

export function EditorialFeatureCard({ post, href, label = 'Featured release' }: { post: SitePost; href: string; label?: string }) {
  const image = getEditableCoverImage(post)
  return (
    <Link href={href} className={`group block min-w-0 overflow-hidden rounded-[2.2rem] border ${pal.border} bg-[var(--slot4-surface-bg)] ${dc.motion.lift}`}>
      <div className="grid min-h-[28rem] lg:grid-cols-[1fr_1.08fr]">
        <div className="relative order-2 flex flex-col justify-end p-6 sm:p-8 lg:order-1 lg:p-10">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[var(--slot4-accent-soft)] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--slot4-accent-fill)]">
            <Sparkles className="h-3.5 w-3.5" />
            {label}
          </span>
          <h3 className="editorial-serif mt-6 text-4xl font-semibold leading-[0.95] tracking-[-0.055em] sm:text-5xl">{post.title}</h3>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-[var(--slot4-muted-text)] sm:text-base">{getEditableExcerpt(post, 200)}</p>
          <span className="mt-7 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[var(--slot4-accent-fill)]">
            Read feature
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </span>
        </div>
        <div className="order-1 lg:order-2">
          <CoverMedia
            src={image}
            alt={post.title}
            containerClassName="relative h-full min-h-[18rem] overflow-hidden bg-[var(--slot4-media-bg)]"
            imageClassName="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
            fallback={<DecorativeVisual label="Distribution" />}
          />
        </div>
      </div>
    </Link>
  )
}

export function RailPostCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group ${dc.layout.minRailCard} block rounded-[1.9rem] border ${pal.border} bg-white/90 p-4 ${dc.motion.lift}`}>
      <div className="flex items-center justify-between gap-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--slot4-accent-fill)]">
        <span>{getEditableCategory(post)}</span>
        <span>{String(index + 1).padStart(2, '0')}</span>
      </div>
      <h3 className="mt-3 line-clamp-3 text-xl font-semibold leading-[1.05] tracking-[-0.04em]">{post.title}</h3>
      <p className="mt-3 line-clamp-3 text-sm leading-7 text-[var(--slot4-muted-text)]">{getEditableExcerpt(post, 150)}</p>
    </Link>
  )
}

export function CompactIndexCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group grid min-w-0 grid-cols-[48px_1fr] gap-4 rounded-[1.6rem] border border-[rgba(94,0,6,0.1)] bg-white/70 px-4 py-4 transition hover:bg-white">
      <span className="text-3xl font-semibold leading-none text-[var(--slot4-accent-fill)]">{String(index + 1).padStart(2, '0')}</span>
      <div className="min-w-0">
        <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--slot4-soft-muted-text)]">
          <Clock3 className="h-3 w-3" />
          {getEditableCategory(post)}
        </p>
        <h3 className="mt-2 line-clamp-3 text-lg font-semibold leading-tight tracking-[-0.03em] group-hover:text-[var(--slot4-accent-fill)]">{post.title}</h3>
      </div>
    </Link>
  )
}

export function ArticleListCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getEditableCoverImage(post)
  return (
    <Link href={href} className="group grid min-w-0 gap-5 rounded-[2rem] border border-[rgba(94,0,6,0.12)] bg-white/80 p-5 transition hover:bg-white sm:grid-cols-[260px_minmax(0,1fr)]">
      <CoverMedia
        src={image}
        alt={post.title}
        containerClassName="relative aspect-[16/10] overflow-hidden rounded-[1.6rem] bg-[var(--slot4-media-bg)]"
        imageClassName="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
        fallback={<div className="flex aspect-[16/10] items-center justify-center rounded-[1.6rem] bg-[linear-gradient(180deg,rgba(238,217,185,0.45),rgba(255,255,255,0.92))]"><div className="wirely-outline flex h-16 w-16 items-center justify-center rounded-full text-[var(--slot4-accent-fill)]"><Sparkles className="h-6 w-6" /></div></div>}
      />
      <div className="min-w-0">
        <p className={`${dc.type.eyebrow} ${pal.accentText}`}>{String(index + 1).padStart(2, '0')} / {getEditableCategory(post)}</p>
        <h2 className="editorial-serif mt-3 line-clamp-3 text-3xl font-semibold leading-[1] tracking-[-0.05em] group-hover:text-[var(--slot4-accent-fill)]">{post.title}</h2>
        <p className={`mt-4 line-clamp-3 text-sm leading-7 ${pal.mutedText}`}>{getEditableExcerpt(post, 190)}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em]">Read story <ArrowRight className="h-4 w-4" /></span>
      </div>
    </Link>
  )
}

export function HorizontalFeatureCard({
  post,
  href,
  label = 'Featured insight',
}: {
  post: SitePost
  href: string
  label?: string
}) {
  const image = getEditableCoverImage(post)
  return (
    <Link href={href} className="group grid overflow-hidden rounded-[2.3rem] border border-[rgba(94,0,6,0.12)] bg-white shadow-[0_20px_55px_rgba(94,0,6,0.08)] lg:grid-cols-[0.95fr_1.05fr]">
      <CoverMedia
        src={image}
        alt={post.title}
        containerClassName="relative min-h-[18rem] overflow-hidden bg-[var(--slot4-media-bg)]"
        imageClassName="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
        fallback={<DecorativeVisual label="Coverage" />}
      />
      <div className="flex flex-col justify-center p-6 sm:p-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--slot4-accent-fill)]">{label}</p>
        <h3 className="editorial-serif mt-4 text-3xl font-semibold leading-[1] tracking-[-0.05em] sm:text-4xl">{post.title}</h3>
        <p className="mt-4 text-sm leading-7 text-[var(--slot4-muted-text)]">{getEditableExcerpt(post, 180)}</p>
        <span className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em]">Open story <ArrowRight className="h-4 w-4" /></span>
      </div>
    </Link>
  )
}

export function EditorialListCard({
  post,
  href,
  index,
}: {
  post: SitePost
  href: string
  index: number
}) {
  return (
    <Link href={href} className="group grid gap-4 border-b border-[rgba(94,0,6,0.12)] py-5 sm:grid-cols-[72px_1fr]">
      <div className="text-2xl font-semibold leading-none text-[var(--slot4-accent-fill)]">{String(index + 1).padStart(2, '0')}</div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--slot4-soft-muted-text)]">{getEditableCategory(post)}</p>
        <h3 className="editorial-serif mt-2 line-clamp-2 text-2xl font-semibold leading-[1.02] tracking-[-0.04em] group-hover:text-[var(--slot4-accent-fill)]">{post.title}</h3>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-[var(--slot4-muted-text)]">{getEditableExcerpt(post, 120)}</p>
      </div>
    </Link>
  )
}

export function ImageFirstCard({
  post,
  href,
  label = 'Visual release',
}: {
  post: SitePost
  href: string
  label?: string
}) {
  const image = getEditableCoverImage(post)
  return (
    <Link href={href} className="group block overflow-hidden rounded-[2rem] border border-[rgba(94,0,6,0.12)] bg-white/90">
      <CoverMedia
        src={image}
        alt={post.title}
        containerClassName="relative aspect-[4/5] overflow-hidden bg-[var(--slot4-media-bg)]"
        imageClassName="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
        fallback={<div className="flex aspect-[4/5] items-center justify-center bg-[linear-gradient(180deg,rgba(238,217,185,0.45),rgba(255,255,255,0.92))]"><div className="wirely-outline flex h-16 w-16 items-center justify-center rounded-full text-[var(--slot4-accent-fill)]"><Sparkles className="h-6 w-6" /></div></div>}
      />
      <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,transparent,rgba(29,23,20,0.8))] p-5 text-white">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">{label}</p>
        <h3 className="mt-2 line-clamp-2 text-2xl font-semibold leading-tight tracking-[-0.04em]">{post.title}</h3>
      </div>
    </Link>
  )
}
