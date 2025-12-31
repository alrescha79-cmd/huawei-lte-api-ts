/**
 * WLAN (WiFi) API module
 * Based on Python implementation: huawei_lte_api/api/WLan.py
 */

import { ApiGroup } from '../base/ApiGroup';
import {
  WlanBasicSettings,
  WlanSecuritySettings,
  StationList,
  WifiFeatureSwitch,
  WifiStatus,
} from '../types/wlan';
import { SetResponseType, GetResponseType } from '../types/common';

export class WLan extends ApiGroup {
  /**
   * Get basic WLAN settings
   */
  basicSettings(): Promise<WlanBasicSettings> {
    return this.get<WlanBasicSettings>('wlan/basic-settings');
  }

  /**
   * Set basic WLAN settings
   */
  setBasicSettings(settings: Partial<WlanBasicSettings>): Promise<SetResponseType> {
    return this.postSet('wlan/basic-settings', settings);
  }

  /**
   * Get WLAN security settings
   */
  securitySettings(): Promise<WlanSecuritySettings> {
    return this.get<WlanSecuritySettings>('wlan/security-settings');
  }

  /**
   * Set WLAN security settings
   */
  setSecuritySettings(
    settings: Partial<WlanSecuritySettings>
  ): Promise<SetResponseType> {
    return this.postSet('wlan/security-settings', settings);
  }

  /**
   * Get list of connected WiFi stations (clients)
   */
  stationInformation(): Promise<StationList> {
    return this.get<StationList>('wlan/host-list');
  }

  /**
   * Get list of connected WiFi devices (alias for stationInformation)
   */
  hostList(): Promise<StationList> {
    return this.stationInformation();
  }

  /**
   * Get WiFi feature switch status
   */
  wifiFeatureSwitch(): Promise<WifiFeatureSwitch> {
    return this.get<WifiFeatureSwitch>('wlan/wifi-feature-switch');
  }

  /**
   * Enable WiFi
   */
  enableWifi(): Promise<SetResponseType> {
    return this.postSet('wlan/basic-settings', {
      WifiEnable: WifiStatus.ON,
    });
  }

  /**
   * Disable WiFi
   */
  disableWifi(): Promise<SetResponseType> {
    return this.postSet('wlan/basic-settings', {
      WifiEnable: WifiStatus.OFF,
    });
  }

  /**
   * Change WiFi SSID
   */
  changeSSID(ssid: string): Promise<SetResponseType> {
    return this.postSet('wlan/basic-settings', {
      WifiSsid: ssid,
    });
  }

  /**
   * Change WiFi password
   */
  changePassword(password: string): Promise<SetResponseType> {
    return this.postSet('wlan/security-settings', {
      WifiWpapsk: password,
    });
  }

  /**
   * Get multi-SSID settings
   */
  multiSsidSettings(): Promise<GetResponseType> {
    return this.get('wlan/multi-ssid-settings');
  }

  /**
   * Set multi-SSID settings
   */
  setMultiSsidSettings(settings: Record<string, unknown>): Promise<SetResponseType> {
    return this.postSet('wlan/multi-ssid-settings', settings);
  }

  /**
   * Get multi-switch settings
   */
  multiSwitch(): Promise<GetResponseType> {
    return this.get('wlan/multi-switch-settings');
  }

  /**
   * Set multi-switch settings
   */
  setMultiSwitch(settings: Record<string, unknown>): Promise<SetResponseType> {
    return this.postSet('wlan/multi-switch-settings', settings);
  }

  /**
   * Get WiFi status switch
   */
  statusSwitchSettings(): Promise<GetResponseType> {
    return this.get('wlan/status-switch-settings');
  }

  /**
   * Get handover setting
   */
  handover(): Promise<GetResponseType> {
    return this.get('wlan/handover-setting');
  }

  /**
   * Get WPS settings
   */
  wpsSettings(): Promise<GetResponseType> {
    return this.get('wlan/wps');
  }

  /**
   * Set WPS settings
   */
  setWpsSettings(settings: Record<string, unknown>): Promise<SetResponseType> {
    return this.postSet('wlan/wps', settings);
  }

  /**
   * Get WiFi country code
   */
  countryCode(): Promise<GetResponseType> {
    return this.get('wlan/country-code');
  }

  /**
   * Set WiFi country code
   */
  setCountryCode(countryCode: string): Promise<SetResponseType> {
    return this.postSet('wlan/country-code', {
      WifiCountry: countryCode,
    });
  }
}
