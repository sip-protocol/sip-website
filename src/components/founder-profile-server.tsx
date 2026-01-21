import { getFounderData } from '@/lib/founder-data'
import { FounderProfile } from './founder-profile'

/**
 * Server component wrapper for FounderProfile
 *
 * Fetches GitHub data on the server with 1-hour caching.
 * All pages using this component share the same cached data.
 */
export async function FounderProfileServer() {
  const data = await getFounderData()
  return <FounderProfile data={data} />
}
