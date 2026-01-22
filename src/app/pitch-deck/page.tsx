import { getFounderData } from '@/lib/founder-data'
import { PitchDeckContent } from './content'

export default async function PitchDeckPage() {
  const founderData = await getFounderData()

  return <PitchDeckContent founderData={founderData} />
}
