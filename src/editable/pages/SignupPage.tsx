import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalSignupForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

const signupHighlights = [
  'Create a profile for publishing, archive access, and distribution workflows.',
  'Keep your details ready for future release submissions and support requests.',
  'Step into a consistent editorial environment built around media visibility.',
]

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/signup', title: 'Sign up', description: pagesContent.auth.signup.metadataDescription })
}

export default function SignupPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="px-4 py-8 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-[1480px]">
            <div className="wirely-panel overflow-hidden">
              <div className="grid min-h-[calc(100vh-13rem)] gap-0 lg:grid-cols-[0.98fr_1.02fr]">
                <div className="flex flex-col justify-center border-b border-[rgba(94,0,6,0.1)] px-6 py-10 sm:px-8 lg:border-b-0 lg:border-r lg:px-10 lg:py-12">
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--slot4-accent-fill)]">Create account</p>
                  <h1 className="editorial-brand mt-3 text-[clamp(2.2rem,4vw,4rem)] font-semibold leading-[0.96] tracking-[-0.055em]">{pagesContent.auth.signup.formTitle}</h1>
                  <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--slot4-muted-text)]">Set up your profile to start publishing, save account details, and move through the platform with a consistent workspace.</p>
                  <EditableLocalSignupForm />
                  <p className="mt-6 border-t border-[rgba(94,0,6,0.1)] pt-5 text-sm text-[var(--slot4-muted-text)]">
                    Already have an account?{' '}
                    <Link href="/login" className="inline-flex items-center gap-1 font-bold text-[var(--slot4-accent-fill)] transition hover:underline">
                      {pagesContent.auth.signup.loginCta}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </p>
                </div>

                <div className="flex flex-col justify-center px-6 py-10 sm:px-8 lg:px-10 lg:py-12">
                  <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-[var(--slot4-accent-fill)]">{pagesContent.auth.signup.badge}</p>
                  <h2 className="editorial-brand mt-4 max-w-3xl text-[clamp(3rem,6vw,5.7rem)] font-semibold leading-[0.92] tracking-[-0.06em]">{pagesContent.auth.signup.title}</h2>
                  <p className="mt-6 max-w-2xl text-lg leading-9 text-[var(--slot4-muted-text)]">{pagesContent.auth.signup.description}</p>

                  <div className="mt-8 grid gap-4">
                    {signupHighlights.map((item) => (
                      <div key={item} className="rounded-[1.5rem] border border-[rgba(94,0,6,0.1)] bg-white/75 px-4 py-4">
                        <p className="flex items-start gap-3 text-sm leading-7 text-[var(--slot4-page-text)]">
                          <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[var(--slot4-accent-fill)]" />
                          <span>{item}</span>
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 rounded-[2rem] border border-[rgba(94,0,6,0.12)] bg-[linear-gradient(180deg,rgba(238,217,185,0.38),rgba(255,255,255,0.94))] p-6">
                    <div className="flex items-center gap-3">
                      <div className="wirely-outline flex h-12 w-12 items-center justify-center rounded-full text-[var(--slot4-accent-fill)]">
                        <Sparkles className="h-5 w-5" />
                      </div>
                      <p className="text-sm leading-7 text-[var(--slot4-muted-text)]">A premium onboarding flow that matches the rest of the site instead of feeling like a generic utility page.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
