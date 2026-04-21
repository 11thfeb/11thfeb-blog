import { CONFIG } from "site.config"
import { NotionAPI } from "notion-client"
import { idToUuid } from "notion-utils"

import getAllPageIds from "src/libs/utils/notion/getAllPageIds"
import getPageProperties from "src/libs/utils/notion/getPageProperties"
import { TPosts } from "src/types"

/**
 * @param {{ includePages: boolean }} - false: posts only / true: include pages
 */

// TODO: react query를 사용해서 처음 불러온 뒤로는 해당데이터만 사용하도록 수정
let postsCache: TPosts | null = null

export const getPosts = async () => {
  if (postsCache) return postsCache
  let id = CONFIG.notionConfig.pageId as string
  const api = new NotionAPI()

  const gotOptions = {
    retry: { limit: 5, statusCodes: [429, 502, 503], methods: ["POST" as const, "GET" as const] },
    timeout: { request: 30000 },
  }

  const response = await api.getPage(id, { concurrency: 1, gotOptions })
  id = idToUuid(id)
  const collectionData = Object.values(response.collection)[0] as any
  const collection = collectionData?.value?.value || collectionData?.value
  const block = response.block
  const schema = collection?.schema

  const rawMetadata = (block[id] as any)?.value?.value || (block[id] as any)?.value

  // Check Type
  if (
    rawMetadata?.type !== "collection_view_page" &&
    rawMetadata?.type !== "collection_view"
  ) {
    return []
  } else {
    // Fetch collection data explicitly
    const collectionId = collection?.id
    const collectionViewId = Object.keys(response.collection_view || {})[0]
    let collectionData = null
    if (collectionId && collectionViewId) {
      const cvRaw = (response.collection_view as any)[collectionViewId]
      const cv = cvRaw?.value?.value || cvRaw?.value
      collectionData = await api.getCollectionData(collectionId, collectionViewId, cv, { gotOptions })
      // Merge blocks from collectionData into response
      if (collectionData?.recordMap?.block) {
        Object.assign(response.block, collectionData.recordMap.block)
      }
    }

    // Construct Data
    const pageIds = getAllPageIds(response, collectionData)
    const data = []
    for (let i = 0; i < pageIds.length; i++) {
      const id = pageIds[i]
      const properties = (await getPageProperties(id, block, schema)) || null
      // Add fullwidth, createdtime to properties
      const blockValue = (block[id] as any)?.value?.value || (block[id] as any)?.value
      const createdTimeRaw = blockValue?.created_time
      properties.createdTime = createdTimeRaw
        ? new Date(createdTimeRaw).toString()
        : new Date().toString()
      properties.fullWidth =
        (blockValue?.format as any)?.page_full_width ?? false

      data.push(properties)
    }

    // Sort by date
    data.sort((a: any, b: any) => {
      const dateA: any = new Date(a?.date?.start_date || a.createdTime)
      const dateB: any = new Date(b?.date?.start_date || b.createdTime)
      return dateB - dateA
    })

    const posts = data as TPosts
    postsCache = posts
    return posts
  }
}
