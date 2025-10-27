// Event-Daten für Verdrehte Welt
const EVENTS_DATA = [
    {
        id: 'cafe-leitstelle-nov-2025',
        title: 'Party im Café-Leitstelle',
        date: '28.11.2025',
        time: '22:00 – 05:00',
        location: 'Café-Leitstelle',
        address: 'Emil-Maier-Straße 16, 69115 Heidelberg',
        genres: ['Hard Techno', 'Melodic Techno', 'Dark Techno'],
        image: 'images/events/event-2.jpg',
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
                available: true,
                availableUntil: '16.11.2025 23:59',
                description: 'Verfügbar bis: 16.11.2025 23:59'
            },
            {
                id: 'vvk',
                name: 'VVK',
                price: 10.00,
                available: true,
                availableUntil: '26.11.2025 23:59',
                description: 'Verfügbar bis: 26.11.2025 23:59'
            },
            {
                id: 'door',
                name: 'Abendkasse',
                price: 12.00,
                available: false,
                description: 'Nur in bar an der Kasse',
                note: 'Nur vor Ort'
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
            <p>Bereite dich auf eine unvergessliche Nacht voller energiegeladener Beats und atemberaubender Atmosphäre vor! Verdrehte Welt bringt die besten Techno-Sounds nach Dossenheim.</p>
            <p>Rave in Dossenheim wird zum pulsierenden Zentrum der Nacht, wenn unsere handverlesenen DJs die Decks zum Glühen bringen. Von hartem Techno über melodische Klänge bis hin zu düsteren Beats – hier kommt jeder Techno-Liebhaber auf seine Kosten.</p>
        `,
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
