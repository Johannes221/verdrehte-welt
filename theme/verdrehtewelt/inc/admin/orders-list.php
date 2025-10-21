<?php
/**
 * Orders List Admin Page
 * 
 * @package VerdrehteWelt
 */

if (!defined('ABSPATH')) exit;

/**
 * Add Orders Menu
 */
function vw_add_orders_menu() {
    add_menu_page(
        'Bestellungen',
        'Bestellungen',
        'manage_options',
        'vw-orders',
        'vw_orders_page',
        'dashicons-cart',
        6
    );
    
    add_submenu_page(
        'vw-orders',
        'Ticket Scanner',
        'Ticket Scanner',
        'manage_options',
        'vw-scanner',
        'vw_scanner_page'
    );
}
add_action('admin_menu', 'vw_add_orders_menu');

/**
 * Orders Page
 */
function vw_orders_page() {
    global $wpdb;
    
    $orders = $wpdb->get_results(
        "SELECT o.*, p.post_title as event_title 
         FROM {$wpdb->prefix}vw_orders o
         LEFT JOIN {$wpdb->prefix}posts p ON o.event_id = p.ID
         ORDER BY o.created_at DESC
         LIMIT 100"
    );
    
    ?>
    <div class="wrap">
        <h1>Bestellungen</h1>
        <table class="wp-list-table widefat fixed striped">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Email</th>
                    <th>Event</th>
                    <th>Betrag</th>
                    <th>Status</th>
                    <th>Datum</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($orders as $order): ?>
                <tr>
                    <td><?php echo esc_html($order->id); ?></td>
                    <td><?php echo esc_html($order->email); ?></td>
                    <td><?php echo esc_html($order->event_title); ?></td>
                    <td><?php echo vw_format_price($order->summe_brutto); ?></td>
                    <td>
                        <span class="vw-status vw-status-<?php echo esc_attr($order->status); ?>">
                            <?php echo esc_html(ucfirst($order->status)); ?>
                        </span>
                    </td>
                    <td><?php echo esc_html($order->created_at); ?></td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
    <style>
        .vw-status { padding: 3px 8px; border-radius: 3px; font-size: 12px; font-weight: bold; }
        .vw-status-offen { background: #f0f0f0; color: #666; }
        .vw-status-pending { background: #fff3cd; color: #856404; }
        .vw-status-paid { background: #d4edda; color: #155724; }
    </style>
    <?php
}

/**
 * Scanner Page
 */
function vw_scanner_page() {
    ?>
    <div class="wrap">
        <h1>Ticket Scanner</h1>
        <div id="vw-scanner" style="max-width: 600px;">
            <div class="card">
                <h2>QR-Code scannen</h2>
                <p>
                    <label for="qr-input"><strong>QR-Code manuell eingeben:</strong></label><br>
                    <textarea id="qr-input" rows="4" style="width: 100%; font-family: monospace;"></textarea>
                </p>
                <p>
                    <button id="verify-btn" class="button button-primary button-large">Ticket prüfen</button>
                </p>
                <div id="scan-result" style="margin-top: 20px;"></div>
            </div>
        </div>
    </div>
    <script>
    jQuery(document).ready(function($) {
        $('#verify-btn').on('click', function() {
            var token = $('#qr-input').val().trim();
            if (!token) {
                alert('Bitte QR-Code eingeben');
                return;
            }
            
            $('#scan-result').html('<p>Prüfe Ticket...</p>');
            
            $.ajax({
                url: '<?php echo rest_url('vw/v1/checkin/verify'); ?>',
                method: 'POST',
                data: JSON.stringify({ qr_token: token }),
                contentType: 'application/json',
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('X-WP-Nonce', '<?php echo wp_create_nonce('wp_rest'); ?>');
                },
                success: function(response) {
                    if (response.valid) {
                        var html = '<div class="notice notice-success"><p><strong>✓ Ticket gültig</strong></p>';
                        html += '<p>Status: ' + response.ticket.status + '</p>';
                        html += '<p>Ticket-ID: ' + response.ticket.id + '</p>';
                        
                        if (response.ticket.status === 'valid') {
                            html += '<p><button class="button button-primary" onclick="vwCheckinTicket(' + response.ticket.id + ')">EINCHECKEN</button></p>';
                        } else if (response.ticket.status === 'checked_in') {
                            html += '<p style="color: orange;">⚠️ Bereits eingecheckt am ' + response.ticket.checked_in_at + '</p>';
                        }
                        html += '</div>';
                        $('#scan-result').html(html);
                    } else {
                        $('#scan-result').html('<div class="notice notice-error"><p><strong>✗ Ungültiges Ticket</strong></p><p>' + response.error + '</p></div>');
                    }
                },
                error: function() {
                    $('#scan-result').html('<div class="notice notice-error"><p>Fehler beim Prüfen des Tickets</p></div>');
                }
            });
        });
    });
    
    function vwCheckinTicket(ticketId) {
        if (!confirm('Ticket wirklich einchecken?')) return;
        
        jQuery.ajax({
            url: '<?php echo rest_url('vw/v1/checkin/scan'); ?>',
            method: 'POST',
            data: JSON.stringify({ ticket_id: ticketId }),
            contentType: 'application/json',
            beforeSend: function(xhr) {
                xhr.setRequestHeader('X-WP-Nonce', '<?php echo wp_create_nonce('wp_rest'); ?>');
            },
            success: function(response) {
                if (response.success) {
                    alert('✓ Ticket erfolgreich eingecheckt!');
                    jQuery('#qr-input').val('');
                    jQuery('#scan-result').html('<div class="notice notice-success"><p><strong>✓ Erfolgreich eingecheckt!</strong></p></div>');
                } else {
                    alert('Fehler: ' + response.error);
                }
            }
        });
    }
    </script>
    <?php
}
