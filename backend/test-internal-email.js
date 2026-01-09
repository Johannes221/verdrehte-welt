// Test script for internal email notifications
require('dotenv').config();
const mongoose = require('mongoose');
const Order = require('./src/models/Order');
const { sendInternalOrderNotification, sendCustomerEmailConfirmation } = require('./src/services/emailService');

async function testInternalEmails() {
    try {
        console.log('[Test] Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('[Test] Connected to MongoDB');
        
        console.log('[Test] Fetching latest order...');
        const order = await Order.findOne().sort({ erstellt_at: -1 });
        
        if (!order) {
            console.log('[Test] No orders found');
            process.exit(0);
        }
        
        console.log(`[Test] Found order: ${order._id}`);
        console.log(`[Test] Customer: ${order.vorname} ${order.nachname}`);
        console.log(`[Test] Email: ${order.email}`);
        console.log(`[Test] Total: ${order.summeBrutto}€`);
        console.log(`[Test] Internal notification email: ${process.env.INTERNAL_NOTIFICATION_EMAIL}`);
        console.log('');
        
        console.log('[Test] Sending internal order notification...');
        const result1 = await sendInternalOrderNotification(order);
        console.log('[Test] Internal notification result:', result1);
        console.log('');
        
        console.log('[Test] Sending customer email confirmation...');
        const result2 = await sendCustomerEmailConfirmation(order);
        console.log('[Test] Customer confirmation result:', result2);
        
        console.log('\n[Test] ✅ Both emails sent successfully!');
        console.log(`[Test] Check inbox: ${process.env.INTERNAL_NOTIFICATION_EMAIL}`);
        
        await mongoose.disconnect();
        process.exit(0);
        
    } catch (error) {
        console.error('[Test] Error:', error);
        process.exit(1);
    }
}

testInternalEmails();
