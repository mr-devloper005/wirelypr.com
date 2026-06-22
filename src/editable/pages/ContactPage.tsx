'use client'

import { FileText, Mail, Megaphone, Sparkles } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

const desks = [
  { icon: FileText, title: 'Editorial desk', body: 'Share announcement details, story notes, corrections, and release copy questions.' },
  { icon: Megaphone, title: 'Distribution planning', body: 'Talk through syndication, launch timing, media coverage plans, and public visibility goals.' },
  { icon: Mail, title: 'General support', body: 'Reach out for account access, publishing help, or site-related questions that need a direct response.' },
]

export default function ContactPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="px-4 py-8 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-[1480px]">
            <div className="wirely-panel px-6 py-8 sm:px-8 lg:px-10 lg:py-12">
              <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-[var(--slot4-accent-fill)]">{pagesContent.contact.eyebrow}</p>
                  <h1 className="editorial-brand mt-4 max-w-5xl text-[clamp(3rem,6vw,5.7rem)] font-semibold leading-[0.92] tracking-[-0.06em]">{pagesContent.contact.title}</h1>
                  <p className="mt-6 max-w-3xl text-lg leading-9 text-[var(--slot4-muted-text)]">{pagesContent.contact.description}</p>
                </div>

                <div className="rounded-[2.2rem] border border-[rgba(94,0,6,0.12)] bg-[linear-gradient(180deg,rgba(238,217,185,0.38),rgba(255,255,255,0.94))] p-6 sm:p-8">
                  <div className="flex items-center gap-3">
                    <div className="wirely-outline flex h-12 w-12 items-center justify-center rounded-full text-[var(--slot4-accent-fill)]">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <p className="text-sm leading-7 text-[var(--slot4-muted-text)]">Bring us the campaign goal, release draft, or support need. We’ll help route it to the right publishing lane.</p>
                  </div>
                  <div className="mt-6 grid gap-3">
                    <div className="rounded-[1.4rem] border border-[rgba(94,0,6,0.1)] bg-white/80 px-4 py-4 text-sm text-[var(--slot4-page-text)]">Best for launch planning, distribution questions, and editorial handoff.</div>
                    <div className="rounded-[1.4rem] border border-[rgba(94,0,6,0.1)] bg-white/80 px-4 py-4 text-sm text-[var(--slot4-page-text)]">Use the form for both publishing-related requests and general support.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 pb-14 sm:px-6 lg:px-10">
          <div className="mx-auto grid max-w-[1480px] gap-8 lg:grid-cols-[0.72fr_1.28fr]">
            <aside className="wirely-panel px-6 py-8 sm:px-8 lg:px-10">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--slot4-accent-fill)]">Contact lanes</p>
              <div className="mt-6 grid gap-4">
                {desks.map((desk, index) => (
                  <div key={desk.title} className="rounded-[1.7rem] border border-[rgba(94,0,6,0.1)] bg-white/80 p-5">
                    <div className="flex items-center justify-between gap-3">
                      <desk.icon className="h-5 w-5 text-[var(--slot4-accent-fill)]" />
                      <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--slot4-soft-muted-text)]">0{index + 1}</span>
                    </div>
                    <h2 className="editorial-serif mt-4 text-3xl font-semibold leading-tight tracking-[-0.04em]">{desk.title}</h2>
                    <p className="mt-3 text-sm leading-7 text-[var(--slot4-muted-text)]">{desk.body}</p>
                  </div>
                ))}
              </div>
            </aside>

            <div className="wirely-panel px-6 py-8 sm:px-8 lg:px-10">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--slot4-accent-fill)]">Send a message</p>
              <h2 className="editorial-brand mt-3 text-[clamp(2.2rem,4vw,4rem)] font-semibold leading-[0.96] tracking-[-0.055em]">{pagesContent.contact.formTitle}</h2>
              <div className="mt-8">
                <EditableContactLeadForm />
              </div>
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
