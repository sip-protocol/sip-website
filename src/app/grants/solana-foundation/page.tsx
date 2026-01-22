import { getFounderData } from '@/lib/founder-data'
import { SolanaFoundationContent } from './content'

export default async function SolanaFoundationPitchPage() {
  const founderData = await getFounderData()

  return <SolanaFoundationContent founderData={founderData} />
}
