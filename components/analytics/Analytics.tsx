import { Analytics as VercelAnalytics } from '@vercel/analytics/next'

/**
 * 站点当前只接 Vercel Analytics；如需 Umami/GA/PostHog，在这里追加对应组件。
 */
export function Analytics() {
  return <VercelAnalytics />
}
