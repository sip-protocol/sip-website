import { getFounderData } from '@/lib/founder-data'
import { AuditSubsidyContent } from './content'

export default async function AuditSubsidyPage() {
  const founderData = await getFounderData()

  return <AuditSubsidyContent founderData={founderData} />
}
