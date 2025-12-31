/**
 * Basic usage example for huawei-lte-api-ts
 * 
 * This example shows how to:
 * - Connect to the modem
 * - Login
 * - Get device information
 * - Get signal quality
 * - Get SMS count
 * - Logout
 */

import { createClient } from '../dist/cjs/index.js';

async function main() {
  // Create client
  const client = await createClient({
    url: process.env.HUAWEI_URL || 'http://192.168.8.1',
    username: process.env.HUAWEI_USERNAME || 'admin',
    password: process.env.HUAWEI_PASSWORD || 'admin',
  });

  console.log('🔌 Connecting to Huawei LTE modem...\n');

  try {
    // Login
    console.log('🔐 Logging in...');
    await client.login();
    console.log('✅ Login successful!\n');

    // Get device information
    console.log('📱 Device Information:');
    const deviceInfo = await client.device.information();
    console.log('  Device Name:', deviceInfo.DeviceName);
    console.log('  Serial Number:', deviceInfo.SerialNumber);
    console.log('  IMEI:', deviceInfo.Imei);
    console.log('  IMSI:', deviceInfo.Imsi);
    console.log('  Hardware Version:', deviceInfo.HardwareVersion);
    console.log('  Software Version:', deviceInfo.SoftwareVersion);
    console.log('  WebUI Version:', deviceInfo.WebUIVersion);
    console.log('  MAC Address:', deviceInfo.MacAddress1);
    console.log();

    // Get signal information
    console.log('📶 Signal Information:');
    const signal = await client.device.signal();
    console.log('  RSSI:', signal.rssi || 'N/A', 'dBm');
    console.log('  RSRP:', signal.rsrp || 'N/A', 'dBm');
    console.log('  RSRQ:', signal.rsrq || 'N/A', 'dB');
    console.log('  SINR:', signal.sinr || 'N/A', 'dB');
    console.log('  Mode:', signal.mode || 'N/A');
    console.log('  Band:', signal.band || 'N/A');
    console.log('  Cell ID:', signal.cell_id || 'N/A');
    console.log();

    // Get monitoring status
    console.log('🌐 Connection Status:');
    const status = await client.monitoring.status();
    console.log('  Connection Status:', status.ConnectionStatus);
    console.log('  Network Type:', status.CurrentNetworkType);
    console.log('  Roaming Status:', status.RoamingStatus === 1 ? 'Roaming' : 'Home');
    console.log('  SIM Status:', status.SimStatus);
    console.log('  Signal Icon:', status.SignalIcon);
    console.log();

    // Get traffic statistics
    console.log('📊 Traffic Statistics:');
    const traffic = await client.monitoring.trafficStatistics();
    console.log('  Current Download:', formatBytes(traffic.CurrentDownload));
    console.log('  Current Upload:', formatBytes(traffic.CurrentUpload));
    console.log('  Total Download:', formatBytes(traffic.TotalDownload));
    console.log('  Total Upload:', formatBytes(traffic.TotalUpload));
    console.log('  Download Rate:', formatSpeed(traffic.CurrentDownloadRate));
    console.log('  Upload Rate:', formatSpeed(traffic.CurrentUploadRate));
    console.log('  Connect Time:', formatDuration(traffic.CurrentConnectTime));
    console.log();

    // Get SMS count
    console.log('💬 SMS Status:');
    const smsCount = await client.sms.smsCount();
    console.log('  Local Inbox:', smsCount.LocalInbox);
    console.log('  Local Unread:', smsCount.LocalUnread);
    console.log('  Local Outbox:', smsCount.LocalOutbox);
    console.log('  Local Draft:', smsCount.LocalDraft);
    console.log('  SIM Inbox:', smsCount.SimInbox);
    console.log('  SIM Unread:', smsCount.SimUnread);
    console.log();

    // Check notifications
    console.log('🔔 Notifications:');
    const notifications = await client.monitoring.checkNotifications();
    console.log('  Unread Messages:', notifications.UnreadMessage);
    console.log('  SMS Storage Full:', notifications.SmsStorageFull === 1 ? 'Yes' : 'No');
    console.log();

    // Logout
    console.log('👋 Logging out...');
    await client.logout();
    console.log('✅ Logout successful!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Helper functions
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatSpeed(bytesPerSecond: number): string {
  return formatBytes(bytesPerSecond) + '/s';
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours}h ${minutes}m ${secs}s`;
}

// Run
main().catch(console.error);
