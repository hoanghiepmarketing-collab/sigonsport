<?php
/**
 * SiGon Child Theme - functions.php
 * Parent: Twenty Twenty-Five
 */

// Theme setup — title tag + các feature support
add_action('after_setup_theme', 'sigon_theme_setup');
function sigon_theme_setup() {
    add_theme_support('title-tag');
}

// Favicon SiGon Sport
add_action('wp_head', 'sigon_favicon', 1);
function sigon_favicon() {
    echo '<link rel="icon" type="image/x-icon" href="' . home_url('/favicon.ico') . '">' . "\n";
    echo '<link rel="icon" type="image/png" sizes="32x32" href="' . home_url('/favicon.png') . '">' . "\n";
}

// Enqueue parent + child styles
add_action('wp_enqueue_scripts', 'sigon_child_enqueue_styles');
function sigon_child_enqueue_styles() {
    // Parent theme style
    wp_enqueue_style(
        'parent-theme-css',
        get_template_directory_uri() . '/style.css',
        [],
        wp_get_theme()->parent()->get('Version')
    );
    // Child theme style
    wp_enqueue_style(
        'sigon-child-css',
        get_stylesheet_uri(),
        ['parent-theme-css'],
        wp_get_theme()->get('Version')
    );
    // Google Fonts
    wp_enqueue_style(
        'sigon-google-fonts',
        'https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800;900&family=Montserrat:wght@700;800;900&display=swap',
        [],
        null
    );
}

// Badge "2HAND REAL" — dùng attribute "Loại hàng" thay vì category slug
add_action('woocommerce_before_shop_loop_item_title', 'sigon_secondhand_badge', 5);
function sigon_secondhand_badge() {
    global $product;
    if (!$product) return;
    $terms = get_the_terms($product->get_id(), 'pa_loai-hang');
    if (!$terms || is_wp_error($terms)) return;
    foreach ($terms as $term) {
        if (strpos(strtolower($term->slug), '2hand') !== false ||
            strpos(strtolower($term->name), '2hand') !== false) {
            echo '<span class="badge-secondhand">2HAND</span>';
            return;
        }
    }
}

// JS: relocate badge ra khỏi WC block inner container (hover overlay) sau khi DOM load
add_action('wp_footer', 'sigon_badge_relocate_js', 99);
function sigon_badge_relocate_js() {
    if (is_front_page()) return;
    ?>
<script>
(function(){
    function relocateBadges() {
        document.querySelectorAll('.badge-secondhand').forEach(function(badge) {
            var product = badge.closest('li.product, .wc-block-product, li[class*="wc-block"]');
            if (!product) return;
            var imgWrapper = product.querySelector('.wc-block-components-product-image, .woocommerce-LoopProduct-link');
            if (imgWrapper && badge.parentElement !== imgWrapper) {
                imgWrapper.style.position = 'relative';
                imgWrapper.appendChild(badge);
            }
        });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', relocateBadges);
    } else {
        relocateBadges();
    }
    setTimeout(relocateBadges, 800);
})();
<\/script>
    <?php
}

// Hiển thị tình trạng sản phẩm
add_action('woocommerce_after_shop_loop_item_title', 'sigon_product_condition', 5);
function sigon_product_condition() {
    global $product;
    if (!$product) return;
    $condition = get_post_meta($product->get_id(), 'product_condition', true);
    if ($condition) {
        echo '<span class="product-condition" style="display:block;font-size:12px;color:#8B5E3C;font-weight:600;padding:0 12px;">' . esc_html($condition) . '</span>';
    }
}

// Ký hiệu tiền VND
add_filter('woocommerce_currency_symbol', 'sigon_currency_symbol', 10, 2);
function sigon_currency_symbol($currency_symbol, $currency) {
    if ($currency === 'VND') return '₫';
    return $currency_symbol;
}

// Body class theo category
add_filter('body_class', 'sigon_body_classes');
function sigon_body_classes($classes) {
    if (is_product_category()) {
        $term = get_queried_object();
        if ($term && isset($term->slug)) {
            $classes[] = 'product-cat-' . $term->slug;
        }
    }
    return $classes;
}

// 4 cột sản phẩm
add_filter('loop_shop_columns', 'sigon_loop_columns');
function sigon_loop_columns() {
    return 4;
}

// 20 sản phẩm/trang
add_filter('loop_shop_per_page', 'sigon_products_per_page', 20);
function sigon_products_per_page() {
    return 20;
}

// Breadcrumb tiếng Việt
add_filter('woocommerce_breadcrumb_defaults', 'sigon_breadcrumb_defaults');
function sigon_breadcrumb_defaults($defaults) {
    $defaults['delimiter'] = ' › ';
    $defaults['home']      = 'Trang chủ';
    return $defaults;
}

// Banner miễn phí vận chuyển
add_action('woocommerce_before_main_content', 'sigon_free_shipping_notice', 5);
function sigon_free_shipping_notice() {
    if (is_shop() || is_product_category()) {
        echo '<div style="background:#2D5535;color:#fff;text-align:center;padding:10px;font-size:13px;font-weight:600;font-family:\'Be Vietnam Pro\',sans-serif;">
            🚚 Miễn phí vận chuyển đơn từ 500.000₫ &nbsp;|&nbsp; ✌️ Giày Real — Giá Hời — Chất Sài Gòn
        </div>';
    }
}

// ============================================================
// SIGON PRODUCT FILTER SIDEBAR
// ============================================================

// CSS + JS cho filter
add_action('wp_head', 'sigon_filter_styles');
function sigon_filter_styles() {
    if (!is_shop() && !is_product_category() && !is_product_taxonomy()) return;
    ?>
    <style>
    /* Layout 2 cột: sidebar + sản phẩm */
    .woocommerce .woocommerce-notices-wrapper + .sigon-shop-wrap,
    .sigon-shop-wrap { display: flex; gap: 24px; align-items: flex-start; }

    /* Filter Sidebar */
    .sigon-filter-sidebar {
        width: 240px; min-width: 240px;
        background: #fff; border-radius: 10px;
        border: 1px solid #e8e0d4;
        padding: 0; overflow: hidden;
        position: sticky; top: 80px;
        font-family: 'Be Vietnam Pro', sans-serif;
    }
    .sigon-filter-sidebar .sf-header {
        background: #2D5535; color: #fff;
        padding: 14px 16px; font-size: 15px;
        font-weight: 700; display: flex;
        align-items: center; justify-content: space-between;
    }
    .sigon-filter-sidebar .sf-header a {
        color: #F5EFE2; font-size: 11px;
        font-weight: 500; text-decoration: none;
        border: 1px solid rgba(255,255,255,.4);
        padding: 2px 8px; border-radius: 20px;
    }
    .sigon-filter-sidebar .sf-header a:hover { background: rgba(255,255,255,.15); }

    /* Filter Group */
    .sf-group { border-bottom: 1px solid #eee; }
    .sf-group-title {
        padding: 12px 16px; font-size: 13px;
        font-weight: 700; color: #1E3D24;
        cursor: pointer; display: flex;
        align-items: center; justify-content: space-between;
        user-select: none;
    }
    .sf-group-title:hover { background: #f9f6f0; }
    .sf-group-title .sf-arrow { transition: transform .2s; font-size: 10px; color: #888; }
    .sf-group.open .sf-arrow { transform: rotate(180deg); }
    .sf-group-items { display: none; padding: 0 16px 12px; }
    .sf-group.open .sf-group-items { display: block; }

    /* Filter Items */
    .sf-item {
        display: flex; align-items: center;
        gap: 8px; padding: 5px 0;
        font-size: 13px; color: #444;
        text-decoration: none; border-radius: 4px;
        cursor: pointer;
    }
    .sf-item:hover { color: #2D5535; }
    .sf-item.active { color: #2D5535; font-weight: 700; }
    .sf-item .sf-check {
        width: 16px; height: 16px;
        border: 2px solid #ccc; border-radius: 3px;
        display: flex; align-items: center; justify-content: center;
        flex-shrink: 0; transition: all .15s;
    }
    .sf-item.active .sf-check {
        background: #2D5535; border-color: #2D5535;
        color: #fff; font-size: 10px;
    }
    .sf-item .sf-count {
        margin-left: auto; color: #aaa;
        font-size: 11px; background: #f0ece5;
        padding: 1px 6px; border-radius: 10px;
    }

    /* Size grid */
    .sf-size-grid {
        display: grid; grid-template-columns: repeat(4, 1fr);
        gap: 5px; padding: 4px 0 8px;
    }
    .sf-size-item {
        text-align: center; padding: 5px 2px;
        border: 1px solid #ddd; border-radius: 5px;
        font-size: 12px; font-weight: 600;
        cursor: pointer; color: #555;
        text-decoration: none;
        transition: all .15s;
    }
    .sf-size-item:hover { border-color: #2D5535; color: #2D5535; }
    .sf-size-item.active { background: #2D5535; color: #fff; border-color: #2D5535; }

    /* Active filters bar */
    .sigon-active-filters {
        margin-bottom: 12px; padding: 10px 14px;
        background: #fff3cd; border-radius: 8px;
        border: 1px solid #f0d060; font-size: 12px;
        font-family: 'Be Vietnam Pro', sans-serif;
    }
    .sigon-active-filters strong { color: #333; }
    .sigon-active-filters a {
        display: inline-flex; align-items: center; gap: 4px;
        background: #fff; border: 1px solid #ccc;
        border-radius: 20px; padding: 2px 8px;
        margin: 2px 3px; color: #444; text-decoration: none;
        font-size: 11px;
    }
    .sigon-active-filters a:hover { border-color: #e53935; color: #e53935; }
    .sigon-active-filters .clear-all {
        color: #C44D28; font-weight: 700;
        text-decoration: underline; margin-left: 6px;
    }

    /* Products area */
    .sigon-products-area { flex: 1; min-width: 0; }

    /* Mobile filter toggle */
    .sigon-filter-toggle {
        display: none; background: #2D5535; color: #fff;
        border: none; padding: 10px 16px; border-radius: 8px;
        font-size: 13px; font-weight: 600; cursor: pointer;
        margin-bottom: 16px; width: 100%;
        font-family: 'Be Vietnam Pro', sans-serif;
    }

    /* Responsive */
    @media (max-width: 900px) {
        .sigon-shop-wrap { flex-direction: column; }
        .sigon-filter-sidebar { width: 100%; min-width: 0; position: static; display: none; }
        .sigon-filter-sidebar.mobile-open { display: block; }
        .sigon-filter-toggle { display: block; }
        .sf-size-grid { grid-template-columns: repeat(6, 1fr); }
    }
    @media (max-width: 480px) {
        .sf-size-grid { grid-template-columns: repeat(5, 1fr); }
    }

    /* =====================================================
       SHOP LAYOUT FIX — override is-layout-constrained 645px
    ====================================================== */
    .is-layout-constrained > .sigon-shop-wrap,
    .is-layout-constrained > .sigon-filter-toggle {
        max-width: 1400px !important;
        width: 100% !important;
        box-sizing: border-box;
    }

    /* WooCommerce block template — 3-col grid */
    .sigon-products-area .wc-block-product-template {
        display: grid !important;
        grid-template-columns: repeat(3, 1fr) !important;
        gap: 16px !important;
    }

    /* Block theme product cards */
    .wc-block-product {
        background: #fff;
        border-radius: 10px;
        box-shadow: 0 2px 8px rgba(0,0,0,.06);
        overflow: visible;
        transition: box-shadow .2s, transform .2s;
        position: relative;
    }
    .wc-block-components-product-image {
        overflow: hidden;
        border-radius: 10px 10px 0 0;
        position: relative;
    }
    .wc-block-product:hover { box-shadow: 0 8px 24px rgba(0,0,0,.12); transform: translateY(-2px); }
    .wc-block-product img { transition: transform .3s; }
    .wc-block-product:hover img { transform: scale(1.04); }
    .wc-block-components-product-name { font-weight: 600 !important; font-size: 14px !important; line-height: 1.4; }
    .wc-block-components-product-price { font-weight: 700 !important; color: #2D5535 !important; }
    .wc-block-components-product-price del { color: #aaa !important; font-size: 13px !important; }
    .wc-block-components-product-price ins { color: #E5002B !important; text-decoration: none !important; }
    .wp-block-woocommerce-product-button a,
    .wc-block-product .add_to_cart_button { width: 100% !important; text-align: center !important; }

    @media (max-width: 900px) {
        .sigon-products-area .wc-block-product-template { grid-template-columns: repeat(2, 1fr) !important; }
    }
    @media (max-width: 480px) {
        .sigon-products-area .wc-block-product-template { grid-template-columns: repeat(2, 1fr) !important; gap: 8px !important; }
    }
    </style>
    <?php
}

// Helper: build filter URL (add/remove a filter value)
function sigon_filter_url($attr_slug, $value, $active_values = []) {
    $base = strtok($_SERVER['REQUEST_URI'], '?');
    $params = $_GET;

    $key = 'filter_' . $attr_slug;
    $current = isset($params[$key]) ? explode(',', $params[$key]) : [];
    $current = array_map('sanitize_title', $current);
    $value_slug = sanitize_title($value);

    if (in_array($value_slug, $current)) {
        $current = array_diff($current, [$value_slug]);
    } else {
        $current[] = $value_slug;
    }

    if (empty($current)) {
        unset($params[$key]);
        unset($params['query_type_' . $attr_slug]);
    } else {
        $params[$key] = implode(',', array_filter($current));
        // Luôn dùng OR trong cùng taxonomy (WC mặc định AND nếu không có param này)
        $params['query_type_' . $attr_slug] = 'or';
    }

    unset($params['paged']);
    $query = http_build_query($params);
    return $base . ($query ? '?' . $query : '');
}

// Helper: check if a filter value is active
function sigon_filter_is_active($attr_slug, $value) {
    $key = 'filter_' . $attr_slug;
    if (!isset($_GET[$key])) return false;
    $active = explode(',', $_GET[$key]);
    return in_array(sanitize_title($value), array_map('sanitize_title', $active));
}

// Helper: clear-all URL
function sigon_filter_clear_url() {
    $params = $_GET;
    foreach (array_keys($params) as $key) {
        if (strpos($key, 'filter_') === 0) unset($params[$key]);
    }
    unset($params['paged']);
    $base = strtok($_SERVER['REQUEST_URI'], '?');
    $query = http_build_query($params);
    return $base . ($query ? '?' . $query : '');
}

// Render a single filter group
function sigon_render_filter_group($title, $attr_slug, $type = 'checkbox') {
    $terms = get_terms([
        'taxonomy'   => 'pa_' . $attr_slug,
        'hide_empty' => true,
        'orderby'    => ($attr_slug === 'size') ? 'menu_order' : 'name',
        'order'      => 'ASC',
    ]);
    if (is_wp_error($terms) || empty($terms)) return;

    $has_active = false;
    foreach ($terms as $t) {
        if (sigon_filter_is_active($attr_slug, $t->slug)) { $has_active = true; break; }
    }
    ?>
    <div class="sf-group open">
        <div class="sf-group-title" onclick="this.parentElement.classList.toggle('open')">
            <span><?php echo esc_html($title); ?><?php if ($has_active): ?> <span style="color:#C44D28;">●</span><?php endif; ?></span>
            <span class="sf-arrow">▼</span>
        </div>
        <div class="sf-group-items">
        <?php if ($type === 'size'): ?>
            <div class="sf-size-grid">
            <?php foreach ($terms as $term):
                $active = sigon_filter_is_active($attr_slug, $term->slug);
                $url = sigon_filter_url($attr_slug, $term->slug);
                ?>
                <a href="<?php echo esc_url($url); ?>" class="sf-size-item <?php echo $active ? 'active' : ''; ?>">
                    <?php echo esc_html($term->name); ?>
                </a>
            <?php endforeach; ?>
            </div>
        <?php else: ?>
            <?php foreach ($terms as $term):
                $active = sigon_filter_is_active($attr_slug, $term->slug);
                $url = sigon_filter_url($attr_slug, $term->slug);
                ?>
                <a href="<?php echo esc_url($url); ?>" class="sf-item <?php echo $active ? 'active' : ''; ?>">
                    <span class="sf-check"><?php echo $active ? '✓' : ''; ?></span>
                    <span><?php echo esc_html($term->name); ?></span>
                    <span class="sf-count"><?php echo (int) $term->count; ?></span>
                </a>
            <?php endforeach; ?>
        <?php endif; ?>
        </div>
    </div>
    <?php
}

// Render the full filter sidebar
function sigon_render_filter_sidebar() {
    $has_filters = false;
    $filter_keys = ['filter_loai-hang', 'filter_mon-the-thao', 'filter_thuong-hieu', 'filter_size'];
    foreach ($filter_keys as $k) {
        if (!empty($_GET[$k])) { $has_filters = true; break; }
    }
    ?>
    <aside class="sigon-filter-sidebar">
        <div class="sf-header">
            <span>🔍 Bộ Lọc</span>
            <?php if ($has_filters): ?>
                <a href="<?php echo esc_url(sigon_filter_clear_url()); ?>">✕ Xóa lọc</a>
            <?php endif; ?>
        </div>
        <?php
        sigon_render_filter_group('Loại hàng',     'loai-hang',    'checkbox');
        sigon_render_filter_group('Môn thể thao',  'mon-the-thao', 'checkbox');
        sigon_render_filter_group('Thương hiệu',   'thuong-hieu',  'checkbox');
        sigon_render_filter_group('Size',          'size',         'size');
        ?>
    </aside>
    <?php
}

// Open shop layout wrapper
add_action('woocommerce_before_main_content', 'sigon_open_shop_layout', 20);
function sigon_open_shop_layout() {
    if (!is_shop() && !is_product_category() && !is_product_taxonomy()) return;
    echo '<div class="sigon-shop-wrap">';
    sigon_render_filter_sidebar();
    echo '<div class="sigon-products-area">';
}

// Close shop layout wrapper
add_action('woocommerce_after_main_content', 'sigon_close_shop_layout', 5);
function sigon_close_shop_layout() {
    if (!is_shop() && !is_product_category() && !is_product_taxonomy()) return;
    echo '</div></div>';
}

// ============================================================
// FIX: xử lý filter_* params thủ công nếu WC chưa tự làm
// (WC chỉ xử lý attributes đăng ký trong wp_woocommerce_attribute_taxonomies)
// ============================================================
add_action('pre_get_posts', 'sigon_custom_filter_query', 20);
function sigon_custom_filter_query($query) {
    if (is_admin() || !$query->is_main_query()) return;
    if (!is_shop() && !is_product_category() && !is_product_taxonomy()) return;

    $filter_map = [
        'filter_size'         => 'pa_size',
        'filter_thuong-hieu'  => 'pa_thuong-hieu',
        'filter_loai-hang'    => 'pa_loai-hang',
        'filter_mon-the-thao' => 'pa_mon-the-thao',
    ];

    $tax_query = (array) $query->get('tax_query');
    $changed   = false;

    foreach ($filter_map as $param => $taxonomy) {
        if (empty($_GET[$param])) continue;
        $values = array_values(array_filter(array_map('sanitize_title', explode(',', $_GET[$param]))));
        if (empty($values)) continue;

        // Tránh thêm trùng nếu WC đã xử lý rồi
        $already = false;
        foreach ($tax_query as $tq) {
            if (is_array($tq) && isset($tq['taxonomy']) && $tq['taxonomy'] === $taxonomy) {
                // Force OR operator dù WC đã thêm
                $already = true;
                break;
            }
        }
        if ($already) continue;

        $tax_query[] = [
            'taxonomy' => $taxonomy,
            'field'    => 'slug',
            'terms'    => $values,
            'operator' => 'IN',
        ];
        $changed = true;
    }

    if ($changed) {
        if (!isset($tax_query['relation'])) {
            $tax_query['relation'] = 'AND';
        }
        $query->set('tax_query', $tax_query);
    }
}

// Mobile filter toggle button
add_action('woocommerce_before_main_content', 'sigon_mobile_filter_toggle', 15);
function sigon_mobile_filter_toggle() {
    if (!is_shop() && !is_product_category() && !is_product_taxonomy()) return;
    echo '<button class="sigon-filter-toggle" onclick="document.querySelector(\'.sigon-filter-sidebar\').classList.toggle(\'mobile-open\')">&#128269; B&#7897; l&#7885;c s&#7843;n ph&#7849;m</button>';
}


// ============================================================
// GLOBAL HEADER — Topbar + Header + Nav on all non-homepage pages
// ============================================================

// Enqueue Font Awesome globally (non-homepage)
add_action('wp_enqueue_scripts', 'sigon_enqueue_global_assets');
function sigon_enqueue_global_assets() {
    if (is_front_page()) return;
    wp_enqueue_style('sigon-fontawesome', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css', [], '6.5.0');
}

// Inject header CSS on non-homepage pages
add_action('wp_head', 'sigon_global_header_css');
function sigon_global_header_css() {
    if (is_front_page()) return;
    echo '<style>
.wp-site-blocks>header{display:none!important}
.sigon-topbar{background:#1E3D24;color:#F5EFE2;font-size:12px;padding:6px 0;font-family:"Be Vietnam Pro",sans-serif}
.sigon-topbar .tb-inner{max-width:1400px;margin:0 auto;padding:0 16px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px}
.sigon-topbar .tb-left{display:flex;gap:16px}
.sigon-topbar .tb-left span{display:flex;align-items:center;gap:5px}
.sigon-topbar .tb-right{display:flex;align-items:center;gap:12px}
.sigon-topbar .tb-social a{color:#F5EFE2;font-size:14px;margin:0 4px;opacity:.85;text-decoration:none}
.sigon-topbar .tb-social a:hover{opacity:1;color:#C44D28}
.sigon-topbar .tb-phone{display:flex;align-items:center;gap:5px;font-weight:600}
.sigon-header{background:#F5EFE2;box-shadow:0 2px 8px rgba(0,0,0,.08);position:sticky;top:0;z-index:200}
.sigon-header .header-main{max-width:1400px;margin:0 auto;padding:12px 16px;display:flex;align-items:center;gap:16px}
.sigon-logo{text-decoration:none;display:flex;flex-direction:column;line-height:1;flex-shrink:0}
.sigon-logo .logo-main{font-family:"Montserrat",sans-serif;font-weight:900;font-size:28px;color:#2D5535;letter-spacing:-1px}
.sigon-logo .logo-main .si{color:#C44D28}
.sigon-logo .logo-sport{font-family:"Montserrat",sans-serif;font-weight:700;font-size:13px;color:#C44D28;letter-spacing:3px;text-transform:uppercase;margin-top:1px}
.sigon-search{flex:1;max-width:500px;position:relative}
.sigon-search form{display:flex;border:2px solid #2D5535;border-radius:25px;overflow:hidden;background:#fff}
.sigon-search input{flex:1;border:none!important;padding:10px 16px!important;font-size:14px!important;font-family:"Be Vietnam Pro",sans-serif;outline:none!important;box-shadow:none!important;background:transparent}
.sigon-search button{background:#2D5535!important;border:none!important;color:#fff!important;padding:10px 18px!important;cursor:pointer;font-size:16px!important;min-height:auto!important;border-radius:0!important;transform:none!important}
.header-actions{display:flex;gap:8px;align-items:center;flex-shrink:0}
.header-action-btn{display:flex;flex-direction:column;align-items:center;gap:2px;background:none;border:none;cursor:pointer;font-size:11px;color:#2D5535;font-weight:600;font-family:"Be Vietnam Pro",sans-serif;text-decoration:none;padding:6px 10px;border-radius:8px;transition:background .2s;position:relative}
.header-action-btn:hover{background:#EDE6D6;color:#2D5535}
.header-action-btn i{font-size:20px}
.cart-count-badge{position:absolute;top:2px;right:4px;background:#E5002B;color:#fff;font-size:10px;font-weight:700;border-radius:50%;width:16px;height:16px;display:flex;align-items:center;justify-content:center}
.sigon-main-nav{background:#2D5535}
.sigon-main-nav .nav-inner{max-width:1400px;margin:0 auto;padding:0 16px;display:flex;align-items:stretch}
.sigon-main-nav ul{list-style:none;margin:0;padding:0;display:flex;align-items:stretch}
.sigon-main-nav ul li{position:relative}
.sigon-main-nav ul li a{display:flex;align-items:center;gap:6px;padding:12px 14px;color:#fff;text-decoration:none;font-size:13px;font-weight:700;font-family:"Be Vietnam Pro",sans-serif;text-transform:uppercase;letter-spacing:.3px;transition:background .2s;white-space:nowrap}
.sigon-main-nav ul li a:hover,.sigon-main-nav ul li:hover>a{background:#1E3D24}
.sigon-main-nav .nav-hot>a{color:#FFD46B}
.sigon-main-nav .nav-secondhand>a{color:#EDE6D6;background:rgba(139,94,60,.4)}
.sigon-main-nav .nav-secondhand>a:hover{background:#8B5E3C}
.sigon-main-nav .dropdown{display:none;position:absolute;top:100%;left:0;background:#fff;min-width:220px;box-shadow:0 4px 20px rgba(0,0,0,.15);border-radius:0 0 8px 8px;z-index:300;padding:6px 0}
.sigon-main-nav ul li:hover .dropdown{display:block}
.sigon-main-nav .dropdown a{color:#333!important;padding:10px 18px!important;font-size:13px!important;font-weight:600!important;text-transform:none!important;letter-spacing:0!important;display:flex!important;align-items:center!important;gap:8px!important}
.sigon-main-nav .dropdown a:hover{background:#F5EFE2!important;color:#2D5535!important}
.badge-secondhand{position:absolute;top:8px;right:8px;background:#8B5E3C;color:#fff;font-size:10px;font-weight:700;padding:3px 6px;border-radius:4px;font-family:"Be Vietnam Pro",sans-serif;z-index:10;letter-spacing:.3px;text-transform:uppercase;pointer-events:none}
ul.products li.product{position:relative}
.sigon-main-nav .nav-inner ul > li,
.sigon-main-nav .nav-inner > ul > li { display: list-item !important; }
.sigon-main-nav .nav-inner ul > li.nav-hot,
.sigon-main-nav .nav-inner > ul > li.nav-hot { display: none !important; }
</style>';
}

// Inject header HTML on non-homepage pages
add_action('wp_body_open', 'sigon_global_header_html');
function sigon_global_header_html() {
    if (is_front_page()) return;
    $shop_url = function_exists('wc_get_page_id') ? get_permalink(wc_get_page_id('shop')) : home_url('/cua-hang/');
    $cart_url = home_url('/gio-hang/');
    $account_url = function_exists('wc_get_page_permalink') ? wc_get_page_permalink('myaccount') : home_url('/my-account/');
    $cart_count = function_exists('WC') && WC()->cart ? WC()->cart->get_cart_contents_count() : 0;
    $badge = $cart_count > 0 ? '<span class="cart-count-badge">' . $cart_count . '</span>' : '';
    echo '
<div class="sigon-topbar">
  <div class="tb-inner">
    <div class="tb-left">
      <span>🚚 Miễn phí vận chuyển đơn từ 1 tri&#7879;u</span>
      <span>✅ Hàng chính hãng 100%</span>
    </div>
    <div class="tb-right">
      <div class="tb-social">
        <a href="https://www.facebook.com/SigonSecondhand" target="_blank"><i class="fab fa-facebook-f"></i></a>
        <a href="https://www.instagram.com/sigonsecondhand" target="_blank"><i class="fab fa-instagram"></i></a>
        <a href="https://www.tiktok.com/@sigonsecondhand" target="_blank"><i class="fab fa-tiktok"></i></a>
      </div>
      <div class="tb-phone"><i class="fas fa-phone"></i> 0878.627.139</div>
    </div>
  </div>
</div>
<div class="sigon-header">
  <div class="header-main">
    <a href="' . home_url('/') . '" class="sigon-logo">
      <div class="logo-main"><span class="si">Si</span>Gon</div>
      <div class="logo-sport">SPORT</div>
    </a>
    <div class="sigon-search">
      <form action="' . home_url('/') . '" method="get">
        <input type="text" name="s" placeholder="Tìm giày, vợt, dụng cụ thể thao..." value="' . esc_attr(get_search_query()) . '">
        <button type="submit"><i class="fas fa-search"></i></button>
      </form>
    </div>
    <div class="header-actions">
      <a href="' . esc_url($cart_url) . '" class="header-action-btn">
        <i class="fas fa-shopping-cart"></i><span>Giỏ hàng</span>' . $badge . '
      </a>
      <a href="' . esc_url($account_url) . '" class="header-action-btn">
        <i class="fas fa-user"></i><span>Tài khoản</span>
      </a>
    </div>
  </div>
</div>
<nav class="sigon-main-nav" aria-label="Danh mục sản phẩm">
  <div class="nav-inner"><ul>
    <li class="nav-hot" style="display:none"><a href="' . esc_url($shop_url) . '?orderby=popularity"><i class="fas fa-fire"></i> FLASH SALE</a></li>
    <li>
      <a href="' . home_url('/danh-muc-san-pham/giay-bong-da/') . '"><i class="fas fa-futbol"></i> BÓNG ĐÁ <i class="fas fa-chevron-down" style="font-size:10px;opacity:.7"></i></a>
      <div class="dropdown">
        <a href="' . home_url('/danh-muc-san-pham/giay-bong-da/') . '"><i class="fas fa-shoe-prints"></i> Giày sân cỏ (FG)</a>
        <a href="' . home_url('/danh-muc-san-pham/giay-bong-da/') . '"><i class="fas fa-shoe-prints"></i> Giày sân nhân tạo (TF/AG)</a>
        <a href="' . home_url('/danh-muc-san-pham/giay-bong-da/') . '"><i class="fas fa-shoe-prints"></i> Giày futsal (IC)</a>
        <a href="' . home_url('/danh-muc-san-pham/giay-bong-da-secondhand/') . '" style="color:#8B5E3C!important"><i class="fas fa-recycle"></i> Bóng đá 2nd</a>
      </div>
    </li>
    <li>
      <a href="' . home_url('/danh-muc-san-pham/giay-cau-long/') . '"><i class="fas fa-circle-notch"></i> CẦU LÔNG <i class="fas fa-chevron-down" style="font-size:10px;opacity:.7"></i></a>
      <div class="dropdown">
        <a href="' . home_url('/danh-muc-san-pham/vot-cau-long/') . '"><i class="fas fa-grip-lines-vertical"></i> Vợt cầu lông</a>
        <a href="' . home_url('/danh-muc-san-pham/giay-cau-long/') . '"><i class="fas fa-shoe-prints"></i> Giày cầu lông</a>
        <a href="' . home_url('/danh-muc-san-pham/phu-kien-cau-long/') . '"><i class="fas fa-tools"></i> Phụ kiện</a>
        <a href="' . home_url('/danh-muc-san-pham/giay-cau-long-secondhand/') . '" style="color:#8B5E3C!important"><i class="fas fa-recycle"></i> Cầu lông 2nd</a>
      </div>
    </li>
    <li>
      <a href="' . home_url('/danh-muc-san-pham/giay-tennis/') . '"><i class="fas fa-table-tennis"></i> TENNIS <i class="fas fa-chevron-down" style="font-size:10px;opacity:.7"></i></a>
      <div class="dropdown">
        <a href="' . home_url('/danh-muc-san-pham/vot-tennis/') . '"><i class="fas fa-grip-lines-vertical"></i> Vợt tennis</a>
        <a href="' . home_url('/danh-muc-san-pham/giay-tennis/') . '"><i class="fas fa-shoe-prints"></i> Giày tennis</a>
        <a href="' . home_url('/danh-muc-san-pham/phu-kien-tennis/') . '"><i class="fas fa-tools"></i> Phụ kiện</a>
        <a href="' . home_url('/danh-muc-san-pham/giay-tennis-secondhand/') . '" style="color:#8B5E3C!important"><i class="fas fa-recycle"></i> Tennis 2nd</a>
      </div>
    </li>
    <li>
      <a href="' . home_url('/danh-muc-san-pham/giay-pickleball/') . '">PICKLEBALL <i class="fas fa-chevron-down" style="font-size:10px;opacity:.7"></i></a>
      <div class="dropdown">
        <a href="' . home_url('/danh-muc-san-pham/vot-pickleball/') . '"><i class="fas fa-grip-lines-vertical"></i> Vợt pickleball</a>
        <a href="' . home_url('/danh-muc-san-pham/giay-pickleball/') . '"><i class="fas fa-shoe-prints"></i> Giày pickleball</a>
        <a href="' . home_url('/danh-muc-san-pham/phu-kien-pickleball/') . '"><i class="fas fa-tools"></i> Phụ kiện</a>
      </div>
    </li>
    <li class="nav-secondhand"><a href="' . home_url('/danh-muc-san-pham/giay-secondhand/') . '"><i class="fas fa-recycle"></i> 2HAND ⭐</a></li>
    <li><a href="' . esc_url($shop_url) . '"><i class="fas fa-th-large"></i> TẤT CẢ</a></li>
  </ul></div>
</nav>';
}


// ============================================================
// SIGON — REQUIRED ATTRIBUTES: THUONG HIEU & SIZE
// Meta box luon hien san, bat buoc truoc khi luu san pham
// ============================================================

add_action('add_meta_boxes', 'sigon_required_attrs_metabox');
function sigon_required_attrs_metabox() {
    add_meta_box(
        'sigon_required_attrs',
        '⭐ Thương Hiệu & Size — Bắt buộc',
        'sigon_required_attrs_html',
        'product',
        'normal',
        'high'
    );
}

function sigon_required_attrs_html($post) {
    wp_nonce_field('sigon_save_required_attrs', 'sigon_ra_nonce');

    $saved_brand = '';
    $saved_size  = '';
    $brand_terms = wp_get_post_terms($post->ID, 'pa_thuong-hieu', ['fields' => 'slugs']);
    $size_terms  = wp_get_post_terms($post->ID, 'pa_size', ['fields' => 'slugs']);
    if (!is_wp_error($brand_terms) && !empty($brand_terms)) $saved_brand = $brand_terms[0];
    if (!is_wp_error($size_terms)  && !empty($size_terms))  $saved_size  = $size_terms[0];

    $brands = get_terms(['taxonomy' => 'pa_thuong-hieu', 'hide_empty' => false, 'orderby' => 'name']);
    $sizes  = get_terms(['taxonomy' => 'pa_size',        'hide_empty' => false]);
    if (!is_wp_error($sizes)) {
        usort($sizes, function($a, $b) { return (float)$a->name - (float)$b->name; });
    }
    ?>
    <style>
    #sigon_required_attrs { border-left: 4px solid #C44D28; }
    #sigon_required_attrs .inside { padding: 16px; }
    .sigon-ra-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .sigon-ra-field label { font-weight:700; font-size:13px; display:block; margin-bottom:6px; color:#1a1a1a; }
    .sigon-ra-field label .req { color:#E5002B; margin-left:2px; }
    .sigon-ra-field select {
        width:100%; padding:9px 12px; font-size:14px;
        border:2px solid #ddd; border-radius:6px; transition:border-color .2s;
    }
    .sigon-ra-field select:focus { border-color:#2D5535; outline:none; }
    .sigon-ra-field select.ra-error { border-color:#E5002B !important; background:#fff5f5; }
    .sigon-ra-err-msg { color:#E5002B; font-size:12px; margin-top:4px; display:none; }
    .sigon-ra-note { margin-top:14px; font-size:12px; color:#888; border-top:1px solid #eee; padding-top:10px; }
    </style>

    <div class="sigon-ra-grid">
        <div class="sigon-ra-field">
            <label>🏷️ Thương Hiệu <span class="req">*</span></label>
            <select name="sigon_attr_brand" id="sigon_attr_brand">
                <option value="">— Chọn thương hiệu —</option>
                <?php if (!is_wp_error($brands)) foreach ($brands as $t): ?>
                <option value="<?php echo esc_attr($t->slug); ?>" <?php selected($saved_brand, $t->slug); ?>><?php echo esc_html($t->name); ?></option>
                <?php endforeach; ?>
            </select>
            <div class="sigon-ra-err-msg" id="err_brand">Vui lòng chọn thương hiệu</div>
        </div>
        <div class="sigon-ra-field">
            <label>📏 Size <span class="req">*</span></label>
            <select name="sigon_attr_size" id="sigon_attr_size">
                <option value="">— Chọn size —</option>
                <?php if (!is_wp_error($sizes)) foreach ($sizes as $t): ?>
                <option value="<?php echo esc_attr($t->slug); ?>" <?php selected($saved_size, $t->slug); ?>><?php echo esc_html($t->name); ?></option>
                <?php endforeach; ?>
            </select>
            <div class="sigon-ra-err-msg" id="err_size">Vui lòng chọn size</div>
        </div>
    </div>
    <p class="sigon-ra-note">Hai trường trên bắt buộc — sản phẩm sẽ không được lưu nếu còn trống.</p>

    <script>
    document.addEventListener('DOMContentLoaded', function() {
        var form = document.getElementById('post');
        if (!form) return;
        form.addEventListener('submit', function(e) {
            var brand = document.getElementById('sigon_attr_brand');
            var size  = document.getElementById('sigon_attr_size');
            var ok = true;
            function check(el, errId) {
                var msg = document.getElementById(errId);
                if (!el.value) {
                    el.classList.add('ra-error');
                    if (msg) msg.style.display = 'block';
                    ok = false;
                } else {
                    el.classList.remove('ra-error');
                    if (msg) msg.style.display = 'none';
                }
            }
            check(brand, 'err_brand');
            check(size,  'err_size');
            if (!ok) {
                e.preventDefault();
                e.stopImmediatePropagation();
                document.getElementById('sigon_required_attrs').scrollIntoView({behavior:'smooth', block:'center'});
                return false;
            }
        }, true);
    });
    </script>
    <?php
}

add_action('woocommerce_process_product_meta', 'sigon_save_required_attrs', 20);
function sigon_save_required_attrs($post_id) {
    if (!isset($_POST['sigon_ra_nonce']) ||
        !wp_verify_nonce($_POST['sigon_ra_nonce'], 'sigon_save_required_attrs')) return;
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;

    $brand_slug = sanitize_text_field($_POST['sigon_attr_brand'] ?? '');
    $size_slug  = sanitize_text_field($_POST['sigon_attr_size']  ?? '');

    $product = wc_get_product($post_id);
    if (!$product) return;

    $attributes = $product->get_attributes();

    if ($brand_slug) {
        $term = get_term_by('slug', $brand_slug, 'pa_thuong-hieu');
        if ($term) {
            wp_set_object_terms($post_id, [$term->term_id], 'pa_thuong-hieu', false);
            $attr = new WC_Product_Attribute();
            $attr->set_id(wc_attribute_taxonomy_id_by_name('pa_thuong-hieu'));
            $attr->set_name('pa_thuong-hieu');
            $attr->set_options([$term->term_id]);
            $attr->set_position(0);
            $attr->set_visible(true);
            $attr->set_variation(false);
            $attributes['pa_thuong-hieu'] = $attr;
        }
    }

    if ($size_slug) {
        $term = get_term_by('slug', $size_slug, 'pa_size');
        if ($term) {
            wp_set_object_terms($post_id, [$term->term_id], 'pa_size', false);
            $attr = new WC_Product_Attribute();
            $attr->set_id(wc_attribute_taxonomy_id_by_name('pa_size'));
            $attr->set_name('pa_size');
            $attr->set_options([$term->term_id]);
            $attr->set_position(1);
            $attr->set_visible(true);
            $attr->set_variation(false);
            $attributes['pa_size'] = $attr;
        }
    }

    $product->set_attributes($attributes);
    $product->save();
}
// ==== META PIXEL ====
add_action('wp_head', 'sigon_meta_pixel', 1);
function sigon_meta_pixel() {
?>
<!-- Meta Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1693808725190781');
fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=1693808725190781&ev=PageView&noscript=1"
/></noscript>
<!-- End Meta Pixel Code -->
<?php
}

// ==== META PIXEL - ECOMMERCE EVENTS ====

// 1. ViewContent (trang sản phẩm) + InitiateCheckout + Search
add_action('wp_footer', 'sigon_pixel_page_events', 20);
function sigon_pixel_page_events() {
    if (!function_exists('is_product')) return;

    // --- ViewContent: trang chi tiết sản phẩm ---
    if (is_product()) {
        global $product;
        if (!$product) $product = wc_get_product(get_the_ID());
        if ($product) {
            $price    = $product->get_price();
            $name     = $product->get_name();
            $id       = $product->get_id();
            $cats     = wp_get_post_terms($id, 'product_cat', ['fields' => 'names']);
            $category = !empty($cats) ? $cats[0] : '';
            ?>
<script>
fbq('track', 'ViewContent', {
    content_ids:      ['<?php echo esc_js($id); ?>'],
    content_name:     '<?php echo esc_js($name); ?>',
    content_category: '<?php echo esc_js($category); ?>',
    content_type:     'product',
    value:            <?php echo floatval($price); ?>,
    currency:         'VND'
});
</script>
            <?php
        }
    }

    // --- InitiateCheckout: trang thanh toán ---
    if (is_checkout() && !is_order_received_page()) {
        $cart  = WC()->cart;
        $total = $cart ? $cart->get_cart_contents_total() : 0;
        $count = $cart ? $cart->get_cart_contents_count() : 0;
        ?>
<script>
fbq('track', 'InitiateCheckout', {
    value:     <?php echo floatval($total); ?>,
    currency:  'VND',
    num_items: <?php echo intval($count); ?>
});
</script>
        <?php
    }

    // --- Search ---
    if (is_search() && !empty(get_search_query())) {
        ?>
<script>
fbq('track', 'Search', {
    search_string: '<?php echo esc_js(get_search_query()); ?>'
});
</script>
        <?php
    }
}

// 2. Purchase: trang cảm ơn sau đặt hàng
add_action('woocommerce_thankyou', 'sigon_pixel_purchase', 10);
function sigon_pixel_purchase($order_id) {
    if (!$order_id) return;
    $order = wc_get_order($order_id);
    if (!$order) return;
    // Chống fire nhiều lần khi F5
    if (get_post_meta($order_id, '_pixel_purchase_fired', true)) return;
    update_post_meta($order_id, '_pixel_purchase_fired', '1');

    $contents = [];
    foreach ($order->get_items() as $item) {
        $contents[] = [
            'id'       => strval($item->get_product_id()),
            'quantity' => $item->get_quantity(),
        ];
    }
    ?>
<script>
fbq('track', 'Purchase', {
    value:        <?php echo floatval($order->get_total()); ?>,
    currency:     'VND',
    order_id:     '<?php echo esc_js($order->get_order_number()); ?>',
    content_type: 'product',
    contents:     <?php echo wp_json_encode($contents); ?>,
    num_items:    <?php echo intval($order->get_item_count()); ?>
});
</script>
    <?php
}

// 3. AddToCart: JavaScript listen WooCommerce events
add_action('wp_footer', 'sigon_pixel_add_to_cart_js', 30);
function sigon_pixel_add_to_cart_js() {
    ?>
<script>
(function() {
    // AddToCart - từ nút AJAX trên trang shop/archive
    document.body.addEventListener('added_to_cart', function() {}, false);
    if (typeof jQuery !== 'undefined') {
        jQuery(document.body).on('added_to_cart', function(e, fragments, hash, $btn) {
            if (!$btn) return;
            var pid   = $btn.data('product_id') || '';
            var pname = '';
            var $card = $btn.closest('.product, [class*="wc-block-product"]');
            if ($card.length) pname = $card.find('h2, .woocommerce-loop-product__title').first().text().trim();
            var priceRaw = $card.find('.woocommerce-Price-amount').first().text().replace(/[^d]/g,'');
            var price = parseFloat(priceRaw) || 0;
            fbq('track', 'AddToCart', {
                content_ids:  [String(pid)],
                content_name: pname,
                content_type: 'product',
                value:        price,
                currency:     'VND'
            });
        });

        // AddToCart - nút trên trang chi tiết sản phẩm
        jQuery(document).on('click', '.single_add_to_cart_button', function() {
            var $form = jQuery(this).closest('form.cart');
            var pid   = jQuery('input[name="product_id"]', $form).val()
                     || jQuery('input[name="add-to-cart"]', $form).val()
                     || '';
            var pname = jQuery('h1.product_title').text().trim();
            var price = parseFloat(jQuery('.woocommerce-Price-amount bdi').first().text().replace(/[^d]/g,'')) || 0;
            var qty   = parseInt(jQuery('input.qty', $form).val()) || 1;
            fbq('track', 'AddToCart', {
                content_ids:  [String(pid)],
                content_name: pname,
                content_type: 'product',
                value:        price * qty,
                currency:     'VND'
            });
        });
    }
})();
</script>
    <?php
}

// ==== CHECKOUT FIELDS - CHỈ GIỮ TÊN, SĐT, ĐỊA CHỈ ====
add_filter('woocommerce_checkout_fields', 'sigon_custom_checkout_fields');
function sigon_custom_checkout_fields($fields) {

    // Billing: chỉ giữ họ tên, sđt, địa chỉ, email (không bắt buộc)
    $fields['billing'] = [
        'billing_first_name' => [
            'label'       => 'Họ và tên',
            'placeholder' => 'Nhập họ và tên đầy đủ',
            'required'    => true,
            'class'       => ['form-row-wide'],
            'priority'    => 10,
        ],
        'billing_phone' => [
            'label'       => 'Số điện thoại',
            'placeholder' => 'Số điện thoại nhận hàng',
            'required'    => true,
            'class'       => ['form-row-wide'],
            'type'        => 'tel',
            'validate'    => ['phone'],
            'priority'    => 20,
        ],
        'billing_address_1' => [
            'label'       => 'Địa chỉ giao hàng',
            'placeholder' => 'Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố',
            'required'    => true,
            'class'       => ['form-row-wide'],
            'priority'    => 30,
        ],
        'billing_email' => [
            'label'       => 'Email (không bắt buộc)',
            'placeholder' => 'Email nhận xác nhận đơn hàng',
            'required'    => false,
            'class'       => ['form-row-wide'],
            'priority'    => 40,
        ],
    ];

    // Xóa toàn bộ shipping fields (dùng billing address làm địa chỉ giao)
    $fields['shipping'] = [];

    // Bỏ ghi chú đơn hàng
    unset($fields['order']['order_comments']);

    return $fields;
}

// Bỏ validate email bắt buộc
add_filter('woocommerce_checkout_required_fields', 'sigon_checkout_optional_email');
function sigon_checkout_optional_email($fields) {
    unset($fields['billing_email']);
    return $fields;
}

// Dùng billing_first_name làm tên đầy đủ (ẩn last name)
add_filter('woocommerce_default_address_fields', 'sigon_address_fields');
function sigon_address_fields($fields) {
    unset($fields['last_name']);
    unset($fields['company']);
    unset($fields['postcode']);
    unset($fields['state']);
    unset($fields['city']);
    if (isset($fields['first_name'])) {
        $fields['first_name']['label']       = 'Họ và tên';
        $fields['first_name']['placeholder'] = 'Nhập họ và tên đầy đủ';
        $fields['first_name']['class']       = ['form-row-wide'];
    }
    if (isset($fields['address_1'])) {
        $fields['address_1']['label']       = 'Địa chỉ giao hàng';
        $fields['address_1']['placeholder'] = 'Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố';
        $fields['address_1']['class']       = ['form-row-wide'];
    }
    unset($fields['address_2']);
    return $fields;
}

// ==== VIETQR - HIỂN THỊ QR CHUYỂN KHOẢN TRONG CHECKOUT ====
add_action('woocommerce_review_order_before_payment', 'sigon_vietqr_checkout');
function sigon_vietqr_checkout() {
    $bank_id    = 'MB';
    $account_no = '0908854848';
    $account_name = 'PHAM THI HANH';
    $cart_total = WC()->cart ? intval(WC()->cart->get_cart_contents_total()) : 0;
    $qr_url = "https://img.vietqr.io/image/{$bank_id}-{$account_no}-compact2.png?amount={$cart_total}&addInfo=SiGon+Secondhand&accountName=" . urlencode($account_name);
    ?>
<div id="sigon-vietqr" style="display:none; background:#f0fdf4; border:2px solid #2D5535; border-radius:12px; padding:20px; margin:16px 0; text-align:center; font-family:'Be Vietnam Pro',sans-serif;">
    <div style="font-weight:800; font-size:15px; color:#2D5535; margin-bottom:4px;">💳 CHUYỂN KHOẢN NGÂN HÀNG</div>
    <div style="font-size:13px; color:#555; margin-bottom:12px;">Quét QR hoặc chuyển khoản thủ công</div>
    <img src="<?php echo esc_url($qr_url); ?>" alt="QR chuyển khoản SiGon" style="width:200px;height:200px;border-radius:8px;border:1px solid #ddd;background:#fff;" onerror="this.style.display='none'">
    <div style="margin-top:12px; background:#fff; border-radius:8px; padding:12px 16px; display:inline-block; text-align:left; font-size:13px; line-height:2; border:1px solid #e5e7eb;">
        <div>🏦 <strong>Ngân hàng:</strong> MBBank</div>
        <div>💳 <strong>STK:</strong> <span style="font-size:16px;font-weight:800;color:#2D5535;letter-spacing:1px">0908854848</span></div>
        <div>👤 <strong>Chủ TK:</strong> PHAM THI HANH</div>
        <div>📝 <strong>Nội dung:</strong> [SĐT] + Tên của bạn</div>
    </div>
    <div style="margin-top:10px; font-size:12px; color:#e5002b; font-weight:600;">⚠️ Đơn hàng xử lý sau khi nhận được thanh toán</div>
</div>
<script>
(function() {
    function toggleQR() {
        var bacs = document.querySelector('input[value="bacs"]');
        var box  = document.getElementById('sigon-vietqr');
        if (!box) return;
        box.style.display = (bacs && bacs.checked) ? 'block' : 'none';
    }
    document.addEventListener('change', function(e) {
        if (e.target && e.target.name === 'payment_method') toggleQR();
    });
    // Kiểm tra khi trang load
    document.addEventListener('DOMContentLoaded', toggleQR);
    setTimeout(toggleQR, 800);
    // WooCommerce updated_checkout
    if (typeof jQuery !== 'undefined') {
        jQuery(document.body).on('updated_checkout', function() {
            setTimeout(toggleQR, 200);
        });
    }
})();
</script>
    <?php
}

// ==== ZALO CHAT WIDGET ====
add_action('wp_footer', 'sigon_zalo_chat_widget', 99);
function sigon_zalo_chat_widget() {
?>
<style>
#sigon-zalo {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 10px;
    font-family: 'Be Vietnam Pro', sans-serif;
}
#sigon-zalo .zalo-tooltip {
    background: #fff;
    color: #333;
    font-size: 13px;
    font-weight: 600;
    padding: 8px 14px;
    border-radius: 20px;
    box-shadow: 0 4px 16px rgba(0,0,0,.15);
    white-space: nowrap;
    opacity: 0;
    transform: translateX(10px);
    transition: all .25s ease;
    pointer-events: none;
}
#sigon-zalo:hover .zalo-tooltip {
    opacity: 1;
    transform: translateX(0);
}
#sigon-zalo .zalo-btn {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: #0068FF;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 16px rgba(0,104,255,.45);
    text-decoration: none;
    position: relative;
    transition: transform .2s ease, box-shadow .2s ease;
}
#sigon-zalo .zalo-btn:hover {
    transform: scale(1.08);
    box-shadow: 0 6px 24px rgba(0,104,255,.55);
}
#sigon-zalo .zalo-btn svg {
    width: 32px;
    height: 32px;
}
/* Vòng pulse */
#sigon-zalo .zalo-btn::before {
    content: '';
    position: absolute;
    inset: -4px;
    border-radius: 50%;
    background: rgba(0,104,255,.25);
    animation: zalo-pulse 2s ease-in-out infinite;
}
#sigon-zalo .zalo-btn::after {
    content: '';
    position: absolute;
    inset: -8px;
    border-radius: 50%;
    background: rgba(0,104,255,.12);
    animation: zalo-pulse 2s ease-in-out infinite .4s;
}
@keyframes zalo-pulse {
    0%   { transform: scale(1); opacity: 1; }
    100% { transform: scale(1.5); opacity: 0; }
}
@media (max-width: 767px) {
    #sigon-zalo { bottom: 16px; right: 16px; }
    #sigon-zalo .zalo-btn { width: 50px; height: 50px; }
}
</style>

<div id="sigon-zalo">
    <div class="zalo-tooltip">💬 Chat Zalo với SiGon</div>
    <a class="zalo-btn" href="https://zalo.me/0878627139" target="_blank" rel="noopener" aria-label="Chat Zalo với SiGon">
        <!-- Zalo icon SVG -->
        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="48" height="48" rx="24" fill="#0068FF"/>
            <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-family="Arial,sans-serif" font-weight="900" font-size="16" fill="white">Zalo</text>
        </svg>
    </a>
</div>
<?php
}

// ==== TRANG HUONG DAN DANG SAN PHAM ====
add_action('template_redirect', function() {
  if (!is_page('huong-dan-dang-san-pham')) return;
  header('Content-Type: text/html; charset=UTF-8');
  echo <<<'GUIDEPAGE'
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hướng Dẫn Đăng Sản Phẩm – SiGon Sport</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    :root {
      --green: #2D5535;
      --green-dark: #1E3D24;
      --green-light: #e8f0ea;
      --si: #C44D28;
      --cream: #F5EFE2;
      --brown: #8B5E3C;
      --red: #E5002B;
      --text: #1a1a1a;
      --text-muted: #666;
      --border: #ddd;
      --white: #fff;
      --shadow: 0 2px 12px rgba(0,0,0,0.08);
    }

    body {
      font-family: -apple-system, 'Be Vietnam Pro', 'Segoe UI', sans-serif;
      background: var(--cream);
      color: var(--text);
      font-size: 15px;
      line-height: 1.6;
    }

    /* HEADER */
    .header {
      background: var(--green-dark);
      color: white;
      padding: 20px 16px 16px;
      text-align: center;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    }
    .header .logo {
      font-size: 22px;
      font-weight: 900;
      letter-spacing: -0.5px;
    }
    .header .logo span { color: #f5a623; }
    .header .subtitle {
      font-size: 12px;
      opacity: 0.8;
      margin-top: 2px;
    }

    /* NAV TABS */
    .nav-tabs {
      background: var(--green);
      display: flex;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
      border-bottom: 3px solid var(--green-dark);
    }
    .nav-tabs::-webkit-scrollbar { display: none; }
    .nav-tab {
      flex-shrink: 0;
      padding: 10px 16px;
      color: rgba(255,255,255,0.7);
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
      border-bottom: 3px solid transparent;
      margin-bottom: -3px;
      transition: all 0.2s;
    }
    .nav-tab.active {
      color: white;
      border-bottom-color: #f5a623;
    }

    /* CONTENT */
    .content { display: none; }
    .content.active { display: block; }

    /* HERO */
    .hero {
      background: linear-gradient(135deg, var(--green) 0%, var(--green-dark) 100%);
      color: white;
      padding: 28px 16px 24px;
      text-align: center;
    }
    .hero h1 {
      font-size: 20px;
      font-weight: 800;
      margin-bottom: 8px;
    }
    .hero p {
      font-size: 13px;
      opacity: 0.85;
      line-height: 1.5;
    }
    .hero .time-badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      background: rgba(255,255,255,0.15);
      border-radius: 20px;
      padding: 5px 12px;
      font-size: 12px;
      margin-top: 12px;
    }

    /* SECTION */
    .section {
      padding: 16px;
    }
    .section-title {
      font-size: 13px;
      font-weight: 700;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .section-title::after {
      content: '';
      flex: 1;
      height: 1px;
      background: var(--border);
    }

    /* STEP CARD */
    .step-card {
      background: var(--white);
      border-radius: 12px;
      margin-bottom: 12px;
      overflow: hidden;
      box-shadow: var(--shadow);
      border: 1px solid rgba(0,0,0,0.06);
    }
    .step-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 16px;
      cursor: pointer;
      user-select: none;
    }
    .step-num {
      width: 32px;
      height: 32px;
      background: var(--green);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 800;
      flex-shrink: 0;
    }
    .step-info { flex: 1 }
    .step-title {
      font-size: 15px;
      font-weight: 700;
      color: var(--text);
    }
    .step-desc {
      font-size: 12px;
      color: var(--text-muted);
      margin-top: 1px;
    }
    .step-toggle {
      font-size: 18px;
      color: var(--text-muted);
      transition: transform 0.2s;
    }
    .step-card.open .step-toggle { transform: rotate(180deg); }

    .step-body {
      display: none;
      padding: 0 16px 16px;
      border-top: 1px solid #f0f0f0;
    }
    .step-card.open .step-body { display: block; }

    /* MOCK SCREEN */
    .mock-screen {
      background: #1a1a2e;
      border-radius: 16px;
      margin: 12px 0;
      overflow: hidden;
      border: 3px solid #333;
      position: relative;
    }
    .mock-statusbar {
      background: #000;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 12px;
    }
    .mock-statusbar span { color: white; font-size: 9px; }
    .mock-browser-bar {
      background: #f1f1f1;
      padding: 6px 10px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .mock-url-pill {
      flex: 1;
      background: white;
      border-radius: 8px;
      padding: 4px 10px;
      font-size: 11px;
      color: #444;
      border: 1px solid #ddd;
    }
    .mock-body {
      background: white;
      padding: 12px;
      min-height: 80px;
    }
    .mock-field {
      border: 1px solid #ddd;
      border-radius: 6px;
      padding: 8px 10px;
      margin-bottom: 8px;
      font-size: 12px;
      color: #999;
    }
    .mock-field.filled {
      color: #1a1a1a;
      border-color: var(--green);
      background: #f9fffe;
    }
    .mock-btn {
      background: var(--green);
      color: white;
      padding: 10px;
      border-radius: 8px;
      text-align: center;
      font-size: 13px;
      font-weight: 700;
      margin-top: 8px;
    }
    .mock-label {
      font-size: 10px;
      font-weight: 700;
      color: var(--text-muted);
      margin-bottom: 3px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* WP MENU MOCK */
    .wp-menu-mock {
      background: #1e1e1e;
      border-radius: 10px;
      overflow: hidden;
      margin: 12px 0;
    }
    .wp-menu-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 11px 14px;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      color: rgba(255,255,255,0.7);
      font-size: 13px;
    }
    .wp-menu-item.active {
      background: var(--green);
      color: white;
    }
    .wp-menu-item .icon {
      width: 20px;
      text-align: center;
      font-size: 14px;
    }
    .wp-menu-arrow {
      margin-left: auto;
      font-size: 10px;
      opacity: 0.4;
    }

    /* TIPS & NOTES */
    .tip {
      background: var(--green-light);
      border-left: 3px solid var(--green);
      border-radius: 0 8px 8px 0;
      padding: 10px 12px;
      margin: 10px 0;
      font-size: 13px;
    }
    .tip strong { color: var(--green-dark); }
    .warning {
      background: #fff3cd;
      border-left: 3px solid #f0a500;
      border-radius: 0 8px 8px 0;
      padding: 10px 12px;
      margin: 10px 0;
      font-size: 13px;
    }
    .warning strong { color: #856404; }
    .error-note {
      background: #fdecea;
      border-left: 3px solid var(--red);
      border-radius: 0 8px 8px 0;
      padding: 10px 12px;
      margin: 10px 0;
      font-size: 13px;
    }
    .error-note strong { color: #8b1a1a; }

    /* CHECKLIST */
    .checklist {
      list-style: none;
      margin: 10px 0;
    }
    .checklist li {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      padding: 5px 0;
      font-size: 13px;
      border-bottom: 1px dashed #eee;
    }
    .checklist li:last-child { border-bottom: none; }
    .checklist .check-icon {
      width: 20px;
      height: 20px;
      background: var(--green-light);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      flex-shrink: 0;
      margin-top: 1px;
    }
    .checklist .req { color: var(--red); font-size: 10px; font-weight: 700; }

    /* TAG */
    .tag {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 700;
    }
    .tag-required { background: #fdecea; color: var(--red); }
    .tag-optional { background: #e8f0ea; color: var(--green); }
    .tag-secondhand { background: #f3ebe4; color: var(--brown); }

    /* INLINE STEPS */
    .inline-steps { counter-reset: istep; }
    .inline-step {
      display: flex;
      gap: 10px;
      margin-bottom: 10px;
      font-size: 13px;
      line-height: 1.5;
    }
    .inline-step::before {
      counter-increment: istep;
      content: counter(istep);
      width: 22px;
      height: 22px;
      background: var(--si);
      color: white;
      border-radius: 50%;
      font-size: 11px;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      margin-top: 1px;
    }

    /* CATEGORY GRID */
    .cat-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin: 10px 0;
    }
    .cat-item {
      background: #f8f8f8;
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 10px;
      font-size: 12px;
      text-align: center;
    }
    .cat-item .cat-icon { font-size: 20px; margin-bottom: 4px; }
    .cat-item .cat-name { font-weight: 700; font-size: 11px; color: var(--text); }
    .cat-item .cat-sub { font-size: 10px; color: var(--text-muted); margin-top: 2px; line-height: 1.3; }

    /* PHOTO GUIDE */
    .photo-rule {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 10px 0;
      border-bottom: 1px solid #f0f0f0;
      font-size: 13px;
    }
    .photo-rule:last-child { border-bottom: none; }
    .photo-icon-wrap {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      flex-shrink: 0;
    }
    .photo-icon-wrap.good { background: #e8f5e9; }
    .photo-icon-wrap.bad { background: #fdecea; }

    /* SECONDHAND BADGE */
    .badge-2h {
      display: inline-block;
      background: var(--brown);
      color: white;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 0.5px;
      vertical-align: middle;
    }

    /* CONDITION SELECT MOCK */
    .condition-options {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px;
      margin: 8px 0;
    }
    .cond-opt {
      border: 2px solid var(--border);
      border-radius: 8px;
      padding: 8px;
      text-align: center;
      font-size: 12px;
    }
    .cond-opt.selected {
      border-color: var(--green);
      background: var(--green-light);
    }
    .cond-opt .cond-pct {
      font-size: 15px;
      font-weight: 800;
      color: var(--green);
    }
    .cond-opt .cond-label {
      font-size: 10px;
      color: var(--text-muted);
      margin-top: 1px;
    }

    /* QUICK REFERENCE */
    .quick-ref {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: var(--shadow);
      margin-bottom: 12px;
    }
    .quick-ref-header {
      background: var(--green-dark);
      color: white;
      padding: 10px 14px;
      font-size: 13px;
      font-weight: 700;
    }
    .quick-ref-row {
      display: flex;
      border-bottom: 1px solid #f0f0f0;
      font-size: 12px;
    }
    .quick-ref-row:last-child { border-bottom: none; }
    .qr-label {
      background: #f8f8f8;
      padding: 10px 12px;
      width: 100px;
      flex-shrink: 0;
      font-weight: 600;
      color: var(--text-muted);
    }
    .qr-value {
      padding: 10px 12px;
      color: var(--text);
      flex: 1;
    }

    /* FOOTER */
    .footer {
      background: var(--green-dark);
      color: rgba(255,255,255,0.7);
      text-align: center;
      padding: 20px 16px;
      font-size: 12px;
      margin-top: 24px;
    }
    .footer strong { color: white; }

    /* SMOOTH SCROLL */
    html { scroll-behavior: smooth; }

    /* PRINT HIDE */
    @media print {
      .header, .nav-tabs { position: static; }
      .step-body { display: block !important; }
    }
  </style>
</head>
<body>

<!-- HEADER -->
<header class="header">
  <div class="logo"><span>Si</span>Gon Sport</div>
  <div class="subtitle">📱 Hướng dẫn đăng sản phẩm bằng điện thoại</div>
</header>

<!-- NAV TABS -->
<nav class="nav-tabs" id="navTabs">
  <div class="nav-tab active" onclick="switchTab('giay-moi')">👟 Giày Mới</div>
  <div class="nav-tab" onclick="switchTab('secondhand')">♻️ Secondhand</div>
  <div class="nav-tab" onclick="switchTab('chuphinh')">📸 Chụp Hình</div>
  <div class="nav-tab" onclick="switchTab('luu-y')">⚠️ Lưu Ý</div>
  <div class="nav-tab" onclick="switchTab('quan-ly')">⚙️ Quản Lý</div>
</nav>

<!-- ===== TAB: GIÀY MỚI ===== -->
<div class="content active" id="tab-giay-moi">

  <div class="hero">
    <h1>Đăng Giày Mới 🆕</h1>
    <p>Làm theo từng bước, mỗi bước chỉ 1–2 phút<br>Tổng thời gian đăng 1 sản phẩm: ~10 phút</p>
    <div class="time-badge">⏱ Khoảng 10 phút / sản phẩm</div>
  </div>

  <div class="section">

    <!-- STEP 1 -->
    <div class="step-card open" id="step1">
      <div class="step-header" onclick="toggleStep('step1')">
        <div class="step-num">1</div>
        <div class="step-info">
          <div class="step-title">Đăng nhập WP Admin</div>
          <div class="step-desc">Mở trình duyệt, vào trang quản trị</div>
        </div>
        <div class="step-toggle">▾</div>
      </div>
      <div class="step-body">
        <div class="mock-screen">
          <div class="mock-statusbar"><span>9:41</span><span>📶 🔋</span></div>
          <div class="mock-browser-bar">
            <div class="mock-url-pill">sigon.vn/wp-admin</div>
            <span style="font-size:16px">↩</span>
          </div>
          <div class="mock-body">
            <div class="mock-label">Tên đăng nhập</div>
            <div class="mock-field filled">ten.sigon</div>
            <div class="mock-label">Mật khẩu</div>
            <div class="mock-field filled">••••••••••</div>
            <div class="mock-btn">Đăng nhập</div>
          </div>
        </div>
        <div class="inline-steps">
          <div class="inline-step">Mở Chrome / Safari, gõ vào ô địa chỉ: <strong>sigon.vn/wp-admin</strong></div>
          <div class="inline-step">Nhập <strong>Tên đăng nhập</strong> và <strong>Mật khẩu</strong> được cấp</div>
          <div class="inline-step">Nhấn <strong>"Đăng nhập"</strong></div>
        </div>
        <div class="tip"><strong>💡 Mẹo:</strong> Lưu mật khẩu vào trình duyệt để lần sau đăng nhập nhanh hơn</div>
      </div>
    </div>

    <!-- STEP 2 -->
    <div class="step-card" id="step2">
      <div class="step-header" onclick="toggleStep('step2')">
        <div class="step-num">2</div>
        <div class="step-info">
          <div class="step-title">Vào Thêm Sản Phẩm Mới</div>
          <div class="step-desc">Tìm menu Sản phẩm trong trang quản trị</div>
        </div>
        <div class="step-toggle">▾</div>
      </div>
      <div class="step-body">
        <div class="wp-menu-mock">
          <div class="wp-menu-item"><span class="icon">🏠</span> Trang quản trị <span class="wp-menu-arrow">›</span></div>
          <div class="wp-menu-item"><span class="icon">📝</span> Bài viết <span class="wp-menu-arrow">›</span></div>
          <div class="wp-menu-item active"><span class="icon">👟</span> Sản phẩm <span class="wp-menu-arrow">▾</span></div>
          <div class="wp-menu-item" style="padding-left:40px; background:#2D5535">→ <strong>Thêm sản phẩm mới</strong></div>
          <div class="wp-menu-item"><span class="icon">⚙️</span> WooCommerce <span class="wp-menu-arrow">›</span></div>
        </div>
        <div class="inline-steps">
          <div class="inline-step">Nhấn vào <strong>"Sản phẩm"</strong> trong menu bên trái (hoặc menu ☰ trên mobile)</div>
          <div class="inline-step">Nhấn <strong>"Thêm sản phẩm mới"</strong></div>
          <div class="inline-step">Trang "Thêm sản phẩm mới" sẽ mở ra</div>
        </div>
        <div class="tip"><strong>💡 Phím tắt:</strong> Vào thẳng <strong>sigon.vn/wp-admin/post-new.php?post_type=product</strong></div>
      </div>
    </div>

    <!-- STEP 3 -->
    <div class="step-card" id="step3">
      <div class="step-header" onclick="toggleStep('step3')">
        <div class="step-num">3</div>
        <div class="step-info">
          <div class="step-title">Nhập tên sản phẩm</div>
          <div class="step-desc">Tên đầy đủ, rõ ràng, có thương hiệu</div>
        </div>
        <div class="step-toggle">▾</div>
      </div>
      <div class="step-body">
        <div class="mock-screen">
          <div class="mock-statusbar"><span>9:41</span><span>📶 🔋</span></div>
          <div class="mock-body">
            <div class="mock-label">Tên sản phẩm <span class="tag tag-required">BẮT BUỘC</span></div>
            <div class="mock-field filled">Nike Mercurial Vapor 15 Elite FG – Sân Cỏ Tự Nhiên</div>
          </div>
        </div>
        <div class="inline-steps">
          <div class="inline-step">Nhấn vào ô <strong>"Tên sản phẩm"</strong> ở trên cùng</div>
          <div class="inline-step">Nhập theo công thức: <strong>[Thương hiệu] [Tên model] [Loại sân/môn]</strong></div>
        </div>

        <div class="section-title" style="margin-top:12px">Ví dụ tên đúng</div>
        <ul class="checklist">
          <li><div class="check-icon">✅</div><div>Nike Phantom GX Elite FG – Giày Bóng Đá Sân Cỏ</div></li>
          <li><div class="check-icon">✅</div><div>Adidas Adizero Ubersonic 4 – Giày Tennis</div></li>
          <li><div class="check-icon">✅</div><div>Yonex Power Cushion Eclipsion Z3 – Giày Cầu Lông</div></li>
          <li><div class="check-icon">❌</div><div style="color:#999">giày bóng đá nike (thiếu model, viết thường)</div></li>
          <li><div class="check-icon">❌</div><div style="color:#999">SP001 (không ai tìm được)</div></li>
        </ul>
      </div>
    </div>

    <!-- STEP 4 -->
    <div class="step-card" id="step4">
      <div class="step-header" onclick="toggleStep('step4')">
        <div class="step-num">4</div>
        <div class="step-info">
          <div class="step-title">Nhập giá sản phẩm</div>
          <div class="step-desc">Giá gốc + giá khuyến mãi (nếu có)</div>
        </div>
        <div class="step-toggle">▾</div>
      </div>
      <div class="step-body">
        <div class="mock-screen">
          <div class="mock-statusbar"><span>9:41</span><span>📶 🔋</span></div>
          <div class="mock-body">
            <div style="font-size:12px; font-weight:700; color:#333; margin-bottom:8px">📦 Dữ liệu sản phẩm — Cài đặt chung</div>
            <div class="mock-label">Giá thông thường (₫) <span class="tag tag-required">BẮT BUỘC</span></div>
            <div class="mock-field filled">3290000</div>
            <div class="mock-label">Giá khuyến mãi (₫) <span class="tag tag-optional">TUỲ CHỌN</span></div>
            <div class="mock-field filled">2590000</div>
          </div>
        </div>
        <div class="inline-steps">
          <div class="inline-step">Cuộn xuống, tìm phần <strong>"Dữ liệu sản phẩm"</strong></div>
          <div class="inline-step">Nhấn <strong>"Cài đặt chung"</strong></div>
          <div class="inline-step">Nhập <strong>"Giá thông thường"</strong> — nhập số, không có dấu chấm/phẩy (VD: <strong>3290000</strong>)</div>
          <div class="inline-step">Nếu đang giảm giá: nhập thêm <strong>"Giá khuyến mãi"</strong> thấp hơn giá gốc</div>
        </div>
        <div class="warning"><strong>⚠️ Lưu ý:</strong> Nhập số thuần, không gõ chữ "đ" hay dấu phân cách. Ví dụ: <strong>3290000</strong> chứ không phải "3.290.000đ"</div>
      </div>
    </div>

    <!-- STEP 5 -->
    <div class="step-card" id="step5">
      <div class="step-header" onclick="toggleStep('step5')">
        <div class="step-num">5</div>
        <div class="step-info">
          <div class="step-title">Chọn danh mục</div>
          <div class="step-desc">Chọn đúng danh mục để khách tìm được</div>
        </div>
        <div class="step-toggle">▾</div>
      </div>
      <div class="step-body">
        <div class="cat-grid">
          <div class="cat-item">
            <div class="cat-icon">⚽</div>
            <div class="cat-name">Bóng Đá</div>
            <div class="cat-sub">FG / TF / Futsal</div>
          </div>
          <div class="cat-item">
            <div class="cat-icon">🏸</div>
            <div class="cat-name">Cầu Lông</div>
            <div class="cat-sub">Giày, Vợt, Phụ kiện</div>
          </div>
          <div class="cat-item">
            <div class="cat-icon">🎾</div>
            <div class="cat-name">Tennis</div>
            <div class="cat-sub">Giày, Vợt, Bóng</div>
          </div>
          <div class="cat-item">
            <div class="cat-icon">🏓</div>
            <div class="cat-name">Pickleball</div>
            <div class="cat-sub">Vợt, Giày, Bóng</div>
          </div>
        </div>
        <div class="inline-steps">
          <div class="inline-step">Tìm phần <strong>"Danh mục sản phẩm"</strong> ở cột bên phải (hoặc cuộn xuống dưới trên mobile)</div>
          <div class="inline-step">Tích chọn danh mục phù hợp — có thể chọn nhiều (VD: "Giày Bóng Đá" + "Sân Cỏ Tự Nhiên")</div>
          <div class="inline-step">Nếu không thấy danh mục cần, nhấn <strong>"+ Thêm danh mục mới"</strong></div>
        </div>
        <div class="tip"><strong>💡 Tip:</strong> Chọn cả danh mục cha lẫn danh mục con. VD: tích cả "Giày Thể Thao" và "Giày Bóng Đá"</div>
      </div>
    </div>

    <!-- STEP 6 -->
    <div class="step-card" id="step6">
      <div class="step-header" onclick="toggleStep('step6')">
        <div class="step-num">6</div>
        <div class="step-info">
          <div class="step-title">Upload ảnh sản phẩm</div>
          <div class="step-desc">Ảnh đẹp = bán quản được hàng</div>
        </div>
        <div class="step-toggle">▾</div>
      </div>
      <div class="step-body">
        <div class="mock-screen">
          <div class="mock-statusbar"><span>9:41</span><span>📶 🔋</span></div>
          <div class="mock-body">
            <div style="font-size:12px; font-weight:700; color:#333; margin-bottom:8px">🖼 Ải� sản phẩm</div>
            <div style="border: 2px dashed #ddd; border-radius: 8px; padding: 20px; text-align: center; color: #999; font-size: 12px; margin-bottom:8px">
              + Đặt ảnh sản phẩm<br><span style="font-size:10px">Nhấn để chọn ảnh chinh</span>
            </div>
            <div style="font-size:12px; font-weight:700; color:#333; margin-bottom:6px">📎 Album hình ảnh</div>
            <div style="display:flex; gap:6px">
              <div style="width:50px;height:50px;background:#f0f0f0;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:20px">👟</div>
              <div style="width:50px;height:50px;background:#f0f0f0;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:20px">👟</div>
              <div style="width:50px;height:50px;background:#f0f0f0;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:20px">👟</div>
              <div style="width:50px;height:50px;border:2px dashed #ddd;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:18px;color:#999">+</div>
            </div>
          </div>
        </div>
        <div class="inline-steps">
          <div class="inline-step">Cuộn lên tìm phần <strong>"Ải� sản phẩm"</strong> ở cột phải → nhấn <strong>"Đặt ảnh sản phẩm"</strong> để chọn ảnh CHÍNH (ảnh đẹp nhất)</div>
          <div class="inline-step">Nhấn <strong>"Thêm ảnh thư viện sản phẩm"</strong> → chọn thêm 3–5 ảnh góc khác nhau</div>
          <div class="inline-step">Chọn từ thư viện ảnh trong điện thoại hoặc chụp trực tiếp</div>
        </div>
        <div class="tip">
          <strong>📸 Yêu cầu ảnh tối thiểu:</strong><br>
          ✅ Ải� chính: nền trắng hoặc n껁n gỗ, giày nhìn ru�2 bên<br>
          ✅ Ải� phỹt: góc đế, góc trên, góc nghiêng, tag/logo thương hiệu
        </div>
        <div class="warning"><strong>⚠️</strong> Không dùng ảnh catalogue từ Google — phải là ảnh hàng thực tế shop đang có</div>
      </div>
    </div>

    <!-- STEP 7 -->
    <div class="step-card" id="step7">
      <div class="step-header" onclick="toggleStep('step7')">
        <div class="step-num">7</div>
        <div class="step-info">
          <div class="step-title">Nhập mô tả ngắn</div>
          <div class="step-desc">Thông tin quan trọng hiện ngay dưới giá</div>
        </div>
        <div class="step-toggle">▾</div>
      </div>
      <div class="step-body">
        <div class="mock-screen">
          <div class="mock-statusbar"><span>9:41</span><span>📶 🔋</span></div>
          <div class="mock-body">
            <div class="mock-label">Mô tả ngắn của sản phẩm</div>
            <div style="border:1px solid var(--green); border-radius:6px; padding:8px; font-size:12px; line-height:1.6; color:#333">
              ✅ Giày bóng đá sân cỏ tu nhiên<br>
              ✅ Đế đinh FG, phù hợp sân cỏ thật<br>
              ✅ Size: 39–44<br>
              ✅ Hàng chính hãng, fullbox
            </div>
          </div>
        </div>
        <div class="inline-steps">
          <div class="inline-step">Cuộn xuống tìm <strong>"Mô tả ngắn của sản phẩm"</strong></div>
          <div class="inline-step">Gõ 3–5 gạch đầu dòng ngắn gọn, highlight điểm nổi bật</div>
        </div>
        <div class="tip">
          <strong>Công thồc mô tả ngắn:</strong><br>
          • Loại giày / môn thể thao<br>
          • Loại đế (FG/TF/IC) hoặc công dụng<br>
          • Size có sẵn<br>
          • Tình trạng hàng (fullbox/no box)
        </div>
      </div>
    </div>

    <!-- STEP 8 -->
    <div class="step-card" id="step8">
      <div class="step-header" onclick="toggleStep('step8')">
        <div class="step-num">8</div>
        <div class="step-info">
          <div class="step-title">Thêm thuộc tính Size</div>
          <div class="step-desc">Ä khách lọc và chọn size</div>
        </div>
        <div class="step-toggle">▾</div>
      </div>
      <div class="step-body">
        <div class="inline-steps">
          <div class="inline-step">Trong "Dữ liệu sản phẩm", nhấn tab <strong>"Thuộc tính" </strong></div>
          <div class="inline-step">Nhấn <strong>"Thêm"</strong> → chọn <strong>"Size"</strong> từ danh sách</div>
          <div class="inline-step">Nhập các size có sẵn, ngģn cách bởi dấu <strong>|</strong> — VD: <code>38 | 39 | 40 | 41 | 42 | 43</code></div>
          <div class="inline-step">Tick ô <strong>"Dùng cho biến thể"</strong> nếu muốn khách chọn size khi mua</div>
          <div class="inline-step">Nhấn <strong>"L�MH thuộc tính"</strong></div>
        </div>
        <div class="tip"><strong>💡 Tip:</strong> Nếu còn nhiều size → dùng dấu | ngģn cách. Nếu chỉ còn 1 size → nhập 1 số duy nhất</div>
      </div>
    </div>

    <!-- STEP 9 -->
    <div class="step-card" id="step9">
      <div class="step-header" onclick="toggleStep('step9')">
        <div class="step-num">9</div>
        <div class="step-info">
          <div class="step-title">Ki囃m kê kho hàng </div>
          <div class="step-desc">Nhập số lượng tồn kho</div>
        </div>
        <div class="step-toggle">▾</div>
      </div>
      <div class="step-body">
        <div class="inline-steps">
          <div class="inline-step">Trong "Dữ liệu sản phẩm", nhấn tab <strong>"Kiểm kê kho hàng"</strong></div>
          <div class="inline-step">Tick <strong>"Bẽt quản lý kho hàng"</strong></div>
          <div class="inline-step">Nhập số lượng tồn kho (VD: <strong>3</strong>)</div>
          <div class="inline-step">Trạng thái: chọn <strong>"Còn hàng"</strong></div>
        </div>
        <div class="warning"><strong>⚠️</strong> Nếu sản phẩm chỉ còn 1 cái → nhập <strong>1</strong>. Khi bán hết, trang sẽ tự hiện "Hết hàng"</div>
      </div>
    </div>

    <!-- STEP 10 -->
    <div class="step-card" id="step10">
      <div class="step-header" onclick="toggleStep('step10')">
        <div class="step-num">10</div>
        <div class="step-info">
          <div class="step-title">Xuất bản sản phẩm</div>
          <div class="step-desc">Kim tra lại rồi nhấn Xuất ban</div>
        </div>
        <div class="step-toggle">▾</div>
      </div>
      <div class="step-body">
        <ul class="checklist">
          <li><div class="check-icon">☐</div><div>Tên sản phẩm đầy đủ, rõ ráng <span class="req">BẮT BUỘC</span></div></li>
          <li><div class="check-icon">☐</div><div>Giá thông thường đã nhập <span class="req">BẮT BUỘC</span></div></li>
          <li><div class="check-icon">☐</div><div>Đã chọn danh mục đúng <span class="req">BẮT BUỘC</span></div></li>
          <li><div class="check-icon">☐</div><div>Đã có ít nhất 1 ảnh sản phẩm <span class="req">BẮT BUỘC</span></div></li>
          <li><div class="check-icon">☐</div><div>Mô tả ngắn đã điền</div></li>
          <li><div class="check-icon">☐</div><div>Số lượng kho đã nhập</div></li>
        </ul>
        <div class="mock-screen" style="margin-top:12px">
          <div class="mock-statusbar"><span>9:41</span><span>📶 🔋</span></div>
          <div class="mock-body" style="text-align:center; padding:16px">
            <div style="font-size:13px; font-weight:700; color:#333; margin-bottom:12px">📤 Xuất bản</div>
            <div style="background:#f0f7f1; border:1px solid #c3e0c8; border-radius:8px; padding:10px; font-size:11px; color:#2D5535; margin-bottom:10px">
              ✅ Trạng thái: Công khai<br>📅 Xuất bản ngay lập tức
            </div>
            <div class="mock-btn">Xuất bản</div>
          </div>
        </div>
        <div class="inline-steps">
          <div class="inline-step">Cuộn lên đầu trang, tìm ô <strong>"Xuất bản"</strong> ở cột phải</div>
          <div class="inline-step">Kiểm tra trạng thái là<strong>"Công khai"</strong></div>
          <div class="inline-step">NhẪn nút <strong>"Xuất bản"</strong> màu xanh</div>
          <div class="inline-step">Thấy thông báo <em>"Sản phẩm đã được xuất bản"</em> → thành công! 🎉</div>
        </div>
      </div>
    </div>

  </div><!-- /.section -->
</div><!-- /#tab-giay-moi -->


<!-- ===== TAB: SECONDHAND ===== -->
<div class="content" id="tab-secondhand">

  <div class="hero" style="background: linear-gradient(135deg, #6B3F1F 0%, #4a2a12 100%)">
    <h1>Đăng Giay Secondhand ♻️</h1>
    <p><span class="badge-2h">2HAND REAL</span> Đây là sản phẩm cốt lõi của SiGon<br>Mô tả <strong>thật</strong>, ảnh <strong>thật</strong>, giá <strong>thật</strong></p>
    <div class="time-badge">⏱ Khoảng 15 phút / sản phẩm</div>
  </div>

  <div class="section">

    <div class="quick-ref">
      <div class="quick-ref-header">📋 Secondhand khác gì với giày mới?</div>
      <div class="quick-ref-row">
        <div class="qr-label">Danh mục</div>
        <div class="qr-value">Chọn danh mục <strong>Secondhand</strong> (VD: Giay Bóng Đá Secondhand)</div>
      </div>
      <div class="quick-ref-row">
        <div class="qr-label">Giá gốc</div>
        <div class="qr-value">Nhập giá mới để khách thấy mức tiết kiếm (VD: 3.200.000đ)</div>
      </div>
      <div class="quick-ref-row">
        <div class="qr-label">Giá sale</div>
        <div class="qr-value">Nhập giá bán thực tế của hànd 2hand (VD: 890.000đ)</div>
      </div>
      <div class="quick-ref-row">
        <div class="qr-label">Mô tả ngắn</div>
        <div class="qr-value">PHẢI có: tình trạng, số lần dùng, lý do bán</div>
      </div>
      <div class="quick-ref-row">
        <div class="qr-label">Ải�</div>
        <div class="qr-value">Ải� thực tế, chụp nhiều góc kể cả vết mòn nhỏ</div>
      </div>
    </div>

    <!-- STEP SH1 -->
    <div class="step-card open" id="sh1">
      <div class="step-header" onclick="toggleStep('sh1')">
        <div class="step-num" style="background:var(--brown)">1</div>
        <div class="step-info">
          <div class="step-title">Chọn tình trạng sản phẩm</div>
          <div class="step-desc">Đây là thông tin quan trọng nhất</div>
        </div>
        <div class="step-toggle">▾</div>
      </div>
      <div class="step-body">
        <div class="condition-options">
          <div class="cond-opt selected">
            <div class="cond-pct">95%</div>
            <div class="cond-label">Như mới, chưa dùng nhiều</div>
          </div>
          <div class="cond-opt">
            <div class="cond-pct">90%</div>
            <div class="cond-label">Dùng vài buổi, còn đẹp</div>
          </div>
          <div class="cond-opt">
            <div class="cond-pct">80%</div>
            <div class="cond-label">Dùng thường xuyên</div>
          </div>
          <div class="cond-opt">
            <div class="cond-pct">70%</div>
            <div class="cond-label">Có vết mòn, vẫn dùng tốt</div>
          </div>
        </div>
        <div class="inline-steps">
          <div class="inline-step">Đánh giá trung thực tình trạng giày theo thang trên</div>
          <div class="inline-step">Ghi vào <strong>Mô tả ngắn</strong>: <code>Tình trạng: Mới 90%</code></div>
          <div class="inline-step">Ghi rõ số buổi sử dụng ước tính (VD: <em>~15 buổi đá</em>)</div>
        </div>
        <div class="error-note"><strong>⛔ Cam kết SiGon:</strong> Không được ghi tình trạng cao hơn thực tế. Nếu giày 80% thì ghi 80%, không ghi 90%.</div>
      </div>
    </div>

    <!-- STEP SH2 -->
    <div class="step-card" id="sh2">
      <div class="step-header" onclick="toggleStep('sh2')">
        <div class="step-num" style="background:var(--brown)">2</div>
        <div class="step-info">
          <div class="step-title">Điền mô tả ngắn chuẩn</div>
          <div class="step-desc">Thông tin minh bạch, tạo tin tưởng</div>
        </div>
        <div class="step-toggle">▾</div>
      </div>
      <div class="step-body">
        <div class="mock-screen">
          <div class="mock-statusbar"><span>9:41</span><span>📶 🔋</span></div>
          <div class="mock-body">
            <div style="border:1px solid var(--brown); border-radius:6px; padding:10px; font-size:12px; line-height:1.8; color:#333">
              ♻️ <strong>SECONDHAND REAL – Mới 85%</strong><br>
              📦 Adidas X Speedportal.1 FG<br>
              👟 Size: 42 (EU) – Chỉ còn 1 đôi<br>
              ⏱ Đã dùng: ~20 buổi đá<br>
              💬 Lý do bán: Mua dư size, không hợp foot<br>
              ✅ Hàng auth 100%, có ảnh thất<br>
              ❗ Nhược điểm: Vết mòn nhỏ ở đế ngoài (xem ảnh 4)
            </div>
          </div>
        </div>
        <div class="tip">
          <strong>📝 Template mô tả ngắn 2hand:</strong><br>
          <code>
            ♻️ SECONDHAND REAL – Mới [X]%<br>
            📦 [Tên model đầy đủ]<br>
            👟 Size: [XX] – Chỉ còn 1 đôi<br>
            ⏱ Đã dùng: ~[N] buổi<br>
            💬 Lý do bán: [lý do]<br>
            ✅ Hàng auth 100%<br>
            ❗ Nhược điểm: [nếu có, ghi thật]
          </code>
        </div>
      </div>
    </div>

    <!-- STEP SH3 -->
    <div class="step-card" id="sh3">
      <div class="step-header" onclick="toggleStep('sh3')">
        <div class="step-num" style="background:var(--brown)">3</div>
        <div class="step-info">
          <div class="step-title">Chụp ảnh đúng cách cho 2hand</div>
          <div class="step-desc">Ảnh thật → khách tin → mua nhiều hơn</div>
        </div>
        <div class="step-toggle">▾</div>
      </div>
      <div class="step-body">
        <div class="photo-rule">
          <div class="photo-icon-wrap good">📸</div>
          <div><strong>Góc bắt buộc (ít nhất 5 ảnh):</strong><br>
          1. Ảnh tổng 2 giày nhìn từ trên<br>
          2. Giày trái – nhìn từ bên<br>
          3. Giày phải – nhìn từ bên<br>
          4. Góc đế (quan trọng – thấy mức mòn)<br>
          5. Tag / logo thương hiệu (chứng minh auth)
          </div>
        </div>
        <div class="photo-rule">
          <div class="photo-icon-wrap good">✅</div>
          <div><strong>Nên chụp thêm:</strong><br>
          • Vết mòn / trầy nhỏ n���u có (để khách biết)<br>
          • Lót trong giày<br>
          • Size tab trong giày
          </div>
        </div>
        <div class="photo-rule">
          <div class="photo-icon-wrap bad">❌</div>
          <div><strong>KHÔNG được:</strong><br>
          • Dùng ảnh catalogue / ảnh Google<br>
          • Chỉnh màu che khuyết điểm<br>
          • Chụp tối, mở, không thấy rõ
          </div>
        </div>
        <div class="error-note"><strong>⛔ Quan trọng:</strong> Nếu giày có vết trầy hoặc mòn — PHÂI chụp ảnh đó và neu rõ trong mô tả. Đây là cam kết "Real" của SiGon.</div>
      </div>
    </div>

    <!-- STEP SH4 -->
    <div class="step-card" id="sh4">
      <div class="step-header" onclick="toggleStep('sh4')">
        <div class="step-num" style="background:var(--brown)">4/div>
        <div class="step-info">
          <div class="step-title">Chọn danh mục đúng</div>
          <div class="step-desc">Phải chọn mục Secondhand</div>
        </div>
        <div class="step-toggle">▾</div>
      </div>
      <div class="step-body">
        <ul class="checklist">
          <li><div class="check-icon">♻️</div><div>Giày bóng đá 2hand → chọn <strong>"Giày Bóng Đá Secondhand"</strong></div></li>
          <li><div class="check-icon">♻️</div><div>Giày cầu lông 2hand → chọn <strong>"Giày Cầu Lông Secondhand"</strong></div></li>
          <li><div class="check-icon">♻️</div><div>Sneaker / đa dụng 2hand → chọn <strong>"Sneaker Lifestyle Secondhand"</strong></div></li>
        </ul>
        <div class="warning"><strong>⚠️</strong> Không đặt hàng 2hand vào danh mục giày mới — khách sẽ nhầm và khiếu nại</div>
      </div>
    </div>

  </div>
</div><!-- /#tab-secondhand -->


<!-- ===== TAB: CHỤP HÌNH ===== -->
<div class="content" id="tab-chuphinh">

  <div class="hero" style="background: linear-gradient(135deg, #1a3a5c 0%, #0d2238 100%)">
    <h1>Hướng Dẫn Chụp Hình 📸</h1>
    <p>Ảnh đẹp quyết định 70% khả năng bán được hàng<br>Chụp đúng cách ngay từ đầu, tiết kiệm thời gian edit</p>
  </div>

  <div class="section">

    <div class="section-title">⚙️ Cài đặt điện thoại</div>
    <div class="step-card open" id="cam1">
      <div class="step-header" onclick="toggleStep('cam1')">
        <div class="step-num" style="background:#1a3a5c">📱</div>
        <div class="step-info">
          <div class="step-title">Trước khi chụp</div>
          <div class="step-desc">Chuẩn bị máy ảnh đúng cách</div>
        </div>
        <div class="step-toggle">▾</div>
      </div>
      <div class="step-body">
        <ul class="checklist">
          <li><div class="check-icon">✅</div><div>Lau sạch lens camera trước khi chụp</div></li>
          <li><div class="check-icon">✅</div><div>Chụp ở chế độ <strong>tự nhiên / auto</strong>, không dùng filter làm sáng quá</div></li>
          <li><div class="check-icon">✅</div><div>Tắt HDR nếu màu sắc bị giả</div></li>
          <li><div class="check-icon">✅</div><div>Chụp ngang (landscape) cho ảnh tổng, dọc (portrait) cho ảnh chi tiết</div></li>
          <li><div class="check-icon">✅</div><div>Độ phân giải: để mặc định cao nhất</div></li>
        </ul>
      </div>
    </div>

    <div class="section-title">💡 Ánh sáng</div>
    <div class="step-card open" id="cam2">
      <div class="step-header" onclick="toggleStep('cam2')">
        <div class="step-num" style="background:#f5a623">💡</div>
        <div class="step-info">
          <div class="step-title">Ánh sáng chuẩn nhất</div>
          <div class="step-desc">Không cần studio, chỉ cần ánh sáng tự nhiên</div>
        </div>
        <div class="step-toggle">▾</div>
      </div>
      <div class="step-body">
        <div class="photo-rule">
          <div class="photo-icon-wrap good">☀️</div>
          <div>
            <strong>Tốt nhất:</strong> Ánh sáng tự nhiên từ cửa sổ, buổi sáng hoặc chiều. Đặt giày gần cửa sổ, ánh sáng chiếu từ 1 bên.
          </div>
        </div>
        <div class="photo-rule">
          <div class="photo-icon-wrap good">🔦</div>
          <div>
            <strong>Nếu trong nhà tối:</strong> Bật đèn trần + đèn bàn chiếu từ 2 phía. Tránh 1 đèn chiếu thẳng (tạo bóng xấu).
          </div>
        </div>
        <div class="photo-rule">
          <div class="photo-icon-wrap bad">❌</div>
          <div>
            <strong>Tránh:</strong> Flash điện thoại trực tiếp (màu trắng, bóng cứng), chụp ngược sáng, chụp dưới đèn màu vàng quá.
          </div>
        </div>
      </div>
    </div>

    <div class="section-title">🖼 Nền chụp</div>
    <div class="step-card open" id="cam3">
      <div class="step-header" onclick="toggleStep('cam3')">
        <div class="step-num" style="background:#888">🖼</div>
        <div class="step-info">
          <div class="step-title">Chọn nền phù hợp</div>
          <div class="step-desc">Nền đơn giản = giày nổi bật hơn</div>
        </div>
        <div class="step-toggle">▾</div>
      </div>
      <div class="step-body">
        <div class="photo-rule">
          <div class="photo-icon-wrap good">✅</div>
          <div>
            <strong>Nền trắng/xám nhạt:</strong> Tấm cartong trắng, giấy trắng khổ lớn, tường trắng. Giày hiện rõ nhất.
          </div>
        </div>
        <div class="photo-rule">
          <div class="photo-icon-wrap good">✅</div>
          <div>
            <strong>Nền gỗ/sàn đá:</strong> Texture tự nhiên, cho ảnh lifestyle đẹp, phù hợp sneaker.
          </div>
        </div>
        <div class="photo-rule">
          <div class="photo-icon-wrap bad">❌</div>
          <div>
            <strong>Tránh:</strong> Nền sàn gạch bẩn, giường/chăn, nền có nhiều đồ vật lộn xộn xung quanh.
          </div>
        </div>
      </div>
    </div>

    <div class="section-title">👟 Góc chụp chuẩn</div>
    <div class="quick-ref">
      <div class="quick-ref-header">Checklist góc chụp bắt buộc</div>
      <div class="quick-ref-row">
        <div class="qr-label">Góc 1</div>
        <div class="qr-value">📸 Nhìn từ trên xuống — 2 giày đặt song song</div>
      </div>
      <div class="quick-ref-row">
        <div class="qr-label">Góc 2</div>
        <div class="qr-value">📸 Nhìn từ bên – 45° góc nghiêng</div>
      </div>
      <div class="quick-ref-row">
        <div class="qr-label">Góc 3</div>
        <div class="qr-value">📸 Nhìn từ phía sau</div>
      </div>
      <div class="quick-ref-row">
        <div class="qr-label">Góc 4</div>
        <div class="qr-value">📸 Đế giày — lật ngửa lên chụp</div>
      </div>
      <div class="quick-ref-row">
        <div class="qr-label">Góc 5</div>
        <div class="qr-value">📸 Logo thương hiệu / tag size bên trong</div>
      </div>
      <div class="quick-ref-row">
        <div class="qr-label">Góc +</div>
        <div class="qr-value">📸 Chi tiết đặc biệt của model (nếu có)</div>
      </div>
    </div>
  </div>
</div><!-- /#tab-chuphinh -->


<!-- ===== TAB: LƯU Ý ===== -->
<div class="content" id="tab-luu-y">

  <div class="hero" style="background: linear-gradient(135deg, #7b1a1a 0%, #4a0d0d 100%)">
    <h1>Những Lỗi Hay Gặp ⚠️</h1>
    <p>Đọc để tránh bị sửa bài hoặc xoá sản phẩm</p>
  </div>

  <div class="section">

    <div class="section-title">❌ Lỗi thường gặp</div>

    <div class="step-card open" id="err1">
      <div class="step-header" onclick="toggleStep('err1')">
        <div class="step-num" style="background:var(--red)">!</div>
        <div class="step-info">
          <div class="step-title">Nhập giá sai định dạng</div>
          <div class="step-desc">Lỗi phổ biến nhất</div>
        </div>
        <div class="step-toggle">▾</div>
      </div>
      <div class="step-body">
        <ul class="checklist">
          <li><div class="check-icon">❌</div><div><strong>Sai:</strong> 3.290.000 / 3,290,000 / 3290000đ / "3tr2"</div></li>
          <li><div class="check-icon">✅</div><div><strong>Đúng:</strong> <code>3290000</code> (số thuần, không ký tự thừa)</div></li>
        </ul>
      </div>
    </div>

    <div class="step-card" id="err2">
      <div class="step-header" onclick="toggleStep('err2')">
        <div class="step-num" style="background:var(--red)">!</div>
        <div class="step-info">
          <div class="step-title">Quên chọn danh mục</div>
          <div class="step-desc">Sản phẩm sẽ bị "Chưa phân loại"</div>
        </div>
        <div class="step-toggle">▾</div>
      </div>
      <div class="step-body">
        <div class="error-note">Nếu không chọn danh mục, sản phẩm sẽ vào mục "Chưa phân loại" — khách không thể tìm thấy qua menu.</div>
        <div class="tip"><strong>Fix:</strong> Cuộn qua phần "Danh mục sản phẩm" và tick ít nhất 1 danh mục trước khi xuất bản.</div>
      </div>
    </div>

    <div class="step-card" id="err3">
      <div class="step-header" onclick="toggleStep('err3')">
        <div class="step-num" style="background:var(--red)">!</div>
        <div class="step-info">
          <div class="step-title">Đặt hàng 2hand vào mục giày mới</div>
          <div class="step-desc">Gây hiểu lầm, khách khiếu nại</div>
        </div>
        <div class="step-toggle">▾</div>
      </div>
      <div class="step-body">
        <div class="error-note"><strong>⛔ Nghiêm cấm:</strong> Đặt sản phẩm secondhand vào danh mục giày mới để "bán nhanh hơn". Điều này vi phạm cam kết "Real" của SiGon và gây mất uy tín thương hiệu.</div>
      </div>
    </div>

    <div class="step-card" id="err4">
      <div class="step-header" onclick="toggleStep('err4')">
        <div class="step-num" style="background:var(--red)">!</div>
        <div class="step-info">
          <div class="step-title">Upload ảnh catalogue / ảnh Google</div>
          <div class="step-desc">Khách sẽ nhận hàng khác với ảnh</div>
        </div>
        <div class="step-toggle">▾</div>
      </div>
      <div class="step-body">
        <div class="error-note"><strong>⛔ Không được dùng:</strong> Ảnh lấy từ Google, website khác, hoặc ảnh chụp màn hình. Tất cả ảnh phải là <strong>hàng thực tế đang có trong kho</strong>.</div>
        <div class="tip"><strong>✅ Đúng:</strong> Tự chụp hàng đang có tại shop. Xem tab "Chụp Hình" để chụp đẹp hơn.</div>
      </div>
    </div>

    <div class="step-card" id="err5">
      <div class="step-header" onclick="toggleStep('err5')">
        <div class="step-num" style="background:#f0a500">!</div>
        <div class="step-info">
          <div class="step-title">Quên cập nhật tồn kho</div>
          <div class="step-desc">Sản phẩm hết hàng nhưng vẫn hiện "Còn hàng"</div>
        </div>
        <div class="step-toggle">▾</div>
      </div>
      <div class="step-body">
        <div class="warning"><strong>⚠️</strong> Khi bán hết 1 sản phẩm: vào Sản phẩm → Chỉnh sửa → Kiểm kê kho hàng → đổi thành <strong>"Hết hàng"</strong> hoặc số lượng về 0.</div>
      </div>
    </div>

    <div class="section-title" style="margin-top:8px">📞 Liên hệ hỗ trợ</div>
    <div class="quick-ref">
      <div class="quick-ref-header">Cần giúp đỡ?</div>
      <div class="quick-ref-row">
        <div class="qr-label">Quản lý</div>
        <div class="qr-value"><a href="tel:0878627139" style="color:var(--green); font-weight:700">0878.627.139</a></div>
      </div>
      <div class="quick-ref-row">
        <div class="qr-label">Email</div>
        <div class="qr-value"><a href="mailto:sigonsport@gmail.com" style="color:var(--green)">sigonsport@gmail.com</a></div>
      </div>
      <div class="quick-ref-row">
        <div class="qr-label">WP Admin</div>
        <div class="qr-value"><a href="https://sigon.vn/wp-admin" style="color:var(--green)">sigon.vn/wp-admin</a></div>
      </div>
    </div>

  </div>
</div><!-- /#tab-luu-y -->


<!-- ===== TAB: QUẢN LÝ ===== -->
<div class="content" id="tab-quan-ly">

  <div class="hero">
    <h1>Quản Lý Danh Mục ⚙️</h1>
    <p>Bổ sung thương hiệu mới, size mới<br>và các thao tác quản trị cơ bản</p>
  </div>

  <div class="section">

    <div class="section-title">🏷️ Thêm Thương Hiệu Mới</div>
    <div class="step-card open" id="ql1">
      <div class="step-header" onclick="toggleStep('ql1')">
        <div class="step-num">1</div>
        <div class="step-info">
          <div class="step-title">Vào trang quản lý thương hiệu</div>
          <div class="step-desc">Truy cập link sau trên trình duyệt</div>
        </div>
        <div class="step-toggle">▾</div>
      </di
GUIDEPAGE;
  exit;
});



// Fix topbar shipping text consistency (homepage matches inner pages)
add_action('template_redirect', function() {
    if (is_front_page()) {
        ob_start(function($buf) {
            return str_replace(' 1 triệu', ' 1 tri&#7879;u', $buf);
        });
    }
});

// ===== MOBILE NAV RESPONSIVE =====

// CSS: hamburger button + drawer tu trai
add_action('wp_head', 'sigon_mobile_nav_css', 99);
function sigon_mobile_nav_css() { ?>
<style id="sigon-mobile-nav">
.sigon-mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  color: #F5EFE2;
  font-size: 26px;
  cursor: pointer;
  padding: 6px 14px;
  line-height: 1;
  flex-shrink: 0;
}
@media (max-width: 767px) {
  .sigon-main-nav .nav-inner { display: flex !important; align-items: center !important; justify-content: space-between !important; padding: 0 12px !important; }
  .sigon-mobile-menu-btn { display: block !important; }
  .sigon-main-nav .nav-inner > ul {
    display: none !important;
    flex-direction: column !important;
    position: fixed !important;
    top: 0 !important; left: 0 !important;
    width: 280px !important; height: 100vh !important;
    background: #1E3D24 !important;
    padding: 64px 0 20px !important;
    z-index: 99999 !important;
    overflow-y: auto !important;
    box-shadow: 4px 0 24px rgba(0,0,0,0.5) !important;
    margin: 0 !important;
  }
  .sigon-main-nav .nav-inner > ul.nav-mobile-open { display: flex !important; }
  .sigon-main-nav .nav-inner ul > li {
    display: list-item !important;
    border-bottom: 1px solid rgba(255,255,255,0.1) !important;
    width: 100% !important;
  }
  .sigon-main-nav .nav-inner ul > li.nav-hot { display: none !important; }
  .sigon-main-nav .nav-inner ul > li a {
    padding: 14px 24px !important;
    font-size: 15px !important;
    display: block !important;
    color: #F5EFE2 !important;
    font-weight: 600 !important;
  }
  .sigon-main-nav .sub-menu { position: static !important; box-shadow: none !important; background: rgba(0,0,0,0.2) !important; padding-left: 16px !important; display: none !important; }
}
.sigon-mobile-overlay {
  display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5); z-index: 99998; cursor: pointer;
}
.sigon-mobile-overlay.overlay-active { display: block; }
</style>
<?php }

// JS: tao hamburger button + toggle drawer
add_action('wp_footer', 'sigon_mobile_nav_js', 99);
function sigon_mobile_nav_js() { ?>
<div class="sigon-mobile-overlay"></div>
<script id="sigon-mobile-nav-js">
(function(){
  var navInner = document.querySelector('.sigon-main-nav .nav-inner');
  var ul = document.querySelector('.sigon-main-nav .nav-inner > ul');
  var overlay = document.querySelector('.sigon-mobile-overlay');
  if (!navInner || !ul || !overlay) return;
  var btn = document.createElement('button');
  btn.className = 'sigon-mobile-menu-btn';
  btn.setAttribute('aria-label', 'Mo menu');
  btn.innerHTML = '&#9776;';
  navInner.insertBefore(btn, navInner.firstChild);
  function openMenu() { ul.classList.add('nav-mobile-open'); overlay.classList.add('overlay-active'); document.body.style.overflow = 'hidden'; btn.innerHTML = '&#10005;'; }
  function closeMenu() { ul.classList.remove('nav-mobile-open'); overlay.classList.remove('overlay-active'); document.body.style.overflow = ''; btn.innerHTML = '&#9776;'; }
  btn.addEventListener('click', function(){ ul.classList.contains('nav-mobile-open') ? closeMenu() : openMenu(); });
  overlay.addEventListener('click', closeMenu);
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape') closeMenu(); });
})();
</script>
<?php }



// === ADMIN: Fix column layout in product list ===
add_action('admin_head', 'sigon_admin_column_css');
function sigon_admin_column_css() {
    $screen = get_current_screen();
    if (!$screen || $screen->id !== 'edit-product') return;
    echo '<style>
    /* Fix Rank Math SEO column width */
    .column-rank_math_seo_details { width: 60px !important; min-width: 60px !important; }
    .column-rank_math_seo_details .rank-math-column-status { display: flex; flex-direction: row; gap: 2px; }
    /* Fix brand column */
    .column-taxonomy-pa_thuong-hieu,
    .column-taxonomy-product_brand { width: 100px !important; }
    /* Prevent any column overflow causing vertical text */
    #the-list td { overflow: hidden; white-space: normal; word-break: break-word; }
    </style>';
}





// SiGon Care — serve landing page on care.sigon.vn
add_action('init', function() {
    if (!isset($_SERVER['HTTP_HOST'])) return;
    $host = strtolower(trim($_SERVER['HTTP_HOST']));
    if ($host === 'care.sigon.vn' || $host === 'www.care.sigon.vn') {
        include get_stylesheet_directory() . '/sigon-care-landing.php';
        exit;
    }
}, 1);
