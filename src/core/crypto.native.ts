/**
 * Cryptographic utilities for Huawei LTE API - React Native Version
 * 
 * This version uses react-native-quick-crypto
 * 
 * Installation required:
 * npm install react-native-quick-crypto
 * npx expo install react-native-quick-crypto
 */

// Try to import react-native-quick-crypto, fallback to error message
let createHash: any;
let publicEncrypt: any;
let constants: any;

try {
  const crypto = require('react-native-quick-crypto');
  createHash = crypto.createHash;
  publicEncrypt = crypto.publicEncrypt;
  constants = crypto.constants;
} catch (error) {
  throw new Error(
    'React Native requires "react-native-quick-crypto" to be installed.\n' +
    'Install it with: npm install react-native-quick-crypto\n' +
    'Then run: npx expo install react-native-quick-crypto'
  );
}

export enum RsaPaddingType {
  PKCS1_v1_5 = 0,
  PKCS1_OAEP = 1,
}

/**
 * RSA encrypt data
 * @param rsaE - RSA exponent (hex string)
 * @param rsaN - RSA modulus (hex string)
 * @param data - Data to encrypt
 * @param padding - Padding type (0 = PKCS1_v1_5, 1 = PKCS1_OAEP)
 */
export function rsaEncrypt(
  rsaE: string,
  rsaN: string,
  data: Buffer,
  padding: RsaPaddingType = RsaPaddingType.PKCS1_v1_5
): Buffer {
  // Base64 encode the data first
  const b64data = data.toString('base64');
  const dataBuffer = Buffer.from(b64data, 'utf-8');

  // Determine block size based on padding type
  const blockSize = padding === RsaPaddingType.PKCS1_v1_5 ? 245 : 214;

  // Create public key from modulus and exponent
  const key = {
    key: createPublicKey(rsaN, rsaE),
    padding:
      padding === RsaPaddingType.PKCS1_v1_5
        ? constants.RSA_PKCS1_PADDING
        : constants.RSA_PKCS1_OAEP_PADDING,
  };

  // Encrypt in blocks
  const blocks = Math.ceil(dataBuffer.length / blockSize);
  const resultChunks: Buffer[] = [];

  for (let i = 0; i < blocks; i++) {
    const start = i * blockSize;
    const end = Math.min(start + blockSize, dataBuffer.length);
    const block = dataBuffer.subarray(start, end);

    const encrypted = publicEncrypt(key, Buffer.from(block));
    resultChunks.push(encrypted);
  }

  // Combine all encrypted blocks and convert to hex
  const result = Buffer.concat(resultChunks as Uint8Array[]).toString('hex');

  // Ensure even length (add leading zero if odd)
  return Buffer.from(result.length % 2 === 0 ? result : '0' + result, 'utf-8');
}

/**
 * Create RSA public key from modulus and exponent
 */
function createPublicKey(modulus: string, exponent: string): string {
  // Convert hex strings to BigInt
  const n = BigInt('0x' + modulus);
  const e = BigInt('0x' + exponent);

  // Create DER encoded public key
  const modulusBuffer = bigIntToBuffer(n);
  const exponentBuffer = bigIntToBuffer(e);

  // Build ASN.1 structure for RSA public key
  const derKey = encodeDER(modulusBuffer, exponentBuffer);

  // Convert to PEM format
  const base64Der = derKey.toString('base64');
  const chunks = base64Der.match(/.{1,64}/g) || [];
  return (
    '-----BEGIN RSA PUBLIC KEY-----\n' +
    chunks.join('\n') +
    '\n-----END RSA PUBLIC KEY-----'
  );
}

/**
 * Convert BigInt to Buffer
 */
function bigIntToBuffer(num: bigint): Buffer {
  let hex = num.toString(16);
  if (hex.length % 2) {
    hex = '0' + hex;
  }
  return Buffer.from(hex, 'hex');
}

/**
 * Encode RSA public key in DER format
 */
function encodeDER(modulus: Buffer, exponent: Buffer): Buffer {
  // Simple DER encoding for RSA public key
  // SEQUENCE { modulus INTEGER, exponent INTEGER }

  const modulusDer = encodeInteger(modulus);
  const exponentDer = encodeInteger(exponent);

  const sequenceContent = Buffer.concat([modulusDer, exponentDer] as Uint8Array[]);
  return encodeSequence(sequenceContent);
}

/**
 * Encode INTEGER in DER format
 */
function encodeInteger(value: Buffer): Buffer {
  // Add leading zero if high bit is set
  const needsPadding = value[0] & 0x80;
  const paddedValue = needsPadding
    ? Buffer.concat([Buffer.from([0x00]), value] as Uint8Array[])
    : value;

  const length = encodeLength(paddedValue.length);
  return Buffer.concat([Buffer.from([0x02]), length, paddedValue] as Uint8Array[]);
}

/**
 * Encode SEQUENCE in DER format
 */
function encodeSequence(content: Buffer): Buffer {
  const length = encodeLength(content.length);
  return Buffer.concat([Buffer.from([0x30]), length, content] as Uint8Array[]);
}

/**
 * Encode length in DER format
 */
function encodeLength(length: number): Buffer {
  if (length < 128) {
    return Buffer.from([length]);
  }

  const lengthBytes: number[] = [];
  let temp = length;
  while (temp > 0) {
    lengthBytes.unshift(temp & 0xff);
    temp >>= 8;
  }

  return Buffer.from([0x80 | lengthBytes.length, ...lengthBytes]);
}

/**
 * SHA256 hash
 */
export function sha256(data: string | Buffer): Buffer {
  return createHash('sha256').update(data as any).digest();
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
  const buffer = typeof data === 'string' ? Buffer.from(data, 'utf-8') : data;
  return buffer.toString('base64');
}

/**
 * Base64 decode
 */
export function base64Decode(data: string): Buffer {
  return Buffer.from(data, 'base64');
}
