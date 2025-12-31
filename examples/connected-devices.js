#!/usr/bin/env node

/**
 * Example: List all devices connected to WiFi
 * 
 * Usage:
 *   node connected-devices.js http://admin:password@192.168.8.1/
 *   node connected-devices.js http://192.168.8.1/ admin password
 */

const { createClient } = require('../dist/cjs/index.js');

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('Usage: node connected-devices.js <url> [username] [password]');
    console.error('Example: node connected-devices.js http://admin:password@192.168.8.1/');
    process.exit(1);
  }

  const url = args[0];
  const username = args[1] || 'admin';
  const password = args[2] || 'admin';

  try {
    console.log('🔌 Connecting to modem...');
    const client = await createClient({ url, username, password });

    console.log('📡 Getting WiFi settings...');
    const wifiSettings = await client.wlan.basicSettings();
    console.log('\nWiFi Information:');
    console.log('  SSID:', wifiSettings.WifiSsid || 'N/A');
    console.log('  Enabled:', wifiSettings.WifiEnable === 1 ? 'Yes' : 'No');
    console.log('  Channel:', wifiSettings.WifiChannel || 'Auto');
    console.log('  Hidden:', wifiSettings.WifiHide === 1 ? 'Yes' : 'No');
    console.log('  Max Clients:', wifiSettings.WifiMaxAssoc || 'N/A');

    console.log('\n👥 Getting connected devices...');
    const hostList = await client.wlan.hostList();
    
    if (!hostList.Hosts || !hostList.Hosts.Host) {
      console.log('\n✨ No devices connected');
      return;
    }

    const hosts = Array.isArray(hostList.Hosts.Host) 
      ? hostList.Hosts.Host 
      : [hostList.Hosts.Host];

    console.log(`\n📱 Found ${hosts.length} connected device(s):\n`);
    
    hosts.forEach((host, index) => {
      console.log(`Device ${index + 1}:`);
      console.log('  MAC Address:', host.MacAddress);
      console.log('  IP Address:', host.IpAddress);
      console.log('  Hostname:', host.HostName || 'Unknown');
      console.log('  Connected:', host.AssociatedTime ? `${Math.floor(host.AssociatedTime / 60)} minutes` : 'Unknown');
      console.log('');
    });

    await client.logout();
    console.log('✅ Done!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
