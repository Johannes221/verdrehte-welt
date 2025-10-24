const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const { verifyQRToken } = require('../services/ticketGeneration');

// Scan Ticket at Door
router.post('/scan', async (req, res) => {
    try {
        const { qrToken, deviceId, modus = 'tuer' } = req.body;
        
        if (!qrToken) {
            return res.status(400).json({ 
                ergebnis: 'fehler',
                message: 'QR-Token fehlt' 
            });
        }
        
        // Verify JWT
        const verification = verifyQRToken(qrToken);
        
        if (!verification.valid) {
            return res.status(400).json({
                ergebnis: 'ungueltig',
                message: 'QR-Code ungültig oder abgelaufen'
            });
        }
        
        // Find Ticket
        const ticket = await Ticket.findById(verification.ticketId);
        
        if (!ticket) {
            return res.status(404).json({
                ergebnis: 'nicht_gefunden',
                message: 'Ticket nicht gefunden'
            });
        }
        
        // Check Status
        if (ticket.status === 'gesperrt') {
            return res.status(403).json({
                ergebnis: 'gesperrt',
                message: 'Ticket ist gesperrt'
            });
        }
        
        if (ticket.status === 'erstattet') {
            return res.status(403).json({
                ergebnis: 'erstattet',
                message: 'Ticket wurde erstattet'
            });
        }
        
        if (ticket.status === 'eingelassen') {
            return res.status(403).json({
                ergebnis: 'bereits_benutzt',
                message: 'Ticket wurde bereits verwendet',
                erstverwendung: ticket.erstverwendung_at,
                scanHistorie: ticket.scanHistorie
            });
        }
        
        // Valid - Check in
        if (ticket.status === 'gueltig') {
            ticket.status = 'eingelassen';
            ticket.erstverwendung_at = new Date();
            ticket.scanHistorie.push({
                zeitpunkt: new Date(),
                deviceId: deviceId || 'unknown',
                modus
            });
            await ticket.save();
            
            console.log(`[Check-in] Ticket ${ticket._id} checked in`);
            
            return res.json({
                ergebnis: 'eingelassen',
                message: 'Ticket erfolgreich gescannt - Einlass gewährt! ✅',
                ticket: {
                    id: ticket._id,
                    bezeichnung: ticket.bezeichnung,
                    kaeuferEmail: ticket.kaeuferEmail,
                    zeitpunkt: new Date()
                }
            });
        }
        
        res.status(400).json({
            ergebnis: 'fehler',
            message: 'Unbekannter Ticket-Status'
        });
        
    } catch (error) {
        console.error('[Check-in] Error:', error);
        res.status(500).json({
            ergebnis: 'fehler',
            message: 'Fehler beim Scannen'
        });
    }
});

// Get Ticket Status (for manual lookup)
router.get('/ticket/:ticketId', async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.ticketId);
        
        if (!ticket) {
            return res.status(404).json({ error: 'Ticket nicht gefunden' });
        }
        
        res.json({
            ticket: {
                id: ticket._id,
                status: ticket.status,
                bezeichnung: ticket.bezeichnung,
                eventId: ticket.eventId,
                kaeuferEmail: ticket.kaeuferEmail,
                erstverwendung_at: ticket.erstverwendung_at,
                scanHistorie: ticket.scanHistorie
            }
        });
        
    } catch (error) {
        console.error('[Check-in] Get ticket error:', error);
        res.status(500).json({ error: 'Fehler beim Laden des Tickets' });
    }
});

// Event Statistics (how many checked in)
router.get('/stats/:eventId', async (req, res) => {
    try {
        const { eventId } = req.params;
        
        const stats = await Ticket.aggregate([
            { $match: { eventId } },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);
        
        const result = {
            eventId,
            total: 0,
            gueltig: 0,
            eingelassen: 0,
            erstattet: 0,
            gesperrt: 0
        };
        
        stats.forEach(s => {
            result[s._id] = s.count;
            result.total += s.count;
        });
        
        res.json(result);
        
    } catch (error) {
        console.error('[Check-in] Stats error:', error);
        res.status(500).json({ error: 'Fehler beim Laden der Statistiken' });
    }
});

module.exports = router;
