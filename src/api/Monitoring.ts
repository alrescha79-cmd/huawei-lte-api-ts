import { ApiGroup } from '../base/ApiGroup';
import {
  MonitoringStatus,
  CheckNotifications,
  MonitoringTrafficStats,
} from '../types/monitoring';
import { SetResponseType, GetResponseType } from '../types/common';

/**
 * Monitoring API module
 * Handles status monitoring, notifications, and traffic statistics
 */
export class Monitoring extends ApiGroup {
  /**
   * Get converged status (combines multiple status endpoints)
   */
  convergedStatus(): Promise<GetResponseType> {
    return this.get('monitoring/converged-status');
  }

  /**
   * Get monitoring status
   */
  status(): Promise<MonitoringStatus> {
    return this.get<MonitoringStatus>('monitoring/status');
  }

  /**
   * Check for notifications (unread SMS, storage full, etc.)
   */
  checkNotifications(): Promise<CheckNotifications> {
    return this.get<CheckNotifications>('monitoring/check-notifications');
  }

  /**
   * Get traffic statistics
   */
  trafficStatistics(): Promise<MonitoringTrafficStats> {
    return this.get<MonitoringTrafficStats>('monitoring/traffic-statistics');
  }

  /**
   * Get monitoring start date configuration
   */
  startDate(): Promise<GetResponseType> {
    return this.get('monitoring/start_date');
  }

  /**
   * Set network usage alarm for LTE
   * @param startDay - Day of month when monitoring starts (1-31)
   * @param dataLimit - Max data limit (e.g., "1000MB", "1GB")
   * @param monthThreshold - Alarm threshold percentage (0-100)
   */
  setStartDate(
    startDay: number,
    dataLimit: string,
    monthThreshold: number
  ): Promise<SetResponseType> {
    return this.postSet('monitoring/start_date', {
      StartDay: startDay,
      DataLimit: dataLimit,
      MonthThreshold: monthThreshold,
      SetMonthData: 1,
    });
  }

  /**
   * Get WLAN monitoring start date configuration
   */
  startDateWlan(): Promise<GetResponseType> {
    return this.get('monitoring/start_date_wlan');
  }

  /**
   * Set network usage alarm for WLAN
   * @param startDay - Day of month when monitoring starts
   * @param dataLimit - Max data limit
   * @param monthThreshold - Alarm threshold percentage
   */
  setStartDateWlan(
    startDay: number,
    dataLimit: string,
    monthThreshold: number
  ): Promise<SetResponseType> {
    return this.postSet('monitoring/start_date_wlan', {
      StartDay: startDay,
      DataLimit: dataLimit,
      MonthThreshold: monthThreshold,
      SettingEnable: 1,
    });
  }

  /**
   * Get monthly statistics (LTE)
   */
  monthStatistics(): Promise<GetResponseType> {
    return this.get('monitoring/month_statistics');
  }

  /**
   * Get monthly statistics (WLAN)
   */
  monthStatisticsWlan(): Promise<GetResponseType> {
    return this.get('monitoring/month_statistics_wlan');
  }

  /**
   * Clear traffic statistics
   */
  setClearTraffic(): Promise<SetResponseType> {
    return this.postSet('monitoring/clear-traffic', {
      ClearTraffic: 1,
    });
  }

  /**
   * Get WiFi month setting
   * Endpoint found by reverse engineering, possibly not fully implemented
   */
  wifiMonthSetting(): Promise<GetResponseType> {
    return this.get('monitoring/wifi-month-setting');
  }
}

    
