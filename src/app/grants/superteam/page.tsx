import { getFounderData } from '@/lib/founder-data'
import { SuperteamContent } from './content'

export default async function SuperteamPitchPage() {
  const founderData = await getFounderData()

  return <SuperteamContent founderData={founderData} />
}
