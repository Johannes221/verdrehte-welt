const express = require('express');
const router = express.Router();

// Static event data (könnte später aus DB kommen)
const EVENTS = [
    {
        id: 'cafe-leitstelle-nov-2025',
        title: 'Party im Café-Leitstelle',
        date: '28.11.2025',
        time: '22:00 – 05:00',
        location: 'Café-Leitstelle',
        address: 'Emil-Maier-Straße 16, 69115 Heidelberg',
        genres: ['Hard Techno', 'Melodic Techno', 'Dark Techno'],
        image: '/images/events/event-2.jpg',
        description: 'Verdrehte Welt präsentiert: Eine unvergessliche Nacht im Café-Leitstelle Heidelberg!',
        tickets: [
            {
                id: 'early-bird',
                name: 'Early Bird',
                price: 8.00,
                available: true,
                availableUntil: '16.11.2025 23:59',
                kontingent: 100,
                verkauft: 0
            },
            {
                id: 'vvk',
                name: 'VVK',
                price: 10.00,
                available: true,
                availableUntil: '26.11.2025 23:59',
                kontingent: 150,
                verkauft: 0
            },
            {
                id: 'door',
                name: 'Abendkasse',
                price: 12.00,
                available: false,
                kontingent: 50,
                verkauft: 0
            }
        ],
        status: 'available'
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

// Get all events
router.get('/', (req, res) => {
    res.json({ events: EVENTS });
});

// Get single event
router.get('/:id', (req, res) => {
    const event = EVENTS.find(e => e.id === req.params.id);
    
    if (!event) {
        return res.status(404).json({ error: 'Event nicht gefunden' });
    }
    
    res.json({ event });
});

module.exports = router;
