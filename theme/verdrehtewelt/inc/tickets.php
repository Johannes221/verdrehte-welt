<?php
/**
 * Ticket Management Functions
 * 
 * @package VerdrehteWelt
 */

if (!defined('ABSPATH')) exit;

/**
 * Create Order
 */
function vw_create_order($data) {
    global $wpdb;
    
    // Validate required fields
    if (empty($data['email']) || empty($data['event_id']) || empty($data['ticket_type'])) {
        return new WP_Error('missing_fields', 'Email, Event und Ticket-Typ sind erforderlich');
    }
    
    // Validate email
    if (!is_email($data['email'])) {
        return new WP_Error('invalid_email', 'Ungültige Email-Adresse');
    }
    
    // Check if event exists
    $event = get_post($data['event_id']);
    if (!$event || $event->post_type !== 'vw_event') {
        return new WP_Error('event_not_found', 'Event nicht gefunden');
    }
    
    // Get ticket price
    $ticket_price = vw_get_ticket_price($data['event_id'], $data['ticket_type']);
    if (is_wp_error($ticket_price)) {
        return $ticket_price;
    }
    
    // Create order
    $result = $wpdb->insert(
        $wpdb->prefix . 'vw_orders',
        array(
            'email'          => sanitize_email($data['email']),
            'vorname'        => sanitize_text_field($data['vorname'] ?? ''),
            'nachname'       => sanitize_text_field($data['nachname'] ?? ''),
            'event_id'       => absint($data['event_id']),
            'summe_brutto'   => $ticket_price,
            'waehrung'       => 'EUR',
            'status'         => 'offen',
            'agb_akzeptiert' => !empty($data['agb_akzeptiert']) ? 1 : 0,
            'created_at'     => current_time('mysql'),
        ),
        array('%s', '%s', '%s', '%d', '%f', '%s', '%s', '%d', '%s')
    );
    
    if (!$result) {
        return new WP_Error('order_creation_failed', 'Bestellung konnte nicht erstellt werden');
    }
    
    $order_id = $wpdb->insert_id;
    
    // Store ticket type in order meta (using wp_options as fallback)
    update_option('vw_order_' . $order_id . '_ticket_type', $data['ticket_type']);
    
    return array(
        'order_id'      => $order_id,
        'email'         => $data['email'],
        'summe_brutto'  => $ticket_price,
        'status'        => 'offen',
    );
}

/**
 * Get ticket price for event and type
 */
function vw_get_ticket_price($event_id, $ticket_type) {
    $meta = vw_get_event_meta($event_id);
    
    $ticket_data = null;
    switch ($ticket_type) {
        case 'early':
            $ticket_data = json_decode($meta['ticket_early'], true);
            break;
        case 'regular':
            $ticket_data = json_decode($meta['ticket_regular'], true);
            break;
        case 'door':
            $ticket_data = json_decode($meta['ticket_door'], true);
            break;
    }
    
    if (empty($ticket_data) || empty($ticket_data['price'])) {
        return new WP_Error('ticket_not_found', 'Ticket-Typ nicht gefunden oder nicht verfügbar');
    }
    
    return floatval($ticket_data['price']);
}

/**
 * Update order status
 */
function vw_update_order_status($order_id, $status, $capture_id = null) {
    global $wpdb;
    
    $update_data = array('status' => $status);
    $update_format = array('%s');
    
    if ($status === 'paid' && $capture_id) {
        $update_data['paypal_capture_id'] = $capture_id;
        $update_data['paid_at'] = current_time('mysql');
        $update_format[] = '%s';
        $update_format[] = '%s';
    }
    
    return $wpdb->update(
        $wpdb->prefix . 'vw_orders',
        $update_data,
        array('id' => $order_id),
        $update_format,
        array('%d')
    );
}

/**
 * Generate tickets for paid order
 */
function vw_generate_tickets($order_id) {
    global $wpdb;
    
    // Get order
    $order = $wpdb->get_row($wpdb->prepare(
        "SELECT * FROM {$wpdb->prefix}vw_orders WHERE id = %d",
        $order_id
    ));
    
    if (!$order || $order->status !== 'paid') {
        return new WP_Error('order_not_paid', 'Bestellung ist nicht bezahlt');
    }
    
    // Check if tickets already exist
    $existing = $wpdb->get_var($wpdb->prepare(
        "SELECT COUNT(*) FROM {$wpdb->prefix}vw_tickets WHERE order_id = %d",
        $order_id
    ));
    
    if ($existing > 0) {
        return new WP_Error('tickets_exist', 'Tickets wurden bereits generiert');
    }
    
    // Get ticket type
    $ticket_type = get_option('vw_order_' . $order_id . '_ticket_type', 'regular');
    
    // Generate QR token
    $qr_token = vw_generate_qr_token(array(
        'order_id'    => $order_id,
        'event_id'    => $order->event_id,
        'ticket_type' => $ticket_type,
        'email'       => $order->email,
    ));
    
    // Create ticket
    $result = $wpdb->insert(
        $wpdb->prefix . 'vw_tickets',
        array(
            'order_id'    => $order_id,
            'event_id'    => $order->event_id,
            'ticket_type' => $ticket_type,
            'qr_token'    => $qr_token,
            'status'      => 'valid',
            'email'       => $order->email,
            'created_at'  => current_time('mysql'),
        ),
        array('%d', '%d', '%s', '%s', '%s', '%s', '%s')
    );
    
    if (!$result) {
        return new WP_Error('ticket_generation_failed', 'Ticket konnte nicht generiert werden');
    }
    
    $ticket_id = $wpdb->insert_id;
    
    // Send email with QR code
    vw_send_ticket_email($order_id, $ticket_id);
    
    return $ticket_id;
}

/**
 * Get order by ID
 */
function vw_get_order($order_id) {
    global $wpdb;
    
    return $wpdb->get_row($wpdb->prepare(
        "SELECT * FROM {$wpdb->prefix}vw_orders WHERE id = %d",
        $order_id
    ));
}

/**
 * Get ticket by QR token
 */
function vw_get_ticket_by_qr($qr_token) {
    global $wpdb;
    
    return $wpdb->get_row($wpdb->prepare(
        "SELECT * FROM {$wpdb->prefix}vw_tickets WHERE qr_token = %s",
        $qr_token
    ));
}

/**
 * Check in ticket
 */
function vw_checkin_ticket($ticket_id) {
    global $wpdb;
    
    // Get ticket
    $ticket = $wpdb->get_row($wpdb->prepare(
        "SELECT * FROM {$wpdb->prefix}vw_tickets WHERE id = %d",
        $ticket_id
    ));
    
    if (!$ticket) {
        return new WP_Error('ticket_not_found', 'Ticket nicht gefunden');
    }
    
    if ($ticket->status === 'checked_in') {
        return new WP_Error('already_checked_in', 'Ticket wurde bereits verwendet', array(
            'checked_in_at' => $ticket->checked_in_at,
        ));
    }
    
    if ($ticket->status !== 'valid') {
        return new WP_Error('ticket_invalid', 'Ticket ist ungültig');
    }
    
    // Update status
    $result = $wpdb->update(
        $wpdb->prefix . 'vw_tickets',
        array(
            'status'        => 'checked_in',
            'checked_in_at' => current_time('mysql'),
        ),
        array('id' => $ticket_id),
        array('%s', '%s'),
        array('%d')
    );
    
    if (!$result) {
        return new WP_Error('checkin_failed', 'Check-in fehlgeschlagen');
    }
    
    return array(
        'ticket_id'      => $ticket_id,
        'status'         => 'checked_in',
        'checked_in_at'  => current_time('mysql'),
    );
}
