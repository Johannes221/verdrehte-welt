<?php
/**
 * REST API Endpoints
 * 
 * @package VerdrehteWelt
 */

if (!defined('ABSPATH')) exit;

/**
 * Register REST API Routes
 */
add_action('rest_api_init', function() {
    // Create Order
    register_rest_route('vw/v1', '/orders/create', array(
        'methods'  => 'POST',
        'callback' => 'vw_rest_create_order',
        'permission_callback' => '__return_true',
    ));
    
    // Create PayPal Order
    register_rest_route('vw/v1', '/payments/paypal/create-order', array(
        'methods'  => 'POST',
        'callback' => 'vw_rest_create_paypal_order',
        'permission_callback' => '__return_true',
    ));
    
    // Capture PayPal Payment
    register_rest_route('vw/v1', '/payments/paypal/capture', array(
        'methods'  => 'POST',
        'callback' => 'vw_rest_capture_paypal_payment',
        'permission_callback' => '__return_true',
    ));
    
    // Verify QR Code (for check-in)
    register_rest_route('vw/v1', '/checkin/verify', array(
        'methods'  => 'POST',
        'callback' => 'vw_rest_verify_qr',
        'permission_callback' => 'vw_check_admin_permission',
    ));
    
    // Check-in ticket
    register_rest_route('vw/v1', '/checkin/scan', array(
        'methods'  => 'POST',
        'callback' => 'vw_rest_checkin_ticket',
        'permission_callback' => 'vw_check_admin_permission',
    ));
});

/**
 * REST: Create Order
 */
function vw_rest_create_order($request) {
    $params = $request->get_json_params();
    
    $result = vw_create_order($params);
    
    if (is_wp_error($result)) {
        return new WP_REST_Response(array(
            'error' => array(
                'code' => $result->get_error_code(),
                'message' => $result->get_error_message(),
            ),
        ), 400);
    }
    
    return new WP_REST_Response(array(
        'success' => true,
        'order' => $result,
    ), 201);
}

/**
 * REST: Create PayPal Order
 */
function vw_rest_create_paypal_order($request) {
    $params = $request->get_json_params();
    
    if (empty($params['order_id'])) {
        return new WP_REST_Response(array(
            'error' => array('code' => 'missing_order_id', 'message' => 'Order ID erforderlich'),
        ), 400);
    }
    
    $result = vw_create_paypal_order($params['order_id']);
    
    if (is_wp_error($result)) {
        return new WP_REST_Response(array(
            'error' => array(
                'code' => $result->get_error_code(),
                'message' => $result->get_error_message(),
            ),
        ), 400);
    }
    
    return new WP_REST_Response($result, 200);
}

/**
 * REST: Capture PayPal Payment
 */
function vw_rest_capture_paypal_payment($request) {
    $params = $request->get_json_params();
    
    if (empty($params['paypal_order_id'])) {
        return new WP_REST_Response(array(
            'error' => array('code' => 'missing_paypal_order_id', 'message' => 'PayPal Order ID erforderlich'),
        ), 400);
    }
    
    $result = vw_capture_paypal_payment($params['paypal_order_id']);
    
    if (is_wp_error($result)) {
        return new WP_REST_Response(array(
            'error' => array(
                'code' => $result->get_error_code(),
                'message' => $result->get_error_message(),
            ),
        ), 400);
    }
    
    return new WP_REST_Response($result, 200);
}

/**
 * REST: Verify QR Code
 */
function vw_rest_verify_qr($request) {
    $params = $request->get_json_params();
    
    if (empty($params['qr_token'])) {
        return new WP_REST_Response(array(
            'error' => 'QR Token erforderlich',
        ), 400);
    }
    
    $payload = vw_verify_qr_token($params['qr_token']);
    
    if (is_wp_error($payload)) {
        return new WP_REST_Response(array(
            'valid' => false,
            'error' => $payload->get_error_message(),
        ), 200);
    }
    
    // Get ticket by order ID (from token payload)
    global $wpdb;
    $ticket = $wpdb->get_row($wpdb->prepare(
        "SELECT * FROM {$wpdb->prefix}vw_tickets WHERE order_id = %d",
        $payload['sub']
    ));
    
    if (!$ticket) {
        return new WP_REST_Response(array(
            'valid' => false,
            'error' => 'Ticket nicht gefunden',
        ), 200);
    }
    
    return new WP_REST_Response(array(
        'valid' => true,
        'ticket' => array(
            'id' => $ticket->id,
            'status' => $ticket->status,
            'event_id' => $ticket->event_id,
            'ticket_type' => $ticket->ticket_type,
            'checked_in_at' => $ticket->checked_in_at,
        ),
    ), 200);
}

/**
 * REST: Check-in Ticket
 */
function vw_rest_checkin_ticket($request) {
    $params = $request->get_json_params();
    
    if (empty($params['ticket_id'])) {
        return new WP_REST_Response(array(
            'error' => 'Ticket ID erforderlich',
        ), 400);
    }
    
    $result = vw_checkin_ticket($params['ticket_id']);
    
    if (is_wp_error($result)) {
        return new WP_REST_Response(array(
            'success' => false,
            'error' => $result->get_error_message(),
            'error_data' => $result->get_error_data(),
        ), 400);
    }
    
    return new WP_REST_Response(array(
        'success' => true,
        'data' => $result,
    ), 200);
}

/**
 * Check Admin Permission
 */
function vw_check_admin_permission() {
    return current_user_can('manage_options');
}
