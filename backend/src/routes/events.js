const express = require('express');
const router = express.Router();

// Static event data (könnte später aus DB kommen)
const EVENTS = [
    {
        id: 'rave-dossenheim-2025',
        title: 'Rave in Dossenheim',
        date: '25.10.2025',
        time: '21:00 – 05:00',
        location: 'Im Weiher',
        address: 'Im Weiher, 69121 Heidelberg',
        genres: ['Hard Techno', 'Melodic Techno', 'Dark Techno'],
        image: '/images/events/event-1.jpg',
        description: 'Bereite dich auf eine unvergessliche Nacht voller energiegeladener Beats vor!',
        tickets: [
            {
                id: 'early-bird',
                name: 'Early Bird',
                price: 8.00,
                available: true,
                availableUntil: '22.10.2025 23:59',
                kontingent: 100,
                verkauft: 0
            }
        ],
        status: 'available'
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
