/**
 * User management API module
 * Based on Python implementation: huawei_lte_api/api/User.py
 */

import { ApiGroup } from '../base/ApiGroup';
import {
  UserLoginState,
  UserLoginRequest,
  UserLoginResponse,
  UserLogoutResponse,
  SessionTokenInfo,
  Token,
  PublicKey,
  ChangePasswordResponse,
} from '../types/user';
import { SetResponseType } from '../types/common';

export class User extends ApiGroup {
  /**
   * Get current login state
   */
  stateLogin(): Promise<UserLoginState> {
    return this.get<UserLoginState>('user/state-login');
  }

  /**
   * Login user
   * Note: Use Connection.login() for proper authentication flow
   */
  login(credentials: UserLoginRequest): Promise<UserLoginResponse> {
    return this.postSet('user/login', credentials as unknown as Record<string, unknown>);
  }

  /**
   * Logout user
   */
  logout(): Promise<UserLogoutResponse> {
    return this.postSet('user/logout', {
      Logout: 1,
    });
  }

  /**
   * Get session and token info
   */
  sessionTokenInfo(): Promise<SessionTokenInfo> {
    return this.get<SessionTokenInfo>('webserver/SesTokInfo');
  }

  /**
   * Get single token (legacy endpoint)
   */
  token(): Promise<Token> {
    return this.get<Token>('webserver/token');
  }

  /**
   * Get RSA public key for password encryption
   */
  publicKey(): Promise<PublicKey> {
    return this.get<PublicKey>('webserver/publickey');
  }

  /**
   * Change password
   */
  changePassword(
    oldPassword: string,
    newPassword: string
  ): Promise<ChangePasswordResponse> {
    return this.postSet('user/password', {
      OldPassword: oldPassword,
      NewPassword: newPassword,
    });
  }

  /**
   * Get remind flag
   */
  remind(): Promise<Record<string, unknown>> {
    return this.get('user/remind');
  }

  /**
   * Set remind flag
   */
  setRemind(remind: number): Promise<SetResponseType> {
    return this.postSet('user/remind', {
      remind_flag: remind,
    });
  }
}
