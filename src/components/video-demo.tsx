'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

interface VideoConfig {
  youtubeId: string
  title?: string
}

// Default video configuration - easily updateable
const defaultVideoConfig: VideoConfig = {
  youtubeId: 'dQw4w9WgXcQ', // Placeholder - replace with actual SIP demo video
  title: 'SIP Protocol Demo',
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

interface VideoDemoProps {
  config?: VideoConfig
  caption?: string
}

export function VideoDemo({
  config = defaultVideoConfig,
  caption = 'See SIP in action',
}: VideoDemoProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  const thumbnailUrl = `https://img.youtube.com/vi/${config.youtubeId}/maxresdefault.jpg`
  const embedUrl = `https://www.youtube-nocookie.com/embed/${config.youtubeId}?autoplay=1&rel=0&modestbranding=1`

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="flex flex-col items-center"
    >
      {/* Video Container with Glow Effect */}
      <div className="relative w-full max-w-3xl">
        {/* Glow effect behind video */}
        <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-50" />

        {/* Video wrapper */}
        <div className="relative rounded-2xl overflow-hidden border border-gray-800 bg-gray-900">
          {/* 16:9 aspect ratio container */}
          <div className="relative pt-[56.25%]">
            {isPlaying ? (
              <iframe
                src={embedUrl}
                title={config.title || 'Video Demo'}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            ) : (
              <button
                onClick={() => setIsPlaying(true)}
                className="absolute inset-0 w-full h-full group cursor-pointer"
                aria-label="Play video"
              >
                {/* Thumbnail */}
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${thumbnailUrl})` }}
                />

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />

                {/* Play button */}
                <motion.div
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-purple-500/90 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:bg-purple-500 transition-colors">
                    <PlayIcon className="h-8 w-8 sm:h-10 sm:w-10 text-white ml-1" />
                  </div>
                </motion.div>

                {/* Duration badge - optional */}
                <div className="absolute bottom-4 right-4 px-2 py-1 rounded bg-black/70 text-white text-xs font-medium">
                  2:30
                </div>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Caption */}
      {caption && (
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-4 text-gray-400 text-sm italic"
        >
          {caption}
        </motion.p>
      )}
    </motion.div>
  )
}

// Export config type for external use
export type { VideoConfig }
