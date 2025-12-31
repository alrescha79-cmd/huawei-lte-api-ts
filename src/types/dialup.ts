/**
 * Dial-up (Mobile Data Connection) types
 */

/**
 * Data switch status
 */
export enum DataSwitchStatus {
  OFF = 0,
  ON = 1,
}

/**
 * Roaming switch status
 */
export enum RoamingSwitchStatus {
  OFF = 0,
  ON = 1,
}

/**
 * Mobile data switch
 */
export interface MobileDataSwitch {
  dataswitch: DataSwitchStatus;
}

/**
 * Dial-up connection
 */
export interface DialupConnection {
  RoamAutoConnectEnable: string;
  MaxIdleTime: string;
  ConnectMode: string;
  MTU: string;
  auto_dial_switch: string;
  pdp_always_on: string;
}

/**
 * Dial-up profiles
 */
export interface DialupProfile {
  Index?: number;
  IsValid?: number;
  Name: string;
  ApnIsStatic: number;
  ApnName?: string;
  DialupNum?: string;
  Username?: string;
  Password?: string;
  AuthMode?: number;
  IpIsStatic?: number;
  IpAddress?: string;
  DnsIsStatic?: number;
  PrimaryDns?: string;
  SecondaryDns?: string;
  ReadOnly?: number;
  iptype?: number;
}

/**
 * Profile list
 */
export interface ProfileList {
  Profiles: {
    Profile: DialupProfile | DialupProfile[];
  };
}

/**
 * Auto APN match configuration
 */
export interface AutoApnMatch {
  apn_match_flag: number;
  auto_apn?: string;
}

/**
 * Connect/Disconnect request
 */
export interface ConnectionRequest {
  Action?: number;
  RoamAutoConnectEnable?: number;
  dataswitch?: number;
}

/**
 * Mobile connection response
 */
export type MobileConnectionResponse = string;
