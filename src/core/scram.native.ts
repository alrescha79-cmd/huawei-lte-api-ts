/**
 * SCRAM (Salted Challenge Response Authentication Mechanism) implementation
 * React Native version using @noble/hashes (pure JavaScript, no native modules)
 * 
 * Based on RFC 5802 and Huawei's implementation
 */

import { sha256 } from '@noble/hashes/sha2';
import { hmac } from '@noble/hashes/hmac';
import { pbkdf2 } from '@noble/hashes/pbkdf2';

/**
 * Generate random nonce (client first nonce)
 * Uses crypto.getRandomValues which is available in React Native
 */
export function generateNonce(length: number = 32): string {
    const bytes = new Uint8Array(length);

    // Use crypto.getRandomValues if available (React Native, browsers)
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
        crypto.getRandomValues(bytes);
    } else {
        // Fallback: use Math.random (not cryptographically secure, but works)
        for (let i = 0; i < length; i++) {
            bytes[i] = Math.floor(Math.random() * 256);
        }
    }

    return Buffer.from(bytes).toString('hex');
}

/**
 * HMAC-SHA256 using @noble/hashes
 */
function hmacSha256(key: Uint8Array, data: string | Uint8Array): Uint8Array {
    const dataBytes = typeof data === 'string' ? new TextEncoder().encode(data) : data;
    return hmac(sha256, key, dataBytes);
}

/**
 * SHA256 hash using @noble/hashes
 */
function sha256Hash(data: string | Uint8Array): Uint8Array {
    const dataBytes = typeof data === 'string' ? new TextEncoder().encode(data) : data;
    return sha256(dataBytes);
}

/**
 * PBKDF2 with HMAC-SHA256 using @noble/hashes
 */
function pbkdf2Sha256(password: string, salt: Uint8Array, iterations: number, keylen: number): Uint8Array {
    const passwordBytes = new TextEncoder().encode(password);
    return pbkdf2(sha256, passwordBytes, salt, { c: iterations, dkLen: keylen });
}

/**
 * XOR two Uint8Arrays
 */
function xorBuffers(a: Uint8Array, b: Uint8Array): Uint8Array {
    const length = Math.min(a.length, b.length);
    const result = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
        result[i] = a[i] ^ b[i];
    }
    return result;
}

/**
 * Convert hex string to Uint8Array
 */
function hexToBytes(hex: string): Uint8Array {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
        bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
    }
    return bytes;
}

/**
 * Convert Uint8Array to hex string
 */
function bytesToHex(bytes: Uint8Array): string {
    return Array.from(bytes)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

/**
 * Calculate SCRAM client proof
 * 
 * @param _username - Username (reserved for future use, not currently used in calculation)
 * @param password - Password (plain text)
 * @param clientNonce - Client's random nonce (firstnonce)
 * @param serverNonce - Server's nonce from challenge response
 * @param salt - Salt from server (hex string)
 * @param iterations - PBKDF2 iterations from server
 * @returns Client proof (hex string)
 */
export function calculateScramProof(
    _username: string,
    password: string,
    clientNonce: string,
    serverNonce: string,
    salt: string,
    iterations: number
): string {
    // 1. SaltedPassword = Hi(Normalize(password), salt, iterations)
    const saltBuffer = hexToBytes(salt);
    const saltedPassword = pbkdf2Sha256(password, saltBuffer, iterations, 32);

    // 2. ClientKey = HMAC(SaltedPassword, "Client Key")
    const clientKey = hmacSha256(saltedPassword, 'Client Key');

    // 3. StoredKey = H(ClientKey)
    const storedKey = sha256Hash(clientKey);

    // 4. AuthMessage = clientNonce + "," + serverNonce + "," + serverNonce
    //    (Huawei uses serverNonce twice in AuthMessage)
    const authMessage = `${clientNonce},${serverNonce},${serverNonce}`;

    // 5. ClientSignature = HMAC(StoredKey, AuthMessage)
    const clientSignature = hmacSha256(storedKey, authMessage);

    // 6. ClientProof = ClientKey XOR ClientSignature
    const clientProof = xorBuffers(clientKey, clientSignature);

    return bytesToHex(clientProof);
}

/**
 * Verify server signature (optional, for mutual authentication)
 * 
 * @param password - Password (plain text)
 * @param clientNonce - Client's nonce
 * @param serverNonce - Server's nonce
 * @param salt - Salt from server
 * @param iterations - PBKDF2 iterations
 * @param serverSignature - Server signature to verify
 * @returns true if server signature is valid
 */
export function verifyServerSignature(
    password: string,
    clientNonce: string,
    serverNonce: string,
    salt: string,
    iterations: number,
    serverSignature: string
): boolean {
    // 1. SaltedPassword = Hi(Normalize(password), salt, iterations)
    const saltBuffer = hexToBytes(salt);
    const saltedPassword = pbkdf2Sha256(password, saltBuffer, iterations, 32);

    // 2. ServerKey = HMAC(SaltedPassword, "Server Key")
    const serverKey = hmacSha256(saltedPassword, 'Server Key');

    // 3. AuthMessage
    const authMessage = `${clientNonce},${serverNonce},${serverNonce}`;

    // 4. ServerSignature = HMAC(ServerKey, AuthMessage)
    const calculatedSignature = hmacSha256(serverKey, authMessage);

    // 5. Compare
    return bytesToHex(calculatedSignature) === serverSignature;
}
