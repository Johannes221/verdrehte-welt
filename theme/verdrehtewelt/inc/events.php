<?php
/**
 * Event Functions
 * 
 * @package VerdrehteWelt
 */

if (!defined('ABSPATH')) exit;

/**
 * Get Event Meta Data
 */
function vw_get_event_meta($event_id) {
    return array(
        'date'            => get_post_meta($event_id, '_vw_event_date', true),
        'time_start'      => get_post_meta($event_id, '_vw_event_time_start', true),
        'time_end'        => get_post_meta($event_id, '_vw_event_time_end', true),
        'location_name'   => get_post_meta($event_id, '_vw_location_name', true),
        'location_address'=> get_post_meta($event_id, '_vw_location_address', true),
        'genres'          => get_post_meta($event_id, '_vw_genres', true),
        'ticket_early'    => get_post_meta($event_id, '_vw_ticket_early', true),
        'ticket_regular'  => get_post_meta($event_id, '_vw_ticket_regular', true),
        'ticket_door'     => get_post_meta($event_id, '_vw_ticket_door', true),
    );
}

/**
 * Get formatted event date
 */
function vw_get_formatted_date($event_id) {
    $meta = vw_get_event_meta($event_id);
    
    if (empty($meta['date'])) {
        return 'TBD';
    }
    
    $date = DateTime::createFromFormat('Y-m-d', $meta['date']);
    if (!$date) {
        return $meta['date'];
    }
    
    $formatted = $date->format('d.m.Y');
    
    if (!empty($meta['time_start'])) {
        $formatted .= ' ' . $meta['time_start'];
    }
    
    if (!empty($meta['time_end'])) {
        $formatted .= ' – ' . $meta['time_end'];
    }
    
    return $formatted;
}

/**
 * Get available ticket types for event
 */
function vw_get_available_tickets($event_id) {
    $meta = vw_get_event_meta($event_id);
    $available = array();
    $now = current_time('timestamp');
    
    // Early Bird
    if (!empty($meta['ticket_early'])) {
        $early = json_decode($meta['ticket_early'], true);
        if ($early && vw_is_ticket_available($early, $now)) {
            $available[] = array(
                'type' => 'early',
                'name' => 'Early Bird',
                'price' => $early['price'],
                'available_until' => $early['available_until'],
            );
        }
    }
    
    // Regular
    if (!empty($meta['ticket_regular'])) {
        $regular = json_decode($meta['ticket_regular'], true);
        if ($regular && vw_is_ticket_available($regular, $now)) {
            $available[] = array(
                'type' => 'regular',
                'name' => 'Vorverkauf',
                'price' => $regular['price'],
                'available_until' => $regular['available_until'],
            );
        }
    }
    
    // Door
    if (!empty($meta['ticket_door'])) {
        $door = json_decode($meta['ticket_door'], true);
        if ($door) {
            $available[] = array(
                'type' => 'door',
                'name' => 'Abendkasse',
                'price' => $door['price'],
                'available_until' => null, // Always available
            );
        }
    }
    
    return $available;
}

/**
 * Check if ticket type is currently available
 */
function vw_is_ticket_available($ticket_data, $now) {
    if (empty($ticket_data)) {
        return false;
    }
    
    // Check if ticket has availability window
    if (!empty($ticket_data['available_from'])) {
        $from = strtotime($ticket_data['available_from']);
        if ($now < $from) {
            return false;
        }
    }
    
    if (!empty($ticket_data['available_until'])) {
        $until = strtotime($ticket_data['available_until']);
        if ($now > $until) {
            return false;
        }
    }
    
    return true;
}

/**
 * Get ticket stats for event
 */
function vw_get_ticket_stats($event_id) {
    global $wpdb;
    
    $stats = $wpdb->get_row($wpdb->prepare("
        SELECT 
            COUNT(*) as total_sold,
            SUM(CASE WHEN status = 'valid' THEN 1 ELSE 0 END) as valid,
            SUM(CASE WHEN status = 'checked_in' THEN 1 ELSE 0 END) as checked_in
        FROM {$wpdb->prefix}vw_tickets
        WHERE event_id = %d
    ", $event_id), ARRAY_A);
    
    return $stats ?: array('total_sold' => 0, 'valid' => 0, 'checked_in' => 0);
}
