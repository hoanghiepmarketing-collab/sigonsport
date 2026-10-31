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
        document.querySelectorAll('.wc-block-components-product-image .badge-secondhand').forEach(function(badge) {
            var imgWrapper = badge.closest('.wc-block-components-product-image');
            if (imgWrapper && badge.parentElement !== imgWrapper) {
                imgWrapper.appendChild(badge);
            }
        });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', relocateBadges);
    } else {
        relocateBadges();
    }
    // Fallback after short delay for deferred renders
    setTimeout(relocateBadges, 800);
})();
</script>
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
        overflow: hidden;
        transition: box-shadow .2s, transform .2s;
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
    echo '<button class="sigon-filter-toggle" onclick="document.querySelector(\.sigon-filter-sidebar\').classList.toggle(\'mobile-open\')">&#128269; B&#7897; l&#7885;c s&#7843;n ph&#7849;m</button>';
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
.sigon-main-nav .nav-care>a{color:#fff;background:rgba(196,77,40,.55);border-left:2px solid #C44D28}
.sigon-main-nav .nav-care>a:hover{background:#C44D28}
.sigon-main-nav .dropdown{display:none;position:absolute;top:100%;left:0;background:#fff;min-width:220px;box-shadow:0 4px 20px rgba(0,0,0,.15);border-radius:0 0 8px 8px;z-index:300;padding:6px 0}
.sigon-main-nav ul li:hover .dropdown{display:block}
.sigon-main-nav .dropdown a{color:#333!important;padding:10px 18px!important;font-size:13px!important;font-weight:600!important;text-transform:none!important;letter-spacing:0!important;display:flex!important;align-items:center!important;gap:8px!important}
.sigon-main-nav .dropdown a:hover{background:#F5EFE2!important;color:#2D5535!important}
.badge-secondhand{position:absolute;top:8px;right:8px;background:#8B5E3C;color:#fff;font-size:10px;font-weight:700;padding:3px 6px;border-radius:4px;font-family:"Be Vietnam Pro",sans-serif;z-index:10;letter-spacing:.3px;text-transform:uppercase;pointer-events:none}
ul.products li.product{position:relative}
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
      <span>🚚 Miễn phí vận chuyển đơn từ 500K</span>
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
    <li style="display:none">
      <a href="' . home_url('/product-category/giay-bong-da/') . '"><i class="fas fa-futbol"></i> BÓNG ĐÁ <i class="fas fa-chevron-down" style="font-size:10px;opacity:.7"></i></a>
      <div class="dropdown">
        <a href="' . home_url('/product-category/giay-bong-da/') . '"><i class="fas fa-shoe-prints"></i> Giày sân cỏ (FG)</a>
        <a href="' . home_url('/product-category/giay-bong-da/') . '"><i class="fas fa-shoe-prints"></i> Giày sân nhân tạo (TF/AG)</a>
        <a href="' . home_url('/product-category/giay-bong-da/') . '"><i class="fas fa-shoe-prints"></i> Giày futsal (IC)</a>
        <a href="' . home_url('/product-category/giay-bong-da-secondhand/') . '" style="color:#8B5E3C!important"><i class="fas fa-recycle"></i> Bóng đá 2nd</a>
      </div>
    </li>
    <li style="display:none">
      <a href="' . home_url('/product-category/giay-cau-long/') . '"><i class="fas fa-circle-notch"></i> CẦU LÔNG <i class="fas fa-chevron-down" style="font-size:10px;opacity:.7"></i></a>
      <div class="dropdown">
        <a href="' . home_url('/product-category/vot-cau-long/') . '"><i class="fas fa-grip-lines-vertical"></i> Vợt cầu lông</a>
        <a href="' . home_url('/product-category/giay-cau-long/') . '"><i class="fas fa-shoe-prints"></i> Giày cầu lông</a>
        <a href="' . home_url('/product-category/phu-kien-cau-long/') . '"><i class="fas fa-tools"></i> Phụ kiện</a>
        <a href="' . home_url('/product-category/giay-cau-long-secondhand/') . '" style="color:#8B5E3C!important"><i class="fas fa-recycle"></i> Cầu lông 2nd</a>
      </div>
    </li>
    <li style="display:none">
      <a href="' . home_url('/product-category/giay-tennis/') . '"><i class="fas fa-table-tennis"></i> TENNIS <i class="fas fa-chevron-down" style="font-size:10px;opacity:.7"></i></a>
      <div class="dropdown">
        <a href="' . home_url('/product-category/vot-tennis/') . '"><i class="fas fa-grip-lines-vertical"></i> Vợt tennis</a>
        <a href="' . home_url('/product-category/giay-tennis/') . '"><i class="fas fa-shoe-prints"></i> Giày tennis</a>
        <a href="' . home_url('/product-category/phu-kien-tennis/') . '"><i class="fas fa-tools"></i> Phụ kiện</a>
        <a href="' . home_url('/product-category/giay-tennis-secondhand/') . '" style="color:#8B5E3C!important"><i class="fas fa-recycle"></i> Tennis 2nd</a>
      </div>
    </li>
    <li style="display:none">
      <a href="' . home_url('/product-category/giay-pickleball/') . '">PICKLEBALL <i class="fas fa-chevron-down" style="font-size:10px;opacity:.7"></i></a>
      <div class="dropdown">
        <a href="' . home_url('/product-category/vot-pickleball/') . '"><i class="fas fa-grip-lines-vertical"></i> Vợt pickleball</a>
        <a href="' . home_url('/product-category/giay-pickleball/') . '"><i class="fas fa-shoe-prints"></i> Giày pickleball</a>
        <a href="' . home_url('/product-category/phu-kien-pickleball/') . '"><i class="fas fa-tools"></i> Phụ kiện</a>
      </div>
    </li>
    <li class="nav-secondhand"><a href="' . home_url('/product-category/giay-secondhand/') . '"><i class="fas fa-recycle"></i> 2HAND ⭐</a></li>
    <li class="nav-care"><a href="https://care.sigon.vn" target="_blank" rel="noopener"><i class="fas fa-sparkles"></i> VỆ SINH GIÀY ✨</a></li>
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
rm->term_id], 'pa_thuong-hieu', false);
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

    // --- Size ---
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
