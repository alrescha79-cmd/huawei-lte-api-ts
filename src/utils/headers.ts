/**
 * HTTP headers utilities
 */

/**
 * Common headers for Huawei modem API requests
 */
export const COMMON_HEADERS = {
  'User-Agent': 'Mozilla/5.0',
  'Accept': '*/*',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept-Encoding': 'gzip, deflate',
  'Referer': '',
  'X-Requested-With': 'XMLHttpRequest',
} as const;

/**
 * Build headers for GET request
 */
export function buildGetHeaders(
  baseUrl: string,
  csrfToken?: string,
  cookies?: string
): HeadersInit {
  const headers: HeadersInit = {
    ...COMMON_HEADERS,
    'Content-Type': 'text/html',
    'Referer': baseUrl,
  };

  if (csrfToken) {
    headers['__RequestVerificationToken'] = csrfToken;
  }

  if (cookies) {
    headers['Cookie'] = cookies;
  }

  return headers;
}

/**
 * Build headers for POST request
 */
export function buildPostHeaders(
  baseUrl: string,
  csrfToken?: string,
  cookies?: string,
  isJson = false
): HeadersInit {
  const headers: HeadersInit = {
    ...COMMON_HEADERS,
    'Content-Type': isJson
      ? 'application/json; charset=UTF-8'
      : 'application/x-www-form-urlencoded; charset=UTF-8',
    'Referer': baseUrl,
  };

  if (csrfToken) {
    headers['__RequestVerificationToken'] = csrfToken;
  }

  if (cookies) {
    headers['Cookie'] = cookies;
  }

  return headers;
}

/**
 * Parse CSRF tokens from response headers
 */
export function extractCsrfTokens(headers: Headers): string[] {
  const tokens: string[] = [];

  const token = headers.get('__requestverificationtoken');
  const token1 = headers.get('__requestverificationtokenone');
  const token2 = headers.get('__requestverificationtokentwo');

  if (token1 && token2) {
    // Dual token mode
    tokens.push(token1, token2);
  } else if (token) {
    // Single token mode
    tokens.push(token);
  }

  return tokens;
}

/**
 * Parse session cookies from Set-Cookie header
 */
export function extractSessionCookies(headers: Headers): Record<string, string> {
  const cookies: Record<string, string> = {};
  const setCookie = headers.get('set-cookie');

  if (!setCookie) {
    return cookies;
  }

  // Handle multiple Set-Cookie headers
  const cookieStrings = Array.isArray(setCookie) ? setCookie : [setCookie];

  for (const cookieStr of cookieStrings) {
    if (typeof cookieStr === 'string') {
      const firstPart = cookieStr.split(';')[0];
      if (firstPart) {
        const parts = firstPart.split('=');
        if (parts.length === 2 && parts[0] && parts[1]) {
          cookies[parts[0].trim()] = parts[1].trim();
        }
      }
    }
  }

  return cookies;
}

/**
 * Build cookie header string from cookie object
 */
export function buildCookieHeader(cookies: Record<string, string>): string {
  return Object.entries(cookies)
    .map(([name, value]) => `${name}=${value}`)
    .join('; ');
}
