<?php
/**
 * PayPal Payment Integration (Simplified - Direct to one account)
 * 
 * @package VerdrehteWelt
 */

if (!defined('ABSPATH')) exit;

/**
 * PayPal Configuration
 * NOTE: Diese Werte werden in den Theme-Optionen hinterlegt
 */
function vw_get_paypal_config() {
    return array(
        'client_id'     => get_option('vw_paypal_client_id', ''),
        'client_secret' => get_option('vw_paypal_client_secret', ''),
        'mode'          => get_option('vw_paypal_mode', 'sandbox'), // sandbox or live
    );
}

/**
 * Get PayPal API base URL
 */
function vw_get_paypal_api_url() {
    $config = vw_get_paypal_config();
    return $config['mode'] === 'live' 
        ? 'https://api-m.paypal.com'
        : 'https://api-m.sandbox.paypal.com';
}

/**
 * Get PayPal Access Token
 */
function vw_get_paypal_access_token() {
    $config = vw_get_paypal_config();
    
    if (empty($config['client_id']) || empty($config['client_secret'])) {
        return new WP_Error('paypal_not_configured', 'PayPal nicht konfiguriert');
    }
    
    $url = vw_get_paypal_api_url() . '/v1/oauth2/token';
    
    $response = wp_remote_post($url, array(
        'headers' => array(
            'Authorization' => 'Basic ' . base64_encode($config['client_id'] . ':' . $config['client_secret']),
            'Content-Type'  => 'application/x-www-form-urlencoded',
        ),
        'body' => array(
            'grant_type' => 'client_credentials',
        ),
    ));
    
    if (is_wp_error($response)) {
        return $response;
    }
    
    $body = json_decode(wp_remote_retrieve_body($response), true);
    
    if (empty($body['access_token'])) {
        return new WP_Error('token_error', 'Konnte Access Token nicht abrufen');
    }
    
    return $body['access_token'];
}

/**
 * Create PayPal Order
 */
function vw_create_paypal_order($order_id) {
    global $wpdb;
    
    // Get order
    $order = vw_get_order($order_id);
    if (!$order) {
        return new WP_Error('order_not_found', 'Bestellung nicht gefunden');
    }
    
    // Check if PayPal order already exists
    if (!empty($order->paypal_order_id)) {
        return new WP_Error('paypal_order_exists', 'PayPal-Bestellung existiert bereits');
    }
    
    // Get access token
    $access_token = vw_get_paypal_access_token();
    if (is_wp_error($access_token)) {
        return $access_token;
    }
    
    // Get event details
    $event = get_post($order->event_id);
    $event_title = $event ? $event->post_title : 'Event';
    
    // Create PayPal order
    $url = vw_get_paypal_api_url() . '/v2/checkout/orders';
    
    $order_data = array(
        'intent' => 'CAPTURE',
        'purchase_units' => array(
            array(
                'reference_id' => $order_id,
                'description'  => 'Ticket für ' . $event_title,
                'amount'       => array(
                    'currency_code' => 'EUR',
                    'value'         => number_format($order->summe_brutto, 2, '.', ''),
                ),
            ),
        ),
        'application_context' => array(
            'brand_name' => 'Verdrehte Welt',
            'return_url' => home_url('/payment-success?order_id=' . $order_id),
            'cancel_url' => home_url('/payment-cancel?order_id=' . $order_id),
            'user_action' => 'PAY_NOW',
        ),
    );
    
    $response = wp_remote_post($url, array(
        'headers' => array(
            'Authorization' => 'Bearer ' . $access_token,
            'Content-Type'  => 'application/json',
        ),
        'body' => json_encode($order_data),
    ));
    
    if (is_wp_error($response)) {
        return $response;
    }
    
    $body = json_decode(wp_remote_retrieve_body($response), true);
    
    if (empty($body['id'])) {
        return new WP_Error('paypal_order_error', 'PayPal-Bestellung konnte nicht erstellt werden');
    }
    
    // Save PayPal order ID
    $wpdb->update(
        $wpdb->prefix . 'vw_orders',
        array(
            'paypal_order_id' => $body['id'],
            'status'          => 'pending',
        ),
        array('id' => $order_id),
        array('%s', '%s'),
        array('%d')
    );
    
    // Get approval URL
    $approval_url = '';
    foreach ($body['links'] as $link) {
        if ($link['rel'] === 'approve') {
            $approval_url = $link['href'];
            break;
        }
    }
    
    return array(
        'paypal_order_id' => $body['id'],
        'approval_url'    => $approval_url,
    );
}

/**
 * Capture PayPal Payment
 */
function vw_capture_paypal_payment($paypal_order_id) {
    global $wpdb;
    
    // Get order
    $order = $wpdb->get_row($wpdb->prepare(
        "SELECT * FROM {$wpdb->prefix}vw_orders WHERE paypal_order_id = %s",
        $paypal_order_id
    ));
    
    if (!$order) {
        return new WP_Error('order_not_found', 'Bestellung nicht gefunden');
    }
    
    // Check if already paid
    if ($order->status === 'paid') {
        return array('success' => true, 'message' => 'Bereits bezahlt');
    }
    
    // Get access token
    $access_token = vw_get_paypal_access_token();
    if (is_wp_error($access_token)) {
        return $access_token;
    }
    
    // Capture payment
    $url = vw_get_paypal_api_url() . '/v2/checkout/orders/' . $paypal_order_id . '/capture';
    
    $response = wp_remote_post($url, array(
        'headers' => array(
            'Authorization' => 'Bearer ' . $access_token,
            'Content-Type'  => 'application/json',
        ),
    ));
    
    if (is_wp_error($response)) {
        return $response;
    }
    
    $body = json_decode(wp_remote_retrieve_body($response), true);
    
    if (empty($body['purchase_units'][0]['payments']['captures'][0])) {
        return new WP_Error('capture_error', 'Payment konnte nicht erfasst werden');
    }
    
    $capture = $body['purchase_units'][0]['payments']['captures'][0];
    
    if ($capture['status'] !== 'COMPLETED') {
        return new WP_Error('capture_incomplete', 'Payment nicht abgeschlossen');
    }
    
    // Update order
    vw_update_order_status($order->id, 'paid', $capture['id']);
    
    // Generate tickets
    vw_generate_tickets($order->id);
    
    return array(
        'success'    => true,
        'capture_id' => $capture['id'],
        'order_id'   => $order->id,
    );
}
