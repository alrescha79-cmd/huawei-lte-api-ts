# @alrescha79/huawei-lte-api

Modern TypeScript library for Huawei LTE modems. Control your modem, send SMS, get network info, manage WiFi, and more.

[![npm version](https://badge.fury.io/js/%40alrescha79%2Fhuawei-lte-api.svg)](https://www.npmjs.com/package/@alrescha79/huawei-lte-api)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-Apache%202.0-green.svg)](LICENSE)

## Features

✅ **Full TypeScript support** with strict type checking  
✅ **Modern async/await API** - no callbacks  
✅ **Dual package support** - ESM and CommonJS  
✅ **React Native / Expo compatible** - works on mobile apps  
✅ **Comprehensive API coverage** - Device, SMS, Monitoring, WiFi, and more  
✅ **SHA256 authentication** - Secure login for modern firmware  
✅ **Zero dependencies** - Pure TypeScript implementation  

## Installation

### Node.js / Web

```bash
npm install @alrescha79/huawei-lte-api
```

### React Native / Expo

```bash
npm install @alrescha79/huawei-lte-api
npm install react-native-quick-crypto
npx expo install react-native-quick-crypto
```

**📱 [See React Native Setup Guide](./REACT-NATIVE.md)**

## Quick Start

```typescript
import { createClient } from '@alrescha79/huawei-lte-api';

// Create client (automatically handles login)
const client = await createClient({
  url: 'http://admin:password@192.168.8.1/',
});

// Get device information
const device = await client.device.information();
console.log('Device:', device.DeviceName);
console.log('IMEI:', device.Imei);

// Check signal strength
const signal = await client.monitoring.status();
console.log('Signal:', signal.SignalIcon, 'bars');

// Get network info
const traffic = await client.monitoring.trafficStatistics();
console.log('Downloaded:', traffic.CurrentDownload, 'bytes');

// Logout when done
await client.logout();
```

### Without Auto-Login

```typescript
import { HuaweiLTEClient } from '@alrescha79/huawei-lte-api';

const client = new HuaweiLTEClient({
  url: 'http://192.168.8.1',
  username: 'admin',
  password: 'yourpassword',
  autoLogin: false, // Don't login automatically
});

// Login manually when needed
await client.login();

// Use the client
const deviceInfo = await client.device.information();

// Logout
await client.logout();
```

## API Modules

### Device Information

```typescript
// Get device details
const info = await client.device.information();
// Returns: DeviceName, SerialNumber, Imei, SoftwareVersion, etc.

// Get signal strength
const signal = await client.device.signal();
```

### SMS Management

> **Note:** SMS functionality is only available on mobile hotspot models (e.g., E5577, E5186, B528). Router models (e.g., B310, B315, B525) typically do not support SMS.

```typescript
import { BoxType, ResponseErrorNotSupportedException } from '@alrescha79/huawei-lte-api';

try {
  // Get SMS count
  const count = await client.sms.smsCount();

  // List SMS messages
  const messages = await client.sms.smsList({
    page: 1,
    boxType: BoxType.LOCAL_INBOX,
    readCount: 20,
  });

  // Send SMS
  await client.sms.sendSms({
    phoneNumbers: ['+1234567890'],
    message: 'Hello from TypeScript!',
  });

  // Delete SMS
  await client.sms.deleteSms(messageId);
} catch (error) {
  if (error instanceof ResponseErrorNotSupportedException) {
    console.log('SMS not supported on this modem');
  }
}
```

### Network Monitoring

```typescript
// Get network status
const status = await client.monitoring.status();
console.log('Connected:', status.ConnectionStatus);
console.log('Network Type:', status.CurrentNetworkType);

// Get traffic statistics
const traffic = await client.monitoring.trafficStatistics();
console.log('Download:', traffic.CurrentDownload);
console.log('Upload:', traffic.CurrentUpload);

// Check notification
const notification = await client.monitoring.checkNotifications();
```

### Mobile Data Control

```typescript
// Connect to mobile network
await client.dialup.setMobileDataswitch(1);

// Disconnect
await client.dialup.setMobileDataswitch(0);

// Get connection status
const status = await client.dialup.mobileDataswitch();
```

### WiFi Management

```typescript
import { AuthMode, WpaEncryptMode } from '@alrescha79/huawei-lte-api';

// Get WiFi settings
const settings = await client.wlan.basicSettings();

// Change WiFi password
await client.wlan.setSecuritySettings({
  wpaPreSharedKey: 'newpassword123',
  authMode: AuthMode.WPA2_PSK,
  wpaEncryptionMode: WpaEncryptMode.AES,
});

// Get connected devices
const hosts = await client.wlan.hostList();
console.log('Connected devices:', hosts.Hosts.Host.length);
```

### User Management

```typescript
// Check login state
const state = await client.user.stateLogin();

// Change password
await client.user.changePassword({
  currentPassword: 'oldpass',
  newPassword: 'newpass',
});
```

## Supported Devices

### 3G/LTE Routers
- Huawei B310s, B315s, B525s, B535, B715s, B818, E5186s, E5576, E5577Cs
- **Huawei B312** ✅ Tested and confirmed working

### 3G/LTE USB Sticks
- Huawei E3131, E3372, E3531 (HiLink mode)

### 5G Routers
- Huawei 5G CPE Pro 2 (H122-373)

And many more Huawei LTE devices!

> **ℹ️ SMS Support:** Only mobile hotspot models (E5xxx, E5xxx) typically support SMS functionality. Router models (B3xx, B5xx) generally do NOT support SMS operations.

## Authentication

The library supports multiple authentication methods:

- **BASE64** (password_type=0) - Simple base64 encoding
- **SHA256** (password_type=4) - Secure hash-based authentication (recommended)

Authentication is handled automatically based on the modem's requirements.

## Error Handling

```typescript
import { 
  ResponseErrorLoginRequiredException,
  ResponseErrorSystemBusyException 
} from '@alrescha79/huawei-lte-api';

try {
  const data = await client.device.information();
} catch (error) {
  if (error instanceof ResponseErrorLoginRequiredException) {
    console.error('Need to login first');
    await client.login();
  } else if (error instanceof ResponseErrorSystemBusyException) {
    console.error('System busy, try again later');
  } else {
    console.error('Error:', error.message);
  }
}
```

## Examples

See the [examples](./examples) directory for complete working examples:

### TypeScript Examples
- `basic-usage.ts` - Basic device info and monitoring
- `sms-management.ts` - Send and receive SMS
- `mobile-connection.ts` - Control mobile data connection

### JavaScript Examples
- `device_info.js` - Get device information
- `connected-devices.js` - List WiFi connected devices
- `data-usage.js` - Monitor data usage and traffic statistics
- `network-status.js` - Network status and signal strength
- `wifi-settings.js` - Complete WiFi management (SSID, password, channel, etc.)
- `wifi-control.js` - WiFi status and basic controls
- `mobile-data-control.js` - Mobile data connection control
- `sms-operations.js` - SMS operations (list, send, delete)

### React Native / Expo Examples
- `react-native-expo-auth.tsx` - Complete authentication with secure storage
- See [REACT-NATIVE-EXPO.md](./examples/REACT-NATIVE-EXPO.md) for full documentation

## TypeScript Support

Full TypeScript definitions included:

```typescript
import type { 
  DeviceInformation,
  MonitoringStatus,
  SmsMessage,
  ClientConfig 
} from '@alrescha79/huawei-lte-api';
```

## Building from Source

```bash
# Install dependencies
npm install

# Build library
npm run build

# Run tests
npm test

# Lint code
npm run lint
```

## License

Apache 2.0 - See [LICENSE](LICENSE) for details

## Credits

This library is a modern TypeScript rewrite of the original [Python huawei-lte-api](https://github.com/Salamek/huawei-lte-api).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

- 📝 [Documentation](./docs)
- 🐛 [Issue Tracker](https://github.com/alrescha79-cmd/huawei-lte-api-ts/issues)
- 💬 [Discussions](https://github.com/alrescha79-cmd/huawei-lte-api-ts/discussions)
