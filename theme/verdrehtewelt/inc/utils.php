<?php
/**
 * Utility Functions
 * 
 * @package VerdrehteWelt
 */

if (!defined('ABSPATH')) exit;

/**
 * Format price
 */
function vw_format_price($price) {
    return number_format($price, 2, ',', '.') . ' €';
}

/**
 * Get event card data
 */
function vw_get_event_card_data($event_id) {
    $meta = vw_get_event_meta($event_id);
    $tickets = vw_get_available_tickets($event_id);
    
    $lowest_price = null;
    $highest_price = null;
    
    foreach ($tickets as $ticket) {
        if ($lowest_price === null || $ticket['price'] < $lowest_price) {
            $lowest_price = $ticket['price'];
        }
        if ($highest_price === null || $ticket['price'] > $highest_price) {
            $highest_price = $ticket['price'];
        }
    }
    
    return array(
        'id'            => $event_id,
        'title'         => get_the_title($event_id),
        'excerpt'       => get_the_excerpt($event_id),
        'permalink'     => get_permalink($event_id),
        'thumbnail'     => get_the_post_thumbnail_url($event_id, 'vw-event-card'),
        'date'          => vw_get_formatted_date($event_id),
        'location'      => $meta['location_name'],
        'address'       => $meta['location_address'],
        'genres'        => $meta['genres'],
        'lowest_price'  => $lowest_price,
        'highest_price' => $highest_price,
        'tickets'       => $tickets,
    );
}

/**
 * Sanitize ticket data
 */
function vw_sanitize_ticket_data($data) {
    return array(
        'price' => floatval($data['price'] ?? 0),
        'available_from' => sanitize_text_field($data['available_from'] ?? ''),
        'available_until' => sanitize_text_field($data['available_until'] ?? ''),
    );
}

/**
 * Log error
 */
function vw_log_error($message, $context = array()) {
    if (WP_DEBUG && WP_DEBUG_LOG) {
        error_log('[Verdrehte Welt] ' . $message . ' ' . print_r($context, true));
    }
}
