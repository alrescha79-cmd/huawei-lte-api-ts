/**
 * Cryptographic utilities for Huawei LTE API - React Native Version
 * 
 * This version uses pure JavaScript @noble/hashes library
 * No native module dependencies - works with Expo Go!
 * 
 * Installation required:
 * npm install @noble/hashes (already bundled with library)
 */

import { sha256 as sha256Hash } from '@noble/hashes/sha2';

export enum RsaPaddingType {
  PKCS1_v1_5 = 0,
  PKCS1_OAEP = 1,
}

/**
 * RSA encrypt data
 * NOT SUPPORTED in React Native - most modems use SHA256 auth anyway
 */
export function rsaEncrypt(
  _rsaE: string,
  _rsaN: string,
  _data: Buffer,
  _padding: RsaPaddingType = RsaPaddingType.PKCS1_v1_5
): Buffer {
  throw new Error(
    'RSA encryption not supported in React Native. ' +
    'Most Huawei modems use SHA256 authentication (password_type=4) which is fully supported.'
  );
}

/**
 * SHA256 hash using @noble/hashes (pure JavaScript)
 */
export function sha256(data: string | Buffer): Buffer {
  let input: Uint8Array;

  if (typeof data === 'string') {
    input = new TextEncoder().encode(data);
  } else if (Buffer.isBuffer(data)) {
    input = new Uint8Array(data);
  } else {
    input = data;
  }

  const hash = sha256Hash(input);
  return Buffer.from(hash);
}

/**
 * SHA256 hash and return hex string
 */
export function sha256Hex(data: string | Buffer): string {
  return sha256(data).toString('hex');
}

/**
 * Base64 encode
 */
export function base64Encode(data: string | Buffer): string {
  let buffer: Buffer;

  if (typeof data === 'string') {
    buffer = Buffer.from(data, 'utf-8');
  } else {
    buffer = data;
  }

  return buffer.toString('base64');
}

/**
 * Base64 decode
 */
export function base64Decode(data: string): Buffer {
  return Buffer.from(data, 'base64');
}
