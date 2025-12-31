/**
 * DialUp (Mobile Data Connection) API module
 * Based on Python implementation: huawei_lte_api/api/DialUp.py
 */

import { ApiGroup } from '../base/ApiGroup';
import {
  DialupConnection,
  ProfileList,
  DialupProfile,
  MobileDataSwitch,
  AutoApnMatch,
  MobileConnectionResponse,
} from '../types/dialup';
import { SetResponseType } from '../types/common';

export class DialUp extends ApiGroup {
  /**
   * Get dial-up connection settings
   */
  dialupConnection(): Promise<DialupConnection> {
    return this.get<DialupConnection>('dialup/connection');
  }

  /**
   * Get profile list
   */
  profiles(): Promise<ProfileList> {
    return this.get<ProfileList>('dialup/profiles');
  }

  /**
   * Set profile
   */
  setProfile(profile: DialupProfile): Promise<SetResponseType> {
    return this.postSet('dialup/profiles', profile as unknown as Record<string, unknown>);
  }

  /**
   * Get mobile data switch status
   */
  mobileDataswitch(): Promise<MobileDataSwitch> {
    return this.get<MobileDataSwitch>('dialup/mobile-dataswitch');
  }

  /**
   * Set mobile data switch
   * @param enabled - Enable or disable mobile data
   */
  setMobileDataswitch(enabled: boolean): Promise<SetResponseType> {
    return this.postSet('dialup/mobile-dataswitch', {
      dataswitch: enabled ? 1 : 0,
    });
  }

  /**
   * Get auto APN match configuration
   */
  autoApn(): Promise<AutoApnMatch> {
    return this.get<AutoApnMatch>('dialup/auto-apn');
  }

  /**
   * Connect mobile data
   */
  connect(): Promise<MobileConnectionResponse> {
    return this.postSet('dialup/dial', {
      Action: 1,
    });
  }

  /**
   * Disconnect mobile data
   */
  disconnect(): Promise<MobileConnectionResponse> {
    return this.postSet('dialup/dial', {
      Action: 0,
    });
  }
}
