import { useCallback, useSyncExternalStore } from 'react'
import { z } from 'zod'

export const useLocalStorage = <TSchema extends z.ZodTypeAny>(
  key: string,
  schema: TSchema,
  initialValue: z.infer<TSchema> | (() => z.infer<TSchema>),
) => {
  const getSnapshot = useCallback(() => {
    const json = localStorage.getItem(key)
    if (json) {
      try {
        const obj = JSON.parse(json)
        return schema.parse(obj)
      } catch (error) {
        console.error('Error parsing JSON: ', error)
      }
    }

    const value =
      initialValue instanceof Function ? initialValue() : initialValue
    localStorage.setItem(key, JSON.stringify(value))
    return value
  }, [key, schema, initialValue])

  const subscribe = useCallback(
    (callback: () => void) => {
      const handleStorageChange = (event: StorageEvent) => {
        if (event.key !== key) {
          return
        }

        callback()
      }
      addEventListener('storage', handleStorageChange)

      return () => removeEventListener('storage', handleStorageChange)
    },
    [key],
  )

  const value = useSyncExternalStore(subscribe, getSnapshot)

  const setValue = useCallback(
    (
      newValue:
        | z.infer<TSchema>
        | ((previousValue: z.infer<TSchema>) => z.infer<TSchema>),
    ) => {
      const valueToStore =
        newValue instanceof Function ? newValue(value) : newValue
      localStorage.setItem(key, JSON.stringify(valueToStore))
      dispatchEvent(
        new StorageEvent('storage', {
          key,
          oldValue: JSON.stringify(value),
          newValue: JSON.stringify(valueToStore),
          storageArea: localStorage,
          url: location.href,
        }),
      )
    },
    [key, value],
  )

  const removeValue = useCallback(
    () => localStorage.removeItem(key),
    [key, initialValue],
  )

  return [value as z.infer<TSchema>, setValue, removeValue] as const
}
