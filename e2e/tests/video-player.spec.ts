import { test, expect } from '@playwright/test'
import { VideoPage } from '../pages/video.page'

/**
 * Video Player E2E Tests (Slimmed Down)
 *
 * Critical tests only for CI speed. Covers:
 * - CDN video loads on all pages
 * - Basic playback works
 * - Controls appear
 * - Mobile renders
 * - No autoplay
 *
 * Full test suite available in git history if needed.
 */

const CDN_VIDEO_URL = 'cdn.sip-protocol.org/videos/sip-demo.mp4'

// Helper to skip test if video not loaded (slow network)
async function skipIfVideoNotLoaded(videoPage: VideoPage) {
  const loaded = await videoPage.isVideoLoaded()
  if (!loaded) {
    test.skip(true, 'Video not loaded from CDN - network may be slow')
  }
}

test.describe('Video Player - Critical Tests', () => {
  // ─── CDN Integration (one test per page) ─────────────────────────────────

  test('should load video from CDN on Superteam Grants', async ({ page }) => {
    const videoPage = new VideoPage(page, '/grants/superteam')
    await videoPage.goto()
    await videoPage.scrollToVideo()
    await videoPage.expectVideoVisible()
    await videoPage.expectVideoSrc(CDN_VIDEO_URL)
  })

  test('should load video from CDN on Solana Foundation', async ({ page }) => {
    const videoPage = new VideoPage(page, '/grants/solana-foundation')
    await videoPage.goto()
    await videoPage.scrollToVideo()
    await videoPage.expectVideoVisible()
    await videoPage.expectVideoSrc(CDN_VIDEO_URL)
  })

  test('should load video from CDN on Pitch Deck', async ({ page }) => {
    const videoPage = new VideoPage(page, '/pitch-deck')
    await videoPage.goto()
    await videoPage.scrollToVideo()
    await videoPage.expectVideoVisible()
    await videoPage.expectVideoSrc(CDN_VIDEO_URL)
  })

  // ─── Playback Controls ───────────────────────────────────────────────────

  test('should play video when clicking play overlay', async ({ page }) => {
    const videoPage = new VideoPage(page, '/grants/superteam')
    await videoPage.goto()
    await videoPage.scrollToVideo()
    await videoPage.waitForVideoReady()
    await skipIfVideoNotLoaded(videoPage)

    await videoPage.play()
    await videoPage.expectPlaying()
  })

  test('should pause video when clicking pause button', async ({ page }) => {
    const videoPage = new VideoPage(page, '/grants/superteam')
    await videoPage.goto()
    await videoPage.scrollToVideo()
    await videoPage.waitForVideoReady()
    await skipIfVideoNotLoaded(videoPage)

    await videoPage.play()
    await videoPage.expectPlaying()
    await videoPage.pause()
    await videoPage.expectPaused()
  })

  // ─── Controls Visibility ─────────────────────────────────────────────────

  test('should show controls on hover', async ({ page }) => {
    const videoPage = new VideoPage(page, '/grants/superteam')
    await videoPage.goto()
    await videoPage.scrollToVideo()
    await videoPage.waitForVideoReady()
    await skipIfVideoNotLoaded(videoPage)

    await videoPage.play()
    await videoPage.hoverVideo()
    await videoPage.expectControlsVisible()
  })

  // ─── Mobile Responsiveness ───────────────────────────────────────────────

  test('should be visible on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }) // iPhone SE
    const videoPage = new VideoPage(page, '/grants/superteam')
    await videoPage.goto()
    await videoPage.scrollToVideo()
    await videoPage.expectVideoVisible()
  })

  // ─── Performance / UX ────────────────────────────────────────────────────

  test('should not autoplay (respects user preference)', async ({ page }) => {
    const videoPage = new VideoPage(page, '/grants/superteam')
    await videoPage.goto()
    await videoPage.scrollToVideo()
    await videoPage.waitForVideoReady()
    await skipIfVideoNotLoaded(videoPage)

    await videoPage.expectPaused()
  })
})
