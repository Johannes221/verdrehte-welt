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
                name: 'Phase 1',
                price: 8.00,
                availableFrom: null,
                availableUntil: '2025-11-08T23:59:59',
                maxTickets: 35,
                description: 'Ausverkauft'
            },
            {
                id: 'phase-2',
                name: 'Phase 2',
                price: 10.00,
                availableFrom: null,
                availableUntil: '2025-11-27T23:59:59',
                maxTickets: 50,
                description: ''
            },
            {
                id: 'abendkasse',
                name: 'Abendkasse',
                price: 12.00,
                availableFrom: '2099-12-31T00:00:00',
                availableUntil: null,
                description: 'Nur vor Ort am Event-Tag | ⚠️ NUR BARGELD - keine Kartenzahlung'
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
            <p>Unser erstes Private Rave Event in Dossenheim! Eine unvergessliche Nacht voller energiegeladener Beats und unvergesslicher Momente. Die Energie war elektrisierend, die Crowd unglaublich – ein perfekter Start für Verdrehte Welt!</p>
            <p style="margin-top: 20px;"><a href="https://www.instagram.com/s/aGlnaGxpZ2h0OjE4MDQzNTU4MTk1ODc3NTY4?story_media_id=3472914137408055693&igsh=MWt3aDc2am1xcXJycQ==" target="_blank" style="color: #e91e63; text-decoration: underline;">📹 Schau dir die Highlights vom Rave an!</a></p>
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
            <p>Die Fortsetzung einer legendären Nacht! PrivateRave 2.0 hat alle Erwartungen übertroffen – noch intensiver, noch wilder, noch unvergesslicher. Danke an alle, die dabei waren!</p>
            <p style="margin-top: 20px;"><a href="https://www.instagram.com/s/aGlnaGxpZ2h0OjE3OTIzMzExMzM5MTUxNjg5?story_media_id=3752187602683072221&igsh=czIyemQzcWhxMTR0" target="_blank" style="color: #e91e63; text-decoration: underline;">📹 Erlebe die besten Momente!</a></p>
        `,
        tickets: [],
        status: 'past'
    },
    {
        id: 'rooftop-party-mannheim',
        title: 'Rooftop Party Mannheim',
        date: '26.07.2025',
        time: '20:00 – 03:00',
        location: 'Mannheim',
        address: 'Rooftop Location, Mannheim',
        genres: ['Techno', 'House', 'Melodic Techno'],
        image: 'images/events/IMG_8760 2.jpg',
        imageType: 'cover',
        description: `
            <p><strong style="color: #999;">✓ Vergangenes Event</strong></p>
            <p>Eine magische Sommernacht auf den Dächern Mannheims! Bei Sonnenuntergang und unter freiem Himmel haben wir bis in die frühen Morgenstunden gefeiert. Die perfekte Mischung aus entspannter Rooftop-Atmosphäre und treibenden Beats.</p>
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
