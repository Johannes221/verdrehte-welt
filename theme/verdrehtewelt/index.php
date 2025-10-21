<?php
/**
 * Main Template File
 * 
 * @package VerdrehteWelt
 */

get_header();
?>

<main class="site-main">
    <?php
    if (have_posts()) :
        while (have_posts()) : the_post();
            the_content();
        endwhile;
    else :
        echo '<div class="container py-8"><p>Keine Inhalte gefunden.</p></div>';
    endif;
    ?>
</main>

<?php
get_footer();
