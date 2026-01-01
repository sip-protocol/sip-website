import { type Page, type Locator, expect } from '@playwright/test'

/**
 * Page Object Model for Video Player component
 * Tests self-hosted CDN video on grants/pitch pages
 */
export class VideoPage {
  readonly page: Page
  readonly baseUrl: string

  // Video container
  readonly videoContainer: Locator
  readonly video: Locator
  readonly glowEffect: Locator

  // Video controls
  readonly controls: {
    container: Locator
    playButton: Locator
    pauseButton: Locator
    muteButton: Locator
    unmuteButton: Locator
    fullscreenButton: Locator
  }

  // Play overlay (shown when video is paused)
  readonly playOverlay: Locator

  // Caption
  readonly caption: Locator

  constructor(page: Page, path: string = '/grants/superteam') {
    this.page = page
    this.baseUrl = path

    // Video container with glow effect
    this.videoContainer = page.locator('.relative.w-full.max-w-3xl').first()
    this.glowEffect = page.locator('.blur-xl.opacity-50').first()

    // Video element
    this.video = page.locator('video').first()

    // Play overlay (big play button when paused)
    this.playOverlay = page.locator('.absolute.inset-0.flex.items-center.justify-center.bg-black\\/30').first()

    // Custom controls bar
    this.controls = {
      container: page.locator('.absolute.bottom-0.left-0.right-0.p-4').first(),
      playButton: page.locator('button[aria-label="Play"]').first(),
      pauseButton: page.locator('button[aria-label="Pause"]').first(),
      muteButton: page.locator('button[aria-label="Mute"]').first(),
      unmuteButton: page.locator('button[aria-label="Unmute"]').first(),
      fullscreenButton: page.locator('button[aria-label="Fullscreen"]').first(),
    }

    // Caption text
    this.caption = page.locator('.text-gray-400.text-sm.italic').first()
  }

  async goto() {
    await this.page.goto(this.baseUrl)
    await this.page.waitForLoadState('load')
    // Scroll video into view
    await this.video.scrollIntoViewIfNeeded()
    await this.page.waitForTimeout(500)
  }

  async scrollToVideo() {
    await this.video.scrollIntoViewIfNeeded()
    await this.page.waitForTimeout(300)
  }

  // Playback controls
  async play() {
    // Try overlay first, then control button
    if (await this.playOverlay.isVisible()) {
      await this.playOverlay.click()
    } else if (await this.controls.playButton.isVisible()) {
      await this.controls.playButton.click()
    } else {
      // Click directly on video
      await this.video.click()
    }
    await this.page.waitForTimeout(300)
  }

  async pause() {
    if (await this.controls.pauseButton.isVisible()) {
      await this.controls.pauseButton.click()
    } else {
      await this.video.click()
    }
    await this.page.waitForTimeout(300)
  }

  async toggleMute() {
    if (await this.controls.muteButton.isVisible()) {
      await this.controls.muteButton.click()
    } else if (await this.controls.unmuteButton.isVisible()) {
      await this.controls.unmuteButton.click()
    }
    await this.page.waitForTimeout(100)
  }

  async enterFullscreen() {
    await this.controls.fullscreenButton.click()
    await this.page.waitForTimeout(500)
  }

  async exitFullscreen() {
    await this.page.keyboard.press('Escape')
    await this.page.waitForTimeout(300)
  }

  // State getters
  async isPlaying(): Promise<boolean> {
    return await this.video.evaluate((v: HTMLVideoElement) => !v.paused)
  }

  async isPaused(): Promise<boolean> {
    return await this.video.evaluate((v: HTMLVideoElement) => v.paused)
  }

  async isMuted(): Promise<boolean> {
    return await this.video.evaluate((v: HTMLVideoElement) => v.muted)
  }

  async getCurrentTime(): Promise<number> {
    return await this.video.evaluate((v: HTMLVideoElement) => v.currentTime)
  }

  async getDuration(): Promise<number> {
    return await this.video.evaluate((v: HTMLVideoElement) => v.duration)
  }

  async getVideoSrc(): Promise<string> {
    return await this.video.getAttribute('src') || ''
  }

  async getReadyState(): Promise<number> {
    return await this.video.evaluate((v: HTMLVideoElement) => v.readyState)
  }

  // Hover to show controls
  async hoverVideo() {
    await this.videoContainer.hover()
    await this.page.waitForTimeout(200)
  }

  async unhoverVideo() {
    // Move mouse away from video
    await this.page.mouse.move(0, 0)
    await this.page.waitForTimeout(200)
  }

  // Assertions
  async expectVideoVisible() {
    await expect(this.video).toBeVisible()
  }

  async expectVideoLoaded() {
    // readyState >= 2 means enough data to play
    const readyState = await this.getReadyState()
    expect(readyState).toBeGreaterThanOrEqual(2)
  }

  async expectVideoSrc(expectedUrl: string | RegExp) {
    const src = await this.getVideoSrc()
    if (typeof expectedUrl === 'string') {
      expect(src).toContain(expectedUrl)
    } else {
      expect(src).toMatch(expectedUrl)
    }
  }

  async expectPlaying() {
    const playing = await this.isPlaying()
    expect(playing).toBe(true)
  }

  async expectPaused() {
    const paused = await this.isPaused()
    expect(paused).toBe(true)
  }

  async expectMuted() {
    const muted = await this.isMuted()
    expect(muted).toBe(true)
  }

  async expectUnmuted() {
    const muted = await this.isMuted()
    expect(muted).toBe(false)
  }

  async expectControlsVisible() {
    await expect(this.controls.container).toBeVisible()
  }

  async expectPlayOverlayVisible() {
    await expect(this.playOverlay).toBeVisible()
  }

  async expectPlayOverlayHidden() {
    await expect(this.playOverlay).toBeHidden()
  }

  async expectCaptionText(text: string | RegExp) {
    await expect(this.caption).toContainText(text)
  }

  async expectGlowEffect() {
    await expect(this.glowEffect).toBeVisible()
  }

  // Wait for video to be ready (with very short timeout for test env)
  async waitForVideoReady(timeout = 3000) {
    try {
      await this.video.waitFor({ state: 'visible', timeout: 3000 })
    } catch {
      // Video element not visible yet
      return
    }

    // Quick check - don't wait long for CDN
    const startTime = Date.now()
    while (Date.now() - startTime < timeout) {
      try {
        const readyState = await this.video.evaluate((v: HTMLVideoElement) => v.readyState)
        if (readyState >= 1) return
      } catch {
        // Video not ready
      }
      await this.page.waitForTimeout(200)
    }
  }

  // Check if video has loaded (non-blocking)
  async isVideoLoaded(): Promise<boolean> {
    try {
      const readyState = await this.getReadyState()
      return readyState >= 1
    } catch {
      return false
    }
  }
}
