/**
 * Monitoring related types
 */

/**
 * Connection status
 */
export enum ConnectionStatus {
  CONNECTING = 900,
  CONNECTED = 901,
  DISCONNECTED = 902,
  DISCONNECTING = 903,
}

/**
 * Monitoring status
 */
export interface MonitoringStatus {
  ConnectionStatus: ConnectionStatus;
  WifiConnectionStatus?: string;
  SignalStrength?: string;
  SignalIcon: string;
  CurrentNetworkType: number;
  CurrentServiceDomain: number;
  RoamingStatus: number;
  BatteryStatus?: string;
  BatteryLevel?: string;
  BatteryPercent?: string;
  simlockStatus: number;
  PrimaryDns?: string;
  SecondaryDns?: string;
  PrimaryIPv6Dns?: string;
  SecondaryIPv6Dns?: string;
  CurrentWifiUser?: number;
  TotalWifiUser?: number;
  currenttotalwifiuser?: number;
  ServiceStatus: number;
  SimStatus: number;
  WifiStatus?: number;
  CurrentNetworkTypeEx: number;
  maxsignal: number;
  wifiindooronly?: number;
  wififrequence?: number;
  classify?: string;
  flymode?: number;
  cellroam?: number;
}

/**
 * Check notifications
 */
export interface CheckNotifications {
  UnreadMessage: number;
  SmsStorageFull: number;
  OnlineUpdateStatus?: number;
}

/**
 * PLMN information
 */
export interface PlmnInfo {
  State: string;
  Numeric: string;
  ShortName: string;
  FullName: string;
  Rat: string;
}

/**
 * Monitoring traffic statistics
 */
export interface MonitoringTrafficStats {
  CurrentConnectTime: number;
  CurrentUpload: number;
  CurrentDownload: number;
  CurrentDownloadRate: number;
  CurrentUploadRate: number;
  TotalUpload: number;
  TotalDownload: number;
  TotalConnectTime: number;
  showtraffic: number;
}
