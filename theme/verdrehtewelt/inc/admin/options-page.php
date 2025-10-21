<?php
/**
 * Theme Options Page
 * 
 * @package VerdrehteWelt
 */

if (!defined('ABSPATH')) exit;

/**
 * Add Options Page
 */
function vw_add_options_page() {
    add_submenu_page(
        'vw-orders',
        'Einstellungen',
        'Einstellungen',
        'manage_options',
        'vw-settings',
        'vw_settings_page'
    );
}
add_action('admin_menu', 'vw_add_options_page');

/**
 * Register Settings
 */
function vw_register_settings() {
    register_setting('vw_settings', 'vw_paypal_client_id');
    register_setting('vw_settings', 'vw_paypal_client_secret');
    register_setting('vw_settings', 'vw_paypal_mode');
    register_setting('vw_settings', 'vw_jwt_secret');
}
add_action('admin_init', 'vw_register_settings');

/**
 * Settings Page
 */
function vw_settings_page() {
    ?>
    <div class="wrap">
        <h1>Verdrehte Welt - Einstellungen</h1>
        
        <form method="post" action="options.php">
            <?php settings_fields('vw_settings'); ?>
            
            <table class="form-table">
                <tr>
                    <th colspan="2"><h2>PayPal-Konfiguration</h2></th>
                </tr>
                <tr>
                    <th scope="row">
                        <label for="vw_paypal_client_id">PayPal Client ID</label>
                    </th>
                    <td>
                        <input type="text" id="vw_paypal_client_id" name="vw_paypal_client_id" value="<?php echo esc_attr(get_option('vw_paypal_client_id')); ?>" class="regular-text" />
                        <p class="description">Deine PayPal REST API Client ID (aus dem PayPal Developer Dashboard)</p>
                    </td>
                </tr>
                <tr>
                    <th scope="row">
                        <label for="vw_paypal_client_secret">PayPal Client Secret</label>
                    </th>
                    <td>
                        <input type="password" id="vw_paypal_client_secret" name="vw_paypal_client_secret" value="<?php echo esc_attr(get_option('vw_paypal_client_secret')); ?>" class="regular-text" />
                        <p class="description">Dein PayPal REST API Secret (geheim halten!)</p>
                    </td>
                </tr>
                <tr>
                    <th scope="row">
                        <label for="vw_paypal_mode">PayPal Modus</label>
                    </th>
                    <td>
                        <select id="vw_paypal_mode" name="vw_paypal_mode">
                            <option value="sandbox" <?php selected(get_option('vw_paypal_mode', 'sandbox'), 'sandbox'); ?>>Sandbox (Test)</option>
                            <option value="live" <?php selected(get_option('vw_paypal_mode'), 'live'); ?>>Live (Production)</option>
                        </select>
                        <p class="description">Sandbox für Tests, Live für echte Zahlungen</p>
                    </td>
                </tr>
                
                <tr>
                    <th colspan="2"><h2>Sicherheit</h2></th>
                </tr>
                <tr>
                    <th scope="row">
                        <label for="vw_jwt_secret">JWT Secret</label>
                    </th>
                    <td>
                        <input type="text" id="vw_jwt_secret" name="vw_jwt_secret" value="<?php echo esc_attr(get_option('vw_jwt_secret', wp_salt('auth'))); ?>" class="large-text" />
                        <p class="description">Secret für QR-Code-Signierung (automatisch generiert, sollte nicht geändert werden)</p>
                    </td>
                </tr>
            </table>
            
            <?php submit_button('Einstellungen speichern'); ?>
        </form>
        
        <hr>
        
        <h2>Anleitung</h2>
        <ol>
            <li><strong>PayPal Developer Account:</strong> Gehe zu <a href="https://developer.paypal.com" target="_blank">developer.paypal.com</a></li>
            <li><strong>App erstellen:</strong> My Apps & Credentials → Create App</li>
            <li><strong>Credentials kopieren:</strong> Client ID und Secret hier eintragen</li>
            <li><strong>Sandbox testen:</strong> Verwende Sandbox-Modus für Tests</li>
            <li><strong>Live schalten:</strong> Wenn alles funktioniert, auf "Live" umstellen</li>
        </ol>
        
        <p><strong>Wichtig:</strong> Alle Zahlungen gehen direkt auf das hinterlegte PayPal-Konto. Es gibt keine Aufteilung oder Payouts.</p>
    </div>
    <?php
}
