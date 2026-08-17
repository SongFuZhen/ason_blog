import { AboutPage } from '@/components/about/AboutPage'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: '关于' })

export default function Page() {
  return <AboutPage />
}
