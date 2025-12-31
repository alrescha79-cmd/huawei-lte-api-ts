/**
 * Main entry point for huawei-lte-api-ts
 * Modern TypeScript implementation with full feature parity to Python library
 */

// Export main client
export { HuaweiLTEClient, createClient } from './client';
export type { ClientConfig } from './client';

// Export core modules
export { Session } from './core/session';
export type { SessionOptions, SessionResponse } from './core/session';

export { login, logout, isLoggedIn, encodePassword } from './core/auth';
export { PasswordType, RsaPaddingType } from './core/auth';

// Export errors
export * from './core/errors';

// Export API modules
export { Device } from './api/Device';
export { Sms } from './api/Sms';
export { Monitoring } from './api/Monitoring';
export { DialUp } from './api/DialUpModern';
export { User } from './api/UserModern';
export { WLan } from './api/WLanModern';

// Export types
export type * from './types';

// Export enums (from existing enum files)
export * from './enums/device';
export * from './enums/sms';
export * from './enums/wlan';

// Version
export const VERSION = '2.0.0';
