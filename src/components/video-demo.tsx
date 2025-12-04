'use client'

import { motion } from 'framer-motion'

interface VideoConfig {
  youtubeId: string
  title?: string
}

// Default video configuration - easily updateable
const defaultVideoConfig: VideoConfig = {
  youtubeId: 'dQw4w9WgXcQ', // Placeholder - replace with actual SIP demo video
  title: 'SIP Protocol Demo',
}

interface VideoDemoProps {
  config?: VideoConfig
  caption?: string
}

export function VideoDemo({
  config = defaultVideoConfig,
  caption = 'See SIP in action',
}: VideoDemoProps) {
  // Use youtube-nocookie for privacy-enhanced embedding (works better with strict headers)
  const embedUrl = `https://www.youtube-nocookie.com/embed/${config.youtubeId}?rel=0&modestbranding=1`

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
            <iframe
              src={embedUrl}
              title={config.title || 'Video Demo'}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
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
