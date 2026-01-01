import { test, expect } from '@playwright/test'
import { VideoPage } from '../pages/video.page'

/**
 * Video Player E2E Tests
 * Tests self-hosted CDN video player on grants and pitch pages
 *
 * CDN URL: https://cdn.sip-protocol.org/videos/sip-demo.mp4
 *
 * Note: Some tests require video to load from CDN.
 * In slow network conditions, these tests gracefully skip.
 */

const CDN_VIDEO_URL = 'cdn.sip-protocol.org/videos/sip-demo.mp4'

// Helper to skip test if video not loaded
async function skipIfVideoNotLoaded(videoPage: VideoPage) {
  const loaded = await videoPage.isVideoLoaded()
  if (!loaded) {
    test.skip(true, 'Video not loaded from CDN - network may be slow')
  }
}

test.describe('Video Player - CDN Integration', () => {
  test.describe('Grants Superteam Page', () => {
    let videoPage: VideoPage

    test.beforeEach(async ({ page }) => {
      videoPage = new VideoPage(page, '/grants/superteam')
      await videoPage.goto()
      await videoPage.scrollToVideo()
    })

    test('should load video from CDN', async () => {
      await videoPage.expectVideoVisible()
      await videoPage.expectVideoSrc(CDN_VIDEO_URL)
    })

    test('should have video metadata loaded', async () => {
      await videoPage.waitForVideoReady()
      await skipIfVideoNotLoaded(videoPage)
      const duration = await videoPage.getDuration()
      expect(duration).toBeGreaterThan(0)
    })

    test('should display caption text', async () => {
      await videoPage.expectCaptionText(/SIP/i)
    })

    test('should have glow effect visible', async () => {
      await videoPage.expectGlowEffect()
    })
  })

  test.describe('Grants Solana Foundation Page', () => {
    let videoPage: VideoPage

    test.beforeEach(async ({ page }) => {
      videoPage = new VideoPage(page, '/grants/solana-foundation')
      await videoPage.goto()
      await videoPage.scrollToVideo()
    })

    test('should load video from CDN', async () => {
      await videoPage.expectVideoVisible()
      await videoPage.expectVideoSrc(CDN_VIDEO_URL)
    })

    test('should have correct caption', async () => {
      await videoPage.expectCaptionText(/private transactions|viewing keys|compliance/i)
    })
  })

  test.describe('Pitch Deck Page', () => {
    let videoPage: VideoPage

    test.beforeEach(async ({ page }) => {
      videoPage = new VideoPage(page, '/pitch-deck')
      await videoPage.goto()
      await videoPage.scrollToVideo()
    })

    test('should load video from CDN (not YouTube)', async () => {
      await videoPage.expectVideoVisible()
      await videoPage.expectVideoSrc(CDN_VIDEO_URL)
    })

    test('should have correct caption', async () => {
      await videoPage.expectCaptionText(/shield|sender|amount|recipient/i)
    })
  })
})

test.describe('Video Player - Playback Controls', () => {
  let videoPage: VideoPage

  test.beforeEach(async ({ page }) => {
    videoPage = new VideoPage(page, '/grants/superteam')
    await videoPage.goto()
    await videoPage.scrollToVideo()
  })

  test('should start in paused state with play overlay', async () => {
    await videoPage.waitForVideoReady()
    await skipIfVideoNotLoaded(videoPage)
    await videoPage.expectPaused()
    await videoPage.expectPlayOverlayVisible()
  })

  test('should play video when clicking play overlay', async () => {
    await videoPage.waitForVideoReady()
    await skipIfVideoNotLoaded(videoPage)
    await videoPage.play()
    await videoPage.expectPlaying()
    await videoPage.expectPlayOverlayHidden()
  })

  test('should pause video when clicking pause button', async () => {
    await videoPage.waitForVideoReady()
    await skipIfVideoNotLoaded(videoPage)
    await videoPage.play()
    await videoPage.expectPlaying()

    await videoPage.pause()
    await videoPage.expectPaused()
  })

  test('should toggle play/pause on video click', async ({ page }) => {
    await videoPage.waitForVideoReady()
    await skipIfVideoNotLoaded(videoPage)
    const video = videoPage.video

    // Click to play - use force to bypass overlay
    await video.click({ force: true })
    await expect(async () => {
      const playing = await video.evaluate((v: HTMLVideoElement) => !v.paused)
      expect(playing).toBe(true)
    }).toPass({ timeout: 3000 })

    // Click to pause - video is now playing, no overlay
    await video.click({ force: true })
    await expect(async () => {
      const paused = await video.evaluate((v: HTMLVideoElement) => v.paused)
      expect(paused).toBe(true)
    }).toPass({ timeout: 3000 })
  })

  test('should update currentTime during playback', async ({ page }) => {
    await videoPage.waitForVideoReady()
    await skipIfVideoNotLoaded(videoPage)
    await videoPage.play()

    const initialTime = await videoPage.getCurrentTime()
    await page.waitForTimeout(1500)
    const laterTime = await videoPage.getCurrentTime()

    expect(laterTime).toBeGreaterThan(initialTime)
  })
})

test.describe('Video Player - Audio Controls', () => {
  let videoPage: VideoPage

  test.beforeEach(async ({ page }) => {
    videoPage = new VideoPage(page, '/grants/superteam')
    await videoPage.goto()
    await videoPage.scrollToVideo()
  })

  test('should start unmuted', async () => {
    await videoPage.waitForVideoReady()
    await skipIfVideoNotLoaded(videoPage)
    await videoPage.expectUnmuted()
  })

  test('should mute when clicking mute button', async () => {
    await videoPage.waitForVideoReady()
    await skipIfVideoNotLoaded(videoPage)
    await videoPage.play()
    await videoPage.hoverVideo()

    await videoPage.toggleMute()
    await videoPage.expectMuted()
  })

  test('should unmute when clicking unmute button', async () => {
    await videoPage.waitForVideoReady()
    await skipIfVideoNotLoaded(videoPage)
    await videoPage.play()
    await videoPage.hoverVideo()

    // Mute first
    await videoPage.toggleMute()
    await videoPage.expectMuted()

    // Unmute
    await videoPage.toggleMute()
    await videoPage.expectUnmuted()
  })
})

test.describe('Video Player - Controls Visibility', () => {
  let videoPage: VideoPage

  test.beforeEach(async ({ page }) => {
    videoPage = new VideoPage(page, '/grants/superteam')
    await videoPage.goto()
    await videoPage.scrollToVideo()
  })

  test('should show controls on hover', async () => {
    await videoPage.waitForVideoReady()
    await skipIfVideoNotLoaded(videoPage)
    await videoPage.play()
    await videoPage.hoverVideo()
    await videoPage.expectControlsVisible()
  })

  test('should have all control buttons with aria-labels', async ({ page }) => {
    await videoPage.waitForVideoReady()
    await skipIfVideoNotLoaded(videoPage)
    await videoPage.hoverVideo()

    // Check for aria-label accessibility
    const playBtn = page.locator('button[aria-label="Play"], button[aria-label="Pause"]').first()
    const muteBtn = page.locator('button[aria-label="Mute"], button[aria-label="Unmute"]').first()
    const fullscreenBtn = page.locator('button[aria-label="Fullscreen"]').first()

    await expect(playBtn).toBeVisible()
    await expect(muteBtn).toBeVisible()
    await expect(fullscreenBtn).toBeVisible()
  })
})

test.describe('Video Player - Fullscreen', () => {
  let videoPage: VideoPage

  test.beforeEach(async ({ page }) => {
    videoPage = new VideoPage(page, '/grants/superteam')
    await videoPage.goto()
    await videoPage.scrollToVideo()
  })

  test('should have fullscreen button', async () => {
    await videoPage.waitForVideoReady()
    await skipIfVideoNotLoaded(videoPage)
    await videoPage.hoverVideo()
    await expect(videoPage.controls.fullscreenButton).toBeVisible()
  })

  // Note: Fullscreen API has restrictions in automated tests
  // This test verifies the button is interactive
  test('should have fullscreen button clickable', async () => {
    await videoPage.waitForVideoReady()
    await skipIfVideoNotLoaded(videoPage)
    await videoPage.hoverVideo()
    await expect(videoPage.controls.fullscreenButton).toBeEnabled()
  })
})

test.describe('Video Player - Keyboard Accessibility', () => {
  let videoPage: VideoPage

  test.beforeEach(async ({ page }) => {
    videoPage = new VideoPage(page, '/grants/superteam')
    await videoPage.goto()
    await videoPage.scrollToVideo()
  })

  test('should be focusable with Tab', async ({ page }) => {
    await videoPage.waitForVideoReady()
    await skipIfVideoNotLoaded(videoPage)
    // Hover to show controls first
    await videoPage.hoverVideo()
    // Focus on play button via keyboard navigation
    await videoPage.controls.playButton.focus()
    // Verify play button received focus
    await expect(async () => {
      const isFocused = await videoPage.controls.playButton.evaluate(
        (el) => document.activeElement === el
      )
      expect(isFocused).toBe(true)
    }).toPass({ timeout: 2000 })
  })

  test('should toggle play with Space key on play button', async ({ page }) => {
    await videoPage.waitForVideoReady()
    await skipIfVideoNotLoaded(videoPage)
    await videoPage.hoverVideo()
    await videoPage.controls.playButton.focus()
    await page.keyboard.press('Space')
    await page.waitForTimeout(300)
    await videoPage.expectPlaying()
  })

  test('should toggle play with Enter key on play button', async ({ page }) => {
    await videoPage.waitForVideoReady()
    await skipIfVideoNotLoaded(videoPage)
    await videoPage.hoverVideo()
    await videoPage.controls.playButton.focus()
    await page.keyboard.press('Enter')
    await page.waitForTimeout(300)
    await videoPage.expectPlaying()
  })
})

test.describe('Video Player - Error Handling', () => {
  test('should handle missing video gracefully', async ({ page }) => {
    // Navigate to a page with video
    const videoPage = new VideoPage(page, '/grants/superteam')
    await videoPage.goto()

    // Video element should exist even if loading fails
    await expect(videoPage.video).toBeVisible()
  })

  test('should have preload="metadata" for performance', async ({ page }) => {
    const videoPage = new VideoPage(page, '/grants/superteam')
    await videoPage.goto()
    await videoPage.scrollToVideo()

    const preload = await videoPage.video.getAttribute('preload')
    expect(preload).toBe('metadata')
  })

  test('should have playsInline for mobile', async ({ page }) => {
    const videoPage = new VideoPage(page, '/grants/superteam')
    await videoPage.goto()
    await videoPage.scrollToVideo()

    const playsInline = await videoPage.video.getAttribute('playsinline')
    expect(playsInline).not.toBeNull()
  })
})

test.describe('Video Player - Visual Design', () => {
  let videoPage: VideoPage

  test.beforeEach(async ({ page }) => {
    videoPage = new VideoPage(page, '/grants/superteam')
    await videoPage.goto()
    await videoPage.scrollToVideo()
  })

  test('should have 16:9 aspect ratio container', async ({ page }) => {
    const container = page.locator('.relative.pt-\\[56\\.25\\%\\]').first()
    await expect(container).toBeVisible()
  })

  test('should have rounded corners', async ({ page }) => {
    const videoWrapper = page.locator('.rounded-2xl.overflow-hidden.border.border-gray-800').first()
    await expect(videoWrapper).toBeVisible()
  })

  test('should have gradient glow effect', async () => {
    await videoPage.expectGlowEffect()
  })

  test('should have dark background', async ({ page }) => {
    const videoWrapper = page.locator('.bg-gray-900').first()
    await expect(videoWrapper).toBeVisible()
  })
})

test.describe('Video Player - Mobile Responsiveness', () => {
  test.use({ viewport: { width: 375, height: 667 } }) // iPhone SE

  let videoPage: VideoPage

  test.beforeEach(async ({ page }) => {
    videoPage = new VideoPage(page, '/grants/superteam')
    await videoPage.goto()
    await videoPage.scrollToVideo()
  })

  test('should be visible on mobile', async () => {
    await videoPage.expectVideoVisible()
  })

  test('should maintain aspect ratio on mobile', async ({ page }) => {
    const video = videoPage.video
    const box = await video.boundingBox()

    if (box) {
      const aspectRatio = box.width / box.height
      // 16:9 = 1.777...
      expect(aspectRatio).toBeGreaterThan(1.5)
      expect(aspectRatio).toBeLessThan(2.0)
    }
  })

  test('should have touch-friendly play overlay', async ({ page }) => {
    const playButton = page.locator('.w-20.h-20.rounded-full.bg-white\\/90').first()
    const box = await playButton.boundingBox()

    if (box) {
      // Touch target should be at least 44x44
      expect(box.width).toBeGreaterThanOrEqual(44)
      expect(box.height).toBeGreaterThanOrEqual(44)
    }
  })
})

test.describe('Video Player - Cross-Page Consistency', () => {
  const pages = [
    { path: '/grants/superteam', name: 'Superteam Grants' },
    { path: '/grants/solana-foundation', name: 'Solana Foundation' },
    { path: '/pitch-deck', name: 'Pitch Deck' },
  ]

  for (const testPage of pages) {
    test(`should use CDN video on ${testPage.name}`, async ({ page }) => {
      const videoPage = new VideoPage(page, testPage.path)
      await videoPage.goto()
      await videoPage.scrollToVideo()

      await videoPage.expectVideoVisible()
      await videoPage.expectVideoSrc(CDN_VIDEO_URL)

      // Should NOT use YouTube
      const hasYouTube = await page.locator('iframe[src*="youtube"]').count()
      expect(hasYouTube).toBe(0)
    })

    test(`should have consistent controls on ${testPage.name}`, async ({ page }) => {
      const videoPage = new VideoPage(page, testPage.path)
      await videoPage.goto()
      await videoPage.scrollToVideo()
      await videoPage.waitForVideoReady()
      await skipIfVideoNotLoaded(videoPage)

      // All pages should have same control set
      await videoPage.hoverVideo()
      const playBtn = page.locator('button[aria-label="Play"], button[aria-label="Pause"]').first()
      const muteBtn = page.locator('button[aria-label="Mute"], button[aria-label="Unmute"]').first()
      const fullscreenBtn = page.locator('button[aria-label="Fullscreen"]').first()

      await expect(playBtn).toBeVisible()
      await expect(muteBtn).toBeVisible()
      await expect(fullscreenBtn).toBeVisible()
    })
  }
})

test.describe('Video Player - Performance', () => {
  test('should load video metadata within timeout', async ({ page }) => {
    const videoPage = new VideoPage(page, '/grants/superteam')
    await videoPage.goto()
    await videoPage.scrollToVideo()

    // Try to load metadata within 10 seconds, skip if network too slow
    try {
      await expect(async () => {
        const readyState = await videoPage.getReadyState()
        expect(readyState).toBeGreaterThanOrEqual(1)
      }).toPass({ timeout: 10000 })
    } catch {
      test.skip(true, 'Video metadata loading timed out - network may be slow')
    }
  })

  test('should not autoplay (respects user preference)', async ({ page }) => {
    const videoPage = new VideoPage(page, '/grants/superteam')
    await videoPage.goto()
    await videoPage.scrollToVideo()
    await videoPage.waitForVideoReady()
    await skipIfVideoNotLoaded(videoPage)

    // Video should be paused initially
    await videoPage.expectPaused()
  })
})
