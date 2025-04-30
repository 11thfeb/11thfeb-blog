export async function fetchWithRetry<T>(
  fetcher: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> {
  try {
    return await fetcher()
  } catch (err: any) {
    if (retries > 0 && err?.response?.status === 429) {
      console.warn(`429 received, retrying in ${delay}ms...`)
      await new Promise((res) => setTimeout(res, delay))
      return fetchWithRetry(fetcher, retries - 1, delay * 2)
    }
    throw err
  }
}