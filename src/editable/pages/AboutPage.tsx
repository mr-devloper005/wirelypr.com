import Link from 'next/link'
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

const highlights = [
  'Premium editorial structure for public-facing updates.',
  'Connected release, archive, and resource discovery.',
  'Cleaner reading flow from headline to supporting detail.',
]

export default function AboutPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="px-4 py-8 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-[1480px]">
            <div className="wirely-panel px-6 py-8 sm:px-8 lg:px-10 lg:py-12">
              <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-[var(--slot4-accent-fill)]">{pagesContent.about.badge}</p>
                  <h1 className="editorial-brand mt-4 max-w-5xl text-[clamp(3rem,6vw,5.7rem)] font-semibold leading-[0.92] tracking-[-0.06em]">{pagesContent.about.title}</h1>
                  <p className="mt-6 max-w-3xl text-lg leading-9 text-[var(--slot4-muted-text)]">{pagesContent.about.description}</p>
                  <div className="mt-7 flex flex-wrap gap-3">
                    <Link href="/mediaDistribution" className="rounded-full bg-[var(--slot4-dark-bg)] px-6 py-3 text-sm font-bold text-white transition hover:bg-[var(--slot4-accent-fill)]">Explore releases</Link>
                    <Link href="/contact" className="rounded-full border border-[rgba(94,0,6,0.14)] bg-white px-6 py-3 text-sm font-bold transition hover:bg-[var(--slot4-accent-soft)]">Talk to us</Link>
                  </div>
                </div>

                <div className="rounded-[2.2rem] border border-[rgba(94,0,6,0.12)] bg-[linear-gradient(180deg,rgba(238,217,185,0.38),rgba(255,255,255,0.94))] p-6 sm:p-8">
                  <div className="flex items-center gap-3">
                    <div className="wirely-outline flex h-12 w-12 items-center justify-center rounded-full text-[var(--slot4-accent-fill)]">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-semibold text-[var(--slot4-muted-text)]">{SITE_CONFIG.name} is designed to make distributed stories feel composed, visible, and easier to trust.</p>
                  </div>
                  <div className="mt-6 grid gap-4">
                    {highlights.map((item) => (
                      <div key={item} className="rounded-[1.4rem] border border-[rgba(94,0,6,0.1)] bg-white/80 px-4 py-4">
                        <p className="flex items-start gap-3 text-sm leading-7 text-[var(--slot4-page-text)]">
                          <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[var(--slot4-accent-fill)]" />
                          <span>{item}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 pb-8 sm:px-6 lg:px-10">
          <div className="mx-auto grid max-w-[1480px] gap-8 lg:grid-cols-[1.08fr_0.92fr]">
            <article className="wirely-panel px-6 py-8 sm:px-8 lg:px-10">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--slot4-accent-fill)]">About {SITE_CONFIG.name}</p>
              <div className="article-content mt-8 space-y-6">
                {pagesContent.about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </article>

            <aside className="wirely-panel px-6 py-8 sm:px-8 lg:px-10">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--slot4-accent-fill)]">Core principles</p>
              <div className="mt-6 grid gap-4">
                {pagesContent.about.values.map((value, index) => (
                  <div key={value.title} className="rounded-[1.7rem] border border-[rgba(94,0,6,0.1)] bg-white/80 p-5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--slot4-accent-fill)]">0{index + 1}</p>
                    <h2 className="editorial-serif mt-3 text-3xl font-semibold leading-tight tracking-[-0.04em]">{value.title}</h2>
                    <p className="mt-3 text-sm leading-7 text-[var(--slot4-muted-text)]">{value.description}</p>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </section>

        <section className="px-4 pb-14 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-[1480px]">
            <div className="wirely-panel overflow-hidden bg-[linear-gradient(180deg,rgba(188,42,17,0.06),rgba(238,217,185,0.8))] px-6 py-10 sm:px-8 lg:px-10 lg:py-14">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--slot4-accent-fill)]">Next step</p>
                  <h2 className="editorial-brand mt-3 max-w-3xl text-[clamp(2.2rem,4vw,4rem)] font-semibold leading-[0.96] tracking-[-0.055em]">Move from story planning to polished public distribution.</h2>
                </div>
                <Link href="/search" className="inline-flex w-fit items-center gap-2 rounded-full bg-[var(--slot4-dark-bg)] px-6 py-3 text-sm font-bold text-white transition hover:bg-[var(--slot4-accent-fill)]">
                  Explore the archive
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
