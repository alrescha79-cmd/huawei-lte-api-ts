/**
 * WLAN (WiFi) related types
 */

/**
 * WiFi status
 */
export enum WifiStatus {
  OFF = 0,
  ON = 1,
}

/**
 * WiFi frequency
 */
export enum WifiFrequency {
  FREQ_2_4GHZ = 0,
  FREQ_5GHZ = 1,
}

/**
 * WiFi channel
 */
export enum WifiChannel {
  AUTO = 0,
  CHANNEL_1 = 1,
  CHANNEL_2 = 2,
  CHANNEL_3 = 3,
  CHANNEL_4 = 4,
  CHANNEL_5 = 5,
  CHANNEL_6 = 6,
  CHANNEL_7 = 7,
  CHANNEL_8 = 8,
  CHANNEL_9 = 9,
  CHANNEL_10 = 10,
  CHANNEL_11 = 11,
  CHANNEL_12 = 12,
  CHANNEL_13 = 13,
}

/**
 * WiFi security mode
 */
export enum WifiAuthMode {
  OPEN = 'OPEN',
  SHARED = 'SHARED',
  WPA_PSK = 'WPA-PSK',
  WPA2_PSK = 'WPA2-PSK',
  WPA_WPA2_PSK = 'WPA/WPA2-PSK',
  WPA_ENTERPRISE = 'WPA',
  WPA2_ENTERPRISE = 'WPA2',
}

/**
 * WiFi encryption mode
 */
export enum WifiEncryptionMode {
  NONE = 'NONE',
  WEP = 'WEP',
  TKIP = 'TKIP',
  AES = 'AES',
  TKIP_AES = 'TKIPAES',
}

/**
 * WLAN basic settings
 */
export interface WlanBasicSettings {
  WifiEnable: WifiStatus;
  WifiSsid: string;
  WifiChannel: WifiChannel | number;
  WifiBroadcast: number;
  WifiMode: string;
  WifiRate: string;
  WifiTxPwrPcnt: number;
  WifiMaxAssoc: number;
  WifiHide: number;
  WifiCountry: string;
  WifiRestart: number;
  WifiAutoMode?: number;
  WifiFrgThrshld?: number;
  WifiRtsThrshld?: number;
  WifiBcnIntvl?: number;
  WifiDtmIntvl?: number;
  WifiWmmEnable?: number;
  WifiPreamble?: string;
  Wifiband?: WifiFrequency;
  Wifiworkmode?: string;
}

/**
 * WLAN security settings
 */
export interface WlanSecuritySettings {
  WifiAuthmode: WifiAuthMode;
  WifiBasicencryptionmodes: WifiEncryptionMode;
  WifiWpaencryptionmodes: WifiEncryptionMode;
  WifiWepKey1?: string;
  WifiWepKey2?: string;
  WifiWepKey3?: string;
  WifiWepKey4?: string;
  WifiWepKeyIndex?: number;
  WifiWpapsk: string;
  WifiWpaRekeyIntval?: number;
  WifiRadiusServer?: string;
  WifiRadiusPort?: number;
  WifiRadiusSecret?: string;
}

/**
 * Station (connected device) information
 */
export interface StationInfo {
  ID: string;
  MacAddress: string;
  IpAddress: string;
  HostName?: string;
  AssociatedTime: string;
  IsCurSta?: string;
}

/**
 * Station list
 */
export interface StationList {
  Stations?: {
    Station: StationInfo | StationInfo[];
  };
}

/**
 * WiFi feature switch
 */
export interface WifiFeatureSwitch {
  wifi24g_switch_enable: string;
  wifi5g_switch_enable: string;
  wifi_switch_enable: string;
}
