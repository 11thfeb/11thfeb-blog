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
export const getPosts = async () => {
  console.log('[getPosts] Starting...')
  let id = CONFIG.notionConfig.pageId as string
  console.log('[getPosts] PageId:', id)
  const api = new NotionAPI()

  try {
    const response = await api.getPage(id)
    console.log('[getPosts] Got response, processing...')
    id = idToUuid(id)
    const collectionData = Object.values(response.collection)[0] as any
    console.log('[getPosts] collectionData structure:', Object.keys(collectionData || {}))
    const collection = collectionData?.value?.value || collectionData?.value
    console.log('[getPosts] collection keys:', Object.keys(collection || {}))
    const block = response.block
    const schema = collection?.schema
    console.log('[getPosts] schema exists:', !!schema, 'keys:', Object.keys(schema || {}).length)

    const rawMetadata = (block[id] as any)?.value?.value || (block[id] as any)?.value

    console.log('[getPosts] rawMetadata type:', rawMetadata?.type)

    // Check Type
    if (
      rawMetadata?.type !== "collection_view_page" &&
      rawMetadata?.type !== "collection_view"
    ) {
      console.log('[getPosts] Invalid type, returning empty array')
      return []
    } else {
      // Construct Data
      const pageIds = getAllPageIds(response)
      console.log('[getPosts] Found pageIds:', pageIds.length)
      const data = []
      for (let i = 0; i < pageIds.length; i++) {
        const id = pageIds[i]
        const properties = (await getPageProperties(id, block, schema)) || null
        if (i === 0) {
          console.log('[getPosts] First post properties:', JSON.stringify(properties, null, 2))
        }
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
      console.log('[getPosts] Success! Found', posts.length, 'posts')
      if (posts.length > 0) {
        console.log('[getPosts] Sample post:', JSON.stringify(posts[0], null, 2))
      }
      return posts
    }
  } catch (error) {
    console.error('[getPosts] Error:', error)
    throw error
  }
}
