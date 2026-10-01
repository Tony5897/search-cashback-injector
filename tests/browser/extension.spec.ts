import { chromium, expect, test } from '@playwright/test'
import { resolve } from 'node:path'

test('built extension resolves synthetic offers, avoids duplicates, and handles missing offers', async () => {
  const extensionPath = resolve('dist')
  const context = await chromium.launchPersistentContext('', {
    channel: 'chromium',
    headless: true,
    args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`],
  })
  try {
    await context.route('**/*', async route => {
      if (route.request().url().startsWith('https://www.google.com/search')) {
        await route.fulfill({ contentType: 'text/html', body: '<main id="search"><div id="rso"><div class="tF2Cxc" id="merchant"><a href="https://www.nike.com/shoes">Shoes</a></div><div class="tF2Cxc" id="unknown"><a href="https://example.com/">Unknown</a></div></div></main>' })
      } else if (route.request().url().startsWith('chrome-extension://')) await route.continue()
      else await route.abort()
    })
    const worker = context.serviceWorkers()[0] ?? await context.waitForEvent('serviceworker')
    const page = await context.newPage()
    await page.goto('https://www.google.com/search?q=shoes')
    await expect(page.locator('#merchant')).toHaveAttribute('data-perkpop-injected', 'injected')
    await expect(page.locator('#merchant > div')).toHaveCount(1)
    await expect.poll(() => worker.evaluate(async () => {
      const value = await chrome.storage.local.get('offer:nike.com')
      return JSON.stringify(value)
    })).toContain('registry')
    // Exercise repeated DOM mutations after the asynchronous worker response.
    await page.evaluate(() => {
      const results = document.getElementById('rso')
      if (!results) throw new Error('Missing search fixture')
      for (let i = 0; i < 10; i++) results.append(document.createElement('span'))
      const result = document.createElement('div')
      result.className = 'tF2Cxc'
      result.id = 'later'
      result.innerHTML = '<a href="https://www.target.com/">Later result</a>'
      results.append(result)
    })
    await expect(page.locator('#later')).toHaveAttribute('data-perkpop-injected', 'injected')
    await expect(page.locator('#merchant > div')).toHaveCount(1)
    await expect(page.locator('#unknown > div')).toHaveCount(0)
    // The complete message path fails closed for an unsupported merchant.
    const extensionPage = await context.newPage()
    const id = new URL(worker.url()).host
    await extensionPage.goto(`chrome-extension://${id}/manifest.json`)
    const response = await extensionPage.evaluate(() => chrome.runtime.sendMessage({ type: 'RESOLVE_OFFER', payload: { domain: 'example.com' } }))
    expect(response).toEqual({ offer: null })
  } finally {
    await context.close()
  }
})
