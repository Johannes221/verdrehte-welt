// Main JavaScript for Verdrehte Welt Website

// API Configuration - Development: localhost:3000
const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:3000/api/v1' 
    : 'https://api.verdrehtewelt.de/api/v1';

// Load Events
function loadEvents() {
    const container = document.getElementById('events-container');
    if (!container) return;

    container.innerHTML = EVENTS_DATA.map(event => {
        const imageStyle = event.imageType === 'contain'
            ? `background: url('${event.image}') center/contain no-repeat; background-color: #1a1a1a;`
            : `background: url('${event.image}') center center / cover no-repeat; background-color: #1a1a1a; background-position: ${event.imagePosition || 'center'};`;

        let ticketInfo = '';
        let buttonHtml = '';

        if (event.status === 'available' && event.tickets.length > 0) {
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
    }).join('');
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
