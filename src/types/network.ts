/**
 * Network and signal related types
 */

/**
 * Network mode
 */
export enum NetworkMode {
  MODE_AUTO = '00',
  MODE_GSM_ONLY = '01',
  MODE_WCDMA_ONLY = '02',
  MODE_GSM_WCDMA = '03',
  MODE_LTE_ONLY = '0301',
  MODE_LTE_GSM = '0302',
  MODE_LTE_WCDMA = '0303',
  MODE_LTE_GSM_WCDMA = '0304',
}

/**
 * Network band
 */
export enum NetworkBand {
  GSM_850 = '1',
  GSM_900 = '2',
  GSM_1800 = '4',
  GSM_1900 = '8',
  WCDMA_850 = '400',
  WCDMA_900 = '800',
  WCDMA_1900 = '2000',
  WCDMA_2100 = '400000',
  LTE_BAND1 = '1',
  LTE_BAND3 = '4',
  LTE_BAND7 = '40',
  LTE_BAND8 = '80',
  LTE_BAND20 = '80000',
  LTE_BAND38 = '2000000000',
}

/**
 * Network status
 */
export interface NetworkStatus {
  State: number;
  FullName: string;
  ShortName: string;
  Numeric: number;
  Rat: number;
}

/**
 * Network provider
 */
export interface NetworkProvider {
  State: number;
  FullName: string;
  ShortName: string;
  Numeric: string;
  Rat: string;
}

/**
 * Network provider list
 */
export interface NetworkProviderList {
  Networks: {
    Network: NetworkProvider | NetworkProvider[];
  };
}

/**
 * Network mode selection
 */
export interface NetworkModeSelection {
  NetworkMode: string;
  NetworkBand: string;
  LTEBand: string;
}

/**
 * Cell info
 */
export interface CellInfo {
  cell_id: string;
  pci: string;
  rsrp: string;
  rsrq: string;
  rssi: string;
  sinr: string;
  band: string;
  earfcn: string;
}

/**
 * Traffic statistics
 */
export interface TrafficStats {
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

/**
 * Month statistics
 */
export interface MonthStats {
  CurrentMonthDownload: number;
  CurrentMonthUpload: number;
  MonthDuration: number;
  MonthLastClearTime: string;
}
