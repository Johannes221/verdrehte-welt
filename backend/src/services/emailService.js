const { Resend } = require('resend');

// Configure Email Service
let resend = null;

if (process.env.MAIL_API_KEY) {
    resend = new Resend(process.env.MAIL_API_KEY);
    console.log('[Email] Resend initialized');
} else {
    console.log('[Email] Running in dev mode - emails will be logged only');
}

// Send Ticket Email
async function sendTicketEmail(email, tickets, order) {
    try {
        console.log(`[Email] Preparing email for ${email} with ${tickets.length} tickets`);
        tickets.forEach((t, i) => {
            console.log(`[Email] Ticket ${i+1}: ID=${t._id}, hasQR=${!!t.qrCodeUrl}, qrLength=${t.qrCodeUrl?.length || 0}`);
        });
        
        // Prepare attachments for QR codes
        const attachments = tickets.map((ticket, index) => {
            if (!ticket.qrCodeUrl) return null;
            
            // Extract base64 data from data URL
            const base64Data = ticket.qrCodeUrl.replace(/^data:image\/png;base64,/, '');
            
            return {
                filename: `ticket-${ticket._id}.png`,
                content: base64Data,
                encoding: 'base64',
                cid: `qr-${ticket._id}` // Content ID for inline images
            };
        }).filter(Boolean);
        
        const ticketList = tickets.map((ticket, index) => `
            <div style="margin: 20px 0; padding: 20px; border: 2px solid #333; background: #1a1a1a;">
                <h3 style="margin: 0 0 15px 0;">Ticket ${index + 1}: ${ticket.bezeichnung}</h3>
                <p style="margin: 10px 0;"><strong>Preis:</strong> ${ticket.preis.toFixed(2)} €</p>
                <p style="margin: 10px 0;"><strong>Ticket-ID:</strong> ${ticket._id}</p>
                <div style="text-align: center; margin: 20px 0;">
                    <img src="cid:qr-${ticket._id}" alt="QR Code Ticket ${index + 1}" style="max-width: 300px; width: 100%; display: block; margin: 0 auto;">
                </div>
                <p style="font-size: 0.9rem; opacity: 0.8; margin-top: 15px;">
                    Zeige diesen QR-Code am Einlass vor. Jedes Ticket kann nur einmal verwendet werden.
                </p>
            </div>
        `).join('');
        
        const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background: #000; color: #fff; font-family: Arial, sans-serif;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="font-size: 2.5rem; letter-spacing: 2px; margin: 0;">VERDREHTE WELT</h1>
        </div>
        
        <div style="background: #111; padding: 30px; border: 1px solid #333;">
            <h2 style="margin-top: 0;">Deine Tickets sind da! 🎉</h2>
            
            <p>Vielen Dank für deinen Kauf!</p>
            
            <div style="margin: 30px 0; padding: 20px; background: #222; border-left: 4px solid #fff;">
                <p style="margin: 5px 0;"><strong>Bestellung:</strong> ${order._id}</p>
                <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
                <p style="margin: 5px 0;"><strong>Anzahl Tickets:</strong> ${tickets.length}</p>
                <p style="margin: 5px 0;"><strong>Gesamtsumme:</strong> ${order.summeBrutto.toFixed(2)} €</p>
            </div>
            
            <h3 style="margin-top: 40px;">Deine Tickets:</h3>
            ${ticketList}
            
            <div style="margin-top: 40px; padding: 20px; background: #1a1a1a; border: 1px solid #333;">
                <h4 style="margin-top: 0;">Wichtige Hinweise:</h4>
                <ul style="line-height: 1.8;">
                    <li>Bitte bring dein Smartphone mit den QR-Codes zum Event mit</li>
                    <li>Du kannst diese Email auch ausdrucken</li>
                    <li>Jeder QR-Code kann nur einmal gescannt werden</li>
                    <li>Teile deine Tickets nicht öffentlich</li>
                    <li>Bei Problemen schreib uns auf Instagram oder per Email unter verdrehte.welt.ev@gmail.com</li>
                </ul>
            </div>
            
            <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #333;">
                <p>Wir freuen uns auf dich! 🎵</p>
                <p style="margin-top: 20px;">
                    <a href="https://www.instagram.com/verdrehte.welt.official/" 
                       style="color: #fff; text-decoration: none;">
                        @verdrehte.welt.official
                    </a>
                </p>
            </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px; opacity: 0.6; font-size: 0.85rem;">
            <p>© 2025 Verdrehte Welt</p>
            <p>
                <a href="https://verdrehtewelt.de/impressum.html" style="color: #999;">Impressum</a> | 
                <a href="https://verdrehtewelt.de/datenschutz.html" style="color: #999;">Datenschutz</a> | 
                <a href="https://verdrehtewelt.de/agb.html" style="color: #999;">AGB</a>
            </p>
        </div>
    </div>
</body>
</html>
        `;
        
        // Send with Resend or log in dev mode
        if (resend) {
            const emailData = {
                from: process.env.MAIL_FROM || 'noreply@verdrehte-welt.com',
                to: email,
                subject: '🎉 Deine Verdrehte Welt Tickets',
                html,
                attachments
            };
            
            console.log(`[Email] Sending with ${attachments.length} QR code attachments`);
            const data = await resend.emails.send(emailData);
            
            console.log(`[Email] Sent to ${email}, ID: ${data.id}`);
            return data;
        } else {
            // Dev mode - just log
            console.log(`[Email] DEV MODE - Would send to ${email}`);
            console.log(`[Email] Subject: 🎉 Deine Verdrehte Welt Tickets`);
            console.log(`[Email] Tickets: ${tickets.length}`);
            console.log(`[Email] Attachments: ${attachments.length}`);
            return { messageId: 'dev-' + Date.now() };
        }
        
    } catch (error) {
        console.error('[Email] Error:', error);
        throw error;
    }
}

async function sendInternalOrderNotification(order) {
    try {
        const internalEmail = process.env.INTERNAL_NOTIFICATION_EMAIL;
        if (!internalEmail) {
            console.log('[Email] No internal notification email configured');
            return;
        }
        
        const orderDate = new Date(order.erstellt_at || order.createdAt);
        const orderDetails = order.positionen.map(pos => 
            `${pos.menge}x ${pos.bezeichnung} à ${pos.einzelpreisBrutto.toFixed(2)}€ = ${pos.summe.toFixed(2)}€`
        ).join('\n');
        
        const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
</head>
<body style="margin: 0; padding: 0; background: #f4f4f4; font-family: Arial, sans-serif;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #fff; padding: 30px; border-radius: 8px;">
            <h2 style="color: #333; margin-top: 0;">Neue Ticketbestellung 🎫</h2>
            
            <div style="margin: 20px 0; padding: 15px; background: #f9f9f9; border-left: 4px solid #4CAF50;">
                <p style="margin: 5px 0;"><strong>Bestell-ID:</strong> ${order._id}</p>
                <p style="margin: 5px 0;"><strong>Käufer:</strong> ${order.vorname} ${order.nachname}</p>
                <p style="margin: 5px 0;"><strong>E-Mail:</strong> ${order.email}</p>
                <p style="margin: 5px 0;"><strong>Kaufdatum:</strong> ${orderDate.toLocaleDateString('de-DE')}</p>
                <p style="margin: 5px 0;"><strong>Kaufuhrzeit:</strong> ${orderDate.toLocaleTimeString('de-DE')}</p>
                <p style="margin: 5px 0;"><strong>Event:</strong> ${order.eventId}</p>
            </div>
            
            <h3 style="color: #333;">Bestellte Tickets:</h3>
            <pre style="background: #f9f9f9; padding: 15px; border-radius: 4px; overflow-x: auto;">${orderDetails}</pre>
            
            <div style="margin: 20px 0; padding: 15px; background: #e8f5e9; border-radius: 4px;">
                <p style="margin: 5px 0; font-size: 18px; font-weight: bold; color: #2e7d32;">Gesamtpreis: ${order.summeBrutto.toFixed(2)}€</p>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
                <p>Dies ist eine automatische Benachrichtigung über eine neue Bestellung.</p>
            </div>
        </div>
    </div>
</body>
</html>
        `;
        
        if (resend) {
            const emailData = {
                from: process.env.MAIL_FROM || 'noreply@verdrehte-welt.com',
                to: internalEmail,
                subject: `🎫 Neue Bestellung: ${order._id}`,
                html
            };
            
            const data = await resend.emails.send(emailData);
            console.log(`[Email] Internal notification sent, ID: ${data.id}`);
            return data;
        } else {
            console.log(`[Email] DEV MODE - Would send internal notification to ${internalEmail}`);
            return { messageId: 'dev-internal-' + Date.now() };
        }
        
    } catch (error) {
        console.error('[Email] Internal notification error:', error);
        throw error;
    }
}

async function sendCustomerEmailConfirmation(order) {
    try {
        const internalEmail = process.env.INTERNAL_NOTIFICATION_EMAIL;
        if (!internalEmail) {
            console.log('[Email] No internal notification email configured');
            return;
        }
        
        const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
</head>
<body style="margin: 0; padding: 0; background: #f4f4f4; font-family: Arial, sans-serif;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #fff; padding: 30px; border-radius: 8px;">
            <h2 style="color: #333; margin-top: 0;">✅ Kunden-E-Mail erfolgreich versendet</h2>
            
            <div style="margin: 20px 0; padding: 15px; background: #e3f2fd; border-left: 4px solid #2196F3;">
                <p style="margin: 5px 0;"><strong>Bestell-ID:</strong> ${order._id}</p>
                <p style="margin: 5px 0;"><strong>Empfänger:</strong> ${order.email}</p>
                <p style="margin: 5px 0;"><strong>Zeitpunkt:</strong> ${new Date().toLocaleString('de-DE')}</p>
                <p style="margin: 5px 0;"><strong>Gesamtbetrag:</strong> ${order.summeBrutto.toFixed(2)}€</p>
            </div>
            
            <p style="color: #666;">Die Ticket-E-Mail mit QR-Codes wurde erfolgreich an den Kunden versendet.</p>
            <p style="color: #666;">Diese Bestätigung kann für PayPal-Nachweise verwendet werden.</p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
                <p>Dies ist eine automatische Bestätigung des E-Mail-Versands.</p>
            </div>
        </div>
    </div>
</body>
</html>
        `;
        
        if (resend) {
            const emailData = {
                from: process.env.MAIL_FROM || 'noreply@verdrehte-welt.com',
                to: internalEmail,
                subject: `✅ E-Mail-Versand bestätigt: ${order._id}`,
                html
            };
            
            const data = await resend.emails.send(emailData);
            console.log(`[Email] Customer email confirmation sent, ID: ${data.id}`);
            return data;
        } else {
            console.log(`[Email] DEV MODE - Would send customer email confirmation to ${internalEmail}`);
            return { messageId: 'dev-confirmation-' + Date.now() };
        }
        
    } catch (error) {
        console.error('[Email] Customer email confirmation error:', error);
        throw error;
    }
}

module.exports = {
    sendTicketEmail,
    sendInternalOrderNotification,
    sendCustomerEmailConfirmation
};
