'use client'

import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react'
import { Fragment, useState } from 'react'
import Link from './Link'
import headerNavLinks from '@/data/headerNavLinks'
import siteMetadata from '@/data/siteMetadata'
import Image from 'next/image'

const MobileNav = () => {
  const [navShow, setNavShow] = useState(false)

  const onToggleNav = () => {
    setNavShow((status) => !status)
  }

  return (
    <>
      <button
        aria-label="Toggle Menu"
        onClick={onToggleNav}
        className="hover:text-primary-500 dark:hover:text-primary-400 py-1 text-gray-700 transition-colors outline-none select-none sm:hidden dark:text-gray-300"
      >
        <span className="font-mono text-sm">[menu]</span>
      </button>
      <Transition appear show={navShow} as={Fragment}>
        <Dialog as="div" onClose={onToggleNav}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 z-60 bg-black/25" />
          </TransitionChild>

          <TransitionChild
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="translate-x-full opacity-0"
            enterTo="translate-x-0 opacity-95"
            leave="transition ease-in duration-200 transform"
            leaveFrom="translate-x-0 opacity-95"
            leaveTo="translate-x-full opacity-0"
          >
            <DialogPanel className="fixed top-0 left-0 z-70 h-full w-full bg-white/95 font-mono duration-300 dark:bg-gray-950/98">
              <nav className="mt-8 flex h-full basis-0 flex-col items-start overflow-y-auto pt-2 pl-8 text-left text-lg">
                <span className="mb-6 flex items-center gap-2 text-sm select-none">
                  <Image
                    src="/static/images/logo/logo-symbol-transparent.png"
                    alt="ASON Logo"
                    width={28}
                    height={28}
                    className="dark:invert"
                  />
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {siteMetadata.headerTitle}
                  </span>
                </span>
                {headerNavLinks.map((link) => (
                  <Link
                    key={link.title}
                    href={link.href}
                    className="hover:text-primary-500 dark:hover:text-primary-400 mb-3 py-1 pr-4 text-gray-900 outline outline-0 dark:text-gray-100"
                    onClick={onToggleNav}
                  >
                    <span className="text-gray-300 dark:text-gray-700">/ </span>
                    {link.title}
                  </Link>
                ))}
              </nav>

              <button
                className="hover:text-primary-500 dark:hover:text-primary-400 fixed top-7 right-4 z-80 p-4 font-mono text-gray-900 select-none dark:text-gray-100"
                aria-label="Toggle Menu"
                onClick={onToggleNav}
              >
                [x]
              </button>
            </DialogPanel>
          </TransitionChild>
        </Dialog>
      </Transition>
    </>
  )
}

export default MobileNav
