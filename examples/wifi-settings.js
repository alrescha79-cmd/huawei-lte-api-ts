#!/usr/bin/env node

/**
 * Example: Complete WiFi settings management
 * 
 * Usage:
 *   node wifi-settings.js http://admin:password@192.168.8.1/ show
 *   node wifi-settings.js http://admin:password@192.168.8.1/ ssid "NewSSID"
 *   node wifi-settings.js http://admin:password@192.168.8.1/ password "NewPassword123"
 *   node wifi-settings.js http://admin:password@192.168.8.1/ change "NewSSID" "NewPassword123"
 *   node wifi-settings.js http://admin:password@192.168.8.1/ hide on
 *   node wifi-settings.js http://admin:password@192.168.8.1/ channel 6
 */

const { createClient } = require('../dist/cjs/index.js');

async function showSettings(client) {
  const settings = await client.wlan.basicSettings();
  
  console.log('\n📡 WiFi Basic Settings:');
  console.log('  SSID:', settings.WifiSsid || 'N/A');
  console.log('  Enabled:', settings.WifiEnable === 1 ? '✅ Yes' : '❌ No');
  console.log('  Hidden:', settings.WifiHide === 1 ? 'Yes' : 'No');
  console.log('  Channel:', settings.WifiChannel === 0 ? 'Auto' : settings.WifiChannel);
  console.log('  Max Clients:', settings.WifiMaxAssoc || 'N/A');
  console.log('  Country:', settings.WifiCountry || 'N/A');
  
  try {
    const secSettings = await client.wlan.securitySettings();
    console.log('\n🔐 Security Settings:');
    console.log('  Auth Mode:', secSettings.WifiAuthmode);
    console.log('  Encryption:', secSettings.WifiWpaencryptionmodes);
    console.log('  Password:', '********' + (secSettings.WifiWpapsk ? ` (${secSettings.WifiWpapsk.length} chars)` : ''));
  } catch (e) {
    console.log('\n🔐 Security Settings: Not accessible (requires higher privileges)');
  }
  
  try {
    const hosts = await client.wlan.hostList();
    if (hosts.Hosts && hosts.Hosts.Host) {
      const deviceList = Array.isArray(hosts.Hosts.Host) ? hosts.Hosts.Host : [hosts.Hosts.Host];
      console.log('\n👥 Connected Devices:', deviceList.length);
      deviceList.forEach((host, index) => {
        console.log(`  ${index + 1}. ${host.HostName || 'Unknown'} (${host.MacAddress})`);
      });
    } else {
      console.log('\n👥 Connected Devices: 0');
    }
  } catch (e) {
    // Host list not available
  }
}

async function changeSSID(client, newSSID) {
  if (!newSSID || newSSID.length < 1 || newSSID.length > 32) {
    throw new Error('SSID must be between 1-32 characters');
  }
  
  console.log('📝 Changing WiFi SSID...');
  console.log('  New SSID:', newSSID);
  
  const currentSettings = await client.wlan.basicSettings();
  
  await client.wlan.setBasicSettings({
    ...currentSettings,
    WifiSsid: newSSID,
    WifiRestart: 1
  });
  
  console.log('✅ SSID changed successfully!');
  console.log('⚠️  WiFi will restart. You may need to reconnect.');
}

async function changePassword(client, newPassword) {
  if (!newPassword || newPassword.length < 8) {
    throw new Error('Password must be at least 8 characters');
  }
  
  console.log('🔐 Changing WiFi password...');
  console.log('  Password length:', newPassword.length, 'characters');
  
  const secSettings = await client.wlan.securitySettings();
  
  await client.wlan.setSecuritySettings({
    ...secSettings,
    WifiWpapsk: newPassword,
    WifiRestart: 1
  });
  
  console.log('✅ Password changed successfully!');
  console.log('⚠️  All connected devices will be disconnected.');
  console.log('   Reconnect using the new password.');
}

async function changeBoth(client, newSSID, newPassword) {
  if (!newSSID || newSSID.length < 1 || newSSID.length > 32) {
    throw new Error('SSID must be between 1-32 characters');
  }
  if (!newPassword || newPassword.length < 8) {
    throw new Error('Password must be at least 8 characters');
  }
  
  console.log('🔄 Changing WiFi SSID and password...');
  console.log('  New SSID:', newSSID);
  console.log('  New Password:', newPassword.length, 'characters');
  
  // Change SSID first
  const basicSettings = await client.wlan.basicSettings();
  await client.wlan.setBasicSettings({
    ...basicSettings,
    WifiSsid: newSSID,
    WifiRestart: 0 // Don't restart yet
  });
  
  console.log('  ✓ SSID updated');
  
  // Then change password
  const secSettings = await client.wlan.securitySettings();
  await client.wlan.setSecuritySettings({
    ...secSettings,
    WifiWpapsk: newPassword,
    WifiRestart: 1 // Restart after password change
  });
  
  console.log('  ✓ Password updated');
  console.log('✅ WiFi settings changed successfully!');
  console.log('⚠️  WiFi will restart. Reconnect with:');
  console.log(`   SSID: ${newSSID}`);
  console.log(`   Password: ${newPassword}`);
}

async function toggleHidden(client, state) {
  const hide = state.toLowerCase() === 'on' || state === '1';
  
  console.log(hide ? '🔒 Hiding WiFi SSID...' : '📢 Broadcasting WiFi SSID...');
  
  const settings = await client.wlan.basicSettings();
  await client.wlan.setBasicSettings({
    ...settings,
    WifiHide: hide ? 1 : 0,
    WifiRestart: 1
  });
  
  console.log('✅ SSID visibility changed!');
  console.log('   Hidden:', hide ? 'Yes' : 'No');
  console.log('⚠️  WiFi will restart.');
}

async function changeChannel(client, channel) {
  const channelNum = parseInt(channel);
  if (isNaN(channelNum) || channelNum < 0 || channelNum > 13) {
    throw new Error('Channel must be 0 (auto) or 1-13');
  }
  
  console.log('📡 Changing WiFi channel...');
  console.log('  New Channel:', channelNum === 0 ? 'Auto' : channelNum);
  
  const settings = await client.wlan.basicSettings();
  await client.wlan.setBasicSettings({
    ...settings,
    WifiChannel: channelNum,
    WifiRestart: 1
  });
  
  console.log('✅ Channel changed successfully!');
  console.log('⚠️  WiFi will restart.');
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.error('Usage:');
    console.error('  node wifi-settings.js <url> show');
    console.error('  node wifi-settings.js <url> ssid <new_ssid>');
    console.error('  node wifi-settings.js <url> password <new_password>');
    console.error('  node wifi-settings.js <url> change <new_ssid> <new_password>');
    console.error('  node wifi-settings.js <url> hide <on|off>');
    console.error('  node wifi-settings.js <url> channel <0-13>');
    console.error('');
    console.error('Examples:');
    console.error('  node wifi-settings.js http://admin:password@192.168.8.1/ show');
    console.error('  node wifi-settings.js http://admin:password@192.168.8.1/ ssid "MyNewWiFi"');
    console.error('  node wifi-settings.js http://admin:password@192.168.8.1/ password "SecurePass123"');
    console.error('  node wifi-settings.js http://admin:password@192.168.8.1/ change "MyWiFi" "SecurePass123"');
    console.error('  node wifi-settings.js http://admin:password@192.168.8.1/ hide on');
    console.error('  node wifi-settings.js http://admin:password@192.168.8.1/ channel 6');
    process.exit(1);
  }

  const url = args[0];
  const command = args[1];

  try {
    console.log('🔌 Connecting to modem...');
    const client = await createClient({ url });

    switch (command.toLowerCase()) {
      case 'show':
      case 'status':
        await showSettings(client);
        break;
      
      case 'ssid':
        if (args.length < 3) {
          throw new Error('Please provide new SSID');
        }
        await changeSSID(client, args[2]);
        break;
      
      case 'password':
      case 'pass':
        if (args.length < 3) {
          throw new Error('Please provide new password');
        }
        await changePassword(client, args[2]);
        break;
      
      case 'change':
      case 'both':
        if (args.length < 4) {
          throw new Error('Please provide new SSID and password');
        }
        await changeBoth(client, args[2], args[3]);
        break;
      
      case 'hide':
      case 'hidden':
        if (args.length < 3) {
          throw new Error('Please provide on or off');
        }
        await toggleHidden(client, args[2]);
        break;
      
      case 'channel':
        if (args.length < 3) {
          throw new Error('Please provide channel number (0-13, 0=auto)');
        }
        await changeChannel(client, args[2]);
        break;
      
      default:
        throw new Error(`Unknown command: ${command}. Use: show, ssid, password, change, hide, or channel`);
    }

    await client.logout();
    console.log('\n✅ Done!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
