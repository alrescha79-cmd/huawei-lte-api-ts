/**
 * Session management with CSRF token handling and auto-retry
 * Based on Python implementation: huawei_lte_api/Session.py
 */

import { parseResponseXml, createRequestXml } from './xml-parser';
import {
  ResponseErrorException,
  ResponseErrorNotSupportedException,
  ResponseErrorSystemBusyException,
  ResponseErrorLoginCsrfException,
  ResponseErrorWrongSessionToken,
  LoginErrorInvalidCredentialsException,
  LoginErrorUsernameWrongException,
  LoginErrorPasswordWrongException,
  LoginErrorUsernamePasswordWrongException,
  LoginErrorUsernamePasswordOverrunException,
} from './errors';

/**
 * Error code mapping to exceptions
 */
const ERROR_CODE_MAP: Record<number, typeof ResponseErrorException> = {
  100002: ResponseErrorNotSupportedException,
  100003: ResponseErrorException, // Unknown error
  100004: ResponseErrorSystemBusyException,
  100006: ResponseErrorException, // Voice busy
  108001: LoginErrorInvalidCredentialsException,
  108002: LoginErrorUsernameWrongException,
  108003: LoginErrorPasswordWrongException,
  108006: LoginErrorUsernamePasswordWrongException,
  108007: LoginErrorUsernamePasswordOverrunException,
  125001: ResponseErrorLoginCsrfException,
  125002: ResponseErrorWrongSessionToken,
  125003: ResponseErrorLoginCsrfException,
};

/**
 * Session cookie structure
 */
export interface SessionCookies {
  [key: string]: string;
}

/**
 * Session options
 */
export interface SessionOptions {
  url: string;
  timeout?: number;
}

/**
 * Response with headers and cookies
 */
export interface SessionResponse {
  data: Record<string, unknown>;
  headers: Headers;
  cookies: SessionCookies;
}

/**
 * Session class for managing HTTP communication with Huawei modem
 * Handles CSRF tokens, cookies, and automatic retry on token errors
 */
export class Session {
  private baseUrl: string;
  private timeout: number;
  private cookies: SessionCookies = {};
  private requestVerificationTokens: string[] = [];
  private initialized = false;

  constructor(options: SessionOptions) {
    this.baseUrl = options.url.replace(/\/$/, ''); // Remove trailing slash
    this.timeout = options.timeout || 30000;
  }

  /**
   * Initialize session by fetching initial CSRF token and establishing session cookies
   * Python equivalent: _initialize_csrf_tokens_and_session()
   * 
   * IMPORTANT: Must fetch homepage FIRST to establish session cookies!
   * Token is extracted from HTML meta[name="csrf_token"], NOT from /api/webserver/token
   */
  private async initializeIfNeeded(): Promise<void> {
    if (this.initialized) return;
    
    // Mark as initialized first to prevent recursion
    this.initialized = true;
    
    try {
      // Step 1: Fetch homepage to establish session and get CSRF tokens from HTML
      const homepageResponse = await fetch(this.baseUrl + '/', {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0',
        },
        signal: AbortSignal.timeout(this.timeout),
      });

      // Extract cookies from homepage response
      const setCookieHeader = homepageResponse.headers.get('set-cookie');
      if (setCookieHeader) {
        this.parseCookies(setCookieHeader);
      }

      // Step 2: Extract CSRF tokens from HTML meta tags (Python line 182-184)
      // This is THE SOURCE of tokens, not /api/webserver/token!
      const html = await homepageResponse.text();
      const csrfRegex = /name="csrf_token"\s+content="([^"]+)"/g;
      const matches = [...html.matchAll(csrfRegex)];
      
      if (matches.length > 0) {
        // Found CSRF tokens in HTML meta tags (preferred method)
        this.requestVerificationTokens = matches.map(m => m[1]);
      } else {
        // Fallback: try to get token from API endpoint (Python line 186-189)
        const tokenResponse = await this.get('/api/webserver/token');
        const token = (tokenResponse.data as any).token;
        if (token) {
          this.requestVerificationTokens.push(token);
        }
      }
    } catch (error) {
      // If initialization fails, continue anyway (some endpoints don't need auth)
    }
  }

  /**
   * Get current CSRF tokens
   */
  public getTokens(): string[] {
    return [...this.requestVerificationTokens];
  }

  /**
   * Set CSRF tokens
   */
  public setTokens(tokens: string[]): void {
    this.requestVerificationTokens = tokens;
  }

  /**
   * Add a CSRF token to the pool
   */
  public addToken(token: string): void {
    if (token && !this.requestVerificationTokens.includes(token)) {
      this.requestVerificationTokens.push(token);
    }
  }

  /**
   * Get the next CSRF token from the pool
   * Python behavior:
   * - If > 1 tokens: pop first token (remove from array)
   * - If == 1 token: use it but DON'T remove
   */
  private getNextToken(): string | undefined {
    if (this.requestVerificationTokens.length === 0) {
      return undefined;
    }

    // Python line 260-264: if multiple tokens, pop; if single, keep
    if (this.requestVerificationTokens.length > 1) {
      return this.requestVerificationTokens.shift(); // Remove and return first
    } else {
      return this.requestVerificationTokens[0]; // Return but keep in array
    }
  }

  /**
   * Get current cookies
   */
  public getCookies(): SessionCookies {
    return { ...this.cookies };
  }

  /**
   * Set cookies
   */
  public setCookies(cookies: SessionCookies): void {
    this.cookies = { ...cookies };
  }

  /**
   * Parse and store cookies from response headers
   */
  private parseCookies(headers: Headers | string): void {
    let setCookie: string | null = null;

    if (typeof headers === 'string') {
      setCookie = headers;
    } else {
      setCookie = headers.get('set-cookie');
    }

    if (!setCookie) {
      return;
    }

    // Handle multiple Set-Cookie headers (separated by comma in some cases)
    const cookieStrings = setCookie.split(',').map(s => s.trim());

    for (const cookieStr of cookieStrings) {
      const parts = cookieStr.split(';')[0].split('=');
      if (parts.length === 2) {
        const [name, value] = parts;
        this.cookies[name.trim()] = value.trim();
      }
    }
  }

  /**
   * Build cookie header string
   */
  private getCookieHeader(): string {
    return Object.entries(this.cookies)
      .map(([name, value]) => `${name}=${value}`)
      .join('; ');
  }

  /**
   * Check response for errors and throw appropriate exceptions
   */
  private checkResponseError(data: Record<string, unknown>): void {
    if (!data || typeof data !== 'object') {
      return;
    }

    // Check for error response
    if (data.error) {
      const errorData = data.error as { code?: number | string; message?: string };
      const errorCode = parseInt(String(errorData.code || 0), 10);
      const message = errorData.message || `Error ${errorCode}`;

      const ExceptionClass = ERROR_CODE_MAP[errorCode] || ResponseErrorException;
      throw new ExceptionClass(message, errorCode);
    }

    // Check for response.error (some endpoints use this structure)
    if (data.response) {
      const responseData = data.response as Record<string, unknown>;
      if (responseData.error) {
        const errorData = responseData.error as { code?: number | string; message?: string };
        const errorCode = parseInt(String(errorData.code || 0), 10);
        const message = errorData.message || `Error ${errorCode}`;

        const ExceptionClass = ERROR_CODE_MAP[errorCode] || ResponseErrorException;
        throw new ExceptionClass(message, errorCode);
      }
    }
  }

  /**
   * Extract and store CSRF tokens from response
   */
  private extractTokensFromResponse(headers: Headers, data: Record<string, unknown>): void {
    // Extract from headers
    const token1 = headers.get('__requestverificationtoken');
    const token2 = headers.get('__requestverificationtokenone');
    const token3 = headers.get('__requestverificationtokentwo');

    if (token1) this.addToken(token1);
    if (token2) this.addToken(token2);
    if (token3) this.addToken(token3);

    // Extract from XML response - standard token fields
    if (data && data.response) {
      const resp = data.response as Record<string, unknown>;
      if (resp.__RequestVerificationToken) {
        this.addToken(String(resp.__RequestVerificationToken));
      }
      if (resp.__RequestVerificationTokenone) {
        this.addToken(String(resp.__RequestVerificationTokenone));
      }
      if (resp.__RequestVerificationTokentwo) {
        this.addToken(String(resp.__RequestVerificationTokentwo));
      }
      
      // Extract from /api/webserver/token endpoint (lowercase 'token')
      if (resp.token) {
        this.addToken(String(resp.token));
      }
    }
  }

  /**
   * Perform HTTP GET request
   */
  public async get(endpoint: string, refreshCsrf: boolean = false): Promise<SessionResponse> {
    await this.initializeIfNeeded();
    
    const url = `${this.baseUrl}${endpoint}`;

    const headers: HeadersInit = {
      'Content-Type': 'text/html',
      Accept: '*/*',
    };

    // Add cookies
    const cookieHeader = this.getCookieHeader();
    if (cookieHeader) {
      headers['Cookie'] = cookieHeader;
    }

    // Add CSRF token if available and not refreshing
    if (!refreshCsrf) {
      const token = this.getNextToken();
      if (token) {
        headers['__RequestVerificationToken'] = token;
      }
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Parse cookies
      this.parseCookies(response.headers);

      // Parse response body
      const text = await response.text();
      const data = await parseResponseXml(text);

      // Extract tokens
      this.extractTokensFromResponse(response.headers, data);

      // Check for errors
      this.checkResponseError(data);

      return {
        data: (data.response || data) as Record<string, unknown>,
        headers: response.headers,
        cookies: this.cookies,
      };
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`Request timeout after ${this.timeout}ms`);
      }
      throw error;
    }
  }

  /**
   * Perform HTTP POST request
   */
  public async post(
    endpoint: string,
    data: Record<string, unknown> = {},
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _isEncrypted: boolean = false,
    refreshCsrf: boolean = false
  ): Promise<SessionResponse> {
    await this.initializeIfNeeded();
    
    const url = `${this.baseUrl}${endpoint}`;

    // Convert data to XML if not already a string
    const body = typeof data === 'string' ? data : createRequestXml(data);

    const headers: HeadersInit = {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      Accept: '*/*',
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'X-Requested-With': 'XMLHttpRequest',
      Origin: this.baseUrl,
      Referer: this.baseUrl + '/',
    };

    // Add cookies
    const cookieHeader = this.getCookieHeader();
    if (cookieHeader) {
      headers['Cookie'] = cookieHeader;
    }

    // Always add CSRF token if available (Python always sends it)
    // refreshCsrf only affects whether tokens are cleared AFTER response
    const token = this.getNextToken();
    if (token) {
      headers['__RequestVerificationToken'] = token;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Parse cookies
      this.parseCookies(response.headers);

      // Parse response body
      const text = await response.text();
      const responseData = await parseResponseXml(text);

      // Clear tokens if refreshCsrf is true (Python behavior)
      if (refreshCsrf) {
        this.requestVerificationTokens = [];
      }

      // Extract tokens
      this.extractTokensFromResponse(response.headers, responseData);

      // Check for errors
      this.checkResponseError(responseData);

      return {
        data: (responseData.response || responseData) as Record<string, unknown>,
        headers: response.headers,
        cookies: this.cookies,
      };
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`Request timeout after ${this.timeout}ms`);
      }
      throw error;
    }
  }

  /**
   * Auto-retry decorator: tries request, if CSRF error occurs, refreshes tokens and retries
   */
  private async tryOrReloadAndRetry<T>(
    fn: () => Promise<T>,
    refreshFn: () => Promise<void>
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      // Check if it's a CSRF token error
      if (
        error instanceof ResponseErrorLoginCsrfException ||
        error instanceof ResponseErrorWrongSessionToken
      ) {
        // Refresh CSRF tokens
        await refreshFn();
        // Retry the original request
        return await fn();
      }
      throw error;
    }
  }

  /**
   * Perform GET request with auto-retry on CSRF errors
   */
  public async getWithRetry(
    endpoint: string,
    refreshEndpoint: string = '/api/webserver/SesTokInfo'
  ): Promise<SessionResponse> {
    return this.tryOrReloadAndRetry(
      () => this.get(endpoint, false),
      async () => {
        await this.get(refreshEndpoint, true);
      }
    );
  }

  /**
   * Perform POST request with auto-retry on CSRF errors
   */
  public async postWithRetry(
    endpoint: string,
    data: Record<string, unknown> = {},
    isEncrypted: boolean = false,
    refreshEndpoint: string = '/api/webserver/SesTokInfo'
  ): Promise<SessionResponse> {
    return this.tryOrReloadAndRetry(
      () => this.post(endpoint, data, isEncrypted, false),
      async () => {
        await this.get(refreshEndpoint, true);
      }
    );
  }
}
