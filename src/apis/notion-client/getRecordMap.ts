import { NotionAPI } from "notion-client"

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

function normalizeRecordMap(recordMap: any) {
  if (!recordMap) return recordMap
  for (const section of ['block', 'collection', 'collection_view']) {
    for (const key of Object.keys(recordMap[section] || {})) {
      const entry = recordMap[section][key]
      if (entry?.value?.value) {
        entry.value = entry.value.value
      }
    }
  }
  return recordMap
}

async function fetchMissingBlocks(api: NotionAPI, recordMap: any) {
  const pageBlock = recordMap.block[Object.keys(recordMap.block)[0]]?.value
  const contentIds: string[] = pageBlock?.content || []
  const missingIds = contentIds.filter((id: string) => !recordMap.block[id])
  if (!missingIds.length) return

  // Fetch in batches of 50
  for (let i = 0; i < missingIds.length; i += 50) {
    const batch = missingIds.slice(i, i + 50)
    try {
      const res = await api.getBlocks(batch)
      const blocks = res?.recordMap?.block || {}
      for (const [id, block] of Object.entries(blocks) as any) {
        if (block?.value?.value) block.value = block.value.value
        recordMap.block[id] = block
      }
    } catch {}
  }
}

export const getRecordMap = async (pageId: string) => {
  const api = new NotionAPI()
  for (let attempt = 0; attempt < 8; attempt++) {
    try {
      const recordMap = await api.getPage(pageId)
      normalizeRecordMap(recordMap)
      await fetchMissingBlocks(api, recordMap)
      return recordMap
    } catch (err: any) {
      const status = err?.response?.statusCode ?? err?.code
      if ((status === 429 || status === 502 || status === 503) && attempt < 7) {
        await sleep(5000 * Math.pow(2, attempt))
        continue
      }
      throw err
    }
  }
}
