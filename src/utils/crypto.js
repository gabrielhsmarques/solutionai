import CryptoJS from 'crypto-js'

// Secret key used to encrypt/decrypt data before storing in localStorage.
// In a real production app, this should never be hardcoded — it would
// come from a secure environment variable or a backend-issued token.
// For this educational project, a fixed key is enough to demonstrate the concept.
const SECRET_KEY = 'financial-educator-2026-dio-project'

// Encrypts any JS value (object, array, string) into a string
// safe to store in localStorage
export function encryptData(value) {
  const jsonString = JSON.stringify(value)
  return CryptoJS.AES.encrypt(jsonString, SECRET_KEY).toString()
}

// Decrypts a string back into its original JS value.
// Returns the fallback value if decryption fails
// (e.g. corrupted data or first-time use with no data yet)
export function decryptData(encryptedString, fallback) {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedString, SECRET_KEY)
    const jsonString = bytes.toString(CryptoJS.enc.Utf8)
    return jsonString ? JSON.parse(jsonString) : fallback
  } catch (error) {
    console.error('Failed to decrypt data:', error)
    return fallback
  }
}