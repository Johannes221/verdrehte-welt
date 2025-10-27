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
                id: 'early-bird',
                name: 'Early Bird',
                price: 8.00,
                availableFrom: null,
                availableUntil: '2025-11-16T23:59:59',
                description: 'Verfügbar bis 16.11.2025'
            },
            {
                id: 'vvk',
                name: 'Vorverkauf (VVK)',
                price: 10.00,
                availableFrom: '2025-11-17T00:00:00',
                availableUntil: '2025-11-27T23:59:59',
                description: 'Verfügbar ab 17.11. bis 27.11.2025'
            },
            {
                id: 'abendkasse',
                name: 'Abendkasse',
                price: 12.00,
                availableFrom: '2025-11-28T00:00:00',
                availableUntil: null,
                description: 'Nur am Event-Tag vor Ort'
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
        image: 'images/events/event-1.jpg',
        imagePosition: '50% 30%',
        description: `
            <p><strong style="color: #999;">✓ Vergangenes Event</strong></p>
            <p>Bereite dich auf eine unvergessliche Nacht voller energiegeladener Beats und atemberaubender Atmosphäre vor! Verdrehte Welt bringt die besten Techno-Sounds nach Dossenheim.</p>
            <p>Rave in Dossenheim wird zum pulsierenden Zentrum der Nacht, wenn unsere handverlesenen DJs die Decks zum Glühen bringen. Von hartem Techno über melodische Klänge bis hin zu düsteren Beats – hier kommt jeder Techno-Liebhaber auf seine Kosten.</p>
        `,
        tickets: [],
        status: 'past'
    },
    {
        id: 'leitstelle-2025',
        title: 'Tages-Rave in der Leitstelle',
        date: 'TBD',
        time: 'TBD',
        location: 'Leitstelle Heidelberg',
        address: 'TBD',
        genres: ['TBD'],
        image: 'images/logo.png',
        imageType: 'contain',
        description: `
            <p>Kommt bald! Ein Tages-Rave der Extraklasse in der Leitstelle Heidelberg.</p>
        `,
        tickets: [],
        status: 'coming-soon'
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
