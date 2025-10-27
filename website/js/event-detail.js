// Event Detail Page JavaScript

// API Base URL - Production
const API_BASE_URL = 'https://verdrehte-welt.onrender.com/api/v1';

let currentEvent = null;
let selectedTicket = null;
let selectedQuantity = 1;

// Check if ticket is currently available based on date
function isTicketAvailable(ticket) {
    const now = new Date();
    
    // Check availableFrom
    if (ticket.availableFrom) {
        const from = new Date(ticket.availableFrom);
        if (now < from) return false;
    }
    
    // Check availableUntil
    if (ticket.availableUntil) {
        const until = new Date(ticket.availableUntil);
        if (now > until) return false;
    }
    
    return true;
}

// Get Event ID from URL
function getEventId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// Load Event Details
function loadEventDetails() {
    const eventId = getEventId();
    const event = EVENTS_DATA.find(e => e.id === eventId);
    
    if (!event) {
        document.getElementById('event-detail-container').innerHTML = `
            <div class="loading">
                <h2>Event nicht gefunden</h2>
                <p><a href="index.html" class="btn">Zurück zur Startseite</a></p>
            </div>
        `;
        return;
    }
    
    currentEvent = event;
    document.title = `${event.title} - Verdrehte Welt`;
    
    const imageClass = event.imageType === 'contain' ? 'contain' : '';
    const imageStyle = event.imagePosition ? `object-position: ${event.imagePosition};` : '';
    
    let ticketsHtml = '';
    if (event.tickets.length > 0) {
        ticketsHtml = `
            <div class="ticket-box">
                <h3>Tickets</h3>
                <p style="opacity: 0.8;">Sichere dir jetzt dein Ticket für dieses Event!</p>
                
                <div style="margin: 30px 0;">
                    ${event.tickets.map(ticket => {
                        const available = isTicketAvailable(ticket);
                        return `
                        <div class="ticket-option" style="${!available ? 'opacity: 0.6;' : ''}">
                            <div class="ticket-info">
                                <div class="ticket-name">${ticket.name}</div>
                                ${ticket.description ? `<div class="ticket-description">${ticket.description}</div>` : ''}
                                ${!available ? `<div class="ticket-note">Derzeit nicht verfügbar</div>` : ''}
                            </div>
                            <div class="ticket-action">
                                <div class="ticket-price">${ticket.price.toFixed(2)} €</div>
                                ${available
                                    ? `<button class="btn" onclick="selectTicket('${ticket.id}')">Auswählen</button>`
                                    : `<button class="btn" style="opacity: 0.6; cursor: not-allowed;" disabled>Nicht verfügbar</button>`
                                }
                            </div>
                        </div>
                    `}).join('')}
                </div>
            </div>
        `;
    }
    
    document.getElementById('event-detail-container').innerHTML = `
        <img src="${event.image}" alt="${event.title}" class="event-hero-image ${imageClass}" style="${imageStyle}">
        
        <h1 class="event-title">${event.title}</h1>
        
        <div class="event-meta-grid">
            <div class="event-meta-item">
                <strong class="event-meta-label">Datum & Zeit</strong>
                ${event.date} ${event.time}
            </div>
            <div class="event-meta-item">
                <strong class="event-meta-label">Location</strong>
                ${event.location}<br>
                <span style="font-size: 0.9rem; opacity: 0.7;">${event.address}</span>
            </div>
            <div class="event-meta-item">
                <strong class="event-meta-label">Musik</strong>
                ${event.genres.join(' / ')}
            </div>
        </div>
        
        <div class="event-description">
            ${event.description}
        </div>
        
        ${ticketsHtml}
        
        <div id="checkout-section" style="display: none;">
            <div class="checkout-form">
                <h3>Bestellung abschließen</h3>
                
                <div class="form-group">
                    <label for="quantity">Anzahl Tickets *</label>
                    <select id="quantity" onchange="updateQuantity()" required>
                        ${Array.from({length: 10}, (_, i) => i + 1).map(n => 
                            `<option value="${n}">${n} Ticket${n > 1 ? 's' : ''}</option>`
                        ).join('')}
                    </select>
                </div>
                
                <div class="checkout-summary" id="checkout-summary"></div>
                
                <form id="checkout-form">
                    <div class="form-group">
                        <label for="email">Email *</label>
                        <input type="email" id="email" name="email" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="vorname">Vorname</label>
                        <input type="text" id="vorname" name="vorname">
                    </div>
                    
                    <div class="form-group">
                        <label for="nachname">Nachname</label>
                        <input type="text" id="nachname" name="nachname">
                    </div>
                    
                    <div class="checkbox-group form-group">
                        <input type="checkbox" id="agb" name="agb" required>
                        <label for="agb">Ich akzeptiere die <a href="agb.html" target="_blank" style="color: inherit; text-decoration: underline;">AGB</a> *</label>
                    </div>
                    
                    <div class="checkbox-group form-group">
                        <input type="checkbox" id="dsgvo" name="dsgvo" required>
                        <label for="dsgvo">Ich akzeptiere die <a href="datenschutz.html" target="_blank" style="color: inherit; text-decoration: underline;">Datenschutzerklärung</a> *</label>
                    </div>
                    
                    <button type="submit" class="btn" style="width: 100%;" id="submit-btn">
                        Weiter zu PayPal
                    </button>
                </form>
                
                <div id="checkout-message"></div>
            </div>
        </div>
    `;
    
    // Attach form handler
    const form = document.getElementById('checkout-form');
    if (form) {
        form.addEventListener('submit', handleCheckout);
    }
}

// Update Quantity
function updateQuantity() {
    const quantitySelect = document.getElementById('quantity');
    selectedQuantity = parseInt(quantitySelect.value) || 1;
    updateCheckoutSummary();
}

// Update Checkout Summary
function updateCheckoutSummary() {
    if (!selectedTicket) return;
    
    const subtotal = selectedTicket.price * selectedQuantity;
    
    document.getElementById('checkout-summary').innerHTML = `
        <div style="background: #1a1a1a; padding: 20px; border-radius: 8px; margin-top: 20px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                <div>
                    <strong style="font-size: 1.1rem;">${selectedTicket.name}</strong><br>
                    <span style="opacity: 0.7;">Anzahl: ${selectedQuantity}x</span>
                </div>
                <div style="text-align: right;">
                    <span style="font-size: 1rem; opacity: 0.7;">${selectedTicket.price.toFixed(2)} € / Stück</span>
                </div>
            </div>
            <div style="border-top: 1px solid #333; padding-top: 15px; display: flex; justify-content: space-between; align-items: center;">
                <strong style="font-size: 1.2rem;">Gesamt:</strong>
                <span style="font-size: 2rem; font-weight: bold;">${subtotal.toFixed(2)} €</span>
            </div>
        </div>
    `;
}

// Select Ticket
function selectTicket(ticketId) {
    selectedTicket = currentEvent.tickets.find(t => t.id === ticketId);
    
    if (!selectedTicket) return;
    
    // Reset quantity to 1
    selectedQuantity = 1;
    const quantitySelect = document.getElementById('quantity');
    if (quantitySelect) {
        quantitySelect.value = '1';
    }
    
    updateCheckoutSummary();
    
    document.getElementById('checkout-section').style.display = 'block';
    document.getElementById('checkout-section').scrollIntoView({ behavior: 'smooth' });
}

// Handle Checkout
async function handleCheckout(e) {
    e.preventDefault();
    
    if (!selectedTicket || !currentEvent) return;
    
    const formData = new FormData(e.target);
    const data = {
        email: formData.get('email'),
        vorname: formData.get('vorname'),
        nachname: formData.get('nachname'),
        agbAkzeptiert: formData.get('agb') === 'on',
        dsgvoAkzeptiert: formData.get('dsgvo') === 'on',
        widerrufsbelehrungGelesen: true,
        eventId: currentEvent.id,
        tickets: [{
            ticketVarianteId: selectedTicket.id,
            bezeichnung: selectedTicket.name,
            einzelpreisBrutto: selectedTicket.price,
            menge: selectedQuantity
        }]
    };
    
    const messageDiv = document.getElementById('checkout-message');
    const submitBtn = document.getElementById('submit-btn');
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Wird verarbeitet...';
    
    try {
        // Step 1: Create Order
        const orderResponse = await fetch(`${API_BASE_URL}/orders/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (!orderResponse.ok) {
            throw new Error('Bestellung konnte nicht erstellt werden');
        }
        
        const orderData = await orderResponse.json();
        const bestellungId = orderData.order._id;
        
        // Step 2: Create PayPal Order
        const paypalResponse = await fetch(`${API_BASE_URL}/payments/paypal/create-order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ bestellungId })
        });
        
        if (!paypalResponse.ok) {
            throw new Error('PayPal-Order konnte nicht erstellt werden');
        }
        
        const paypalData = await paypalResponse.json();
        
        // Redirect to PayPal
        if (paypalData.approvalUrl) {
            window.location.href = paypalData.approvalUrl;
        } else {
            throw new Error('PayPal-URL nicht gefunden');
        }
        
    } catch (error) {
        console.error('Checkout error:', error);
        messageDiv.innerHTML = `
            <div class="checkout-message error">
                <p style="color: #f44336; font-weight: bold;">❌ Fehler</p>
                <p>${error.message}</p>
                <p>Bitte versuche es erneut oder kontaktiere uns.</p>
            </div>
        `;
        submitBtn.disabled = false;
        submitBtn.textContent = 'Weiter zu PayPal';
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadEventDetails();
});
