#!/usr/bin/env node
/*
Example code on how to receive basic info about your router, you can try it by running:
node device_info.js http://admin:1sampek8@192.168.8.1/
*/
const process = require('process');
const { createClient } = require('../dist/cjs/index-modern');

// Main async function
(async () => {
  try {
    // Create client (async)
    const client = await createClient({
      url: process.argv[2],
    });

    // Get device information
    const device = await client.device.information();
    console.log(device);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
})();
