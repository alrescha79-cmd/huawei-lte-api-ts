# API Reference

## Client

### createClient(config)

Creates and initializes a Huawei LTE client with automatic login.

**Parameters:**
- `config.url` (string) - Modem URL (can include credentials: `http://admin:password@192.168.8.1/`)
- `config.username` (string, optional) - Username (default: 'admin')
- `config.password` (string, optional) - Password (default: 'admin')
- `config.timeout` (number, optional) - Request timeout in milliseconds (default: 30000)
- `config.autoLogin` (boolean, optional) - Auto-login on creation (default: true)

**Returns:** `Promise<HuaweiLTEClient>`

**Example:**
```typescript
const client = await createClient({
  url: 'http://192.168.8.1',
  username: 'admin',
  password: 'yourpassword'
});
```

### HuaweiLTEClient

Main client class for interacting with the modem.

**Constructor:**
```typescript
new HuaweiLTEClient(config: ClientConfig)
```

**Methods:**
- `login(): Promise<void>` - Login to modem
- `logout(): Promise<void>` - Logout from modem

**Properties:**
- `device` - Device information API
- `sms` - SMS management API
- `monitoring` - Network monitoring API
- `dialup` - Mobile data control API
- `user` - User management API
- `wlan` - WiFi management API

---

## Device API

### device.information()

Get detailed device information.

**Returns:** `Promise<DeviceInformation>`

**Response fields:**
- `DeviceName` - Device model name
- `SerialNumber` - Device serial number
- `Imei` - IMEI number
- `Imsi` - IMSI number
- `Iccid` - SIM card ICCID
- `Msisdn` - Phone number
- `HardwareVersion` - Hardware version
- `SoftwareVersion` - Software version
- `WebUIVersion` - Web UI version
- `MacAddress1` - Primary MAC address
- `WanIPAddress` - WAN IP address
- `ProductFamily` - Product family (LTE, 5G, etc.)
- `workmode` - Current network mode

### device.signal()

Get signal strength information.

**Returns:** `Promise<SignalInfo>`

---

## SMS API

### sms.smsCount()

Get SMS message count by box type.

**Returns:** `Promise<SmsCount>`

**Response fields:**
- `LocalUnread` - Unread messages in local inbox
- `LocalInbox` - Total messages in local inbox
- `LocalOutbox` - Messages in outbox
- `LocalDraft` - Draft messages

### sms.smsList(options)

List SMS messages with pagination.

**Parameters:**
- `options.page` (number) - Page number (default: 1)
- `options.boxType` (BoxType) - Message box type (default: LOCAL_INBOX)
- `options.readCount` (number) - Messages per page (default: 20)
- `options.sortType` (SortType) - Sort by date or name
- `options.ascending` (boolean) - Sort order
- `options.unreadPreferred` (boolean) - Show unread first

**Returns:** `Promise<SmsList>`

**BoxType enum:**
- `LOCAL_INBOX = 1` - Inbox
- `LOCAL_SENT = 2` - Sent messages
- `LOCAL_DRAFT = 3` - Drafts
- `LOCAL_TRASH = 4` - Trash

### sms.sendSms(options)

Send SMS message.

**Parameters:**
- `options.phoneNumbers` (string[]) - Recipient phone numbers
- `options.message` (string) - Message text
- `options.index` (number, optional) - Message index for draft
- `options.date` (Date, optional) - Send date

**Returns:** `Promise<string>` - "OK" on success

### sms.deleteSms(index)

Delete SMS message by index.

**Parameters:**
- `index` (number) - Message index

**Returns:** `Promise<string>`

---

## Monitoring API

### monitoring.status()

Get current network status.

**Returns:** `Promise<MonitoringStatus>`

**Response fields:**
- `ConnectionStatus` - Connection state (901=disconnected, 902=connecting, 903=connected)
- `SignalIcon` - Signal strength (0-5 bars)
- `CurrentNetworkType` - Network type (LTE, WCDMA, GSM, etc.)
- `CurrentServiceDomain` - Service domain
- `RoamingStatus` - Roaming state
- `BatteryStatus` - Battery level
- `WanIPAddress` - Current IP address
- `PrimaryDns` - Primary DNS server
- `SecondaryDns` - Secondary DNS server

### monitoring.trafficStatistics()

Get network traffic statistics.

**Returns:** `Promise<TrafficStats>`

**Response fields:**
- `CurrentConnectTime` - Current session duration (seconds)
- `CurrentUpload` - Uploaded bytes in current session
- `CurrentDownload` - Downloaded bytes in current session
- `TotalUpload` - Total uploaded bytes
- `TotalDownload` - Total downloaded bytes
- `TotalConnectTime` - Total connection time

### monitoring.checkNotifications()

Check for system notifications.

**Returns:** `Promise<Notifications>`

---

## DialUp API

### dialup.mobileDataswitch()

Get mobile data switch status.

**Returns:** `Promise<MobileDataSwitch>`

**Response fields:**
- `dataswitch` - Switch state (0=off, 1=on)

### dialup.setMobileDataswitch(enabled)

Enable or disable mobile data.

**Parameters:**
- `enabled` (0 | 1) - 0 to disable, 1 to enable

**Returns:** `Promise<string>` - "OK" on success

---

## WLan API

### wlan.basicSettings()

Get WiFi basic settings.

**Returns:** `Promise<WlanSettings>`

### wlan.setSecuritySettings(options)

Change WiFi security settings.

**Parameters:**
- `options.wpaPreSharedKey` (string) - WiFi password
- `options.authMode` (AuthMode) - Authentication mode
- `options.wpaEncryptionMode` (WpaEncryptMode) - Encryption mode

**AuthMode enum:**
- `OPEN = 'OPEN'`
- `WPA_PSK = 'WPA-PSK'`
- `WPA2_PSK = 'WPA2-PSK'`
- `WPA_WPA2_PSK = 'WPA/WPA2-PSK'`

**WpaEncryptMode enum:**
- `TKIP = 'TKIP'`
- `AES = 'AES'`
- `TKIP_AES = 'TKIPAES'`

**Returns:** `Promise<string>`

### wlan.hostList()

Get list of connected WiFi devices.

**Returns:** `Promise<HostList>`

### wlan.wifiFeatureSwitch()

Get WiFi feature switch status.

**Returns:** `Promise<WifiFeatureSwitch>`

---

## User API

### user.stateLogin()

Get current login state.

**Returns:** `Promise<LoginState>`

**Response fields:**
- `State` - Login state (-1=logged out, 0=logged in)
- `password_type` - Password encoding type (0=BASE64, 4=SHA256)
- `username` - Current username
- `lockstatus` - Account lock status

### user.changePassword(options)

Change user password.

**Parameters:**
- `options.currentPassword` (string) - Current password
- `options.newPassword` (string) - New password

**Returns:** `Promise<string>`

---

## Error Handling

All API methods may throw the following exceptions:

### ResponseErrorException

Base exception for all API errors.

**Properties:**
- `message` (string) - Error message
- `code` (number) - Error code

### Common Error Types

- `ResponseErrorNotSupportedException` - Feature not supported
- `ResponseErrorLoginRequiredException` - Login required
- `ResponseErrorSystemBusyException` - System busy
- `ResponseErrorLoginCsrfException` - CSRF token error
- `ResponseErrorWrongSessionToken` - Invalid session
- `LoginErrorInvalidCredentialsException` - Invalid username/password
- `LoginErrorUsernameWrongException` - Wrong username
- `LoginErrorPasswordWrongException` - Wrong password
- `LoginErrorAlreadyLoginException` - Already logged in
- `LoginErrorUsernamePasswordOverrunException` - Too many login attempts

**Example:**
```typescript
import { ResponseErrorLoginRequiredException } from 'huawei-lte-api';

try {
  const info = await client.device.information();
} catch (error) {
  if (error instanceof ResponseErrorLoginRequiredException) {
    await client.login();
    // Retry
    const info = await client.device.information();
  }
}
```

---

## Types

### ClientConfig

```typescript
interface ClientConfig {
  url: string;
  username?: string;
  password?: string;
  timeout?: number;
  autoLogin?: boolean;
}
```

### DeviceInformation

```typescript
interface DeviceInformation {
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
  WanIPAddress: string;
  // ... more fields
}
```

### SmsMessage

```typescript
interface SmsMessage {
  Smstat: number;
  Index: number;
  Phone: string;
  Content: string;
  Date: string;
  // ... more fields
}
```

### MonitoringStatus

```typescript
interface MonitoringStatus {
  ConnectionStatus: number;
  SignalIcon: number;
  CurrentNetworkType: string;
  CurrentServiceDomain: number;
  RoamingStatus: number;
  // ... more fields
}
```

---

## Enums

### BoxType

SMS box types:
- `LOCAL_INBOX = 1`
- `LOCAL_SENT = 2`
- `LOCAL_DRAFT = 3`
- `LOCAL_TRASH = 4`

### TextMode

SMS text encoding:
- `GSM7 = 0` - GSM 7-bit
- `UCS2 = 1` - Unicode UCS-2

### AuthMode

WiFi authentication modes:
- `OPEN = 'OPEN'`
- `WPA_PSK = 'WPA-PSK'`
- `WPA2_PSK = 'WPA2-PSK'`
- `WPA_WPA2_PSK = 'WPA/WPA2-PSK'`

### WpaEncryptMode

WPA encryption modes:
- `TKIP = 'TKIP'`
- `AES = 'AES'`
- `TKIP_AES = 'TKIPAES'`

---

For more examples, see the [examples](../examples) directory.
