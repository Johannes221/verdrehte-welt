const Order = require('../models/Order');
const Ticket = require('../models/Ticket');
const jwt = require('jsonwebtoken');
const QRCode = require('qrcode');
const mongoose = require('mongoose');
const { sendTicketEmail, sendInternalOrderNotification, sendCustomerEmailConfirmation } = require('./emailService');

// Generate Tickets for Order
async function generateTicketsForOrder(bestellungId) {
    try {
        const order = await Order.findById(bestellungId);
        
        if (!order) {
            throw new Error('Order not found');
        }
        
        if (order.status !== 'bezahlt') {
            console.log(`[Ticket Generation] Order ${bestellungId} not paid yet, skipping`);
            return;
        }
        
        // Check if tickets already generated
        const existingTickets = await Ticket.find({ bestellungId });
        if (existingTickets.length > 0) {
            console.log(`[Ticket Generation] Tickets already exist for Order ${bestellungId}`);
            return;
        }
        
        const tickets = [];
        
        // Generate ticket for each position
        for (const position of order.positionen) {
            for (let i = 0; i < position.menge; i++) {
                const ticket = await createTicket({
                    bestellungId: order._id,
                    eventId: order.eventId,
                    ticketVarianteId: position.ticketVarianteId,
                    bezeichnung: position.bezeichnung,
                    preis: position.einzelpreisBrutto,
                    kaeuferEmail: order.email
                });
                
                tickets.push(ticket);
            }
        }
        
        console.log(`[Ticket Generation] Generated ${tickets.length} tickets for Order ${bestellungId}`);
        
        // Send internal order notification
        try {
            await sendInternalOrderNotification(order);
            console.log(`[Ticket Generation] Internal notification sent`);
        } catch (notificationError) {
            console.error('[Ticket Generation] Internal notification failed:', notificationError);
        }
        
        // Send Email to Customer
        try {
            await sendTicketEmail(order.email, tickets, order);
            console.log(`[Ticket Generation] Customer email sent to ${order.email}`);
            
            // Send confirmation that customer email was sent
            try {
                await sendCustomerEmailConfirmation(order);
                console.log(`[Ticket Generation] Customer email confirmation sent`);
            } catch (confirmError) {
                console.error('[Ticket Generation] Customer email confirmation failed:', confirmError);
            }
        } catch (emailError) {
            console.error('[Ticket Generation] Customer email failed:', emailError);
        }
        
        return tickets;
        
    } catch (error) {
        console.error('[Ticket Generation] Error:', error);
        throw error;
    }
}

// Create Single Ticket
async function createTicket(data) {
    const ticketId = new mongoose.Types.ObjectId();
    
    // Generate JWT Token for QR
    const qrToken = jwt.sign(
        {
            sub: ticketId.toString(),
            evt: data.eventId,
            typ: data.ticketVarianteId,
            ver: 1
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRY || '365d'
        }
    );
    
    // Generate QR Code as Data URL
    const qrCodeDataUrl = await QRCode.toDataURL(qrToken, {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        width: 512,
        margin: 2,
        color: {
            dark: '#000000',
            light: '#FFFFFF'
        }
    });
    
    console.log(`[Ticket] Generated QR Code for ${ticketId}, length: ${qrCodeDataUrl.length}`);
    
    // Create Ticket
    const ticket = await Ticket.create({
        _id: ticketId,
        bestellungId: data.bestellungId,
        eventId: data.eventId,
        ticketVarianteId: data.ticketVarianteId,
        bezeichnung: data.bezeichnung,
        preis: data.preis,
        kaeuferEmail: data.kaeuferEmail,
        qrToken,
        qrCodeUrl: qrCodeDataUrl,
        status: 'gueltig'
    });
    
    console.log(`[Ticket] Created ticket ${ticketId} with QR URL: ${qrCodeDataUrl.substring(0, 50)}...`);
    
    return ticket;
}

// Verify QR Token
function verifyQRToken(token) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return {
            valid: true,
            ticketId: decoded.sub,
            eventId: decoded.evt,
            ticketVarianteId: decoded.typ
        };
    } catch (error) {
        return {
            valid: false,
            error: error.message
        };
    }
}

module.exports = {
    generateTicketsForOrder,
    createTicket,
    verifyQRToken
};
