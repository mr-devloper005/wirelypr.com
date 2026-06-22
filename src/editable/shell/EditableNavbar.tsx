'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, Menu, Search, X } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

function BrandMark() {
  return (
  <img src={'/favicon.png'} width={'100px'} height={'100px'}  alt='logo' />
  )
}

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const { session, logout } = useEditableLocalAuthSession()
  const links = globalContent.nav.primaryLinks as ReadonlyArray<{ label: string; href: string }>

  return (
    <header className="sticky top-0 z-50 border-b border-[rgba(94,0,6,0.1)] bg-[rgba(246,240,228,0.9)] text-[var(--slot4-page-text)] backdrop-blur-xl">
      <div className="mx-auto max-w-[1480px] px-4 sm:px-6 lg:px-10">
        <div className="flex min-h-[5.5rem] items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            <button type="button" onClick={() => setOpen((value) => !value)} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(94,0,6,0.14)] bg-white/80 lg:hidden" aria-label="Toggle navigation">
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <Link href="/" className="flex min-w-0 items-center gap-3">
              <BrandMark />
              <div className="min-w-0">
                <p className="editorial-serif truncate text-xl font-semibold tracking-[-0.05em] sm:text-2xl">{SITE_CONFIG.name}</p>
                <p className="truncate text-xs text-[var(--slot4-muted-text)]">{globalContent.nav.tagline}</p>
              </div>
            </Link>
          </div>

          <nav className="hidden items-center gap-8 lg:flex">
            {links.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm font-medium text-[var(--slot4-page-text)] transition hover:text-[var(--slot4-accent-fill)]">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-5 lg:flex">
            {session ? (
              <>
                <button type="button" onClick={logout} className="text-sm font-medium transition hover:text-[var(--slot4-accent-fill)]">Logout</button>
                <Link href="/create" className="rounded-full bg-[var(--slot4-dark-bg)] px-5 py-3 text-sm font-bold text-white transition hover:bg-[var(--slot4-accent-fill)]">Publish</Link>
              </>
            ) : (
              <>
                <Link href={globalContent.nav.actions.secondary.href} className="text-sm font-medium transition hover:text-[var(--slot4-accent-fill)]">{globalContent.nav.actions.secondary.label}</Link>
                <Link href={globalContent.nav.actions.primary.href} className="rounded-full bg-[var(--slot4-dark-bg)] px-5 py-3 text-sm font-bold text-white transition hover:bg-[var(--slot4-accent-fill)]">{globalContent.nav.actions.primary.label}</Link>
              </>
            )}
            <Link href="/search" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(94,0,6,0.14)] bg-white/80 transition hover:bg-white" aria-label="Search">
              <Search className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {open ? (
          <div className="border-t border-[rgba(94,0,6,0.1)] py-4 lg:hidden">
            <div className="grid gap-3">
              <form action="/search" className="flex overflow-hidden rounded-full border border-[rgba(94,0,6,0.14)] bg-white">
                <Search className="ml-4 mt-3.5 h-4 w-4 text-[var(--slot4-accent-fill)]" />
                <input name="q" type="search" placeholder="Search the archive" className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm outline-none" />
              </form>
              {links.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="rounded-[1.4rem] border border-[rgba(94,0,6,0.1)] bg-white/80 px-4 py-3 text-sm font-semibold">
                  {item.label}
                </Link>
              ))}
              {session ? (
                <>
                  <Link href="/create" onClick={() => setOpen(false)} className="rounded-[1.4rem] border border-[rgba(94,0,6,0.1)] bg-white/80 px-4 py-3 text-sm font-semibold">Create</Link>
                  <button type="button" onClick={() => { logout(); setOpen(false) }} className="rounded-[1.4rem] border border-[rgba(94,0,6,0.1)] bg-white/80 px-4 py-3 text-left text-sm font-semibold">Logout</button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setOpen(false)} className="rounded-[1.4rem] border border-[rgba(94,0,6,0.1)] bg-white/80 px-4 py-3 text-sm font-semibold">Sign In</Link>
                  <Link href="/signup" onClick={() => setOpen(false)} className="rounded-[1.4rem] bg-[var(--slot4-dark-bg)] px-4 py-3 text-sm font-semibold text-white">Register</Link>
                </>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </header>
  )
}
