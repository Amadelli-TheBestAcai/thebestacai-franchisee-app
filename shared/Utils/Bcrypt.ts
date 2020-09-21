import bcrypt from 'bcrypt'

export const hash = async (value: string): Promise<string> => {
  const hashValue = await bcrypt.hash(value, 12)
  return hashValue
}

export const compare = async (
  value: string,
  hash: string
): Promise<boolean> => {
  const isValid = await bcrypt.compare(value, hash)
  return isValid
}
