'use client'

import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import SearchButton from './SearchButton'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const Header = () => {
  const pathname = usePathname()
  const headerClass =
    'sticky top-0 z-50 flex items-center w-full justify-between border-b border-gray-200 bg-white/80 px-6 py-4 font-mono text-sm backdrop-blur dark:border-gray-800 dark:bg-gray-950/80 sm:px-10 lg:px-16 xl:px-20'

  return (
    <header className={headerClass}>
      {/* Logo: icon + name */}
      <Link
        href="/"
        aria-label={siteMetadata.headerTitle}
        className="group flex items-center gap-2"
      >
        <Image
          src="/static/images/logo/logo-symbol-transparent.webp"
          alt="ASON Logo"
          width={28}
          height={28}
          className="dark:invert"
        />
        <span className="font-semibold tracking-tight text-gray-900 dark:text-gray-100">
          {siteMetadata.headerTitle}
        </span>
      </Link>

      {/* Path-style navigation */}
      <div className="flex items-center gap-3 sm:gap-4">
        <nav className="hidden items-center sm:flex">
          <span className="px-1 text-gray-300 dark:text-gray-700">/</span>
          {headerNavLinks
            .filter((link) => link.href !== '/')
            .map((link) => {
              const active = pathname === link.href || pathname.startsWith(link.href + '/')
              return (
                <span key={link.href} className="flex items-center px-1">
                  <Link
                    href={link.href}
                    aria-current={active ? 'page' : undefined}
                    className={
                      'transition-colors ' +
                      (active
                        ? 'text-primary-500 dark:text-primary-400'
                        : 'hover:text-primary-500 dark:hover:text-primary-400 text-gray-700 dark:text-gray-300')
                    }
                  >
                    {link.title}
                  </Link>
                  <span className="px-1 text-gray-300 dark:text-gray-700">/</span>
                </span>
              )
            })}
        </nav>
        <SearchButton />
        <ThemeSwitch />
        <MobileNav />
      </div>
    </header>
  )
}

export default Header
