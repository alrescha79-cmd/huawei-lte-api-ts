#!/usr/bin/env node

/**
 * Example: Monitor network status and signal strength
 * 
 * Usage:
 *   node network-status.js http://admin:password@192.168.8.1/
 *   node network-status.js http://192.168.8.1/ admin password
 */

const { createClient } = require('../dist/cjs/index.js');

function getConnectionStatusText(status) {
  const statusMap = {
    '901': '❌ Disconnected',
    '902': '🔄 Connecting',
    '903': '✅ Connected',
    '904': '⏸️  Disconnecting'
  };
  return statusMap[status] || `Unknown (${status})`;
}

function getSignalBars(signalIcon) {
  const bars = '▁▃▅▇█';
  const icon = parseInt(signalIcon);
  if (icon <= 0) return '📵 No Signal';
  if (icon > 5) return bars.repeat(5) + ' Excellent';
  return bars.substring(0, icon) + ' '.repeat(5 - icon) + getSignalText(icon);
}

function getSignalText(icon) {
  const textMap = {
    1: 'Very Poor',
    2: 'Poor',
    3: 'Fair',
    4: 'Good',
    5: 'Excellent'
  };
  return textMap[icon] || '';
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('Usage: node network-status.js <url> [username] [password]');
    console.error('Example: node network-status.js http://admin:password@192.168.8.1/');
    process.exit(1);
  }

  const url = args[0];
  const username = args[1] || 'admin';
  const password = args[2] || 'admin';

  try {
    console.log('📡 Connecting to modem...');
    const client = await createClient({ url, username, password });

    console.log('🔍 Getting network status...\n');
    const status = await client.monitoring.status();

    // Connection status
    console.log('🌐 Connection Status:');
    console.log('  Status:', getConnectionStatusText(status.ConnectionStatus));
    console.log('  Network Type:', status.CurrentNetworkType || 'Unknown');
    console.log('  Roaming:', status.RoamingStatus === '1' ? 'Yes' : 'No');

    // Signal strength
    console.log('\n📶 Signal Strength:');
    console.log('  Signal:', getSignalBars(status.SignalIcon));
    console.log('  Level:', `${status.SignalIcon}/5`);

    // Get detailed signal info
    try {
      const signal = await client.device.signal();
      console.log('\n📊 Signal Details:');
      if (signal.rssi) console.log('  RSSI:', signal.rssi, 'dBm');
      if (signal.rsrp) console.log('  RSRP:', signal.rsrp, 'dBm');
      if (signal.rsrq) console.log('  RSRQ:', signal.rsrq, 'dB');
      if (signal.sinr) console.log('  SINR:', signal.sinr, 'dB');
      if (signal.band) console.log('  Band:', signal.band);
      if (signal.cell_id) console.log('  Cell ID:', signal.cell_id);
    } catch (e) {
      // Signal details not available
    }

    // IP and DNS
    if (status.WanIPAddress) {
      console.log('\n🌍 Network Configuration:');
      console.log('  IP Address:', status.WanIPAddress);
      if (status.PrimaryDns) console.log('  Primary DNS:', status.PrimaryDns);
      if (status.SecondaryDns) console.log('  Secondary DNS:', status.SecondaryDns);
    }

    // Battery status (for mobile hotspots)
    if (status.BatteryStatus) {
      console.log('\n🔋 Battery:');
      const battery = parseInt(status.BatteryStatus);
      if (battery >= 0) {
        console.log('  Level:', battery + '%');
      }
    }

    await client.logout();
    console.log('\n✅ Done!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
