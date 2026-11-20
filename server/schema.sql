-- Timex Ceramic MySQL Database Schema
-- Run this script in your MySQL server (e.g. via MySQL Workbench, phpMyAdmin, or mysql CLI)

CREATE DATABASE IF NOT EXISTS `timex_ceramic` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `timex_ceramic`;

-- 1. Admin Users Table
CREATE TABLE IF NOT EXISTS `admin_users` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `username` VARCHAR(100) NOT NULL UNIQUE,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` VARCHAR(50) NOT NULL DEFAULT 'ADMIN',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Products Table
CREATE TABLE IF NOT EXISTS `products` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
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
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `meta_title` VARCHAR(255) NULL,
  `meta_description` TEXT NULL,
  `keywords` TEXT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_category` (`category_id`),
  INDEX `idx_slug` (`slug`),
  INDEX `idx_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. SEO Metadata Table (for pages, products, blogs, collections)
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

-- 4. SEO Redirects Table (301 / 302 Redirect Manager)
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

-- 5. SEO 404 Monitor Table
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

-- 6. SEO Global Settings Table
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

-- 4. Enquiries Table (Quotes, Visits, Contact, Product RFQs)
CREATE TABLE IF NOT EXISTS `enquiries` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
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
  INDEX `idx_type` (`type`),
  INDEX `idx_status` (`status`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Administrator Setup
-- No default or predictable admin credentials are seeded into the database.
-- The initial administrator account is configured through the secure /admin First-Time Setup Wizard.

