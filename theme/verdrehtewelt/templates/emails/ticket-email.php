<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #ffffff;
            background-color: #000000;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            text-align: center;
            padding: 30px 0;
            border-bottom: 2px solid #ffffff;
        }
        .header h1 {
            font-size: 32px;
            margin: 0;
            letter-spacing: 2px;
            color: #ffffff;
        }
        .ticket-card {
            background-color: #1a1a1a;
            border: 2px solid #ffffff;
            padding: 30px;
            margin: 30px 0;
            text-align: center;
        }
        .qr-code {
            margin: 20px 0;
        }
        .qr-code img {
            max-width: 300px;
            background: #ffffff;
            padding: 20px;
            border-radius: 8px;
        }
        .event-info {
            margin: 20px 0;
            text-align: left;
        }
        .event-info p {
            margin: 10px 0;
            font-size: 14px;
        }
        .event-info strong {
            color: #ffffff;
        }
        .footer {
            text-align: center;
            padding: 30px 0;
            border-top: 1px solid #333;
            font-size: 12px;
            color: #999;
        }
        .important {
            background-color: #1a1a1a;
            border-left: 4px solid #ffffff;
            padding: 15px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>VERDREHTE WELT</h1>
            <p>Dein Ticket ist da!</p>
        </div>
        
        <div class="ticket-card">
            <h2 style="margin-top: 0;"><?php echo esc_html($event->post_title); ?></h2>
            
            <div class="event-info">
                <p><strong>Datum:</strong> <?php echo esc_html(vw_get_formatted_date($event->ID)); ?></p>
                <?php if (!empty($event_meta['location_name'])): ?>
                <p><strong>Location:</strong> <?php echo esc_html($event_meta['location_name']); ?></p>
                <?php endif; ?>
                <?php if (!empty($event_meta['location_address'])): ?>
                <p><strong>Adresse:</strong> <?php echo esc_html($event_meta['location_address']); ?></p>
                <?php endif; ?>
                <?php if (!empty($event_meta['genres'])): ?>
                <p><strong>Genres:</strong> <?php echo esc_html($event_meta['genres']); ?></p>
                <?php endif; ?>
                <p><strong>Ticket-Typ:</strong> <?php echo esc_html(ucfirst($ticket->ticket_type)); ?></p>
                <p><strong>Preis:</strong> <?php echo vw_format_price($order->summe_brutto); ?></p>
            </div>
            
            <div class="qr-code">
                <img src="<?php echo esc_url($qr_image_url); ?>" alt="QR Code" />
                <p style="font-size: 14px; margin-top: 10px;">Zeige diesen QR-Code am Einlass vor</p>
            </div>
        </div>
        
        <div class="important">
            <p><strong>Wichtige Hinweise:</strong></p>
            <ul style="text-align: left;">
                <li>Bewahre dieses Ticket sicher auf (Screenshot oder ausdrucken)</li>
                <li>Der QR-Code ist einmalig gültig</li>
                <li>Bei Verlust melde dich unter: info@verdrehtewelt.de</li>
            </ul>
        </div>
        
        <div class="footer">
            <p>Verdrehte Welt - Techno Events</p>
            <p>Bestellnummer: <?php echo esc_html($order->id); ?></p>
            <p>Bei Fragen: info@verdrehtewelt.de</p>
        </div>
    </div>
</body>
</html>
