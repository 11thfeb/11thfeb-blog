import { NotionAPI } from "notion-client"

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export const getRecordMap = async (pageId: string) => {
  const api = new NotionAPI()
  for (let attempt = 0; attempt < 8; attempt++) {
    try {
      return await api.getPage(pageId)
    } catch (err: any) {
      const status = err?.response?.statusCode ?? err?.code
      if ((status === 429 || status === 502 || status === 503) && attempt < 7) {
        await sleep(5000 * Math.pow(2, attempt)) // 5s, 10s, 20s, 40s...
        continue
      }
      throw err
    }
  }
}
