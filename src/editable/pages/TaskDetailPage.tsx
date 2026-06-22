import Link from 'next/link'
import type { CSSProperties } from 'react'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  Bookmark,
  Building2,
  Camera,
  CheckCircle2,
  Download,
  ExternalLink,
  FileText,
  Globe2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Tag,
  UserRound,
} from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { buildPostUrl, fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { getEditableCategory, getEditableExcerpt, getEditablePostImage, ImageFirstCard } from '@/editable/cards/PostCards'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { getVisualPreset, visualSystem } from '@/editable/theme/visual-system'

export const revalidate = 3

export async function generateEditableDetailMetadata(task: TaskKey, params: Promise<{ slug?: string; username?: string }>) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  return post ? await buildPostMetadata(task, post) : await buildTaskMetadata(task)
}

export async function EditableTaskDetailRoute({ task, params }: { task: TaskKey; params: Promise<{ slug?: string; username?: string }> }) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  if (!post) notFound()
  const related = (await fetchTaskPosts(task, 7)).filter((item) => item.slug !== post.slug).slice(0, 4)
  const comments = task === 'article' || task === 'mediaDistribution' ? await fetchArticleComments(post.slug, 50) : []
  return <TaskDetailView task={task} post={post} related={related} comments={comments} />
}

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const singleImages = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar'].map((key) => asText(content[key])).filter((url) => url && isUrl(url))
  const primary = getEditablePostImage(post)
  return Array.from(new Set([primary, ...media, ...images, ...singleImages].filter(Boolean))).slice(0, 12)
}

const getBody = (post: SitePost) => {
  const content = getContent(post)
  return asText(content.body) || asText(content.description) || asText(content.details) || post.summary || 'Details will appear here once available.'
}

const escapeHtml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;')

const safeUrl = (value: string) => /^https?:\/\//i.test(value) ? value : '#'

const linkifyMarkdown = (value: string) => value
  .replace(/\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/gi, (_match, label, url) => `<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${label}</a>`)

const linkifyText = (value: string) => linkifyMarkdown(value)
  .replace(/(^|[\s(>])((https?:\/\/)[^\s<)]+)/gi, (_match, prefix, url) => `${prefix}<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${url}</a>`)

const hardenLinks = (html: string) => html.replace(/<a\s+([^>]*href=["'][^"']+["'][^>]*)>/gi, (_match, attrs) => {
  let next = String(attrs).replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  if (!/\starget=/i.test(next)) next += ' target="_blank"'
  if (!/\srel=/i.test(next)) next += ' rel="nofollow noopener noreferrer"'
  return `<a ${next}>`
})

const sanitizeHtml = (html: string) => hardenLinks(html
  .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
  .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
  .replace(/<(iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '')
  .replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  .replace(/(href|src)=(['"])javascript:[\s\S]*?\2/gi, '$1="#"'))

const formatPlainText = (raw: string) => {
  const value = raw.trim()
  if (!value) return ''
  if (/<[a-z][\s\S]*>/i.test(value)) return sanitizeHtml(linkifyMarkdown(value))
  return value
    .split(/\n{2,}/)
    .map((part) => `<p>${linkifyText(escapeHtml(part).replace(/\n/g, '<br />'))}</p>`)
    .join('')
}

const summaryText = (post: SitePost) => post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || getEditableExcerpt(post, 180)
const categoryOf = (post: SitePost, fallback: string) => getEditableCategory(post) || fallback
const mapSrcFor = (post: SitePost) => {
  const address = getField(post, ['address', 'location', 'city'])
  const lat = getField(post, ['lat', 'latitude'])
  const lng = getField(post, ['lng', 'lon', 'longitude'])
  if (lat && lng) return `https://maps.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=14&output=embed`
  if (address) return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=13&output=embed`
  return ''
}

export function TaskDetailView({ task, post, related, comments = [] }: { task: TaskKey; post: SitePost; related: SitePost[]; comments?: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  const preset = getVisualPreset(visualSystem.recommendedPreset as any)
  const detailVars = { '--detail-bg': preset.colors.background, '--detail-text': preset.colors.foreground, '--detail-surface': preset.colors.surface, '--detail-accent': preset.colors.accent } as CSSProperties

  return (
    <EditableSiteShell>
      <main style={detailVars} className="bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        {task === 'listing' ? <ListingDetail post={post} related={related} /> : null}
        {task === 'classified' ? <ClassifiedDetail post={post} related={related} /> : null}
        {task === 'image' ? <ImageDetail post={post} related={related} /> : null}
        {task === 'sbm' ? <BookmarkDetail post={post} related={related} /> : null}
        {task === 'pdf' ? <PdfDetail post={post} related={related} /> : null}
        {task === 'profile' ? <ProfileDetail post={post} related={related} /> : null}
        {task === 'article' || task === 'mediaDistribution' ? <ArticleDetail task={task} post={post} related={related} comments={comments} /> : null}
      </main>
    </EditableSiteShell>
  )
}

function BackLink({ task }: { task: TaskKey }) {
  const taskConfig = getTaskConfig(task)
  return (
    <Link href={taskConfig?.route || '/'} className="inline-flex items-center gap-2 rounded-full border border-[rgba(94,0,6,0.14)] bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[var(--slot4-accent-fill)]">
      <ArrowLeft className="h-4 w-4" /> Back to {taskConfig?.label || 'posts'}
    </Link>
  )
}

function ArticleDetail({ task, post, related, comments }: { task: TaskKey; post: SitePost; related: SitePost[]; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  const images = getImages(post)
  const published = post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[1480px]">
        <div className="wirely-panel px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
          <BackLink task={task} />
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold uppercase tracking-[0.16em]">
                <span className="rounded-full bg-[var(--slot4-accent-soft)] px-3 py-1 text-[var(--slot4-accent-fill)]">{categoryOf(post, 'News')}</span>
                {published ? <time className="text-[var(--slot4-soft-muted-text)]">{published}</time> : null}
              </div>
              <h1 className="editorial-brand mt-5 max-w-4xl text-[clamp(3rem,6vw,5.8rem)] font-semibold leading-[0.92] tracking-[-0.06em]">{post.title}</h1>
              {summaryText(post) ? <p className="mt-6 max-w-3xl text-lg leading-9 text-[var(--slot4-muted-text)] sm:text-xl">{summaryText(post)}</p> : null}
            </div>
            <div className="overflow-hidden rounded-[2.2rem] border border-[rgba(94,0,6,0.12)] bg-white">
              {images[0] ? (
                <img src={images[0]} alt={post.title} className="max-h-[32rem] w-full object-cover" />
              ) : (
                <div className="flex min-h-[22rem] items-center justify-center bg-[linear-gradient(180deg,rgba(238,217,185,0.45),rgba(255,255,255,0.95))]">
                  <div className="wirely-outline flex h-24 w-24 items-center justify-center rounded-full"><FileText className="h-8 w-8 text-[var(--slot4-accent-fill)]" /></div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <article className="wirely-panel px-6 py-8 sm:px-8 lg:px-10">
            <BodyContent post={post} />
            <ImageStrip images={images.slice(1)} label="Supporting media" large />
            <EditableComments slug={post.slug} comments={comments} />
          </article>
          <aside className="space-y-5">
            <AboutPanel task={task} post={post} />
            <RelatedPanel task={task} post={post} related={related} />
          </aside>
        </div>
      </div>
    </section>
  )
}

function ListingDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const logo = images[0]
  const address = getField(post, ['address', 'location', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  const mapSrc = mapSrcFor(post)

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[1480px]">
        <BackLink task="listing" />
        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <article className="wirely-panel px-6 py-8 sm:px-8 lg:px-10">
            <div className="grid gap-6 sm:grid-cols-[150px_1fr]">
              <div className="flex h-36 w-36 items-center justify-center overflow-hidden rounded-[2rem] bg-[var(--slot4-accent-soft)]">
                {logo ? <img src={logo} alt={post.title} className="h-full w-full object-cover" /> : <Building2 className="h-14 w-14 opacity-40" />}
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--slot4-accent-fill)]">Business listing</p>
                <h1 className="editorial-brand mt-3 text-[clamp(2.6rem,5vw,5rem)] font-semibold leading-[0.94] tracking-[-0.06em]">{post.title}</h1>
                <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--slot4-muted-text)]">{summaryText(post)}</p>
              </div>
            </div>
            <InfoGrid items={[['Location', address, MapPin], ['Phone', phone, Phone], ['Email', email, Mail], ['Website', website, Globe2]]} />
            <BodyContent post={post} />
            <ImageStrip images={images.slice(1)} label="Business showcase" />
          </article>

          <aside className="space-y-5">
            {mapSrc ? <MapBox src={mapSrc} label={address || post.title} /> : null}
            <ContactAction website={website} phone={phone} email={email} />
            <RelatedPanel task="listing" post={post} related={related} compact />
          </aside>
        </div>
      </div>
    </section>
  )
}

function ClassifiedDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'availability', 'type'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[1480px] grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
        <aside className="rounded-[2.5rem] bg-[linear-gradient(180deg,#5e0006,#9b0f06)] p-7 text-white shadow-[0_24px_70px_rgba(94,0,6,0.18)] lg:sticky lg:top-24 lg:self-start">
          <BackLink task="classified" />
          <p className="mt-10 text-xs font-bold uppercase tracking-[0.28em] text-white/65">Classified notice</p>
          <h1 className="editorial-brand mt-4 text-4xl font-semibold leading-[0.96] tracking-[-0.06em] sm:text-5xl">{post.title}</h1>
          <div className="mt-8 grid gap-3">
            {price ? <BadgeLine label="Price" value={price} /> : null}
            {condition ? <BadgeLine label="Condition" value={condition} /> : null}
            {location ? <BadgeLine label="Location" value={location} /> : null}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {phone ? <a href={`tel:${phone}`} className="rounded-full bg-white px-5 py-3 text-sm font-bold text-[var(--slot4-accent-fill)]">Call now</a> : null}
            {email ? <a href={`mailto:${email}`} className="rounded-full border border-white/25 px-5 py-3 text-sm font-bold">Email</a> : null}
          </div>
        </aside>
        <article className="wirely-panel px-6 py-8 sm:px-8 lg:px-10">
          <ImageStrip images={images} label="Offer images" large />
          <BodyContent post={post} />
          <ContactAction website={website} phone={phone} email={email} />
          <RelatedPanel task="classified" post={post} related={related} />
        </article>
      </div>
    </section>
  )
}

function ImageDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const gallery = images.length ? images : ['/placeholder.svg?height=900&width=1200']

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[1480px]">
        <BackLink task="image" />
        <div className="mt-6 grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
          <aside className="wirely-panel px-6 py-8 lg:sticky lg:top-24 lg:self-start">
            <div className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-dark-bg)] px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white"><Camera className="h-4 w-4" /> Image story</div>
            <h1 className="editorial-brand mt-6 text-[clamp(2.4rem,4vw,4.6rem)] font-semibold leading-[0.94] tracking-[-0.06em]">{post.title}</h1>
            <p className="mt-5 text-base leading-8 text-[var(--slot4-muted-text)]">{summaryText(post)}</p>
            <BodyContent post={post} compact />
          </aside>
          <div className="columns-1 gap-5 space-y-5 md:columns-2">
            {gallery.map((image, index) => (
              <figure key={`${image}-${index}`} className="break-inside-avoid overflow-hidden rounded-[2rem] border border-[rgba(94,0,6,0.12)] bg-white shadow-[0_16px_40px_rgba(94,0,6,0.07)]">
                <img src={image} alt={post.title} className="w-full object-cover" />
                {index === 0 ? <figcaption className="p-5 text-sm text-[var(--slot4-muted-text)]">Featured visual from this image post.</figcaption> : null}
              </figure>
            ))}
          </div>
        </div>
        <div className="mt-10"><RelatedPanel task="image" post={post} related={related} /></div>
      </div>
    </section>
  )
}

function BookmarkDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <section className="px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[1480px] grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <article className="wirely-panel px-6 py-8 sm:px-8 lg:px-10">
          <BackLink task="sbm" />
          <div className="mt-10 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-[var(--slot4-dark-bg)] text-white"><Bookmark className="h-9 w-9" /></div>
          <h1 className="editorial-brand mt-7 text-[clamp(2.6rem,5vw,5rem)] font-semibold leading-[0.94] tracking-[-0.06em]">{post.title}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-9 text-[var(--slot4-muted-text)]">{summaryText(post)}</p>
          {website ? <Link href={website} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--slot4-dark-bg)] px-5 py-3 text-sm font-bold text-white">Open saved resource <ExternalLink className="h-4 w-4" /></Link> : null}
          <BodyContent post={post} />
        </article>
        <RelatedPanel task="sbm" post={post} related={related} />
      </div>
    </section>
  )
}

function PdfDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const fileUrl = getField(post, ['fileUrl', 'pdfUrl', 'documentUrl', 'url'])
  return (
    <section className="px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[1480px] grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <article className="wirely-panel px-6 py-8 sm:px-8 lg:px-10">
          <BackLink task="pdf" />
          <div className="mt-8 grid gap-6 sm:grid-cols-[120px_1fr]">
            <div className="flex h-28 w-28 items-center justify-center rounded-[1.8rem] bg-[var(--slot4-dark-bg)] text-white"><FileText className="h-12 w-12" /></div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[var(--slot4-accent-fill)]">PDF resource</p>
              <h1 className="editorial-brand mt-3 text-[clamp(2.6rem,5vw,5rem)] font-semibold leading-[0.94] tracking-[-0.06em]">{post.title}</h1>
            </div>
          </div>
          <BodyContent post={post} />
          {fileUrl ? (
            <div className="mt-8 overflow-hidden rounded-[2rem] border border-[rgba(94,0,6,0.12)] bg-[var(--slot4-cream)]">
              <div className="flex items-center justify-between gap-3 border-b border-[rgba(94,0,6,0.12)] bg-white p-4">
                <span className="text-sm font-bold">Document preview</span>
                <Link href={fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-dark-bg)] px-4 py-2 text-xs font-bold text-white">Download <Download className="h-4 w-4" /></Link>
              </div>
              <iframe src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`} title={post.title} className="h-[78vh] w-full" />
            </div>
          ) : null}
        </article>
        <RelatedPanel task="pdf" post={post} related={related} />
      </div>
    </section>
  )
}

function ProfileDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  const website = getField(post, ['website', 'url'])
  const email = getField(post, ['email'])
  return (
    <section className="px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[1480px] grid gap-8 lg:grid-cols-[420px_minmax(0,1fr)]">
        <aside className="wirely-panel px-6 py-8 text-center lg:sticky lg:top-24 lg:self-start">
          <BackLink task="profile" />
          <div className="mx-auto mt-10 flex h-40 w-40 items-center justify-center overflow-hidden rounded-full bg-[var(--slot4-accent-soft)]">
            {images[0] ? <img src={images[0]} alt={post.title} className="h-full w-full object-cover" /> : <UserRound className="h-16 w-16 opacity-45" />}
          </div>
          <h1 className="editorial-brand mt-6 text-4xl font-semibold leading-[0.96] tracking-[-0.06em]">{post.title}</h1>
          {role ? <p className="mt-3 text-xs font-bold uppercase tracking-[0.16em] text-[var(--slot4-accent-fill)]">{role}</p> : null}
          <ContactAction website={website} email={email} />
        </aside>
        <article className="wirely-panel px-6 py-8 sm:px-8 lg:px-10">
          <BodyContent post={post} />
          <ImageStrip images={images.slice(1)} label="Profile gallery" />
          <RelatedPanel task="profile" post={post} related={related} />
        </article>
      </div>
    </section>
  )
}

function BodyContent({ post, compact = false }: { post: SitePost; compact?: boolean }) {
  return <div className={`article-content max-w-none ${compact ? 'mt-6 text-base leading-8' : 'mt-8 text-lg leading-9'}`} dangerouslySetInnerHTML={{ __html: formatPlainText(getBody(post)) }} />
}

function AboutPanel({ task, post }: { task: TaskKey; post: SitePost }) {
  const taskConfig = getTaskConfig(task)
  return (
    <div className="wirely-panel px-6 py-6">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--slot4-accent-fill)]">About this post</p>
      <div className="mt-4 grid gap-3 text-sm text-[var(--slot4-muted-text)]">
        <p className="inline-flex items-center gap-2"><Tag className="h-4 w-4 text-[var(--slot4-accent-fill)]" /> Task: {taskConfig?.label || task}</p>
        <p className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[var(--slot4-accent-fill)]" /> Site: {SITE_CONFIG.name}</p>
        <p className="inline-flex items-center gap-2"><FileText className="h-4 w-4 text-[var(--slot4-accent-fill)]" /> Category: {categoryOf(post, 'Latest')}</p>
        {post.publishedAt ? <p>Published: {new Date(post.publishedAt).toLocaleDateString()}</p> : null}
      </div>
    </div>
  )
}

function InfoGrid({ items }: { items: Array<[string, string, typeof MapPin]> }) {
  const visible = items.filter(([, value]) => value)
  if (!visible.length) return null
  return (
    <div className="mt-8 grid gap-3 sm:grid-cols-2">
      {visible.map(([label, value, Icon]) => (
        <div key={label} className="rounded-[1.5rem] border border-[rgba(94,0,6,0.12)] bg-white/75 p-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[var(--slot4-soft-muted-text)]"><Icon className="h-4 w-4" /> {label}</div>
          <p className="mt-2 break-words text-sm font-medium leading-6 text-[var(--slot4-page-text)]">{value}</p>
        </div>
      ))}
    </div>
  )
}

function ImageStrip({ images, label, large = false }: { images: string[]; label: string; large?: boolean }) {
  if (!images.length) return null
  return (
    <section className="mt-8">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--slot4-accent-fill)]">{label}</p>
      <div className={`mt-4 grid gap-3 ${large ? 'sm:grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'}`}>
        {images.slice(0, large ? 4 : 8).map((image, index) => <img key={`${image}-${index}`} src={image} alt="" className="aspect-[4/3] rounded-[1.5rem] object-cover ring-1 ring-[rgba(94,0,6,0.12)]" />)}
      </div>
    </section>
  )
}

function MapBox({ src, label }: { src: string; label: string }) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-[rgba(94,0,6,0.12)] bg-white shadow-[0_16px_40px_rgba(94,0,6,0.07)]">
      <div className="flex items-center gap-2 p-4 text-sm font-bold"><MapPin className="h-4 w-4 text-[var(--slot4-accent-fill)]" /> {label || 'Map location'}</div>
      <iframe src={src} title="Map" loading="lazy" className="h-80 w-full border-0" />
    </div>
  )
}

function ContactAction({ website, phone, email }: { website?: string; phone?: string; email?: string }) {
  if (!website && !phone && !email) return null
  return (
    <div className="rounded-[2rem] border border-[rgba(94,0,6,0.12)] bg-white p-5 shadow-[0_16px_40px_rgba(94,0,6,0.07)]">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--slot4-accent-fill)]">Quick actions</p>
      <div className="mt-4 flex flex-wrap gap-3">
        {website ? <Link href={website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-dark-bg)] px-4 py-2 text-sm font-bold text-white">Website <ExternalLink className="h-4 w-4" /></Link> : null}
        {phone ? <a href={`tel:${phone}`} className="inline-flex items-center gap-2 rounded-full border border-[rgba(94,0,6,0.14)] px-4 py-2 text-sm font-bold"><Phone className="h-4 w-4" /> Call</a> : null}
        {email ? <a href={`mailto:${email}`} className="inline-flex items-center gap-2 rounded-full border border-[rgba(94,0,6,0.14)] px-4 py-2 text-sm font-bold"><Mail className="h-4 w-4" /> Email</a> : null}
      </div>
    </div>
  )
}

function BadgeLine({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm"><span className="font-bold uppercase tracking-[0.16em] text-white/60">{label}</span><span className="font-bold">{value}</span></div>
}

function RelatedPanel({ task, post, related, compact = false }: { task: TaskKey; post: SitePost; related: SitePost[]; compact?: boolean }) {
  const taskConfig = getTaskConfig(task)
  return (
    <aside className="wirely-panel px-6 py-6">
      {!compact ? (
        <div className="border-b border-[rgba(94,0,6,0.1)] pb-5">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--slot4-accent-fill)]">Reading companion</p>
          <p className="mt-3 text-sm leading-7 text-[var(--slot4-muted-text)]">Keep moving through related content from the {taskConfig?.label || task} archive without losing context.</p>
        </div>
      ) : null}
      {related.length ? (
        <div className={`${compact ? '' : 'pt-5'}`}>
          <div className="flex items-center justify-between gap-3">
            <h2 className="editorial-serif text-xl font-semibold tracking-[-0.04em]">More like this</h2>
            <Link href={taskConfig?.route || '/'} className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--slot4-accent-fill)]">View all</Link>
          </div>
          <div className="mt-5 grid gap-4">
            {related.map((item, index) => <RelatedCard key={item.id || item.slug || index} task={task} post={item} />)}
          </div>
        </div>
      ) : (
        <div className="pt-5">
          <p className="text-sm text-[var(--slot4-muted-text)]">More related posts will appear here as the archive grows.</p>
        </div>
      )}
      {!compact ? (
        <div className="mt-5 border-t border-[rgba(94,0,6,0.1)] pt-5 text-sm text-[var(--slot4-muted-text)]">
          <p className="inline-flex items-center gap-2"><Tag className="h-4 w-4 text-[var(--slot4-accent-fill)]" /> Category: {categoryOf(post, 'Latest')}</p>
        </div>
      ) : null}
    </aside>
  )
}

function RelatedCard({ task, post }: { task: TaskKey; post: SitePost }) {
  const image = getImages(post)[0]
  if (task === 'image' && image) {
    return <ImageFirstCard post={post} href={buildPostUrl(task, post.slug)} label={categoryOf(post, 'Visual')} />
  }

  return (
    <Link href={buildPostUrl(task, post.slug)} className="group grid gap-3 rounded-[1.6rem] border border-[rgba(94,0,6,0.1)] bg-white/80 p-3 transition hover:bg-white sm:grid-cols-[88px_1fr]">
      {image && task !== 'sbm'
        ? <img src={image} alt={post.title} className="h-24 w-full rounded-[1rem] object-cover sm:w-24" />
        : <div className="flex h-24 w-full items-center justify-center rounded-[1rem] bg-[var(--slot4-accent-soft)] sm:w-24"><FileText className="h-6 w-6 text-[var(--slot4-accent-fill)]" /></div>}
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--slot4-accent-fill)]">{categoryOf(post, 'Latest')}</p>
        <h3 className="editorial-serif mt-2 line-clamp-3 text-lg font-semibold leading-tight tracking-[-0.03em] group-hover:text-[var(--slot4-accent-fill)]">{post.title}</h3>
        <p className="mt-2 line-clamp-2 text-xs leading-6 text-[var(--slot4-muted-text)]">{summaryText(post)}</p>
      </div>
    </Link>
  )
}

function EditableComments({ slug, comments }: { slug: string; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  return (
    <section className="mt-12 rounded-[2rem] border border-[rgba(94,0,6,0.12)] bg-[linear-gradient(180deg,rgba(238,217,185,0.28),rgba(255,255,255,0.85))] p-5 sm:p-6">
      <div className="flex items-center gap-2 text-lg font-bold"><MessageCircle className="h-5 w-5 text-[var(--slot4-accent-fill)]" /> Comments</div>
      <div className="mt-5 grid gap-3">
        {comments.slice(0, 5).map((comment) => (
          <div key={comment.id} className="rounded-[1.4rem] border border-[rgba(94,0,6,0.1)] bg-white/85 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-bold">{comment.name}</p>
              <p className="text-xs text-[var(--slot4-soft-muted-text)]">{comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : ''}</p>
            </div>
            <p className="mt-2 text-sm leading-7 text-[var(--slot4-muted-text)]">{comment.comment}</p>
          </div>
        ))}
        {!comments.length ? <p className="text-sm leading-7 text-[var(--slot4-muted-text)]">No comments yet for {slug}.</p> : null}
      </div>
    </section>
  )
}
