/**
 * Mobile data connection example
 * 
 * Shows how to:
 * - Connect/disconnect mobile data
 * - Get connection status
 * - Manage APN profiles
 * - Monitor data usage
 */

import { createClient } from '../dist/cjs/index.js';

async function main() {
  const client = await createClient({
    url: process.env.HUAWEI_URL || 'http://192.168.8.1',
    username: process.env.HUAWEI_USERNAME || 'admin',
    password: process.env.HUAWEI_PASSWORD || '1sampek8',
  });

  console.log('🔐 Logging in...');
  await client.login();
  console.log('✅ Logged in!\n');

  try {
    // Get current connection status
    console.log('🌐 Connection Status:');
    const status = await client.monitoring.status();
    console.log('  Status:', getConnectionStatusText(status.ConnectionStatus));
    console.log('  Network Type:', status.CurrentNetworkType);
    console.log('  Roaming:', status.RoamingStatus === 1 ? 'Yes' : 'No');
    console.log();

    // Get mobile data switch status
    console.log('📶 Mobile Data Switch:');
    const dataSwitch = await client.dialup.mobileDataswitch();
    console.log('  Status:', dataSwitch.dataswitch === 1 ? 'Enabled' : 'Disabled');
    console.log();

    // Get connection settings
    console.log('⚙️  Connection Settings:');
    const connection = await client.dialup.dialupConnection();
    console.log('  Auto Connect (Roaming):', connection.RoamAutoConnectEnable);
    console.log('  Max Idle Time:', connection.MaxIdleTime);
    console.log('  Connect Mode:', connection.ConnectMode);
    console.log('  MTU:', connection.MTU);
    console.log();

    // Get APN profiles
    console.log('📋 APN Profiles:');
    const profileList = await client.dialup.profiles();
    if (profileList.Profiles) {
      const profiles = Array.isArray(profileList.Profiles.Profile)
        ? profileList.Profiles.Profile
        : [profileList.Profiles.Profile];

      profiles.forEach((profile, index) => {
        console.log(`\n  Profile ${index + 1}:`);
        console.log('    Name:', profile.Name);
        console.log('    APN:', profile.ApnName || 'N/A');
        console.log('    Username:', profile.Username || 'N/A');
        console.log('    Static:', profile.ApnIsStatic === 1 ? 'Yes' : 'No');
        console.log('    Read Only:', profile.ReadOnly === 1 ? 'Yes' : 'No');
      });
    }
    console.log();

    // Get traffic statistics
    console.log('📊 Data Usage:');
    const traffic = await client.monitoring.trafficStatistics();
    console.log('  Downloaded:', formatBytes(traffic.TotalDownload));
    console.log('  Uploaded:', formatBytes(traffic.TotalUpload));
    console.log('  Current Speed (Down):', formatSpeed(traffic.CurrentDownloadRate));
    console.log('  Current Speed (Up):', formatSpeed(traffic.CurrentUploadRate));
    console.log('  Connected Time:', formatDuration(traffic.TotalConnectTime));
    console.log();

    // Example: Connect mobile data (uncomment to use)
    /*
    console.log('🔌 Connecting mobile data...');
    await client.dialup.connect();
    console.log('✅ Mobile data connected!');
    */

    // Example: Disconnect mobile data (uncomment to use)
    /*
    console.log('🔌 Disconnecting mobile data...');
    await client.dialup.disconnect();
    console.log('✅ Mobile data disconnected!');
    */

    // Example: Enable mobile data switch (uncomment to use)
    /*
    console.log('📶 Enabling mobile data switch...');
    await client.dialup.setMobileDataswitch(true);
    console.log('✅ Mobile data enabled!');
    */
  } finally {
    console.log('\n👋 Logging out...');
    await client.logout();
    console.log('✅ Done!');
  }
}

// Helper functions
function getConnectionStatusText(status: number): string {
  const statusMap: Record<number, string> = {
    900: 'Connecting',
    901: 'Connected',
    902: 'Disconnected',
    903: 'Disconnecting',
  };
  return statusMap[status] || 'Unknown';
}

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

main().catch(console.error);
