#!/usr/bin/env node

/**
 * Example: Control WiFi settings
 * 
 * Usage:
 *   node wifi-control.js http://admin:password@192.168.8.1/ status
 *   node wifi-control.js http://admin:password@192.168.8.1/ password newPassword123
 */

const { createClient } = require('../dist/cjs/index.js');

async function showStatus(client) {
  const settings = await client.wlan.basicSettings();
  
  console.log('\n📡 WiFi Status:');
  console.log('  SSID:', settings.WifiSsid || 'N/A');
  console.log('  Enabled:', settings.WifiEnable === 1 ? 'Yes' : 'No');
  console.log('  Hidden:', settings.WifiHide === 1 ? 'Yes' : 'No');
  console.log('  Channel:', settings.WifiChannel || 'Auto');
  console.log('  Max Clients:', settings.WifiMaxAssoc || 'N/A');
  
  try {
    const featureSwitch = await client.wlan.wifiFeatureSwitch();
    console.log('\n⚙️  Features:');
    console.log('  WiFi Offload:', featureSwitch.wifi_offload_flag === '1' ? 'Enabled' : 'Disabled');
  } catch (e) {
    // Feature switch not supported
  }
  
  try {
    const secSettings = await client.wlan.securitySettings();
    console.log('\n🔐 Security:');
    console.log('  Auth Mode:', secSettings.WifiAuthmode);
    console.log('  Encryption:', secSettings.WifiWpaencryptionmodes);
  } catch (e) {
    // Security settings not accessible (requires higher privileges)
  }
}

async function changePassword(client, newPassword) {
  if (!newPassword || newPassword.length < 8) {
    throw new Error('Password must be at least 8 characters');
  }
  
  console.log('🔐 Changing WiFi password...');
  
  const secSettings = await client.wlan.securitySettings();
  
  await client.wlan.setSecuritySettings({
    WifiWpapsk: newPassword,
    WifiAuthmode: secSettings.WifiAuthmode,
    WifiWpaencryptionmodes: secSettings.WifiWpaencryptionmodes
  });
  
  console.log('✅ WiFi password changed successfully!');
  console.log('⚠️  All connected devices will be disconnected.');
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.error('Usage:');
    console.error('  node wifi-control.js <url> status');
    console.error('  node wifi-control.js <url> password <new_password>');
    console.error('\nExample:');
    console.error('  node wifi-control.js http://admin:password@192.168.8.1/ status');
    console.error('  node wifi-control.js http://admin:password@192.168.8.1/ password MyNewPass123');
    process.exit(1);
  }

  const url = args[0];
  const command = args[1];

  try {
    console.log('🔌 Connecting to modem...');
    const client = await createClient({ url });

    switch (command.toLowerCase()) {
      case 'status':
        await showStatus(client);
        break;
      
      case 'password':
        if (args.length < 3) {
          throw new Error('Please provide new password');
        }
        await changePassword(client, args[2]);
        break;
      
      default:
        throw new Error(`Unknown command: ${command}`);
    }

    await client.logout();
    console.log('\n✅ Done!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
