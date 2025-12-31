# React Native / Expo Support

This library supports React Native and Expo with crypto polyfills.

## Quick Start

### 1. Install the Library

```bash
npm install @alrescha79/huawei-lte-api
```

### 2. Install Crypto Polyfill

```bash
npm install react-native-quick-crypto
npx expo install react-native-quick-crypto
```

### 3. Setup (Expo)

Add to your `app.json`:

```json
{
  "expo": {
    "plugins": [
      "react-native-quick-crypto"
    ]
  }
}
```

### 4. Import Polyfill (Required!)

At the **very top** of your entry file (`index.js` or `App.tsx`):

```typescript
// MUST be first import!
import 'react-native-quick-crypto';

// Your other imports
import { HuaweiAuthProvider } from './contexts/HuaweiAuthProvider';
```

### 5. Rebuild Your App

```bash
# For Expo
npx expo prebuild --clean
npx expo run:android
# or
npx expo run:ios

# For bare React Native
cd android && ./gradlew clean
cd .. && npx react-native run-android
```

## How It Works

The library automatically uses React Native-compatible crypto when running in React Native:

- **Node.js**: Uses native `crypto` module
- **React Native**: Uses `react-native-quick-crypto` via `crypto.native.js`
- **Automatic**: The correct version is selected by React Native's resolver

## Complete Example

See [react-native-expo-auth.tsx](./react-native-expo-auth.tsx) for a full working example.

## Troubleshooting

### Error: Cannot find module 'crypto'

You forgot to install `react-native-quick-crypto`:

```bash
npm install react-native-quick-crypto
npx expo install react-native-quick-crypto
```

### Error: Invalid hook call

Make sure you're importing the polyfill at the **very top** of your entry file:

```typescript
// index.js - FIRST LINE
import 'react-native-quick-crypto';
```

### Metro bundler issues

Clear cache and rebuild:

```bash
npx expo start --clear
```

### Android build fails

Make sure you ran `npx expo prebuild --clean` after installing the crypto polyfill.

## Alternative: Bare React Native

For bare React Native (no Expo):

1. Install dependencies:
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
