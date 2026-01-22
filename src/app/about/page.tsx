import { getFounderData } from '@/lib/founder-data'
import {
  HeroSection,
  MissionSection,
  HowItWorksSection,
  RoadmapSection,
  TeamSection,
  CommunitySection,
  LinksSection,
} from './sections'

export default async function AboutPage() {
  const founderData = await getFounderData()

  return (
    <>
      <HeroSection />
      <MissionSection />
      <HowItWorksSection />
      <RoadmapSection />
      <TeamSection founderData={founderData} />
      <CommunitySection />
      <LinksSection />
    </>
  )
}
