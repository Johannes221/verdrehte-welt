<?php
/**
 * Event Meta Boxes
 * 
 * @package VerdrehteWelt
 */

if (!defined('ABSPATH')) exit;

/**
 * Add Event Meta Boxes
 */
function vw_add_event_meta_boxes() {
    add_meta_box(
        'vw_event_details',
        'Event-Details',
        'vw_event_details_callback',
        'vw_event',
        'normal',
        'high'
    );
    
    add_meta_box(
        'vw_event_tickets',
        'Ticket-Einstellungen',
        'vw_event_tickets_callback',
        'vw_event',
        'normal',
        'high'
    );
}
add_action('add_meta_boxes', 'vw_add_event_meta_boxes');

/**
 * Event Details Meta Box Callback
 */
function vw_event_details_callback($post) {
    wp_nonce_field('vw_save_event_meta', 'vw_event_meta_nonce');
    
    $meta = vw_get_event_meta($post->ID);
    ?>
    <div class="vw-meta-box">
        <p>
            <label><strong>Datum:</strong></label><br>
            <input type="date" name="vw_event_date" value="<?php echo esc_attr($meta['date']); ?>" style="width:100%;">
        </p>
        <p>
            <label><strong>Startzeit:</strong></label><br>
            <input type="time" name="vw_event_time_start" value="<?php echo esc_attr($meta['time_start']); ?>" style="width:100%;">
        </p>
        <p>
            <label><strong>Endzeit:</strong></label><br>
            <input type="time" name="vw_event_time_end" value="<?php echo esc_attr($meta['time_end']); ?>" style="width:100%;">
        </p>
        <p>
            <label><strong>Location-Name:</strong></label><br>
            <input type="text" name="vw_location_name" value="<?php echo esc_attr($meta['location_name']); ?>" placeholder="z.B. Mühlbachhalle Dossenheim" style="width:100%;">
        </p>
        <p>
            <label><strong>Adresse:</strong></label><br>
            <input type="text" name="vw_location_address" value="<?php echo esc_attr($meta['location_address']); ?>" placeholder="z.B. Am Sportpl. 1, 69221 Dossenheim" style="width:100%;">
        </p>
        <p>
            <label><strong>Genres (durch / getrennt):</strong></label><br>
            <input type="text" name="vw_genres" value="<?php echo esc_attr($meta['genres']); ?>" placeholder="z.B. Hard Techno / Melodic Techno / Dark Techno" style="width:100%;">
        </p>
    </div>
    <?php
}

/**
 * Event Tickets Meta Box Callback
 */
function vw_event_tickets_callback($post) {
    $meta = vw_get_event_meta($post->ID);
    
    $early = json_decode($meta['ticket_early'], true) ?: array();
    $regular = json_decode($meta['ticket_regular'], true) ?: array();
    $door = json_decode($meta['ticket_door'], true) ?: array();
    ?>
    <div class="vw-meta-box">
        <h3>Early Bird</h3>
        <p>
            <label>Preis (€):</label>
            <input type="number" step="0.01" name="vw_ticket_early[price]" value="<?php echo esc_attr($early['price'] ?? ''); ?>" placeholder="z.B. 8">
        </p>
        <p>
            <label>Verfügbar bis (Datum + Zeit):</label>
            <input type="datetime-local" name="vw_ticket_early[available_until]" value="<?php echo esc_attr($early['available_until'] ?? ''); ?>">
        </p>
        
        <h3>Regular (Vorverkauf)</h3>
        <p>
            <label>Preis (€):</label>
            <input type="number" step="0.01" name="vw_ticket_regular[price]" value="<?php echo esc_attr($regular['price'] ?? ''); ?>" placeholder="z.B. 10">
        </p>
        <p>
            <label>Verfügbar bis (Datum + Zeit):</label>
            <input type="datetime-local" name="vw_ticket_regular[available_until]" value="<?php echo esc_attr($regular['available_until'] ?? ''); ?>">
        </p>
        
        <h3>Abendkasse</h3>
        <p>
            <label>Preis (€):</label>
            <input type="number" step="0.01" name="vw_ticket_door[price]" value="<?php echo esc_attr($door['price'] ?? ''); ?>" placeholder="z.B. 12">
        </p>
        <p><em>Abendkasse ist immer verfügbar (bis zum Event).</em></p>
    </div>
    <style>
        .vw-meta-box h3 { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; }
        .vw-meta-box h3:first-child { margin-top: 0; padding-top: 0; border: none; }
        .vw-meta-box label { display: block; margin-bottom: 5px; font-weight: bold; }
        .vw-meta-box input { width: 100%; max-width: 400px; }
    </style>
    <?php
}

/**
 * Save Event Meta
 */
function vw_save_event_meta($post_id) {
    if (!isset($_POST['vw_event_meta_nonce']) || !wp_verify_nonce($_POST['vw_event_meta_nonce'], 'vw_save_event_meta')) {
        return;
    }
    
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    
    if (!current_user_can('edit_post', $post_id)) {
        return;
    }
    
    // Event details
    update_post_meta($post_id, '_vw_event_date', sanitize_text_field($_POST['vw_event_date'] ?? ''));
    update_post_meta($post_id, '_vw_event_time_start', sanitize_text_field($_POST['vw_event_time_start'] ?? ''));
    update_post_meta($post_id, '_vw_event_time_end', sanitize_text_field($_POST['vw_event_time_end'] ?? ''));
    update_post_meta($post_id, '_vw_location_name', sanitize_text_field($_POST['vw_location_name'] ?? ''));
    update_post_meta($post_id, '_vw_location_address', sanitize_text_field($_POST['vw_location_address'] ?? ''));
    update_post_meta($post_id, '_vw_genres', sanitize_text_field($_POST['vw_genres'] ?? ''));
    
    // Tickets
    if (isset($_POST['vw_ticket_early'])) {
        $early = vw_sanitize_ticket_data($_POST['vw_ticket_early']);
        update_post_meta($post_id, '_vw_ticket_early', json_encode($early));
    }
    
    if (isset($_POST['vw_ticket_regular'])) {
        $regular = vw_sanitize_ticket_data($_POST['vw_ticket_regular']);
        update_post_meta($post_id, '_vw_ticket_regular', json_encode($regular));
    }
    
    if (isset($_POST['vw_ticket_door'])) {
        $door = vw_sanitize_ticket_data($_POST['vw_ticket_door']);
        update_post_meta($post_id, '_vw_ticket_door', json_encode($door));
    }
}
add_action('save_post_vw_event', 'vw_save_event_meta');
