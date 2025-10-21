<?php
/**
 * Single Event Template
 * 
 * @package VerdrehteWelt
 */

get_header();

while (have_posts()) : the_post();
    $event_meta = vw_get_event_meta(get_the_ID());
    $available_tickets = vw_get_available_tickets(get_the_ID());
?>

<article class="event-single">
    <div class="container">
        <?php if (has_post_thumbnail()): ?>
            <img src="<?php echo get_the_post_thumbnail_url(get_the_ID(), 'vw-event-hero'); ?>" alt="<?php the_title(); ?>" class="event-featured-image">
        <?php endif; ?>
        
        <header class="event-header">
            <h1><?php the_title(); ?></h1>
        </header>
        
        <div class="event-meta-grid">
            <?php if ($event_meta['date']): ?>
            <div class="event-meta-item">
                <strong>Datum & Zeit</strong>
                <?php echo esc_html(vw_get_formatted_date(get_the_ID())); ?>
            </div>
            <?php endif; ?>
            
            <?php if ($event_meta['location_name']): ?>
            <div class="event-meta-item">
                <strong>Location</strong>
                <?php echo esc_html($event_meta['location_name']); ?>
                <?php if ($event_meta['location_address']): ?>
                    <br><span style="font-size: 0.9rem; opacity: 0.7;"><?php echo esc_html($event_meta['location_address']); ?></span>
                <?php endif; ?>
            </div>
            <?php endif; ?>
            
            <?php if ($event_meta['genres']): ?>
            <div class="event-meta-item">
                <strong>Musik</strong>
                <?php echo esc_html($event_meta['genres']); ?>
            </div>
            <?php endif; ?>
        </div>
        
        <div class="event-content">
            <?php the_content(); ?>
        </div>
        
        <!-- Ticket Box -->
        <?php if (!empty($available_tickets)): ?>
        <div class="ticket-box">
            <h3>Tickets</h3>
            <p style="opacity: 0.8;">Sichere dir jetzt dein Ticket für dieses Event!</p>
            
            <div class="ticket-options">
                <?php foreach ($available_tickets as $ticket): ?>
                <div class="ticket-option">
                    <div class="ticket-option-info">
                        <div class="ticket-option-name"><?php echo esc_html($ticket['name']); ?></div>
                        <?php if ($ticket['available_until']): ?>
                            <div class="ticket-option-availability">
                                Verfügbar bis: <?php echo esc_html(date('d.m.Y H:i', strtotime($ticket['available_until']))); ?>
                            </div>
                        <?php endif; ?>
                    </div>
                    <div class="ticket-option-details">
                        <div class="ticket-option-price"><?php echo vw_format_price($ticket['price']); ?></div>
                        <button class="btn" onclick="vwSelectTicket('<?php echo esc_js($ticket['type']); ?>', <?php echo esc_js($ticket['price']); ?>, '<?php echo esc_js($ticket['name']); ?>')">
                            Auswählen
                        </button>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>
        </div>
        
        <!-- Checkout Form (Hidden by default) -->
        <div id="checkout-section" style="display: none;">
            <div class="checkout-form">
                <h3 class="text-center mb-4">Bestellung abschließen</h3>
                
                <p class="text-center mb-4">
                    <strong id="selected-ticket-name"></strong><br>
                    <span style="font-size: 1.5rem; font-weight: bold;" id="selected-ticket-price"></span>
                </p>
                
                <form id="order-form">
                    <input type="hidden" id="event-id" value="<?php echo get_the_ID(); ?>">
                    <input type="hidden" id="ticket-type" value="">
                    
                    <div class="form-group">
                        <label>Email *</label>
                        <input type="email" id="email" required>
                    </div>
                    
                    <div class="form-group">
                        <label>Vorname</label>
                        <input type="text" id="vorname">
                    </div>
                    
                    <div class="form-group">
                        <label>Nachname</label>
                        <input type="text" id="nachname">
                    </div>
                    
                    <div class="checkbox-group form-group">
                        <input type="checkbox" id="agb" required>
                        <label for="agb">Ich akzeptiere die <a href="<?php echo home_url('/agb'); ?>" target="_blank" style="color: inherit;">AGB</a> *</label>
                    </div>
                    
                    <button type="submit" class="btn" style="width: 100%;">Weiter zur Zahlung</button>
                </form>
                
                <div id="paypal-button-container" style="margin-top: 20px; display: none;"></div>
                
                <div id="order-message" style="margin-top: 20px; text-align: center;"></div>
            </div>
        </div>
        <?php else: ?>
        <div class="ticket-box">
            <h3>Tickets</h3>
            <p>Derzeit sind keine Tickets verfügbar.</p>
        </div>
        <?php endif; ?>
    </div>
</article>

<?php
endwhile;

get_footer();
