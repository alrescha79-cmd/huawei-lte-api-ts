/**
 * Main Huawei LTE API Client
 * Provides unified access to all API modules
 */

import { Session } from './core/session';
import { login, logout, isLoggedIn } from './core/auth';

// Import API modules
import { Device } from './api/Device';
import { Sms } from './api/Sms';
import { Monitoring } from './api/Monitoring';
import { DialUp } from './api/DialUp';
import { User } from './api/User';
import { WLan } from './api/WLan';

export interface ClientConfig {
  /**
   * Base URL of the modem (e.g., "http://192.168.8.1")
   */
  url: string;

  /**
   * Username for authentication (default: "admin")
   */
  username?: string;

  /**
   * Password for authentication (default: "admin")
   */
  password?: string;

  /**
   * Request timeout in milliseconds (default: 30000)
   */
  timeout?: number;

  /**
   * Auto login on client creation (default: false)
   */
  autoLogin?: boolean;
}

/**
 * Main client for Huawei LTE API
 * 
 * @example
 * ```typescript
 * const client = new HuaweiLTEClient({
 *   url: 'http://192.168.8.1',
 *   username: 'admin',
 *   password: 'admin'
 * });
 * 
 * await client.login();
 * const deviceInfo = await client.device.information();
 * const smsCount = await client.sms.smsCount();
 * await client.logout();
 * ```
 */
export class HuaweiLTEClient {
  private session: Session;
  private username: string;
  private password: string;

  // API modules
  public readonly device: Device;
  public readonly sms: Sms;
  public readonly monitoring: Monitoring;
  public readonly dialup: DialUp;
  public readonly user: User;
  public readonly wlan: WLan;

  constructor(config: ClientConfig) {
    // Parse URL to extract credentials if present
    let cleanUrl = config.url;
    let username = config.username;
    let password = config.password;

    try {
      const urlObj = new URL(config.url);
      
      // Extract credentials from URL if present
      if (urlObj.username) {
        username = decodeURIComponent(urlObj.username);
      }
      if (urlObj.password) {
        password = decodeURIComponent(urlObj.password);
      }

      // Create clean URL without credentials (fetch doesn't support credentials in URL)
      cleanUrl = `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}${urlObj.search}${urlObj.hash}`;
    } catch (e) {
      // If URL parsing fails, use as-is
    }

    // Create session with clean URL
    this.session = new Session({
      url: cleanUrl,
      timeout: config.timeout || 30000,
    });

    // Store credentials
    this.username = username || 'admin';
    this.password = password || 'admin';

    // Initialize API modules
    this.device = new Device(this.session);
    this.sms = new Sms(this.session);
    this.monitoring = new Monitoring(this.session);
    this.dialup = new DialUp(this.session);
    this.user = new User(this.session);
    this.wlan = new WLan(this.session);

    // Auto login if requested
    if (config.autoLogin) {
      this.login().catch(() => {
        // Silently fail auto-login, user can retry manually
      });
    }
  }

  /**
   * Login to the modem
   * This will handle:
   * - CSRF token initialization
   * - Password encoding (SHA256 + Base64)
   * - RSA encryption (if required by modem)
   * - Session cookie management
   */
  async login(): Promise<void> {
    // Initialize session and get CSRF tokens
    await this.initializeSession();

    // Perform login with proper authentication
    await login(this.session, this.username, this.password);
  }

  /**
   * Logout from the modem
   */
  async logout(): Promise<void> {
    await logout(this.session);
  }

  /**
   * Check if currently logged in
   */
  async isLoggedIn(): Promise<boolean> {
    return isLoggedIn(this.session);
  }

  /**
   * Initialize session by getting CSRF tokens
   */
  private async initializeSession(): Promise<void> {
    try {
      // Try to get tokens from SesTokInfo endpoint
      const response = await this.session.get('/api/webserver/SesTokInfo', true);

      if (response.data) {
        const data = response.data;

        // Extract tokens from response
        if (data.TokInfo) {
          this.session.addToken(String(data.TokInfo));
        }
        if (data.__RequestVerificationToken) {
          this.session.addToken(String(data.__RequestVerificationToken));
        }
        if (data.__RequestVerificationTokenone) {
          this.session.addToken(String(data.__RequestVerificationTokenone));
        }
        if (data.__RequestVerificationTokentwo) {
          this.session.addToken(String(data.__RequestVerificationTokentwo));
        }
      }
    } catch (error) {
      // If SesTokInfo fails, try legacy token endpoint
      try {
        const response = await this.session.get('/api/webserver/token', true);
        const data = response.data;
        if (data && data.token) {
          this.session.addToken(String(data.token));
        }
      } catch (legacyError) {
        // If both fail, try to extract from homepage HTML
        await this.extractTokensFromHomepage();
      }
    }
  }

  /**
   * Extract CSRF tokens from homepage HTML (fallback method)
   */
  private async extractTokensFromHomepage(): Promise<void> {
    try {
      const response = await fetch(`${this.session['baseUrl']}/`);
      const html = await response.text();
      
      // Parse CSRF token from HTML meta tag
      const csrfRegex = /name="csrf_token"\s+content="(\S+)"/g;
      let match;
      while ((match = csrfRegex.exec(html)) !== null) {
        this.session.addToken(match[1]);
      }
    } catch (error) {
      // No tokens found, will fail on first authenticated request
      // eslint-disable-next-line no-console
      console.warn('Failed to initialize CSRF tokens');
    }
  }

  /**
   * Get direct access to session (for advanced usage)
   */
  getSession(): Session {
    return this.session;
  }

  /**
   * Get current CSRF tokens
   */
  getTokens(): string[] {
    return this.session.getTokens();
  }

  /**
   * Get current cookies
   */
  getCookies(): Record<string, string> {
    return this.session.getCookies();
  }
}

/**
 * Factory function to create and auto-login client
 */
export async function createClient(config: ClientConfig): Promise<HuaweiLTEClient> {
  const client = new HuaweiLTEClient(config);
  await client.login();
  return client;
}

// Export types
export type {
  DeviceInfo,
  DeviceBasicInfo,
  DeviceSignal,
} from './types/device';

export type {
  SmsListResponse,
  SmsCount,
  SmsMessage,
  SmsConfig,
} from './types/sms';

export type {
  MonitoringStatus,
  CheckNotifications,
  MonitoringTrafficStats,
} from './types/monitoring';

export type {
  DialupConnection,
  DialupProfile,
  MobileDataSwitch,
} from './types/dialup';

export type {
  WlanBasicSettings,
  WlanSecuritySettings,
  StationList,
} from './types/wlan';

export type {
  UserLoginState,
  SessionTokenInfo,
} from './types/user';
