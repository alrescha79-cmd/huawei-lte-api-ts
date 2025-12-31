/**
 * SMS management example
 * 
 * Shows how to:
 * - List SMS messages
 * - Send SMS
 * - Delete SMS
 * - Mark SMS as read
 */

import { createClient } from '../dist/cjs/index.js';
import { SmsBoxType } from '../dist/cjs/types/sms.js';
import { ResponseErrorNotSupportedException } from '../dist/cjs/exceptions.js';

async function main() {
  const client = await createClient({
    url: process.env.HUAWEI_URL || 'http://192.168.8.1',
    username: process.env.HUAWEI_USERNAME || 'admin',
    password: process.env.HUAWEI_PASSWORD || '1sampek8',
  });

  console.log('🔐 Logging in...');
  await client.login();
  console.log('✅ Logged in!\n');

  // Check if SMS is supported
  console.log('🔍 Checking SMS support...');
  let smsSupported = true;
  let smsError: any = null;
  
  try {
    const count = await client.sms.smsCount();
    console.log('✅ SMS is supported on this modem\n');
    
    // Get SMS count
    console.log('📊 SMS Count:');
    console.log('  Total inbox:', count.LocalInbox);
    console.log('  Unread:', count.LocalUnread);
    console.log('  Outbox:', count.LocalOutbox);
    console.log('  Draft:', count.LocalDraft);
    console.log();

    try {

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
      
    } catch (error: any) {
      if (error instanceof ResponseErrorNotSupportedException || 
          error?.code === 100002) {
        smsSupported = false;
        smsError = error;
      } else {
        throw error; // Re-throw if it's a different error
      }
    }

  } catch (error: any) {
    // Handle SMS not supported at the outer level
    if (error instanceof ResponseErrorNotSupportedException || 
        error?.code === 100002) {
      smsSupported = false;
      smsError = error;
    } else {
      throw error; // Re-throw if it's a different error
    }
  } finally {
    console.log('\n👋 Logging out...');
    await client.logout();
    console.log('✅ Done!');
    
    // Show SMS not supported message after logout
    if (!smsSupported && smsError) {
      console.log('\n⚠️  SMS functionality is NOT supported on this modem');
      console.log('   This is normal for some router models (e.g., B310, B315, B312)');
      console.log('   Only mobile hotspot models typically support SMS\n');
      
      console.log('ℹ️  Modem capabilities:');
      console.log('   ✅ Internet connection');
      console.log('   ✅ WiFi management');
      console.log('   ✅ Network monitoring');
      console.log('   ❌ SMS messages (not available)');
    }
  }
}

main().catch((error: any) => {
  if (error instanceof ResponseErrorNotSupportedException || error?.code === 100002) {
    // SMS not supported - already handled, silent exit
    process.exit(0);
  } else {
    console.error('Unhandled error:', error);
    process.exit(1);
  }
});
