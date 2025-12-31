/**
 * SMS management example
 * 
 * Shows how to:
 * - List SMS messages
 * - Send SMS
 * - Delete SMS
 * - Mark SMS as read
 */

import { HuaweiLTEClient } from '../src/client';
import { SmsBoxType } from '../src/types/sms';

async function main() {
  const client = new HuaweiLTEClient({
    url: process.env.HUAWEI_URL || 'http://192.168.8.1',
    username: process.env.HUAWEI_USERNAME || 'admin',
    password: process.env.HUAWEI_PASSWORD || 'admin',
  });

  console.log('🔐 Logging in...');
  await client.login();
  console.log('✅ Logged in!\n');

  try {
    // Get SMS count
    console.log('📊 SMS Count:');
    const count = await client.sms.smsCount();
    console.log('  Total inbox:', count.LocalInbox);
    console.log('  Unread:', count.LocalUnread);
    console.log('  Outbox:', count.LocalOutbox);
    console.log('  Draft:', count.LocalDraft);
    console.log();

    // List inbox messages
    console.log('📥 Inbox Messages:');
    const smsList = await client.sms.getSmsList(
      1, // page
      SmsBoxType.LOCAL_INBOX,
      10 // count per page
    );

    if (smsList.Count > 0 && smsList.Messages) {
      const messages = Array.isArray(smsList.Messages.Message)
        ? smsList.Messages.Message
        : [smsList.Messages.Message];

      messages.forEach((msg, index) => {
        console.log(`\n  Message ${index + 1}:`);
        console.log('    From:', msg.Phone);
        console.log('    Date:', msg.Date);
        console.log('    Content:', msg.Content);
        console.log('    Status:', msg.Smstat === 0 ? 'Unread' : 'Read');
      });
    } else {
      console.log('  No messages in inbox');
    }
    console.log();

    // Example: Send SMS (uncomment to use)
    /*
    console.log('📤 Sending SMS...');
    await client.sms.sendSms(
      ['+1234567890'], // recipient(s)
      'Hello from Huawei LTE API!'
    );
    console.log('✅ SMS sent!');
    */

    // Example: Mark message as read (uncomment to use)
    /*
    const messageId = 40001; // Replace with actual message ID
    console.log('📖 Marking message as read...');
    await client.sms.setRead(messageId);
    console.log('✅ Message marked as read!');
    */

    // Example: Delete message (uncomment to use)
    /*
    const messageId = 40001; // Replace with actual message ID
    console.log('🗑️  Deleting message...');
    await client.sms.deleteSms(messageId);
    console.log('✅ Message deleted!');
    */
  } finally {
    console.log('\n👋 Logging out...');
    await client.logout();
    console.log('✅ Done!');
  }
}

main().catch(console.error);
