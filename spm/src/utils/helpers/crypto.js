import CryptoJS from 'crypto-js';
import { ref, push } from 'firebase/database';
import { realtimeDb } from './firebase'; // Adjust the import based on your project structure

export function encrypt(text, masterKey) {
  return CryptoJS.AES.encrypt(text, masterKey).toString();
}

export function decrypt(ciphertext, masterKey) {
  const bytes = CryptoJS.AES.decrypt(ciphertext, masterKey);
  return bytes.toString(CryptoJS.enc.Utf8);
}

// When updating passwords
export async function logPasswordUpdate(user) {
  const logRef = ref(realtimeDb, `logs/${user.uid}`);
  await push(logRef, {
    action: 'password_update',
    timestamp: Date.now(),
    details: { /* ... */ }
  });
}