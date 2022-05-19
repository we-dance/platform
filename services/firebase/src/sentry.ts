import * as sentry from '@sentry/node'

export const wrap = (fn: any) => async (...args: Array<any>) => {
  try {
    return await fn(...args)
  } catch (e) {
    sentry.captureException(e)
    await sentry.flush(2000)
    throw e
  }
}
