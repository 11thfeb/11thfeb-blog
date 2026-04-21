import { idToUuid } from "notion-utils"
import { ExtendedRecordMap, ID } from "notion-types"

export default function getAllPageIds(
  response: ExtendedRecordMap,
  collectionData?: any,
  viewId?: string
) {
  // Use pre-fetched collection data if available
  if (collectionData?.result?.reducerResults?.collection_group_results?.blockIds) {
    return collectionData.result.reducerResults.collection_group_results.blockIds as ID[]
  }

  const collectionQuery = response.collection_query
  if (!collectionQuery || Object.keys(collectionQuery).length === 0) {
    return []
  }
  const views = Object.values(collectionQuery)[0]

  let pageIds: ID[] = []
  if (viewId) {
    const vId = idToUuid(viewId)
    pageIds = views?.[vId]?.blockIds || []
  } else {
    const pageSet = new Set<ID>()
    Object.values(views || {}).forEach((view: any) => {
      view?.collection_group_results?.blockIds?.forEach((id: ID) =>
        pageSet.add(id)
      )
      view?.blockIds?.forEach((id: ID) => pageSet.add(id))
    })
    pageIds = [...pageSet]
  }
  return pageIds
}
