/**
 * GitHub API utilities with Next.js caching
 *
 * All fetch calls use Next.js built-in cache with 1-hour revalidation.
 * This ensures all pages share the same cached data.
 */

const GITHUB_API = 'https://api.github.com'
const CACHE_REVALIDATE = 3600 // 1 hour in seconds

// GitHub API types
interface GitHubUser {
  login: string
  public_repos: number
  followers: number
  following: number
  avatar_url: string
  bio: string | null
  created_at: string
}

interface GitHubRepo {
  name: string
  full_name: string
  description: string | null
  stargazers_count: number
  forks_count: number
  language: string | null
  html_url: string
  fork: boolean
}

export interface GitHubUserStats {
  username: string
  avatarUrl: string
  publicRepos: number
  followers: number
  totalStars: number
  fetchedAt: string
}

export interface GitHubRepoStats {
  name: string
  fullName: string
  description: string | null
  stars: number
  forks: number
  language: string | null
  url: string
}

/**
 * Get headers for GitHub API requests
 * Uses token if available for higher rate limits (5000/hr vs 60/hr)
 */
function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'SIP-Protocol-Website',
  }

  // Support multiple env var names for flexibility
  const token = process.env.GITHUB_TOKEN || process.env.GH_PAT
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  return headers
}

/**
 * Fetch GitHub user profile
 */
async function fetchUser(username: string): Promise<GitHubUser | null> {
  try {
    const res = await fetch(`${GITHUB_API}/users/${username}`, {
      headers: getHeaders(),
      next: { revalidate: CACHE_REVALIDATE },
    })

    if (!res.ok) {
      console.error(`GitHub API error (user): ${res.status} ${res.statusText}`)
      return null
    }

    return res.json()
  } catch (error) {
    console.error('Failed to fetch GitHub user:', error)
    return null
  }
}

/**
 * Fetch all repositories for a user (handles pagination)
 */
async function fetchUserRepos(username: string): Promise<GitHubRepo[]> {
  try {
    const repos: GitHubRepo[] = []
    let page = 1
    const perPage = 100

    while (true) {
      const res = await fetch(
        `${GITHUB_API}/users/${username}/repos?per_page=${perPage}&page=${page}&type=owner`,
        {
          headers: getHeaders(),
          next: { revalidate: CACHE_REVALIDATE },
        }
      )

      if (!res.ok) {
        console.error(`GitHub API error (repos): ${res.status} ${res.statusText}`)
        break
      }

      const data: GitHubRepo[] = await res.json()
      repos.push(...data)

      // If we got less than perPage, we've reached the end
      if (data.length < perPage) break
      page++

      // Safety limit
      if (page > 10) break
    }

    return repos
  } catch (error) {
    console.error('Failed to fetch GitHub repos:', error)
    return []
  }
}

/**
 * Fetch a specific repository's stats
 */
async function fetchRepo(owner: string, repo: string): Promise<GitHubRepoStats | null> {
  try {
    const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}`, {
      headers: getHeaders(),
      next: { revalidate: CACHE_REVALIDATE },
    })

    if (!res.ok) {
      console.error(`GitHub API error (repo ${owner}/${repo}): ${res.status} ${res.statusText}`)
      return null
    }

    const data: GitHubRepo = await res.json()

    return {
      name: data.name,
      fullName: data.full_name,
      description: data.description,
      stars: data.stargazers_count,
      forks: data.forks_count,
      language: data.language,
      url: data.html_url,
    }
  } catch (error) {
    console.error(`Failed to fetch repo ${owner}/${repo}:`, error)
    return null
  }
}

/**
 * Get aggregated stats for a GitHub user
 * Includes total stars calculated from all owned repos
 */
export async function getGitHubUserStats(username: string): Promise<GitHubUserStats | null> {
  const [user, repos] = await Promise.all([
    fetchUser(username),
    fetchUserRepos(username),
  ])

  if (!user) return null

  // Calculate total stars from owned (non-forked) repos
  const totalStars = repos
    .filter(repo => !repo.fork)
    .reduce((sum, repo) => sum + repo.stargazers_count, 0)

  return {
    username: user.login,
    avatarUrl: user.avatar_url,
    publicRepos: user.public_repos,
    followers: user.followers,
    totalStars,
    fetchedAt: new Date().toISOString(),
  }
}

/**
 * Get stats for multiple specific repositories
 */
export async function getRepoStats(repos: { owner: string; repo: string }[]): Promise<Map<string, GitHubRepoStats>> {
  const results = await Promise.all(
    repos.map(({ owner, repo }) => fetchRepo(owner, repo))
  )

  const statsMap = new Map<string, GitHubRepoStats>()

  repos.forEach(({ owner, repo }, index) => {
    const stats = results[index]
    if (stats) {
      statsMap.set(`${owner}/${repo}`, stats)
    }
  })

  return statsMap
}
