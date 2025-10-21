<?php
/**
 * Homepage Template
 * 
 * @package VerdrehteWelt
 */

get_header();
?>

<!-- Hero Section -->
<section class="hero">
    <div class="hero-content">
        <h1>VERDREHTE WELT</h1>
        <p>Techno Events in Heidelberg, Mannheim und Umgebung</p>
        <a href="<?php echo get_post_type_archive_link('vw_event'); ?>" class="btn">Tickets sichern</a>
        <br><br>
        <a href="#events" class="btn btn-outline">zu den nächsten Events</a>
    </div>
</section>

<!-- Upcoming Events -->
<section id="events" class="py-8">
    <div class="container">
        <h2 class="text-center mb-4">Nächste Events</h2>
        <p class="text-center mb-4" style="opacity: 0.8;">Holt euch eure Tickets für die nächsten Events</p>
        
        <div class="events-grid">
            <?php
            $events_query = new WP_Query(array(
                'post_type' => 'vw_event',
                'posts_per_page' => 6,
                'meta_key' => '_vw_event_date',
                'orderby' => 'meta_value',
                'order' => 'ASC',
                'meta_query' => array(
                    array(
                        'key' => '_vw_event_date',
                        'value' => date('Y-m-d'),
                        'compare' => '>=',
                        'type' => 'DATE'
                    )
                )
            ));
            
            if ($events_query->have_posts()) :
                while ($events_query->have_posts()) : $events_query->the_post();
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
                            
                            <?php if ($event_data['address']): ?>
                                <p class="event-card-meta" style="font-size: 0.85rem;"><?php echo esc_html($event_data['address']); ?></p>
                            <?php endif; ?>
                            
                            <?php if ($event_data['genres']): ?>
                                <p class="event-card-meta">🎵 <?php echo esc_html($event_data['genres']); ?></p>
                            <?php endif; ?>
                            
                            <?php if ($event_data['lowest_price']): ?>
                                <p class="event-card-price">
                                    Vorverkauf: <?php echo vw_format_price($event_data['lowest_price']); ?>
                                    <?php if ($event_data['highest_price'] && $event_data['highest_price'] != $event_data['lowest_price']): ?>
                                        <br><span style="font-size: 0.9rem; opacity: 0.7;">Abendkasse: <?php echo vw_format_price($event_data['highest_price']); ?></span>
                                    <?php endif; ?>
                                </p>
                            <?php endif; ?>
                            
                            <a href="<?php echo esc_url($event_data['permalink']); ?>" class="btn btn-outline" style="width: 100%; text-align: center;">Ticket sichern</a>
                        </div>
                    </article>
                    <?php
                endwhile;
                wp_reset_postdata();
            else :
                echo '<p class="text-center">Aktuell keine kommenden Events. Folge uns auf Instagram für Updates!</p>';
            endif;
            ?>
        </div>
        
        <div class="text-center mt-4">
            <a href="<?php echo get_post_type_archive_link('vw_event'); ?>" class="btn btn-outline">Alle Events ansehen</a>
        </div>
    </div>
</section>

<!-- Instagram CTA -->
<section class="py-8" style="background-color: #1a1a1a;">
    <div class="container text-center">
        <h2>Folge Verdrehte Welt auf Instagram</h2>
        <p style="opacity: 0.8; margin: 20px 0;">Bleib auf dem Laufenden über neue Events, Behind-the-Scenes und mehr</p>
        <a href="https://instagram.com/verdrehtewelt" target="_blank" class="btn">@verdrehtewelt</a>
    </div>
</section>

<?php
get_footer();
