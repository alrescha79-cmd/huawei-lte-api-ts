/**
 * Authentication utilities
 * Based on Python implementation: huawei_lte_api/AuthorizedConnection.py
 */

import { sha256Hex, base64Encode, rsaEncrypt, RsaPaddingType } from './crypto';
import { generateNonce, calculateScramProof } from './scram';

// Re-export for convenience
export { RsaPaddingType } from './crypto';
import { Session } from './session';

/**
 * Password encoding type
 */
export enum PasswordType {
  BASE64 = 0, // Password is base64 encoded
  SHA256 = 1, // Password is SHA256 hashed then base64 encoded
}

/**
 * Encode password using specified method
 * Python implementation reference: User._encode_password()
 * @param username - Username (needed for SHA256 mode)
 * @param password - Plain text password
 * @param type - Password encoding type
 * @param token - Optional CSRF token (required for SHA256 mode)
 */
export function encodePassword(
  username: string,
  password: string,
  type: PasswordType = PasswordType.BASE64,
  token?: string
): string {
  if (type === PasswordType.SHA256) {
    // Python code:
    // concentrated = username + base64(sha256(password).hexdigest()) + token
    // return base64(sha256(concentrated).hexdigest())
    
    if (!token) {
      throw new Error('Token is required for SHA256 password encoding');
    }
    
    // Step 1: SHA256 hash password → hexdigest → base64
    const passwordHash = sha256Hex(password);
    const passwordHashB64 = base64Encode(passwordHash);
    
    // Step 2: Concatenate username + passwordHashB64 + token
    const concentrated = username + passwordHashB64 + token;
    
    // Step 3: SHA256 hash concentrated → hexdigest → base64
    const finalHash = sha256Hex(concentrated);
    const finalB64 = base64Encode(finalHash);
    return finalB64;
  }

  // BASE64 only (default)
  return base64Encode(password);
}

/**
 * RSA encrypt password
 * @param password - Plain text password
 * @param rsaE - RSA exponent (hex string)
 * @param rsaN - RSA modulus (hex string)
 * @param padding - RSA padding type
 */
export function encryptPassword(
  password: string,
  rsaE: string,
  rsaN: string,
  padding: RsaPaddingType = RsaPaddingType.PKCS1_v1_5
): Buffer {
  const passwordBuffer = Buffer.from(password, 'utf-8');
  return rsaEncrypt(rsaE, rsaN, passwordBuffer, padding);
}

/**
 * Prepare login credentials
 * @param username - Username
 * @param password - Password
 * @param session - Session instance to get CSRF token
 * @param passwordType - Password encoding type
 */
export function prepareLoginCredentials(
  username: string,
  password: string,
  session: Session,
  passwordType: PasswordType = PasswordType.BASE64
): { Username: string; Password: string; password_type: number } {
  // Get CSRF token
  const tokens = session.getTokens();
  const token = tokens.length > 0 ? tokens[0] : undefined;
  

  // Encode password (passing username for SHA256 mode)
  const encodedPassword = encodePassword(username, password, passwordType, token);

  return {
    Username: username, // Keep username as-is (no base64)
    Password: encodedPassword,
    password_type: passwordType,
  };
}

/**
 * Check if RSA encryption is required
 * This is determined by checking device capabilities
 */
export async function isRsaEncryptionRequired(session: Session): Promise<boolean> {
  try {
    // Try to get public key info
    const response = await session.get('/api/webserver/publickey');
    
    // If we get RSA public key info, encryption is required
    if (response.data && (response.data.encpubkeyn || response.data.encpubkeye)) {
      return true;
    }
  } catch (error) {
    // If endpoint doesn't exist or returns error, encryption not required
  }

  return false;
}

/**
 * Get RSA public key from device
 */
export async function getRsaPublicKey(
  session: Session
): Promise<{ e: string; n: string } | null> {
  try {
    const response = await session.get('/api/webserver/publickey');

    if (response.data && response.data.encpubkeye && response.data.encpubkeyn) {
      return {
        e: String((response.data as Record<string, unknown>).encpubkeye),
        n: String((response.data as Record<string, unknown>).encpubkeyn),
      };
    }
  } catch (error) {
    // Public key not available
  }

  return null;
}

/**
 * Prepare login credentials with RSA encryption if required
 */
export async function prepareSecureLoginCredentials(
  username: string,
  password: string,
  session: Session
): Promise<Record<string, unknown>> {
  // Check if RSA encryption is required
  const publicKey = await getRsaPublicKey(session);

  if (publicKey) {
    // Use RSA encryption
    const encryptedPassword = encryptPassword(
      password,
      publicKey.e,
      publicKey.n,
      RsaPaddingType.PKCS1_v1_5
    );

    return {
      Username: base64Encode(username),
      Password: encryptedPassword.toString('utf-8'),
      password_type: 4, // RSA encrypted
    };
  }

  // Fall back to standard encoding
  return prepareLoginCredentials(username, password, session, PasswordType.SHA256);
}

/**
 * Perform login
 * Matches Python implementation from Salamek/huawei-lte-api
 */
export async function login(
  session: Session,
  username: string,
  password: string
): Promise<void> {
  try {
    // Step 1: Get login state to determine password_type
    const stateResponse = await session.get('/api/user/state-login');
    const passwordType = parseInt(String(stateResponse.data?.password_type || '0'));
    
    
    // Step 2: Prepare credentials based on password_type
    // Python gets token from session.request_verification_tokens[0] which is already loaded
    let credentials: Record<string, unknown>;
    
    if (passwordType === 4) {
      // SHA256 mode
      credentials = prepareLoginCredentials(username, password, session, PasswordType.SHA256);
    } else {
      // Base64 mode (default)
      credentials = prepareLoginCredentials(username, password, session, PasswordType.BASE64);
    }
    
    // Step 3: Send login request with refresh_csrf=True
    // Python: self._session.post_set("user/login", {...}, refresh_csrf=True)
    await session.post('/api/user/login', credentials, false, true);
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}

/**
 * Login with SCRAM authentication (challenge-response)
 * Following exact browser flow: fetch token → challenge → fetch token → authenticate
 */
export async function loginWithScram(
  session: Session,
  username: string,
  password: string
): Promise<void> {
  
  // Step 1: Fetch fresh token (like browser does before challenge)
  await await session.get('/api/webserver/token');
  
  // Step 2: Generate client nonce
  const clientNonce = generateNonce(32);
  
  // Step 3: Send challenge request
  const challengeRequest = {
    username,
    firstnonce: clientNonce,
    mode: 1,
  };
  
  const challengeResponse = await session.post('/api/user/challenge_login', challengeRequest);
  
  // Step 4: Extract server response
  const salt = String(challengeResponse.data?.salt || '');
  const serverNonce = String(challengeResponse.data?.servernonce || '');
  const iterations = parseInt(String(challengeResponse.data?.iterations || '100'));
  
  
  if (!salt || !serverNonce) {
    throw new Error('Invalid SCRAM challenge response');
  }
  
  // Step 5: Calculate client proof
  const clientProof = calculateScramProof(
    username,
    password,
    clientNonce,
    serverNonce,
    salt,
    iterations
  );
  
  // Step 6: Fetch fresh token again before authentication (browser does this)
  await await session.get('/api/webserver/token');
  
  // Step 7: Send authentication with proof
  const authRequest = {
    clientproof: clientProof,
    finalnonce: serverNonce,
  };
  
  await session.post('/api/user/authentication_login', authRequest);
}

/**
 * Perform logout
 */
export async function logout(session: Session): Promise<void> {
  await session.post('/api/user/logout', { Logout: 1 });
}

/**
 * Check if user is logged in
 */
export async function isLoggedIn(session: Session): Promise<boolean> {
  try {
    const response = await session.get('/api/user/state-login');
    const data = response.data;
    return Boolean(data?.State && parseInt(data.State as string) === 0);
  } catch (error) {
    return false;
  }
}
