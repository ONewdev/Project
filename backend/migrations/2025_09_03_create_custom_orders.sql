-- Create table custom_orders (if not exists)
CREATE TABLE IF NOT EXISTS `custom_orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `category` varchar(64) NOT NULL,
  `product_type` varchar(100) NOT NULL,
  `width` decimal(10,2) NOT NULL,
  `height` decimal(10,2) NOT NULL,
  `unit` enum('cm','m') NOT NULL DEFAULT 'cm',
  `color` varchar(50) DEFAULT '',
  `quantity` int(11) NOT NULL DEFAULT '1',
  `details` text,
  `has_screen` tinyint(1) NOT NULL DEFAULT '0',
  `round_frame` tinyint(1) NOT NULL DEFAULT '0',
  `swing_type` varchar(50) DEFAULT 'บานเดี่ยว',
  `mode` varchar(50) DEFAULT 'มาตรฐาน',
  `fixed_left_m2` decimal(10,3) NOT NULL DEFAULT '0.000',
  `fixed_right_m2` decimal(10,3) NOT NULL DEFAULT '0.000',
  `price` int(11) NOT NULL DEFAULT '0',
  `status` enum('pending','approved','waiting_payment','paid','in_production','delivering','completed','rejected') NOT NULL DEFAULT 'pending',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

