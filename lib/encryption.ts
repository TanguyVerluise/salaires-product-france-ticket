import CryptoJS from 'crypto-js';

/**
 * Système de chiffrement AES-256 pour protéger les données sensibles
 * Les données sont chiffrées de manière à être inaccessibles même pour les développeurs
 */

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || '';

if (!ENCRYPTION_KEY && process.env.NODE_ENV === 'production') {
  throw new Error('ENCRYPTION_KEY must be set in production');
}

/**
 * Chiffre une valeur avec AES-256
 */
export function encrypt(value: string): string {
  if (!ENCRYPTION_KEY) {
    // En développement, on utilise une clé par défaut (à ne JAMAIS utiliser en prod)
    console.warn('⚠️  Using default encryption key - DO NOT USE IN PRODUCTION');
    const devKey = 'dev-key-only-for-local-development-change-in-prod';
    return CryptoJS.AES.encrypt(value, devKey).toString();
  }
  return CryptoJS.AES.encrypt(value, ENCRYPTION_KEY).toString();
}

/**
 * Déchiffre une valeur chiffrée avec AES-256
 */
export function decrypt(encryptedValue: string): string {
  if (!ENCRYPTION_KEY) {
    const devKey = 'dev-key-only-for-local-development-change-in-prod';
    const bytes = CryptoJS.AES.decrypt(encryptedValue, devKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
  const bytes = CryptoJS.AES.decrypt(encryptedValue, ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}

/**
 * Hash une valeur pour l'indexation (permet la recherche sans déchiffrement)
 */
export function hash(value: string): string {
  return CryptoJS.SHA256(value).toString();
}
