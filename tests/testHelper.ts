import fs from 'fs'

export const checkIfFileExists = (path: string): boolean => {
  try {
    fs.accessSync(path)
    return true
  } catch (e) {
    return false
  }
}