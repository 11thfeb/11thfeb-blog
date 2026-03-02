import { NotionAPI } from "notion-client"

export const getRecordMap = async (pageId: string) => {
  console.log('[getRecordMap] Fetching pageId:', pageId)
  const api = new NotionAPI()
  try {
    const recordMap = await api.getPage(pageId)
    console.log('[getRecordMap] Success for pageId:', pageId)
    return recordMap
  } catch (error) {
    console.error('[getRecordMap] Error:', error)
    throw error
  }
}
