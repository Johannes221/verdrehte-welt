const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const Order = require('../models/Order');
const { verifyQRToken } = require('../services/ticketGeneration');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');

// Rate Limiter für Login: Max 5 Versuche pro 15 Minuten
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 Minuten
    max: 5, // Max 5 Requests
    message: { error: 'Zu viele Login-Versuche. Bitte warte 15 Minuten.' },
    standardHeaders: true,
    legacyHeaders: false
});

// Admin credentials (in production: use proper auth system)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'verdrehtewelt2025';

// Simple password-based auth middleware
function requireAdminAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const token = authHeader.substring(7);
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'admin') {
            return res.status(403).json({ error: 'Forbidden' });
        }
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
}

// Admin Login (mit Rate Limiting)
router.post('/login', loginLimiter, async (req, res) => {
    try {
        const { password } = req.body;
        
        if (!password || password !== ADMIN_PASSWORD) {
            return res.status(401).json({ error: 'Falsches Passwort' });
        }
        
        // Generate admin JWT
        const token = jwt.sign(
            { role: 'admin', iat: Date.now() },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.json({
            success: true,
            token,
            expiresIn: 86400 // 24 hours in seconds
        });
        
    } catch (error) {
        console.error('[Admin Login] Error:', error);
        res.status(500).json({ error: 'Login fehlgeschlagen' });
    }
});

// Validate QR Code
router.post('/validate', requireAdminAuth, async (req, res) => {
    try {
        const { qrToken } = req.body;
        
        if (!qrToken) {
            return res.status(400).json({ error: 'QR Token fehlt' });
        }
        
        // Verify JWT
        const verification = verifyQRToken(qrToken);
        
        if (!verification.valid) {
            return res.json({
                valid: false,
                reason: 'INVALID_TOKEN',
                message: 'QR-Code ungültig oder abgelaufen'
            });
        }
        
        // Find Ticket
        const ticket = await Ticket.findById(verification.ticketId)
            .populate('bestellungId');
        
        if (!ticket) {
            return res.json({
                valid: false,
                reason: 'TICKET_NOT_FOUND',
                message: 'Ticket nicht gefunden'
            });
        }
        
        // Check Status
        if (ticket.status === 'erstattet') {
            return res.json({
                valid: false,
                reason: 'REFUNDED',
                message: 'Ticket wurde erstattet',
                ticket: {
                    id: ticket._id,
                    type: ticket.bezeichnung,
                    status: ticket.status
                }
            });
        }
        
        if (ticket.status === 'eingecheckt') {
            return res.json({
                valid: false,
                reason: 'ALREADY_CHECKED_IN',
                message: 'Ticket bereits eingecheckt',
                ticket: {
                    id: ticket._id,
                    type: ticket.bezeichnung,
                    checkedInAt: ticket.erstverwendung_at,
                    status: ticket.status
                }
            });
        }
        
        // Valid ticket!
        res.json({
            valid: true,
            ticket: {
                id: ticket._id,
                type: ticket.bezeichnung,
                eventId: ticket.eventId,
                price: ticket.preis,
                buyer: ticket.kaeuferEmail,
                status: ticket.status,
                orderInfo: ticket.bestellungId ? {
                    orderId: ticket.bestellungId._id,
                    name: `${ticket.bestellungId.vorname || ''} ${ticket.bestellungId.nachname || ''}`.trim()
                } : null
            }
        });
        
    } catch (error) {
        console.error('[Admin Validate] Error:', error);
        res.status(500).json({ error: 'Validierung fehlgeschlagen' });
    }
});

// Check In Ticket
router.post('/checkin', requireAdminAuth, async (req, res) => {
    try {
        console.log('[Admin Check-In] Request received');
        const { qrToken } = req.body;
        
        if (!qrToken) {
            console.log('[Admin Check-In] Missing qrToken');
            return res.status(400).json({ success: false, error: 'QR Token fehlt' });
        }
        
        console.log('[Admin Check-In] Verifying token...');
        // Verify JWT
        const verification = verifyQRToken(qrToken);
        
        if (!verification.valid) {
            console.log('[Admin Check-In] Invalid token:', verification.error);
            return res.json({
                success: false,
                reason: 'INVALID_TOKEN',
                message: 'QR-Code ungültig'
            });
        }
        
        console.log('[Admin Check-In] Finding ticket:', verification.ticketId);
        // Find Ticket
        const ticket = await Ticket.findById(verification.ticketId);
        
        if (!ticket) {
            console.log('[Admin Check-In] Ticket not found:', verification.ticketId);
            return res.json({
                success: false,
                reason: 'TICKET_NOT_FOUND',
                message: 'Ticket nicht gefunden'
            });
        }
        
        console.log('[Admin Check-In] Ticket found, status:', ticket.status);
        
        // Check if already checked in
        if (ticket.status === 'eingecheckt') {
            console.log('[Admin Check-In] Already checked in');
            return res.json({
                success: false,
                reason: 'ALREADY_CHECKED_IN',
                message: 'Bereits eingecheckt',
                checkedInAt: ticket.eingecheckt_at
            });
        }
        
        // Check if refunded
        if (ticket.status === 'erstattet') {
            console.log('[Admin Check-In] Ticket refunded');
            return res.json({
                success: false,
                reason: 'REFUNDED',
                message: 'Ticket erstattet'
            });
        }
        
        // Check in!
        console.log('[Admin Check-In] Checking in ticket...');
        ticket.status = 'eingecheckt';
        ticket.eingecheckt_at = new Date();
        await ticket.save();
        
        console.log(`[Admin Check-In] SUCCESS: Ticket ${ticket._id} checked in`);
        
        res.json({
            success: true,
            message: 'Check-In erfolgreich',
            ticket: {
                id: ticket._id,
                type: ticket.bezeichnung,
                checkedInAt: ticket.eingecheckt_at
            }
        });
        
    } catch (error) {
        console.error('[Admin Check-In] Error:', error);
        console.error('[Admin Check-In] Stack:', error.stack);
        res.status(500).json({ 
            success: false,
            error: 'Check-In fehlgeschlagen',
            message: error.message 
        });
    }
});

// Get All Tickets (List View)
router.get('/tickets', requireAdminAuth, async (req, res) => {
    try {
        const { eventId } = req.query;
        
        const query = eventId ? { eventId } : {};
        
        const tickets = await Ticket.find(query)
            .populate('bestellungId')
            .sort({ generiert_at: -1 })
            .limit(500);
        
        const ticketList = tickets.map(ticket => ({
            id: ticket._id,
            ticketId: ticket._id.toString().slice(-8),
            type: ticket.bezeichnung,
            price: ticket.preis,
            status: ticket.status,
            buyer: {
                email: ticket.kaeuferEmail,
                name: ticket.bestellungId ? 
                    `${ticket.bestellungId.vorname || ''} ${ticket.bestellungId.nachname || ''}`.trim() : 
                    'N/A'
            },
            order: {
                id: ticket.bestellungId?._id,
                total: ticket.bestellungId?.summeBrutto
            },
            qrToken: ticket.qrToken,
            eventId: ticket.eventId,
            createdAt: ticket.generiert_at,
            checkedInAt: ticket.eingecheckt_at
        }));
        
        res.json({ tickets: ticketList });
        
    } catch (error) {
        console.error('[Admin Tickets] Error:', error);
        res.status(500).json({ error: 'Tickets konnten nicht geladen werden' });
    }
});

// Get Stats
router.get('/stats', requireAdminAuth, async (req, res) => {
    try {
        const { eventId } = req.query;
        
        const query = eventId ? { eventId } : {};
        
        const totalTickets = await Ticket.countDocuments(query);
        const checkedIn = await Ticket.countDocuments({ ...query, status: 'eingecheckt' });
        const valid = await Ticket.countDocuments({ ...query, status: 'gueltig' });
        const refunded = await Ticket.countDocuments({ ...query, status: 'erstattet' });
        
        res.json({
            total: totalTickets,
            checkedIn,
            valid,
            refunded,
            remaining: valid
        });
        
    } catch (error) {
        console.error('[Admin Stats] Error:', error);
        res.status(500).json({ error: 'Stats konnten nicht geladen werden' });
    }
});

module.exports = router;
