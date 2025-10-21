<?php
/**
 * Email Functions
 * 
 * @package VerdrehteWelt
 */

if (!defined('ABSPATH')) exit;

/**
 * Send Ticket Email
 */
function vw_send_ticket_email($order_id, $ticket_id) {
    global $wpdb;
    
    // Get order and ticket
    $order = vw_get_order($order_id);
    $ticket = $wpdb->get_row($wpdb->prepare(
        "SELECT * FROM {$wpdb->prefix}vw_tickets WHERE id = %d",
        $ticket_id
    ));
    
    if (!$order || !$ticket) {
        return false;
    }
    
    // Get event
    $event = get_post($order->event_id);
    if (!$event) {
        return false;
    }
    
    $event_meta = vw_get_event_meta($order->event_id);
    
    // Generate QR code image URL
    $qr_image_url = vw_generate_qr_image($ticket->qr_token);
    
    // Email subject
    $subject = 'Dein Ticket für ' . $event->post_title;
    
    // Email body
    ob_start();
    include VW_THEME_DIR . '/templates/emails/ticket-email.php';
    $message = ob_get_clean();
    
    // Email headers
    $headers = array(
        'Content-Type: text/html; charset=UTF-8',
        'From: Verdrehte Welt <noreply@verdrehtewelt.de>',
    );
    
    // Send email
    return wp_mail($order->email, $subject, $message, $headers);
}

/**
 * Send Order Confirmation Email (without ticket)
 */
function vw_send_order_confirmation_email($order_id) {
    global $wpdb;
    
    $order = vw_get_order($order_id);
    if (!$order) {
        return false;
    }
    
    $event = get_post($order->event_id);
    if (!$event) {
        return false;
    }
    
    $subject = 'Bestellbestätigung - ' . $event->post_title;
    
    $message = sprintf(
        '<html><body style="font-family: Arial, sans-serif; color: #333;">
        <h2>Bestellbestätigung</h2>
        <p>Vielen Dank für deine Bestellung!</p>
        <p><strong>Event:</strong> %s</p>
        <p><strong>Betrag:</strong> %.2f EUR</p>
        <p><strong>Bestellnummer:</strong> %s</p>
        <p>Dein Ticket wird nach erfolgreicher Zahlung an diese Email gesendet.</p>
        <p>Bei Fragen melde dich unter: info@verdrehtewelt.de</p>
        </body></html>',
        esc_html($event->post_title),
        $order->summe_brutto,
        $order_id
    );
    
    $headers = array(
        'Content-Type: text/html; charset=UTF-8',
        'From: Verdrehte Welt <noreply@verdrehtewelt.de>',
    );
    
    return wp_mail($order->email, $subject, $message, $headers);
}
