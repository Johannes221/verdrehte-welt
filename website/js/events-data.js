// Event-Daten für Verdrehte Welt
const EVENTS_DATA = [
    {
        id: 'rave-dossenheim-2025',
        title: 'Rave in Dossenheim',
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
        tickets: [
            {
                id: 'early-bird',
                name: 'Early Bird',
                price: 8.00,
                available: true,
                availableUntil: '22.10.2025 23:59',
                description: 'Verfügbar bis: 22.10.2025 23:59'
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
