<?php
/**
 * QR Code Generation using JWT
 * 
 * @package VerdrehteWelt
 */

if (!defined('ABSPATH')) exit;

/**
 * Generate QR Token (JWT)
 */
function vw_generate_qr_token($data) {
    $secret = get_option('vw_jwt_secret', wp_salt('auth'));
    
    $payload = array(
        'sub' => $data['order_id'],      // Subject: Order ID
        'evt' => $data['event_id'],      // Event ID
        'typ' => $data['ticket_type'],   // Ticket Type
        'eml' => $data['email'],         // Email (for reference)
        'iat' => time(),                 // Issued at
        'exp' => time() + (365 * 24 * 60 * 60), // Expires in 1 year
        'ver' => 1,                      // Token version
    );
    
    // Create simple JWT (Header.Payload.Signature)
    $header = array('typ' => 'JWT', 'alg' => 'HS256');
    
    $segments = array();
    $segments[] = vw_base64url_encode(json_encode($header));
    $segments[] = vw_base64url_encode(json_encode($payload));
    
    $signing_input = implode('.', $segments);
    $signature = hash_hmac('sha256', $signing_input, $secret, true);
    $segments[] = vw_base64url_encode($signature);
    
    return implode('.', $segments);
}

/**
 * Verify QR Token
 */
function vw_verify_qr_token($token) {
    $secret = get_option('vw_jwt_secret', wp_salt('auth'));
    
    $segments = explode('.', $token);
    if (count($segments) !== 3) {
        return new WP_Error('invalid_token', 'Ungültiges Token-Format');
    }
    
    list($header_b64, $payload_b64, $signature_b64) = $segments;
    
    // Verify signature
    $signing_input = $header_b64 . '.' . $payload_b64;
    $expected_signature = hash_hmac('sha256', $signing_input, $secret, true);
    $actual_signature = vw_base64url_decode($signature_b64);
    
    if (!hash_equals($expected_signature, $actual_signature)) {
        return new WP_Error('invalid_signature', 'Ungültige Signatur');
    }
    
    // Decode payload
    $payload = json_decode(vw_base64url_decode($payload_b64), true);
    
    if (empty($payload)) {
        return new WP_Error('invalid_payload', 'Ungültiger Payload');
    }
    
    // Check expiration
    if (!empty($payload['exp']) && time() > $payload['exp']) {
        return new WP_Error('token_expired', 'Token abgelaufen');
    }
    
    return $payload;
}

/**
 * Generate QR Code Image (Data URL)
 */
function vw_generate_qr_image($token) {
    // Use Google Charts API as fallback (oder PHP QR Code Library wenn installiert)
    $size = 400;
    $url = 'https://chart.googleapis.com/chart?chs=' . $size . 'x' . $size . '&cht=qr&chl=' . urlencode($token) . '&choe=UTF-8';
    
    return $url;
}

/**
 * Base64 URL encode
 */
function vw_base64url_encode($data) {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

/**
 * Base64 URL decode
 */
function vw_base64url_decode($data) {
    return base64_decode(strtr($data, '-_', '+/'));
}
