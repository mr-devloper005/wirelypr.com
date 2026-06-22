import Link from 'next/link'
import { ArrowRight, Search, Sparkles, MoveRight } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import {
  CompactIndexCard,
  EditorialFeatureCard,
  EditorialListCard,
  getEditableCategory,
  getEditableExcerpt,
  HorizontalFeatureCard,
  ImageFirstCard,
  postHref,
  RailPostCard,
} from '@/editable/cards/PostCards'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

function taskLabel(task: TaskKey) {
  return SITE_CONFIG.tasks.find((item) => item.key === task)?.label || task
}

function TopicPill({ label }: { label: string }) {
  return <span className="rounded-full border border-[rgba(94,0,6,0.16)] bg-white/80 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--slot4-accent-fill)]">{label}</span>
}

function DecorativeSectionArt({ variant = 'launch' }: { variant?: 'launch' | 'network' | 'clarity' }) {
  if (variant === 'network') {
    return (
      <div className="relative flex min-h-[18rem] items-center justify-center">
        <div className="absolute inset-0 rounded-[2.4rem] bg-[radial-gradient(circle_at_center,rgba(238,217,185,0.28),transparent_62%)]" />
        <div className="relative w-full max-w-[34rem] overflow-hidden rounded-[2rem] border border-[rgba(94,0,6,0.12)] bg-white/80 p-4 shadow-[0_18px_44px_rgba(94,0,6,0.08)]">
          <img
            src="/media.png"
            alt="Media workflow illustration"
            className="h-auto w-full rounded-[1.5rem] object-contain"
          />
        </div>
      </div>
    )
  }

  if (variant === 'clarity') {
    return (
      <div className="relative flex min-h-[18rem] items-center justify-center">
        <div className="absolute h-44 w-36 rounded-[2rem] border-[3px] border-[rgba(94,0,6,0.8)] bg-white" />
        <div className="absolute -left-4 h-32 w-10 rounded-full bg-[var(--slot4-accent-soft)]" />
        <div className="absolute -left-1 h-24 w-[6px] bg-[var(--slot4-accent-fill)]" />
        <div className="absolute h-4 w-16 -translate-y-12 rounded-full bg-[var(--slot4-lavender)]" />
        <div className="absolute h-4 w-10 translate-y-2 rotate-45 rounded-full bg-[var(--slot4-accent-fill)]" />
        <div className="absolute h-4 w-16 translate-y-10 -rotate-45 rounded-full bg-[var(--slot4-accent-fill)]" />
      </div>
    )
  }

  return (
    <div className="relative flex min-h-[18rem] items-center justify-center">
      <div className="absolute h-24 w-24 rounded-full bg-[rgba(94,0,6,0.08)]" />
      <div className="absolute translate-y-4">
        <div className="relative h-48 w-24 rounded-[45%_45%_18%_18%] border-[3px] border-[rgba(94,0,6,0.88)] bg-[linear-gradient(180deg,#fbf8f1_0%,#eed9b9_100%)]">
          <div className="absolute left-1/2 top-5 h-10 w-10 -translate-x-1/2 rounded-full bg-[var(--slot4-accent-soft)]" />
          <div className="absolute left-1/2 top-16 h-24 w-[6px] -translate-x-1/2 bg-[var(--slot4-accent-fill)]" />
        </div>
        <div className="absolute -left-10 top-20 h-14 w-10 rounded-[70%_30%_70%_30%] bg-[var(--slot4-accent-fill)]/90" />
        <div className="absolute -right-10 top-24 h-14 w-10 rounded-[30%_70%_30%_70%] bg-[var(--slot4-lavender)]/90" />
        <div className="absolute left-1/2 top-44 h-20 w-20 -translate-x-1/2 rounded-full bg-[rgba(94,0,6,0.12)] blur-md" />
      </div>
    </div>
  )
}

function AlternatingFeature({
  title,
  eyebrow,
  body,
  ctaLabel,
  ctaHref,
  reverse = false,
  variant,
}: {
  title: string
  eyebrow: string
  body: string
  ctaLabel: string
  ctaHref: string
  reverse?: boolean
  variant: 'launch' | 'network' | 'clarity'
}) {
  return (
    <section className="wirely-panel mt-10">
      <div className={`grid gap-10 px-6 py-12 sm:px-10 lg:min-h-[34rem] lg:grid-cols-2 lg:items-center lg:px-14 ${reverse ? 'lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1' : ''}`}>
        <div className="relative">
          <DecorativeSectionArt variant={variant} />
        </div>
        <div className="max-w-2xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--slot4-accent-fill)]">{eyebrow}</p>
          <h2 className="editorial-brand mt-4 text-[clamp(2.2rem,4vw,4rem)] font-semibold leading-[0.96] tracking-[-0.055em] text-[var(--slot4-page-text)]">{title}</h2>
          <p className="mt-5 text-base leading-8 text-[var(--slot4-muted-text)]">{body}</p>
          <Link href={ctaHref} className={`${dc.button.secondary} mt-7`}>
            {ctaLabel}
          </Link>
        </div>
      </div>
    </section>
  )
}

export function EditableHomeHero({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const lead = posts[0]
  const focus = posts.slice(1, 4)
  const heroTitle = pagesContent.home.hero.title.join(' ')

  return (
    <section className="pt-4 sm:pt-6">
      <div className={`${dc.shell.section}`}>
        <div className="wirely-panel px-6 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[rgba(94,0,6,0.1)] pb-5">
             <div className="hidden items-center gap-4 text-sm text-[var(--slot4-muted-text)] lg:flex">
              <span>Premium release workflow</span>
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--slot4-accent-fill)]" />
              <span>Designed for discovery</span>
            </div>
          </div>

          <div className="grid gap-8 pt-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:gap-10">
            <div className="max-w-2xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-[var(--slot4-accent-fill)]">{pagesContent.home.hero.badge}</p>
              <h1 className={`${dc.type.heroTitle} editorial-brand mt-4 max-w-3xl text-[var(--slot4-page-text)]`}>{heroTitle}</h1>
              <p className="mt-6 max-w-xl text-lg leading-9 text-[var(--slot4-muted-text)]">{pagesContent.home.hero.description}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/signup" className={dc.button.primary}>{pagesContent.home.hero.primaryCta.label}</Link>
                <Link href="/contact" className={dc.button.secondary}>{pagesContent.home.hero.secondaryCta.label}</Link>
              </div>
              <p className="mt-6 text-sm text-[var(--slot4-muted-text)]">Already have an account? <Link href="/login" className="font-semibold text-[var(--slot4-accent-fill)]">Sign in</Link>.</p>
            </div>

            {lead ? (
              <EditorialFeatureCard post={lead} href={postHref(primaryTask, lead, primaryRoute)} label="Lead distribution" />
            ) : (
              <div className="rounded-[2.2rem] border border-[rgba(94,0,6,0.12)] bg-white/80 p-8">
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--slot4-accent-fill)]">Publishing preview</p>
                <h2 className="editorial-serif mt-4 text-3xl font-semibold leading-tight">Your latest release will appear here.</h2>
                <p className="mt-4 text-sm leading-7 text-[var(--slot4-muted-text)]">As posts publish, the hero automatically highlights the newest distribution-ready story.</p>
              </div>
            )}
          </div>

          {focus.length ? (
            <div className="mt-8 grid gap-4 lg:grid-cols-3">
              {focus.map((post, index) => <RailPostCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />)}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}

export function EditableStoryRail({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const feature = posts[1] || posts[0]
  const railPosts = posts.slice(4, 8).length ? posts.slice(4, 8) : posts.slice(0, 4)
  if (!feature && !railPosts.length) return null

  return (
    <section className="pt-10">
      <div className={dc.shell.section}>
        {feature ? <HorizontalFeatureCard post={feature} href={postHref(primaryTask, feature, primaryRoute)} label="Introducing the framework" /> : null}

        {railPosts.length ? (
          <div className="mt-8 wirely-panel px-6 py-8 sm:px-8 lg:px-10">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[rgba(94,0,6,0.1)] pb-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--slot4-accent-fill)]">Latest stories</p>
                <h2 className="editorial-brand mt-2 text-[clamp(2rem,4vw,3.6rem)] font-semibold leading-none tracking-[-0.055em]">What media teams are watching</h2>
              </div>
              <Link href={primaryRoute} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[var(--slot4-accent-fill)]">
                View all
                <MoveRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {railPosts.map((post, index) => <RailPostCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />)}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const visualLead = posts[8] || posts[2] || posts[0]
  const editorialList = posts.slice(5, 9).length ? posts.slice(5, 9) : posts.slice(1, 5)
  const imageCards = posts.slice(9, 12).length ? posts.slice(9, 12) : posts.slice(2, 5)

  return (
    <section className="pt-10">
      <div className={dc.shell.section}>
        <div className="wirely-panel px-6 py-10 sm:px-8 lg:px-10">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <div className="flex items-end justify-between gap-4 border-b border-[rgba(94,0,6,0.1)] pb-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--slot4-accent-fill)]">Featured media coverage</p>
                  <h2 className="editorial-brand mt-2 text-[clamp(2rem,4vw,3.6rem)] font-semibold leading-none tracking-[-0.055em]">Secure earned media at scale</h2>
                </div>
                <Sparkles className="hidden h-6 w-6 text-[var(--slot4-accent-fill)] lg:block" />
              </div>
              <div className="mt-6 space-y-1">
                {editorialList.map((post, index) => (
                  <EditorialListCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {visualLead ? <HorizontalFeatureCard post={visualLead} href={postHref(primaryTask, visualLead, primaryRoute)} label="Syndicated article" /> : null}
              <div className="grid gap-4 sm:grid-cols-3">
                {imageCards.map((post) => (
                  <ImageFirstCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} label={getEditableCategory(post)} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <AlternatingFeature
          title="AI optimization is as essential as distribution itself."
          eyebrow="Optimization workflow"
          body="Polished headlines, structured summaries, and clean supporting content all help releases travel further. This interface is designed to make those core signals easier to publish and review."
          ctaLabel="Request a Demo"
          ctaHref="/contact"
          variant="clarity"
        />

        <AlternatingFeature
          title="Media contacts, partner content, and public reach in one system."
          eyebrow="Connected workflow"
          body="Move between releases, editorial stories, profiles, visuals, and supporting documents without losing the sense of one premium distribution platform."
          ctaLabel="Explore the archive"
          ctaHref='/search'
          reverse
          variant="network"
          
        />
      </div>
    </section>
  )
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const collected = timeSections.flatMap((section) => section.posts)
  const source = collected.length ? collected : posts.slice(3)
  const lead = source[0] || posts[0]
  const briefs = source.slice(1, 5)
  const imageFirst = source.slice(5, 8)
  if (!lead) return null

  return (
    <section className="pt-10">
      <div className={dc.shell.section}>
        <div className="wirely-panel px-6 py-10 sm:px-8 lg:px-10">
          <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
            <div>
              <div className="border-b border-[rgba(94,0,6,0.1)] pb-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--slot4-accent-fill)]">From the newsroom</p>
                <h2 className="editorial-brand mt-2 text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-none tracking-[-0.055em]">More to discover</h2>
              </div>
              <div className="mt-6">
                <HorizontalFeatureCard post={lead} href={postHref(primaryTask, lead, primaryRoute)} label="Editor&apos;s pick" />
              </div>
              {imageFirst.length ? (
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  {imageFirst.map((post) => (
                    <ImageFirstCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} label="Visual story" />
                  ))}
                </div>
              ) : null}
            </div>
            <div>
              <div className="border-b border-[rgba(94,0,6,0.1)] pb-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--slot4-accent-fill)]">Quick reads</p>
                <h2 className="editorial-brand mt-2 text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-none tracking-[-0.055em]">The briefing</h2>
              </div>
              <div className="mt-5 space-y-3">
                {briefs.map((post, index) => <CompactIndexCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />)}
              </div>

              <form action="/search" className="mt-8 rounded-[2rem] border border-[rgba(94,0,6,0.12)] bg-[linear-gradient(180deg,rgba(238,217,185,0.35),rgba(255,255,255,0.85))] p-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--slot4-accent-fill)]">Archive search</p>
                <h3 className="editorial-serif mt-3 text-2xl font-semibold leading-tight">Search the full {taskLabel(primaryTask).toLowerCase()} archive</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--slot4-muted-text)]">Explore every story, release, and resource published on {SITE_CONFIG.name}.</p>
                <label className="mt-5 flex overflow-hidden rounded-full border border-[rgba(94,0,6,0.18)] bg-white">
                  <Search className="ml-4 mt-3.5 h-4 w-4 text-[var(--slot4-accent-fill)]" />
                  <input name="q" placeholder="Search stories" className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm outline-none" />
                  <button className="bg-[var(--slot4-accent-fill)] px-5 text-xs font-bold uppercase tracking-[0.14em] text-white">Search</button>
                </label>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function EditableHomeCta() {
  return (
    <section className="py-10 pb-14">
      <div className={dc.shell.section}>
        <div className="wirely-panel overflow-hidden bg-[linear-gradient(180deg,rgba(188,42,17,0.06),rgba(238,217,185,0.8))] px-6 py-12 text-center sm:px-8 lg:px-10 lg:py-16">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--slot4-accent-fill)]">{pagesContent.home.cta.badge}</p>
          <h2 className="editorial-brand mx-auto mt-4 max-w-4xl text-[clamp(2.4rem,5vw,4.4rem)] font-semibold leading-[0.96] tracking-[-0.055em]">{pagesContent.home.cta.title}</h2>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-[var(--slot4-muted-text)]">{pagesContent.home.cta.description}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href={pagesContent.home.cta.primaryCta.href} className={dc.button.primary}>{pagesContent.home.cta.primaryCta.label}</Link>
            <Link href={pagesContent.home.cta.secondaryCta.href} className={dc.button.secondary}>{pagesContent.home.cta.secondaryCta.label}</Link>
          </div>
        </div>
      </div>
    </section>
  )
}
