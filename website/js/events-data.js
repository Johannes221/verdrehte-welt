// Event-Daten für Verdrehte Welt
const EVENTS_DATA = [
    {
        id: 'cafe-leitstelle-nov-2025',
        title: 'Party in der Leitstelle',
        date: '28.11.2025',
        time: '22:00 – 05:00',
        location: 'Café-Leitstelle',
        address: 'Emil-Maier-Straße 16, 69115 Heidelberg',
        genres: ['Hard Techno', 'Melodic Techno', 'Dark Techno', 'Schranz', 'Bounce Techno'],
        image: 'images/logo.png',
        imageType: 'contain',
        imagePosition: '50% 50%',
        description: `
            <p>Verdrehte Welt präsentiert: Eine unvergessliche Nacht im Café-Leitstelle Heidelberg!</p>
            <p>Tauche ein in die pulsierende Welt des Technos und erlebe einen Abend voller energiegeladener Beats, hypnotischer Melodien und düsterer Klänge. Unsere DJs verwandeln das Café-Leitstelle in ein techno-paradies, in dem die Nacht zum Tag wird.</p>
        `,
        tickets: [
            {
                id: 'phase-1',
                name: 'Phase 1 (35 Tickets)',
                price: 8.00,
                availableFrom: null,
                availableUntil: '2025-11-09T23:59:59',
                maxTickets: 35,
                description: 'Verfügbar bis 09.11.2025 - Limitiert auf 35 Tickets'
            },
            {
                id: 'phase-2',
                name: 'Phase 2 (50 Tickets)',
                price: 10.00,
                availableFrom: '2025-11-10T00:00:00',
                availableUntil: '2025-11-19T23:59:59',
                maxTickets: 50,
                description: 'Verfügbar 10.11. - 19.11.2025 - Limitiert auf 50 Tickets'
            },
            {
                id: 'phase-3',
                name: 'Phase 3 (65 Tickets)',
                price: 12.00,
                availableFrom: '2025-11-20T00:00:00',
                availableUntil: '2025-11-27T23:59:59',
                maxTickets: 65,
                description: 'Verfügbar 20.11. - 27.11.2025 - Limitiert auf 65 Tickets'
            },
            {
                id: 'abendkasse',
                name: 'Abendkasse',
                price: 15.00,
                availableFrom: '2025-11-28T00:00:00',
                availableUntil: null,
                description: 'Nur am Event-Tag vor Ort - Limitiert'
            }
        ],
        status: 'available'
    },
    {
        id: 'private-rave-1-dossenheim',
        title: 'PrivateRave 1.0 in Dossenheim',
        date: '05.10.2024',
        time: '21:00 – 05:00',
        location: 'Dossenheim',
        address: 'Location: Unknown',
        genres: ['Hard Techno', 'Melodic Techno', 'Dark Techno'],
        image: 'images/logo.png',
        imageType: 'contain',
        description: `
            <p><strong style="color: #999;">✓ Vergangenes Event</strong></p>
            <p>Unser erstes Private Rave Event in Dossenheim! Eine unvergessliche Nacht voller energiegeladener Beats.</p>
        `,
        tickets: [],
        status: 'past'
    },
    {
        id: 'private-rave-2-dossenheim',
        title: 'PrivateRave 2.0 in Dossenheim',
        date: '25.10.2025',
        time: '21:00 – 05:00',
        location: 'Dossenheim',
        address: 'Location: Unknown',
        genres: ['Hard Techno', 'Melodic Techno', 'Dark Techno'],
        image: 'images/logo.png',
        imageType: 'contain',
        description: `
            <p><strong style="color: #999;">✓ Vergangenes Event</strong></p>
            <p>Unser zweites Private Rave Event in Dossenheim! Die Fortsetzung einer legendären Nacht.</p>
        `,
        tickets: [],
        status: 'past'
    },
    {
        id: 'tbd-event',
        title: 'TBD',
        date: 'TBD',
        time: 'TBD',
        location: 'TBD',
        address: 'TBD',
        genres: ['TBD'],
        image: 'images/logo.png',
        imageType: 'contain',
        description: '<p>Weitere Events folgen bald!</p>',
        tickets: [],
        status: 'coming-soon'
    }
];
