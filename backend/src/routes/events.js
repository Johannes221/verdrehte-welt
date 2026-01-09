const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Static event data (könnte später aus DB kommen)
const EVENTS = [
    {
        id: 'leitstelle-jan-2026',
        title: 'Party in der Leitstelle',
        date: '31.01.2026',
        time: '21:00 – 05:00',
        location: 'Café-Leitstelle',
        address: 'Emil-Maier-Straße 16, 69115 Heidelberg',
        genres: ['House', 'Hard Techno', 'Melodic Techno', 'Dark Techno'],
        image: '/images/logo.png',
        description: 'Nach der megageilen Party in der Leitstelle am 28.11. starten wir erneut ins neue Jahr. Ab 21 Uhr beginnen wir mit entspannter House-Musik der ersten Stunde, ab 22 Uhr drehen wir dann richtig auf mit unseren Acts. Die Party geht wie gewohnt bis 5 Uhr morgens. Wir freuen uns auf euch, verdrehte Welt.',
        tickets: [
            {
                id: 'test',
                name: 'Testticket',
                price: 0.05,
                available: true,
                availableFrom: null,
                availableUntil: '2026-01-28T23:59:59',
                kontingent: 10,
                verkauft: 0,
                description: 'Test-Ticket für PayPal-Tests (5 Cent)'
            },
            {
                id: 'vorverkauf',
                name: 'Vorverkauf',
                price: 8.00,
                available: true,
                availableFrom: null,
                availableUntil: '2026-01-28T23:59:59',
                kontingent: 100,
                verkauft: 0,
                description: 'Online-Vorverkauf bis 28.01. um 23:59 Uhr (3 Tage vor Event)'
            },
            {
                id: 'abendkasse',
                name: 'Abendkasse',
                price: 10.00,
                available: false,
                availableFrom: '2026-01-31T21:00:00',
                availableUntil: null,
                kontingent: 0,
                verkauft: 0,
                description: 'Nur am Event-Tag vor Ort | ⚠️ NUR BARGELD - keine Kartenzahlung'
            }
        ],
        status: 'available'
    },
    {
        id: 'cafe-leitstelle-nov-2025',
        title: 'Party in der Leitstelle',
        date: '28.11.2025',
        time: '22:00 – 05:00',
        location: 'Café-Leitstelle',
        address: 'Emil-Maier-Straße 16, 69115 Heidelberg',
        genres: ['Hard Techno', 'Melodic Techno', 'Dark Techno', 'Schranz', 'Bounce Techno'],
        image: '/images/logo.png',
        description: 'Verdrehte Welt präsentiert: Eine unvergessliche Nacht im Café-Leitstelle Heidelberg!',
        tickets: [
            {
                id: 'phase-1',
                name: 'Phase 1',
                price: 8.00,
                available: true,
                availableFrom: null,
                availableUntil: '2025-11-09T23:59:59',
                kontingent: 35,
                verkauft: 0,
                description: 'Verfügbar bis 09.11.2025'
            },
            {
                id: 'phase-2',
                name: 'Phase 2',
                price: 10.00,
                available: true,
                availableFrom: '2025-11-10T00:00:00',
                availableUntil: '2025-11-19T23:59:59',
                kontingent: 50,
                verkauft: 0,
                description: 'Verfügbar 10.11. - 19.11.2025'
            },
            {
                id: 'phase-3',
                name: 'Phase 3',
                price: 12.00,
                available: true,
                availableFrom: '2025-11-20T00:00:00',
                availableUntil: '2025-11-27T23:59:59',
                kontingent: 65,
                verkauft: 0,
                description: 'Verfügbar 20.11. - 27.11.2025'
            },
            {
                id: 'abendkasse',
                name: 'Abendkasse',
                price: 15.00,
                available: false,
                availableFrom: '2025-11-28T00:00:00',
                availableUntil: null,
                kontingent: 0,
                verkauft: 0,
                description: 'Nur am Event-Tag vor Ort | ⚠️ NUR BARGELD - keine Kartenzahlung'
            }
        ],
        status: 'past'
    },
    {
        id: 'rave-dossenheim-2025',
        title: 'Private Rave in Dossenheim',
        date: '25.10.2025',
        time: '21:00 – 05:00',
        location: 'Im Weiher',
        address: 'Im Weiher, 69121 Heidelberg',
        genres: ['Hard Techno', 'Melodic Techno', 'Dark Techno'],
        image: '/images/events/event-1.jpg',
        description: 'Bereite dich auf eine unvergessliche Nacht voller energiegeladener Beats vor!',
        tickets: [],
        status: 'past'
    },
    {
        id: 'leitstelle-2025',
        title: 'Tages-Rave in der Leitstelle',
        date: '20.12.2025',
        time: 'TBD',
        location: 'Leitstelle Heidelberg',
        address: 'Emil-Julius-Gumbel-Platz 1, 69120 Heidelberg',
        genres: ['Hard Techno', 'Dark Techno', 'Melodic Techno', 'Schranz'],
        image: '/images/logo.png',
        description: 'Kommt bald!',
        tickets: [],
        status: 'coming-soon'
    }
];

// Calculate sold tickets for an event
async function calculateSoldTickets(eventId) {
    try {
        const orders = await Order.find({
            eventId,
            status: 'bezahlt'
        });
        
        const soldByVariant = {};
        
        orders.forEach(order => {
            order.positionen.forEach(position => {
                const variantId = position.ticketVarianteId;
                soldByVariant[variantId] = (soldByVariant[variantId] || 0) + position.menge;
            });
        });
        
        return soldByVariant;
    } catch (error) {
        console.error('[Events] Error calculating sold tickets:', error);
        return {};
    }
}

// Enrich event with sold ticket counts
async function enrichEventWithSales(event) {
    const soldTickets = await calculateSoldTickets(event.id);
    
    return {
        ...event,
        tickets: event.tickets.map(ticket => ({
            ...ticket,
            verkauft: soldTickets[ticket.id] || 0,
            verfuegbar: ticket.kontingent - (soldTickets[ticket.id] || 0)
        }))
    };
}

// Get all events
router.get('/', async (req, res) => {
    try {
        const enrichedEvents = await Promise.all(
            EVENTS.map(event => enrichEventWithSales(event))
        );
        res.json({ events: enrichedEvents });
    } catch (error) {
        console.error('[Events] Error fetching events:', error);
        res.status(500).json({ error: 'Fehler beim Laden der Events' });
    }
});

// Get single event
router.get('/:id', async (req, res) => {
    try {
        const event = EVENTS.find(e => e.id === req.params.id);
        
        if (!event) {
            return res.status(404).json({ error: 'Event nicht gefunden' });
        }
        
        const enrichedEvent = await enrichEventWithSales(event);
        res.json({ event: enrichedEvent });
    } catch (error) {
        console.error('[Events] Error fetching event:', error);
        res.status(500).json({ error: 'Fehler beim Laden des Events' });
    }
});

module.exports = router;
