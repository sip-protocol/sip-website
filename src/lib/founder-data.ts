/**
 * Founder profile data aggregator
 *
 * Combines dynamic GitHub data with static content.
 * All GitHub data is cached for 1 hour via Next.js fetch cache.
 */

import { getGitHubUserStats, getRepoStats } from './github'

// ============================================================================
// Types
// ============================================================================

export interface NotableProject {
  name: string
  description: string
  url: string
  stars?: number
  forks?: number
  language?: string
  tags?: string[]
  // GitHub identifiers for dynamic fetching
  githubOwner?: string
  githubRepo?: string
}

export interface FounderStats {
  repositories: number
  stars: number
  followers: number
  commits?: number
  prs?: number
  badge?: string
}

export interface FounderData {
  // Identity (static)
  name: string
  username: string
  role: string
  avatar: string
  bio: string

  // Social links (static)
  github: string
  twitter: string
  twitterProject: string
  website: string

  // Stats (dynamic from GitHub + static overrides)
  stats: FounderStats

  // Projects (dynamic stars, static descriptions)
  projects: NotableProject[]

  // Content (static)
  techStack: string[]
  quote: {
    text: string
    subtitle?: string
  }
  originStory: {
    title: string
    content: string
  }
  soloFounderPhilosophy: {
    title: string
    content: string
    highlights?: string[]
  }
  vision: {
    title: string
    timeline: string
    goals: string[]
  }

  // Metadata
  lastUpdated: string
  isLive: boolean // true if GitHub data was fetched, false if using fallbacks
}

// ============================================================================
// Static Configuration (content that doesn't change)
// ============================================================================

const GITHUB_USERNAME = 'rz1989s'

const STATIC_CONFIG = {
  name: 'RECTOR',
  username: '@rz1989s',
  role: 'Solo Founder, SIP Protocol  •  🇮🇩 Indonesia',
  bio: 'Indonesian developer building the privacy standard for Web3. Blockchain architect with $13,300+ in hackathon wins (2024-2025) including MonkeDAO, Zypherpunk (3 tracks), and Superteam Indonesia. Focused on cryptographic privacy, cross-chain infrastructure, and high-performance systems. Privacy is a right, not a feature.',
  github: 'https://github.com/rz1989s',
  twitter: 'https://x.com/rz1989s',
  twitterProject: 'https://x.com/sipprotocol',
  website: 'https://rectorspace.com',
  techStack: ['TypeScript', 'Rust', 'Python', 'Noir', 'React', 'Solana', 'NEAR', 'Zcash', 'Docker'],
  quote: {
    text: '"One person. {testCount} tests. Zero shortcuts."',
    subtitle: '— Pure execution, no committee decisions',
  },
  originStory: {
    title: 'Why Privacy?',
    content: 'Remember when HTTP was the norm? We now consider sites without HTTPS dangerous. Web3 is in its HTTP era — transparency is the default, but crime follows money. As Web3 matures, privacy becomes essential defense. SIP doesn\'t ignore blockchain fundamentals — it makes them better. Privacy isn\'t hiding, it\'s protection.',
  },
  soloFounderPhilosophy: {
    title: 'Why Solo?',
    content: 'Many doubt solo founders. I think differently. After building with teams, I learned that wrong teams are more dangerous than external threats — they\'re internal ones. Good projects with good teams still die from lack of synchronization. Solo means pure execution.',
    highlights: [
      'No committee decisions',
      'No synchronization overhead',
      'Ship fast, iterate faster',
    ],
  },
  vision: {
    title: 'The Endgame',
    timeline: '2028',
    goals: [
      'SIP as THE privacy standard — like HTTPS for Web3',
      'Privacy toggle in top 10 wallets globally',
      '"Privacy by SIP" recognized like "Secured by SSL"',
    ],
  },
}

// Projects with GitHub references for dynamic star counts
const PROJECTS_CONFIG: NotableProject[] = [
  {
    name: 'SIP Protocol',
    description: 'Winner Zypherpunk Hackathon 3 Tracks — Privacy layer with {testCount}+ tests ($6,500)',
    url: 'https://github.com/sip-protocol/sip-protocol',
    language: 'TypeScript',
    tags: ['Winner', 'Privacy', 'ZK'],
    githubOwner: 'sip-protocol',
    githubRepo: 'sip-protocol',
  },
  {
    name: 'Web3 Deal Discovery',
    description: '1st Place MonkeDAO/Superteam — NFT coupons on Solana with escrow marketplace ($5,000 + Gen3 NFT)',
    url: 'https://github.com/rz1989s/web3-deal-discovery',
    language: 'TypeScript',
    tags: ['1st Place', 'Solana', 'NFT'],
    githubOwner: 'rz1989s',
    githubRepo: 'web3-deal-discovery',
  },
  {
    name: 'OpenBudget.ID',
    description: '2nd Place Garuda Spark/Superteam Indonesia — On-chain government spending transparency ($1,500)',
    url: 'https://github.com/rz1989s/openbudget-id',
    language: 'TypeScript',
    tags: ['2nd Place', 'Solana', 'Gov'],
    githubOwner: 'rz1989s',
    githubRepo: 'openbudget-id',
  },
  {
    name: 'Saros SDK Docs',
    description: '1st Place Documentation Bounty — Interactive API Explorer for Saros DEX ($300)',
    url: 'https://github.com/rz1989s/saros-sdk-docs',
    language: 'TypeScript',
    tags: ['1st Place', 'Docs'],
    githubOwner: 'rz1989s',
    githubRepo: 'saros-sdk-docs',
  },
  {
    name: 'claude-code-statusline',
    description: 'Terminal statusline with cost tracking — {stars} stars, {forks} forks (community favorite)',
    url: 'https://github.com/rz1989s/claude-code-statusline',
    language: 'Shell',
    tags: ['{stars} Stars', 'CLI'],
    githubOwner: 'rz1989s',
    githubRepo: 'claude-code-statusline',
  },
]

// Fallback values when GitHub API fails
const FALLBACK_STATS: FounderStats = {
  repositories: 33,
  stars: 246,
  followers: 27,
  commits: 4500,
  prs: 146,
  badge: '6,850+ Tests',
}

const FALLBACK_PROJECT_STATS: Record<string, { stars: number; forks: number }> = {
  'sip-protocol/sip-protocol': { stars: 1, forks: 0 },
  'rz1989s/web3-deal-discovery': { stars: 1, forks: 0 },
  'rz1989s/openbudget-id': { stars: 1, forks: 0 },
  'rz1989s/saros-sdk-docs': { stars: 1, forks: 0 },
  'rz1989s/claude-code-statusline': { stars: 240, forks: 17 },
}

// Current test count (update this when test count changes significantly)
const CURRENT_TEST_COUNT = '6,850'

/**
 * Get static founder data (no GitHub API calls)
 * Used as fallback for client components
 */
export function getStaticFounderData(): FounderData {
  // Build projects with fallback stars
  const projects: NotableProject[] = PROJECTS_CONFIG.map(project => {
    const repoKey = `${project.githubOwner}/${project.githubRepo}`
    const fallback = FALLBACK_PROJECT_STATS[repoKey]

    const stars = fallback?.stars ?? 0
    const forks = fallback?.forks ?? 0

    const description = project.description
      .replace('{testCount}', CURRENT_TEST_COUNT)
      .replace('{stars}', stars.toLocaleString())
      .replace('{forks}', forks.toLocaleString())

    const tags = project.tags?.map(tag =>
      tag
        .replace('{stars}', stars.toLocaleString())
        .replace('{forks}', forks.toLocaleString())
    )

    return {
      name: project.name,
      description,
      url: project.url,
      stars,
      forks,
      language: project.language,
      tags,
    }
  })

  const quote = {
    text: STATIC_CONFIG.quote.text.replace('{testCount}', CURRENT_TEST_COUNT),
    subtitle: STATIC_CONFIG.quote.subtitle,
  }

  return {
    name: STATIC_CONFIG.name,
    username: STATIC_CONFIG.username,
    role: STATIC_CONFIG.role,
    avatar: 'https://avatars.githubusercontent.com/u/95009642?v=4',
    bio: STATIC_CONFIG.bio,
    github: STATIC_CONFIG.github,
    twitter: STATIC_CONFIG.twitter,
    twitterProject: STATIC_CONFIG.twitterProject,
    website: STATIC_CONFIG.website,
    stats: FALLBACK_STATS,
    projects,
    techStack: STATIC_CONFIG.techStack,
    quote,
    originStory: STATIC_CONFIG.originStory,
    soloFounderPhilosophy: STATIC_CONFIG.soloFounderPhilosophy,
    vision: STATIC_CONFIG.vision,
    lastUpdated: new Date().toISOString(),
    isLive: false,
  }
}

// ============================================================================
// Data Fetching
// ============================================================================

/**
 * Get founder profile data with dynamic GitHub stats
 *
 * This function is cached by Next.js for 1 hour.
 * All pages calling this will share the same cached result.
 */
export async function getFounderData(): Promise<FounderData> {
  // Fetch GitHub data in parallel
  const [userStats, repoStatsMap] = await Promise.all([
    getGitHubUserStats(GITHUB_USERNAME),
    getRepoStats(
      PROJECTS_CONFIG
        .filter(p => p.githubOwner && p.githubRepo)
        .map(p => ({ owner: p.githubOwner!, repo: p.githubRepo! }))
    ),
  ])

  const isLive = userStats !== null

  // Build stats (use GitHub data or fallback)
  const stats: FounderStats = userStats
    ? {
        repositories: userStats.publicRepos,
        stars: userStats.totalStars,
        followers: userStats.followers,
        badge: `${CURRENT_TEST_COUNT}+ Tests`,
      }
    : FALLBACK_STATS

  // Build projects with dynamic stars
  const projects: NotableProject[] = PROJECTS_CONFIG.map(project => {
    const repoKey = `${project.githubOwner}/${project.githubRepo}`
    const repoStats = repoStatsMap.get(repoKey)
    const fallback = FALLBACK_PROJECT_STATS[repoKey]

    const stars = repoStats?.stars ?? fallback?.stars ?? 0
    const forks = repoStats?.forks ?? fallback?.forks ?? 0

    // Replace placeholders in description and tags
    const description = project.description
      .replace('{testCount}', CURRENT_TEST_COUNT)
      .replace('{stars}', stars.toLocaleString())
      .replace('{forks}', forks.toLocaleString())

    const tags = project.tags?.map(tag =>
      tag
        .replace('{stars}', stars.toLocaleString())
        .replace('{forks}', forks.toLocaleString())
    )

    return {
      name: project.name,
      description,
      url: project.url,
      stars,
      forks,
      language: project.language,
      tags,
    }
  })

  // Build quote with test count
  const quote = {
    text: STATIC_CONFIG.quote.text.replace('{testCount}', CURRENT_TEST_COUNT),
    subtitle: STATIC_CONFIG.quote.subtitle,
  }

  return {
    name: STATIC_CONFIG.name,
    username: STATIC_CONFIG.username,
    role: STATIC_CONFIG.role,
    avatar: userStats?.avatarUrl ?? 'https://avatars.githubusercontent.com/u/95009642?v=4',
    bio: STATIC_CONFIG.bio,
    github: STATIC_CONFIG.github,
    twitter: STATIC_CONFIG.twitter,
    twitterProject: STATIC_CONFIG.twitterProject,
    website: STATIC_CONFIG.website,
    stats,
    projects,
    techStack: STATIC_CONFIG.techStack,
    quote,
    originStory: STATIC_CONFIG.originStory,
    soloFounderPhilosophy: STATIC_CONFIG.soloFounderPhilosophy,
    vision: STATIC_CONFIG.vision,
    lastUpdated: new Date().toISOString(),
    isLive,
  }
}

/**
 * Get founder data for export/API use
 * Returns a plain object suitable for JSON serialization
 */
export async function getFounderDataJSON(): Promise<FounderData> {
  return getFounderData()
}
