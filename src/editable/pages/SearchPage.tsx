import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Filter, Search, Sparkles } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { fetchSiteFeed } from '@/lib/site-connector'
import { buildPostUrl, getPostTaskKey } from '@/lib/task-data'
import { getMockPostsForTask } from '@/lib/mock-posts'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { pagesContent } from '@/editable/content/pages.content'
import { getEditableExcerpt, getEditableCategory } from '@/editable/cards/PostCards'

export const revalidate = 3

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/search',
    title: pagesContent.search.metadata.title,
    description: pagesContent.search.metadata.description,
  })
}

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ')
const compactText = (value: unknown) => typeof value === 'string' ? stripHtml(value).replace(/\s+/g, ' ').trim().toLowerCase() : ''
const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const compactRaw = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const summaryOf = (post: SitePost) => post.summary || compactRaw(getContent(post).description) || compactRaw(getContent(post).excerpt) || getEditableExcerpt(post, 180)

const matches = (post: SitePost, query: string, category: string, task: string) => {
  const content = getContent(post)
  const typeText = compactText(content.type)
  if (typeText === 'comment') return false
  const derivedTask = getPostTaskKey(post) || typeText
  if (task && derivedTask !== task) return false
  const categoryText = compactText(content.category)
  const tagsText = compactText(Array.isArray(post.tags) ? post.tags.join(' ') : '')
  if (category && !(categoryText || tagsText).includes(category)) return false
  if (!query) return true
  return [post.title, post.summary, content.description, content.body, content.excerpt, content.category, Array.isArray(post.tags) ? post.tags.join(' ') : '']
    .some((value) => compactText(value).includes(query))
}

function SearchResultCard({ post, index }: { post: SitePost; index: number }) {
  const task = getPostTaskKey(post) as TaskKey | null
  const href = task ? buildPostUrl(task, post.slug) : `/article/${post.slug}`
  const summary = summaryOf(post)
  const taskLabel = SITE_CONFIG.tasks.find((item) => item.key === task)?.label || getEditableCategory(post) || 'Post'

  return (
    <Link href={href} className={`group rounded-[2rem] border border-[rgba(94,0,6,0.12)] bg-white/90 p-5 shadow-[0_16px_40px_rgba(94,0,6,0.07)] transition hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(94,0,6,0.12)] ${index % 5 === 0 ? 'md:col-span-2' : ''}`}>
      <div className="flex items-center justify-between gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--slot4-accent-fill)]">
        <span>{taskLabel}</span>
        <span>{String(index + 1).padStart(2, '0')}</span>
      </div>
      <h2 className="editorial-serif mt-4 line-clamp-3 text-2xl font-semibold leading-[1.03] tracking-[-0.04em] text-[var(--slot4-page-text)] sm:text-3xl">{post.title}</h2>
      {summary ? <p className="mt-4 line-clamp-4 text-sm leading-7 text-[var(--slot4-muted-text)]">{summary}</p> : null}
      <span className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--slot4-accent-fill)]">Open result <ArrowRight className="h-4 w-4" /></span>
    </Link>
  )
}

export default async function SearchPage({ searchParams }: { searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }> }) {
  const resolved = (await searchParams) || {}
  const query = (resolved.q || '').trim()
  const normalized = query.toLowerCase()
  const category = (resolved.category || '').trim().toLowerCase()
  const task = (resolved.task || '').trim().toLowerCase()
  const useMaster = resolved.master !== '0'
  const feed = await fetchSiteFeed(useMaster ? 1000 : 300, useMaster ? { fresh: true, category: category || undefined, task: task || undefined } : undefined)
  const posts = feed?.posts?.length ? feed.posts : useMaster ? [] : SITE_CONFIG.tasks.filter((item) => item.enabled).flatMap((item) => getMockPostsForTask(item.key))
  const results = posts.filter((post) => matches(post, normalized, category, task)).slice(0, normalized ? 80 : 36)
  const enabledTasks = SITE_CONFIG.tasks.filter((item) => item.enabled)

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="px-4 py-8 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-[1480px]">
            <div className="wirely-panel px-6 py-8 sm:px-8 lg:px-10 lg:py-12">
              <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-[var(--slot4-accent-fill)]">{pagesContent.search.hero.badge}</p>
                  <h1 className="editorial-brand mt-4 max-w-5xl text-[clamp(3rem,6vw,5.7rem)] font-semibold leading-[0.92] tracking-[-0.06em]">{pagesContent.search.hero.title}</h1>
                  <p className="mt-6 max-w-3xl text-lg leading-9 text-[var(--slot4-muted-text)]">{pagesContent.search.hero.description}</p>
                </div>

                <div className="rounded-[2.2rem] border border-[rgba(94,0,6,0.12)] bg-[linear-gradient(180deg,rgba(238,217,185,0.38),rgba(255,255,255,0.94))] p-6 sm:p-8">
                  <div className="flex items-center gap-3">
                    <div className="wirely-outline flex h-12 w-12 items-center justify-center rounded-full text-[var(--slot4-accent-fill)]">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <p className="text-sm leading-7 text-[var(--slot4-muted-text)]">Search across releases, features, visuals, listings, and support resources from one archive surface.</p>
                  </div>
                  <form action="/search" className="mt-6">
                    <input type="hidden" name="master" value="1" />
                    <label className="flex items-center gap-3 overflow-hidden rounded-full border border-[rgba(94,0,6,0.16)] bg-white px-4 py-3">
                      <Search className="h-5 w-5 text-[var(--slot4-accent-fill)]" />
                      <input name="q" defaultValue={query} placeholder={pagesContent.search.hero.placeholder} className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-[var(--slot4-soft-muted-text)]" />
                    </label>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <label className="flex items-center gap-2 overflow-hidden rounded-full border border-[rgba(94,0,6,0.16)] bg-white px-4 py-3">
                        <Filter className="h-4 w-4 text-[var(--slot4-accent-fill)]" />
                        <input name="category" defaultValue={category} placeholder="Category" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--slot4-soft-muted-text)]" />
                      </label>
                      <select name="task" defaultValue={task} className="rounded-full border border-[rgba(94,0,6,0.16)] bg-white px-4 py-3 text-sm outline-none">
                        <option value="">All content types</option>
                        {enabledTasks.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
                      </select>
                    </div>
                    <button className="mt-3 inline-flex h-12 w-full items-center justify-center rounded-full bg-[var(--slot4-dark-bg)] px-6 text-sm font-bold text-white transition hover:bg-[var(--slot4-accent-fill)]" type="submit">Search archive</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 pb-14 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-[1480px]">
            <div className="wirely-panel px-6 py-8 sm:px-8 lg:px-10">
              <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[rgba(94,0,6,0.1)] pb-5">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--slot4-accent-fill)]">{results.length} results</p>
                  <h2 className="editorial-brand mt-2 text-[clamp(2rem,4vw,3.8rem)] font-semibold leading-none tracking-[-0.055em]">
                    {query ? `Results for "${query}"` : pagesContent.search.resultsTitle}
                  </h2>
                </div>
                <Link href="/article" className="inline-flex items-center gap-2 rounded-full border border-[rgba(94,0,6,0.14)] bg-white px-5 py-3 text-sm font-bold transition hover:bg-[var(--slot4-accent-soft)]">
                  Browse latest
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {results.length ? (
                <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {results.map((post, index) => <SearchResultCard key={post.id || post.slug} post={post} index={index} />)}
                </div>
              ) : (
                <div className="mt-6 rounded-[1.8rem] border border-dashed border-[rgba(94,0,6,0.18)] bg-white/80 p-10 text-center">
                  <p className="editorial-serif text-3xl font-semibold tracking-[-0.04em]">No matching posts found.</p>
                  <p className="mt-3 text-sm leading-7 text-[var(--slot4-muted-text)]">Try a different keyword, content type, or category.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
