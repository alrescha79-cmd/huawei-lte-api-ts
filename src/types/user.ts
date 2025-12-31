/**
 * User and security related types
 */

/**
 * User state
 */
export enum UserState {
  LOGGED_OUT = -1,
  LOGGED_IN = 0,
}

/**
 * User login state
 */
export interface UserLoginState {
  State: UserState;
  Username?: string;
  password_type?: number;
}

/**
 * User login request
 */
export interface UserLoginRequest {
  Username: string;
  Password: string;
  password_type?: number;
}

/**
 * User login response
 */
export type UserLoginResponse = string;

/**
 * User logout request
 */
export interface UserLogoutRequest {
  Logout: number;
}

/**
 * User logout response
 */
export type UserLogoutResponse = string;

/**
 * Session token info
 */
export interface SessionTokenInfo {
  SesInfo?: string;
  TokInfo: string;
  __RequestVerificationToken?: string;
  __RequestVerificationTokenone?: string;
  __RequestVerificationTokentwo?: string;
}

/**
 * Token (single)
 */
export interface Token {
  token: string;
}

/**
 * Public key for RSA encryption
 */
export interface PublicKey {
  encpubkeyn: string;
  encpubkeye: string;
}

/**
 * PIN status
 */
export interface PinStatus {
  SimState: number;
  PinOptState: number;
  SimPinTimes: number;
  SimPukTimes: number;
}

/**
 * PIN operation request
 */
export interface PinOperationRequest {
  OperateType: number;
  CurrentPin: string;
  NewPin?: string;
  PukCode?: string;
}

/**
 * PIN operation response
 */
export type PinOperationResponse = string;

/**
 * Change password request
 */
export interface ChangePasswordRequest {
  OldPassword: string;
  NewPassword: string;
}

/**
 * Change password response
 */
export type ChangePasswordResponse = string;
