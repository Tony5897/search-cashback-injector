export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export interface Logger {
  debug(message: string, data?: unknown): void
  info(message: string, data?: unknown): void
  warn(message: string, data?: unknown): void
  error(message: string, data?: unknown): void
}

/**
 * Creates a namespaced logger that prefixes every message with
 * `[cashback:<namespace>]`. Uses the corresponding `console.*` method
 * for each level so DevTools can filter by severity.
 *
 * Pure function — no chrome.* calls, no module-level state.
 * Safe to use in content scripts, service workers, and vitest node.
 */
export function createLogger(namespace: string): Logger {
  const prefix = `[cashback:${namespace}]`

  return {
    debug(message: string, data?: unknown): void {
      if (data !== undefined) {
        console.debug(prefix, message, data)
      } else {
        console.debug(prefix, message)
      }
    },

    info(message: string, data?: unknown): void {
      if (data !== undefined) {
        console.info(prefix, message, data)
      } else {
        console.info(prefix, message)
      }
    },

    warn(message: string, data?: unknown): void {
      if (data !== undefined) {
        console.warn(prefix, message, data)
      } else {
        console.warn(prefix, message)
      }
    },

    error(message: string, data?: unknown): void {
      if (data !== undefined) {
        console.error(prefix, message, data)
      } else {
        console.error(prefix, message)
      }
    },
  }
}
