'use client'

import { ReactNode } from 'react'

interface PhoneMockupProps {
  children: ReactNode
  className?: string
  variant?: 'seeker' | 'iphone' | 'android'
}

/**
 * CSS-based phone device mockup frame
 * Supports different device variants for authentic device appearance
 */
export function PhoneMockup({
  children,
  className = '',
  variant = 'seeker',
}: PhoneMockupProps) {
  const widthClass = {
    seeker: 'w-[280px]',
    iphone: 'w-[300px]',
    android: 'w-[290px]',
  }[variant]

  return (
    <div className={`relative mx-auto ${widthClass} ${className}`}>
      {/* Outer frame - device body */}
      <div
        className="relative rounded-[3rem] p-3 bg-gradient-to-b from-gray-700 via-gray-800 to-gray-900 shadow-[0_0_0_2px_rgba(255,255,255,0.1),0_0_0_4px_rgba(0,0,0,0.3),0_25px_50px_-12px_rgba(0,0,0,0.5)]"
      >
        {/* Inner bezel */}
        <div className="relative rounded-[2.25rem] bg-black p-1 overflow-hidden">
          {/* Screen area */}
          <div className="relative rounded-[2rem] overflow-hidden bg-gray-950">
            {/* Status bar notch area (Seeker style - subtle) */}
            {variant === 'seeker' && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10">
                <div className="w-20 h-5 bg-black rounded-b-xl flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-gray-800" />
                </div>
              </div>
            )}

            {/* iPhone style notch */}
            {variant === 'iphone' && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10">
                <div className="w-32 h-7 bg-black rounded-b-2xl flex items-center justify-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gray-700" />
                  <div className="w-12 h-3 rounded-full bg-gray-800" />
                </div>
              </div>
            )}

            {/* Android style punch hole */}
            {variant === 'android' && (
              <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10">
                <div className="w-3 h-3 rounded-full bg-gray-800 border border-gray-700" />
              </div>
            )}

            {/* Screen content */}
            <div className="relative aspect-[9/19.5]">{children}</div>
          </div>
        </div>

        {/* Side buttons (power + volume) */}
        <div className="absolute -right-1 top-24 w-1 h-12 bg-gray-600 rounded-r-sm" />
        <div className="absolute -left-1 top-20 w-1 h-8 bg-gray-600 rounded-l-sm" />
        <div className="absolute -left-1 top-32 w-1 h-12 bg-gray-600 rounded-l-sm" />
      </div>

      {/* Reflection/glare effect */}
      <div className="absolute inset-0 rounded-[3rem] pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent" />
      </div>
    </div>
  )
}

/**
 * Simple image wrapper for phone screenshots
 */
interface PhoneScreenProps {
  src: string
  alt: string
  className?: string
}

export function PhoneScreen({ src, alt, className = '' }: PhoneScreenProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={`w-full h-full object-cover object-top ${className}`}
    />
  )
}
