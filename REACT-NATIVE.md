# React Native / Expo Support

This library fully supports React Native and Expo with automatic environment detection.

## Quick Start

### 1. Install the Library

```bash
npm install @alrescha79/huawei-lte-api
```

### 2. Install Required Dependencies

```bash
# XML parser for React Native
npm install fast-xml-parser

# Crypto library (already included in @alrescha79/huawei-lte-api)
# @noble/hashes is automatically used in React Native
```

### 3. That's it!

No additional setup needed. The library automatically detects React Native environment and uses:
- **@noble/hashes** for SHA256 (pure JavaScript, works everywhere)
- **fast-xml-parser** for XML parsing (no Node.js dependencies)

### 4. Start Developing

```typescript
import { createClient } from '@alrescha79/huawei-lte-api';

const client = await createClient({
  url: 'http://192.168.8.1',
  username: 'admin',
  password: 'yourpassword',
});

const device = await client.device.information();
console.log('Device:', device.DeviceName);
```
npx expo run:android
# or
npx expo run:ios

# For bare React Native
cd android && ./gradlew clean
cd .. && npx react-native run-android
```

## How It Works

The library automatically detects the runtime environment and uses appropriate implementations:

**Node.js Environment:**
- `crypto` module for SHA256 hashing
- `xml2js` for XML parsing
- Full RSA encryption support

**React Native Environment:**
- `@noble/hashes` for SHA256 hashing (pure JavaScript)
- `fast-xml-parser` for XML parsing (no Node.js deps)
- RSA encryption disabled (most modems use SHA256 auth anyway)

Detection is automatic - no configuration needed!

## Complete Example

See [react-native-expo-auth.tsx](./examples/react-native-expo-auth.tsx) for a full working example with authentication, storage, and UI.

## Important Notes

### SHA256 Authentication (Recommended)

Most modern Huawei modems use SHA256 authentication (password_type=4), which is **fully supported** in React Native:

```typescript
const client = await createClient({
  url: 'http://192.168.8.1',
  username: 'admin',
  password: 'yourpassword', // Will use SHA256 automatically
});
```

### RSA Authentication (Not Supported in React Native)

RSA authentication is rarely used and requires Node.js crypto module. If your modem requires RSA auth, you'll get a clear error message. Solution: Use SHA256 auth instead (password_type=4).

## Troubleshooting

### Error: Cannot find module 'fast-xml-parser'

Install the XML parser:

```bash
npm install fast-xml-parser
```

### Error: Cannot find module '@noble/hashes'

This should be auto-installed with the library. If not:

```bash
npm install @noble/hashes
```

### Metro bundler issues

Clear cache and restart:

```bash
npx expo start --clear
```

### Still getting Node.js module errors?

Make sure you have the latest version of the library and all dependencies are installed.
```bash
npm install react-native-quick-crypto
cd ios && pod install
```

2. Update `metro.config.js`:
```javascript
module.exports = {
  resolver: {
    extraNodeModules: {
      crypto: require.resolve('react-native-quick-crypto'),
    },
  },
};
```

3. Import polyfill in `index.js`:
```javascript
import 'react-native-quick-crypto';
```

## Supported Features

All features work in React Native:
- ✅ Device information
- ✅ Network monitoring
- ✅ WiFi management
- ✅ Mobile data control
- ✅ SMS operations (on supported devices)
- ✅ SHA256 authentication
- ✅ RSA encryption

## Performance

The crypto polyfill uses native modules for optimal performance:
- SHA256 hashing: ~1ms
- RSA encryption: ~10-50ms (depending on device)
- Authentication: ~100-200ms total

## License

Same as main library (Apache 2.0)
