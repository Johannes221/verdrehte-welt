const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Create Order
router.post('/create', async (req, res) => {
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
        
        if (!agbAkzeptiert || !dsgvoAkzeptiert || !widerrufsbelehrungGelesen) {
            return res.status(400).json({ error: 'AGB, DSGVO und Widerrufsbelehrung müssen akzeptiert werden' });
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
