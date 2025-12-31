#!/usr/bin/env node
/**
 * Example: Get device information
 * 
 * Usage:
 *   node device_info.js http://admin:password@192.168.8.1/
 *   node device_info.js http://192.168.8.1/ admin password
 */

const { createClient } = require('../dist/cjs/index.js');

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('Usage: node device_info.js <url> [username] [password]');
    console.error('Example: node device_info.js http://admin:password@192.168.8.1/');
    process.exit(1);
  }

  const url = args[0];
  const username = args[1] || 'admin';
  const password = args[2] || 'admin';

  try {
    console.log('🔌 Connecting to modem...');
    const client = await createClient({ url, username, password });

    console.log('📋 Getting device information...\n');
    const device = await client.device.information();
    
    console.log('📱 Device Information:');
    console.log('  Device Name:', device.DeviceName);
    console.log('  Serial Number:', device.SerialNumber);
    console.log('  IMEI:', device.Imei);
    console.log('  IMSI:', device.Imsi);
    console.log('  ICCID:', device.Iccid);
    console.log('  Phone Number:', device.Msisdn || 'N/A');
    console.log('  Hardware Version:', device.HardwareVersion);
    console.log('  Software Version:', device.SoftwareVersion);
    console.log('  WebUI Version:', device.WebUIVersion);
    console.log('  MAC Address:', device.MacAddress1);
    console.log('  WAN IP:', device.WanIPAddress || 'N/A');
    console.log('  Work Mode:', device.workmode);

    await client.logout();
    console.log('\n✅ Done!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
