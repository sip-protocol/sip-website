'use client'

import { motion } from 'framer-motion'
import { useState, useRef } from 'react'
import { Play, Pause, Maximize, Volume2, VolumeX } from 'lucide-react'

// CDN video URL with cache-bust for re-encoded version
const CDN_VIDEO_URL = 'https://cdn.sip-protocol.org/videos/sip-demo.mp4?v=2'
const CDN_POSTER_URL = 'https://cdn.sip-protocol.org/videos/sip-demo-poster.jpg'

interface VideoConfig {
  youtubeId?: string
  selfHostedUrl?: string
  title?: string
  poster?: string
}

// Default video configuration - now uses self-hosted CDN
const defaultVideoConfig: VideoConfig = {
  selfHostedUrl: CDN_VIDEO_URL,
  title: 'SIP Protocol Demo',
  poster: CDN_POSTER_URL,
}

interface VideoDemoProps {
  config?: VideoConfig
  caption?: string
}

export function VideoDemo({
  config = defaultVideoConfig,
  caption = 'See SIP in action',
}: VideoDemoProps) {
  // Use self-hosted if available, otherwise fall back to YouTube
  const useSelfHosted = !!config.selfHostedUrl

  if (useSelfHosted) {
    return (
      <SelfHostedVideo
        url={config.selfHostedUrl!}
        title={config.title}
        poster={config.poster}
        caption={caption}
      />
    )
  }

  // Fallback to YouTube
  return <YouTubeVideo config={config} caption={caption} />
}

// Self-hosted video component with custom controls
function SelfHostedVideo({
  url,
  title,
  poster,
  caption,
}: {
  url: string
  title?: string
  poster?: string
  caption?: string
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [showControls, setShowControls] = useState(true)

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen()
      } else {
        videoRef.current.requestFullscreen()
      }
    }
  }

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
        <div
          className="relative rounded-2xl overflow-hidden border border-gray-800 bg-gray-900 group"
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => isPlaying && setShowControls(false)}
        >
          {/* 16:9 aspect ratio container */}
          <div className="relative pt-[56.25%]">
            <video
              ref={videoRef}
              src={url}
              title={title || 'Video Demo'}
              poster={poster}
              className="absolute inset-0 w-full h-full object-contain cursor-pointer"
              onClick={togglePlay}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
              playsInline
              preload="metadata"
            />

            {/* Play button overlay (when paused) */}
            {!isPlaying && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer transition-opacity"
                onClick={togglePlay}
              >
                <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors shadow-lg">
                  <Play className="w-8 h-8 text-gray-900 ml-1" fill="currentColor" />
                </div>
              </div>
            )}

            {/* Custom controls */}
            <div
              className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 ${
                showControls ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlay}
                    className="p-2 rounded-full hover:bg-white/20 transition-colors"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 text-white" />
                    ) : (
                      <Play className="w-5 h-5 text-white" fill="currentColor" />
                    )}
                  </button>
                  <button
                    onClick={toggleMute}
                    className="p-2 rounded-full hover:bg-white/20 transition-colors"
                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? (
                      <VolumeX className="w-5 h-5 text-white" />
                    ) : (
                      <Volume2 className="w-5 h-5 text-white" />
                    )}
                  </button>
                </div>
                <button
                  onClick={toggleFullscreen}
                  className="p-2 rounded-full hover:bg-white/20 transition-colors"
                  aria-label="Fullscreen"
                >
                  <Maximize className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
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

// YouTube fallback component
function YouTubeVideo({
  config,
  caption,
}: {
  config: VideoConfig
  caption?: string
}) {
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
