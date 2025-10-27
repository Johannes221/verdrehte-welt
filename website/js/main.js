// Main JavaScript for Verdrehte Welt Website

// API Configuration - Development: localhost:3000
const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:3000/api/v1' 
    : 'https://api.verdrehtewelt.de/api/v1';

// Parse date string (DD.MM.YYYY) to Date object
function parseEventDate(dateString) {
    const [day, month, year] = dateString.split('.');
    return new Date(year, month - 1, day);
}

// Check if event is in the past
function isEventPast(event) {
    const eventDate = parseEventDate(event.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return eventDate < today || event.status === 'past';
}

// Render single event card
function renderEventCard(event) {
    const imageStyle = event.imageType === 'contain'
        ? `background: url('${event.image}') center/contain no-repeat; background-color: #000000;`
        : `background: url('${event.image}') center center / cover no-repeat; background-color: #1a1a1a; background-position: ${event.imagePosition || 'center'};`;

    let ticketInfo = '';
    let buttonHtml = '';

    if (isEventPast(event)) {
        ticketInfo = '<p class="event-card-price" style="opacity: 0.6;">Event beendet</p>';
        buttonHtml = `<a href="event.html?id=${event.id}" class="btn btn-outline" style="width: 100%; text-align: center; opacity: 0.6;">Details ansehen</a>`;
    } else if (event.status === 'available' && event.tickets.length > 0) {
        const mainTicket = event.tickets.find(t => t.available) || event.tickets[0];
        ticketInfo = `
            <p class="event-card-price">
                ${mainTicket.name}: ${mainTicket.price.toFixed(2)} €
                ${mainTicket.availableUntil ? `<br><span style="font-size: 0.9rem; opacity: 0.7;">(bis ${mainTicket.availableUntil})</span>` : ''}
            </p>
        `;
        buttonHtml = `<a href="event.html?id=${event.id}" class="btn btn-outline" style="width: 100%; text-align: center;">Ticket sichern</a>`;
    } else if (event.status === 'coming-soon') {
        ticketInfo = '<p class="event-card-price">TBD</p>';
        buttonHtml = `<a href="#" class="btn btn-outline" style="width: 100%; text-align: center; opacity: 0.5; cursor: not-allowed;">Bald verfügbar</a>`;
    }

    return `
        <article class="event-card">
            <div class="event-card-image" style="${imageStyle}"></div>
            <div class="event-card-content">
                <h3 class="event-card-title">${event.title}</h3>
                <p class="event-card-meta">📅 ${event.date} ${event.time}</p>
                <p class="event-card-meta">📍 ${event.location}</p>
                <p class="event-card-meta" style="font-size: 0.85rem;">${event.address}</p>
                <p class="event-card-meta">${event.genres.join(' / ')}</p>
                ${ticketInfo}
                ${buttonHtml}
            </div>
        </article>
    `;
}

// Load Events (split into upcoming and past)
function loadEvents() {
    const upcomingContainer = document.getElementById('upcoming-events-container');
    const pastContainer = document.getElementById('past-events-container');
    
    if (!upcomingContainer && !pastContainer) return;

    // Sort events by date (newest first for past, soonest first for upcoming)
    const sortedEvents = [...EVENTS_DATA].sort((a, b) => {
        return parseEventDate(a.date) - parseEventDate(b.date);
    });

    // Split into upcoming and past
    const upcomingEvents = sortedEvents.filter(event => !isEventPast(event));
    const pastEvents = sortedEvents.filter(event => isEventPast(event)).reverse(); // Newest past events first

    // Render upcoming events
    if (upcomingContainer) {
        if (upcomingEvents.length > 0) {
            upcomingContainer.innerHTML = upcomingEvents.map(renderEventCard).join('');
        } else {
            upcomingContainer.innerHTML = '<p style="text-align: center; opacity: 0.6;">Keine kommenden Events</p>';
        }
    }

    // Render past events
    if (pastContainer) {
        if (pastEvents.length > 0) {
            pastContainer.innerHTML = pastEvents.map(renderEventCard).join('');
        } else {
            pastContainer.innerHTML = '<p style="text-align: center; opacity: 0.6;">Keine vergangenen Events</p>';
        }
    }
}

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadEvents();
});
