# React Native Expo - Huawei LTE Authentication Example

Complete example of integrating Huawei LTE API with React Native Expo, including secure credential storage and persistent login.

## Features

✅ **Secure Storage** - Credentials stored with AsyncStorage  
✅ **Auto-Login** - Persistent session across app restarts  
✅ **Real-time Updates** - Auto-refresh device info every 30 seconds  
✅ **Type-Safe** - Full TypeScript support  
✅ **Context API** - Global authentication state management  
✅ **Error Handling** - User-friendly error messages  

## Installation

```bash
# Install required packages
npm install @alrescha79/huawei-lte-api
npm install @react-native-async-storage/async-storage
```

## File Structure

```
src/
  components/
    LoginScreen.tsx          # Login form
    DashboardScreen.tsx      # Device dashboard
  hooks/
    useHuaweiAuth.tsx        # Authentication hook
  contexts/
    HuaweiAuthProvider.tsx   # Auth context provider
  App.tsx                    # Main app component
```

## Quick Start

### Option 1: Use Complete Example (All-in-One)

Copy `react-native-expo-auth.tsx` to your project and use directly:

```tsx
import App from './react-native-expo-auth';

export default App;
```

### Option 2: Split into Separate Files

#### 1. Create Auth Context (`contexts/HuaweiAuthProvider.tsx`)

```tsx
import React, { useState, useEffect, createContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HuaweiLTEClient } from '@alrescha79/huawei-lte-api';

interface AuthContextType {
  client: HuaweiLTEClient | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const HuaweiAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // ... (copy from react-native-expo-auth.tsx)
};
```

#### 2. Create Login Screen (`components/LoginScreen.tsx`)

```tsx
import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import { useHuaweiAuth } from '../hooks/useHuaweiAuth';

export const LoginScreen: React.FC = () => {
  const { login } = useHuaweiAuth();
  const [url, setUrl] = useState('http://192.168.8.1');
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    await login({ url, username, password });
  };

  return (
    <View>
      <TextInput value={url} onChangeText={setUrl} />
      <TextInput value={username} onChangeText={setUsername} />
      <TextInput value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};
```

#### 3. Main App (`App.tsx`)

```tsx
import React from 'react';
import { HuaweiAuthProvider, useHuaweiAuth } from './contexts/HuaweiAuthProvider';
import { LoginScreen } from './components/LoginScreen';
import { DashboardScreen } from './components/DashboardScreen';

const MainApp = () => {
  const { isAuthenticated } = useHuaweiAuth();
  return isAuthenticated ? <DashboardScreen /> : <LoginScreen />;
};

export default function App() {
  return (
    <HuaweiAuthProvider>
      <MainApp />
    </HuaweiAuthProvider>
  );
}
```

## Usage Examples

### Basic Authentication

```tsx
import { useHuaweiAuth } from './hooks/useHuaweiAuth';

function MyComponent() {
  const { login, logout, isAuthenticated } = useHuaweiAuth();

  const handleLogin = async () => {
    try {
      await login({
        url: 'http://192.168.8.1',
        username: 'admin',
        password: 'yourpassword',
      });
      console.log('Login successful!');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <View>
      {isAuthenticated ? (
        <Button title="Logout" onPress={logout} />
      ) : (
        <Button title="Login" onPress={handleLogin} />
      )}
    </View>
  );
}
```

### Access Client for API Calls

```tsx
import { useHuaweiAuth } from './hooks/useHuaweiAuth';

function DataUsageComponent() {
  const { client } = useHuaweiAuth();
  const [traffic, setTraffic] = useState(null);

  useEffect(() => {
    if (client) {
      loadTraffic();
    }
  }, [client]);

  const loadTraffic = async () => {
    const data = await client.monitoring.trafficStatistics();
    setTraffic(data);
  };

  return (
    <View>
      <Text>Download: {traffic?.CurrentDownload} bytes</Text>
      <Text>Upload: {traffic?.CurrentUpload} bytes</Text>
    </View>
  );
}
```

### Manual Refresh

```tsx
import { useHuaweiAuth } from './hooks/useHuaweiAuth';

function RefreshButton() {
  const { client } = useHuaweiAuth();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const info = await client.device.information();
      console.log('Device:', info.DeviceName);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <Button 
      title="Refresh" 
      onPress={handleRefresh} 
      disabled={refreshing}
    />
  );
}
```

## API Reference

### useHuaweiAuth Hook

```typescript
interface AuthContextType {
  client: HuaweiLTEClient | null;        // Authenticated client instance
  isAuthenticated: boolean;               // Login status
  isLoading: boolean;                     // Loading state
  login: (credentials) => Promise<void>;  // Login function
  logout: () => Promise<void>;            // Logout function
  deviceInfo: DeviceInformation | null;   // Cached device info
  networkStatus: MonitoringStatus | null; // Cached network status
}
```

### Login Credentials

```typescript
interface LoginCredentials {
  url: string;      // Modem URL (e.g., 'http://192.168.8.1')
  username: string; // Admin username (usually 'admin')
  password: string; // Admin password
}
```

## Storage Keys

Credentials are stored in AsyncStorage with these keys:

- `@huawei_lte_url` - Modem URL
- `@huawei_lte_username` - Username
- `@huawei_lte_password` - Password
- `@huawei_lte_remember` - Remember me flag

## Security Considerations

### ⚠️ Password Storage

This example stores passwords in AsyncStorage for convenience. For production apps:

1. **Use Secure Storage**
   ```bash
   npm install expo-secure-store
   ```

2. **Replace AsyncStorage with SecureStore**
   ```tsx
   import * as SecureStore from 'expo-secure-store';
   
   // Instead of AsyncStorage.setItem
   await SecureStore.setItemAsync(key, value);
   
   // Instead of AsyncStorage.getItem
   const value = await SecureStore.getItemAsync(key);
   ```

3. **Encrypt Sensitive Data**
   - Use device keychain/keystore
   - Consider biometric authentication
   - Implement token-based auth if possible

### 🔒 Best Practices

- Don't store passwords in plain text for production
- Use HTTPS if your modem supports it
- Implement session timeout
- Add biometric authentication for sensitive operations
- Clear credentials on app uninstall

## Features Explained

### Auto-Login

On app start, the provider checks AsyncStorage for saved credentials:

```tsx
useEffect(() => {
  loadSavedCredentials();
}, []);
```

If credentials exist and "Remember Me" is enabled, it automatically logs in.

### Auto-Refresh

Device info and network status refresh every 30 seconds:

```tsx
useEffect(() => {
  const interval = setInterval(async () => {
    const [device, status] = await Promise.all([
      client.device.information(),
      client.monitoring.status(),
    ]);
    setDeviceInfo(device);
    setNetworkStatus(status);
  }, 30000);
  
  return () => clearInterval(interval);
}, [isAuthenticated, client]);
```

### Error Handling

All API calls are wrapped in try-catch with user-friendly alerts:

```tsx
try {
  await login(credentials);
} catch (error: any) {
  Alert.alert('Login Failed', error.message);
}
```

## Customization

### Change Refresh Interval

Edit the interval in `HuaweiAuthProvider`:

```tsx
// Change 30000 (30 seconds) to your preferred interval
const interval = setInterval(async () => {
  // ...
}, 60000); // 60 seconds
```

### Add More Data

Extend the context to include additional API data:

```tsx
const [smsCount, setSmsCount] = useState(null);

// In auto-refresh interval
const count = await client.sms.smsCount();
setSmsCount(count);
```

### Custom Storage

Replace AsyncStorage with your preferred storage:

```tsx
// Custom storage implementation
const storage = {
  async setItem(key: string, value: string) {
    // Your implementation
  },
  async getItem(key: string) {
    // Your implementation
  },
  async removeItem(key: string) {
    // Your implementation
  },
};
```

## Troubleshooting

### Module not found: @alrescha79/huawei-lte-api

Install the package:
```bash
npm install @alrescha79/huawei-lte-api
```

### AsyncStorage is null

Install AsyncStorage:
```bash
npx expo install @react-native-async-storage/async-storage
```

### TypeScript errors

Ensure you have TypeScript configured:
```bash
npm install -D typescript @types/react @types/react-native
```

### Login fails with error 125003

- Check if modem URL is correct (usually `http://192.168.8.1`)
- Verify username/password
- Ensure you're connected to modem's WiFi/LAN

### App crashes on launch

- Check if all dependencies are installed
- Rebuild the app: `npx expo start --clear`
- Verify AsyncStorage is properly installed

## Testing

### Test Login

```tsx
// In your test file
import { renderHook, act } from '@testing-library/react-hooks';
import { useHuaweiAuth } from './useHuaweiAuth';

test('login updates authentication state', async () => {
  const { result } = renderHook(() => useHuaweiAuth());
  
  await act(async () => {
    await result.current.login({
      url: 'http://192.168.8.1',
      username: 'admin',
      password: 'test',
    });
  });
  
  expect(result.current.isAuthenticated).toBe(true);
});
```

## Advanced Usage

### Navigation Integration

Use with React Navigation:

```tsx
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function App() {
  const { isAuthenticated } = useHuaweiAuth();
  
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isAuthenticated ? (
          <>
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

### Redux Integration

```tsx
import { useDispatch } from 'react-redux';
import { setDeviceInfo } from './store/slices/deviceSlice';

function MyComponent() {
  const dispatch = useDispatch();
  const { client } = useHuaweiAuth();
  
  useEffect(() => {
    if (client) {
      client.device.information().then(info => {
        dispatch(setDeviceInfo(info));
      });
    }
  }, [client]);
}
```

## License

This example is part of @alrescha79/huawei-lte-api and follows the same Apache 2.0 license.

## Support

- 📝 [Main Documentation](../README.md)
- 🐛 [Report Issues](https://github.com/alrescha79-cmd/huawei-lte-api-ts/issues)
- 💬 [Discussions](https://github.com/alrescha79-cmd/huawei-lte-api-ts/discussions)
