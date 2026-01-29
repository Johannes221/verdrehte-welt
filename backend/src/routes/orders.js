const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const rateLimit = require('express-rate-limit');

// Rate Limiter für Order-Erstellung: Max 3 Orders pro 5 Minuten pro IP
const createOrderLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 Minuten
    max: 3, // Max 3 Bestellungen
    message: { error: 'Zu viele Bestellungen. Bitte warte 5 Minuten.' },
    standardHeaders: true,
    legacyHeaders: false
});

// Create Order (mit Rate Limiting)
router.post('/create', createOrderLimiter, async (req, res) => {
    try {
        const {
            email,
            vorname,
            nachname,
            eventId,
            tickets,
            agbAkzeptiert,
            dsgvoAkzeptiert,
            widerrufsbelehrungGelesen
        } = req.body;
        
        // Validation
        if (!email || !eventId || !tickets || tickets.length === 0) {
            return res.status(400).json({ error: 'Fehlende Pflichtfelder' });
        }
        
        // Email validation (einfache Regex)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Ungültige Email-Adresse' });
        }
        
        // Type validation (gegen NoSQL Injection)
        if (typeof email !== 'string' || typeof eventId !== 'string') {
            return res.status(400).json({ error: 'Ungültige Datentypen' });
        }
        
        if (!agbAkzeptiert || !dsgvoAkzeptiert || !widerrufsbelehrungGelesen) {
            return res.status(400).json({ error: 'AGB, DSGVO und Widerrufsbelehrung müssen akzeptiert werden' });
        }
        
        const forbiddenTicketVarianten = new Set(['abendkasse', 'student-abendkasse']);
        if (tickets.some(t => forbiddenTicketVarianten.has(t.ticketVarianteId))) {
            return res.status(400).json({ error: 'Abendkasse-Tickets sind nur vor Ort (nur Barzahlung) verfügbar' });
        }
        
        // Calculate totals
        const positionen = tickets.map(t => ({
            ticketVarianteId: t.ticketVarianteId,
            bezeichnung: t.bezeichnung,
            einzelpreisBrutto: t.einzelpreisBrutto,
            menge: t.menge || 1,
            summe: t.einzelpreisBrutto * (t.menge || 1)
        }));
        
        const summeBrutto = positionen.reduce((sum, p) => sum + p.summe, 0);
        const plattformFee = Math.round(summeBrutto * (parseFloat(process.env.PLATFORM_FEE_PERCENTAGE || 5) / 100) * 100) / 100;
        
        // Create Order
        const order = await Order.create({
            email: email.toLowerCase().trim(),
            vorname,
            nachname,
            eventId,
            positionen,
            summeBrutto,
            plattformFee,
            waehrung: 'EUR',
            status: 'offen',
            agbAkzeptiert,
            dsgvoAkzeptiert,
            widerrufsbelehrungGelesen
        });
        
        console.log(`[Order] Created: ${order._id} for ${email}`);
        
        res.status(201).json({
            success: true,
            order: {
                _id: order._id,
                email: order.email,
                eventId: order.eventId,
                summeBrutto: order.summeBrutto,
                status: order.status
            }
        });
        
    } catch (error) {
        console.error('[Order Create] Error:', error);
        res.status(500).json({ error: 'Bestellung konnte nicht erstellt werden' });
    }
});

// Get Order by ID
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        
        if (!order) {
            return res.status(404).json({ error: 'Bestellung nicht gefunden' });
        }
        
        res.json({ order });
        
    } catch (error) {
        console.error('[Order Get] Error:', error);
        res.status(500).json({ error: 'Fehler beim Laden der Bestellung' });
    }
});

module.exports = router;
