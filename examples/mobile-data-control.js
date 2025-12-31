#!/usr/bin/env node

/**
 * Example: Control mobile data connection
 * 
 * Usage:
 *   node mobile-data-control.js http://admin:password@192.168.8.1/ status
 *   node mobile-data-control.js http://admin:password@192.168.8.1/ on
 *   node mobile-data-control.js http://admin:password@192.168.8.1/ off
 */

const { createClient } = require('../dist/cjs/index.js');

async function showStatus(client) {
  const dataSwitch = await client.dialup.mobileDataswitch();
  const status = await client.monitoring.status();
  const stats = await client.monitoring.trafficStatistics();
  
  console.log('\n📱 Mobile Data Status:');
  console.log('  Switch:', dataSwitch.dataswitch === 1 ? '✅ Enabled' : '❌ Disabled');
  console.log('  Connection:', status.ConnectionStatus === '903' ? '✅ Connected' : '❌ Disconnected');
  console.log('  Network:', status.CurrentNetworkType || 'Unknown');
  
  if (status.WanIPAddress) {
    console.log('  IP Address:', status.WanIPAddress);
  }
  
  console.log('\n📊 Current Session:');
  const duration = parseInt(stats.CurrentConnectTime);
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  console.log('  Duration:', `${hours}h ${minutes}m`);
  console.log('  Downloaded:', formatBytes(parseInt(stats.CurrentDownload)));
  console.log('  Uploaded:', formatBytes(parseInt(stats.CurrentUpload)));
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

async function enableData(client) {
  console.log('📱 Enabling mobile data...');
  await client.dialup.setMobileDataswitch(1);
  console.log('✅ Mobile data enabled!');
  console.log('⏳ Waiting for connection...');
  
  // Wait a bit and check status
  await new Promise(resolve => setTimeout(resolve, 3000));
  const status = await client.monitoring.status();
  console.log('   Status:', status.ConnectionStatus === '903' ? 'Connected ✅' : 'Connecting... 🔄');
}

async function disableData(client) {
  console.log('📱 Disabling mobile data...');
  await client.dialup.setMobileDataswitch(0);
  console.log('✅ Mobile data disabled!');
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.error('Usage:');
    console.error('  node mobile-data-control.js <url> status');
    console.error('  node mobile-data-control.js <url> on');
    console.error('  node mobile-data-control.js <url> off');
    console.error('\nExample:');
    console.error('  node mobile-data-control.js http://admin:password@192.168.8.1/ status');
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
      
      case 'on':
      case 'enable':
        await enableData(client);
        break;
      
      case 'off':
      case 'disable':
        await disableData(client);
        break;
      
      default:
        throw new Error(`Unknown command: ${command}. Use: status, on, or off`);
    }

    await client.logout();
    console.log('\n✅ Done!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
