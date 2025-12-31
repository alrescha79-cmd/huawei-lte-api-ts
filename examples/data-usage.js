#!/usr/bin/env node

/**
 * Example: Monitor data usage and traffic statistics
 * 
 * Usage:
 *   node data-usage.js http://admin:password@192.168.8.1/
 *   node data-usage.js http://192.168.8.1/ admin password
 */

const { createClient } = require('../dist/cjs/index.js');

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatDuration(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours}h ${minutes}m ${secs}s`;
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('Usage: node data-usage.js <url> [username] [password]');
    console.error('Example: node data-usage.js http://admin:password@192.168.8.1/');
    process.exit(1);
  }

  const url = args[0];
  const username = args[1] || 'admin';
  const password = args[2] || 'admin';

  try {
    console.log('📊 Connecting to modem...');
    const client = await createClient({ url, username, password });

    console.log('📈 Getting traffic statistics...\n');
    const stats = await client.monitoring.trafficStatistics();

    // Current session
    console.log('📱 Current Session:');
    console.log('  Duration:', formatDuration(parseInt(stats.CurrentConnectTime)));
    console.log('  Downloaded:', formatBytes(parseInt(stats.CurrentDownload)));
    console.log('  Uploaded:', formatBytes(parseInt(stats.CurrentUpload)));
    const currentTotal = parseInt(stats.CurrentDownload) + parseInt(stats.CurrentUpload);
    console.log('  Total:', formatBytes(currentTotal));

    // Total statistics
    console.log('\n📊 Total Statistics:');
    console.log('  Connection Time:', formatDuration(parseInt(stats.TotalConnectTime)));
    console.log('  Downloaded:', formatBytes(parseInt(stats.TotalDownload)));
    console.log('  Uploaded:', formatBytes(parseInt(stats.TotalUpload)));
    const totalData = parseInt(stats.TotalDownload) + parseInt(stats.TotalUpload);
    console.log('  Total:', formatBytes(totalData));

    // Monthly statistics (if available)
    if (stats.MonthDuration) {
      console.log('\n📅 This Month:');
      console.log('  Duration:', formatDuration(parseInt(stats.MonthDuration)));
      console.log('  Downloaded:', formatBytes(parseInt(stats.MonthDownload)));
      console.log('  Uploaded:', formatBytes(parseInt(stats.MonthUpload)));
    }

    // Calculate average speed
    const currentTime = parseInt(stats.CurrentConnectTime);
    if (currentTime > 0) {
      const avgDownSpeed = parseInt(stats.CurrentDownload) / currentTime;
      const avgUpSpeed = parseInt(stats.CurrentUpload) / currentTime;
      console.log('\n⚡ Average Speed (current session):');
      console.log('  Download:', formatBytes(avgDownSpeed) + '/s');
      console.log('  Upload:', formatBytes(avgUpSpeed) + '/s');
    }

    await client.logout();
    console.log('\n✅ Done!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
