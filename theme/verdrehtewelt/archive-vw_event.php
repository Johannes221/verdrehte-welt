<?php
/**
 * Events Archive Template
 * 
 * @package VerdrehteWelt
 */

get_header();
?>

<section class="py-8">
    <div class="container">
        <h1 class="text-center mb-4">Alle Events</h1>
        
        <div class="events-grid">
            <?php
            if (have_posts()) :
                while (have_posts()) : the_post();
                    $event_data = vw_get_event_card_data(get_the_ID());
                    ?>
                    <article class="event-card">
                        <?php if ($event_data['thumbnail']): ?>
                            <img src="<?php echo esc_url($event_data['thumbnail']); ?>" alt="<?php echo esc_attr($event_data['title']); ?>" class="event-card-image">
                        <?php endif; ?>
                        
                        <div class="event-card-content">
                            <h3 class="event-card-title">
                                <a href="<?php echo esc_url($event_data['permalink']); ?>" style="color: inherit; text-decoration: none;">
                                    <?php echo esc_html($event_data['title']); ?>
                                </a>
                            </h3>
                            
                            <?php if ($event_data['date']): ?>
                                <p class="event-card-meta">📅 <?php echo esc_html($event_data['date']); ?></p>
                            <?php endif; ?>
                            
                            <?php if ($event_data['location']): ?>
                                <p class="event-card-meta">📍 <?php echo esc_html($event_data['location']); ?></p>
                            <?php endif; ?>
                            
                            <?php if ($event_data['genres']): ?>
                                <p class="event-card-meta">🎵 <?php echo esc_html($event_data['genres']); ?></p>
                            <?php endif; ?>
                            
                            <?php if ($event_data['lowest_price']): ?>
                                <p class="event-card-price">
                                    ab <?php echo vw_format_price($event_data['lowest_price']); ?>
                                </p>
                            <?php endif; ?>
                            
                            <a href="<?php echo esc_url($event_data['permalink']); ?>" class="btn btn-outline" style="width: 100%; text-align: center;">Ticket sichern</a>
                        </div>
                    </article>
                    <?php
                endwhile;
                
                // Pagination
                the_posts_pagination(array(
                    'mid_size' => 2,
                    'prev_text' => '← Zurück',
                    'next_text' => 'Weiter →',
                ));
            else :
                echo '<p class="text-center">Keine Events gefunden.</p>';
            endif;
            ?>
        </div>
    </div>
</section>

<?php
get_footer();
