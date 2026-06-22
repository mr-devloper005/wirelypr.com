'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableFooter() {
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()
  const columns = globalContent.footer.columns

  return (
    <footer className="mt-4 border-t border-[rgba(94,0,6,0.12)] bg-[var(--slot4-surface-bg)] text-[var(--slot4-page-text)]">
      <div className="mx-auto max-w-[1480px] px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
        <div className="wirely-panel px-6 py-10 sm:px-8 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr_0.85fr]">
            <div>
              <div className="flex items-center gap-4">
                <img src="/favicon.png" alt={`${SITE_CONFIG.name} logo`} className="h-14 w-14 rounded-full object-contain" />
                <p className="editorial-brand text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">{SITE_CONFIG.name}</p>
              </div>
              <p className="mt-4 max-w-xl text-base leading-8 text-[var(--slot4-muted-text)]">{globalContent.footer.description}</p>
            </div>

            {columns.map((column) => (
              <div key={column.title}>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--slot4-accent-fill)]">{column.title}</h3>
                <div className="mt-5 grid gap-3">
                  {column.links.map((link) => (
                    <Link key={link.href} href={link.href} className="inline-flex items-center justify-between text-sm font-medium transition hover:text-[var(--slot4-accent-fill)]">
                      {link.label}
                      <ArrowRight className="h-4 w-4 opacity-60" />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-4 border-t border-[rgba(94,0,6,0.1)] pt-6 sm:grid-cols-[1fr_auto] sm:items-center">
            <p className="text-sm text-[var(--slot4-muted-text)]">{globalContent.footer.bottomNote}</p>
            <div className="flex flex-wrap gap-4 text-sm">
              {session ? (
                <>
                  <Link href="/create" className="font-medium hover:text-[var(--slot4-accent-fill)]">Publish</Link>
                  <button onClick={logout} className="font-medium hover:text-[var(--slot4-accent-fill)]">Logout</button>
                </>
              ) : (
                <>
                  <Link href="/login" className="font-medium hover:text-[var(--slot4-accent-fill)]">Sign In</Link>
                  <Link href="/signup" className="font-medium hover:text-[var(--slot4-accent-fill)]">Register</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-[rgba(94,0,6,0.08)] px-4 py-5 text-center text-[11px] text-[var(--slot4-soft-muted-text)]">© {year} {SITE_CONFIG.name}. Curated releases, public updates, and editorial distribution.</div>
    </footer>
  )
}
