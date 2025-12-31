/**
 * SCRAM (Salted Challenge Response Authentication Mechanism) implementation
 * Used by newer Huawei modems for secure authentication
 * 
 * Based on RFC 5802 and Huawei's implementation
 */

import * as crypto from 'crypto';

/**
 * Generate random nonce (client first nonce)
 */
export function generateNonce(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * HMAC-SHA256
 */
function hmacSha256(key: Buffer, data: string | Buffer): Buffer {
  const hmac = crypto.createHmac('sha256', key);
  hmac.update(data);
  return hmac.digest();
}

/**
 * SHA256 hash
 */
function sha256(data: string | Buffer): Buffer {
  const hash = crypto.createHash('sha256');
  hash.update(data);
  return hash.digest();
}

/**
 * PBKDF2 with HMAC-SHA256
 */
function pbkdf2(password: string, salt: Buffer, iterations: number, keylen: number): Buffer {
  return crypto.pbkdf2Sync(password, salt, iterations, keylen, 'sha256');
}

/**
 * XOR two buffers
 */
function xorBuffers(a: Buffer, b: Buffer): Buffer {
  const length = Math.min(a.length, b.length);
  const result = Buffer.alloc(length);
  for (let i = 0; i < length; i++) {
    result[i] = a[i] ^ b[i];
  }
  return result;
}

/**
 * Calculate SCRAM client proof
 * 
 * @param username - Username
 * @param password - Password (plain text)
 * @param clientNonce - Client's random nonce (firstnonce)
 * @param username - Username (reserved for future use, not currently used in calculation)
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
  const saltBuffer = Buffer.from(salt, 'hex');
  const saltedPassword = pbkdf2(password, saltBuffer, iterations, 32);

  // 2. ClientKey = HMAC(SaltedPassword, "Client Key")
  const clientKey = hmacSha256(saltedPassword, 'Client Key');

  // 3. StoredKey = H(ClientKey)
  const storedKey = sha256(clientKey);

  // 4. AuthMessage = clientNonce + "," + serverNonce + "," + serverNonce
  //    (Huawei uses serverNonce twice in AuthMessage)
  const authMessage = `${clientNonce},${serverNonce},${serverNonce}`;

  // 5. ClientSignature = HMAC(StoredKey, AuthMessage)
  const clientSignature = hmacSha256(storedKey, authMessage);

  // 6. ClientProof = ClientKey XOR ClientSignature
  const clientProof = xorBuffers(clientKey, clientSignature);

  return clientProof.toString('hex');
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
  const saltBuffer = Buffer.from(salt, 'hex');
  const saltedPassword = pbkdf2(password, saltBuffer, iterations, 32);

  // 2. ServerKey = HMAC(SaltedPassword, "Server Key")
  const serverKey = hmacSha256(saltedPassword, 'Server Key');

  // 3. AuthMessage
  const authMessage = `${clientNonce},${serverNonce},${serverNonce}`;

  // 4. ServerSignature = HMAC(ServerKey, AuthMessage)
  const calculatedSignature = hmacSha256(serverKey, authMessage);

  // 5. Compare
  return calculatedSignature.toString('hex') === serverSignature;
}
