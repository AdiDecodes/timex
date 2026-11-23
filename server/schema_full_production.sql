-- =============================================================================
-- TIMEX CERAMIC - SENIOR ARCHITECT PRODUCTION DATABASE MIGRATION SCRIPT
-- =============================================================================
-- Safe, 100% Idempotent DDL & Schema Upgrades
-- Unifies data storage so all application modules use MySQL as Single Source of Truth
-- Without breaking existing data or pipelines.
-- =============================================================================

CREATE DATABASE IF NOT EXISTS `timex_ceramic` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `timex_ceramic`;

-- 1. Admin Users
CREATE TABLE IF NOT EXISTS `admin_users` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `username` VARCHAR(100) NOT NULL UNIQUE,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` VARCHAR(50) NOT NULL DEFAULT 'ADMIN',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Products Table (Base)
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

-- 2.1 Products Table: Missing Columns (Idempotent Additions)
-- Execute individual ALTER TABLE statements with safety wrappers in DB migration scripts
ALTER TABLE `products` ADD COLUMN IF NOT EXISTS `is_trashed` BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE `products` ADD COLUMN IF NOT EXISTS `available_sizes_json` LONGTEXT NULL;
ALTER TABLE `products` ADD COLUMN IF NOT EXISTS `color_images_json` LONGTEXT NULL;
ALTER TABLE `products` ADD COLUMN IF NOT EXISTS `size_images_json` LONGTEXT NULL;
ALTER TABLE `products` ADD COLUMN IF NOT EXISTS `spaces_json` LONGTEXT NULL;
ALTER TABLE `products` ADD COLUMN IF NOT EXISTS `tiles_by_space` VARCHAR(500) NULL;
ALTER TABLE `products` ADD COLUMN IF NOT EXISTS `combination_images_json` LONGTEXT NULL;
ALTER TABLE `products` ADD COLUMN IF NOT EXISTS `combination_product_mappings_json` LONGTEXT NULL;
ALTER TABLE `products` ADD COLUMN IF NOT EXISTS `edge_type` VARCHAR(100) NULL;
ALTER TABLE `products` ADD COLUMN IF NOT EXISTS `weight` VARCHAR(50) NULL;
ALTER TABLE `products` ADD COLUMN IF NOT EXISTS `kg_per_box` VARCHAR(50) NULL;
ALTER TABLE `products` ADD COLUMN IF NOT EXISTS `pcs_per_box` VARCHAR(50) NULL;
ALTER TABLE `products` ADD COLUMN IF NOT EXISTS `packing_details` VARCHAR(100) NULL;
ALTER TABLE `products` ADD COLUMN IF NOT EXISTS `sft_per_box` VARCHAR(50) NULL;
ALTER TABLE `products` ADD COLUMN IF NOT EXISTS `shape` VARCHAR(100) NULL;
ALTER TABLE `products` ADD COLUMN IF NOT EXISTS `shapes_json` LONGTEXT NULL;
ALTER TABLE `products` ADD COLUMN IF NOT EXISTS `tiles_by_shape` VARCHAR(100) NULL;
ALTER TABLE `products` ADD COLUMN IF NOT EXISTS `custom_shape` VARCHAR(100) NULL;
ALTER TABLE `products` ADD COLUMN IF NOT EXISTS `tiles_by_size` VARCHAR(100) NULL;
ALTER TABLE `products` ADD COLUMN IF NOT EXISTS `catalogue_url` VARCHAR(500) NULL;
ALTER TABLE `products` ADD COLUMN IF NOT EXISTS `catalogue_name` VARCHAR(255) NULL;
ALTER TABLE `products` ADD COLUMN IF NOT EXISTS `catalogue_media_id` VARCHAR(100) NULL;
ALTER TABLE `products` ADD COLUMN IF NOT EXISTS `product_pdf` VARCHAR(500) NULL;
ALTER TABLE `products` ADD COLUMN IF NOT EXISTS `video_url` VARCHAR(500) NULL;
ALTER TABLE `products` ADD COLUMN IF NOT EXISTS `video_position` INT NOT NULL DEFAULT 1;
ALTER TABLE `products` ADD COLUMN IF NOT EXISTS `video_enabled` BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE `products` ADD COLUMN IF NOT EXISTS `extra_specs_json` LONGTEXT NULL;

-- 3. Categories Table (Unified Taxonomies)
CREATE TABLE IF NOT EXISTS `categories` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `slug` VARCHAR(150) NOT NULL UNIQUE,
  `description` TEXT NULL,
  `banner` VARCHAR(500) NULL,
  `parent_id` VARCHAR(64) NULL,
  `media_id` VARCHAR(64) NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'published',
  `display_order` INT NOT NULL DEFAULT 1,
  `seo_title` VARCHAR(255) NULL,
  `meta_description` TEXT NULL,
  `focus_keyword` VARCHAR(255) NULL,
  `canonical_url` VARCHAR(255) NULL,
  `og_title` VARCHAR(255) NULL,
  `og_description` TEXT NULL,
  `og_image` VARCHAR(500) NULL,
  `twitter_title` VARCHAR(255) NULL,
  `twitter_description` TEXT NULL,
  `twitter_image` VARCHAR(500) NULL,
  `twitter_card` VARCHAR(50) NOT NULL DEFAULT 'summary_large_image',
  `schema_type` VARCHAR(100) NULL,
  `schema_json` LONGTEXT NULL,
  `custom_code` LONGTEXT NULL,
  `show_in_nav` BOOLEAN NOT NULL DEFAULT TRUE,
  `show_in_explore` BOOLEAN NOT NULL DEFAULT TRUE,
  `show_in_world_of_tiles` BOOLEAN NOT NULL DEFAULT TRUE,
  `redirect_urls_json` TEXT NULL,
  `is_trashed` BOOLEAN NOT NULL DEFAULT FALSE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_cat_slug` (`slug`),
  INDEX `idx_cat_trashed` (`is_trashed`),
  INDEX `idx_cat_order` (`display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Spaces Table (Architectural Applications)
CREATE TABLE IF NOT EXISTS `spaces` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `slug` VARCHAR(150) NOT NULL UNIQUE,
  `space_area` VARCHAR(150) NULL,
  `page_title` VARCHAR(255) NULL,
  `description` TEXT NULL,
  `image` VARCHAR(500) NULL,
  `media_id` VARCHAR(64) NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'published',
  `display_order` INT NOT NULL DEFAULT 1,
  `seo_title` VARCHAR(255) NULL,
  `meta_description` TEXT NULL,
  `focus_keyword` VARCHAR(255) NULL,
  `secondary_keywords` TEXT NULL,
  `canonical_url` VARCHAR(255) NULL,
  `robots_index` BOOLEAN NOT NULL DEFAULT TRUE,
  `robots_follow` BOOLEAN NOT NULL DEFAULT TRUE,
  `og_title` VARCHAR(255) NULL,
  `og_description` TEXT NULL,
  `og_image` VARCHAR(500) NULL,
  `schema_type` VARCHAR(100) NULL,
  `schema_data` LONGTEXT NULL,
  `seo_score` INT NOT NULL DEFAULT 80,
  `is_trashed` BOOLEAN NOT NULL DEFAULT FALSE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_space_slug` (`slug`),
  INDEX `idx_space_trashed` (`is_trashed`),
  INDEX `idx_space_order` (`display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Collections Table
CREATE TABLE IF NOT EXISTS `collections` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `slug` VARCHAR(150) NOT NULL UNIQUE,
  `description` TEXT NULL,
  `image` VARCHAR(500) NULL,
  `display_order` INT NOT NULL DEFAULT 1,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `is_trashed` BOOLEAN NOT NULL DEFAULT FALSE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_coll_slug` (`slug`),
  INDEX `idx_coll_trashed` (`is_trashed`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Media Library
CREATE TABLE IF NOT EXISTS `media` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `filename` VARCHAR(255) NOT NULL,
  `original_name` VARCHAR(255) NULL,
  `url` VARCHAR(500) NOT NULL,
  `mime_type` VARCHAR(100) NULL,
  `file_type` VARCHAR(50) NULL DEFAULT 'image',
  `size` BIGINT NOT NULL DEFAULT 0,
  `dimensions` VARCHAR(50) NULL,
  `uploaded_by` VARCHAR(100) NULL DEFAULT 'admin',
  `alt_text` VARCHAR(255) NULL,
  `caption TEXT` NULL,
  `is_trashed` BOOLEAN NOT NULL DEFAULT FALSE,
  `deleted_at` TIMESTAMP NULL,
  `deleted_by` VARCHAR(100) NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_media_url` (`url`),
  INDEX `idx_media_trashed` (`is_trashed`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Videos (Watch & Choose)
CREATE TABLE IF NOT EXISTS `videos` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `display_order` INT NOT NULL DEFAULT 1,
  `platform` VARCHAR(50) NOT NULL DEFAULT 'YouTube',
  `post_type` VARCHAR(50) NOT NULL DEFAULT 'Short',
  `url` VARCHAR(500) NOT NULL,
  `video_id` VARCHAR(100) NULL,
  `shortcode` VARCHAR(100) NULL,
  `categories_json` TEXT NULL,
  `thumbnail` VARCHAR(500) NULL,
  `hq_thumbnail` VARCHAR(500) NULL,
  `embed_url` VARCHAR(500) NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'published',
  `is_trashed` BOOLEAN NOT NULL DEFAULT FALSE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_video_trashed` (`is_trashed`),
  INDEX `idx_video_order` (`display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Managed Pages
CREATE TABLE IF NOT EXISTS `pages` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(150) NOT NULL UNIQUE,
  `path` VARCHAR(255) NOT NULL,
  `template` VARCHAR(100) NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'Published',
  `meta_title` VARCHAR(255) NULL,
  `meta_description` TEXT NULL,
  `content_json` LONGTEXT NULL,
  `is_trashed` BOOLEAN NOT NULL DEFAULT FALSE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_page_slug` (`slug`),
  INDEX `idx_page_trashed` (`is_trashed`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Site Settings (Key-Value configuration for htaccess, custom_code, llms.txt, shapes, sizes)
CREATE TABLE IF NOT EXISTS `site_settings` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `setting_key` VARCHAR(100) NOT NULL UNIQUE,
  `setting_value` LONGTEXT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_setting_key` (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Colors Table
CREATE TABLE IF NOT EXISTS `colors` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `hex` VARCHAR(20) NOT NULL DEFAULT '#808080',
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `display_order` INT NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_color_slug` (`slug`),
  INDEX `idx_color_active` (`is_active`),
  INDEX `idx_color_order` (`display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Category FAQs Table
CREATE TABLE IF NOT EXISTS `category_faqs` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `category_id` VARCHAR(100) NOT NULL,
  `question` TEXT NOT NULL,
  `answer` LONGTEXT NOT NULL,
  `display_order` INT NOT NULL DEFAULT 1,
  `status` VARCHAR(20) NOT NULL DEFAULT 'published',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_faq_category` (`category_id`),
  INDEX `idx_faq_status` (`status`),
  INDEX `idx_faq_order` (`display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. Blogs Table
CREATE TABLE IF NOT EXISTS `blogs` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `title` VARCHAR(255) NOT NULL,
  `subtitle` TEXT NULL,
  `category` VARCHAR(100) NOT NULL DEFAULT 'DESIGN TIPS',
  `author_name` VARCHAR(100) NULL,
  `author_role` VARCHAR(100) NULL,
  `author_avatar` VARCHAR(500) NULL,
  `cover_image` VARCHAR(500) NULL,
  `excerpt` TEXT NULL,
  `content_json` LONGTEXT NULL,
  `tags_json` TEXT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'Published',
  `read_time` VARCHAR(50) NULL DEFAULT '5 Min Read',
  `meta_title` VARCHAR(255) NULL,
  `meta_description` TEXT NULL,
  `keywords` TEXT NULL,
  `is_trashed` BOOLEAN NOT NULL DEFAULT FALSE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_blog_slug` (`slug`),
  INDEX `idx_blog_trashed` (`is_trashed`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. Enquiries Table
CREATE TABLE IF NOT EXISTS `enquiries` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `type` VARCHAR(50) NOT NULL DEFAULT 'GENERAL',
  `name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(50) NOT NULL,
  `company` VARCHAR(150) NULL,
  `message` TEXT NOT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'PENDING',
  `page_source` VARCHAR(255) NULL,
  `details_json` LONGTEXT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_enq_status` (`status`),
  INDEX `idx_enq_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. SEO Metadata Table
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
  INDEX `idx_seo_page_path` (`page_path`),
  INDEX `idx_seo_content_type` (`content_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 15. SEO Redirects Table
CREATE TABLE IF NOT EXISTS `seo_redirects` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `source_url` VARCHAR(255) NOT NULL UNIQUE,
  `destination_url` VARCHAR(255) NOT NULL,
  `redirect_type` INT NOT NULL DEFAULT 301,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `hit_count` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_redir_source_url` (`source_url`),
  INDEX `idx_redir_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 16. SEO 404 Monitor Table
CREATE TABLE IF NOT EXISTS `seo_404_logs` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `url` VARCHAR(255) NOT NULL UNIQUE,
  `referrer` VARCHAR(500) NULL,
  `user_agent` VARCHAR(500) NULL,
  `hit_count` INT NOT NULL DEFAULT 1,
  `last_detected` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `resolved_to` VARCHAR(255) NULL,
  INDEX `idx_404_url` (`url`),
  INDEX `idx_404_hits` (`hit_count`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 17. SEO Global Settings Table
CREATE TABLE IF NOT EXISTS `seo_settings` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `site_name` VARCHAR(255) NOT NULL DEFAULT 'Timex Ceramic',
  `site_url` VARCHAR(255) NOT NULL DEFAULT 'https://www.timexceramic.com',
  `default_title_template` VARCHAR(255) NOT NULL DEFAULT '%s | Timex Ceramic',
  `default_meta_description` TEXT NULL,
  `default_og_image` VARCHAR(500) NULL,
  `default_robots_index` BOOLEAN NOT NULL DEFAULT TRUE,
  `default_robots_follow` BOOLEAN NOT NULL DEFAULT TRUE,
  `robots_txt_content` TEXT NULL,
  `sitemap_config` LONGTEXT NULL,
  `organization_data` LONGTEXT NULL,
  `verification_codes` LONGTEXT NULL,
  `social_links` LONGTEXT NULL,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

