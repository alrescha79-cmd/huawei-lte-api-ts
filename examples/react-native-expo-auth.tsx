/**
 * React Native Expo - Huawei LTE API Authentication Example
 * 
 * This example shows how to:
 * - Store login credentials securely using AsyncStorage
 * - Create a reusable authentication hook
 * - Handle login/logout with persistent session
 * - Display device information after authentication
 * 
 * Installation:
 * npm install @alrescha79/huawei-lte-api @react-native-async-storage/async-storage
 * 
 * Usage:
 * import { useHuaweiAuth } from './react-native-expo-auth';
 */

import React, { useState, useEffect, createContext, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HuaweiLTEClient, DeviceInformation, MonitoringStatus } from '@alrescha79/huawei-lte-api';

// ============================================================================
// Types
// ============================================================================

interface LoginCredentials {
  url: string;
  username: string;
  password: string;
}

interface AuthContextType {
  client: HuaweiLTEClient | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  deviceInfo: DeviceInformation | null;
  networkStatus: MonitoringStatus | null;
}

// ============================================================================
// Storage Keys
// ============================================================================

const STORAGE_KEYS = {
  URL: '@huawei_lte_url',
  USERNAME: '@huawei_lte_username',
  PASSWORD: '@huawei_lte_password',
  REMEMBER_ME: '@huawei_lte_remember',
};

// ============================================================================
// Auth Context
// ============================================================================

const AuthContext = createContext<AuthContextType | null>(null);

export const useHuaweiAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useHuaweiAuth must be used within HuaweiAuthProvider');
  }
  return context;
};

// ============================================================================
// Auth Provider
// ============================================================================

export const HuaweiAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [client, setClient] = useState<HuaweiLTEClient | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInformation | null>(null);
  const [networkStatus, setNetworkStatus] = useState<MonitoringStatus | null>(null);

  // Load saved credentials on mount
  useEffect(() => {
    loadSavedCredentials();
  }, []);

  // Auto-refresh device info every 30 seconds when authenticated
  useEffect(() => {
    if (!isAuthenticated || !client) return;

    const interval = setInterval(async () => {
      try {
        const [device, status] = await Promise.all([
          client.device.information(),
          client.monitoring.status(),
        ]);
        setDeviceInfo(device);
        setNetworkStatus(status);
      } catch (error) {
        console.error('Failed to refresh data:', error);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isAuthenticated, client]);

  const loadSavedCredentials = async () => {
    try {
      const rememberMe = await AsyncStorage.getItem(STORAGE_KEYS.REMEMBER_ME);
      
      if (rememberMe === 'true') {
        const [url, username, password] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.URL),
          AsyncStorage.getItem(STORAGE_KEYS.USERNAME),
          AsyncStorage.getItem(STORAGE_KEYS.PASSWORD),
        ]);

        if (url && username && password) {
          await login({ url, username, password }, false);
        }
      }
    } catch (error) {
      console.error('Failed to load saved credentials:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials, saveCredentials = true) => {
    setIsLoading(true);
    try {
      // Create client
      const newClient = new HuaweiLTEClient({
        url: credentials.url,
        username: credentials.username,
        password: credentials.password,
        autoLogin: false,
      });

      // Attempt login
      await newClient.login();

      // Get initial device info
      const [device, status] = await Promise.all([
        newClient.device.information(),
        newClient.monitoring.status(),
      ]);

      // Save credentials if requested
      if (saveCredentials) {
        await Promise.all([
          AsyncStorage.setItem(STORAGE_KEYS.URL, credentials.url),
          AsyncStorage.setItem(STORAGE_KEYS.USERNAME, credentials.username),
          AsyncStorage.setItem(STORAGE_KEYS.PASSWORD, credentials.password),
          AsyncStorage.setItem(STORAGE_KEYS.REMEMBER_ME, 'true'),
        ]);
      }

      setClient(newClient);
      setDeviceInfo(device);
      setNetworkStatus(status);
      setIsAuthenticated(true);
    } catch (error: any) {
      console.error('Login failed:', error);
      throw new Error(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (client) {
        await client.logout();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear credentials
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.URL),
        AsyncStorage.removeItem(STORAGE_KEYS.USERNAME),
        AsyncStorage.removeItem(STORAGE_KEYS.PASSWORD),
        AsyncStorage.removeItem(STORAGE_KEYS.REMEMBER_ME),
      ]);

      setClient(null);
      setDeviceInfo(null);
      setNetworkStatus(null);
      setIsAuthenticated(false);
    }
  };

  const value: AuthContextType = {
    client,
    isAuthenticated,
    isLoading,
    login,
    logout,
    deviceInfo,
    networkStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ============================================================================
// Login Screen Component
// ============================================================================

export const LoginScreen: React.FC = () => {
  const { login, isLoading } = useHuaweiAuth();
  const [url, setUrl] = useState('http://192.168.8.1');
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!password) {
      Alert.alert('Error', 'Please enter password');
      return;
    }

    try {
      await login({ url, username, password });
    } catch (error: any) {
      Alert.alert('Login Failed', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Huawei LTE Modem Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Modem URL"
        value={url}
        onChangeText={setUrl}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
      />

      {isLoading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <Button title="Login" onPress={handleLogin} />
      )}
    </View>
  );
};

// ============================================================================
// Dashboard Component
// ============================================================================

export const DashboardScreen: React.FC = () => {
  const { logout, deviceInfo, networkStatus, isLoading } = useHuaweiAuth();

  if (isLoading || !deviceInfo || !networkStatus) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modem Dashboard</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Device Information</Text>
        <Text style={styles.infoText}>Name: {deviceInfo.DeviceName}</Text>
        <Text style={styles.infoText}>IMEI: {deviceInfo.Imei}</Text>
        <Text style={styles.infoText}>Model: {deviceInfo.HardwareVersion}</Text>
        <Text style={styles.infoText}>Firmware: {deviceInfo.SoftwareVersion}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Network Status</Text>
        <Text style={styles.infoText}>
          Connection: {networkStatus.ConnectionStatus === '901' ? 'Connected' : 'Disconnected'}
        </Text>
        <Text style={styles.infoText}>Signal Strength: {networkStatus.SignalIcon}/5 bars</Text>
        <Text style={styles.infoText}>Network Type: {networkStatus.CurrentNetworkType}</Text>
        <Text style={styles.infoText}>Network Name: {networkStatus.CurrentServiceDomain}</Text>
      </View>

      <Button title="Logout" onPress={logout} color="#FF3B30" />
    </View>
  );
};

// ============================================================================
// Main App Component
// ============================================================================

export const HuaweiLTEApp: React.FC = () => {
  const { isAuthenticated, isLoading } = useHuaweiAuth();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return isAuthenticated ? <DashboardScreen /> : <LoginScreen />;
};

// ============================================================================
// Root Component with Provider
// ============================================================================

export default function App() {
  return (
    <HuaweiAuthProvider>
      <HuaweiLTEApp />
    </HuaweiAuthProvider>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  card: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 5,
    color: '#333',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
});
