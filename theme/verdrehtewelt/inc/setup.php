<?php
/**
 * Custom Post Types & Taxonomies
 * 
 * @package VerdrehteWelt
 */

if (!defined('ABSPATH')) exit;

/**
 * Register Event Custom Post Type
 */
function vw_register_event_post_type() {
    $labels = array(
        'name'               => 'Events',
        'singular_name'      => 'Event',
        'menu_name'          => 'Events',
        'add_new'            => 'Neues Event',
        'add_new_item'       => 'Neues Event hinzufügen',
        'edit_item'          => 'Event bearbeiten',
        'view_item'          => 'Event ansehen',
        'all_items'          => 'Alle Events',
        'search_items'       => 'Events suchen',
        'not_found'          => 'Keine Events gefunden',
    );
    
    $args = array(
        'labels'              => $labels,
        'public'              => true,
        'publicly_queryable'  => true,
        'show_ui'             => true,
        'show_in_menu'        => true,
        'query_var'           => true,
        'rewrite'             => array('slug' => 'events'),
        'capability_type'     => 'post',
        'has_archive'         => true,
        'hierarchical'        => false,
        'menu_position'       => 5,
        'menu_icon'           => 'dashicons-tickets-alt',
        'supports'            => array('title', 'editor', 'thumbnail', 'excerpt'),
        'show_in_rest'        => true,
    );
    
    register_post_type('vw_event', $args);
}
add_action('init', 'vw_register_event_post_type');

/**
 * Register Event Category Taxonomy
 */
function vw_register_event_taxonomy() {
    $labels = array(
        'name'              => 'Event-Kategorien',
        'singular_name'     => 'Event-Kategorie',
        'search_items'      => 'Kategorien suchen',
        'all_items'         => 'Alle Kategorien',
        'edit_item'         => 'Kategorie bearbeiten',
        'update_item'       => 'Kategorie aktualisieren',
        'add_new_item'      => 'Neue Kategorie hinzufügen',
        'new_item_name'     => 'Neuer Kategorie-Name',
        'menu_name'         => 'Kategorien',
    );
    
    $args = array(
        'hierarchical'      => true,
        'labels'            => $labels,
        'show_ui'           => true,
        'show_admin_column' => true,
        'query_var'         => true,
        'rewrite'           => array('slug' => 'event-kategorie'),
        'show_in_rest'      => true,
    );
    
    register_taxonomy('vw_event_category', array('vw_event'), $args);
}
add_action('init', 'vw_register_event_taxonomy');

/**
 * Add default event categories on theme activation
 */
function vw_add_default_categories() {
    $categories = array(
        'Open Air',
        'Indoor Rave',
        'Rooftop Party',
        'Warehouse',
        'Club',
    );
    
    foreach ($categories as $category) {
        if (!term_exists($category, 'vw_event_category')) {
            wp_insert_term($category, 'vw_event_category');
        }
    }
}
add_action('init', 'vw_add_default_categories', 20);
