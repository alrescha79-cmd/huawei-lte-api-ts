#!/usr/bin/env node

/**
 * Example: SMS operations - list, read, send, delete
 * 
 * Usage:
 *   node sms-operations.js http://admin:password@192.168.8.1/ list
 *   node sms-operations.js http://admin:password@192.168.8.1/ count
 *   node sms-operations.js http://admin:password@192.168.8.1/ send +6281234567890 "Hello World"
 *   node sms-operations.js http://admin:password@192.168.8.1/ delete <index>
 */

const { createClient } = require('../dist/cjs/index.js');

async function showCount(client) {
  const count = await client.sms.smsCount();
  
  console.log('\n📬 SMS Count:');
  console.log('  Inbox - Unread:', count.LocalUnread);
  console.log('  Inbox - Total:', count.LocalInbox);
  console.log('  Outbox:', count.LocalOutbox);
  console.log('  Draft:', count.LocalDraft);
  console.log('  Trash:', count.LocalDeleted || 0);
}

async function listMessages(client, boxType = 1) {
  const result = await client.sms.smsList({
    page: 1,
    boxType: boxType,
    readCount: 20,
    unreadPreferred: true
  });
  
  if (!result.Messages || !result.Messages.Message) {
    console.log('\n📭 No messages');
    return;
  }
  
  const messages = Array.isArray(result.Messages.Message) 
    ? result.Messages.Message 
    : [result.Messages.Message];
  
  console.log(`\n📨 Found ${messages.length} message(s):\n`);
  
  messages.forEach((msg, index) => {
    const isRead = msg.Smstat === 1;
    const status = isRead ? '✓' : '✉️';
    console.log(`${status} Message ${index + 1} (Index: ${msg.Index}):`);
    console.log('  From:', msg.Phone);
    console.log('  Date:', msg.Date);
    console.log('  Content:', msg.Content);
    console.log('');
  });
}

async function sendMessage(client, phoneNumber, message) {
  console.log('📤 Sending SMS...');
  console.log('  To:', phoneNumber);
  console.log('  Message:', message);
  
  const result = await client.sms.sendSms({
    phoneNumbers: [phoneNumber],
    message: message
  });
  
  console.log('✅ SMS sent successfully!');
}

async function deleteMessage(client, index) {
  console.log(`🗑️  Deleting message ${index}...`);
  await client.sms.deleteSms(parseInt(index));
  console.log('✅ Message deleted successfully!');
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.error('Usage:');
    console.error('  node sms-operations.js <url> count');
    console.error('  node sms-operations.js <url> list');
    console.error('  node sms-operations.js <url> send <phone> <message>');
    console.error('  node sms-operations.js <url> delete <index>');
    console.error('\nExample:');
    console.error('  node sms-operations.js http://admin:password@192.168.8.1/ list');
    console.error('  node sms-operations.js http://admin:password@192.168.8.1/ send +6281234567890 "Hello"');
    process.exit(1);
  }

  const url = args[0];
  const command = args[1];

  try {
    console.log('🔌 Connecting to modem...');
    const client = await createClient({ url });

    switch (command.toLowerCase()) {
      case 'count':
        await showCount(client);
        break;
      
      case 'list':
        await listMessages(client);
        break;
      
      case 'send':
        if (args.length < 4) {
          throw new Error('Please provide phone number and message');
        }
        await sendMessage(client, args[2], args[3]);
        break;
      
      case 'delete':
        if (args.length < 3) {
          throw new Error('Please provide message index');
        }
        await deleteMessage(client, args[2]);
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
