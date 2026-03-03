import { getTextContent, getDateValue } from "notion-utils"
import { NotionAPI } from "notion-client"
import { BlockMap, CollectionPropertySchemaMap } from "notion-types"
import { customMapImageUrl } from "./customMapImageUrl"

async function getPageProperties(
  id: string,
  block: BlockMap,
  schema: CollectionPropertySchemaMap
) {
  const api = new NotionAPI()
  const blockValue = (block?.[id] as any)?.value?.value || (block?.[id] as any)?.value
  const rawProperties = Object.entries(blockValue?.properties || [])
  console.log('[getPageProperties] id:', id)
  console.log('[getPageProperties] rawProperties keys:', Object.keys(blockValue?.properties || {}))
  console.log('[getPageProperties] schema keys:', Object.keys(schema || {}))
  const excludeProperties = ["date", "select", "multi_select", "person", "file"]
  const properties: any = { id }
  for (let i = 0; i < rawProperties.length; i++) {
    const [key, val]: any = rawProperties[i]
    if (!schema || !schema[key]) {
      console.log('[getPageProperties] Skipping key:', key, '- not in schema')
      continue
    }
    console.log('[getPageProperties] Processing key:', key, 'name:', schema[key].name, 'type:', schema[key].type)
    if (schema[key]?.type && !excludeProperties.includes(schema[key].type)) {
      properties[schema[key].name] = getTextContent(val)
      console.log('[getPageProperties] Set text:', schema[key].name, '=', properties[schema[key].name])
    } else {
      switch (schema[key]?.type) {
        case "file": {
          try {
            const Block = blockValue
            const url: string = val[0][1][0][1]
            const newurl = customMapImageUrl(url, Block)
            properties[schema[key].name] = newurl
          } catch (error) {
            properties[schema[key].name] = undefined
          }
          break
        }
        case "date": {
          const dateProperty: any = getDateValue(val)
          delete dateProperty.type
          properties[schema[key].name] = dateProperty
          console.log('[getPageProperties] Set date:', schema[key].name, '=', dateProperty)
          break
        }
        case "select": {
          const selects = getTextContent(val)
          if (selects[0]?.length) {
            properties[schema[key].name] = selects.split(",")
          }
          console.log('[getPageProperties] Set select:', schema[key].name, '=', properties[schema[key].name])
          break
        }
        case "multi_select": {
          const selects = getTextContent(val)
          if (selects[0]?.length) {
            properties[schema[key].name] = selects.split(",")
          }
          console.log('[getPageProperties] Set multi_select:', schema[key].name, '=', properties[schema[key].name])
          break
        }
        case "person": {
          const rawUsers = val.flat()

          const users = []
          for (let i = 0; i < rawUsers.length; i++) {
            if (rawUsers[i][0][1]) {
              const userId = rawUsers[i][0]
              const res: any = await api.getUsers(userId)
              const resValue =
                res?.recordMapWithRoles?.notion_user?.[userId[1]]?.value
              const user = {
                id: resValue?.id,
                name:
                  resValue?.name ||
                  `${resValue?.family_name}${resValue?.given_name}` ||
                  undefined,
                profile_photo: resValue?.profile_photo || null,
              }
              users.push(user)
            }
          }
          properties[schema[key].name] = users
          break
        }
        default:
          break
      }
    }
  }
  return properties
}

export { getPageProperties as default }
