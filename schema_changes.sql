-- =============================================================================
-- TIMEX CERAMIC - SAFE IDEMPOTENT DATABASE MIGRATION SCRIPT
-- =============================================================================
-- This script safely ensures all required tables, columns, indexes, and initial
-- records exist in MySQL without modifying or dropping any existing data.
-- =============================================================================

CREATE DATABASE IF NOT EXISTS `timex_ceramic` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `timex_ceramic`;

-- 1. Admin Users Table
CREATE TABLE IF NOT EXISTS `admin_users` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `username` VARCHAR(100) NOT NULL UNIQUE,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` VARCHAR(50) NOT NULL DEFAULT 'ADMIN',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Products Table
CREATE TABLE IF NOT EXISTS `products` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `sku` VARCHAR(100) NOT NULL UNIQUE,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `name` VARCHAR(255) NOT NULL,
  `code` VARCHAR(100) NOT NULL UNIQUE,
  `barcode` VARCHAR(100) NULL,
  `description` TEXT NULL,
  `price` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `b2b_price` DECIMAL(10,2) NULL DEFAULT 0.00,
  `inventory` INT NOT NULL DEFAULT 0,
  `category_id` VARCHAR(100) NOT NULL,
  `category_name` VARCHAR(100) NULL,
  `collection_id` VARCHAR(100) NULL,
  `collection_name` VARCHAR(100) NULL,
  `size` VARCHAR(100) NULL,
  `thickness` VARCHAR(100) NULL,
  `finish` VARCHAR(100) NULL,
  `look` VARCHAR(100) NULL,
  `material` VARCHAR(100) NULL,
  `origin` VARCHAR(100) NULL DEFAULT 'Imported',
  `color` VARCHAR(100) NULL,
  `application` VARCHAR(255) NULL,
  `pattern` VARCHAR(100) NULL,
  `water_absorption` VARCHAR(100) NULL,
  `images_json` LONGTEXT NULL,
  `space_images_json` LONGTEXT NULL,
  `secondary_categories_json` LONGTEXT NULL,
  `subcategories_json` LONGTEXT NULL,
  `available_colors_json` LONGTEXT NULL,
  `color_hexes_json` LONGTEXT NULL,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `is_new_arrival` BOOLEAN NOT NULL DEFAULT TRUE,
  `is_bestseller` BOOLEAN NOT NULL DEFAULT FALSE,
  `show_tile_of_spain_badge` BOOLEAN NOT NULL DEFAULT FALSE,
  `meta_title` VARCHAR(255) NULL,
  `meta_description` TEXT NULL,
  `keywords` TEXT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_category` (`category_id`),
  INDEX `idx_slug` (`slug`),
  INDEX `idx_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Dynamic Colors Table
CREATE TABLE IF NOT EXISTS `colors` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `hex` VARCHAR(20) NOT NULL DEFAULT '#808080',
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `display_order` INT NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_slug` (`slug`),
  INDEX `idx_active` (`is_active`),
  INDEX `idx_order` (`display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Category FAQs Table
CREATE TABLE IF NOT EXISTS `category_faqs` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `category_id` VARCHAR(100) NOT NULL,
  `question` TEXT NOT NULL,
  `answer` TEXT NOT NULL,
  `display_order` INT NOT NULL DEFAULT 1,
  `status` VARCHAR(50) NOT NULL DEFAULT 'published',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_cat_faq` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Blogs Table
CREATE TABLE IF NOT EXISTS `blogs` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `title` VARCHAR(255) NOT NULL,
  `subtitle` VARCHAR(255) NULL,
  `category` VARCHAR(100) NOT NULL DEFAULT 'DESIGN TIPS',
  `author_name` VARCHAR(100) NOT NULL DEFAULT 'Timex Design Editorial',
  `author_role` VARCHAR(100) NULL,
  `author_avatar` VARCHAR(500) NULL,
  `cover_image` VARCHAR(500) NULL,
  `excerpt` TEXT NULL,
  `content_json` LONGTEXT NULL,
  `tags_json` LONGTEXT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'Published',
  `read_time` VARCHAR(50) NOT NULL DEFAULT '5 Min Read',
  `meta_title` VARCHAR(255) NULL,
  `meta_description` TEXT NULL,
  `keywords` TEXT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_blog_slug` (`slug`),
  INDEX `idx_blog_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Enquiries Table
CREATE TABLE IF NOT EXISTS `enquiries` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `type` VARCHAR(50) NOT NULL DEFAULT 'GENERAL',
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(50) NOT NULL,
  `company` VARCHAR(255) NULL,
  `message` TEXT NOT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'PENDING',
  `page_source` VARCHAR(255) NULL,
  `details_json` LONGTEXT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_enq_type` (`type`),
  INDEX `idx_enq_status` (`status`),
  INDEX `idx_enq_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. SEO Metadata Table
CREATE TABLE IF NOT EXISTS `seo_metadata` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `page_path` VARCHAR(255) NOT NULL UNIQUE,
  `content_type` VARCHAR(50) NOT NULL DEFAULT 'page',
  `title` VARCHAR(255) NULL,
  `meta_title` VARCHAR(255) NOT NULL,
  `meta_description` TEXT NULL,
  `focus_keyword` VARCHAR(255) NULL,
  `secondary_keywords` TEXT NULL,
  `canonical_url` VARCHAR(255) NULL,
  `robots_index` BOOLEAN NOT NULL DEFAULT TRUE,
  `robots_follow` BOOLEAN NOT NULL DEFAULT TRUE,
  `og_title` VARCHAR(255) NULL,
  `og_description` TEXT NULL,
  `og_image` VARCHAR(500) NULL,
  `twitter_title` VARCHAR(255) NULL,
  `twitter_description` TEXT NULL,
  `twitter_image` VARCHAR(500) NULL,
  `twitter_card` VARCHAR(50) NOT NULL DEFAULT 'summary_large_image',
  `schema_type` VARCHAR(100) NULL,
  `schema_data` LONGTEXT NULL,
  `seo_score` INT NOT NULL DEFAULT 70,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_page_path` (`page_path`),
  INDEX `idx_content_type` (`content_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. SEO Redirects Table
CREATE TABLE IF NOT EXISTS `seo_redirects` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `source_url` VARCHAR(255) NOT NULL UNIQUE,
  `destination_url` VARCHAR(255) NOT NULL,
  `redirect_type` INT NOT NULL DEFAULT 301,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `hit_count` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_source_url` (`source_url`),
  INDEX `idx_redirect_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- IDEMPOTENT COLUMN ADDITIONS FOR EXISTING PRODUCTS TABLE
-- -----------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS `AddColumnSafely`;

DELIMITER $$
CREATE PROCEDURE `AddColumnSafely`(
  IN target_table VARCHAR(64),
  IN target_column VARCHAR(64),
  IN column_definition VARCHAR(255)
)
BEGIN
  DECLARE column_count INT;
  SELECT COUNT(*) INTO column_count
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = target_table
    AND COLUMN_NAME = target_column;

  IF column_count = 0 THEN
    SET @sql = CONCAT('ALTER TABLE `', target_table, '` ADD COLUMN `', target_column, '` ', column_definition);
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
  END IF;
END$$
DELIMITER ;

-- Apply safe column additions to products table
CALL AddColumnSafely('products', 'space_images_json', 'LONGTEXT NULL');
CALL AddColumnSafely('products', 'secondary_categories_json', 'LONGTEXT NULL');
CALL AddColumnSafely('products', 'subcategories_json', 'LONGTEXT NULL');
CALL AddColumnSafely('products', 'available_colors_json', 'LONGTEXT NULL');
CALL AddColumnSafely('products', 'color_hexes_json', 'LONGTEXT NULL');
CALL AddColumnSafely('products', 'is_new_arrival', 'BOOLEAN NOT NULL DEFAULT TRUE');
CALL AddColumnSafely('products', 'is_bestseller', 'BOOLEAN NOT NULL DEFAULT FALSE');
CALL AddColumnSafely('products', 'show_tile_of_spain_badge', 'BOOLEAN NOT NULL DEFAULT FALSE');

DROP PROCEDURE IF EXISTS `AddColumnSafely`;

-- -----------------------------------------------------------------------------
-- INITIAL ACTIVE COLORS (Inserted only if not present)
-- -----------------------------------------------------------------------------
INSERT IGNORE INTO `colors` (`id`, `name`, `slug`, `hex`, `is_active`, `display_order`, `created_at`, `updated_at`) VALUES
('color-beige', 'Beige', 'beige', '#D4C4B5', 1, 1, NOW(), NOW()),
('color-black', 'Black', 'black', '#1E1E1E', 1, 2, NOW(), NOW()),
('color-blue', 'Blue', 'blue', '#3E6B99', 1, 3, NOW(), NOW()),
('color-brown', 'Brown', 'brown', '#6E473B', 1, 4, NOW(), NOW()),
('color-colourful', 'Colourful', 'colourful', '#E07A5F', 1, 5, NOW(), NOW()),
('color-copper', 'Copper', 'copper', '#B87333', 1, 6, NOW(), NOW()),
('color-cotto', 'Cotto', 'cotto', '#C26D4D', 1, 7, NOW(), NOW()),
('color-dark-wenge', 'Dark Wenge', 'dark-wenge', '#382C26', 1, 8, NOW(), NOW()),
('color-gold', 'Gold', 'gold', '#D4AF37', 1, 9, NOW(), NOW()),
('color-green', 'Green', 'green', '#4D7C59', 1, 10, NOW(), NOW()),
('color-grey', 'Grey', 'grey', '#8A8D8F', 1, 11, NOW(), NOW()),
('color-pink', 'Pink', 'pink', '#E3A5A8', 1, 12, NOW(), NOW()),
('color-red', 'Red', 'red', '#B83B3B', 1, 13, NOW(), NOW()),
('color-silver', 'Silver', 'silver', '#C0C0C0', 1, 14, NOW(), NOW()),
('color-white', 'White', 'white', '#FFFFFF', 1, 15, NOW(), NOW()),
('color-yellow', 'Yellow', 'yellow', '#F4D06F', 1, 16, NOW(), NOW());

-- Done



-- -----------------------------------------------------------------------------
-- AUDITED & CORRECTED PRODUCT DATA SYNC (106 Products)
-- Safely inserts or updates products without affecting any other data
-- -----------------------------------------------------------------------------
INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1794987593915-c37717', 'TMX-SKU-TMX-960', 'zelij', 'Zelij', 'TMX-960', '8907351080510', 'Zelij tiles, also known as Zellige or Moroccan tiles, have a rich history that traces back to 10th-century Morocco. These tiles are traditionally handmade from natural clay and are famous for their unique geometric designs. The craft of creating Zelig tiles has been passed down through generations, maintaining the detailed artistry and cultural significance they represent.', 0, 0, 100,
  'boutique', 'Boutique Tiles', 'coll-boutique', 'Boutique Collection', '100mm x 100mm', '',
  'Glossy, Hand-Made', '', 'Ceramic Wall Tile', 'European Tiles', 'Green', 'Wall & Floor', '', '',
  '["/uploads/products/Amb-Zelij-Special-antic-azul-10x10.webp","/uploads/products/Zelij-Antic-Azul-100x100.webp","/uploads/products/Zelij-Naranja-Dif-100x100.webp","/uploads/products/Zelij-Rojo-Antiguo-100x100.webp","/uploads/products/Zelij-Verde-Cobre-100x100.webp","/uploads/products/Zelij-Antic-Amarillo-100x100.webp","/uploads/products/Zelij-Hueso-piezas-2.webp","/uploads/products/Amb-zelij-special-naranja-dif.webp","/uploads/products/Amb-zelij-special-rojo-antiguo.webp","/uploads/products/Amb-Zelij-Special-Antic-Amarillo-10x10-1.webp","/uploads/products/Amb-Zelij-Hueso-10x10.webp","/uploads/products/Amb-Zelij-Special-verde-cobre-10x10-3.webp","/uploads/products/Amb-Zelij-Gold-Craquel-6.webp","/uploads/products/Amb-Zelij-Gold-Craquel-1.webp"]', '{}', '[]', '[]',
  '["Green","Yellow","Blue","Red"]', '{"Green":"#4D7C59","Yellow":"#F4D06F","Blue":"#3E6B99","Red":"#B83B3B"}',
  1, 0, 0, 0, 'Zelij ----| Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', 'Zelij, Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1794297416563-c3454d', 'TMX-SKU-TMX-878', 'raku-series', 'Raku Series', 'TMX-878', '8909114850132', 'The Raku Series boutique tiles offer a unique aesthetic, inspired by the Japanese Raku firing technique. The look combines rustic charm with refined artistry, creating captivating surfaces that bring artistic flair to interiors. The feel can range from smooth to textured, depending on the chosen finish', 0, 0, 100,
  'boutique', 'Boutique Tiles', 'coll-boutique', 'Boutique Collection', '100mm x 100mm', '',
  'Matt, Textured', '', 'Porcelain', 'European Tiles', 'Cotto', 'Wall & Floor', '', '',
  '["/uploads/products/Raku-Sand-Line-Sand-10-x-10-cm.webp","/uploads/products/Raku-Line-Nude-100x100.webp","/uploads/products/Raku-Line-Sage-100x100.webp","/uploads/products/Raku-Line-Sea-100x100.webp","/uploads/products/Raku-Line-Smoke-100x100.webp","/uploads/products/Raku-Line-White-100x100.webp","/uploads/products/Raku-Nude-100x100.webp","/uploads/products/Raku-Sage-100x100.webp","/uploads/products/Raku-Sea-100x100.webp","/uploads/products/Raku-Smoke-100x100.webp","/uploads/products/Raku-White-100x100.webp","/uploads/products/Raku-Smoke-10-x-10-cm.webp","/uploads/products/Raku-White-Line-White-10-x-10-cm.webp","/uploads/products/Raku-Sea-White-Line-Sea-Line-White-10-x-10-cm.webp","/uploads/products/Raku-Sage-10-x-10-cm.webp","/uploads/products/Raku-Nude-Line-Nude-10-x-10-cm.webp"]', '{"Bathroom Tiles":"/uploads/products/Raku-Sage-10-x-10-cm.webp","bathroom-tiles":"/uploads/products/Raku-Sage-10-x-10-cm.webp","Kitchen Tiles":"/uploads/products/Raku-Nude-Line-Nude-10-x-10-cm.webp","kitchen-tiles":"/uploads/products/Raku-Nude-Line-Nude-10-x-10-cm.webp","Café & Restaurant Tiles":"/uploads/products/Raku-Smoke-10-x-10-cm.webp","cafe-and-restaurant-tiles":"/uploads/products/Raku-Smoke-10-x-10-cm.webp","cafe-restaurant-tiles":"/uploads/products/Raku-Smoke-10-x-10-cm.webp"}', '[]', '[]',
  '["Cotto"]', '{"Cotto":"#C26D4D"}',
  1, 0, 0, 0, 'Raku Series | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', 'Raku Series, Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1794288135963-aee0e4', 'TMX-SKU-TMX-993', '9005-06-series', '9005-06 Series', 'TMX-993', '8907679643233', 'The 9005–06 Series reimagines the wall as a canvas. Available in two distinct moods: the 9005 offers a serene, plaster-like beige where painterly florals fade softly into the background like a watercolour memory. In contrast, the 9006 embraces a deep, mossy green, using tactile relief to create a carved garden effect that feels immersive and grounding. Lived-in and quietly grand, this series turns any room into a gallery of timeless texture.', 0, 0, 100,
  'tropical', 'Tropical / Floral', 'coll-tropical', 'Tropical Collection', '600mm x 1200mm', '',
  'Matt', '', 'Porcelain', 'Imported', 'Beige', 'Wall & Floor', '', '',
  '["/uploads/products/9005-AMB-11.webp","/uploads/products/9005-Decor.webp","/uploads/products/9005-Plain.webp","/uploads/products/9006-Decor.webp","/uploads/products/9006-Plain.webp","/uploads/products/9005-AMB-10.webp","/uploads/products/9005-AMB-1.webp","/uploads/products/9005-AMB-9.webp","/uploads/products/9005-AMB-8.webp","/uploads/products/9005-AMB-6.webp","/uploads/products/9006-AMB-6.webp","/uploads/products/9006-AMB-5.webp","/uploads/products/9006-AMB-4.webp","/uploads/products/9006-AMB-2.webp","/uploads/products/9006-AMB-1.webp"]', '{}', '["fabric"]', '[]',
  '["Beige","Grey"]', '{"Beige":"#D4C4B5","Grey":"#8A8D8F"}',
  1, 0, 0, 0, '9005-06 Series | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', '9005-06 Series, Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1794287533402-f1b9cf', 'TMX-SKU-TMX-575', '208-highlighter', '208 Highlighter', 'TMX-575', '8909947118549', '', 0, 0, 100,
  'tropical', 'Tropical / Floral', 'coll-tropical', 'Tropical Collection', '300mm X 600mm', '',
  'Glossy', '', 'Porcelain', 'Imported', 'Beige', 'Wall', '', '',
  '["/uploads/products/208-Concept-AMB_1-copy.webp","/uploads/products/208-Highlighter.webp","/uploads/products/208-Concept-AMB_2.webp"]', '{}', '[]', '[]',
  '["Beige"]', '{"Beige":"#D4C4B5"}',
  1, 0, 0, 0, '208 Highlighter | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', '208 Highlighter, Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1793691029424-d048fc', 'TMX-SKU-TMX-291', 'combo-series', 'Combo Series', 'TMX-291', '8902284568079', 'Where geometry meets play. The Combo Series reimagines the wall as a dynamic canvas with its bold, circular relief. The interlocking patterns create a continuous, sculptural rhythm that adds depth and 3D movement to the room.
It turns a static surface into a vibrant focal point of energy and modern art.', 0, 0, 100,
  'colorful', 'Colorful Tiles', 'coll-colorful', 'Colorful Collection', '240mm x 740mm', '',
  'Glossy', '', 'Ceramic Wall Tile', 'European Tiles, Spanish Tiles', 'Beige', 'Wall', '', '',
  '["/uploads/products/Combo-Burdeos-AMB.webp","/uploads/products/Combo-Beige-240-x-470.webp","/uploads/products/Combo-Burdeos-240-x-470.webp","/uploads/products/Belle-Blanco-AMB.webp","/uploads/products/Combo-Beige-240x740-AMB.webp"]', '{}', '[]', '[]',
  '["Beige","Red"]', '{"Beige":"#ddd1c5","Red":"#B83B3B"}',
  1, 1, 0, 0, 'Combo Series | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', 'Combo Series, Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1793191389717-a3ca3a', 'TMX-SKU-TMX-890', 'stp-36x6', 'STP 36X6', 'TMX-890', '8904627072330', 'Accent any decor with these wood-inspired tiles for an awe-inspiring, classy feel. Featuring an understated look, these ageless marvels come in a variety of shades.', 0, 0, 100,
  'wooden', 'Wooden Look', 'coll-wooden', 'Wooden Collection', '900mm X 150mm', '',
  'Matt', '', 'Ceramic Wall Tile', 'Imported', 'Brown', 'Wall', '', '',
  '["/uploads/products/STP-39.webp","/uploads/products/24.webp","/uploads/products/11.webp","/uploads/products/26.webp","/uploads/products/28.webp","/uploads/products/29.webp","/uploads/products/30.webp","/uploads/products/33.webp","/uploads/products/35-1.webp","/uploads/products/38.webp","/uploads/products/39.webp","/uploads/products/40.webp","/uploads/products/STP-40_AMB_2.webp","/uploads/products/STP-40_AMB_1.webp","/uploads/products/STP-38.webp","/uploads/products/STP-35.webp","/uploads/products/STP-33.webp","/uploads/products/STP-30_AMB_2.webp","/uploads/products/STP-29_AMB_2.webp","/uploads/products/STP-29_AMB_1.webp","/uploads/products/STP-28_AMB_2.webp","/uploads/products/STP-26_AMB_2.webp","/uploads/products/STP-26_AMB_1.webp","/uploads/products/STP-24.webp"]', '{}', '[]', '[]',
  '["Brown","Cotto","Beige","Dark Wenge","Grey"]', '{"Brown":"#6E473B","Cotto":"#5e4333","Beige":"#a99073","Dark Wenge":"#5e3f2b","Grey":"#8e9189"}',
  1, 1, 0, 0, 'STP 36X6 | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', 'STP 36X6, Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1793190957634-4b53c4', 'TMX-SKU-TMX-678', '4000', '4000', 'TMX-678', '8909685481327', 'The X factor of neutral tiles is the way they seamlessly blend with colours binding the blend of different shades together and presenting an exceptionally put together look. This series include some of our classiest beige tiles in light and dark shades.', 0, 0, 100,
  'octagonal', 'Octagonal Tiles', 'coll-octagonal', 'Octagonal Collection', '500mm X 500mm', '',
  'Matt', '', 'Porcelain', 'Imported', 'Grey', 'Wall & Floor', '', '',
  '["/uploads/products/4005_AMB.webp","/uploads/products/4007-Grey.webp","/uploads/products/4008-Cotta.webp","/uploads/products/4009-Green-500x500.webp","/uploads/products/Insert-Cream-73x73.webp","/uploads/products/Insert-73-x-73-Blue.webp","/uploads/products/4001.webp","/uploads/products/4002.webp","/uploads/products/4005.webp","/uploads/products/Insert-73-x-73-Grey.webp","/uploads/products/4006-Blue.webp","/uploads/products/Insert-73x73-Cotto.webp","/uploads/products/Insert-75-x-75-New.webp","/uploads/products/Insert-75-x-75-Green.webp","/uploads/products/4007-Grey_AMB_2.webp","/uploads/products/4006-Blue_AMB.webp","/uploads/products/4001_-AMB_1.webp","/uploads/products/4001_-AMB_3.webp","/uploads/products/4002_AMB_1.webp","/uploads/products/4.webp","/uploads/products/3.webp","/uploads/products/4002-Image.webp","/uploads/products/1.webp","/uploads/products/4008-Cotto_AMB-2.webp","/uploads/products/4007-Grey_AMB.webp","/uploads/products/4008-Cotto_AMB-1.webp"]', '{}', '[]', '[]',
  '["Grey","Brown","Green","Beige"]', '{"Grey":"#8A8D8F","Brown":"#6E473B","Green":"#4D7C59","Beige":"#D4C4B5"}',
  1, 1, 0, 0, '4000 | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', 'Manises, Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1793189442745-bc901c', 'TMX-SKU-TMX-144', 'veranda-series', 'Veranda Series', 'TMX-144', '8906050681044', 'The Veranda Series is a celebration of artistry, blending Mediterranean heritage, European craftsmanship, and modern sophistication. With intricate geometric and floral motifs, rich textures, and a palette ranging from deep oceanic blues to refined neutrals, these tiles add warmth, depth, and character to any space. Whether it’s the charm of hand-painted patterns, the elegance of marbled textures, or the bold vibrancy of statement designs, Veranda transforms walls and floors into captivating expressions of luxury and style.
Perfect for accent walls, backsplashes, and high-end interiors, this series effortlessly bridges tradition and contemporary refinement.', 0, 0, 100,
  'moroccan', 'Moroccan Tiles', 'coll-moroccan', 'Moroccan Collection', '150mm x 150mm', '',
  'Matt', '', 'Porcelain', 'European Tiles, Spanish Tiles', 'White', 'Wall & Floor', '', '',
  '["/uploads/products/AMBIENTE-VERANDA-MARESA-WHITE.webp","/uploads/products/Veranda-Cottage-White-150X150.webp","/uploads/products/Veranda-Laguna-Blue-150X150.webp","/uploads/products/Veranda-Alma-150X150.webp","/uploads/products/Veranda-Maresa-150X150.webp","/uploads/products/AMBIENTE_DORMITORIO-VERANDA-ALMA.webp","/uploads/products/AMBIENTE-VERANDA-ALMA_A2.webp","/uploads/products/AMBIENTE-PISCINAS-VERANDA-LAGUNA-BLUE-ALMA.webp","/uploads/products/AMBIENTE-PISCINAS-VERANDA-MARESA-WHITE.webp"]', '{}', '[]', '[]',
  '["White","Blue","Colourful"]', '{"White":"#FFFFFF","Blue":"#1d3f43","Colourful":"#E07A5F"}',
  1, 1, 0, 0, 'Veranda Series  | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', 'Veranda Series , Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1793188878715-f7c711', 'TMX-SKU-TMX-435', 'veracruz-matt', 'Veracruz Matt', 'TMX-435', '8904032582126', 'The Veracruz series offers durable, easy-to-maintain tiles with a distinctive patterned look. Available in both classic square and bold hexagonal formats, the tiles feature Moroccan-inspired geometry that adds visual interest without overwhelming the space.
Well suited for kitchens, cafés, entryways, and feature floors or walls, the Veracruz series brings character and pattern to interiors that want something decorative yet practical.', 0, 0, 100,
  'moroccan', 'Moroccan Tiles', 'coll-moroccan', 'Moroccan Collection', '150mm x 150mm', '',
  'Matt', '', 'Porcelain', 'European Tiles, Spanish Tiles', 'Colourful', 'Wall & Floor', '', '',
  '["/uploads/products/Amb-Veracruz-15x15.webp","/uploads/products/Veracruz-Matt-150x150.webp","/uploads/products/Amb-Veracruz-15x15-_Peldao-Campaspero-33x120.webp"]', '{}', '[]', '[]',
  '["Colourful"]', '{"Colourful":"#E07A5F"}',
  1, 1, 0, 0, 'Veracruz Matt  | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', 'Veracruz Matt , Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1793188452817-d0a033', 'TMX-SKU-TMX-482', 'teguise-series', 'Teguise Series', 'TMX-482', '8901691125065', 'Taipei series offers a vibrant, matte finish that evokes a lively Moroccan aesthetic, infusing spaces with a pop of colour and an exotic, yet timeless character.', 0, 0, 100,
  'texture', 'Texture / 3D', 'coll-texture', 'Texture Collection', '150mm X 300mm', '',
  'Matt', '', 'Porcelain', 'European Tiles, Spanish Tiles', 'Beige', 'Wall & Floor', '', '',
  '["/uploads/products/Amb-Teguise-ocre-15x30-Lagoon-Deep-15x15.webp","/uploads/products/Teguise-Ocre-150-x-300.webp","/uploads/products/Teguise-Cotto-150-x-300.webp","/uploads/products/Amb-Teguise-cotto-15x30-Lagoon-green-15x15.webp"]', '{}', '[]', '[]',
  '["Beige","Cotto"]', '{"Beige":"#dbcabb","Cotto":"#a67c67"}',
  1, 1, 0, 0, 'Teguise Series  | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', 'Teguise Series , Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1793187490916-bda4ab', 'TMX-SKU-TMX-378', 'taipei-series', 'Taipei Series', 'TMX-378', '8902398691638', 'Taipei series offers a vibrant, matte finish that evokes a lively Moroccan aesthetic, infusing spaces with a pop of colour and an exotic, yet timeless character.', 0, 0, 100,
  'texture', 'Texture / 3D', 'coll-texture', 'Texture Collection', '150mm X 150mm', '',
  'Matt', '', 'Porcelain', 'European Tiles, Spanish Tiles', 'Green', 'Wall & Floor', '', '',
  '["/uploads/products/Tapei-green-Teguise-cotto-Amb.webp","/uploads/products/Taipei-Green-150-x-150.webp","/uploads/products/Taipei-Lava-150-x-150.webp","/uploads/products/Taipei-Sand-150-x-150.webp","/uploads/products/Taipei-White-150-x-150.webp","/uploads/products/Taipei-white-AMB.webp","/uploads/products/Taipei-sand-Amb.webp","/uploads/products/Taipei-green-Amb.webp"]', '{}', '[]', '[]',
  '["Green","Black","Brown","White"]', '{"Green":"#4D7C59","Black":"#1E1E1E","Brown":"#6E473B","White":"#FFFFFF"}',
  1, 1, 0, 0, 'Taipei Series  | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', 'Taipei Series , Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1793184954366-7c7db9', 'TMX-SKU-TMX-165', 'season-series', 'Season Series', 'TMX-165', '8906305235744', 'The Season series, with its Moroccan-inspired aesthetic and matte finish, offers a distinctive visual impact, creating a space with a soft, understated elegance and a sense of inviting warmth. It effortlessly diffuses light, creating a calming and cosy ambience, and fostering a sense of serenity.
These durable, wear/stain resistant tiles are ideal for both wall and floor applications, providing a safe, anti-slip surface for high-traffic areas like kitchens and bathrooms', 0, 0, 100,
  'moroccan', 'Moroccan Tiles', 'coll-moroccan', 'Moroccan Collection', '200mm X 200mm', '',
  'Matt', '', 'Porcelain', 'European Tiles, Spanish Tiles', 'Green', 'Wall & Floor', '', '',
  '["/uploads/products/Season-Green-dec-green-two-AMB.webp","/uploads/products/Season-Green-200-x-200.webp","/uploads/products/Season-Canem-200-x-200.webp","/uploads/products/Season-Decor-Green-Eight-200-x-200.webp","/uploads/products/Season-Dcor-Canem-Eight-200-x-200.webp","/uploads/products/Season-Decor-Green-Two-200-x-200.webp","/uploads/products/Season-Decor-Canem-Two-200-x-200.webp","/uploads/products/Season-series-Layout-Ideas-01-2.webp","/uploads/products/Season-series-Layout-Ideas-01-1.webp","/uploads/products/Season-Green-dec-Green-Two-AMB-2.webp","/uploads/products/Season-Green-dec-Green-AMB.webp","/uploads/products/Season-Dcor-Canem-Two-200-x-200-AMB-3.webp","/uploads/products/Season-Dcor-Canem-Two-200-x-200-AMB-2.webp","/uploads/products/Season-Dcor-Canem-Two-200-x-200-AMB-1.webp","/uploads/products/Season-Dcor-Canem-Eight-200-x-200-AMB.webp"]', '{}', '[]', '[]',
  '["Green","White","Cotto"]', '{"Green":"#a2a992","White":"#e3e0d7","Cotto":"#d59f7e"}',
  1, 0, 0, 0, 'Season Series  | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', 'Season Series , Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1793184651786-81b255', 'TMX-SKU-TMX-362', 'lagoon-series', 'Lagoon Series', 'TMX-362', '8906372557232', 'Lagoon series exhibits significant shade variation, ideal for spaces desiring an aged, unique, or visually dynamic look, like feature walls or floors.', 0, 0, 100,
  'texture', 'Texture / 3D', 'coll-texture', 'Texture Collection', '150mm X 150mm', '',
  'Matt', '', 'Porcelain Tiles, Anti Skid Tiles', 'European Tiles, Spanish Tiles', 'Beige', 'Wall & Floor', '', '',
  '["/uploads/products/Elegance-Deco-Brown-AMB.webp","/uploads/products/Elegance-Cream-200-x-200-mm.webp","/uploads/products/Elegance-Blu-Green-200-x-200-mm.webp","/uploads/products/Elegance-Brown-200-x-200-mm.webp","/uploads/products/Elegance-Deco-Cream-200-x-200-mm.webp","/uploads/products/Elegance-Deco-Blu-Green-200-x-200-mm.webp","/uploads/products/Elegance-Deco-Brown-200-x-200-mm.webp","/uploads/products/Elegance-Deco-Blu-Green-AMB.webp","/uploads/products/Elegance-Deco-Cream-AMB.webp"]', '{}', '[]', '[]',
  '["Beige","Brown","Cotto","Blue"]', '{"Beige":"#e7dacc","Brown":"#b18a6f","Cotto":"#b18a6f","Blue":"#8f9f95"}',
  1, 0, 0, 0, 'Lagoon Series  | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', 'Lagoon Series , Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1792994538818-5f761d', 'TMX-SKU-TMX-193', 'yoko-origami-series', 'Yoko & Origami Series', 'TMX-193', '8907374407598', 'Embracing the boutique tile trend, the Yoko Series features 6 elegant plain tiles that bring a refined, handcrafted aesthetic to luxury interiors. With a glossy, smooth finish, these small-format tiles reflect light beautifully, enhancing depth and dimension in any space. Their high-end appeal makes them ideal for modern kitchens, boutique-style bathrooms, and statement walls.

For a bold, architectural twist, the Origami Series introduces 6 dynamic geometric designs with 8 unique faces, blending rectangles and triangles for a striking, sculptural effect. This interplay of form and texture adds visual movement and a sense of modern artistry, making it perfect for sophisticated, design-forward interiors.', 0, 0, 100,
  'subway', 'Subway Tiles', 'coll-subway', 'Subway Collection', '62mm X 125mm', '',
  'Glossy', '', 'Ceramic Wall Tile', 'European Tiles, Spanish Tiles', 'Grey', 'Wall', '', '',
  '["/uploads/products/__YOKO-ORIGAMI-PEWTER_EDGE.webp","/uploads/products/Origami-Pewter-62x125.webp","/uploads/products/Origami-Onix-62x125.webp","/uploads/products/Origami-Moss-62x125.webp","/uploads/products/Origami-Marine-62x125.webp","/uploads/products/Origami-Daisy-62x125.webp","/uploads/products/Origami-Bordo-62x125.webp","/uploads/products/Yoko-Pewter-125x625-0.1.webp","/uploads/products/Yoko-Onyx-62x125.webp","/uploads/products/Yoko-Moss-62x125.webp","/uploads/products/Yoko-Marine-62x125.webp","/uploads/products/Yoko-Daisy-62x125.webp","/uploads/products/Yoko-Bordo-62x125.webp","/uploads/products/__YOKO-ORIGAMI-ONYX.webp","/uploads/products/_ORIGAMI-MOSS.webp","/uploads/products/_ORIGAMI-PEWTER.webp","/uploads/products/_YOKO-ORIGAMI-BORDO.webp","/uploads/products/_YOKO-DAISY-MARINE.-ORIGAMI-DAISY-MARINE.webp","/uploads/products/_YOKO-DAISY-PEWTER-ORIGAMI-DAISY-PEWTER.webp","/uploads/products/_YOKO-ONYX-MOSS-ORIGAMI-ONYX-MOSS.webp","/uploads/products/AMB01_YOKO-ORIGAMI-MARINE.webp","/uploads/products/AMB2_YOKO-ORIGAMI-DAISY.webp","/uploads/products/AMB04__YOKO-ORIGAMI-BORDO.webp","/uploads/products/Amb06_YOKO-DAISY-ORIGAMI-MARINE.webp","/uploads/products/Amb06_YOKO-MARINE-ORIGAMI-DAISY.webp","/uploads/products/AMB07_origami-yoko-onyx.webp","/uploads/products/Amb08_yoko-origami-Moss.webp","/uploads/products/Amb09_YOKO-DAISY-ORIGAMI-PEWTER.webp"]', '{}', '["boutique"]', '[]',
  '["Grey","Black","Green","Blue","White","Red"]', '{"Grey":"#8A8D8F","Black":"#1E1E1E","Green":"#4D7C59","Blue":"#3E6B99","White":"#FFFFFF","Red":"#B83B3B"}',
  1, 0, 0, 0, 'Yoko & Origami Series | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', 'Yoko & Origami Series, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1792990998069-19a61b', 'TMX-SKU-TMX-126', 'vitral', 'Vitral', 'TMX-126', '8905006638807', 'The Vitral series tiles feature a sleek, glossy finish that brightens and expands rooms by reflecting light. The collection offers a range of options, from soft, matte tones to bold, vibrant colours with a reactive glaze. A standout option is the Vitral Axis tile, available in shades like Caramel, Forest, and Petrol. These tiles have a unique crackle effect in their glaze, adding a rustic, handmade texture that contrasts with the series’ modern, glossy feel.
Overall, the Vitral series offers a versatile design element that can be used to create spaces that are either contemporary and luxurious or charmingly vintage.', 0, 0, 100,
  'subway', 'Subway Tiles', 'coll-subway', 'Subway Collection', '50mm x 400mm', '',
  'Glossy', '', 'Ceramic Wall Tile', 'European Tiles, Spanish Tiles', 'Black', 'Wall', '', '',
  '["/uploads/products/vitral-hq-5091.webp","/uploads/products/Vitral-Axis-Black-50x400-1.webp","/uploads/products/Vitral-Axis-Caramel-Reactive-50x400-1.webp","/uploads/products/Vitral-Axis-Forest-Reactive-50x400-1.webp","/uploads/products/Vitral-Axis-Honey-Reactive-50x400-1.webp","/uploads/products/Vitral-Axis-Petrol-Reactive-50x400-1.webp","/uploads/products/Vitral-Axis-Sand-50x400-1.webp","/uploads/products/Vitral-Axis-Snow-50x400-1.webp","/uploads/products/Vitral-Black-50x400-1.webp","/uploads/products/Vitral-Caramel-Reactive-50x400-1.webp","/uploads/products/Vitral-Forest-Reactive-50x400-1.webp","/uploads/products/Vitral-Honey-Reactive-5x40-1.webp","/uploads/products/Vitral-Petrol-Reactive-50x400-1.webp","/uploads/products/Vitral-Sand-50x400-1.webp","/uploads/products/Vitral-Snow-50x400-1.webp","/uploads/products/vitral-hq-5095.webp","/uploads/products/vitral-hq-5097.webp","/uploads/products/vitral-hq-5099.webp","/uploads/products/vitral-hq-5105.webp","/uploads/products/vitral-hq-5107.webp","/uploads/products/vitral-hq-5109.webp","/uploads/products/vitral-hq-5111.webp"]', '{}', '[]', '[]',
  '["Black","Brown","Green","Yellow","Blue","Beige","White"]', '{"Black":"#35302f","Brown":"#5d210e","Green":"#334a20","Yellow":"#a66e13","Blue":"#1a4e51","Beige":"#c9bba4","White":"#e5e1db"}',
  1, 0, 0, 0, 'Vitral | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', 'Vitral, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1792843995748-c605e1', 'TMX-SKU-TMX-101', 'sw-21-23-series', 'SW 21-23 Series', 'TMX-101', '8908026421922', 'Where simplicity meets structure. The SW 21–23 Series bring quiet coherence to contemporary spaces with plain and décor tiles. The plain surfaces extend seamlessly from wall to floor, while the decor adds gentle rhythm and variation.
Designed in an elongated, elegant format that naturally guides the eye, this series creates balance and continuity across rooms.', 0, 0, 100,
  'subway', 'Subway Tiles', 'coll-subway', 'Subway Collection', '60mm X 240mm', '',
  'Glossy', '', 'Porcelain', 'Imported', 'Beige', 'Wall & Floor', '', '',
  '["/uploads/products/SW-23-3_result.webp","/uploads/products/SW-21-Decor.webp","/uploads/products/SW-21.webp","/uploads/products/SW-22-Decor.webp","/uploads/products/SW-22.webp","/uploads/products/SW-23-Decor.webp","/uploads/products/SW-23.webp","/uploads/products/SW-23-2_result.webp","/uploads/products/SW-23-1_result.webp","/uploads/products/SW-22._result.webp","/uploads/products/SW-21-1_result.webp"]', '{}', '[]', '[]',
  '["Beige","Brown","Black"]', '{"Beige":"#d9c8b0","Brown":"#7e543e","Black":"#635c4b"}',
  1, 0, 0, 0, 'SW 21-23 Series | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', 'SW 21-23 Series, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1792843297713-052a7c', 'TMX-SKU-TMX-807', 'rebel', 'Rebel', 'TMX-807', '8905552403197', 'The Rebels collection offers porcelain subway tiles that stand out fromtraditional subway tiles by embracing ahandcrafted, slightly dimensionalaesthetic. Available in a glossy finishand a range of colours, includingneutrals and bolder hues, these tiles areideal for adding character andpersonality to a wide variety of spaces.Their durability makes them suitable fora wide variety of interior applications,including kitchen backsplashes,bathroom walls, and feature walls.
This fresh take on a classic allows for creative mix & matching to achieveunique and customised designs.', 0, 0, 100,
  'subway', 'Subway Tiles', 'coll-subway', 'Subway Collection', '50mm x 150mm', '',
  'Glossy', '', 'Porcelain', 'European Tiles, Spanish Tiles', 'Grey', 'Wall & Floor', '', '',
  '["/uploads/products/terracotta-gloss-MIX.webp","/uploads/products/Rebels-Grey-Gloss-50-x-150.webp","/uploads/products/Rebels-Moss-Gloss-50-x-150mm.webp","/uploads/products/Rebels-Mustard-Gloss-50-x-150.webp","/uploads/products/Rebels-Nero-Gloss-50-x-150mm.webp","/uploads/products/Rebels-Popcorn-Gloss-50-x-150mm.webp","/uploads/products/Rebels-Terracotta-Gloss-50-x-150mm.webp","/uploads/products/Rebels-Taupe-Gloss-50-x-150.webp","/uploads/products/sage-gloss.webp","/uploads/products/Rebels-Terracotta-Gloss.webp","/uploads/products/rebels-topo-gloss.webp","/uploads/products/rebels-taupe-gloss.webp","/uploads/products/rebels-popcorn-gloss.webp","/uploads/products/rebels-mustard-gloss.webp","/uploads/products/rebels-moss-gloss.webp","/uploads/products/rebels-moss-gloss-popcorn-gloss-grey-gloss.webp","/uploads/products/rebels-grey-gloss.webp","/uploads/products/AMB-REBELS-NERO_BANYO.webp","/uploads/products/amb16_rebels-moss-gloss-popcorn-gloss-grey-gloss.webp","/uploads/products/AMB-REBEL-TERRACOTA_COCINA.webp"]', '{}', '[]', '[]',
  '["Grey","Green","Yellow","Black","White","Brown","Beige"]', '{"Grey":"#8A8D8F","Green":"#4D7C59","Yellow":"#F4D06F","Black":"#1E1E1E","White":"#FFFFFF","Brown":"#6E473B","Beige":"#D4C4B5"}',
  1, 0, 0, 0, 'Rebel | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', 'Rebel , timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1792842128616-79f291', 'TMX-SKU-TMX-127', 'radiance-series', 'Radiance Series', 'TMX-127', '8902781933422', 'The Radiance series reimagines the classic subway tile with a glossy, elongated format. Its reflective surface and shade variation create a captivating majolica effect, infusing any setting with vibrant colour and handcrafted charm inspired by American landscapes.
These versatile tiles are ideal for enhancing both indoor and outdoor walls, including kitchen & bathroom backsplashes, living areas, and various commercial applications, offering a lustrous or shimmering element to any space.', 0, 0, 100,
  'subway', 'Subway Tiles', 'coll-subway', 'Subway Collection', '48mm X 450mm', '',
  'Glossy', '', 'Porcelain', 'European Tiles, Spanish Tiles', 'White', 'Wall & Floor', '', '',
  '["/uploads/products/Radiance-Oregon-AMB.webp","/uploads/products/Radiance-Washington-Single-Tile.webp","/uploads/products/Radiance-Arizona.webp","/uploads/products/Radiance-Indiana.webp","/uploads/products/Radiance-Montana.webp","/uploads/products/Radiance-Oregon.webp","/uploads/products/Radiance-Virginia.webp","/uploads/products/Radiance-Virginia-AMB.webp","/uploads/products/Radiance-Washington-AMB.webp","/uploads/products/Radiance-Montana-AMB-1.webp","/uploads/products/Radiance-Indiana-AMB.webp","/uploads/products/Radiance-Arizona-AMB.webp","/uploads/products/MOODBOARD_MAXANDMATCH.webp"]', '{}', '[]', '[]',
  '["White","Beige","Grey","Green","Blue","Brown"]', '{"White":"#FFFFFF","Beige":"#ede2d1","Grey":"#d4cdc9","Green":"#547262","Blue":"#657397","Brown":"#eccfb0"}',
  1, 0, 0, 0, 'Radiance Series | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', 'Radiance Series , timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1792826210008-a05fe6', 'TMX-SKU-TMX-815', 'spica-series', 'Spica Series', 'TMX-815', '8901839652239', 'Where concrete meets calm. The Spica Series channel urban minimalism through a smooth, stone-inspired matte finish with gentle tonal variations that add quiet depth.
Crafted in high-density porcelain, they offer durability and subtle warmth, ideal for open floors and walls where form and function blend seamlessly.', 0, 0, 100,
  'stone', 'Stone Look', 'coll-stone', 'Stone Collection', '400mm X 600mm', '',
  'Matt', '', 'Porcelain', 'European Tiles, Spanish Tiles', 'Brown', 'Exterior, Wall & Floor', '', '',
  '["/uploads/products/amb-spica-natural_caliza-rlv-beige.webp","/uploads/products/Spica-Coto-400-x-600-NEW.webp","/uploads/products/Spica-Mix-400-x-600-NEW.webp","/uploads/products/Spica-Natural-400-x-600-NEW.webp","/uploads/products/Spica-Piedra-400-x-600-NEW.webp","/uploads/products/amb-Spica-Piedra_hq.webp","/uploads/products/amb-spica-mix_hq.webp","/uploads/products/AMB-SPICA-CALDERA_CHANDAN_hq.webp","/uploads/products/amb-detalle-Spica-Natural_hq.webp","/uploads/products/amb-detalle-Spica-Cotto_hq.webp"]', '{}', '[]', '[]',
  '["Brown","Beige","Green"]', '{"Brown":"#aa8a6e","Beige":"#cfb7a4","Green":"#bdbebc"}',
  1, 0, 0, 0, 'Spica Series  | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', 'Spica Series , timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1792824764431-7b1ad0', 'TMX-SKU-TMX-402', 'ruanes-series', 'Ruanes Series', 'TMX-402', '8909276410322', 'The Ruanes Series bridges rustic warmth and geometric precision. Weathered stone textures lock together in a rhythmic star and diamond tapestry, creating floors that feel established rather than just laid.
Sun-drenched, architectural, and spatially expansive with its In & Out finish, Ruanes dissolves the line between sanctuary and terrace, turning your home into a seamless Mediterranean retreat.', 0, 0, 100,
  'stone', 'Stone Look', 'coll-stone', 'Stone Collection', '400 x 600mm', '',
  'Matt', '', 'Porcelain', 'European Tiles, Spanish Tiles', 'Brown', 'Exterior, Wall & Floor', '', '',
  '["/uploads/products/amb-Ruanes-grey_hq.webp","/uploads/products/Ruanes-Caldera-400-x-600-NEW.webp","/uploads/products/Ruanes-Coto-400-x-600-NEW.webp","/uploads/products/Ruanes-Grey-400-x-600-NEW.webp","/uploads/products/amb-Ruanes-Cotto_3_hq.webp","/uploads/products/amb-Ruanes-Coto_hq.webp"]', '{"Balcony & Terrace Tiles":"/uploads/products/amb-Ruanes-Coto_hq.webp","balcony-and-terrace-tiles":"/uploads/products/amb-Ruanes-Coto_hq.webp","Elevation & Exterior Tiles":"/uploads/products/amb-Ruanes-Cotto_3_hq.webp","elevation-and-exterior-tiles":"/uploads/products/amb-Ruanes-Cotto_3_hq.webp","elevation-exterior-tiles":"/uploads/products/amb-Ruanes-Cotto_3_hq.webp"}', '[]', '[]',
  '["Brown","Cotto","Grey"]', '{"Brown":"#6E473B","Cotto":"#baa799","Grey":"#b0b0b1"}',
  1, 0, 0, 0, 'Ruanes Series | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', 'Ruanes Series , timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1792762782935-cae705', 'TMX-SKU-TMX-865', 'veracruz-hexagon-matt', 'Veracruz Hexagon Matt', 'TMX-865', '8909730305308', 'Introducing Veracruz Hexagon Matt tiles, where creativity knows no bounds. With intricate and lively patterns adorning each hexagonal tile, your surfaces become works of art.', 0, 0, 100,
  'hexagon', 'Hexagon Tiles', 'coll-hexagon', 'Hexagon Collection', '232mm x 267mm', '',
  'Matt', '', 'Porcelain', 'European Tiles, Spanish Tiles', 'Colourful', 'Wall & Floor', '', '',
  '["/uploads/products/Amb-Hexa-Veracruz-23x27.webp","/uploads/products/Veracruz-Hexagon-Matt.webp","/uploads/products/Veracruz-Hexagon.webp"]', '{}', '[]', '[]',
  '["Colourful"]', '{"Colourful":"#E07A5F"}',
  1, 0, 0, 0, 'Veracruz Hexagon Matt | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', 'Veracruz Hexagon Matt , timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1792744711222-58fc97', 'TMX-SKU-TMX-407', 'vestige-series', 'Vestige Series', 'TMX-407', '8903339668138', 'Where marble begins to soften.
The Vestige Series layers elongated subway forms and sculpted square compositions to create walls rich in rhythm, texture, and quiet movement. Softened edges and weathered detailing catch light gently across the surface, bringing warmth and depth into the space. Expressive yet refined, Vestige transforms classic marble into a more atmospheric, tactile, and contemporary kind of luxury.', 0, 0, 100,
  'subway', 'Subway Tiles', 'coll-subway', 'Subway Collection', '55mm x 220mm', '',
  'Matt', '', 'Porcelain', 'European Tiles, Spanish Tiles', 'White', 'Wall & Floor', '', '',
  '["/uploads/products/Vestige-Brescia-AMB-2.webp","/uploads/products/Vestige-Arabescato-55x220.webp","/uploads/products/Vestige-Brescia-55x220.webp","/uploads/products/Vestige-Sagano-55x220.webp","/uploads/products/Vestige-Square-Arabescato-110x110.webp","/uploads/products/Vestige-Square-Brescia-110x110.webp","/uploads/products/Vestige-Square-Sagano.webp","/uploads/products/Vestige-Arabescato-AMB-3.webp","/uploads/products/Vestige-Arabescato-AMB-2.webp","/uploads/products/Vestige-Arabescato-AMB-4.webp","/uploads/products/Vestige-Brescia-AMB-1.webp","/uploads/products/Vestige-Brescia-AMB-3.webp","/uploads/products/Vestige-Brescia-AMB-6.webp","/uploads/products/Vestige-Sagano-AMB-2.webp","/uploads/products/Vestige-Sagano-AMB-3.webp","/uploads/products/Vestige-Sagano-AMB-5.webp"]', '{}', '["marble"]', '[]',
  '["White","Red","Green"]', '{"White":"#e8e3e0","Red":"#d9beb6","Green":"#b1c0b5"}',
  1, 0, 0, 0, 'Vestige Series | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', 'Vestige Series, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1792742624949-4b2428', 'TMX-SKU-TMX-809', 'venezia-series', 'Venezia Series', 'TMX-809', '8904191699837', 'Where heritage meets modularity. The Venezia Series channels the soul of antique Italian stone through tumbled edges and soft, modular shapes. Instead of a rigid grid, the layout feels organic and established, as if the floor has always been there.
It adds a layer of quiet, lived-in luxury that grounds the entire room with a sense of history.', 0, 0, 100,
  'modular', 'Modular Tiles', 'coll-modular', 'Modular Collection', '400mm x 400mm', '',
  'Matt, Rustic', '', 'Anti Skid Tiles, Porcelain Tiles', 'Spanish Collection', 'White', 'Wall & Floor', '', '',
  '["/uploads/products/Venezia-Black-Gold-Mod-3-AMB-1.webp","/uploads/products/Venezia-Macchia-Antica-Mod-3.webp","/uploads/products/Venezia-Black-Gold-Mod-3.webp","/uploads/products/Venezia-Black-Gold-Mod-3-AMB-2.webp","/uploads/products/LaFabbrica_AVA_Venezia_Macchia-Antica_Bagno-AMB.webp"]', '{}', '["marble"]', '[]',
  '["White","Black"]', '{"White":"#ece8e0","Black":"#555756"}',
  1, 0, 0, 0, 'Venezia Series | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', 'Venezia Series, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1792487542681-5b4385', 'TMX-SKU-TMX-749', 'picket-series', 'Picket Series', 'TMX-749', '8905084472788', '', 0, 0, 100,
  'subway', 'Subway Tiles', 'coll-subway', 'Subway Collection', '60mm x 260mm', '',
  'Glossy', '', 'Porcelain', 'European Tiles, Spanish Tiles', 'White', 'Wall & Floor', '', '',
  '["/uploads/products/Picket-Modern-Rose-Quartz-AMB_result.webp","/uploads/products/Picket-Modern-Coconut-Milk-60-x-260-MM.webp","/uploads/products/Picket-Modern-Obsidian-60-x-260-MM.webp","/uploads/products/Picket-Modern-Rose-Quartz-60-x-260-Mm.webp","/uploads/products/Picket-Modern-Forest-60-x-260-MM.webp","/uploads/products/Picket-Modern-Obsidian-AMB-3_result.webp","/uploads/products/Picket-Modern-Obsidian-AMB-2_result.webp","/uploads/products/Picket-Modern-Obsidian-AMB-1_result.webp","/uploads/products/Picket-Modern-Coconut-Milk-AMB_result.webp"]', '{}', '[]', '[]',
  '["White","Black","Pink","Green"]', '{"White":"#ece8e0","Black":"#555756","Pink":"#dab09e","Green":"#74766a"}',
  1, 0, 0, 0, 'Phuket Series | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', 'Phuket Series, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1792487288188-dcf989', 'TMX-SKU-TMX-571', 'phuket-series', 'Phuket Series', 'TMX-571', '8909148822072', '', 0, 0, 100,
  'mosaic', 'Mosaic Tiles', 'coll-mosaic', 'Mosaic Collection', '333mm x 333mm', '',
  'Glossy, Textured', '', 'Porcelain Tiles, Anti Skid Tiles', 'European Tiles', 'Blue', 'Floor', '', '',
  '["/uploads/products/AMB.-PHUKET-COBALTO_result.webp","/uploads/products/Phuket-Cobalto-333x333.webp","/uploads/products/Phuket-Verde-333x333.webp","/uploads/products/AMB.-PHUKET-VERDE_result.webp","/uploads/products/PUNCKET-VERDE-AMB.-GRANDE_result.webp"]', '{}', '[]', '[]',
  '["Blue","Green"]', '{"Blue":"#0b4486","Green":"#66787d"}',
  1, 0, 0, 0, 'Phuket Series | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', 'Phuket Series, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1792484236188-215f95', 'TMX-SKU-TMX-913', 'pencil', 'Pencil', 'TMX-913', '8905157525204', 'Where shapes become ART and floors transform into CANVASES.', 0, 0, 100,
  'octagonal', 'Octagonal Tiles', 'coll-stone', 'Stone Collection', '350mm x 350mm', '',
  'Shiny', '', 'Ceramic Wall Tile', 'Imported', 'White', 'Wall', '', '',
  '["/uploads/products/AMBIENTE_BRICK-PENCIL-RAKU-GREY-35X35.webp","/uploads/products/Pencil-Raku-Pearl-350x350.webp","/uploads/products/Pencil-Raku-Grey-350x350.webp","/uploads/products/Pencil-Raku-Turquoise-350x350.webp","/uploads/products/AMBIENTE_BRICK-PENCIL-RAKU-TURQUOISE-35X35.webp","/uploads/products/20230822_125746.webp"]', '{}', '[]', '[]',
  '["White","Blue"]', '{"White":"#ede6d9","Blue":"#587a81"}',
  0, 0, 0, 0, 'Pencel | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', 'Pencel, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1792483620215-4871f5', 'TMX-SKU-TMX-865', 'ordesa', 'Ordesa', 'TMX-865', '8905665126996', 'The terms for “mountain” in some Berber languages are adrar and adras, which are believed to be cognates of the toponym Atlas', 0, 0, 100,
  'stone', 'Stone Look', 'coll-stone', 'Stone Collection', '250mm x 125mm', '',
  'Matt', '', 'Porcelain', 'European Tiles, Spanish Tiles', 'Black', 'Exterior, Wall & Floor', '', '',
  '["/uploads/products/AMB_ORDESA_MIX_HQ.webp","/uploads/products/Ordesa_Antracita.webp","/uploads/products/Ordesa_Beige.webp","/uploads/products/Ordesa_Blanco.webp","/uploads/products/Ordesa_Crema.webp","/uploads/products/Ordesa_Mix.webp","/uploads/products/AMB_ORDESA_CREMA_HQ.webp","/uploads/products/AMB_ORDESA_BLANCO_HQ.webp","/uploads/products/AMB_ORDESA_BEIGE_HQ.webp","/uploads/products/AMB_ORDESA_ANTRACITA_HQ.webp"]', '{}', '[]', '[]',
  '["Black","Beige","White","Grey"]', '{"Black":"#393f43","Beige":"#e5ceb5","White":"#f5f8f8","Grey":"#b8b7b3"}',
  1, 0, 0, 0, 'Ordesa | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', 'Ordesa, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1792482873660-3101fe', 'TMX-SKU-TMX-119', 'nolita', 'Nolita', 'TMX-119', '8905608177615', 'Discover the Nolita tile series, a symphony of color and gloss designed to elevate any space. From the neutral depths of Gris to the vibrant hues of Burdeos and Rosa, each tile showcases a unique shiny finish adding depth and character, creating gorgeous abstract patterns while interplaying with light.', 0, 0, 100,
  'subway', 'Subway Tiles', 'coll-subway', 'Subway Collection', '65mm X 200mm', '',
  'Glossy', '', 'Porcelain', 'European Tiles, Spanish Tiles', 'Beige', 'Wall & Floor', '', '',
  '["/uploads/products/AMB_Nolita_Marine1.webp","/uploads/products/Nolita-Beige-200-x-65.webp","/uploads/products/Nolita-Blanco-200-x-65.webp","/uploads/products/Nolita-Burdeos-200-x-65.webp","/uploads/products/Nolita-Cielo-200x65.webp","/uploads/products/Nolita-Gris-200-x-65.webp","/uploads/products/Nolita-Negro-200x65.webp","/uploads/products/Nolita-Marine-200-x-65.webp","/uploads/products/Nolita-Rosa-200-x-65.webp","/uploads/products/Nolita-Verde-200-x-65.webp","/uploads/products/Nolita-Amb-19.webp","/uploads/products/Nolita-Amb-16.webp","/uploads/products/AMB_Nolita_Verde_2_400ppp.webp","/uploads/products/Nolita-Amb-14.webp","/uploads/products/AMB_Nolita_Negro_2_400ppp.webp","/uploads/products/AMB_NOLITA_ROSA_LOW.webp","/uploads/products/AMB_Nolita_Negro.webp","/uploads/products/Amb_Nolita_Marine_Jolly.webp","/uploads/products/Amb_Nolita_Cielo_2_400ppp.webp","/uploads/products/AMB_Nolita_Gris.webp","/uploads/products/AMB_NOLITA_BLANCO_HIGH_400ppp.webp","/uploads/products/AMB_Nolita_Burdeos.webp","/uploads/products/311.webp","/uploads/products/AMB_Nolita_Beige.webp","/uploads/products/88.webp","/uploads/products/219.webp"]', '{}', '[]', '[]',
  '["Beige","White","Red","Blue","Grey","Brown","Pink","Green"]', '{"Beige":"#b6a594","White":"#adaaa4","Red":"#b4746c","Blue":"#59636b","Grey":"#898a85","Brown":"#69625a","Pink":"#bea19d","Green":"#627871"}',
  1, 0, 0, 0, 'Nolita | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', 'Nolita, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1792480708237-0bcd56', 'TMX-SKU-TMX-182', 'next-series', 'Next Series', 'TMX-182', '8908765841653', '', 0, 0, 100,
  'texture', 'Texture / 3D', 'coll-texture', 'Texture Collection', '400mm x 1200mm', '',
  'Matt', '', 'Ceramic Wall Tile', 'European Tiles, Spanish Tiles', 'Grey', 'Wall', '', '',
  '["/uploads/products/NEXT_MARFIL_AMB-8.webp","/uploads/products/Next-Gris-400x1200.webp","/uploads/products/Next-Stripes-Gris-400x1200.webp","/uploads/products/Next-Marfil-400x1200.webp","/uploads/products/Next-Stripes-Marfil-400x1200.webp","/uploads/products/NEXT_GRIS_AMB-7.webp","/uploads/products/Good-46.webp"]', '{}', '[]', '[]',
  '["Grey","White"]', '{"Grey":"#8A8D8F","White":"#e5e0d6"}',
  1, 0, 0, 0, 'Next Series | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', 'Next Series, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1792480092944-3113fe', 'TMX-SKU-TMX-773', 'nara-matt', 'Nara (Matt)', 'TMX-773', '8903626574426', 'Elegance meets uniformity in our breathtaking Nara Matt series. Fashioned for your beautiful abode, it makes an excellent pick for your kids’ rooms, kitchens and even bathrooms. Bring it home and add an awe-inspiring air of sophistication to your space.', 0, 0, 100,
  'subway', 'Subway Tiles', 'coll-subway', 'Subway Collection', '75mm X 300mm', '',
  'Matt', '', 'Ceramic Wall Tile', 'European Tiles, Spanish Tiles', 'Blue', 'Wall', '', '',
  '["/uploads/products/AMB_BURDEOS_MATT_75X30_HQ.webp","/uploads/products/Nara-Pacifico-Matt-75-x-300MM.webp","/uploads/products/Nara-Oliva-Matt-75-x-300MM.webp","/uploads/products/Nara-Negro-Matt-75-x-300MM.webp","/uploads/products/Nara-Mostaza-Matt-75-x-300MM.webp","/uploads/products/Nara-Gris-Matt-75-x-300MM.webp","/uploads/products/Nara-Glass-Matt-75-x-300MM.webp","/uploads/products/Nara-Burdeos-Matt-75-x-300MM.webp","/uploads/products/Nara-Blanco-Matt-75-x-300MM.webp","/uploads/products/AMB_NARA_PACIFICO_75X30_HQ.webp","/uploads/products/Nra-2.webp","/uploads/products/AMB_NARA_NEGRO_MATT_75X30_HQ.webp","/uploads/products/AMB_NARA_OLIVA_MATT_75X30_HQ.webp","/uploads/products/AMB_NARA_MOSTAZA_MATT_75X30_HQ.webp","/uploads/products/AMB_NARA_BLANCO_MATT_75X30_HQ.webp","/uploads/products/AMB_glass_nara_glass_hq.webp"]', '{}', '[]', '[]',
  '["Blue","Green","Black","Yellow","Grey","Red","White"]', '{"Blue":"#165364","Green":"#6b6f5d","Black":"#434342","Yellow":"#edbf74","Grey":"#c5c2bb","Red":"#9c5146","White":"#e3e2de"}',
  1, 0, 0, 0, 'Nara (Matt) | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', 'Nara (Matt), tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1792479191821-46c108', 'TMX-SKU-TMX-138', 'musa', 'Musa', 'TMX-138', '8901995947882', 'The Musa Series of ceramic subway tiles brings together a striking blend of vintage charm and modern style. With a classic, rich, and glossy finish, these tiles have a smooth and inviting feel that is also easy to maintain. The collection comes in a curated palette of colours, including vibrant Ocre and Turquesa, along with a timeless Blanco. This range of colours allows for diverse design impacts, from bold and energetic to understated and sophisticated. The Musa series elevates interiors with a luminous, eye-catching quality that beautifully blends industrial grit with refined charm.', 0, 0, 100,
  'subway', 'Subway Tiles', 'coll-subway', 'Subway Collection', '65mm x 200mm', '',
  'Glossy', '', 'Porcelain', 'European Tiles, Spanish Tiles', 'Black', 'Wall & Floor', '', '',
  '["/uploads/products/musa-oliva-Amb.webp","/uploads/products/Musa-Antracita-65-x-200.webp","/uploads/products/Musa-Cielo-65-x-200.webp","/uploads/products/Musa-Ocre-65-x-200.webp","/uploads/products/Musa-Turquesa-65-x-200.webp","/uploads/products/Musa-Blanco-65-x-200.webp","/uploads/products/Musa-Oliva-65-x-200.webp","/uploads/products/musa-turquesa-Amb.webp","/uploads/products/musa-cielo-Amb.webp","/uploads/products/musa-ocre_hq-Amb.webp"]', '{}', '[]', '[]',
  '["Black","Blue","Yellow","Green","White"]', '{"Black":"#484743","Blue":"#808689","Yellow":"#bba56c","Green":"#757252","White":"#c2bbb0"}',
  1, 0, 0, 0, 'Musa | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', 'Musa, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1792478850415-e842e6', 'TMX-SKU-TMX-376', 'moves-series', 'Moves Series', 'TMX-376', '8902135263928', '', 0, 0, 100,
  'texture', 'Texture / 3D', 'coll-texture', 'Texture Collection', '200mm x 400mm', '',
  'Matt', '', 'Ceramic Wall Tile', 'European Tiles, Spanish Tiles', 'Green', 'Wall', '', '',
  '["/uploads/products/moves-taupe-20x40moves-sand-20x40_result.webp","/uploads/products/Moves-Green-200x400-copy.webp","/uploads/products/Moves-Taupe-200x400.webp","/uploads/products/Moves-White-200x400.webp","/uploads/products/WhatsApp-Image-2024-04-02-at-4.14.37-PM_result.webp","/uploads/products/moves-green-20x40_result.webp","/uploads/products/moves-white-20x40moves-sand-20x40niza-clay-_result.webp","/uploads/products/moves-sand-20x40moves-anth_result.webp"]', '{}', '[]', '[]',
  '["Green","Beige","White"]', '{"Green":"#b4bbaf","Beige":"#e3d7ce","White":"#f3f0e6"}',
  1, 0, 0, 0, 'Moves Series | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', 'Moves Series, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1792478188915-ee7a1f', 'TMX-SKU-TMX-163', 'modula-series', 'Modula Series', 'TMX-163', '8904662391747', '', 0, 0, 100,
  'modular', 'Modular Tiles', 'coll-modular', 'Modular Collection', '500mm x 500mm', '',
  'Matt, Rustic', '', 'Anti Skid Tiles, Porcelain Tiles', 'Spanish Collection', 'Beige', 'Wall & Floor', '', '',
  '["/uploads/products/Modula-Portobello-Silver-AMB-6.webp","/uploads/products/Modula-Portobello-Ivory-Mix-Size.webp","/uploads/products/Modula-Portobello-Silver-Mix-Size.webp","/uploads/products/Modula-Abadia-Avena-Mix-Size.webp","/uploads/products/Modula-Cambridge-Bone-Mix-Size.webp","/uploads/products/Modula-Portobello-Silver-AMB-5.webp","/uploads/products/Modula-Portobello-Silver-AMB-4.webp","/uploads/products/Modula-Portobello-Silver-AMB-3.webp","/uploads/products/Modula-Portobello-Silver-AMB-2.webp","/uploads/products/Modula-Portobello-Silver-AMB-1.webp","/uploads/products/Modula-Portobello-Ivory-AMB-3.webp","/uploads/products/Modula-Portobello-Ivory-AMB-1.webp","/uploads/products/Modula-Cambridge-Bone-AMB-2.webp","/uploads/products/Modula-Abadia-Avena-AMB-2.webp","/uploads/products/Modula-Abadia-Avena-AMB-1.webp"]', '{}', '[]', '[]',
  '["Beige","Grey","Cotto","Brown"]', '{"Beige":"#e8dfd0","Grey":"#c0b8b4","Cotto":"#c3beb7","Brown":"#ceaa87"}',
  1, 0, 0, 0, 'Modula Series | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', 'Modula Series, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1792477201003-3ed0ab', 'TMX-SKU-TMX-469', 'match', 'Match', 'TMX-469', '8902800845007', 'Indulge in the timeless allure of the Match tile series, a harmonious fusion of modern design and exquisite gloss.
The Match Series offers diverse options for achieving a cohesive and aesthetically pleasing tile design, catering to a range of styles and preferences, whether through the grandeur of book- matched patterns or the creative possibilities of mixing and matching different tile elements.', 0, 0, 100,
  'subway', 'Subway Tiles', 'coll-subway', 'Subway Collection', '62mm x 250mm', '',
  'Glossy', '', 'Ceramic Wall Tile', 'European Tiles, Spanish Tiles', 'Grey', 'Wall', '', '',
  '["/uploads/products/Match_MIDNIGHT-BLUE-Plain-Curved.webp","/uploads/products/Match-Ash-62x250.webp","/uploads/products/Match-Chalk-62x250.webp","/uploads/products/Match-Dijon-62x250.webp","/uploads/products/Match-Sage-62x250.webp","/uploads/products/Match-Midnightblue-62x250.webp","/uploads/products/Match-Tan-62x250.webp","/uploads/products/Match-TAN-Plain-Curved.webp","/uploads/products/Match-SAGE-Plain-Angled.webp","/uploads/products/Match-MIDNIGHT-BLUE-Angled-Plain.webp","/uploads/products/Match-DIJON-Angled.webp","/uploads/products/Match-Curved_-DIJON-CHALK.webp","/uploads/products/Match-Curved-SAGE-CHALK.webp","/uploads/products/Match-Angled-ASH-TAN.webp","/uploads/products/AMB-MATCH_DIJON_CHALK_BANYO.webp","/uploads/products/AMB-MATCH-ASH.webp"]', '{}', '[]', '[]',
  '["Grey","White","Yellow","Green","Blue","Brown"]', '{"Grey":"#acaaa4","White":"#e3dacd","Yellow":"#b19362","Green":"#7f988c","Blue":"#283f4b","Brown":"#b28874"}',
  1, 0, 0, 0, 'Match  | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', 'Match, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1792476786959-41d3c3', 'TMX-SKU-TMX-550', 'marly-series', 'Marly Series', 'TMX-550', '8903039838938', 'The Marly Series features rectangular matte-finish ceramic tiles that combine classic elegance with everyday durability. Resistant to smudges and easy to clean, they are ideal for homes, cafés, restaurants, and retail spaces.
Now available in French Frame variants, the Marly series is perfect for kitchen backsplashes, bathroom walls, and accent corners in both residential and commercial interiors.', 0, 0, 100,
  'french-frames', 'French Frames', 'coll-french-frames', 'French Frames Collection', '600mm X 1200mm', '',
  'Matt', '', 'Ceramic Wall Tile', 'European Tiles, Spanish Tiles', 'Blue', 'Wall', '', '',
  '["/uploads/products/Mly.webp","/uploads/products/Marly-Blu-Rect-600-x-1200.webp","/uploads/products/Marly-Baroque-Blu-Mix-Rect-600-x-1200.webp","/uploads/products/Marly-Careno-Sera-Rect-600-x-1200.webp","/uploads/products/Marly-Mandorla-Rect-600-x-1200.webp","/uploads/products/Marly-Neve-Rect-600-x-1200.webp","/uploads/products/MARLY-MANDORLA_CARENO-SERA-RECT-_-60-X-120.webp","/uploads/products/BAROQUE-BLUE-MIX-_-MARLY-NEVE-60-X-120.webp","/uploads/products/BAROQUE-BLUE-MIX-_-MARLY-BLU-RECT-60-X-120.webp"]', '{}', '["texture","tropical"]', '[]',
  '["Blue","Green","Black","Beige","White"]', '{"Blue":"#3f5566","Green":"#98a281","Black":"#98a281","Beige":"#D4C4B5","White":"#f5f5f0"}',
  1, 0, 0, 0, 'Marly Series | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', 'Marly Series, Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1792476391042-058b0f', 'TMX-SKU-TMX-728', 'manises', 'Manises', 'TMX-728', '8901265033263', 'Step into timeless elegance with the Manises tile series, boasting exquisite octagonal designs. From rich, earthy browns to striking monochrome blends of white and black, these tiles evoke a sense of refined sophistication. Transform any space into a sanctuary of classic beauty with the Manises collection.', 0, 0, 100,
  'moroccan', 'Moroccan', 'coll-moroccan', 'Moroccan Collection', '580mm x 580mm', '',
  'Matt', '', 'Porcelain', 'European Tiles, Spanish Tiles', 'White', 'Wall & Floor', '', '',
  '["/uploads/products/Ambiente-Betera-Blanco-58x58_result.webp","/uploads/products/Manises-Betera-Blanco-580x580.webp","/uploads/products/Manises-Dcor-Cuero-580x580.webp","/uploads/products/M-2_result.webp","/uploads/products/M-1_result.webp","/uploads/products/20240502_133604_result.webp","/uploads/products/20240502_133511_result.webp","/uploads/products/20240502_133557_result.webp","/uploads/products/20240502_133457_result.webp"]', '{}', '[]', '[]',
  '["White","Brown"]', '{"White":"#dce1eb","Brown":"#b66543"}',
  1, 0, 0, 0, 'Manises | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', 'Manises, Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1792475653349-7367ba', 'TMX-SKU-TMX-312', 'makalu-series', 'Makalu Series', 'TMX-312', '8901451192742', 'Sleek, elongated, and effortlessly stylish-the Makalu Series redefines the classic subway tile with a modern, refined aesthetic. Measuring 50mm x 500mm, these glossy, textured tiles create visually expansive spaces, making them a must-have for 2025’s top design trends. Available in six sophisticated shades: Verde, Blanco, Azul, Beige, Grana, and Coto. Makalu offers endless possibilities for kitchens, bathrooms, and feature walls. Whether stacked, offset, or laid in a herringbone pattern, these long subway tiles bring a luxurious, contemporary edge to any interior.', 0, 0, 100,
  'subway', 'Subway Tiles', 'coll-subway', 'Subway Collection', '50mm X 500mm', '',
  'Glossy', '', 'Porcelain', 'European Tiles, Spanish Tiles', 'Blue', 'Wall & Floor', '', '',
  '["/uploads/products/amb-makalu-salmon_blanco_leva-bg.webp","/uploads/products/Makalu-Azul-50X500.webp","/uploads/products/Makalu-Beige-50X500.webp","/uploads/products/Makalu-Blanco-50X500.webp","/uploads/products/Makalu-Coto-50X500.webp","/uploads/products/Makalu-Grana-50X500.webp","/uploads/products/Makalu-Verde-50X500.webp","/uploads/products/amb-makalu-verde-matt_hq.webp","/uploads/products/amb-makalu-verde_venus-bg.webp","/uploads/products/amb-Makalu-grana_hq.webp","/uploads/products/amb-makalu-blanco_venus-bg_hq.webp","/uploads/products/Amb-Makalu-Beige-5x50_hq.webp"]', '{}', '[]', '[]',
  '["Blue","Beige","White","Brown","Red","Green"]', '{"Blue":"#124250","Beige":"#c5af96","White":"#c6c5bf","Brown":"#b6784d","Red":"#623021","Green":"#67745d"}',
  1, 0, 0, 0, 'Majestic Series | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', 'Majestic Series, Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1792472264851-a4686e', 'TMX-SKU-TMX-419', 'majestic-series', 'Majestic Series', 'TMX-419', '8905946013923', 'The Majestic Series reintroduces the timeless elegance of French Frame Tiles, blending classic European charm with contemporary minimalism. Designed to create structured, framed effects on floors and walls, this collection brings depth, definition, and a refined aesthetic to interiors. With options like bold double-frame patterns for grand visual impact or subtle single-frame designs for understated luxury, Majestic offers versatility for both classic and modern spaces. Its rectified white body tiles feature a soft matte finish with textile inspired textures, adding warmth and sophistication.

Perfect for living rooms, hallways, and feature walls, the Majestic Series allows you to craft interiors that feel both timeless and effortlessly chic.', 0, 0, 100,
  'french-frames', 'French Frames', 'coll-french-frames', 'French Frames Collection', '600mm X 1200mm', '',
  'Matt', '', 'Ceramic Wall Tile', 'European Tiles, Spanish Tiles', 'Beige', 'Wall', '', '',
  '["/uploads/products/Duomo-Verde.webp","/uploads/products/Majestic-Bellagio-Beige-Rect-600mmX1200mm.webp","/uploads/products/Majestic-Bellagio-Verde-Rect-600mmX1200mm.webp","/uploads/products/Majestic-Duomo-Bianco-Rect-600mmX1200mm.webp","/uploads/products/Majestic-Duomo-Verde-Rect-600mmX1200mm.webp","/uploads/products/Majestic-Azzurro-Rect-600mmX1200mm.webp","/uploads/products/Majestic-Corallo-Rect-600mmX1200mm.webp","/uploads/products/Majestic-Verde-Rect-600mmX1200mm.webp","/uploads/products/Majestic-Verde-Rect-Duomo-Bianco-Rect-600x1200.webp","/uploads/products/Duomo-Verde-Rect-Duomo-Verde-Rect-Majestic-Verde-Rect-600x1200.webp","/uploads/products/Duomo-Verde-Rect-Majestic-Verde-Rect-600x1200.webp","/uploads/products/Bellagio-Verde-Rect-Majestic-Azzurro-Rect-600x1200.webp","/uploads/products/Bellagio-Verde-Rect-Duomo-Verde-Rect.webp","/uploads/products/Bellagio-Beige-Rect-Majestic-Verde-Rect-600x1200.webp","/uploads/products/Bellagio-Beige-Rect-Majestic-Corallo-Rect-600x1200.webp"]', '{}', '["texture"]', '[]',
  '["Beige","Green","White","Pink"]', '{"Beige":"#d7cdc0","Green":"#6c7c79","White":"#edebe7","Pink":"#e1d0bf"}',
  1, 0, 0, 0, 'Majestic Series | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', 'Majestic Series, Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1792413081668-ee740e', 'TMX-SKU-TMX-398', 'lumina-series', 'Lumina Series', 'TMX-398', '8906014558496', 'Where light sculpts the wall.
The Lumina Series uses glossy surfaces and delicate linear reliefs to create movement across the wall.
As light shifts through the space, the tiles catch reflections and soft shadows, making interiors feel brighter, taller, and more refined. Their elongated rhythm adds a clean architectural flow that works beautifully in bathrooms, kitchens, and feature walls. Quietly luxurious, Lumina turns the wall into a luminous presence.', 0, 0, 100,
  'subway', 'Subway Tiles', 'coll-subway', 'Subway Collection', '60mm x 246mm', '',
  'Glossy', '', 'Ceramic Wall Tile', 'European Tiles, Spanish Tiles', 'Yellow', 'Wall', '', '',
  '["/uploads/products/lumina-6174_result.webp","/uploads/products/Lumina-Agofat-60x246.webp","/uploads/products/Lumina-Rivia-Agofat-60x246.webp","/uploads/products/Lumina-Lichen-60x246.webp","/uploads/products/Lumina-Rivia-Lichen-60x246.webp","/uploads/products/Lumina-Oyster-60x246.webp","/uploads/products/Lumina-Rivia-Oyster-60x246.webp","/uploads/products/Lumina-Roan-Rouge-60x246.webp","/uploads/products/Lumina-Rivia-Roan-Rouge-60x246.webp","/uploads/products/Lumina-White-Alyssum-60x246.webp","/uploads/products/Lumina-Rivia-White-Alyssum-60x246.webp","/uploads/products/Lumina-Acorn-60x246.webp","/uploads/products/Lumina-Rivia-Acorn-60x246.webp","/uploads/products/lumina-6192_result.webp","/uploads/products/lumina-6200_result.webp","/uploads/products/Lumina-White-Alyssum.jpg_result.webp","/uploads/products/LUMINA-ROVAN-ROAGE-RIVIA-ROAGE_result.webp","/uploads/products/Lumina-Oyster.jpg_result.webp","/uploads/products/LUMINA-RICHEN-RIVIA-RICHEN_result.webp","/uploads/products/LUMINA-AGOFAT-RIVIA-AGOFAT_result.webp"]', '{}', '["colorful"]', '[]',
  '["Yellow","Green","Black","Red","White","Brown"]', '{"Yellow":"#cfa883","Green":"#a6a27f","Black":"#5f5b57","Red":"#a16b5d","White":"#e4e2de","Brown":"#755e51"}',
  1, 0, 0, 0, 'Grace O | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', 'Grace O, Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1792411924520-918955', 'TMX-SKU-TMX-987', 'lancaster', 'Lancaster', 'TMX-987', '8901964231257', '', 0, 0, 100,
  'hexagon', 'Hexagon Tiles', 'coll-hexagon', 'Hexagon Collection', '285mm X 330mm', '',
  'Matt', '', 'Porcelain', 'Spanish Tiles, European Tiles', 'Beige', 'Wall & Floor', '', '',
  '["/uploads/products/AMB_LANCASTER-TERRA_COCINA_result.webp","/uploads/products/Lancaster-Jungle-285x330.webp","/uploads/products/Lancaster-Terra-285x330.webp","/uploads/products/Lancaster-Grey-285x330-1.webp","/uploads/products/AMB_LANCASTER-JUNGLE_SALON_result.webp","/uploads/products/AMB_LANCASTER-JUNGLE_BANO_result.webp","/uploads/products/AMB_LANCASTER-GREY_PUBLICO_result.webp","/uploads/products/AMB_LANCASTER-GREY_BANO_result.webp","/uploads/products/20250429_150948_result.webp","/uploads/products/20250429_150943_result.webp","/uploads/products/20250429_150923_result.webp"]', '{}', '[]', '[]',
  '["Beige","Brown","White"]', '{"Beige":"#dec7b3","Brown":"#b88968","White":"#e9e8e6"}',
  1, 0, 0, 0, 'Lancaste | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', 'Lancaste, Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1792410913779-5ef650', 'TMX-SKU-TMX-830', 'kyoto-series', 'Kyoto Series', 'TMX-830', '8901171828316', 'Our Kyoto Series is a handmade extruded product made from natural raw materials. The tiles feature a captivating blend of gorgeous, earthy shades creating a textured, organic look. The finish showcases a beautiful depth with graduated colour variations, reminiscent of natural elements like water and stone. Its elongated, rectangular shape lends a modern touch, making it suitable for a variety of applications—from backsplashes to feature walls. The Kyoto series adds a unique and serene aesthetic, perfect for enhancing any interior space.', 0, 0, 100,
  'boutique', 'Boutique Tiles', 'coll-boutique', 'Boutique Collection', '150mm x 150mm', '',
  'Glossy, Vintage', '', 'Porcelain', 'European Tiles', 'White', 'Wall', '', '',
  '["/uploads/products/KYOTO_SNOW_PALACE.webp","/uploads/products/KYOTO-RIVER-A-150X150MM.webp","/uploads/products/KYOTO-RIVER-B-150X150MM.webp","/uploads/products/KYOTO-NUT-A-150X150MM.webp","/uploads/products/KYOTO-NUT-B-150X150MM.webp","/uploads/products/KYOTO-GARDEN-A-150X150MM.webp","/uploads/products/KYOTO-GARDEN-B-150X150MM.webp","/uploads/products/KYOTO-PALACE-A-150X150MM.webp","/uploads/products/KYOTO-PALACE-B-150X150MM.webp","/uploads/products/AMB_KYOTO_NUT.webp","/uploads/products/AMB_KYOTO_GARDEN.webp","/uploads/products/AMB_KYOTO_PALACE.webp","/uploads/products/AMB_KYOTO_RIVER.webp","/uploads/products/35.webp"]', '{}', '[]', '[]',
  '["White","Brown","Green","Blue"]', '{"White":"#FFFFFF","Brown":"#b3864f","Green":"#646248","Blue":"#284e5a"}',
  1, 0, 0, 0, 'Grace O | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', 'Grace O, Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1792407740865-a70963', 'TMX-SKU-TMX-881', 'irazu', 'Irazu', 'TMX-881', '8909675223584', 'Synonymous with noble opulence, the Irazu collection gives a rich appearance to any surrounding or living space. Nothing can be as appealing as the bright aura of these pieces and spending some quality moments by its side.', 0, 0, 100,
  'stone', 'Stone Look', 'coll-stone', 'Stone Collection', '200mm x 600mm', '',
  'Matt', '', 'Porcelain', 'European Tiles, Spanish Tiles', 'Black', 'Exterior, Wall & Floor', '', '',
  '["/uploads/products/IRAZU_MIX_20x60_AMB-2_result.webp","/uploads/products/Irazu-Gris-600x200.webp","/uploads/products/Irazu-Antracita-600x200.webp","/uploads/products/Irazu-Mix-600x200.webp","/uploads/products/Irazu-Moka-600x200.webp","/uploads/products/Irazu_Gris-Antracita-Amb_result.webp","/uploads/products/Irazu-Moka-Amb_result.webp","/uploads/products/Irazu-Mix-Amb_result.webp","/uploads/products/IMG_0132_result.webp","/uploads/products/60_result.webp","/uploads/products/61_result.webp"]', '{}', '[]', '[]',
  '["Black","Grey","Brown"]', '{"Black":"#453f39","Grey":"#90897e","Brown":"#a59279"}',
  1, 0, 0, 0, 'Irazu | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', 'Irazu, Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1792405332311-6abaa4', 'TMX-SKU-TMX-818', 'iguazu', 'Iguazu', 'TMX-818', '8905916700102', 'Bring home the resplendent Iguazu collection to get complimented for your excellent choice in decor. The nature-inspired patterns of these minimalist pieces further emphasize their loftiness and is sure to complement your grand setup.', 0, 0, 100,
  'stone', 'Stone Look', 'coll-stone', 'Stone Collection', '630mm x 210mm', '',
  'Matt', '', 'Porcelain', 'European Tiles, Spanish Tiles', 'Grey', 'Exterior, Wall & Floor', '', '',
  '["/uploads/products/IGUAZU_SAND_21X63_AMB-1_result.webp","/uploads/products/Iguazu-Charcoal.webp","/uploads/products/Iguazu-Grey.webp","/uploads/products/Iguazu-Sand.webp","/uploads/products/Iguazu-Terra.webp","/uploads/products/Iguazu-Wall-Charcoal.webp","/uploads/products/Iguazu-Wall-Grey.webp","/uploads/products/Iguazu-wall-Sand.webp","/uploads/products/Iguazu-Wall-terra.webp","/uploads/products/IGUAZU_TERRA-63X21-WALL-TERRA_result.webp","/uploads/products/IGUAZU_GREY-21X63-WALL-GREY_result.webp","/uploads/products/IGUAZU_CHARCOAL_21X63_AMB-1_result.webp"]', '{}', '[]', '[]',
  '["Grey","White","Brown","Beige"]', '{"Grey":"#aea69c","White":"#e3d0ba","Brown":"#947d68","Beige":"#dfd1bb"}',
  1, 0, 0, 0, 'Grace O | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', 'Grace O, Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1792404618440-5387ca', 'TMX-SKU-TMX-290', 'hex-corola', 'Hex Corola', 'TMX-290', '8907582421679', 'Our minimalistic floral-inspired Hex Corola collection gives your surroundings an indigenous and dramatic appeal. This minimalist decor tile is reminiscent of the old-world days when florals, white, and blacks were the classic choices. It is exclusively crafted for people who love decorating their walls with an old-world vibe-tiles, artifacts, mementos, and heirlooms.', 0, 0, 100,
  'hexagon', 'Hexagon Tiles', 'coll-hexagon', 'Hexagon Collection', '198mm X 228mm', '',
  'Matt', '', 'Porcelain', 'European Tiles, Spanish Tiles', 'Black', 'Wall & Floor', '', '',
  '["/uploads/products/0078_Iris_HQ_result.webp","/uploads/products/Hex-corola-Black.webp","/uploads/products/Hex-corola-Grey.webp","/uploads/products/Hex-corola-Iris-Grey.webp","/uploads/products/Hex-Corola-Iris-Color.webp","/uploads/products/Hex-Corola-Neo-White.webp","/uploads/products/7_result.webp","/uploads/products/0077_COROLA_HQ_result.webp","/uploads/products/0096_Corola-Grey_rgb_HQ_result.webp","/uploads/products/0110_Neo_HQ_result.webp","/uploads/products/COROLA-BLACK-Y-NEO__result.webp","/uploads/products/Hex.-Corola-Black-240-x-200-O.webp","/uploads/products/Hex.-Corola-Grey-198-x-228.webp","/uploads/products/Hex.-Corola-Iris-Colors-240-x-200-O.webp","/uploads/products/Hex.-Corola-Iris-Grey-240-x-200-O.webp","/uploads/products/Hex.-Corola-Neo-White-O.webp"]', '{}', '[]', '[]',
  '["Black","Grey","Colourful","White"]', '{"Black":"#1E1E1E","Grey":"#8A8D8F","Colourful":"#E07A5F","White":"#FFFFFF"}',
  1, 0, 0, 0, 'Hexagon | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', 'Hexagon, Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1792400683089-94c69c', 'TMX-SKU-TMX-708', 'gm-91-to-94', 'GM 91 To 94', 'TMX-708', '8907918713205', 'The GM 91-94 series elevates mosaic design to new heights of opulence. These tiles exude a sense of premium craftsmanship, with intricate details that reflect precision and artistry. Each piece is a testament to luxury, blending timeless patterns with modern sophistication. Designed for those who appreciate the finer things, this series is ideal for creating show-stopping walls, exclusive feature areas, or elegant backsplashes. And the best part? These tiles can be used on curved surfaces as well!', 0, 0, 100,
  'mosaic', 'Mosaic Tiles', 'coll-mosaic', 'Mosaic Collection', '280mm X 300mm', '',
  'Glossy, Modern', '', 'Designer Tiles, Porcelain Tiles', 'Imported', 'White', 'Wall', '', '',
  '["/uploads/products/amb_GM-91_result.webp","/uploads/products/GM-91-280-X-300-MM-2.webp","/uploads/products/GM-92-280-X-300-MM.webp","/uploads/products/GM-93-280-X-300-MM-1.webp","/uploads/products/GM-94-280-X-300-MM.webp","/uploads/products/14_result.webp","/uploads/products/amb_GM-93_result.webp","/uploads/products/amb_GM-94_result.webp","/uploads/products/GM-91_2_result.webp","/uploads/products/GM-93_5.webp","/uploads/products/GM-92_7_result.webp","/uploads/products/GM-94_1_result.webp","/uploads/products/GM-94_7_result.webp"]', '{}', '[]', '[]',
  '["White","Blue","Black","Brown"]', '{"White":"#d5d9df","Blue":"#848975","Black":"#131410","Brown":"#6e5c4b"}',
  1, 0, 0, 0, 'GM 91 To 94 | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', 'GM 91 To 94, Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1792395265520-c21db6', 'TMX-SKU-TMX-118', 'gm-81-to-84', 'GM 81 To 84', 'TMX-118', '8908931635612', 'The GM 81-84 series is a gorgeous collection of 4 tiles, adorned with patterns that, when came together, transform a room from ordinary to brilliant. A unique blend of lines and curves narrates the story of these tiles, with colours that are the perfect balance between stylish and subtle. Its glossy finish with fine crackle detailing within the glaze is sure to make heads turn.
Turn heads with the GM 81-84 series, perfect to make your space stand out in the most subtle way possible.', 0, 0, 100,
  'mosaic', 'Mosaic Tiles', 'coll-mosaic', 'Mosaic Collection', '305mm X 305mm', '',
  'Glossy, Modern', '', 'Designer Tiles, Porcelain Tiles', 'Imported', 'White', 'Wall', '', '',
  '["/uploads/products/amb_GM-82_3.webp","/uploads/products/GM-81-305-X-305-MM.webp","/uploads/products/GM-82-305-X-305-MM.webp","/uploads/products/GM-83-305-X-305-MM.webp","/uploads/products/GM-84-305-X-305-MM.webp","/uploads/products/Drow_result.webp","/uploads/products/amb_GM-81_result.webp","/uploads/products/amb_GM-83_result.webp","/uploads/products/amb_GM-84.webp","/uploads/products/GM-82_2.webp","/uploads/products/GM-83_1.webp","/uploads/products/GM-84_3_result.webp"]', '{}', '[]', '[]',
  '["White","Blue","Black","Brown"]', '{"White":"#ebebed","Blue":"#3c4854","Black":"#0a0806","Brown":"#857063"}',
  1, 0, 0, 0, 'GM 81 To 84 | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', 'GM 81 To 84, Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1792394239922-4169f5', 'TMX-SKU-TMX-787', 'gm-71-to-73', 'GM 71 To 73', 'TMX-787', '8905398388530', 'The GM 71-73 series redefines mosaic artistry with its striking yet subtle triangular patterns. These tiles embody a perfect balance of geometry and elegance, creating a visual rhythm of neutrals that draws the eye and adds sophistication to any space.', 0, 0, 100,
  'mosaic', 'Mosaic Tiles', 'coll-mosaic', 'Mosaic Collection', '272mm X 320mm', '',
  'Glossy, Vintage, Modern', '', 'Designer Tiles, Porcelain Tiles', 'Imported', 'White', 'Wall & Floor', '', '',
  '["/uploads/products/amb_GM-72_1.webp","/uploads/products/GM-71-272-X-320-MM.webp","/uploads/products/GM-72-272-X-320-MM.webp","/uploads/products/GM-73-272-X-320-MM.webp","/uploads/products/amb_GM-71.webp","/uploads/products/amb_GM-72.webp","/uploads/products/amb_GM-73.webp","/uploads/products/GM-71_1.webp","/uploads/products/GM-72_4.webp","/uploads/products/GM-72_2.webp","/uploads/products/GM-73_1.webp"]', '{}', '[]', '[]',
  '["White","Black","Brown"]', '{"White":"#eef0f2","Black":"#5b595c","Brown":"#907767"}',
  1, 0, 0, 0, 'GM 71 To 73 | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', 'GM 71 To 73, Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1792392177597-aee9ad', 'TMX-SKU-TMX-720', 'gm-61-to-63', 'GM 61 To 63', 'TMX-720', '8904288201750', 'The GM 61-63 series celebrates the art of mosaics with sleek, bold, geometric three-dimensional designs that captivate the senses. The tiles feature a diamond-shaped pattern with raised triangular profiles. Crafted with precision, these mosaic tiles combine geometric symmetry with a luxurious finish. Its glossy finish with fine crackle detailing within the glaze is what makes this series stand out. And that’s not it– these tiles look stunning on curved surfaces as well.', 0, 0, 100,
  'mosaic', 'Mosaic Tiles', 'coll-mosaic', 'Mosaic Collection', '382mm X 300mm', '',
  'Glossy, Vintage, Modern', '', 'Designer Tiles, Porcelain Tiles', 'Imported', 'Green', 'Wall', '', '',
  '["/uploads/products/GM1-2.webp","/uploads/products/GM-61-300-X-382-MM.webp","/uploads/products/GM-62-300-X-382-MM.webp","/uploads/products/amb_GM-61.webp","/uploads/products/amb_GM-62.webp","/uploads/products/amb_GM-63.webp","/uploads/products/GM1-1.webp","/uploads/products/GM-62_2.webp"]', '{}', '[]', '[]',
  '["Green","Blue","Brown"]', '{"Green":"#9ea597","Blue":"#556272","Brown":"#857685"}',
  1, 0, 0, 0, 'GM 61 To 63 | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', 'GM 61 To 63, Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1792049623616-86cd7f', 'TMX-SKU-TMX-410', 'gm-51-to-56-solid-metal', 'GM 51 To 56 Solid Metal', 'TMX-410', '8901703209552', 'The GM 51-56 series is where sharp geometry and shimmering metal collide to create a stunning visual symphony. Featuring bold triangular, hexagonal, and arrow-shaped designs in radiant copper and gold tones, this collection redefines modern luxury. The metallic sheen of these tiles captures light beautifully, adding depth and sophistication to shower walls & indoor walls.
These tiles come on a fiber mesh which are easy to install. In fact, the herringbone design tile does not even need grouting. It can be laid as it is!

They can be used on both flat and curved surfaces, making them ideal for feature walls or unique spaces.', 0, 0, 100,
  'mosaic', 'Mosaic Tiles', 'coll-mosaic', 'Mosaic Collection', '300mm X 303mm', '',
  'Matt, Metallic', '', 'Designer Tiles', 'Imported', 'Gold', 'Wall', '', '',
  '["/uploads/products/GM-54-Triangle-Copper-1.webp","/uploads/products/GM-51-HEXAGON-GOLD-300X303MM-1.webp","/uploads/products/GM-52-HEXAGON-COPPER-300X303MM.webp","/uploads/products/GM-53-TRIANGLE-GOLD-292x302MM.webp","/uploads/products/GM-54-TRIANGLE-COPPER-292x302MM.webp","/uploads/products/GM-55-ARROW-GOLD-284X296MM.webp","/uploads/products/GM-56-ARROW-COPPER-284X296MM.webp","/uploads/products/GM-51-Hexagon-Gold-1.webp","/uploads/products/GM-51-Hexagon-Gold-2.webp","/uploads/products/GM-52-Hexagon-Copper-1.webp","/uploads/products/GM-53-Triangle-Gold-1.webp","/uploads/products/GM-55-Arrow-Gold-1.webp","/uploads/products/GM-56-Arrow-Copper-2.webp"]', '{}', '[]', '[]',
  '["Gold","Copper"]', '{"Gold":"#D4AF37","Copper":"#B87333"}',
  1, 0, 0, 0, 'GM 51 To 56 Solid Metal | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', 'GM 51 To 56 Solid Metal, Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1792048598957-39dc78', 'TMX-SKU-TMX-523', 'gm-31-35-series', 'GM 31–35 Series', 'TMX-523', '8907141835020', 'Where pattern becomes craft. The GM 31–35 series arranges slim hexagonal glass pieces on a mesh, creating a balanced, continuous rhythm across the surface. Select gold accents introduce a focused highlight that adds quiet refinement.

The compact mosaic scale brings subtle texture and depth, giving any space a more layered, intimate feel without overwhelming it.', 0, 0, 100,
  'mosaic', 'Mosaic Tiles', 'coll-mosaic', 'Mosaic Collection', '295mm X 298mm', '',
  'Glossy, Modern', '', 'Designer Tiles', 'Imported', 'White', 'Wall', '', '',
  '["/uploads/products/GM-32-1.webp","/uploads/products/GM-31-Pearl-White.webp","/uploads/products/GM-32-Black.webp","/uploads/products/GM-33-Pink.webp","/uploads/products/GM-34-Green.webp","/uploads/products/GM-35-Blue.webp","/uploads/products/GM-31-1.webp","/uploads/products/GM-34-1.webp","/uploads/products/GM-33-1.webp","/uploads/products/GM-35-2.webp"]', '{}', '[]', '[]',
  '["White","Black","Beige","Green","Blue"]', '{"White":"#c6c9c3","Black":"#353d38","Beige":"#b2a69c","Green":"#6d7b48","Blue":"#324d54"}',
  1, 0, 0, 0, 'GM 31–35 Series  | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', 'GM 31–35 Series, Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1791806569577-5adecd', 'TMX-SKU-TMX-288', 'pigmenta-series', 'Pigmenta Series', 'TMX-288', '8907125830479', 'Where texture becomes atmosphere.
Most walls simply divide a space. The Pigmenta Series dictates its rhythm. Forged to manipulate the feeling of a space, its elongated forms stretch proportions, introducing a slow, hypnotic depth. These tactile surfaces catch the light, bend it, and wrap the interior in a heavy, atmospheric softness. Unapologetic, luxurious and aware of its presence, the Pigmenta Series doesn’t sit in a space. It breathes life into it.', 0, 0, 100,
  'texture', 'Texture / 3D', 'coll-texture', 'Texture Collection', '400mm x 1200m', '9 mm',
  'Matt', '', 'Ceramic Wall Tile', 'European Tiles, Spanish Tiles', 'Brown', 'Wall', 'Straight Grid', '',
  '["/uploads/products/Pigmenta-Materia-Beige-Pigmenta-Verde-400x1200-AM.webp","/uploads/products/Pigmenta-Ambar-400x1200.webp","/uploads/products/Pigmenta-Materia-Beige-400x1200.webp","/uploads/products/Pigmenta-Verde-400x1200.webp","/uploads/products/Pigmenta-Verde-400x1200-AM.webp","/uploads/products/Pigmenta-Materia-Beige-Pigmenta-Ambar-400x1200-AM.webp","/uploads/products/Pigmenta-Ambar-400x1200-AM.webp","/uploads/products/Pig.webp","/uploads/products/AM_T48_PIGMENTA_AZUL_40X120_DET_HD.webp"]', '{}', '[]', '[]',
  '["Brown","Beige","Green"]', '{"Brown":"#CBB5A0","Beige":"#DED8CE","Green":"#9E9D91"}',
  1, 0, 0, 0, 'Pigmenta Series | Timex Ceramic', 'Earthy forms & expressive surfaces
For distinctive architectural compositions.', 'Pigmenta Series, Brick Look, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1791806195664-53fc11', 'TMX-SKU-TMX-369', 'nazca-series', 'Nazca Series', 'TMX-369', NULL, 'Where nature settles into architecture.
The Nazca Series brings the raw beauty of natural stone into a softer, more refined rhythm. Its irregular forms and earthy textures create surfaces that feel grounded, sun warmed, and effortlessly connected to the outdoors. Whether flowing through an open patio or wrapping around a quiet fireplace, Nazca adds depth, movement, and a sense of timeless permanence to the space.', 0, 0, 100,
  'stone', 'Stone Look', 'coll-stone', 'Stone Collection', '285mm x 330mm', '9 mm',
  'Matt', '', 'Porcelain', 'European Tiles, Spanish Tiles', 'Beige', 'Exterior, Wall & Floor', 'Straight Grid', '',
  '["/uploads/products/Nazca-Beige-285-x-330.webp","/uploads/products/Nazca-Earth-285x330.webp","/uploads/products/Nazca-Grey-285x330.webp"]', '{}', '[]', '[]',
  '["Beige","Brown","Grey"]', '{"Beige":"#dfd5cf","Brown":"#9c8e77","Grey":"#bcb9b3"}',
  1, 0, 0, 0, 'Nazca Series | Timex Ceramic', 'Earthy forms & expressive surfaces
For distinctive architectural compositions.', 'Nazca Series, Brick Look, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1791648090310-d8187a', 'TMX-SKU-TMX-649', 'gm-21-25', 'GM 21-25', 'TMX-649', '8908901105614', 'Breaking away from the rigid patterns of traditional mosaics, the GM 21-25 Series introduces an organic, hand-cut aesthetic that adds depth, texture, and a bespoke feel to any space. Unlike uniform square mosaics, these tiles feature an irregular, interlocking design that enhances their artisanal appeal while offering easier installation and a more seamless finish with fewer visible grout lines. Their flexibility makes them perfect for both flat and curved surfaces, allowing for effortless application on columns, rounded walls, and intricate design areas.
Whether creating a striking backsplash, an elegant feature wall, or a luxurious flooring accent, the GM 21-25 Series blends classic craftsmanship with modern versatility.', 0, 0, 100,
  'mosaic', 'Mosaic Tiles', 'coll-mosaic', 'Mosaic Collection', '276mm X 302mm', '',
  'Glossy, Modern', '', 'Designer Tiles', 'Imported', 'White', 'Wall', '', '',
  '["/uploads/products/GM-25_AMB.webp","/uploads/products/GM-21-276X302.webp","/uploads/products/GM-22-276X302.webp","/uploads/products/GM-23-276X302.webp","/uploads/products/GM-24-276X302.webp","/uploads/products/GM-25-276X302.webp","/uploads/products/GM-2222222-1.webp","/uploads/products/GM-2222222-2.webp","/uploads/products/GM-21.webp","/uploads/products/GM-22_AMB.webp","/uploads/products/GM-23AMB_1.webp","/uploads/products/GM-24_AMB.webp"]', '{}', '[]', '[]',
  '["White","Grey","Blue","Pink","Green"]', '{"White":"#c8c8c8","Grey":"#b3b1ad","Blue":"#55777b","Pink":"#aa8986","Green":"#878965"}',
  1, 0, 0, 0, 'GM 21-25  | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', 'GM 21-25, Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1791647600006-c63298', 'TMX-SKU-TMX-907', 'gm-11-15', 'GM 11-15', 'TMX-907', '8905688029367', '', 0, 0, 100,
  'mosaic', 'Mosaic Tiles', 'coll-mosaic', 'Mosaic Collection', '303mm x 301mm', '',
  'Glossy, Modern', '', 'Designer Tiles', 'Imported', 'White', 'Wall', '', '',
  '["/uploads/products/GM-15-Green_2.webp","/uploads/products/GM-11-Pearl-White.webp","/uploads/products/GM-12-Blue.webp","/uploads/products/GM-13-Grey.webp","/uploads/products/GM-14-Red.webp","/uploads/products/GM-15-Green.webp","/uploads/products/A-4.webp","/uploads/products/GM-14-Red_1.webp","/uploads/products/GM-11-Pearl-White_1.webp","/uploads/products/GM-11-Pearl-White_3.webp","/uploads/products/GM-12-Blue_1.webp","/uploads/products/GM-12-Blue_2.webp","/uploads/products/GM-13-Grey_1.webp","/uploads/products/GM-15-Green_1.webp"]', '{}', '[]', '[]',
  '["White","Blue","Grey","Red","Green"]', '{"White":"#d0d1cb","Blue":"#295baf","Grey":"#3f4654","Red":"#7a0322","Green":"#43593d"}',
  1, 0, 0, 0, 'GM 11-15  | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', 'GM 11-15, Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1791645954447-dff793', 'TMX-SKU-TMX-972', 'gm-01-05', 'GM 01-05', 'TMX-972', '8907497534763', 'The GM 01-05 Hot Rock Diamond Series brings a sculptural brilliance to wall surfaces with its unique faceted diamond shape and lustrous glass finish. Each tile captures and reflects light from every angle, creating a shimmering, jewel-like effect in tones ranging from pearl white and ocean blue to emerald green and volcanic red.
The surface feels dynamic, energetic, and multi-dimensional – ideal for spaces that embrace glamour, artistry, and architectural drama. Whether used in full compositions or as accents, this series turns walls into radiant, light-catching statements.', 0, 0, 100,
  'mosaic', 'Mosaic Tiles', 'coll-mosaic', 'Mosaic Collection', '312mm x 249mm', '',
  'Glossy, Modern', '', 'Designer Tiles', 'Imported', 'White', 'Wall', '', '',
  '["/uploads/products/GM-02-Blue_3.webp","/uploads/products/GM-01-Pearl-White.webp","/uploads/products/GM-02-Blue.webp","/uploads/products/GM-03-Grey.webp","/uploads/products/GM-04-Red.webp","/uploads/products/GM-05-Green.webp","/uploads/products/GM-01-Pearl-White_3.webp","/uploads/products/GM-01-Pearl-White_1.webp","/uploads/products/GM-02-Blue_1.webp","/uploads/products/GM-03-Grey_1.webp","/uploads/products/GM-03-Grey_3.webp","/uploads/products/GM-04-Red_1.webp","/uploads/products/GM-04-Red_2.webp","/uploads/products/GM-05-Green_1.webp","/uploads/products/GM-05-Green_2.webp","/uploads/products/GM-05-Green_3.webp"]', '{}', '[]', '[]',
  '["White","Blue","Grey","Red","Green"]', '{"White":"#dedfda","Blue":"#48609a","Grey":"#727377","Red":"#6d1e0f","Green":"#6e8f87"}',
  1, 0, 0, 0, 'GM 01-05 | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', 'GM 01-05, Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1791645321767-7533d8', 'TMX-SKU-TMX-158', 'glow-series', 'Glow Series', 'TMX-158', '8902357809069', 'The Glow series is a versatile collection of tiles designed to elevate your space. With sleek Glow tiles and artistic Glow Décor options, it provides a canvas for your unique vision. Whether you want a cozy, luxurious, modern, neutral, or elegant feel, Glow has the perfect tiles to bring your vision to life, making your space truly exceptional', 0, 0, 100,
  'boutique', 'Boutique Tiles', 'coll-boutique', 'Boutique Collection', '52mm x 160mm', '',
  'Glossy', '', 'Ceramic Wall Tile', 'European Tiles', 'Brown', 'Wall', '', '',
  '["/uploads/products/GLOW-AMB_-CARAMEL-DECO.webp","/uploads/products/Glow-Dcor-Caramel.webp","/uploads/products/Glow-Caramel-Brown.webp","/uploads/products/Glow-Dcor-Midnight-Blue.webp","/uploads/products/Glow-Dcor-Mint-Green.webp","/uploads/products/Glow-Dcor-Taupe.webp","/uploads/products/Glow-Midnight-Blue.webp","/uploads/products/Glow-Mint-Green.webp","/uploads/products/Glow-Salt.webp","/uploads/products/Glow-Taupe.webp","/uploads/products/Glow-Dcor-Salt.webp","/uploads/products/GLOW-AMB_-CARAMEL-SALT-WITH-DECO-SALT.webp","/uploads/products/GLOW-AMB_MIDNIGHT-BLUE-DECO_1.webp","/uploads/products/GLOW-AMB_MIDNIGHT-BLUE-DECO_2.webp","/uploads/products/GLOW-AMB_MINT-DECOR_1.webp","/uploads/products/GLOW-AMB_MINT-DECOR_2.webp","/uploads/products/GLOW-AMB_MIXCARAMEL-MID-BLUE-MINT-WITH-DECOR.webp","/uploads/products/GLOW-AMB_SALT-DECOR_1.webp","/uploads/products/GLOW-AMB_TAUPE-DECOR_.webp","/uploads/products/GLOW-AMB_TAUPE-DECO.webp"]', '{}', '[]', '[]',
  '["Brown","Blue","Green","Beige","White"]', '{"Brown":"#af8360","Blue":"#103d40","Green":"#94aa91","Beige":"#ccc1b2","White":"#FFFFFF"}',
  1, 0, 0, 0, 'Glow Series  | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', 'Glow Series, Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1791644598466-4fb70e', 'TMX-SKU-TMX-494', 'genuine', 'Genuine', 'TMX-494', '8907602432026', 'Discover the Genuine tile series, a symphony of color and texture designed to elevate any space. From the radiant depths of amber to the lush hues of emerald and garnet, each tile showcases a unique grainy effect, adding depth and character.
Explore the Genuine Capella variants, where the addition of elongated oval shapes adds a touch of modern elegance to this timeless subway collection.', 0, 0, 100,
  'subway', 'Subway Tiles', 'coll-subway', 'Subway Collection', '65mm x 200mm', '',
  'Glossy', '', 'Ceramic Wall Tile', 'European Tiles, Spanish Tiles', 'White', 'Wall', '', '',
  '["/uploads/products/CAPELLA_AMB-AMBER_GARNET_ZAFIRE_.webp","/uploads/products/Genuine-Diamond-65x200.webp","/uploads/products/Genuine-Amber-65x200.webp","/uploads/products/Genuine-Emerald-65x200.webp","/uploads/products/Genuine-Zafire-65x200.webp","/uploads/products/Genuine-Garnet-65x200.webp","/uploads/products/Genuine-Capella-Diamond-65x200.webp","/uploads/products/Genuine-Capella-Amber-65x200.webp","/uploads/products/Genuine-Capella-Emerald-65x200.webp","/uploads/products/Genuine-Capella-Zafire-65x200.webp","/uploads/products/Genuine-Capella-Garnet-65x200.webp","/uploads/products/CAPELLA_AMBER_AMB-1.webp","/uploads/products/CAPELLA_EMERALD_AMB_.webp","/uploads/products/CAPELLA_GARNET_AMB-2.webp","/uploads/products/GENUINE_AMBER_AMB_.webp","/uploads/products/GENUINE_CAPELLA_DIAMOND_AMB_.webp","/uploads/products/GENUINE_CAPELLA_GARNET_MODIFIED-AMB.webp","/uploads/products/GENUINE_CAPELLA_ZAFIRE_AMB.webp","/uploads/products/GENUINE_EMERALD_AMB_3.webp","/uploads/products/GENUINE_ZAFIRE_AMB-2.webp"]', '{}', '[]', '[]',
  '["White","Yellow","Green","Blue","Red"]', '{"White":"#f0efe9","Yellow":"#bb7618","Green":"#0f280d","Blue":"#02282f","Red":"#5d1904"}',
  1, 0, 0, 0, 'Country Series  | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', 'Country Series, Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1791627299195-ab247c', 'TMX-SKU-TMX-202', 'flagstone', 'Flagstone', 'TMX-202', '8904798951170', 'Phenomenal yet minimalist design, the nature-inspired Flagstone collection will lend your space a dash of vintage. Bring it home to let your artistic intrigue run wild and mix and match it with other decor articles to boost the panache of your exterior settings.', 0, 0, 100,
  'stone', 'Stone Look', 'coll-stone', 'Stone Collection', '664mm X 442mm', '',
  'Matt', '', 'Porcelain', 'European Tiles, Spanish Tiles', 'White', 'Exterior, Wall & Floor', '', '',
  '["/uploads/products/Borgogna-White-Stone-Work.webp","/uploads/products/Flagstone-Borgogna-White-copy.webp","/uploads/products/Flagstone-Canyon.webp","/uploads/products/Flagstone-Esla.webp","/uploads/products/Flagstone-Filita.webp","/uploads/products/Flagstone-Indian-Slate.webp","/uploads/products/Flagstone-Borgogna-White.1.webp","/uploads/products/Flagstone-Canyon.1.webp","/uploads/products/Flagstone-Esla.1.webp","/uploads/products/Flagstone-Indian-Slate.1.webp","/uploads/products/Flagstone-Indian-Slate.2.webp"]', '{}', '[]', '[]',
  '["White","Brown","Grey"]', '{"White":"#d4d0ca","Brown":"#b49e8f","Grey":"#716b69"}',
  1, 0, 0, 0, 'Flagstone  | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', 'Flagstone, Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1791626787729-937d64', 'TMX-SKU-TMX-146', 'fables-series', 'Fables Series', 'TMX-146', '8907604090786', 'Fables Series evokes the grandeur of French Boiserie, reimagined through cutting-edge digital craftsmanship. Delicate ornamental details unfold across ceramic surfaces like carved panels, catching light in soft relief.
Classical elegance meets modern refinement, transforming walls into timeless architectural statements of depth, rhythm, and quiet sophistication.', 0, 0, 100,
  'french-frames', 'French Frames', 'coll-french-frames', 'French Frames Collection', '300mm X 900mm', '',
  'Matt', '', 'European Tiles', 'Imported', 'Beige', 'Wall', '', '',
  '["/uploads/products/Fables-Plinth-Blue-Mate-Fables-Blois-Beige-300-x-900.webp","/uploads/products/Fables-Boiserie-Blanco-Mate-300-x-900.webp","/uploads/products/Fables-Blois-Beige-300-x-900.webp","/uploads/products/Fables-Boiserie-Bordeaux-Mate-300-x-900.webp","/uploads/products/Fables-Dama-Night-300-x-900.webp","/uploads/products/Fables-Grace-Green-Mix-300-x-900.webp","/uploads/products/Fables-Lilium-Beige-300-x-900.webp","/uploads/products/Fables-Plinth-Blue-Mate-300-x-900.webp","/uploads/products/Fables-Plinth-Green-Mate-300-x-900.webp","/uploads/products/Moldura-Blanco-Mate-50-x-300-MM.webp","/uploads/products/Moldura-Bordeaux-Mate-50-x-300-MM.webp","/uploads/products/Moldura-Plinth-Blue-Mate-50-x-300-MM.webp","/uploads/products/Moldura-Plinth-Green-Mate-50-x-300-MM.webp","/uploads/products/Fables-1.webp","/uploads/products/AMB_1-FABLES_BOISERIE_BLANCO_GRACE_GREEN-MIX.webp","/uploads/products/Fables-Boiserie-Blanco-Mate-Fables-Blois-Beige-AMB-300-x-900.webp","/uploads/products/Fables-Boiserie-Blanco-Mate-Fables-Blois-Beige-300-x-900.webp","/uploads/products/Fables-Boiserie-Blanco-Mate-Fables-Dama-Night-300-x-900.webp","/uploads/products/Fables-Boiserie-Blanco-Mate-Fables-Grace-Green-Mix-300-x-900.webp","/uploads/products/Fables-Boiserie-Bordeaux-Mate-Fables-Lilium-Beige-300-x-900.webp","/uploads/products/Fables-Boiserie-Bordeaux-Mate.webp","/uploads/products/Fables-Grace-Green-Mix-300-x-900-AMB.webp","/uploads/products/Fables-Plinth-Green-Mate-3.webp","/uploads/products/Fables-Plinth-Blue-Mate-Fables-Dama-Night-300-x-900.webp","/uploads/products/Fables-Plinth-Green-Mate-Fables-Blois-Beige-300-x-900.webp","/uploads/products/Fables-Plinth-Green-Mate-Fables-Grace-Green-Mix-300-x-900.webp","/uploads/products/Fables-Plinth-Green-Mate-300-x-900-AMB.webp"]', '{}', '["tropical"]', '[]',
  '["Beige","Blue","Green","Red","White"]', '{"Beige":"#D4C4B5","Blue":"#3E6B99","Green":"#4D7C59","Red":"#B83B3B","White":"#FFFFFF"}',
  1, 0, 0, 0, 'Fables Series  | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', 'Fables Series, Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1791626289621-7dd2a9', 'TMX-SKU-TMX-637', 'etna-series', 'Etna-series', 'TMX-637', '8903055944747', 'A Traditional shape with special surface which is characterized by variation in irregular glazing and colours. These tiles will give Perfect transition from dimension to flat surfaces to be placed vertical or horizontally to your choice. This ETNA Series is An interesting combination of seven colours creating a marvellous design element for the walls.', 0, 0, 100,
  'colorful', 'Colorful Tiles', 'coll-colorful', 'Colorful Collection', '150mm X 300mm', '',
  'Glossy', '', 'Ceramic Wall Tile', 'European Tiles, Spanish Tiles', 'White', 'Wall', '', '',
  '["/uploads/products/Amb-ETNA-Blue.webp","/uploads/products/Etna-blanco-150x300.webp","/uploads/products/Etna-blue-150x300.webp","/uploads/products/Etna-Grey-150x300.webp","/uploads/products/Etna-nero-150x300.webp","/uploads/products/Etna-Ocre-150x300.webp","/uploads/products/Etna-verde-150x300.webp","/uploads/products/Etna-Viola-150x300.webp","/uploads/products/Amb-Etna-blanco_1.webp","/uploads/products/Amb-Etna-blanco_2.webp","/uploads/products/Amb-ETNA-Blue-15x30-bao_previo.webp","/uploads/products/AMB-Etna-grey_1.webp","/uploads/products/AMB-Etna-grey_2.webp","/uploads/products/AMB-Etna-Nero_1.webp","/uploads/products/AMB-Etna-Nero_2.webp","/uploads/products/AMB-Etna-Verde_1.webp","/uploads/products/AMB-Etna-Verde_2.webp"]', '{}', '[]', '[]',
  '["White","Blue","Grey","Black","Yellow","Green","Red"]', '{"White":"#f1ebde","Blue":"#283943","Grey":"#c0bbb5","Black":"#585551","Yellow":"#d68635","Green":"#6e7653","Red":"#8d4e50"}',
  1, 0, 0, 0, 'Etna  | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', 'Etna, Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1791625849716-f76c5c', 'TMX-SKU-TMX-521', 'elegance-series', 'Elegance Series', 'TMX-521', '8906166617978', '', 0, 0, 100,
  'moroccan', 'Moroccan Tiles', 'coll-moroccan', 'Moroccan Collection', '200mm x 200mm', '',
  'Matt', '', 'Porcelain Tiles, Anti Skid Tiles', 'European Tiles, Spanish Tiles', 'Beige', 'Wall & Floor', '', '',
  '["/uploads/products/Elegance-Deco-Brown-AMB.webp","/uploads/products/Elegance-Cream-200-x-200-mm.webp","/uploads/products/Elegance-Blu-Green-200-x-200-mm.webp","/uploads/products/Elegance-Brown-200-x-200-mm.webp","/uploads/products/Elegance-Deco-Cream-200-x-200-mm.webp","/uploads/products/Elegance-Deco-Blu-Green-200-x-200-mm.webp","/uploads/products/Elegance-Deco-Brown-200-x-200-mm.webp","/uploads/products/Elegance-Deco-Blu-Green-AMB.webp","/uploads/products/Elegance-Deco-Cream-AMB.webp"]', '{}', '[]', '[]',
  '["Beige","Brown","Cotto","Blue"]', '{"Beige":"#e7dacc","Brown":"#b18a6f","Cotto":"#b18a6f","Blue":"#8f9f95"}',
  1, 0, 0, 0, 'Elegance Series  | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', 'Elegance Series, Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1791625069230-94780f', 'TMX-SKU-TMX-292', 'dr', 'DR', 'TMX-292', '8904799474863', 'The DR Series draws inspiration from classic Moroccan tile patterns, combining decorative motifs with a timeless colour palette. Available in deep blues, heritage blacks, soft sage greens, and warm terracotta tones, these tiles balance traditional design with a contemporary finish. Detailed floral medallions, cross-grid layouts, and ornamental patterns create visual interest without overwhelming a space. Designed for kitchens, cafés, courtyards, and entryways, the DR Series works equally well as a feature floor or an accent wall. Rich in pattern yet easy to live with, these tiles bring character, warmth, and a subtle vintage charm to interiors that value design with meaning.', 0, 0, 100,
  'moroccan', 'Moroccan Tiles', 'coll-moroccan', 'Moroccan Collection', '200mm X 200mm', '',
  'Matt', '', 'Porcelain Tiles, Designer Tiles', 'Imported', 'Blue', 'Wall & Floor', '', '',
  '["/uploads/products/449.webp","/uploads/products/DR-03.webp","/uploads/products/DR-04.webp","/uploads/products/DR-05.webp","/uploads/products/DR-06.webp","/uploads/products/DR-09.webp","/uploads/products/DR-12.webp","/uploads/products/DR-18.webp","/uploads/products/DR-19.webp","/uploads/products/DR-20.webp","/uploads/products/DR-33.webp","/uploads/products/DR-38-2.webp","/uploads/products/DR-40-200x200.webp","/uploads/products/DR-41-200x200.webp","/uploads/products/DR-42-200x200.webp","/uploads/products/DR-43-200x200.webp","/uploads/products/DR-44-200x200.webp","/uploads/products/DR-38-1.webp","/uploads/products/217.webp","/uploads/products/DR-Amb-3.webp","/uploads/products/DR-Amb-4.webp","/uploads/products/DR-38.webp","/uploads/products/DR-Amb-5.webp","/uploads/products/A-12.webp","/uploads/products/DR-Amb-6.webp","/uploads/products/DR-Amb-7.webp","/uploads/products/DR-Amb-16.webp","/uploads/products/DR-Amb-17.webp","/uploads/products/DR-03-New-Design.webp","/uploads/products/DR-04-New-design.webp","/uploads/products/DR-04-AMB.webp","/uploads/products/DR-05-AMB.webp","/uploads/products/DR-05-Concept.webp","/uploads/products/DR-06-AMB.webp","/uploads/products/DR-09-Floor-Amb.webp","/uploads/products/DR-12-Amb.webp","/uploads/products/DR-18-1.webp","/uploads/products/DR-18-AMB.webp","/uploads/products/DR-19-AMB.webp","/uploads/products/DR-19-1.webp","/uploads/products/DR-20-AMB.webp","/uploads/products/DR-33-DC2181_AMB_1.webp","/uploads/products/DR-33-DC2181_AMB_2.webp","/uploads/products/DR-33-0184.webp","/uploads/products/DR-33-0185.webp","/uploads/products/DR-33-amb.webp","/uploads/products/DR-40-1.webp","/uploads/products/DR-40-2.webp","/uploads/products/DR-40-3.webp","/uploads/products/DR-41-1.webp","/uploads/products/DR-41-2.webp","/uploads/products/DR-42-1.webp","/uploads/products/DR-42-3.webp","/uploads/products/DR-43-1.webp","/uploads/products/DR-43-3.webp","/uploads/products/DR-44-1.webp","/uploads/products/e9bc1734-0db7-4ed3-b853-e8fae3413243.webp","/uploads/products/Good-7.webp","/uploads/products/Good-57.webp","/uploads/products/MVG-790-lifestyle-image.webp","/uploads/products/MVG549-DR-03-AMBIENCE.webp","/uploads/products/MVG558-DR-09-AMB.webp"]', '{}', '[]', '[]',
  '["Blue","Grey","Beige","White","Black","Green","Colourful","Cotto","Silver"]', '{"Blue":"#7490ab","Grey":"#8A8D8F","Beige":"#D4C4B5","White":"#a2987f","Black":"#9f9ea4","Green":"#577776","Colourful":"#E07A5F","Cotto":"#C26D4D","Silver":"#C0C0C0"}',
  1, 0, 0, 0, 'DR  | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', 'DR, Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1791624677526-413c83', 'TMX-SKU-TMX-277', 'dr-sw-101-102', 'DR & SW -101 and 102', 'TMX-277', '8905977520355', 'Introducing the SW & DR series – a striking fusion of sophistication and uniqueness in metallic tiles. SW 101 and SW 102 exude a contemporary allure, showcasing sleek rectangular designs that captivate with their modern edge. Meanwhile, DR 101 and DR 102 bring a distinct metallic charm, infusing spaces with a touch of square industrial elegance.', 0, 0, 100,
  'subway', 'Subway Tiles', 'coll-subway', 'Subway Collection', '200mm x 200mm', '',
  'Glossy, Modern', '', 'Ceramic Wall Tile', 'Imported', 'White', 'Wall', '', '',
  '["/uploads/products/DR-101-DR-102.webp","/uploads/products/DR-101-White-200x200.webp","/uploads/products/DR-102-Metalic-200x200.webp","/uploads/products/SW-101-White-65x265.webp","/uploads/products/SW-102-Metalic-65x265.webp","/uploads/products/DS.webp","/uploads/products/MIX-AMBIENCE-FOR-101-102.webp","/uploads/products/SW-101-SW-102-AMB.webp"]', '{}', '["metallic"]', '[]',
  '["White","Colourful"]', '{"White":"#FFFFFF","Colourful":"#E07A5F"}',
  1, 0, 0, 0, 'DR & SW -101 and 102  | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', 'DR & SW -101 and 102, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1791624117808-86b0b2', 'TMX-SKU-TMX-304', 'delormo-series', 'Delormo Series', 'TMX-304', '8905221858420', 'Organic patterns & warm textures
For interiors inspired by natural materiality.', 0, 0, 100,
  'moroccan', 'Moroccan Tiles', 'coll-moroccan', 'Moroccan Collection', '200mm x 200mm', '',
  'Matt', '', 'Porcelain', 'European Tiles, Spanish Tiles', 'Brown', 'Wall & Floor', '', '',
  '["/uploads/products/AMBIENTE-DELORMO-Adrien-1.webp","/uploads/products/Delormo-Pira-Mocha-200x200.webp","/uploads/products/Delormo-Fresno-Sand-200x200.webp","/uploads/products/Delormo-Adrien-200x200.webp","/uploads/products/Delormo-Dennis-200x200.webp","/uploads/products/Delormo-Bruno-200x200.webp","/uploads/products/AMBIENTE-DELORMO-Adrien-2.webp","/uploads/products/AMBIENTE-DELORMO-Bruno-1.webp","/uploads/products/AMBIENTE-DELORMO-Dennis-Pira-Mocha-ALFOMBRA.webp","/uploads/products/AMBIENTE-DELORMO-Dennis-1_A2.webp","/uploads/products/AMBIENTE-DELORMO-Dennis-2_A2.webp","/uploads/products/AMBIENTE-DELORMO-Fresno-Sand.webp","/uploads/products/AMBIENTE-DELORMO-Pira-mocha.webp"]', '{}', '["wooden"]', '[]',
  '["Brown"]', '{"Brown":"#7f6754"}',
  1, 0, 0, 0, 'Country Series  | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', 'Country Series, Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1791623307750-682444', 'TMX-SKU-TMX-508', 'country-series', 'Country Series', 'TMX-508', '8903674301427', '', 0, 0, 100,
  'stone', 'Stone Look', 'coll-stone', 'Stone Collection', '200 x 600mm', '',
  'Matt', '', 'Porcelain', 'European Tiles, Spanish Tiles', 'Grey', 'Exterior, Wall & Floor', '', '',
  '["/uploads/products/COUNTRY-GRAFITO-200X600-AMB.webp","/uploads/products/Country-Gris-200-x-600-mm.webp","/uploads/products/Country-Grafito-200-x-600-MM.webp","/uploads/products/Country-Nature-200-x-600-mm.webp","/uploads/products/Country-Gris-200x600-AMB.webp","/uploads/products/Country-Nature-200x600-AMB.webp"]', '{}', '[]', '[]',
  '["Grey","Beige"]', '{"Grey":"#b3ada8","Beige":"#a98e72"}',
  1, 0, 0, 0, 'Country Series  | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', 'Country Series, Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1791622474300-273838', 'TMX-SKU-TMX-247', 'colonial-series', 'Colonial Series', 'TMX-247', '8906226885777', 'Where craft meets character. The Colonial tiles are extruded, not pressed, giving them crisp edges and a sculptural depth that feels handcrafted. Available in Petal and Kite forms, each piece plays with proportion and repetition to create elegant, geometric patterns that stand out quietly.
Timeless, dimensional, and precise, Colonial adds rhythm to modern interiors.', 0, 0, 100,
  'boutique', 'Boutique Tiles', 'coll-boutique', 'Boutique Collection', '80mm X 200mm', '',
  'Matt, Vintage, Rustic', '', 'Porcelain', 'European Tiles, Spanish Tiles', 'White', 'Exterior, Wall & Floor', '', '',
  '["/uploads/products/AMB-SALON_COLONIAL-KITE_NEWPORT_MUD.webp","/uploads/products/Colonial-Kite-Annapolis-165-x-165.webp","/uploads/products/Colonial-Kite-Jamestown-165-x-165.webp","/uploads/products/Colonial-Kite-Newport-165-x-165.webp","/uploads/products/Colonial-Petal-Denim-80-x-200.webp","/uploads/products/Colonial-Petal-Koala-80-x-200.webp","/uploads/products/Colonial-Petal-Snow-80-x-200.webp","/uploads/products/Colonial-Petal-Mud-80-x-200.webp","/uploads/products/COLONIAL_DENIM.webp","/uploads/products/COLONIAL_DENIM-1.webp","/uploads/products/COLONIAL_MUD_NEWPORT.webp","/uploads/products/COLONIAL_PETAL_SNOW.webp","/uploads/products/GB3_KITE-BLUE-_PETAL-BLUE.webp","/uploads/products/AMB-COLONIAL_KOALA.webp","/uploads/products/Colonial-Kite-Snow.webp","/uploads/products/GB3_KITE-PEACH-TERRACOTTA-_PETAL-PEACH-TERRACOTTA.webp","/uploads/products/GB3_KITE-WHITE-_PETAL-WHITE_2.webp","/uploads/products/GB3_KITE-WHITE_PETAL-BLUE_4.webp","/uploads/products/SALON_COLONIAL_MUD_NEWPORT_02.webp","/uploads/products/SS3_KITE-CANYON-TERRACOTTA-_PETAL-TERRACOTTA_8.webp","/uploads/products/SS3_KITE-PEACH-TERRACOTTA-_KITE-AMELIA_PETAL-PEACH-TERRACOTTA_6.webp","/uploads/products/SS3_KITE-PEACH-TERRACOTTA-_KITE-NATALIA_PETAL-PEACH-TERRACOTTA_8.webp","/uploads/products/SS3_KITE-PEACH-TERRACOTTA-_PETAL-CANYON-TERRACOTTA_9.webp","/uploads/products/SS3_KITE-PEACH-TERRACOTTA-_PETAL-PEACH-TERRACOTTA_12.webp","/uploads/products/SS3_KITE-WHITE-_PETAL-WHITE_8.webp","/uploads/products/SS4_BLUE.webp","/uploads/products/SS4_BLUE_KITE-JULIANA_5.webp","/uploads/products/SS4_CANYON-TERRACOTTA_9.webp","/uploads/products/SS4_KITE-WHITE_PETAL-BLUE.webp","/uploads/products/SS4_KITE-PEACH-TERRACOTTA_PETAL-CANYON-TERRACOTTA_21.webp","/uploads/products/SS4_WHITE_14.webp","/uploads/products/SS4_WHITE_KITE-NATALIA_8.webp","/uploads/products/AMB-COCINA_COLONIAL-DENIM.webp"]', '{}', '["moroccan"]', '[]',
  '["White","Blue","Beige","Brown"]', '{"White":"#d9d8cc","Blue":"#596268","Beige":"#b39d86","Brown":"#9c7061"}',
  1, 0, 0, 0, 'Colonial Series | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', 'Colonial Series , Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1791621927390-5254f5', 'TMX-SKU-TMX-396', 'clinker', 'Clinker Series', 'TMX-396', '8908691455792', '', 0, 0, 100,
  'modular', 'Modular Tiles', 'coll-modular', 'Modular Collection', '330mm x 330mm', '',
  'Matt, Rustic', '', 'Anti Skid Tiles, Porcelain Tiles', 'Spanish Collection', 'Beige', 'Wall & Floor', '', '',
  '["/uploads/products/Clinker-1.webp","/uploads/products/Clinker-Natural-330-x-330.webp","/uploads/products/Clinker-Mytho-Tierra-330-x-330-1.webp","/uploads/products/Clinker-Mytho-Rubino-330-x-330.webp","/uploads/products/Clinker-Mytho-Acero-330-x-330.webp","/uploads/products/Clinker-Albany-Teka-330x330.webp","/uploads/products/Clinker-Mytho-Tierra-330-x-330.webp","/uploads/products/Clinker-p1.webp","/uploads/products/Clinker-Rounded-Albany-Teka.webp","/uploads/products/Clinker-Rounded-Mytho-Acero.webp","/uploads/products/Clinker-Rounded-Mytho-Rubino.webp","/uploads/products/Clinker-Rounded-Mytho-Tierra.webp","/uploads/products/Clinker-Rounded-Natural.webp","/uploads/products/NATURAL-2023-10.webp","/uploads/products/amb-02-albany_teka_pag.53.webp","/uploads/products/Natural-AMB.webp"]', '{}', '[]', '[]',
  '["Beige","Cotto","Brown","Grey"]', '{"Beige":"#deae81","Cotto":"#d0a586","Brown":"#7a5855","Grey":"#7e7d7d"}',
  1, 0, 0, 0, 'Clinker Series | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', 'Clinker Series, Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1791621172711-528161', 'TMX-SKU-TMX-203', 'carino', 'Carino Series', 'TMX-203', '8903422701561', 'The Carino series features a vintage Moroccan aesthetic defined by intricate floral motifs, soft matte textures, and a hand-painted cement tile look.
Its rustic finish adds warmth and character, making it ideal for kitchens, cafés, dining spaces, and feature floors or walls that call for an artistic, old-world touch.', 0, 0, 100,
  'moroccan', 'Moroccan Tiles', 'coll-moroccan', 'Moroccan Collection', '200mm x 200mm', '',
  'Matt', '', 'Porcelain Tiles, Anti Skid Tiles', 'European Tiles, Spanish Tiles', 'White', 'Wall & Floor', '', '',
  '["/uploads/products/AMB-CARINO-DECO-MYLOS_1.webp","/uploads/products/Carino-Perla-Grey-200x200.webp","/uploads/products/Carino-Menta-Green-200x200.webp","/uploads/products/Carino-Indigo-200x200.webp","/uploads/products/Carino-Deco-Ydra-200x200.webp","/uploads/products/Carino-Deco-Palma-200x200.webp","/uploads/products/Carino-Deco-Mylos-200x200.webp","/uploads/products/Carino-Deco-Infantas-200x200.webp","/uploads/products/AMB-CARINO-MENTA-GREEN.webp","/uploads/products/AMB-CARINO-DECO-YDRA_1.webp","/uploads/products/Amb-Infantas-cocina.webp","/uploads/products/Amb-Palma-20x20-terraza.webp","/uploads/products/Amb-Palma-20x20-bao.webp","/uploads/products/AMB_CARINO-INDIGO_1.webp","/uploads/products/AMB_CARINO-PERLA-GRAY_1.webp"]', '{}', '[]', '[]',
  '["White","Green","Blue","Beige"]', '{"White":"#e0ddd7","Green":"#a3b2a9","Blue":"#77869a","Beige":"#ded5c8"}',
  1, 0, 0, 0, 'Carino Series | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', 'Carino Series, Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1791617630102-7203a4', 'TMX-SKU-TMX-659', 'blinds-series', 'Blinds Series', 'TMX-659', '8906629803042', 'Where texture meets rhythm. The Blinds Series use fine vertical fluting to give walls a taller, more architectural presence. Their glossy surface adds a smooth, glass-like clarity that enhances the overall depth and definition of the design.
Sculptural and refined, Blinds brings contemporary precision to any setting.', 0, 0, 100,
  'colorful', 'Colorful Tiles', 'coll-colorful', 'Colorful Collection', '161mm X 300mm', '',
  'Glossy', '', 'Ceramic Wall Tile', 'European Tiles, Spanish Tiles', 'Beige', 'Wall', '', '',
  '["/uploads/products/Blinds-Ambience-7.webp","/uploads/products/Blinds-Cream-161-x-300.webp","/uploads/products/Blinds-Jade-161-x-300.webp","/uploads/products/Blinds-Navy-161-x-300.webp","/uploads/products/Blinds-Sea-161-x-300.webp","/uploads/products/Blinds-Snow-161-x-300.webp","/uploads/products/Blinds-Wine-161-x-300.webp","/uploads/products/Blinds-Ambience-3.webp","/uploads/products/Blinds-Ambience-4.webp","/uploads/products/Blinds-Ambience-2.webp","/uploads/products/Blinds-Ambience-12.webp","/uploads/products/Blinds-Ambience-8.webp","/uploads/products/Blinds-Ambience-13.webp","/uploads/products/Blinds-Ambience-14.webp","/uploads/products/BLINDS-NAVY-BLINDS-SKY.webp"]', '{}', '["subway"]', '[]',
  '["Beige","Green","Grey","White","Pink"]', '{"Beige":"#e7e0d5","Green":"#506c5c","Grey":"#747b86","White":"#e7e5e4","Pink":"#9d5669"}',
  1, 0, 0, 0, 'Belle Series | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', 'Belle Series, Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1791617267838-1fbc1e', 'TMX-SKU-TMX-726', 'bianco', 'Bianco', 'TMX-726', '8903138608647', '', 0, 0, 100,
  'texture', 'Texture / 3D', 'coll-texture', 'Texture Collection', '400mm x 1200mm', '',
  'Matt', '', 'Ceramic Wall Tile', 'Spanish Tiles, European Tiles', 'White', 'Wall', '', '',
  '["/uploads/products/AMA_BIANCO.webp","/uploads/products/Bianco-Ama-400x1200.webp","/uploads/products/Bianco-Essence-Luna-400x1200.webp","/uploads/products/Bianco-Luna-400x1200.webp","/uploads/products/Bianco-Mobius-400x1200.webp","/uploads/products/Bianco-Shape-400x1200.webp","/uploads/products/Bianco-Re-Use-400x1200.webp","/uploads/products/LUNABLANCA_AMB-5.webp","/uploads/products/AMA_BIANCO_AMB.webp","/uploads/products/LUNABLANCA_AMB-7.webp","/uploads/products/AMA_BIANCO-SHAPE_AMB.webp","/uploads/products/RE-USE_AMB-4-1.webp","/uploads/products/RE-USE_AMB-8.webp","/uploads/products/RE-USE_AMB-10.webp"]', '{}', '[]', '[]',
  '["White"]', '{"White":"#FFFFFF"}',
  1, 0, 0, 0, 'Belle Series | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', 'Belle Series, Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1791616008326-d8041b', 'TMX-SKU-TMX-917', 'belle-series', 'Belle Series', 'TMX-917', '8906044033916', 'Where architecture meets light. The Belle Series uses slender, vertical fluting to give walls a sense of height and effortless elegance. The luminous glaze catches the light on every curve, creating soft, shifting shadows that break up flat surfaces.
It visually lifts the ceiling, making the space feel taller, airier, and more refined.', 0, 0, 100,
  'colorful', 'Colorful Tiles', 'coll-colorful', 'Colorful Collection', '240mm x 740mm', '',
  'Matt', '', 'Ceramic Wall Tile', 'European Tiles, Spanish Tiles', 'Beige', 'Wall', '', '',
  '["/uploads/products/Bel-2.webp","/uploads/products/Belle-Beige-240-x-740.webp","/uploads/products/Belle-Blanco-240-x-740.webp","/uploads/products/Belle-Verde-240-x-740.webp","/uploads/products/Belle-Beige-AMB.webp","/uploads/products/Belle-Blanco-AMB.webp","/uploads/products/Belle-Verde-AMB.webp"]', '{}', '[]', '[]',
  '["Beige","White","Green"]', '{"Beige":"#D4C4B5","White":"#f8f8f8","Green":"#68726a"}',
  1, 0, 0, 0, 'Belle Series | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', 'Belle Series, Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1791615402380-1aa715', 'TMX-SKU-TMX-131', 'arkansas', 'Arkansas Series', 'TMX-131', '8908991425652', '', 0, 0, 100,
  'stone', 'Stone Look', 'coll-stone', 'Stone Collection', '400mm X 620mm', '',
  'Matt', '', 'Porcelain', 'European Tiles, Spanish Tiles', 'Grey', 'Exterior, Wall & Floor', '', '',
  '["/uploads/products/Amb-Andes_Ivory_exterior.webp","/uploads/products/Arkansas-Utah-400x620.webp","/uploads/products/Arkansas-Charcoal-400x620.webp","/uploads/products/Arkansas-Beige-400x620.webp","/uploads/products/Arkansas-Andes-Ivory-400x620.webp","/uploads/products/Amb-Andes_Ivory_bany.webp","/uploads/products/Amb-Utah_1.webp","/uploads/products/AMB-UTAH-EXTERIOR.webp","/uploads/products/Amb-Utah_2.webp","/uploads/products/Amb_Arkansas_Beige_exterior.webp","/uploads/products/Amb_Arkansas_Charcoal_exterior.webp"]', '{}', '[]', '[]',
  '["Grey","Black","Beige","White"]', '{"Grey":"#d5ccba","Black":"#817e76","Beige":"#dcccaf","White":"#e8ddd0"}',
  1, 0, 0, 0, 'Arkansas | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', 'Arkansas, Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1791614834485-2e7ac2', 'TMX-SKU-TMX-531', 'argos-series', 'Argos Series', 'TMX-531', '8902237257850', '', 0, 0, 100,
  'modular', 'Modular Tiles', 'coll-modular', 'Modular Collection', '580mm x 580mm', '',
  'Matt', '', 'Porcelain Tiles, Anti Skid Tiles', 'European Tiles, Spanish Tiles', 'Brown', 'Wall & Floor', '', '',
  '["/uploads/products/Argos-Copper-AMB.webp","/uploads/products/Argos-Copper-580-x-580-mm.webp","/uploads/products/Argos-Steel-580-x-580-mm.webp","/uploads/products/Argos-Brass-580-x-580-MM.webp","/uploads/products/Argos-Brass-AMB.webp","/uploads/products/Argos-Steel-AMB.webp"]', '{}', '["metallic"]', '[]',
  '["Brown","Cotto","Grey","Beige"]', '{"Brown":"#ad754d","Cotto":"#ad754d","Grey":"#e2dfe3","Beige":"#e9dccd"}',
  1, 0, 0, 0, 'Arenta Series | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', 'Arenta Series, Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1791614201010-5fc5b9', 'TMX-SKU-TMX-685', 'arenta-series-1', 'Arenta Series', 'TMX-685', '8906528245540', 'Where form meets heritage. The Arenta tiles echo Mediterranean courtyards with their unconventional interlocking shape, a mix of octagonal edges and cross like joints that create a bold, structured rhythm. With a soft stone-look texture, two surfaces rest in matte, while one shimmers subtly with speckled highlights.
Earthy, timeless, and tactile, Arenta turns structure into story.', 0, 0, 100,
  'stone', 'Stone Look', 'coll-stone', 'Stone Collection', '400mm X 600mm', '',
  'Matt', '', 'Porcelain', 'European Tiles, Spanish Tiles', 'Brown', 'Exterior, Wall & Floor', '', '',
  '["/uploads/products/amb-arenta-coto-MIX-40x60_hq.webp","/uploads/products/Arenta-Coto-400-x-600.webp","/uploads/products/Arenta-Coto-Mix-400-x-600.webp","/uploads/products/Arenta-Coto-White-400-x-600.webp","/uploads/products/amb-Arenta-Coto-White_hq.webp","/uploads/products/amb-Arenta-Coto_2_hq.webp","/uploads/products/amb-Arenta-Coto_Meissa-Blanco_hq.webp"]', '{}', '[]', '[]',
  '["Brown","Beige","White"]', '{"Brown":"#b89f8b","Beige":"#b5927c","White":"#d5cfce"}',
  1, 0, 0, 0, 'Arenta Series | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', 'Arenta Series, Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1791613465375-2de344', 'TMX-SKU-TMX-311', 'alloy-1200', 'Alloy Series 1200', 'TMX-311', '8908229776609', 'The Alloy series is a stunning collection inspired by the seamless fusion of metal and stone textures. With a contemporary edge and a refined, industrial charm, this series boasts versatile tiles that add depth and sophistication to any space. Whether it’s the cool tones of Alloy Coal, the vibrant allure of Alloy Copper, the soothing hue of Alloy Mint, or the modern neutrality of Alloy Azzurro, each tile tells its own story.
The Alloy series is perfect for creating sleek, modern interiors with a touch of raw elegance, ideal for residential and commercial projects alike.', 0, 0, 100,
  'metallic', 'Metallic Finish', 'coll-metallic', 'Metallic Collection', '1200mm x 1200mm', '',
  'Glossy', '', 'Porcelain', 'European Tiles', 'Green', 'Wall & Floor', '', '',
  '["/uploads/products/AMB_ALLOY_AZZURRO_120X120.webp","/uploads/products/Alloy-Mint-1200x1200.webp","/uploads/products/Alloy-Copper-1200x1200.webp","/uploads/products/Alloy-Azzurro-1200x1200.webp","/uploads/products/AMB_ALLOY_COPPER_60X120_60X60_MOSA_COAL_60X60-v02.webp","/uploads/products/AMB_ALLOY_MINT_120X120_ABS.webp"]', '{}', '[]', '[]',
  '["Green","Brown","Blue"]', '{"Green":"#748274","Brown":"#735439","Blue":"#546668"}',
  1, 0, 0, 0, 'Alloy Series 1200 | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', 'Alloy Series 1200, Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1791613172478-e3bc82', 'TMX-SKU-TMX-709', 'alberca', 'Alberca', 'TMX-709', '8904911314953', 'Modish in style and beautiful in feel, the Alberca series will make your swim hour a favorite part of your routine. For those who love a grand poolside, this is a standout selection.', 0, 0, 100,
  'mosaic', 'Mosaic Tiles', 'coll-mosaic', 'Mosaic Collection', '333mm X 333mm', '',
  'Glossy, Textured', '', 'Porcelain Tiles, Anti Skid Tiles', 'European Tiles', 'Blue', 'Wall & Floor', '', '',
  '["/uploads/products/INDICO-MIX_amb.webp","/uploads/products/Alberca-Indico-Mix-333-x-333MM.webp","/uploads/products/Alberca-Kuta-Turquesa-333-x-333.webp","/uploads/products/Alberca-Piscis-base-333-x-333MM.webp","/uploads/products/Alberca-Vela-Azul-333-x-333.webp","/uploads/products/KUTA_TURQUESA_AMB-1.webp","/uploads/products/INDICO-MIX-amb.webp","/uploads/products/Piscis-Base_AMB.webp","/uploads/products/VELA_AMB-1.webp","/uploads/products/VELA_AMB-2.webp","/uploads/products/VELA_AMB-3.webp"]', '{}', '[]', '[]',
  '["Blue"]', '{"Blue":"#3E6B99"}',
  1, 0, 0, 0, 'Alberca | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', 'Alberca, Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1791611225396-3453dc', 'TMX-SKU-TMX-692', '9051-54-series', '9051-54 Series', 'TMX-692', '8904129814416', 'Where pattern meets open space. The 9051-9054 Series blends rich marble textures with a seamless, interlocking design that hides the edges of each tile.
The continuous flow draws the eye outward, visually stretching the floor to make the room feel wider and more airy. It turns a simple surface into a grand, expansive foundation.', 0, 0, 100,
  'moroccan', 'Moroccan Tiles', 'coll-moroccan', 'Moroccan Collection', '600mm X 1200mm', '',
  'Matt', '', 'Porcelain', 'Imported', 'White', 'Wall & Floor', '', '',
  '["/uploads/products/9051-AMBIANCE-4.webp","/uploads/products/9051-600-x-1200.webp","/uploads/products/9052-600-x-1200.webp","/uploads/products/9053-600-x-1200.webp","/uploads/products/9054-600-x-1200.webp","/uploads/products/9051-AMBIANCE-1.webp","/uploads/products/9051-AMBIANCE-5.webp","/uploads/products/9052-AMBIANCES-1.webp","/uploads/products/9052-AMBIANCES-3.webp","/uploads/products/9052-AMBIANCES-5.webp","/uploads/products/9053-AMBIANCES-1.webp","/uploads/products/9053-AMBIANCES-4.webp","/uploads/products/9054-AMBIANCES-4.webp","/uploads/products/9054-AMBIANCES-1.webp"]', '{}', '[]', '[]',
  '["White","Grey","Black","Green"]', '{"White":"#ffffff","Grey":"#9f9994","Black":"#9f9994","Green":"#4D7C59"}',
  1, 0, 0, 0, '9051-54 Series | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', '9051-54 Series, Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1791610532708-a7039e', 'TMX-SKU-TMX-645', '9002-to-9003', '9002 To 9003', 'TMX-645', '8901979763058', 'Experience the Essence of Serenity with the 9002-03 collection, where surfaces whisper and textures speak. These matt-finished, fabric like tiles don’t just look refined, they feel it. They flow like calm water, from blush-washed florals to sun-kissed jute motifs.
Quietly opulent, a little bohemian, & endlessly tactile, they turn everyday spaces into something softly extraordinary.', 0, 0, 100,
  'tropical', 'Tropical / Floral', 'coll-tropical', 'Tropical Collection', '600mm X 1200mm', '',
  'Matt', '', 'Porcelain', 'Imported', 'Pink', 'Wall & Floor', '', '',
  '["/uploads/products/9002-Ambience-2-Copy.webp","/uploads/products/9002-Fabric-Rosa-1.webp","/uploads/products/9002-Floral-1.webp","/uploads/products/9003-Fabric-Jute-Copy.webp","/uploads/products/9003-Fabric-Jute-Decor-Copy.webp","/uploads/products/9002-Ambience-7.webp","/uploads/products/9002-Ambience-5-Copy.webp","/uploads/products/9002-Ambience-8-Copy.webp","/uploads/products/9003-Ambience-1-Copy.webp","/uploads/products/9003-Ambience-3.webp","/uploads/products/9003-Ambience-7-Copy.webp","/uploads/products/9003-Ambience-6-Copy.webp","/uploads/products/9003-Ambience-8-Copy.webp","/uploads/products/9003-Ambience-10-Copy.webp","/uploads/products/9003-Ambience-11-Copy.webp","/uploads/products/9003-Ambience-12.webp","/uploads/products/9003-Ambience-15.webp","/uploads/products/9003-Ambience-16.webp"]', '{}', '["fabric"]', '[]',
  '["Pink","Yellow"]', '{"Pink":"#e1c1a8","Yellow":"#ceb88e"}',
  1, 0, 0, 0, '9001 Series | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', '9001 Series, Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1791610207878-ff20eb', 'TMX-SKU-TMX-354', '9001-series', '9001 Series', 'TMX-354', '8901100704574', '', 0, 0, 100,
  'tropical', 'Tropical / Floral', 'coll-tropical', 'Tropical Collection', '600mm X 1200mm', '',
  'Matt', '', 'Porcelain', 'Imported', 'Beige', 'Wall', '', '',
  '["/uploads/products/AMB_3-Fabric-Crema-Tropical.webp","/uploads/products/9001-Fabric-Crema.webp","/uploads/products/9001-Fabric-Tropical-AB.webp","/uploads/products/9001-Fabric-Verde.webp","/uploads/products/MIX_AMB_1-Crema-Tropical.webp","/uploads/products/MIX_AMB_2-Verde-Tropical.webp","/uploads/products/MIX_AMB_3-Crema-Verde-Tropical.webp","/uploads/products/YZ-612-2HD-1-1.webp"]', '{}', '["fabric"]', '[]',
  '["Beige","Green","White"]', '{"Beige":"#e8e4db","Green":"#8d9e8a","White":"#e5e0d5"}',
  1, 0, 0, 0, '9001 Series | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', '9001 Series, Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1791609397825-02cef9', 'TMX-SKU-TMX-168', '8000-series', '8000 Series', 'TMX-168', '8908684160404', 'The 8801–8808 Series celebrates the power of pure pigment — a collection designed for those who dare to decorate with confidence. From the warm earthiness of Coral Orange and Linen, to the moody elegance of Deep Sea Blue and Cloudy Grey, each shade is carefully curated to stand alone or mix with contrast. The finishes are sophisticated, giving walls and floors a refined, contemporary depth.
Whether you’re crafting playful bathrooms, striking feature walls, or artfully tonal living spaces, this series lets colour become the design language — clear, bold, and unapologetically modern.', 0, 0, 100,
  'colorful', 'Colorful Tiles', 'coll-colorful', 'Colorful Collection', '600mm X 1200mm', '',
  'Matt', '', 'Porcelain', 'Imported', 'Orange', 'Wall & Floor', '', '',
  '["/uploads/products/Black-Coral-Orange_2-C12612-13.webp","/uploads/products/8801-Coral-Orange.webp","/uploads/products/8802-Pale-Green.webp","/uploads/products/8804-Linen-Color.webp","/uploads/products/8803-Deep-Sea-Blue.webp","/uploads/products/8805-Cherry-Pink.webp","/uploads/products/8806-Moon-Blue.webp","/uploads/products/8807-Cloudy-Grey.webp","/uploads/products/8808-Black.webp","/uploads/products/Black-Coral-Orange_1-C12612-13.webp","/uploads/products/Black-Coral-Orange_5-C12612-13.webp","/uploads/products/Black-Coral-Orange_3-C12612-13.webp","/uploads/products/Black-Coral-Orange_4-C12612-13.webp","/uploads/products/Black_1-C12613.webp","/uploads/products/Cherry-Pink-Pale-Green-C126366.webp","/uploads/products/Cherry-Pink_2-C1263.webp","/uploads/products/Cherry-Pink_3-C1263.webp","/uploads/products/Cherry-Pink_4-C1263.webp","/uploads/products/Cloudy-Grey-Linen-Color_1-CI126267.webp","/uploads/products/Cloudy-Grey_2-C1261.webp","/uploads/products/Cloudy-Grey_1-C1261.webp","/uploads/products/Cloudy-Grey_3C1261.webp","/uploads/products/Cloudy-Grey_4-C1261.webp","/uploads/products/Coral-Orange-Cherry-Pink-C12612C1263.webp","/uploads/products/Coral-Orange-Pale-Green-Cloudy-Grey-Cherry-Pink-C12612636661.webp","/uploads/products/Coral-Orange_2-C12612-DR-36.webp","/uploads/products/Coral-Orange_3-C12612.webp","/uploads/products/Deep-Sea-Blue_1-C1265.webp","/uploads/products/Deep-Sea-Blue_2-C1265.webp","/uploads/products/Deep-Sea-Blue_3-C1265.webp","/uploads/products/Linen-Color_1-C1267.webp","/uploads/products/Linen-Color_2-C1267.webp","/uploads/products/Moon-Blue_1-C1264.webp","/uploads/products/Moon-Blue_2-C1264.webp","/uploads/products/Pale-Green-Cloudy-Grey-Moon-Blue-C12616466.webp","/uploads/products/Pale-Green_1-C1266.webp","/uploads/products/Pale-Green-Cloudy-Grey_1-C126166.webp","/uploads/products/Pale-Green_2-C1266.webp"]', '{}', '[]', '[]',
  '["Orange","Green","Blue","Brown","Pink","Grey","Black"]', '{"Orange":"#b5805b","Green":"#90a18c","Blue":"#70787f","Brown":"#a28b65","Pink":"#d4b8af","Grey":"#c6c1c2","Black":"#272a27"}',
  1, 0, 0, 0, '8000 Series | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', '8000 Series, Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1791574499625-7ac3d4', 'TMX-SKU-TMX-646', '8011-8012', '8011 & 8012', 'TMX-646', '8901762582417', 'The 8011 & 8012 series is a harmonious blend of understated elegance and modern design, resembling Portland natural stone design. Featuring neutral tones of light beige and deep green, these tiles are perfect for creating serene, minimalist interiors. The addition of Décor tiles with subtle textured patterns elevates the aesthetic, providing depth without overwhelming the space.', 0, 0, 100,
  'marble', 'Marble Look', 'coll-marble', 'Marble Collection', '600mm X 1200mm', '',
  'Matt, Textured', '', 'Porcelain', 'Imported', 'White', 'Wall & Floor', '', '',
  '["/uploads/products/AMB_8011-8011-D_1.webp","/uploads/products/8011-600X1200-MM.webp","/uploads/products/8011-Decor-600X1200-MM.webp","/uploads/products/8012-600X1200-MM.webp","/uploads/products/8012-Decor-600X1200-MM.webp","/uploads/products/AMB_8011-8011-D_2.webp","/uploads/products/AMB_8011-8011-D_3.webp","/uploads/products/AMB_8012-8012_D_2.webp","/uploads/products/AMB_8012-8012_D_3.webp","/uploads/products/MIX_AMB_8011-8012_1.webp"]', '{}', '["texture"]', '[]',
  '["White","Green"]', '{"White":"#e6e3dd","Green":"#4d5247"}',
  1, 0, 0, 0, '8011 & 8012 | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', '8011 & 8012, Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1791572942497-ec3da9', 'TMX-SKU-TMX-175', '6621-to-6628', '6621 To 6628', 'TMX-175', '8904198546186', 'The 6621–28 Series bridge old world grandeur and modern ease. Veining runs like artful scrawls across serene bases, while bold Moroccan-inspired patterns add a whisper of wanderlust.
Lived-in, a little wild, quietly grand, & effortlessly elegant with a touch of imperfection, these tiles turn every floor into a story of timeless, unconventional luxury.', 0, 0, 100,
  'moroccan', 'Moroccan Tiles', 'coll-moroccan', 'Moroccan Collection', '600mm x 600mm', '',
  'Matt', '', 'Porcelain', 'Imported', 'Beige', 'Wall & Floor', '', '',
  '["/uploads/products/6621Ambience-4.webp","/uploads/products/6621-Beige-600x600.webp","/uploads/products/6622-Yellow-600x600.webp","/uploads/products/6623-Cotto-600x600.webp","/uploads/products/6626-Green-600x600.webp","/uploads/products/6624-RED-600-X-600.webp","/uploads/products/6625-Grey-600x600.webp","/uploads/products/6627-Beige-600-x-600-copy.webp","/uploads/products/6628-Green-600-x-600.webp","/uploads/products/6621Ambience-1.webp","/uploads/products/6621Ambience-7.webp","/uploads/products/6622Ambience-3.webp","/uploads/products/6622Ambience-6.webp","/uploads/products/6623Ambience-1.webp","/uploads/products/6623Ambience-4.webp","/uploads/products/6623Ambience-6.webp","/uploads/products/6624Ambience-3.webp","/uploads/products/6624Ambience-6.webp","/uploads/products/6624Ambience-9.webp","/uploads/products/6625Ambience-3.webp","/uploads/products/6625Ambience-5.webp","/uploads/products/6625Ambience-6.webp","/uploads/products/6626-Ambience-1.webp","/uploads/products/6626-Ambience-3.webp","/uploads/products/6626-Ambience-4.webp","/uploads/products/6626-Ambience-7.webp","/uploads/products/6627Ambience-2.webp","/uploads/products/6627Ambience-4.webp","/uploads/products/6627Ambience-7.webp","/uploads/products/6628-Ambience-1.webp","/uploads/products/6628-Ambience-7.webp"]', '{}', '[]', '[]',
  '["Beige","Yellow","Brown","Green","Red","Grey"]', '{"Beige":"#d1b68b","Yellow":"#e0b879","Brown":"#9f5938","Green":"#868560","Red":"#ad6f54","Grey":"#797874"}',
  1, 0, 0, 0, '6621 To 6628 | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', '6621 To 6628, Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1791572453340-be329a', 'TMX-SKU-TMX-671', '6000-series', '6000 Series', 'TMX-671', '8902414795877', '', 0, 0, 100,
  'wooden', 'Wooden Look', 'coll-wooden', 'Wooden Collection', '600mm x 600mm', '',
  'Matt', '', 'Porcelain', 'Imported', 'Brown', 'Wall & Floor', '', '',
  '["/uploads/products/6001-1.webp","/uploads/products/6001-600x600.webp","/uploads/products/6002-600x600.webp","/uploads/products/6003-600-x-600.webp","/uploads/products/6004-600x600.webp","/uploads/products/6001-2.webp","/uploads/products/6001-3.webp","/uploads/products/6002-1.webp","/uploads/products/6002-2.webp","/uploads/products/6002-3.webp","/uploads/products/6002-4.webp","/uploads/products/6003-1.webp","/uploads/products/6003-2.webp","/uploads/products/6003-3.webp","/uploads/products/6003-4.webp","/uploads/products/6004-1.webp","/uploads/products/6004-2.webp","/uploads/products/6004-3.webp","/uploads/products/6004-4.webp","/uploads/products/6004.webp"]', '{}', '[]', '[]',
  '["Brown"]', '{"Brown":"#8f5e2f"}',
  1, 0, 0, 0, '6000 Series | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', '6000 Series, Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1791571806209-96cbb8', 'TMX-SKU-TMX-161', '1004', '1004', 'TMX-161', '8904109076674', 'Where concrete meets canvas. The 1003-04 Series softens raw, architectural textures with the delicate trace of art. Available in serene beige with classical lacework or urban grey with sweeping white flora, the collection balances grit with grace. Subtle yet striking, they add a layer of organic movement to modern spaces without overwhelming the senses.', 0, 0, 100,
  'tropical', 'Tropical / Floral', 'coll-tropical', 'Tropical Collection', '800mm X 1800mm', '',
  'Matt', '', 'Porcelain', 'Imported', 'Beige', 'Wall & Floor', '', '',
  '["/uploads/products/1004-AMB-1.webp","/uploads/products/1004-800x1800.webp","/uploads/products/1004-Decor-800x1800.webp","/uploads/products/1004-AMB-2.webp","/uploads/products/1004-AMB-3.webp"]', '{}', '["moroccan"]', '[]',
  '["Beige"]', '{"Beige":"#D4C4B5"}',
  1, 0, 0, 0, '1004 | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', '1004, Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1791570660912-357a05', 'TMX-SKU-TMX-307', '1003', '1003', 'TMX-307', '8907516795466', 'Where concrete meets canvas. The 1003-04 Series softens raw, architectural textures with the delicate trace of art. Available in serene beige with classical lacework or urban grey with sweeping white flora, the collection balances grit with grace. Subtle yet striking, they add a layer of organic movement to modern spaces without overwhelming the senses.', 0, 0, 100,
  'tropical', 'Tropical / Floral', 'coll-tropical', 'Tropical Collection', '800mm X 1800mm', '',
  'Matt', '', 'Porcelain', 'Imported', 'Grey', 'Wall', '', '',
  '["/uploads/products/1003-AMB-1.webp","/uploads/products/1003-800x1800.webp","/uploads/products/1003-Decor-800x1800.webp","/uploads/products/1003-AMB-2.webp","/uploads/products/1003-AMB-3.webp","/uploads/products/1003-AMB-4.webp","/uploads/products/1003-AMB-5.webp"]', '{}', '[]', '[]',
  '["Grey"]', '{"Grey":"#bcbabb"}',
  1, 0, 0, 0, '1003 | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', '1003, Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1791551881308-91cf0b', 'TMX-SKU-TMX-882', '1001-1002', '1001 & 1002', 'TMX-882', '8906566447185', 'These tiles feature a beautifully muted design with a soft, earthy palette. The background has a warm, textured finish, resembling natural stone. In the Décor variants, delicate leaf patterns overlay the surface, adding a touch of elegance and organic appeal. The intricate details of the leaves give the tile a botanical feel, making it perfect for creating a serene ambiance in spaces like bathrooms, kitchens, or living areas. Overall, the 1001 & 1002 tiles combine natural beauty with sophistication, ideal for both modern and rustic designs.', 0, 0, 100,
  'tropical', 'Tropical / Floral', 'coll-tropical', 'Tropical Collection', '800mm X 1800mm', '',
  'Matt', '', 'Porcelain', 'Imported', 'Gold', 'Wall', '', '',
  '["/uploads/products/1001-1.webp","/uploads/products/1001-800x1800.webp","/uploads/products/1001-Decor-800x1800.webp","/uploads/products/1002.webp","/uploads/products/1002-Decor.webp","/uploads/products/1001-2.webp","/uploads/products/1002-1.webp","/uploads/products/1002-2.webp"]', '{}', '[]', '[]',
  '["Gold","Copper"]', '{"Gold":"#aa9d80","Copper":"#a3866b"}',
  1, 0, 0, 0, '1001 & 1002 | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', '1001 & 1002 , Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1791460818206-42eb43', 'TMX-SKU-TMX-777', '582', '582', 'TMX-777', '8908675944191', 'Where earth meets form. The 581 – 582 tiles capture natural warmth through soft matte finishes and mineral tones that feel calm and grounded. Available in square (581) and elongated subway (582) formats, they move easily from wall to floor, creating fluid, tactile compositions that bring quiet texture to modern living spaces.', 0, 0, 100,
  'colorful', 'Colorful Tiles', 'coll-colorful', 'Colorful Collection', '300mm X 600mm', '',
  'Glossy', '', 'Porcelain', 'Imported', 'Blue', 'Wall & Floor', '', '',
  '["/uploads/products/582-Crema-AMBIANCE-4.webp","/uploads/products/582-Azul.webp","/uploads/products/582-Verde.webp","/uploads/products/582-Crema.webp","/uploads/products/582-Ocre.webp","/uploads/products/582-Rosa.webp","/uploads/products/581-Azul-Ambiance-2.webp","/uploads/products/581-Azul-Ambiance-1.webp","/uploads/products/581-Azul-Ambiance-6.webp","/uploads/products/582-Azul-Ambiance-5.webp","/uploads/products/582-Azul-Ambiance-4.webp","/uploads/products/582-Azul-Ambiance-3.webp","/uploads/products/581-Crema-582-Crema-AMBIANCE-2-1.webp","/uploads/products/581-Crema-582-Crema-AMBIANCE-1-1.webp","/uploads/products/581-Crema-582-Crema-AMBIANCE-3.webp","/uploads/products/582-Crema-AMBIANCE-5.webp","/uploads/products/581-Rosa-Ambiance-1.webp","/uploads/products/581-Rosa-Ambiance-2.webp","/uploads/products/581-Rosa-Ambiance-6.webp","/uploads/products/582-Rosa-Ambiance-1.webp","/uploads/products/582-Rosa-Ambiance-5.webp","/uploads/products/582-Rosa-Ambiance-6.webp","/uploads/products/581-Verde-Ambiance-1.webp","/uploads/products/581-Verde-Ambiance-5.webp","/uploads/products/581-Verde-Ambiance-6.webp","/uploads/products/582-Verde-Ambiance-1.webp","/uploads/products/582-Verde-Ambiance-5.webp","/uploads/products/582-Verde-Ambiance-6.webp","/uploads/products/582-Ocre-Ambiance-3.webp","/uploads/products/582-Ocre-Ambiance-4.webp","/uploads/products/582-Ocre-Ambiance-5.webp","/uploads/products/582-Ocre-Ambiance-6.webp"]', '{}', '[]', '[]',
  '["Blue","Green","Beige","Yellow","Pink"]', '{"Blue":"#5a6d79","Green":"#315028","Beige":"#f3d2a1","Yellow":"#dfa848","Pink":"#f9ddce"}',
  1, 0, 0, 0, '582 | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', '582, Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1791373893260-1b81f1', 'TMX-SKU-TMX-754', '581', '581', 'TMX-754', '8902472220243', 'Where earth meets form. The 581 – 582 tiles capture natural warmth through soft matte finishes and mineral tones that feel calm and grounded. Available in square (581) and elongated subway (582) formats, they move easily from wall to floor, creating fluid, tactile compositions that bring quiet texture to modern living spaces.', 0, 0, 100,
  'colorful', 'Colorful Tiles', 'coll-colorful', 'Colorful Collection', '300mm X 600mm', '',
  'Glossy', '', 'Porcelain', 'Imported', 'Blue', 'Wall & Floor', '', '',
  '["/uploads/products/581-Crema-582-Crema-AMBIANCE-1-1.webp","/uploads/products/581-Azul.webp","/uploads/products/581-Verde.webp","/uploads/products/581-Crema.webp","/uploads/products/581-Ocre.webp","/uploads/products/581-Rosa.webp","/uploads/products/581-Azul-Ambiance-1.webp","/uploads/products/581-Azul-Ambiance-3.webp","/uploads/products/581-Azul-Ambiance-2.webp","/uploads/products/581-Azul-Ambiance-4.webp","/uploads/products/581-Azul-Ambiance-5.webp","/uploads/products/581-Azul-Ambiance-6.webp","/uploads/products/581-Crema-582-Crema-AMBIANCE-2-1.webp","/uploads/products/581-Crema-582-Crema-AMBIANCE-3.webp","/uploads/products/581-Crema-Amb-1.webp","/uploads/products/581-Crema-Amb-2.webp","/uploads/products/581-Crema-Amb-3.webp","/uploads/products/581-Ocre-Ambiances-1.webp","/uploads/products/581-Ocre-Ambiances-2.webp","/uploads/products/581-Ocre-Ambiances-3.webp","/uploads/products/581-Rosa-Ambiance-1.webp","/uploads/products/581-Rosa-Ambiance-2.webp","/uploads/products/581-Rosa-Ambiance-3.webp","/uploads/products/581-Rosa-Ambiance-4.webp","/uploads/products/581-Rosa-Ambiance-5.webp","/uploads/products/581-Rosa-Ambiance-6.webp","/uploads/products/581-Verde-Ambiance-1.webp","/uploads/products/581-Verde-Ambiance-2.webp","/uploads/products/581-Verde-Ambiance-3.webp","/uploads/products/581-Verde-Ambiance-4.webp","/uploads/products/581-Verde-Ambiance-5.webp","/uploads/products/581-Verde-Ambiance-6.webp"]', '{}', '[]', '[]',
  '["Blue","Green","Beige","Yellow","Pink"]', '{"Blue":"#5a6d79","Green":"#315028","Beige":"#f3d2a1","Yellow":"#dfa848","Pink":"#f9ddce"}',
  1, 0, 0, 0, '581 | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', '581, Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1791371822049-0f1c76', 'TMX-SKU-TMX-473', '232', '232', 'TMX-473', '8906481733705', '232', 0, 0, 100,
  'metallic', 'Metallic Finish', 'coll-metallic', 'Metallic Collection', '300mm X 600mm', '',
  'Matt', '', 'Ceramic Tiles', 'Imported', 'Beige', 'Wall & Floor', '', '',
  '["/uploads/products/202-Light-232-Light_AMB.webp","/uploads/products/232-Light.webp","/uploads/products/232-Dark.webp","/uploads/products/232-Concept-202-Light.webp","/uploads/products/232-Concept-AMB_1.webp","/uploads/products/232-Concept-AMB_2.webp"]', '{}', '["marble"]', '[]',
  '["Beige"]', '{"Beige":"#ebe2d8"}',
  1, 0, 0, 0, '232 | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', '232, Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1791371544229-84ce01', 'TMX-SKU-TMX-345', '231', '231', 'TMX-345', '8904330805786', 'Give your rooms an intriguing makeover with these beige latticed tiles. The neutral tones add an airy feel to any room, by creating an illusion of brightness and space.', 0, 0, 100,
  'metallic', 'Metallic Finish', 'coll-metallic', 'Metallic Collection', '600mm X 300mm', '',
  'Matt', '', 'Ceramic Tiles', 'Imported', 'Beige', 'Wall', '', '',
  '["/uploads/products/231-LIGHT-AMB-1.webp","/uploads/products/231-Light.webp","/uploads/products/231-LIGHT-AMB-2.webp"]', '{}', '["marble"]', '[]',
  '["Beige"]', '{"Beige":"#eee6dd"}',
  1, 0, 0, 0, '231 | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', '231, Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1791371151568-109ded', 'TMX-SKU-TMX-968', '230', '230', 'TMX-968', '8902391242723', 'The honeycomb-inspired design is trendy, unique and gives your room a distinct aura of creativity. A flawless embellishment to your walls, the layers of texture they add to the room is undeniable.', 0, 0, 100,
  'metallic', 'Metallic Finish', 'coll-metallic', 'Metallic Collection', '600mm X 300mm', '',
  'Glossy', '', 'Ceramic Wall Tile', 'Imported', 'White', 'Wall', '', '',
  '["/uploads/products/230-LIGHT-AMB-1.webp","/uploads/products/230-Light.webp","/uploads/products/230-LIGHT-AMB-2.webp"]', '{}', '[]', '[]',
  '["White"]', '{"White":"#fefefe"}',
  1, 0, 0, 0, '230 | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', '230, Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1791370830223-3c8df5', 'TMX-SKU-TMX-731', '229', '229', 'TMX-731', '8907552595749', 'These tiles can be the perfectly practical backsplashes for the kitchen. The grays permeate grace, adding character to the room. These geometric patterns are not just ideal but also in vogue for contemporary homes.', 0, 0, 100,
  'metallic', 'Metallic Finish', 'coll-metallic', 'Metallic Collection', '600mm X 300mm', '',
  'Glossy', '', 'Ceramic Wall Tile', 'Imported', 'Grey', 'Wall', '', '',
  '["/uploads/products/229-LIGHT-DARK-AMB-2.webp","/uploads/products/229-Dark.webp","/uploads/products/229-Light.webp","/uploads/products/229-LIGHT-DARK-AMB-1.webp"]', '{}', '[]', '[]',
  '["Grey"]', '{"Grey":"#9ca0a5"}',
  1, 0, 0, 0, '229 | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', '229, Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1791370258753-d54559', 'TMX-SKU-TMX-700', '228', '228', 'TMX-700', '8903738307417', 'No need to go through the hassles of buying decorative items for your personal space anymore! The beige tiles coupled with gray and beige patterned ones make neutral look aesthetically pleasing.', 0, 0, 100,
  'metallic', 'Metallic Finish', 'coll-metallic', 'Metallic Collection', '600mm X 300mm', '',
  'Glossy', '', 'Ceramic Wall Tile', 'Imported', 'Beige', 'Wall', '', '',
  '["/uploads/products/228-LIGHT-DARK-AMB-1.webp","/uploads/products/228-Dark.webp","/uploads/products/228-Light.webp"]', '{}', '[]', '[]',
  '["Beige"]', '{"Beige":"#c9bdb6"}',
  1, 0, 0, 0, '228 | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', '228, Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1791369740282-7dedda', 'TMX-SKU-TMX-362', '226', '226', 'TMX-362', '8905363034626', 'Make a subtle statement with these pristine geometric patterned white tiles. The contemporary style and contrast of colors will make your walls pop out and add character to your space.', 0, 0, 100,
  'metallic', 'Metallic Finish', 'coll-metallic', 'Metallic Collection', '300mm x 600mm', '',
  'Glossy', '', 'Ceramic Wall Tile', 'Imported', 'White', 'Wall', '', '',
  '["/uploads/products/226-Light-227-Plain-MIX_AMB.webp","/uploads/products/226-Light.webp","/uploads/products/226-Light-227-Plain-MIX_AMB_1.webp","/uploads/products/226-Light_AMB-1.webp","/uploads/products/226-Light_AMB-2.webp","/uploads/products/226-MIX_AMB_3.webp","/uploads/products/227-Plain-226-Light-AMB_1.webp"]', '{}', '[]', '[]',
  '["White"]', '{"White":"#FFFFFF"}',
  1, 0, 0, 0, '226 | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', '226, Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1791368806472-4d8b3e', 'TMX-SKU-TMX-692', '223', '223', 'TMX-692', '8905093287858', 'Scattered hues of blue, reminiscent of summer days, make these simple patterns look like a million dollars! They not only amp up the brightness of your bathroom but add grandeur to even the tiniest space.', 0, 0, 100,
  'metallic', 'Metallic Finish', 'coll-metallic', 'Metallic Collection', '600mm X 300mm', '',
  'Glossy', '', 'Ceramic Wall Tile', 'Imported', 'Grey', 'Wall', '', '',
  '["/uploads/products/223-DARK-AND-223-LIGHT-AMBIANCE.webp","/uploads/products/223-Dark.webp","/uploads/products/223-Light.webp","/uploads/products/223-LIGHT-AND-223-DARK-AMBIANCE.webp"]', '{}', '[]', '[]',
  '["Grey"]', '{"Grey":"#878892"}',
  1, 0, 0, 0, '223 | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', '223, Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1791368140168-1120e1', 'TMX-SKU-TMX-948', '222', '222', 'TMX-948', '8909037531238', 'Carefully chosen to add artistic beauty to your walls. The simple white tile can be coupled with the stately beige ones to create a patterned repetition of squares that imbue a refined finish, making your bathroom fit for a king!', 0, 0, 100,
  'metallic', 'Metallic Finish', 'coll-metallic', 'Metallic Collection', '600mm X 300mm', '',
  'Glossy', '', 'Ceramic Wall Tile', 'Imported', 'Beige', 'Wall', '', '',
  '["/uploads/products/222-DARK-AND-222-LIGHT-AMBIANCE.webp","/uploads/products/222-dark.webp","/uploads/products/222-Light.webp","/uploads/products/222-LIGHT-AND-222-DARK-AMBIANCE.webp"]', '{}', '[]', '[]',
  '["Beige"]', '{"Beige":"#bf9a78"}',
  1, 0, 0, 1, '222 | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', '222, Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1791366834027-3d0caf', 'TMX-SKU-TMX-756', '215', '215', 'TMX-756', '8901863256701', 'Immerse yourself in the soothing tranquility of the 215 tile series, where faded green tones evoke a sense of natural serenity. With intricate metallic leaf designs on the Dark variant and dynamic, raw textures on the Light tile, each piece invites you to embrace the beauty of nature within your space. Add a touch of raw elegance, creating a harmonious oasis of tranquility.', 0, 0, 100,
  'metallic', 'Metallic Finish', 'coll-metallic', 'Metallic Collection', '300mm X 600mm', '',
  'Glossy', '', 'Ceramic Tiles', 'Imported', 'Green', 'Wall', '', '',
  '["/uploads/products/215-1.webp","/uploads/products/215-Light-300x600.webp","/uploads/products/215-Dark-300x600.webp","/uploads/products/215-2.webp"]', '{}', '[]', '[]',
  '["Green"]', '{"Green":"#94a39c"}',
  1, 0, 0, 0, '215 | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', '215, Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1791364676291-988576', 'TMX-SKU-TMX-358', '213', '213', 'TMX-358', '8909740671750', 'Unveil the understated luxury of the 213 tile series, boasting a serene beige palette that exudes timeless sophistication. The Dark variant dazzles with its intricate gold patterns, artfully arranged in lines at varying angles, adding a touch of opulence to any space. Meanwhile, the Light tile offers a soothing marble effect, creating an ambiance of refined elegance within the 213 collection.', 0, 0, 100,
  'metallic', 'Metallic Finish', 'coll-metallic', 'Metallic Collection', '300mm X 600mm', '',
  'Glossy', '', 'Ceramic Tiles', 'Imported', 'Beige', 'Wall', '', '',
  '["/uploads/products/213-5.webp","/uploads/products/213-Light-300x600.webp","/uploads/products/213-Dark-300x600.webp","/uploads/products/213-2.webp","/uploads/products/213-1.webp"]', '{}', '[]', '[]',
  '["Beige"]', '{"Beige":"#D4C4B5"}',
  1, 0, 0, 0, '213 | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', '213, Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1791363517473-a91965', 'TMX-SKU-TMX-664', '210', '210', 'TMX-664', '8907015148860', 'Introducing the 210 tile series, where opulence meets sophistication in a palette of gold, brown, and grey hues. The Dark variant boasts intricate gold patterns adorning a luxurious marble-effect backdrop, exuding a sense of timeless elegance. Meanwhile, the Light tile offers a sleek marble effect, adding a touch of refined charm to any space within the 210 collection.', 0, 0, 100,
  'metallic', 'Metallic Finish', 'coll-metallic', 'Metallic Collection', '300mm X 600mm', '',
  'Glossy, Metallic', '', 'Ceramic Tiles', 'Imported', 'White', 'Wall', '', '',
  '["/uploads/products/210-3.webp","/uploads/products/210-Light-300x600.webp","/uploads/products/210-Dark-300x600.webp","/uploads/products/210-1.webp"]', '{}', '["marble","brick"]', '[]',
  '["White"]', '{"White":"#f9f8f6"}',
  1, 0, 0, 0, '210 | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', '210, Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1791277653203-2a6913', 'TMX-SKU-TMX-388', '209-series', '209 Series', 'TMX-388', '8902431326079', 'Embrace the allure of the 209 series, where the interplay of different shades of blue and their lively patterns converge to create a harmonious cool palette, bringing you to a realm of tranquility.
Discover the epitome of refined luxury with our 209 series, where every tile tells a captivating story. “Dark” exudes a timeless allure, evoking a sense of mystery and sophistication that anchors your space in opulence. “Light” invites a breath of fresh air, a subtle dance of serenity that transforms your surroundings into a haven of tranquility. The star of the show, “Highlighter,” bursts forth with the vibrancy of green and blue leaf patterns, injecting a playful energy that harmonizes with the modern aesthetic of the entire series.', 0, 0, 100,
  'metallic', 'Metallic Finish', 'coll-metallic', 'Metallic Collection', '300mm X 600mm', '',
  'Glossy', '', 'Ceramic Wall Tile', 'Imported', 'Blue', 'Wall', '', '',
  '["/uploads/products/AMB_2_209_1.webp","/uploads/products/209-Dark.webp","/uploads/products/209-Highlighter.webp","/uploads/products/209-Light.webp","/uploads/products/AMB_1_209_1.webp"]', '{}', '[]', '[]',
  '["Blue","White"]', '{"Blue":"#6e7e9d","White":"#cdd2dc"}',
  1, 0, 0, 0, '209 Series | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', '209 Series, Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1791276685061-1ef7ea', 'TMX-SKU-TMX-442', '208', '208', 'TMX-442', '8907850827478', '208', 0, 0, 100,
  'metallic', 'Metallic Finish', 'coll-metallic', 'Metallic Collection', '300mm X 600mm', '',
  'Glossy', '', 'Ceramic Wall Tile', 'Imported', 'Green', 'Wall', '', '',
  '["/uploads/products/208-Concept-AMB_2.webp","/uploads/products/208-Dark.webp","/uploads/products/208-Highlighter.webp","/uploads/products/208-Light.webp","/uploads/products/208-Concept-AMB_1-copy.webp"]', '{}', '[]', '[]',
  '["Green","Beige"]', '{"Green":"#525f53","Beige":"#bfbbaa"}',
  1, 0, 0, 0, '208 | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', '208, Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1791272262079-1bc2cb', 'TMX-SKU-TMX-364', '202', '202', 'TMX-364', '8904068185079', 'The classics never go out of fashion. There’s uniformity, drama and uniqueness in square tiles. If you are looking for a refined look that also embraces your bathroom fixtures, this is the answer.', 0, 0, 100,
  'metallic', 'Metallic Finish', 'coll-metallic', 'Metallic Collection', '600mm X 300mm', '',
  'Glossy', '', 'Ceramic Wall Tile', 'Imported', 'Beige', 'Wall', '', '',
  '["/uploads/products/202-E.webp","/uploads/products/202-Light.webp","/uploads/products/202.webp"]', '{}', '[]', '[]',
  '["Beige"]', '{"Beige":"#beb0a0"}',
  1, 0, 0, 0, '202 | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', '203, Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1791271019514-1ddda0', 'TMX-SKU-TMX-295', '204', '204', 'TMX-295', '8904413033819', 'Sophisticated styling with a generous splash of glamour. This shining and mesmerising range is all about taking luxury to the next level.', 0, 0, 100,
  'metallic', 'Metallic Finish', 'coll-metallic', 'Metallic Collection', '300mm X 600mm', '',
  'Glossy, Metallic', '', 'Ceramic Tiles', 'Imported', 'White', 'Wall', '', '',
  '["/uploads/products/204-Conept-AMB_2.webp","/uploads/products/204-Light.webp","/uploads/products/204-Highlighter.webp","/uploads/products/204-Dark.webp","/uploads/products/204-Conept-AMB_1.webp","/uploads/products/204-Dark-Light.webp","/uploads/products/204-HL-Light.webp","/uploads/products/204-HL.webp"]', '{}', '["marble"]', '[]',
  '["White"]', '{"White":"#fdfdfd"}',
  1, 0, 0, 0, '204 | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', '204, Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1791270275205-967e69', 'TMX-SKU-TMX-464', '203', '203', 'TMX-464', '8902165427964', 'Bring back a classic, old-school Chevron linear pattern with a contemporary groove and gloss styling. An ideal space to gaze for your restroom time-outs.', 0, 0, 100,
  'metallic', 'Metallic Finish', 'coll-metallic', 'Metallic Collection', '300mm X 600mm', '',
  'Glossy, Metallic', '', 'Ceramic Tiles', 'Imported', 'White', 'Wall', '', '',
  '["/uploads/products/203-Conept-AMB_1.webp","/uploads/products/203-Dark.webp","/uploads/products/203-Light.webp","/uploads/products/203-Conept-AMB_2.webp","/uploads/products/203-Mix-AMB_1.webp","/uploads/products/203-Mix-AMB_2.webp","/uploads/products/203-Mix-AMB_3.webp"]', '{}', '["marble"]', '[]',
  '["White"]', '{"White":"#f0eff4"}',
  1, 0, 0, 0, '203 | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', '203, Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-1791108278749-f626e4', 'TMX-SKU-TMX-351', '201', '201', 'TMX-351', NULL, 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', 0, 0, 100,
  'metallic', 'Metallic Finish', 'coll-metallic', 'Metallic Collection', '600mm X 300mm', '',
  'Metallic, Glossy', '', 'Ceramic Tiles', 'Imported', 'Beige', 'Wall', '', '',
  '["/uploads/products/201-L-D-AMB_1.webp","/uploads/products/201-Light-2.webp","/uploads/products/201-Dark-5.webp","/uploads/products/201-L-D-AMB_2.webp","/uploads/products/201-Mix-AMB_4.webp","/uploads/products/201-Light_3.webp"]', '{"Bathroom Tiles":"/uploads/products/201-Light_3.webp","bathroom-tiles":"/uploads/products/201-Light_3.webp","Kitchen Tiles":"/uploads/products/201-L-D-AMB_2.webp","kitchen-tiles":"/uploads/products/201-L-D-AMB_2.webp"}', '["marble"]', '[]',
  '["Beige"]', '{"Beige":"#bcc0c5"}',
  1, 0, 0, 0, '201 | Timex Ceramic', 'The simplicity and elegance of a white tile with tasteful golden veins is undeniable. No matter the design of your bathroom, it will brighten it up even in the dimmest of lights.', '201, Metallic Finish, tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);

INSERT INTO `products` (
  `id`, `sku`, `slug`, `name`, `code`, `barcode`, `description`, `price`, `b2b_price`, `inventory`,
  `category_id`, `category_name`, `collection_id`, `collection_name`, `size`, `thickness`,
  `finish`, `look`, `material`, `origin`, `color`, `application`, `pattern`, `water_absorption`,
  `images_json`, `space_images_json`, `secondary_categories_json`, `subcategories_json`,
  `available_colors_json`, `color_hexes_json`,
  `is_active`, `is_new_arrival`, `is_bestseller`, `show_tile_of_spain_badge`, `meta_title`, `meta_description`, `keywords`
) VALUES (
  'prod-brick-2', 'TMX-BRI-002', 'ascot', 'Ascot', 'TMX-218', '8901234561722', 'Amplify the style quotient of your space with the majestic stone-inspired marvels from the Ascot series. Creating a beautiful symmetry, these tiles can light up even the most lackluster space into a warm and subtle haven of tranquility.', 635, 450, 860,
  'stone', 'Stone', 'coll-stone', 'Stone Collection', '600mm x 200mm', '',
  'Matt', 'Brick Look', 'Porcelain', 'European Tiles, Spanish Tiles', 'White', 'Exterior, Wall & Floor', 'Rectangle', '',
  '["/uploads/products/Asc-bl-1.webp","/uploads/products/Ascot-Blanco-600-x-200-1.webp","/uploads/products/Ascot-Cuero-600-x-200-1.webp","/uploads/products/Ascot-Fuego-600-x-200-1.webp","/uploads/products/Ascot-Mix-600-x-200-1.webp","/uploads/products/61-1.webp","/uploads/products/ASCOT_BLANCO_20x60_AMAZONIA_GRIS_20x120_AMB-1.webp","/uploads/products/ASCOT_BLANCO_20X60_DET-1-1.webp","/uploads/products/ASCOT_MIX_20x60_BLEND_SANDMIX_20x120_CONCRETE_62x120_AMB-1.webp","/uploads/products/IMG-20201210-WA0016-1.webp"]', '{}', '["brick"]', '[]',
  '["White","Brown","Beige"]', '{"White":"#cfcac2","Brown":"#836451","Beige":"#b69d80"}',
  1, 0, 0, 0, 'Ascot | Timex Ceramic Premium Tiles', 'Luxury architectural brick design tiles crafted for contemporary residential and hospitality projects. High stain resistance.', 'Ascot, Brick Look, Brick Look, vitrified tiles, timex ceramic'
) ON DUPLICATE KEY UPDATE
  `color` = VALUES(`color`),
  `application` = VALUES(`application`),
  `category_id` = VALUES(`category_id`),
  `category_name` = VALUES(`category_name`),
  `available_colors_json` = VALUES(`available_colors_json`),
  `color_hexes_json` = VALUES(`color_hexes_json`),
  `space_images_json` = VALUES(`space_images_json`),
  `secondary_categories_json` = VALUES(`secondary_categories_json`),
  `subcategories_json` = VALUES(`subcategories_json`),
  `images_json` = VALUES(`images_json`),
  `finish` = VALUES(`finish`),
  `look` = VALUES(`look`);


SELECT 'Timex Ceramic schema migration and 106 products sync completed successfully.' AS status;
