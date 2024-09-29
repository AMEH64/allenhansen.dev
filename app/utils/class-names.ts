type ClassValue = string | undefined | null | false | 0
type ClassValues = ClassValue | ClassValue[]

export const classNames = (...values: ClassValues[]) =>
  values.flat(1).filter(Boolean).join(' ')
