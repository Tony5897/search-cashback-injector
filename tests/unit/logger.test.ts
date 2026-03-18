import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createLogger } from '@/lib/logger'

describe('createLogger', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('returns an object with all four log-level methods', () => {
    const log = createLogger('test')
    expect(typeof log.debug).toBe('function')
    expect(typeof log.info).toBe('function')
    expect(typeof log.warn).toBe('function')
    expect(typeof log.error).toBe('function')
  })

  it('debug calls console.debug with [cashback:<namespace>] prefix', () => {
    const spy = vi.spyOn(console, 'debug').mockImplementation(() => { /* noop */ })
    createLogger('content').debug('hello')
    expect(spy).toHaveBeenCalledWith('[cashback:content]', 'hello')
  })

  it('info calls console.info with [cashback:<namespace>] prefix', () => {
    const spy = vi.spyOn(console, 'info').mockImplementation(() => { /* noop */ })
    createLogger('content').info('hello')
    expect(spy).toHaveBeenCalledWith('[cashback:content]', 'hello')
  })

  it('warn calls console.warn with [cashback:<namespace>] prefix', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => { /* noop */ })
    createLogger('content').warn('hello')
    expect(spy).toHaveBeenCalledWith('[cashback:content]', 'hello')
  })

  it('error calls console.error with [cashback:<namespace>] prefix', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => { /* noop */ })
    createLogger('content').error('hello')
    expect(spy).toHaveBeenCalledWith('[cashback:content]', 'hello')
  })

  it('passes data as the third argument when provided', () => {
    const spy = vi.spyOn(console, 'info').mockImplementation(() => { /* noop */ })
    const data = { domain: 'amazon.com', rate: '3%' }
    createLogger('bg').info('merchant detected', data)
    expect(spy).toHaveBeenCalledWith('[cashback:bg]', 'merchant detected', data)
  })

  it('does not pass a third argument when data is omitted', () => {
    const spy = vi.spyOn(console, 'info').mockImplementation(() => { /* noop */ })
    createLogger('bg').info('just a message')
    expect(spy).toHaveBeenCalledOnce()
    // Verify exactly 2 args were passed — not 3 (no trailing undefined)
    expect(spy.mock.calls[0]).toHaveLength(2)
  })

  it('two loggers with different namespaces produce different prefixes', () => {
    const spy = vi.spyOn(console, 'debug').mockImplementation(() => { /* noop */ })
    createLogger('content').debug('from content')
    createLogger('background').debug('from background')
    expect(spy.mock.calls[0]?.[0]).toBe('[cashback:content]')
    expect(spy.mock.calls[1]?.[0]).toBe('[cashback:background]')
  })

  it('preserves namespace verbatim, including special characters', () => {
    const spy = vi.spyOn(console, 'debug').mockImplementation(() => { /* noop */ })
    createLogger('bg:cache').debug('test')
    expect(spy).toHaveBeenCalledWith('[cashback:bg:cache]', 'test')
  })
})
