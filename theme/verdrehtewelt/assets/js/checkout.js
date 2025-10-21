/**
 * Checkout & PayPal Integration
 */

let selectedTicketType = null;
let selectedTicketPrice = 0;
let selectedTicketName = '';
let currentOrderId = null;

/**
 * Select Ticket
 */
function vwSelectTicket(type, price, name) {
    selectedTicketType = type;
    selectedTicketPrice = price;
    selectedTicketName = name;
    
    // Update UI
    document.getElementById('selected-ticket-name').textContent = name;
    document.getElementById('selected-ticket-price').textContent = vwFormatPrice(price);
    document.getElementById('ticket-type').value = type;
    
    // Show checkout section
    document.getElementById('checkout-section').style.display = 'block';
    
    // Scroll to checkout
    document.getElementById('checkout-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Format Price
 */
function vwFormatPrice(price) {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(price);
}

/**
 * Create Order
 */
document.addEventListener('DOMContentLoaded', function() {
    const orderForm = document.getElementById('order-form');
    if (!orderForm) return;
    
    orderForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const vorname = document.getElementById('vorname').value;
        const nachname = document.getElementById('nachname').value;
        const eventId = document.getElementById('event-id').value;
        const ticketType = document.getElementById('ticket-type').value;
        const agb = document.getElementById('agb').checked;
        
        if (!agb) {
            alert('Bitte akzeptiere die AGB');
            return;
        }
        
        if (!email || !ticketType) {
            alert('Bitte fülle alle Pflichtfelder aus');
            return;
        }
        
        // Show loading
        const messageEl = document.getElementById('order-message');
        messageEl.innerHTML = '<p>Erstelle Bestellung...</p>';
        
        try {
            // Create order
            const orderResponse = await fetch(vwData.ajaxUrl.replace('admin-ajax.php', 'wp-json/vw/v1/orders/create'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    vorname: vorname,
                    nachname: nachname,
                    event_id: eventId,
                    ticket_type: ticketType,
                    agb_akzeptiert: true
                })
            });
            
            const orderData = await orderResponse.json();
            
            if (!orderData.success) {
                throw new Error(orderData.error?.message || 'Bestellung konnte nicht erstellt werden');
            }
            
            currentOrderId = orderData.order.order_id;
            
            // Create PayPal order
            messageEl.innerHTML = '<p>Erstelle PayPal-Zahlung...</p>';
            
            const paypalResponse = await fetch(vwData.ajaxUrl.replace('admin-ajax.php', 'wp-json/vw/v1/payments/paypal/create-order'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    order_id: currentOrderId
                })
            });
            
            const paypalData = await paypalResponse.json();
            
            if (paypalData.error) {
                throw new Error(paypalData.error.message || 'PayPal-Fehler');
            }
            
            // Hide form, show PayPal button
            orderForm.style.display = 'none';
            messageEl.innerHTML = '<p>Bitte schließe die Zahlung ab:</p>';
            document.getElementById('paypal-button-container').style.display = 'block';
            
            // Load PayPal SDK and render button
            vwLoadPayPalButton(paypalData.paypal_order_id);
            
        } catch (error) {
            console.error('Error:', error);
            messageEl.innerHTML = '<p style="color: #ff4444;">Fehler: ' + error.message + '</p>';
        }
    });
});

/**
 * Load PayPal Button
 */
function vwLoadPayPalButton(paypalOrderId) {
    // Note: PayPal SDK should be loaded in the head with client-id
    // For now, we'll redirect to approval URL as fallback
    
    const approvalUrl = 'https://www.sandbox.paypal.com/checkoutnow?token=' + paypalOrderId;
    
    const container = document.getElementById('paypal-button-container');
    container.innerHTML = '<a href="' + approvalUrl + '" class="btn" style="width: 100%; text-align: center;">Mit PayPal bezahlen</a>';
    
    container.innerHTML += '<p style="margin-top: 20px; font-size: 0.9rem; opacity: 0.7;">Du wirst zu PayPal weitergeleitet. Nach der Zahlung erhältst du dein Ticket per Email.</p>';
}

/**
 * Handle PayPal Return (optional)
 */
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has('paypal_order_id')) {
    const paypalOrderId = urlParams.get('paypal_order_id');
    
    // Capture payment
    fetch(vwData.ajaxUrl.replace('admin-ajax.php', 'wp-json/vw/v1/payments/paypal/capture'), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            paypal_order_id: paypalOrderId
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('✓ Zahlung erfolgreich! Du erhältst dein Ticket per Email.');
            window.location.href = window.location.pathname;
        } else {
            alert('Fehler bei der Zahlung: ' + (data.error?.message || 'Unbekannter Fehler'));
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Fehler bei der Zahlung. Bitte kontaktiere uns.');
    });
}
