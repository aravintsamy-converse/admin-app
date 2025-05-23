import { Item } from '@/Types/components/client/types'

export const toLowerCaseDeep = (obj: any): any => {
  if (obj instanceof Date) {
    return `${obj.getFullYear()}-${String(obj.getMonth() + 1).padStart(2, '0')}-${String(obj.getDate()).padStart(2, '0')}`
  }
  if (Array.isArray(obj)) {
    return obj.map(toLowerCaseDeep)
  } else if (typeof obj === 'object' && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, toLowerCaseDeep(value)])
    )
  } else if (typeof obj === 'string') {
    return obj.toLowerCase().trim()
  }
  return obj
}

export const camelToSnake = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(camelToSnake)
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc: any, key) => {
      const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase()
      acc[snakeKey] = camelToSnake(obj[key])
      return acc
    }, {})
  }
  return obj
}

export const modifyArrayValues = (array: Item[]): Item[] => {
  return array.map(({ id, name }) => ({
    id,
    name: name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(),
  }))
}

export const snakeToCamel = (str: string): string =>
  str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
