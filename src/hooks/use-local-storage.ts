import { useCallback, useSyncExternalStore } from 'react'
import { ZodSchema } from 'zod'

export const useLocalStorage = <T>(
  key: string,
  schema: ZodSchema<T>,
  initialValue: T | (() => T),
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

    return initialValue instanceof Function ? initialValue() : initialValue
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
    (newValue: T | ((previousValue?: T) => T)) => {
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

  return [value, setValue, removeValue] as const
}
