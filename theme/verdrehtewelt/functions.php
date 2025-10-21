<?php
/**
 * Verdrehte Welt Theme Functions
 * 
 * @package VerdrehteWelt
 * @version 1.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) exit;

// Theme Constants
define('VW_VERSION', '1.0.0');
define('VW_THEME_DIR', get_template_directory());
define('VW_THEME_URI', get_template_directory_uri());
define('VW_INC_DIR', VW_THEME_DIR . '/inc');

/**
 * Theme Setup
 */
function vw_theme_setup() {
    // Add theme support
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('html5', array('search-form', 'comment-form', 'comment-list', 'gallery', 'caption'));
    add_theme_support('custom-logo');
    
    // Register navigation menus
    register_nav_menus(array(
        'primary' => __('Primary Menu', 'verdrehtewelt'),
        'footer'  => __('Footer Menu', 'verdrehtewelt'),
    ));
    
    // Image sizes
    add_image_size('vw-event-card', 800, 600, true);
    add_image_size('vw-event-hero', 1920, 1080, true);
}
add_action('after_setup_theme', 'vw_theme_setup');

/**
 * Enqueue Styles & Scripts
 */
function vw_enqueue_assets() {
    // Main CSS (TailwindCSS will be compiled here)
    wp_enqueue_style('vw-main', VW_THEME_URI . '/assets/css/main.css', array(), VW_VERSION);
    
    // Main JS
    wp_enqueue_script('vw-main', VW_THEME_URI . '/assets/js/main.js', array(), VW_VERSION, true);
    
    // Checkout JS (only on event pages)
    if (is_singular('vw_event')) {
        wp_enqueue_script('vw-checkout', VW_THEME_URI . '/assets/js/checkout.js', array('vw-main'), VW_VERSION, true);
        
        // Localize script for AJAX
        wp_localize_script('vw-checkout', 'vwData', array(
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('vw_checkout_nonce'),
        ));
    }
}
add_action('wp_enqueue_scripts', 'vw_enqueue_assets');

/**
 * Include Required Files
 */
require_once VW_INC_DIR . '/setup.php';           // Custom Post Types & Taxonomies
require_once VW_INC_DIR . '/events.php';          // Event Functions
require_once VW_INC_DIR . '/tickets.php';         // Ticket Management
require_once VW_INC_DIR . '/payments-paypal.php'; // PayPal Integration
require_once VW_INC_DIR . '/qr.php';              // QR Code Generation
require_once VW_INC_DIR . '/mailer.php';          // Email Functions
require_once VW_INC_DIR . '/rest.php';            // REST API Endpoints
require_once VW_INC_DIR . '/utils.php';           // Helper Functions

// Admin includes
if (is_admin()) {
    require_once VW_INC_DIR . '/admin/meta-boxes.php';
    require_once VW_INC_DIR . '/admin/orders-list.php';
    require_once VW_INC_DIR . '/admin/options-page.php';
}

/**
 * Theme Activation Hook
 */
function vw_theme_activation() {
    // Create database tables
    vw_install_tables();
    
    // Flush rewrite rules
    flush_rewrite_rules();
}
register_activation_hook(__FILE__, 'vw_theme_activation');

/**
 * Database Table Installation
 */
function vw_install_tables() {
    global $wpdb;
    $charset_collate = $wpdb->get_charset_collate();
    
    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    
    // Orders Table
    $sql_orders = "CREATE TABLE {$wpdb->prefix}vw_orders (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        vorname VARCHAR(100),
        nachname VARCHAR(100),
        event_id BIGINT UNSIGNED NOT NULL,
        summe_brutto DECIMAL(10,2) NOT NULL,
        waehrung VARCHAR(3) DEFAULT 'EUR',
        status VARCHAR(20) DEFAULT 'offen',
        paypal_order_id VARCHAR(255),
        paypal_capture_id VARCHAR(255) UNIQUE,
        agb_akzeptiert TINYINT(1) DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        paid_at DATETIME,
        INDEX idx_email (email),
        INDEX idx_event_status (event_id, status),
        INDEX idx_paypal_capture (paypal_capture_id)
    ) $charset_collate;";
    
    // Tickets Table
    $sql_tickets = "CREATE TABLE {$wpdb->prefix}vw_tickets (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        order_id BIGINT UNSIGNED NOT NULL,
        event_id BIGINT UNSIGNED NOT NULL,
        ticket_type VARCHAR(50) NOT NULL,
        qr_token TEXT NOT NULL,
        status VARCHAR(20) DEFAULT 'valid',
        email VARCHAR(255),
        checked_in_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_order (order_id),
        INDEX idx_event_status (event_id, status)
    ) $charset_collate;";
    
    dbDelta($sql_orders);
    dbDelta($sql_tickets);
}
