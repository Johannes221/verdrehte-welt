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
        
        const ticketList = tickets.map((ticket, index) => `
            <div style="margin: 20px 0; padding: 20px; border: 2px solid #333; background: #1a1a1a;">
                <h3 style="margin: 0 0 15px 0;">Ticket ${index + 1}: ${ticket.bezeichnung}</h3>
                <p style="margin: 10px 0;"><strong>Preis:</strong> ${ticket.preis.toFixed(2)} €</p>
                <p style="margin: 10px 0;"><strong>Ticket-ID:</strong> ${ticket._id}</p>
                <div style="text-align: center; margin: 20px 0;">
                    <img src="${ticket.qrCodeUrl}" alt="QR Code" style="max-width: 300px; width: 100%;">
                </div>
                <p style="font-size: 0.9rem; opacity: 0.8; margin-top: 15px;">
                    Zeige diesen QR-Code am Einlass vor. Jedes Ticket kann nur einmal verwendet werden.
                </p>
                ${!ticket.qrCodeUrl ? '<p style="color: #ff6b6b;">⚠️ QR-Code konnte nicht generiert werden. Bitte kontaktiere uns!</p>' : ''}
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
            const data = await resend.emails.send({
                from: process.env.MAIL_FROM || 'noreply@verdrehte-welt.com',
                to: email,
                subject: '🎉 Deine Verdrehte Welt Tickets',
                html
            });
            
            console.log(`[Email] Sent to ${email}, ID: ${data.id}`);
            return data;
        } else {
            // Dev mode - just log
            console.log(`[Email] DEV MODE - Would send to ${email}`);
            console.log(`[Email] Subject: 🎉 Deine Verdrehte Welt Tickets`);
            console.log(`[Email] Tickets: ${tickets.length}`);
            return { messageId: 'dev-' + Date.now() };
        }
        
    } catch (error) {
        console.error('[Email] Error:', error);
        throw error;
    }
}

module.exports = {
    sendTicketEmail
};
