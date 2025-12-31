import { ApiGroup } from '../base/ApiGroup';
import {
  SmsListResponse,
  SmsCount,
  SmsConfig,
  SmsSendResponse,
  SmsDeleteResponse,
  SmsBoxType,
  SmsPriority,
  SmsSaveMode,
} from '../types/sms';
import { SetResponseType, GetResponseType } from '../types/common';

/**
 * SMS API module
 * Handles SMS operations: list, send, delete, configure
 */
export class Sms extends ApiGroup {
  /**
   * Get CBS news list
   */
  getCbsnewslist(): Promise<GetResponseType> {
    return this.get('sms/get-cbsnewslist');
  }

  /**
   * Get SMS count
   */
  smsCount(): Promise<SmsCount> {
    return this.get<SmsCount>('sms/sms-count');
  }

  /**
   * Get split info SMS
   */
  splitinfoSms(): Promise<GetResponseType> {
    return this.get('sms/splitinfo-sms');
  }

  /**
   * Get SMS feature switch
   */
  smsFeatureSwitch(): Promise<GetResponseType> {
    return this.get('sms/sms-feature-switch');
  }

  /**
   * Get SMS send status
   */
  sendStatus(): Promise<GetResponseType> {
    return this.get('sms/send-status');
  }

  /**
   * Get SMS list
   * @param page - Page index (1-based)
   * @param boxType - SMS box type (inbox, sent, etc.)
   * @param readCount - Number of messages per page
   * @param sortType - Sort type
   * @param ascending - Sort order (0=descending, 1=ascending)
   * @param unreadPreferred - Show unread first
   */
  getSmsList(
    page: number = 1,
    boxType: SmsBoxType = SmsBoxType.LOCAL_INBOX,
    readCount: number = 20,
    sortType: number = 0,
    ascending: number = 0,
    unreadPreferred: number = 0
  ): Promise<SmsListResponse> {
    return this.postSet<SmsListResponse>('sms/sms-list', {
      PageIndex: page,
      ReadCount: readCount,
      BoxType: boxType,
      SortType: sortType,
      Ascending: ascending,
      UnreadPreferred: unreadPreferred,
    });
  }

  /**
   * Delete SMS by ID
   * @param smsId - SMS index to delete
   */
  deleteSms(smsId: number): Promise<SmsDeleteResponse> {
    return this.postSet('sms/delete-sms', { Index: smsId });
  }

  /**
   * Backup SIM messages
   * @param fromDate - Start date
   * @param isMove - Move instead of copy
   */
  backupSim(fromDate: Date, isMove: boolean = false): Promise<SetResponseType> {
    return this.postSet('sms/backup-sim', {
      IsMove: isMove ? 1 : 0,
      Date: fromDate.toISOString().slice(0, 19).replace('T', ' '),
    });
  }

  /**
   * Mark SMS as read
   * @param smsId - SMS index
   */
  setRead(smsId: number): Promise<SetResponseType> {
    return this.postSet('sms/set-read', {
      Index: smsId,
    });
  }

  /**
   * Save SMS as draft
   * @param phoneNumbers - Recipient phone numbers
   * @param message - Message content
   * @param smsIndex - SMS index (-1 for new)
   * @param sca - Service center address
   * @param textMode - Text encoding mode (7-bit, UCS2)
   * @param fromDate - Date
   */
  saveSms(
    phoneNumbers: string[],
    message: string,
    smsIndex: number = -1,
    sca: string = '',
    textMode: number = 0,
    fromDate?: Date
  ): Promise<SetResponseType> {
    if (!fromDate) {
      fromDate = new Date();
    }

    return this.postSet('sms/save-sms', {
      Index: smsIndex,
      Phones: { Phone: phoneNumbers },
      Sca: sca,
      Content: message,
      Length: message.length,
      Reserved: textMode,
      Date: fromDate.toISOString().slice(0, 19).replace('T', ' '),
    });
  }

  /**
   * Send SMS
   * @param phoneNumbers - Recipient phone numbers
   * @param message - Message content
   * @param smsIndex - SMS index (-1 for new)
   * @param sca - Service center address
   * @param textMode - Text encoding mode
   * @param date - Date
   */
  sendSms(
    phoneNumbers: string[],
    message: string,
    smsIndex: number = -1,
    sca: string = '',
    textMode: number = 0,
    date?: Date
  ): Promise<SmsSendResponse> {
    if (!date) {
      date = new Date();
    }

    return this.postSet('sms/send-sms', {
      Index: smsIndex,
      Phones: { Phone: phoneNumbers },
      Sca: sca,
      Content: message,
      Length: message.length,
      Reserved: textMode,
      Date: date.toISOString().slice(0, 19).replace('T', ' '),
    });
  }

  /**
   * Cancel sending SMS
   */
  cancelSend(): Promise<SetResponseType> {
    return this.postSet('sms/cancel-send', {
      request: 1,
    });
  }

  /**
   * Get SMS configuration
   */
  config(): Promise<SmsConfig> {
    return this.get<SmsConfig>('sms/config');
  }

  /**
   * Set SMS configuration
   * @param sca - Service center address
   * @param saveMode - Save mode (local, SIM, etc.)
   * @param validity - Message validity period
   * @param useSReport - Use status report
   * @param sendType - Send type
   * @param priority - Message priority
   */
  setConfig(
    sca: string,
    saveMode: SmsSaveMode = SmsSaveMode.LOCAL,
    validity: number = 10752,
    useSReport: boolean = false,
    sendType: number = 0,
    priority: SmsPriority = SmsPriority.NORMAL
  ): Promise<SetResponseType> {
    return this.postSet('sms/config', {
      SaveMode: saveMode,
      Validity: validity,
      Sca: sca,
      UseSReport: useSReport,
      SendType: sendType,
      Priority: priority,
    });
  }

  /**
   * Get SMS count by contact
   */
  smsCountContact(): Promise<GetResponseType> {
    return this.get('sms/sms-count-contact');
  }

  /**
   * Get SMS list in PDU mode
   * Endpoint found by reverse engineering, unknown usage
   */
  getSmsListPdu(): Promise<GetResponseType> {
    return this.get('sms/sms-list-pdu');
  }

  /**
   * Split SMS
   * Endpoint found by reverse engineering
   */
  splitSms(): Promise<GetResponseType> {
    return this.get('sms/split-sms');
  }

  /**
   * Send SMS in PDU mode
   * Endpoint found by reverse engineering
   */
  sendSmsPdu(): Promise<GetResponseType> {
    return this.get('sms/send-sms-pdu');
  }

  /**
   * Recover deleted SMS
   * Endpoint found by reverse engineering
   */
  recoverSms(): Promise<GetResponseType> {
    return this.get('sms/recover-sms');
  }

  /**
   * Copy SMS
   * Endpoint found by reverse engineering
   */
  copySms(): Promise<GetResponseType> {
    return this.get('sms/copy-sms');
  }

  /**
   * Move SMS
   * Endpoint found by reverse engineering
   */
  moveSms(): Promise<GetResponseType> {
    return this.get('sms/move-sms');
  }

  /**
   * Get phone storage status
   */
  phoneStorageStatus(): Promise<GetResponseType> {
    return this.get('sms/sms-phone-storage-status');
  }
}


