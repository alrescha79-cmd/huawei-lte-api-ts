/**
 * Device related types
 * Based on Python implementation responses
 */

/**
 * Device basic information
 */
export interface DeviceBasicInfo {
  productfamily?: string;
  classify?: string;
  multimode?: string;
  restore_default_status?: string;
  sim_save_pin_enable?: string;
  devicename?: string;
  DeviceName?: string;
  SerialNumber?: string;
  Imei?: string;
  Imsi?: string;
  Iccid?: string;
  Msisdn?: string;
  HardwareVersion?: string;
  SoftwareVersion?: string;
  WebUIVersion?: string;
  MacAddress1?: string;
  MacAddress2?: string;
  ProductFamily?: string;
  Classify?: string;
  supportmode?: string;
  workmode?: string;
}

/**
 * Device information detailed
 */
export interface DeviceInfo {
  DeviceName: string;
  SerialNumber: string;
  Imei: string;
  Imsi: string;
  Iccid: string;
  Msisdn: string;
  HardwareVersion: string;
  SoftwareVersion: string;
  WebUIVersion: string;
  MacAddress1: string;
  MacAddress2?: string;
  WanIPAddress?: string;
  wan_dns_address?: string;
  WanIPv6Address?: string;
  wan_ipv6_dns_address?: string;
  ProductFamily: string;
  Classify: string;
  supportmode?: string;
  workmode: string;
  submask?: string;
}

/**
 * Device signal information
 */
export interface DeviceSignal {
  pci?: string;
  sc?: string;
  cell_id?: string;
  rsrq?: string;
  rsrp?: string;
  rssi?: string;
  sinr?: string;
  rscp?: string;
  ecio?: string;
  mode?: string;
  ulbandwidth?: string;
  dlbandwidth?: string;
  txpower?: string;
  tdd?: string;
  ul_mcs?: string;
  dl_mcs?: string;
  earfcn?: string;
  rrc_status?: string;
  rac?: string;
  lac?: string;
  band?: string;
  channel?: string;
  transmode?: string;
}

/**
 * Device control response
 */
export interface DeviceControlResponse {
  response: string;
}

/**
 * Device reboot response
 */
export type DeviceRebootResponse = string;

/**
 * Device factory reset response
 */
export type DeviceFactoryResetResponse = string;
