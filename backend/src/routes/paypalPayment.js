const express = require('express');
const router = express.Router();
const axios = require('axios');
const Order = require('../models/Order');
const { generateTicketsForOrder } = require('../services/ticketGeneration');

// PayPal API Base URL
const PAYPAL_API = process.env.PAYPAL_MODE === 'live' 
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';

// Get PayPal Access Token
async function getPayPalAccessToken() {
    const auth = Buffer.from(
        `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
    ).toString('base64');
    
    const response = await axios.post(
        `${PAYPAL_API}/v1/oauth2/token`,
        'grant_type=client_credentials',
        {
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
    );
    
    return response.data.access_token;
}

// Create PayPal Order
router.post('/create-order', async (req, res) => {
    try {
        const { bestellungId } = req.body;
        
        if (!bestellungId) {
            return res.status(400).json({ error: 'bestellungId fehlt' });
        }
        
        const order = await Order.findById(bestellungId);
        
        if (!order) {
            return res.status(404).json({ error: 'Bestellung nicht gefunden' });
        }
        
        if (order.status !== 'offen') {
            return res.status(400).json({ error: 'Bestellung hat bereits einen PayPal-Order' });
        }
        
        // Get Access Token
        const accessToken = await getPayPalAccessToken();
        
        // Create PayPal Order
        const orderData = {
            intent: 'CAPTURE',
            purchase_units: [{
                reference_id: order._id.toString(),
                description: `Verdrehte Welt - Event Tickets`,
                amount: {
                    currency_code: 'EUR',
                    value: order.summeBrutto.toFixed(2)
                }
            }],
            application_context: {
                brand_name: 'Verdrehte Welt',
                return_url: `${process.env.FRONTEND_URL}/payment-success.html?orderId=${order._id}`,
                cancel_url: `${process.env.FRONTEND_URL}/payment-cancel.html?orderId=${order._id}`,
                user_action: 'PAY_NOW'
            }
        };
        
        const response = await axios.post(
            `${PAYPAL_API}/v2/checkout/orders`,
            orderData,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        // Update Order
        order.paypalOrderId = response.data.id;
        order.status = 'pending';
        await order.save();
        
        // Get Approval URL
        const approvalLink = response.data.links.find(link => link.rel === 'approve');
        
        console.log(`[PayPal] Order created: ${response.data.id} for Order ${order._id}`);
        
        res.json({
            success: true,
            paypalOrderId: response.data.id,
            approvalUrl: approvalLink.href
        });
        
    } catch (error) {
        console.error('[PayPal Create Order] Error:', error.response?.data || error.message);
        res.status(500).json({ error: 'PayPal Order konnte nicht erstellt werden' });
    }
});

// Capture PayPal Order
router.post('/capture-order', async (req, res) => {
    try {
        const { paypalOrderId } = req.body;
        
        if (!paypalOrderId) {
            return res.status(400).json({ error: 'paypalOrderId fehlt' });
        }
        
        const order = await Order.findOne({ paypalOrderId });
        
        if (!order) {
            return res.status(404).json({ error: 'Bestellung nicht gefunden' });
        }
        
        // Get Access Token
        const accessToken = await getPayPalAccessToken();
        
        // Capture Payment
        const response = await axios.post(
            `${PAYPAL_API}/v2/checkout/orders/${paypalOrderId}/capture`,
            {},
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        const capture = response.data.purchase_units[0].payments.captures[0];
        
        if (capture.status === 'COMPLETED') {
            // Update Order
            order.status = 'bezahlt';
            order.paypalCaptureId = capture.id;
            order.bezahlt_at = new Date();
            await order.save();
            
            console.log(`[PayPal] Capture completed: ${capture.id} for Order ${order._id}`);
            
            // Generate Tickets
            try {
                await generateTicketsForOrder(order._id.toString());
                console.log(`[PayPal] Tickets generated for Order ${order._id}`);
            } catch (ticketError) {
                console.error('[PayPal] Ticket generation failed:', ticketError);
                // Don't fail the capture, tickets can be generated later
            }
            
            res.json({
                success: true,
                captureId: capture.id,
                orderId: order._id
            });
        } else {
            console.warn(`[PayPal] Capture not completed: ${capture.status}`);
            res.json({
                success: false,
                captureStatus: capture.status
            });
        }
        
    } catch (error) {
        console.error('[PayPal Capture] Error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Zahlung konnte nicht abgeschlossen werden' });
    }
});

// PayPal Webhook
router.post('/webhook', async (req, res) => {
    try {
        const event = req.body;
        
        console.log(`[PayPal Webhook] Received: ${event.event_type}`);
        
        // In production: Verify webhook signature
        // For now: Basic validation
        if (!event.event_type) {
            return res.status(400).json({ error: 'Invalid webhook payload' });
        }
        
        // Handle Event
        switch (event.event_type) {
            case 'PAYMENT.CAPTURE.COMPLETED':
                await handlePaymentCaptured(event);
                break;
            case 'PAYMENT.CAPTURE.REFUNDED':
                await handlePaymentRefunded(event);
                break;
            default:
                console.log(`[PayPal Webhook] Unhandled event: ${event.event_type}`);
        }
        
        res.status(200).json({ success: true });
        
    } catch (error) {
        console.error('[PayPal Webhook] Error:', error);
        res.status(500).json({ error: 'Webhook processing failed' });
    }
});

// Handle Payment Captured
async function handlePaymentCaptured(event) {
    const captureId = event.resource.id;
    const paypalOrderId = event.resource.supplementary_data?.related_ids?.order_id;
    
    if (!paypalOrderId) {
        console.warn('[PayPal Webhook] No order_id in webhook payload');
        return;
    }
    
    const order = await Order.findOne({ paypalOrderId });
    
    if (!order) {
        console.warn(`[PayPal Webhook] Order not found for PayPal Order ${paypalOrderId}`);
        return;
    }
    
    // Idempotency check
    if (order.status === 'bezahlt') {
        console.log(`[PayPal Webhook] Order ${order._id} already paid`);
        return;
    }
    
    // Update Order
    order.status = 'bezahlt';
    order.paypalCaptureId = captureId;
    order.bezahlt_at = new Date();
    await order.save();
    
    console.log(`[PayPal Webhook] Order ${order._id} marked as paid`);
    
    // Generate Tickets
    try {
        await generateTicketsForOrder(order._id.toString());
        console.log(`[PayPal Webhook] Tickets generated for Order ${order._id}`);
    } catch (ticketError) {
        console.error('[PayPal Webhook] Ticket generation failed:', ticketError);
    }
}

// Handle Payment Refunded
async function handlePaymentRefunded(event) {
    const captureId = event.resource.id;
    
    const order = await Order.findOne({ paypalCaptureId: captureId });
    
    if (!order) {
        console.warn(`[PayPal Webhook] Order not found for Capture ${captureId}`);
        return;
    }
    
    order.status = 'erstattet';
    await order.save();
    
    console.log(`[PayPal Webhook] Order ${order._id} refunded`);
    
    // Mark tickets as refunded
    const Ticket = require('../models/Ticket');
    await Ticket.updateMany(
        { bestellungId: order._id },
        { status: 'erstattet' }
    );
}

module.exports = router;
