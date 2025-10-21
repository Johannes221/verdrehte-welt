<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<header class="site-header">
    <div class="container">
        <nav class="site-nav">
            <a href="<?php echo home_url(); ?>" class="site-logo" style="display: flex; align-items: center;">
                <img src="<?php echo VW_THEME_URI; ?>/assets/images/logo.png" alt="Verdrehte Welt" style="height: 60px;">
            </a>
            
            <?php
            wp_nav_menu(array(
                'theme_location' => 'primary',
                'container' => false,
                'menu_class' => '',
                'fallback_cb' => function() {
                    echo '<ul>';
                    echo '<li><a href="' . home_url() . '">Home</a></li>';
                    echo '<li><a href="' . home_url('/events') . '">Events</a></li>';
                    echo '<li><a href="' . home_url('/kontakt') . '">Kontakt</a></li>';
                    echo '</ul>';
                }
            ));
            ?>
        </nav>
    </div>
</header>
