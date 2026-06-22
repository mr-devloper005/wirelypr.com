import Link from 'next/link'
import type { CSSProperties } from 'react'
import {
  ArrowRight,
  Bookmark,
  BriefcaseBusiness,
  Building2,
  Camera,
  Download,
  FileText,
  Filter,
  Image as ImageIcon,
  MapPin,
  Megaphone,
  Newspaper,
  Search,
  UserRound,
} from 'lucide-react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { fetchPaginatedTaskPosts, buildPostUrl } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SiteFeedPagination, SitePost } from '@/lib/site-connector'
import { taskPageMetadata } from '@/config/site.content'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import {
  ArticleListCard,
  CompactIndexCard,
  EditorialFeatureCard,
  getEditableCategory,
  getEditableCoverImage,
  getEditableExcerpt,
  getEditablePostImage,
  hasEditableCoverImage,
  HorizontalFeatureCard,
  ImageFirstCard,
  RailPostCard,
} from '@/editable/cards/PostCards'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { getVisualPreset, visualSystem } from '@/editable/theme/visual-system'

export const revalidate = 3

export const taskMetadata = (task: TaskKey, path: string) =>
  buildTaskMetadata(task, {
    path,
    title: taskPageMetadata[task]?.title,
    description: taskPageMetadata[task]?.description,
  })

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const image = asText(content.image) || asText(content.featuredImage) || asText(content.thumbnail)
  const logo = asText(content.logo)
  return [...media, ...images, ...(isUrl(image) ? [image] : []), ...(isUrl(logo) ? [logo] : [])].filter(Boolean).slice(0, 8)
}

const placeholder = '/placeholder.svg?height=900&width=1200'
const getImage = (post: SitePost) => getImages(post)[0] || getEditableCoverImage(post) || getEditablePostImage(post) || placeholder
const getCategory = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const getSummary = (post: SitePost) => post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || asText(getContent(post).body) || getEditableExcerpt(post, 180)
const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

function pageHref(basePath: string, category: string, page: number) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}

const taskDeck: Record<TaskKey, { icon: typeof FileText; archiveClass: string; promise: string; badge: string }> = {
  mediaDistribution: { icon: Newspaper, archiveClass: 'grid gap-5 md:grid-cols-2 xl:grid-cols-3', promise: 'Lead with source, category, summary, and publishing clarity across every release.', badge: 'News' },
  article: { icon: FileText, archiveClass: 'grid gap-5 md:grid-cols-2 xl:grid-cols-3', promise: 'Balanced long-read cards keep headlines, excerpts, and hierarchy easy to scan.', badge: 'Read' },
  listing: { icon: Building2, archiveClass: 'grid gap-5 xl:grid-cols-2', promise: 'Directory cards prioritize business identity, location, and contact cues.', badge: 'Business' },
  classified: { icon: Megaphone, archiveClass: 'grid gap-5 xl:grid-cols-2', promise: 'Offer cards surface pricing, urgency, and next-step clarity.', badge: 'Offer' },
  image: { icon: Camera, archiveClass: 'grid gap-5 sm:grid-cols-2 xl:grid-cols-3', promise: 'Visual cards keep imagery first while preserving title and category context.', badge: 'Gallery' },
  sbm: { icon: Bookmark, archiveClass: 'grid gap-4 md:grid-cols-2 xl:grid-cols-3', promise: 'Curated links stay compact and easy to revisit.', badge: 'Bookmark' },
  pdf: { icon: Download, archiveClass: 'grid gap-5 md:grid-cols-2 xl:grid-cols-3', promise: 'Document cards emphasize file purpose, context, and quick access.', badge: 'PDF' },
  profile: { icon: UserRound, archiveClass: 'grid gap-5 md:grid-cols-2 xl:grid-cols-4', promise: 'Profile cards foreground identity, role, and direct recognition.', badge: 'Profile' },
}

export async function EditableTaskArchiveRoute({
  task,
  searchParams,
  basePath,
}: {
  task: TaskKey
  searchParams?: Promise<{ category?: string; page?: string }>
  basePath?: string
}) {
  const resolved = (await searchParams) || {}
  const page = Math.max(1, Math.floor(Number(resolved.page) || 1))
  const category = resolved.category ? normalizeCategory(resolved.category) : 'all'
  const taskConfig = getTaskConfig(task)
  const { posts, pagination } = await fetchPaginatedTaskPosts(task, { page, limit: 24, category })
  return <TaskArchiveView task={task} posts={posts} pagination={pagination} category={category} basePath={basePath || taskConfig?.route || `/${task}`} />
}

export function TaskArchiveView({ task, posts, pagination, category, basePath }: { task: TaskKey; posts: SitePost[]; pagination: SiteFeedPagination; category: string; basePath: string }) {
  const taskConfig = getTaskConfig(task)
  const voice = taskPageVoices[task]
  const preset = getVisualPreset(visualSystem.recommendedPreset as any)
  const page = pagination.page || 1
  const label = taskConfig?.label || task
  const deck = taskDeck[task]
  const Icon = deck.icon
  const archiveVars = { '--archive-bg': preset.colors.background, '--archive-text': preset.colors.foreground, '--archive-surface': preset.colors.surface, '--archive-accent': preset.colors.accent } as CSSProperties
  const dynamicCategories = Array.from(new Map([
    ...CATEGORY_OPTIONS,
    ...posts.map((post) => {
      const raw = getCategory(post, '')
      return raw ? { name: raw, slug: normalizeCategory(raw) } : null
    }).filter((item): item is { name: string; slug: string } => Boolean(item)),
  ].map((item) => [item.slug, item])).values())
  const categoryLabel = category === 'all' ? 'All categories' : dynamicCategories.find((item) => item.slug === category)?.name || category

  if (task === 'mediaDistribution' || task === 'article') {
    return (
      <EditorialArchive
        task={task}
        posts={posts}
        pagination={pagination}
        category={category}
        categoryLabel={categoryLabel}
        categories={dynamicCategories}
        basePath={basePath}
        label={label}
      />
    )
  }

  return (
    <EditableSiteShell>
      <main style={archiveVars} className="bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="mx-auto max-w-[1480px] px-4 py-8 sm:px-6 lg:px-10">
          <div className="wirely-panel px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
            <div className="grid gap-8 lg:grid-cols-[1.04fr_0.96fr] lg:items-end">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(94,0,6,0.14)] bg-white/75 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-[var(--slot4-accent-fill)]">
                  <Icon className="h-4 w-4" />
                  {voice.eyebrow}
                </div>
                <h1 className="editorial-brand mt-5 max-w-4xl text-[clamp(3rem,6vw,5.6rem)] font-semibold leading-[0.92] tracking-[-0.06em]">{voice.headline}</h1>
                <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--slot4-muted-text)]">{voice.description}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {voice.chips.map((chip) => <span key={chip} className="rounded-full border border-[rgba(94,0,6,0.12)] bg-white/80 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--slot4-accent-fill)]">{chip}</span>)}
                </div>
              </div>

              <div className="grid gap-4">
                <form action={basePath} className="rounded-[2rem] border border-[rgba(94,0,6,0.14)] bg-white/80 p-5">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[var(--slot4-soft-muted-text)]"><Filter className="h-4 w-4" /> {voice.filterLabel}</div>
                  <select name="category" defaultValue={category} className="mt-4 h-12 w-full rounded-full border border-[rgba(94,0,6,0.14)] bg-white px-4 text-sm font-medium outline-none">
                    <option value="all">All categories</option>
                    {dynamicCategories.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
                  </select>
                  <button className="mt-3 h-12 w-full rounded-full bg-[var(--slot4-dark-bg)] text-sm font-bold text-white">Apply filter</button>
                  <p className="mt-3 text-xs text-[var(--slot4-soft-muted-text)]">Showing: {categoryLabel}</p>
                </form>

                <form action="/search" className="rounded-[2rem] border border-[rgba(94,0,6,0.14)] bg-[linear-gradient(180deg,rgba(238,217,185,0.42),rgba(255,255,255,0.84))] p-5">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[var(--slot4-accent-fill)]"><Search className="h-4 w-4" /> Search archive</div>
                  <label className="mt-4 flex overflow-hidden rounded-full border border-[rgba(94,0,6,0.18)] bg-white">
                    <input name="q" placeholder={`Search ${label.toLowerCase()}`} className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm outline-none" />
                    <button className="bg-[var(--slot4-accent-fill)] px-5 text-xs font-bold uppercase tracking-[0.14em] text-white">Search</button>
                  </label>
                  <p className="mt-3 text-xs text-[var(--slot4-soft-muted-text)]">{deck.promise}</p>
                </form>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1480px] px-4 pb-16 sm:px-6 lg:px-10">
          {posts.length ? (
            <div className={deck.archiveClass}>
              {posts.map((post, index) => <ArchivePostCard key={post.id || post.slug} post={post} task={task} basePath={basePath} index={index} />)}
            </div>
          ) : (
            <div className="wirely-panel px-8 py-12 text-center">
              <Search className="mx-auto h-8 w-8 text-[var(--slot4-accent-fill)]" />
              <h2 className="editorial-serif mt-4 text-3xl font-semibold tracking-[-0.04em]">No posts found</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--slot4-muted-text)]">Try another category or refresh this page after publishing new content.</p>
            </div>
          )}

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {pagination.hasPrevPage ? <Link href={pageHref(basePath, category, page - 1)} className="rounded-full border border-[rgba(94,0,6,0.14)] bg-white px-5 py-3 text-sm font-bold">Previous</Link> : null}
            <span className="rounded-full bg-[var(--slot4-dark-bg)] px-5 py-3 text-sm font-bold text-white">Page {page} of {pagination.totalPages || 1}</span>
            {pagination.hasNextPage ? <Link href={pageHref(basePath, category, page + 1)} className="rounded-full border border-[rgba(94,0,6,0.14)] bg-white px-5 py-3 text-sm font-bold">Next</Link> : null}
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}

function EditorialArchive({
  task,
  posts,
  pagination,
  category,
  categoryLabel,
  categories,
  basePath,
  label,
}: {
  task: TaskKey
  posts: SitePost[]
  pagination: SiteFeedPagination
  category: string
  categoryLabel: string
  categories: { name: string; slug: string }[]
  basePath: string
  label: string
}) {
  const page = pagination.page || 1
  const postsWithImages = posts.filter(hasEditableCoverImage)
  const lead = postsWithImages[0] || posts[0]
  const imageLead = postsWithImages.find((post) => post.slug !== lead?.slug) || posts.find((post) => post.slug !== lead?.slug)
  const secondarySource = posts.filter((post) => post.slug !== lead?.slug && post.slug !== imageLead?.slug)
  const secondary = secondarySource.slice(0, 4)
  const remaining = secondarySource.slice(4)
  const voice = taskPageVoices[task]

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="mx-auto max-w-[1480px] px-4 py-8 sm:px-6 lg:px-10">
          <div className="wirely-panel px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr] lg:items-center">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--slot4-accent-fill)]">{voice.eyebrow}</p>
                <h1 className="editorial-brand mt-4 text-[clamp(3rem,6vw,5.6rem)] font-semibold leading-[0.92] tracking-[-0.06em]">
                  {category === 'all' ? voice.headline : `${categoryLabel} coverage`}
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--slot4-muted-text)]">{voice.description}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {voice.chips.map((chip) => <span key={chip} className="rounded-full border border-[rgba(94,0,6,0.12)] bg-white/80 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--slot4-accent-fill)]">{chip}</span>)}
                </div>
              </div>
              <div className="rounded-[2rem] border border-[rgba(94,0,6,0.14)] bg-white/80 p-5">
                <div className="flex flex-wrap items-center gap-3">
                  {categories.slice(0, 8).map((item) => (
                    <Link key={item.slug} href={pageHref(basePath, item.slug, 1)} className={`rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] ${category === item.slug ? 'bg-[var(--slot4-accent-fill)] text-white' : 'border border-[rgba(94,0,6,0.12)] bg-white text-[var(--slot4-accent-fill)]'}`}>
                      {item.name}
                    </Link>
                  ))}
                  <Link href={basePath} className={`rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] ${category === 'all' ? 'bg-[var(--slot4-dark-bg)] text-white' : 'border border-[rgba(94,0,6,0.12)] bg-white text-[var(--slot4-page-text)]'}`}>All</Link>
                </div>
                <form action={basePath} className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <select name="category" defaultValue={category} className="h-12 min-w-0 flex-1 rounded-full border border-[rgba(94,0,6,0.14)] bg-white px-4 text-sm outline-none">
                    <option value="all">All categories</option>
                    {categories.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
                  </select>
                  <button className="h-12 rounded-full bg-[var(--slot4-dark-bg)] px-6 text-sm font-bold text-white">Update view</button>
                </form>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1480px] px-4 sm:px-6 lg:px-10">
          {lead ? <EditorialFeatureCard post={lead} href={`${basePath}/${lead.slug}`} label={label} /> : null}
        </section>

        {secondary.length ? (
          <section className="mx-auto max-w-[1480px] px-4 py-8 sm:px-6 lg:px-10">
            <div className="wirely-panel px-6 py-8 sm:px-8 lg:px-10">
              <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--slot4-accent-fill)]">Quick briefing</p>
                  <h2 className="editorial-brand mt-2 text-[clamp(2rem,4vw,3.3rem)] font-semibold leading-none tracking-[-0.055em]">Recent stories shaping the desk</h2>
                  <div className="mt-5 space-y-3">
                    {secondary.slice(0, 3).map((post, index) => <CompactIndexCard key={post.id || post.slug} post={post} href={`${basePath}/${post.slug}`} index={index} />)}
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {secondary.slice(0, 4).map((post, index) => <RailPostCard key={post.id || post.slug} post={post} href={`${basePath}/${post.slug}`} index={index} />)}
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {imageLead ? (
          <section className="mx-auto max-w-[1480px] px-4 pb-8 sm:px-6 lg:px-10">
            <HorizontalFeatureCard post={imageLead} href={`${basePath}/${imageLead.slug}`} label="Featured spotlight" />
          </section>
        ) : null}

        <section className="mx-auto max-w-[1480px] px-4 pb-16 sm:px-6 lg:px-10">
          {remaining.length ? (
            <div className="grid gap-5 md:grid-cols-2">
              {remaining.map((post, index) => <ArticleListCard key={post.id || post.slug} post={post} href={`${basePath}/${post.slug}`} index={index} />)}
            </div>
          ) : !lead ? (
            <div className="wirely-panel px-8 py-12 text-center">
              <Search className="mx-auto h-8 w-8 text-[var(--slot4-accent-fill)]" />
              <h2 className="editorial-serif mt-4 text-3xl font-semibold">No stories found</h2>
              <p className="mt-3 text-sm text-[var(--slot4-muted-text)]">Try another category or publish a new newsroom story.</p>
            </div>
          ) : null}

          <div className="mt-10 flex items-center justify-center gap-3">
            {pagination.hasPrevPage ? <Link href={pageHref(basePath, category, page - 1)} className="rounded-full border border-[rgba(94,0,6,0.14)] bg-white px-5 py-3 text-sm font-bold">Previous</Link> : null}
            <span className="rounded-full bg-[var(--slot4-accent-fill)] px-5 py-3 text-sm font-bold text-white">Page {page} / {pagination.totalPages || 1}</span>
            {pagination.hasNextPage ? <Link href={pageHref(basePath, category, page + 1)} className="rounded-full border border-[rgba(94,0,6,0.14)] bg-white px-5 py-3 text-sm font-bold">Next</Link> : null}
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}

function ArchivePostCard({ post, task, basePath, index }: { post: SitePost; task: TaskKey; basePath: string; index: number }) {
  const href = `${basePath}/${post.slug}` || buildPostUrl(task, post.slug)
  if (task === 'listing') return <ListingArchiveCard post={post} href={href} />
  if (task === 'classified') return <ClassifiedArchiveCard post={post} href={href} />
  if (task === 'image') return <ImageArchiveCard post={post} href={href} index={index} />
  if (task === 'sbm') return <BookmarkArchiveCard post={post} href={href} index={index} />
  if (task === 'pdf') return <PdfArchiveCard post={post} href={href} />
  if (task === 'profile') return <ProfileArchiveCard post={post} href={href} />
  return <ArticleArchiveCard post={post} href={href} index={index} />
}

function ArticleArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return <RailPostCard post={post} href={href} index={index} />
}

function ListingArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const logo = getImages(post)[0]
  const location = getField(post, ['location', 'address', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const website = getField(post, ['website', 'url'])
  return (
    <Link href={href} className="group grid gap-5 rounded-[2rem] border border-[rgba(94,0,6,0.12)] bg-white p-5 shadow-[0_16px_40px_rgba(94,0,6,0.07)] transition hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(94,0,6,0.12)] sm:grid-cols-[120px_1fr]">
      <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-[1.5rem] bg-[var(--slot4-accent-soft)]">
        {logo ? <img src={logo} alt="" className="h-full w-full object-cover" /> : <BriefcaseBusiness className="h-10 w-10 opacity-45" />}
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-[var(--slot4-dark-bg)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white">Directory</span>
          {location ? <span className="inline-flex items-center gap-1 rounded-full border border-[rgba(94,0,6,0.12)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--slot4-accent-fill)]"><MapPin className="h-3 w-3" /> {location}</span> : null}
        </div>
        <h2 className="editorial-serif mt-4 text-2xl font-semibold leading-tight tracking-[-0.05em]">{post.title}</h2>
        <p className="mt-3 line-clamp-2 text-sm leading-7 text-[var(--slot4-muted-text)]">{getSummary(post)}</p>
        <div className="mt-4 grid gap-2 text-xs text-[var(--slot4-soft-muted-text)] sm:grid-cols-2">
          {phone ? <span>Phone: {phone}</span> : null}
          {website ? <span>Website available</span> : null}
        </div>
      </div>
    </Link>
  )
}

function ClassifiedArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'type', 'availability'])
  return (
    <Link href={href} className="group overflow-hidden rounded-[2rem] border border-[rgba(94,0,6,0.12)] bg-white shadow-[0_16px_40px_rgba(94,0,6,0.07)] transition hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(94,0,6,0.12)]">
      <div className="grid min-h-64 sm:grid-cols-[0.72fr_1fr]">
        <div className="bg-[linear-gradient(180deg,#5e0006,#9b0f06)] p-5 text-white">
          <span className="rounded-full bg-white/12 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em]">Classified</span>
          <h2 className="mt-10 text-3xl font-semibold leading-[1] tracking-[-0.06em]">{price || 'Open offer'}</h2>
          <p className="mt-4 text-sm opacity-80">{location || condition || 'Details inside'}</p>
        </div>
        <div className="p-6">
          <h2 className="editorial-serif text-2xl font-semibold leading-tight tracking-[-0.05em]">{post.title}</h2>
          <p className="mt-4 line-clamp-4 text-sm leading-7 text-[var(--slot4-muted-text)]">{getSummary(post)}</p>
          <p className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[var(--slot4-accent-fill)]">View listing <ArrowRight className="h-4 w-4" /></p>
        </div>
      </div>
    </Link>
  )
}

function ImageArchiveCard({ post, href }: { post: SitePost; href: string; index: number }) {
  return <ImageFirstCard post={post} href={href} label="Visual story" />
}

function BookmarkArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <Link href={href} className="group block rounded-[1.8rem] border border-[rgba(94,0,6,0.12)] bg-white p-6 shadow-[0_16px_40px_rgba(94,0,6,0.07)] transition hover:-translate-y-1 hover:bg-[var(--slot4-dark-bg)] hover:text-white">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full border border-current/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em]">Save {String(index + 1).padStart(2, '0')}</span>
        <Bookmark className="h-5 w-5" />
      </div>
      <h2 className="editorial-serif mt-8 text-2xl font-semibold leading-tight tracking-[-0.05em]">{post.title}</h2>
      <p className="mt-4 line-clamp-4 text-sm leading-7 opacity-75">{getSummary(post)}</p>
      {website ? <p className="mt-5 truncate text-xs font-bold uppercase tracking-[0.16em] opacity-60">{website.replace(/^https?:\/\//, '')}</p> : null}
    </Link>
  )
}

function PdfArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const category = getCategory(post, 'PDF')
  return (
    <Link href={href} className="group rounded-[2rem] border border-[rgba(94,0,6,0.12)] bg-white p-6 shadow-[0_16px_40px_rgba(94,0,6,0.07)] transition hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(94,0,6,0.12)]">
      <div className="flex items-start justify-between gap-4">
        <div className="rounded-[1.4rem] bg-[var(--slot4-dark-bg)] p-5 text-white"><FileText className="h-8 w-8" /></div>
        <span className="rounded-full bg-[var(--slot4-accent-soft)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--slot4-accent-fill)]">{category}</span>
      </div>
      <h2 className="editorial-serif mt-8 text-2xl font-semibold leading-tight tracking-[-0.05em]">{post.title}</h2>
      <p className="mt-4 line-clamp-4 text-sm leading-7 text-[var(--slot4-muted-text)]">{getSummary(post)}</p>
      <p className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[var(--slot4-accent-fill)]">Open document <Download className="h-4 w-4" /></p>
    </Link>
  )
}

function ProfileArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const avatar = getImages(post)[0]
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  return (
    <Link href={href} className="group rounded-[2rem] border border-[rgba(94,0,6,0.12)] bg-white p-6 text-center shadow-[0_16px_40px_rgba(94,0,6,0.07)] transition hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(94,0,6,0.12)]">
      <div className="mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-[var(--slot4-accent-soft)]">
        {avatar ? <img src={avatar} alt="" className="h-full w-full object-cover" /> : <UserRound className="h-10 w-10 opacity-45" />}
      </div>
      <h2 className="editorial-serif mt-5 text-xl font-semibold leading-tight tracking-[-0.04em]">{post.title}</h2>
      {role ? <p className="mt-2 text-xs font-bold uppercase tracking-[0.16em] text-[var(--slot4-accent-fill)]">{role}</p> : null}
      <p className="mt-4 line-clamp-3 text-sm leading-7 text-[var(--slot4-muted-text)]">{getSummary(post)}</p>
    </Link>
  )
}
