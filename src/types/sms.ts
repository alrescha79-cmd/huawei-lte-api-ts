/**
 * SMS related types
 */

/**
 * SMS box types
 */
export enum SmsBoxType {
  LOCAL_INBOX = 1,
  LOCAL_SENT = 2,
  LOCAL_DRAFT = 3,
  LOCAL_TRASH = 4,
  SIM_INBOX = 5,
  SIM_SENT = 6,
  SIM_DRAFT = 7,
  MIX_INBOX = 8,
  MIX_SENT = 9,
  MIX_DRAFT = 10,
}

/**
 * SMS priority
 */
export enum SmsPriority {
  NORMAL = 0,
  INTERACTIVE = 1,
  URGENT = 2,
  EMERGENCY = 3,
}

/**
 * SMS save mode
 */
export enum SmsSaveMode {
  LOCAL = 0,
  SIM = 1,
  LOCAL_PREFER = 2,
}

/**
 * SMS status
 */
export enum SmsStatus {
  UNREAD = 0,
  READ = 1,
  DRAFT = 2,
  SENT_NOT_RECEIVED = 3,
  SENT_RECEIVED = 4,
  SENT_FAILED = 5,
}

/**
 * Single SMS message
 */
export interface SmsMessage {
  Smstat: SmsStatus;
  Index: number;
  Phone: string;
  Content: string;
  Date: string;
  Sca?: string;
  SaveType?: string;
  Priority?: SmsPriority;
  SmsType?: number;
}

/**
 * SMS list response
 */
export interface SmsListResponse {
  Count: number;
  Messages?: {
    Message: SmsMessage | SmsMessage[];
  };
}

/**
 * SMS count
 */
export interface SmsCount {
  LocalUnread: number;
  LocalInbox: number;
  LocalOutbox: number;
  LocalDraft: number;
  LocalDeleted: number;
  SimUnread: number;
  SimInbox: number;
  SimOutbox: number;
  SimDraft: number;
  LocalMax: number;
  SimMax: number;
  SimUsed: number;
  NewMsg: number;
}

/**
 * SMS configuration
 */
export interface SmsConfig {
  sca?: string;
  validity?: string;
  cbsenable?: string;
  cdmaenable?: string;
}

/**
 * Send SMS request
 */
export interface SmsSendRequest {
  Index: number;
  Phones: {
    Phone: string | string[];
  };
  Sca?: string;
  Content: string;
  Length: number;
  Reserved: number;
  Date: string;
}

/**
 * Send SMS response
 */
export type SmsSendResponse = string;

/**
 * Delete SMS request
 */
export interface SmsDeleteRequest {
  Index: number | number[];
}

/**
 * Delete SMS response
 */
export type SmsDeleteResponse = string;

/**
 * SMS phone storage status
 */
export interface SmsPhoneStorageStatus {
  StorageType: string;
  TotalRecord: number;
  Used: number;
  Remain: number;
}
