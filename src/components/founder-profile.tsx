'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { getStaticFounderData, type FounderData } from '@/lib/founder-data'

// GitHub Icons
function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
    </svg>
  )
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  )
}

function LiveIndicator() {
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
      </span>
      Live
    </span>
  )
}

interface FounderProfileProps {
  data?: FounderData
}

export function FounderProfile({ data: providedData }: FounderProfileProps) {
  // Use provided data or fall back to static data
  const data = providedData ?? getStaticFounderData()
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="w-full max-w-3xl mx-auto"
    >
      <div className="p-6 sm:p-8 rounded-2xl bg-gray-900/70 border border-gray-800">
        {/* Header: Avatar + Info + Social */}
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Avatar */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            viewport={{ once: true }}
            className="flex-shrink-0"
          >
            <div className="h-28 w-28 rounded-full bg-gradient-to-br from-red-500 to-red-700 p-1">
              <div className="h-full w-full rounded-full bg-gray-900 overflow-hidden">
                {data.avatar ? (
                  <Image
                    src={data.avatar}
                    alt={data.name || 'Avatar'}
                    width={112}
                    height={112}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-3xl font-bold text-purple-400">
                    {data.name?.charAt(0) || 'R'}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Info */}
          <div className="flex-grow">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-bold text-white">{data.name}</h3>
                  {data.isLive && <LiveIndicator />}
                </div>
                <p className="text-cyan-400 text-sm">{data.username}</p>
                <p className="text-gray-400 text-sm mt-1">{data.role}</p>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-2">
                {data.github && (
                  <a
                    href={data.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center h-9 w-9 rounded-full bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
                    aria-label="GitHub"
                  >
                    <GitHubIcon className="h-4 w-4" />
                  </a>
                )}
                {data.twitterProject && (
                  <a
                    href={data.twitterProject}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center h-9 px-3 rounded-full bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors gap-1.5"
                    aria-label="SIP Protocol Twitter"
                    title="@sipprotocol"
                  >
                    <XIcon className="h-4 w-4" />
                    <span className="text-xs font-medium">SIP</span>
                  </a>
                )}
                {data.twitter && (
                  <a
                    href={data.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center h-9 w-9 rounded-full bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
                    aria-label="Personal Twitter"
                    title="@rz1989s"
                  >
                    <XIcon className="h-4 w-4" />
                  </a>
                )}
                {data.website && (
                  <a
                    href={data.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center h-9 w-9 rounded-full bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
                    aria-label="Website"
                  >
                    <GlobeIcon className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        {data.bio && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-6"
          >
            <h4 className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
              <span className="text-purple-400">💡</span> About
            </h4>
            <p className="text-gray-300 text-sm leading-relaxed">{data.bio}</p>
          </motion.div>
        )}

        {/* Origin Story */}
        {data.originStory && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.25 }}
            viewport={{ once: true }}
            className="mt-6"
          >
            <h4 className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
              <span className="text-purple-400">🔐</span> {data.originStory.title}
            </h4>
            <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20">
              <p className="text-gray-300 text-sm leading-relaxed italic">{data.originStory.content}</p>
            </div>
          </motion.div>
        )}

        {/* Solo Founder Philosophy */}
        {data.soloFounderPhilosophy && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-6"
          >
            <h4 className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
              <span className="text-purple-400">⚡</span> {data.soloFounderPhilosophy.title}
            </h4>
            <p className="text-gray-300 text-sm leading-relaxed mb-3">{data.soloFounderPhilosophy.content}</p>
            {data.soloFounderPhilosophy.highlights && (
              <div className="flex flex-wrap gap-2">
                {data.soloFounderPhilosophy.highlights.map((highlight) => (
                  <span
                    key={highlight}
                    className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium"
                  >
                    {highlight}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Vision */}
        {data.vision && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.35 }}
            viewport={{ once: true }}
            className="mt-6"
          >
            <h4 className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
              <span className="text-purple-400">🎯</span> {data.vision.title}
              <span className="ml-auto text-xs text-cyan-400 font-mono">{data.vision.timeline}</span>
            </h4>
            <div className="space-y-2">
              {data.vision.goals.map((goal, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-3 rounded-lg bg-gray-800/50 border border-gray-700"
                >
                  <span className="text-green-400 text-sm">→</span>
                  <span className="text-gray-300 text-sm">{goal}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* GitHub Stats */}
        {data.stats && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-6"
          >
            <h4 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
              <span className="text-purple-400">📊</span> GitHub Stats
              {data.isLive && (
                <span className="text-xs text-gray-500 font-normal ml-auto">
                  Updated {new Date(data.lastUpdated).toLocaleDateString()}
                </span>
              )}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatBox value={data.stats.repositories} label="Repositories" color="cyan" />
              <StatBox value={data.stats.stars} label="Stars Earned" color="amber" />
              <StatBox value={data.stats.followers} label="Followers" color="green" />
              {data.stats.badge ? (
                <StatBox value={data.stats.badge} label="Achievement" color="purple" isText />
              ) : data.stats.commits ? (
                <StatBox value={data.stats.commits} label="Commits" color="purple" />
              ) : null}
            </div>
          </motion.div>
        )}

        {/* Notable Projects */}
        {data.projects && data.projects.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-6"
          >
            <h4 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
              <span className="text-purple-400">🚀</span> Notable Projects
            </h4>
            <div className="space-y-3">
              {data.projects.map((project) => (
                <a
                  key={project.name}
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 rounded-xl bg-gray-800/50 border border-gray-700 hover:border-gray-600 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-grow">
                      <h5 className="font-semibold text-white">{project.name}</h5>
                      <p className="text-gray-400 text-sm mt-1">{project.description}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        {project.tags?.map((tag) => (
                          <span
                            key={tag}
                            className={`px-2 py-0.5 rounded text-xs font-medium ${
                              tag === 'Winner' || tag === '1st Place' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                              tag === '2nd Place' ? 'bg-gray-400/20 text-gray-300 border border-gray-400/30' :
                              tag.includes('Stars') ? 'bg-amber-500/20 text-amber-400' :
                              tag === 'Shell' ? 'bg-green-500/20 text-green-400' :
                              tag === 'TypeScript' ? 'bg-blue-500/20 text-blue-400' :
                              tag === 'Solana' ? 'bg-purple-500/20 text-purple-400' :
                              tag === 'Privacy' || tag === 'ZK' ? 'bg-pink-500/20 text-pink-400' :
                              tag === 'CLI' ? 'bg-cyan-500/20 text-cyan-400' :
                              tag === 'NFT' ? 'bg-orange-500/20 text-orange-400' :
                              tag === 'Gov' ? 'bg-emerald-500/20 text-emerald-400' :
                              tag === 'Docs' ? 'bg-indigo-500/20 text-indigo-400' :
                              'bg-gray-500/20 text-gray-400'
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    {project.stars !== undefined && project.stars > 0 && (
                      <div className="flex items-center gap-1 px-2 py-1 rounded bg-amber-500/10 border border-amber-500/20">
                        <StarIcon className="h-3 w-3 text-amber-400" />
                        <span className="text-amber-400 text-xs font-medium">{project.stars}</span>
                      </div>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </motion.div>
        )}

        {/* Tech Stack */}
        {data.techStack && data.techStack.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            viewport={{ once: true }}
            className="mt-6"
          >
            <h4 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
              <span className="text-purple-400">🛠️</span> Tech Stack
            </h4>
            <div className="flex flex-wrap gap-2">
              {data.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-300 text-sm font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Quote */}
        {data.quote && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.6 }}
            viewport={{ once: true }}
            className="mt-8 pt-6 border-t border-gray-800"
          >
            <p className="text-center text-lg italic text-gray-300">{data.quote.text}</p>
            {data.quote.subtitle && (
              <p className="text-center text-sm text-gray-500 mt-2">{data.quote.subtitle}</p>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

// Helper component for stat boxes
function StatBox({
  value,
  label,
  color,
  isText,
}: {
  value: string | number
  label: string
  color: 'cyan' | 'amber' | 'green' | 'purple'
  isText?: boolean
}) {
  const colorClasses = {
    cyan: 'text-cyan-400',
    amber: 'text-amber-400',
    green: 'text-green-400',
    purple: 'text-purple-400',
  }

  const displayValue = typeof value === 'number' ? value.toLocaleString() : value

  return (
    <div className="p-3 rounded-xl bg-gray-800/70 border border-gray-700 text-center">
      <div className={`${isText ? 'text-sm' : 'text-xl'} font-bold ${colorClasses[color]}`}>
        {displayValue}
      </div>
      <div className="text-xs text-gray-500 mt-1">{label}</div>
    </div>
  )
}
