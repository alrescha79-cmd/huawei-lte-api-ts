import { ApiGroup } from '../base/ApiGroup';
import { AntennaTypeEnum } from '../enums/device';
import {
  DeviceInfo,
  DeviceBasicInfo,
  DeviceSignal,
  DeviceRebootResponse,
} from '../types/device';
import { GetResponseType, SetResponseType } from '../types/common';

/**
 * Device API module
 * Handles device information, control, and configuration
 */
export class Device extends ApiGroup {
  /**
   * Get device information
   */
  information(): Promise<DeviceInfo> {
    return this.get<DeviceInfo>('device/information');
  }

  /**
   * Get autorun version
   */
  autorunVersion(): Promise<GetResponseType> {
    return this.get('device/autorun-version');
  }

  /**
   * Get device feature switch settings
   */
  deviceFeatureSwitch(): Promise<GetResponseType> {
    return this.get('device/device-feature-switch');
  }

  /**
   * Get basic device information
   */
  basicInformation(): Promise<DeviceBasicInfo> {
    return this.get<DeviceBasicInfo>('device/basic_information');
  }

  /**
   * Get basic device information (alternative endpoint)
   */
  basicinformation(): Promise<DeviceBasicInfo> {
    return this.get<DeviceBasicInfo>('device/basicinformation');
  }

  /**
   * Get USB tethering switch status
   */
  usbTetheringSwitch(): Promise<GetResponseType> {
    return this.get('device/usb-tethering-switch');
  }

  /**
   * Get device boot time
   */
  bootTime(): Promise<GetResponseType> {
    return this.get('device/boot_time');
  }

  /**
   * Control device (generic)
   * @param control - Control code (1=reboot, 4=reset, etc.)
   */
  control(control: number): Promise<SetResponseType> {
    return this.postSet('device/control', {
      Control: control,
    });
  }

  /**
   * Reboot device
   */
  reboot(): Promise<DeviceRebootResponse> {
    return this.control(1);
  }

  /**
   * Reset device to factory settings
   */
  factoryReset(): Promise<SetResponseType> {
    return this.control(4);
  }

  /**
   * Get device signal information
   */
  signal(): Promise<DeviceSignal> {
    return this.get<DeviceSignal>('device/signal');
  }

  /**
   * Get antenna status
   */
  antennaStatus(): Promise<GetResponseType> {
    return this.get('device/antenna_status');
  }

  /**
   * Get antenna settings
   */
  getAntennaSettings(): Promise<GetResponseType> {
    return this.get('device/antenna_settings');
  }

  /**
   * Set antenna settings
   * @param antennaType - Antenna type (AUTO, EXTERNAL, INTERNAL)
   */
  setAntennaSettings(
    antennaType: AntennaTypeEnum = AntennaTypeEnum.AUTO
  ): Promise<SetResponseType> {
    return this.postSet('device/antenna_settings', {
      antenna_type: antennaType.toString(),
    });
  }

  /**
   * Get antenna type
   */
  antennaType(): Promise<GetResponseType> {
    return this.get('device/antenna_type');
  }

  /**
   * Get antenna set type
   */
  antennaSetType(): Promise<GetResponseType> {
    return this.get('device/antenna_set_type');
  }

  /**
   * Get log settings
   * Endpoint found by reverse engineering B310s-22 firmware
   */
  logsetting(): Promise<GetResponseType> {
    return this.get('device/logsetting');
  }
}



