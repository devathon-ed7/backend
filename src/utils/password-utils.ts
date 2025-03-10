import CryptoJS from "crypto-js"

export const hashPassword = async (password: string): Promise<string> => {
  const salt = CryptoJS.lib.WordArray.random(16).toString()
  const hashedPassword = CryptoJS.PBKDF2(password, salt, {
    keySize: 256 / 32,
    iterations: 13000
  }).toString()

  return `${salt}:${hashedPassword}`
}

export const verifyPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  const [salt, hash] = hashedPassword.split(":")
  const hashedGuess = CryptoJS.PBKDF2(password, salt, {
    keySize: 256 / 32,
    iterations: 13000
  }).toString()
  return hash === hashedGuess
}
