-- phpMyAdmin SQL Dump
-- version 5.1.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Sep 02, 2025 at 10:47 AM
-- Server version: 5.7.24
-- PHP Version: 8.0.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `aluminium_shop`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `username`, `password`) VALUES
(1, 'admin', '111111');

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `category_id` int(11) NOT NULL,
  `category_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`category_id`, `category_name`) VALUES
(1, 'บานติดตาย'),
(2, 'บานเลื่อน'),
(3, 'บานกระทุ้ง'),
(4, 'ตู้'),
(5, 'กระจกเทมเปอร์'),
(6, 'มุ้ง'),
(7, 'บานเฟี่ยม'),
(8, 'บานรางแขวน'),
(9, 'บานสวิง');

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `contact`
--

CREATE TABLE `contact` (
  `name` varchar(255) NOT NULL,
  `tel` text NOT NULL,
  `gmail` varchar(255) NOT NULL,
  `map` varchar(255) NOT NULL,
  `time` text NOT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `id` int(1) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `contact`
--

INSERT INTO `contact` (`name`, `tel`, `gmail`, `map`, `time`, `logo`, `id`, `status`) VALUES
('Aluglaue Pro', '099-999-9998', 'A&G@gmail.com', 'https://www.google.com/maps/embed?pb=!4v1752974298441!6m8!1m7!1s8mYw-Ou6n1GQUv1RwTxmsQ!2m2!1d20.36825582310125!2d99.87733385345288!3f247.06!4f-8.099999999999994!5f0.7820865974627469', '08:00 - 16:00 น.', NULL, 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status` enum('active','inactive','banned') DEFAULT 'active',
  `profile_picture` varchar(255) DEFAULT NULL,
  `is_verified` tinyint(1) DEFAULT '0',
  `verification_token` varchar(255) DEFAULT NULL,
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expires` datetime DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text,
  `district` varchar(100) DEFAULT NULL,
  `province` varchar(100) DEFAULT NULL,
  `postal_code` varchar(5) DEFAULT NULL,
  `subdistrict_id` int(11) DEFAULT NULL,
  `district_id` int(11) DEFAULT NULL,
  `province_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `email`, `password`, `name`, `created_at`, `updated_at`, `status`, `profile_picture`, `is_verified`, `verification_token`, `reset_token`, `reset_token_expires`, `phone`, `address`, `district`, `province`, `postal_code`, `subdistrict_id`, `district_id`, `province_id`) VALUES
(2, 'test@gmail.com', '$2b$10$8z.xBLdlYfFzT1dHhVR9uetRP6ilSTBj5KuMliRjS9fCcwX6UC2W2', 'test', '2025-06-21 09:12:09', '2025-09-02 02:49:02', 'active', '/uploads/profiles/1756781341646-698877800.png', 0, NULL, NULL, NULL, '', '', '', '', '', NULL, NULL, NULL),
(3, '5555@gmail.com', '$2b$10$WFRXTemwQnU5Wu9dPb7cIOQsDkp0z4gOxxUnQcrlkRN9IyA9xSu6W', 'new', '2025-06-22 07:10:58', '2025-08-16 06:14:44', 'active', NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(5, 'suchao@g.com', '$2b$10$50JngMBtrT75SixwnwhCpugrjwbcr7nfuBNKdGWvmOdsrVqCArJzW', 'suchao', '2025-08-03 09:35:45', '2025-08-03 09:37:00', 'active', '/uploads/profiles/1754213806596-84035250.jpg', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(6, 'test2@gmail.com', '$2b$10$VvPYgDUQj1Dq.7dAhweMzOjtG/6YDokkquER3BymR1vktiu1g5iyK', 'test2', '2025-08-04 02:19:49', '2025-08-04 02:24:09', 'active', '/uploads/profiles/1754274248776-442080720.png', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `districts`
--

CREATE TABLE `districts` (
  `id` int(11) NOT NULL,
  `name_th` varchar(150) NOT NULL,
  `province_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `districts`
--

INSERT INTO `districts` (`id`, `name_th`, `province_id`) VALUES
(1, 'เมืองเชียงราย', 1),
(2, 'พระนคร', 2),
(3, 'คลองเตย', 2),
(4, 'เมืองกระบี่', 3),
(5, 'เมืองกาญจนบุรี', 4),
(6, 'เมืองกาฬสินธุ์', 5),
(7, 'เมืองกำแพงเพชร', 6),
(8, 'เมืองขอนแก่น', 7),
(9, 'เมืองจันทบุรี', 8),
(10, 'เมืองฉะเชิงเทรา', 9),
(11, 'เมืองชลบุรี', 10),
(12, 'เมืองชัยนาท', 11),
(13, 'เมืองชัยภูมิ', 12),
(14, 'เมืองชุมพร', 13),
(15, 'เมืองเชียงใหม่', 14),
(16, 'เมืองตรัง', 15),
(17, 'เมืองตราด', 16),
(18, 'เมืองตาก', 17),
(19, 'พระนคร', 2),
(20, 'คลองเตย', 2),
(21, 'เมืองเชียงใหม่', 14),
(22, 'แม่ริม', 14),
(23, 'เมืองภูเก็ต', 42),
(24, 'กะทู้', 42),
(25, 'เมืองขอนแก่น', 7),
(26, 'บ้านไผ่', 7),
(27, 'เมืองนครราชสีมา', 21),
(28, 'ปากช่อง', 21),
(29, 'เมืองชลบุรี', 10),
(30, 'ศรีราชา', 10),
(31, 'เมืองระยอง', 50),
(32, 'บ้านฉาง', 50),
(33, 'พระนครศรีอยุธยา', 33),
(34, 'วังน้อย', 33),
(35, 'เมืองนครสวรรค์', 23),
(36, 'พระนคร', 2),
(37, 'คลองเตย', 2),
(38, 'เมืองเชียงใหม่', 14),
(39, 'แม่ริม', 14),
(40, 'เมืองภูเก็ต', 42),
(41, 'กะทู้', 42),
(42, 'เมืองขอนแก่น', 7),
(43, 'บ้านไผ่', 7),
(44, 'เมืองนครราชสีมา', 21),
(45, 'ปากช่อง', 21),
(46, 'เมืองชลบุรี', 10),
(47, 'ศรีราชา', 10),
(48, 'เมืองระยอง', 50),
(49, 'บ้านฉาง', 50),
(50, 'พระนครศรีอยุธยา', 33),
(51, 'วังน้อย', 33),
(52, 'เมืองนครสวรรค์', 23),
(53, 'ตาคลี', 23),
(54, 'เมืองสุราษฎร์ธานี', 68),
(55, 'เกาะสมุย', 68),
(56, 'หาดใหญ่', 58),
(57, 'เมืองสงขลา', 58),
(58, 'เมืองอุบลราชธานี', 77),
(59, 'วารินชำราบ', 77),
(60, 'เมืองอุดรธานี', 74),
(61, 'บ้านดุง', 74),
(62, 'เมืองลำปาง', 53),
(63, 'เมืองเพชรบุรี', 39);

-- --------------------------------------------------------

--
-- Table structure for table `favorites`
--

CREATE TABLE `favorites` (
  `id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `inbox`
--

CREATE TABLE `inbox` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `inbox`
--

INSERT INTO `inbox` (`id`, `name`, `email`, `phone`, `subject`, `message`, `created_at`) VALUES
(1, 'test', 'test@gmail.com', '099-999-9999', 'test', '-', '2025-08-16 08:48:29');

-- --------------------------------------------------------

--
-- Table structure for table `knex_migrations`
--

CREATE TABLE `knex_migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `batch` int(11) DEFAULT NULL,
  `migration_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `knex_migrations_lock`
--

CREATE TABLE `knex_migrations_lock` (
  `index` int(10) UNSIGNED NOT NULL,
  `is_locked` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `knex_migrations_lock`
--

INSERT INTO `knex_migrations_lock` (`index`, `is_locked`) VALUES
(1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `materials`
--

CREATE TABLE `materials` (
  `id` int(11) NOT NULL,
  `code` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `unit` varchar(50) NOT NULL,
  `quantity` decimal(10,2) DEFAULT '0.00',
  `price` decimal(10,2) DEFAULT '0.00',
  `image` longtext,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `materials`
--

INSERT INTO `materials` (`id`, `code`, `name`, `unit`, `quantity`, `price`, `image`, `created_at`) VALUES
(1, 'MAT001', 'เสากุญแจ', ' 6 เมตร', '6.00', '3.00', '/uploads/materials/1755957806919-761394985.png', '2025-08-23 14:03:27'),
(2, 'MAT002', 'เสาเกี่ยว', ' 6 เมตร', '20.00', '3.00', '/uploads/materials/1755957906987-350822087.png', '2025-08-23 14:05:07'),
(3, 'MAT003', 'เสาตาย', ' 6 เมตร', '5.00', '3.00', '/uploads/materials/1756100256354-118004254.png', '2025-08-25 05:37:36'),
(10, 'MAT004', 'ขวางบน', ' 6 เมตร', '4.00', '5.00', '/uploads/materials/1756105359263-960996652.png', '2025-08-25 07:02:39'),
(11, 'MAT005', 'ขวางล่าง', ' 6 เมตร', '4.00', '5.00', '/uploads/materials/1756106380822-733739253.png', '2025-08-25 07:19:41'),
(12, 'MAT006', 'เฟรมข้างติดกล่อง', ' 6 เมตร', '4.00', '5.00', '/uploads/materials/1756106766655-941555975.png', '2025-08-25 07:26:07'),
(13, 'MAT007', 'เฟรมบนติดกล่อง', ' 6 เมตร', '4.00', '800.00', '/uploads/materials/1756106861944-624400680.png', '2025-08-25 07:27:42'),
(14, 'MAT008', 'เฟรมล่างติดกล่อง', ' 6 เมตร', '5.00', '5.00', '/uploads/materials/1756107091607-899972919.png', '2025-08-25 07:31:32'),
(15, 'MAT009', 'ขวางบนสวิง', ' 6 เมตร', '5.00', '800.00', '/uploads/materials/1756107348401-487946691.png', '2025-08-25 07:35:48'),
(16, 'MAT010', 'ขวางล่างสวิง', ' 6 เมตร', '5.00', '800.00', '/uploads/materials/1756109162744-777702024.png', '2025-08-25 08:06:03'),
(17, 'MAT011', 'เสาขวางสวิง', ' 6 เมตร', '5.00', '5.00', '/uploads/materials/1756109247972-735255004.png', '2025-08-25 08:07:28'),
(18, 'MAT012', 'รางแขวนใหญ่', ' 6 เมตร', '5.00', '3.00', '/uploads/materials/1756109293889-227458520.png', '2025-08-25 08:08:14'),
(19, 'MAT013', 'ฝาปิด', ' 6 เมตร', '5.00', '800.00', '/uploads/materials/1756109427436-501309439.png', '2025-08-25 08:10:27'),
(20, 'MAT014', 'ธรณีสวิง', ' 6 เมตร', '5.00', '800.00', '/uploads/materials/1756109458817-221673925.png', '2025-08-25 08:10:59'),
(21, 'MAT015', 'ตบเรียบ', ' 6 เมตร', '5.00', '500.00', '/uploads/materials/1756109487321-208707563.png', '2025-08-25 08:11:27'),
(22, 'MAT016', 'ตบร่อง', ' 6 เมตร', '5.00', '800.00', '/uploads/materials/1756109511696-970717669.png', '2025-08-25 08:11:52'),
(23, 'MAT017', 'ตบธรณี', ' 6 เมตร', '5.00', '800.00', '/uploads/materials/1756109545932-842194145.png', '2025-08-25 08:12:26'),
(24, 'MAT018', 'ชนกลางมุ้งบานเลื่อน', ' 6 เมตร', '4.00', '3.00', '/uploads/materials/1756109583083-8808970.png', '2025-08-25 08:13:03'),
(25, 'MAT019', 'ชนกลางบานเลื่อน', ' 6 เมตร', '6.00', '5.00', '/uploads/materials/1756109611993-350793005.png', '2025-08-25 08:13:32'),
(26, 'MAT020', 'คิ้วประตูสวิง', ' 6 เมตร', '5.00', '800.00', '/uploads/materials/1756109640282-661291562.png', '2025-08-25 08:14:00'),
(27, 'MAT021', 'คิ้วเทใหญ่', ' 6 เมตร', '5.00', '800.00', '/uploads/materials/1756109665822-654629135.png', '2025-08-25 08:14:26'),
(28, 'MAT022', 'คิ้วเทเล็ก', ' 6 เมตร', '6.00', '500.00', '/uploads/materials/1756109689978-313682085.png', '2025-08-25 08:14:50'),
(29, 'MAT023', 'กล่องเรียบ', ' 6 เมตร', '5.00', '3.00', '/uploads/materials/1756109713697-6713072.png', '2025-08-25 08:15:14'),
(30, 'MAT024', 'กล่องร่อง', ' 6 เมตร', '6.00', '800.00', '/uploads/materials/1756109741217-715560502.png', '2025-08-25 08:15:41'),
(31, 'MAT025', 'กล่องเปิด', ' 6 เมตร', '4.00', '3.00', '/uploads/materials/1756109771934-532516674.png', '2025-08-25 08:16:12'),
(32, 'MAT026', 'กรอบมุ้งบานเลื่อน', ' 6 เมตร', '5.00', '3.00', '/uploads/materials/1756109792765-798246986.png', '2025-08-25 08:16:33'),
(33, 'MAT027', 'กรอบบานกระทุ้ง', ' 6 เมตร', '5.00', '3.00', '/uploads/materials/1756109812028-734886307.png', '2025-08-25 08:16:52'),
(34, 'MAT028', 'กรอบนอกกระทุ้ง-แบบยูเนี่ยน', ' 6 เมตร', '4.00', '3.00', '/uploads/materials/1756109831186-126135913.png', '2025-08-25 08:17:11');

-- --------------------------------------------------------

--
-- Table structure for table `material_requisition`
--

CREATE TABLE `material_requisition` (
  `requisition_id` int(11) NOT NULL,
  `requisition_by` varchar(255) NOT NULL,
  `requisition_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `remarks` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `material_requisition_items`
--

CREATE TABLE `material_requisition_items` (
  `item_id` int(11) NOT NULL,
  `requisition_id` int(11) NOT NULL,
  `material_id` int(11) NOT NULL,
  `quantity_requested` decimal(10,2) NOT NULL,
  `quantity_issued` decimal(10,2) DEFAULT '0.00',
  `remarks` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `material_usage`
--

CREATE TABLE `material_usage` (
  `id` int(11) NOT NULL,
  `material_id` int(11) NOT NULL,
  `used_quantity` decimal(10,2) NOT NULL,
  `used_by` varchar(255) DEFAULT NULL,
  `usage_note` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `sender_id` int(11) DEFAULT NULL,
  `receiver_id` int(11) DEFAULT NULL,
  `message` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `sender_id`, `receiver_id`, `message`, `created_at`) VALUES
(17, 2, 1, '....', '2025-08-14 08:56:04'),
(18, 1, 2, 'ว่าไงครับ', '2025-08-14 08:56:32'),
(19, 1, 2, '??', '2025-08-15 07:20:51'),
(20, 6, 1, 'สวัสดีครับ', '2025-08-18 08:42:35'),
(21, 1, 6, 'ดีครับ ยินดีให้บริการ', '2025-08-18 08:43:37'),
(22, 1, 2, 'สวัสดีครับ', '2025-08-26 07:18:40'),
(23, 1, 2, '...', '2025-08-26 07:21:29'),
(24, 1, 2, '...', '2025-08-26 07:24:08'),
(25, 2, 1, 'ครับ', '2025-09-01 14:49:58');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `type` varchar(20) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `message` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `customer_id`, `type`, `title`, `message`, `created_at`) VALUES
(1, 2, 'success', 'คำสั่งซื้อได้รับการอนุมัติ', 'คำสั่งซื้อ #13 ของคุณได้รับการอนุมัติแล้ว', '2025-08-03 16:07:53'),
(2, 2, 'success', 'ชำระเงินสำเร็จ', 'คำสั่งซื้อ #0014 ได้รับการยืนยันแล้ว ขอบคุณที่ใช้บริการค่ะ', '2025-08-03 16:13:14'),
(3, 2, 'info', 'คำสั่งซื้อถูกจัดส่งแล้ว', 'คำสั่งซื้อ #14 ของคุณถูกจัดส่งแล้ว กรุณาตรวจสอบสถานะการจัดส่ง', '2025-08-03 16:20:15'),
(4, 5, 'success', 'ชำระเงินสำเร็จ', 'คำสั่งซื้อ #0015 ได้รับการยืนยันแล้ว ขอบคุณที่ใช้บริการค่ะ', '2025-08-03 17:49:25'),
(5, 2, 'success', 'ชำระเงินสำเร็จ', 'คำสั่งซื้อ #0016 ได้รับการยืนยันแล้ว ขอบคุณที่ใช้บริการค่ะ', '2025-08-03 18:15:22'),
(6, 2, 'info', 'คำสั่งซื้อถูกจัดส่งแล้ว', 'คำสั่งซื้อ #16 ของคุณถูกจัดส่งแล้ว กรุณาตรวจสอบสถานะการจัดส่ง', '2025-08-03 18:15:37'),
(7, 2, 'success', 'ชำระเงินสำเร็จ', 'คำสั่งซื้อ #0016 ได้รับการยืนยันแล้ว ขอบคุณที่ใช้บริการค่ะ', '2025-08-03 19:03:38'),
(8, 2, 'success', 'คำสั่งซื้อได้รับการอนุมัติ', 'คำสั่งซื้อ #17 ของคุณได้รับการอนุมัติแล้ว', '2025-08-04 06:55:59'),
(9, 2, 'info', 'คำสั่งซื้อถูกจัดส่งแล้ว', 'คำสั่งซื้อ #16 ของคุณถูกจัดส่งแล้ว กรุณาตรวจสอบสถานะการจัดส่ง', '2025-08-04 06:57:39'),
(10, 5, 'info', 'คำสั่งซื้อถูกจัดส่งแล้ว', 'คำสั่งซื้อ #15 ของคุณถูกจัดส่งแล้ว กรุณาตรวจสอบสถานะการจัดส่ง', '2025-08-04 06:57:42'),
(11, 6, 'success', 'ชำระเงินสำเร็จ', 'คำสั่งซื้อ #0017 ได้รับการยืนยันแล้ว ขอบคุณที่ใช้บริการค่ะ', '2025-08-04 09:42:35'),
(12, 2, 'success', 'ชำระเงินสำเร็จ', 'คำสั่งซื้อ #0018 ได้รับการยืนยันแล้ว ขอบคุณที่ใช้บริการค่ะ', '2025-08-16 14:59:11'),
(13, 2, 'success', 'ชำระเงินสำเร็จ', 'คำสั่งซื้อ #0019 ได้รับการยืนยันแล้ว ขอบคุณที่ใช้บริการค่ะ', '2025-08-21 15:54:00'),
(14, 2, 'success', 'ชำระเงินสำเร็จ', 'คำสั่งซื้อ #0020 ได้รับการยืนยันแล้ว ขอบคุณที่ใช้บริการค่ะ', '2025-08-26 14:09:47');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `total_price` decimal(10,2) DEFAULT NULL,
  `order_type` enum('standard','custom') DEFAULT 'standard',
  `status` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `shipping_address` text,
  `phone` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `order_custom_details`
--

CREATE TABLE `order_custom_details` (
  `id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `width` float DEFAULT NULL,
  `height` float DEFAULT NULL,
  `material` text,
  `special_request` text,
  `estimated_price` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `image` varchar(255) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `category_id` int(11) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `quantity` int(11) DEFAULT '0',
  `image_url` varchar(255) DEFAULT NULL,
  `status` enum('active','inactive','-') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `product_code` varchar(50) NOT NULL,
  `color` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `description`, `category_id`, `price`, `quantity`, `image_url`, `status`, `created_at`, `updated_at`, `product_code`, `color`) VALUES
(1, 'หน้าต่างมุ้งสีอบขาว', '-', 6, '500.00', 8, '/uploads/products/1755243843772-201885004.png', 'active', '2025-08-15 07:44:03', '2025-08-25 07:09:17', 'PWMWX-001', NULL),
(2, 'หน้าต่างอลูมิเนียมสีอบขาว', '-', 2, '3500.00', 6, '/uploads/products/1755244182369-572932768.jpg', 'active', '2025-08-15 07:49:42', '2025-08-18 14:06:45', 'PWWC-001', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `product_bom`
--

CREATE TABLE `product_bom` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `material_id` int(11) NOT NULL,
  `quantity_per_unit` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `product_colors`
--

CREATE TABLE `product_colors` (
  `id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `color_name` varchar(50) DEFAULT NULL,
  `color_code` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `product_colors`
--

INSERT INTO `product_colors` (`id`, `product_id`, `color_name`, `color_code`) VALUES
(1, 1, 'เงิน', '#C0C0C0'),
(2, 1, 'ดำ', '#000000'),
(3, 1, 'อบขาว', '#FFFFFF'),
(4, 1, 'ชา', '#5C4033'),
(5, 1, 'ลายไม้จามจุรี', '#A9745B');

-- --------------------------------------------------------

--
-- Table structure for table `product_ratings`
--

CREATE TABLE `product_ratings` (
  `id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `rating` tinyint(4) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `product_ratings`
--

INSERT INTO `product_ratings` (`id`, `customer_id`, `product_id`, `rating`, `created_at`, `updated_at`) VALUES
(1, 2, 1, 5, '2025-08-01 17:01:27', '2025-08-26 07:29:30'),
(2, 2, 2, 5, '2025-08-02 14:57:18', '2025-08-26 07:29:31'),
(3, 2, 11, 5, '2025-08-03 07:24:02', '2025-08-03 07:24:02'),
(4, 5, 11, 5, '2025-08-03 09:43:51', '2025-08-03 09:43:51'),
(5, 6, 15, 5, '2025-08-04 02:29:34', '2025-08-04 02:29:34');

-- --------------------------------------------------------

--
-- Table structure for table `provinces`
--

CREATE TABLE `provinces` (
  `id` int(11) NOT NULL,
  `name_th` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `provinces`
--

INSERT INTO `provinces` (`id`, `name_th`) VALUES
(1, 'เชียงราย'),
(2, 'กรุงเทพมหานคร'),
(3, 'กระบี่'),
(4, 'กาญจนบุรี'),
(5, 'กาฬสินธุ์'),
(6, 'กำแพงเพชร'),
(7, 'ขอนแก่น'),
(8, 'จันทบุรี'),
(9, 'ฉะเชิงเทรา'),
(10, 'ชลบุรี'),
(11, 'ชัยนาท'),
(12, 'ชัยภูมิ'),
(13, 'ชุมพร'),
(14, 'เชียงใหม่'),
(15, 'ตรัง'),
(16, 'ตราด'),
(17, 'ตาก'),
(18, 'นครนายก'),
(19, 'นครปฐม'),
(20, 'นครพนม'),
(21, 'นครราชสีมา'),
(22, 'นครศรีธรรมราช'),
(23, 'นครสวรรค์'),
(24, 'นนทบุรี'),
(25, 'นราธิวาส'),
(26, 'น่าน'),
(27, 'บึงกาฬ'),
(28, 'บุรีรัมย์'),
(29, 'ปทุมธานี'),
(30, 'ประจวบคีรีขันธ์'),
(31, 'ปราจีนบุรี'),
(32, 'ปัตตานี'),
(33, 'พระนครศรีอยุธยา'),
(34, 'พะเยา'),
(35, 'พังงา'),
(36, 'พัทลุง'),
(37, 'พิจิตร'),
(38, 'พิษณุโลก'),
(39, 'เพชรบุรี'),
(40, 'เพชรบูรณ์'),
(41, 'แพร่'),
(42, 'ภูเก็ต'),
(43, 'มหาสารคาม'),
(44, 'มุกดาหาร'),
(45, 'แม่ฮ่องสอน'),
(46, 'ยโสธร'),
(47, 'ยะลา'),
(48, 'ร้อยเอ็ด'),
(49, 'ระนอง'),
(50, 'ระยอง'),
(51, 'ราชบุรี'),
(52, 'ลพบุรี'),
(53, 'ลำปาง'),
(54, 'ลำพูน'),
(55, 'เลย'),
(56, 'ศรีสะเกษ'),
(57, 'สกลนคร'),
(58, 'สงขลา'),
(59, 'สตูล'),
(60, 'สมุทรปราการ'),
(61, 'สมุทรสงคราม'),
(62, 'สมุทรสาคร'),
(63, 'สระแก้ว'),
(64, 'สระบุรี'),
(65, 'สิงห์บุรี'),
(66, 'สุโขทัย'),
(67, 'สุพรรณบุรี'),
(68, 'สุราษฎร์ธานี'),
(69, 'สุรินทร์'),
(70, 'หนองคาย'),
(71, 'หนองบัวลำภู'),
(72, 'อ่างทอง'),
(73, 'อำนาจเจริญ'),
(74, 'อุดรธานี'),
(75, 'อุตรดิตถ์'),
(76, 'อุทัยธานี'),
(77, 'อุบลราชธานี');

-- --------------------------------------------------------

--
-- Table structure for table `quotations`
--

CREATE TABLE `quotations` (
  `id` int(11) NOT NULL,
  `quotation_number` varchar(50) NOT NULL,
  `customer_name` varchar(255) NOT NULL,
  `customer_address` text,
  `customer_phone` varchar(50) DEFAULT NULL,
  `total` decimal(10,2) DEFAULT '0.00',
  `vat` decimal(10,2) DEFAULT '0.00',
  `grand_total` decimal(10,2) DEFAULT '0.00',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `quotation_items`
--

CREATE TABLE `quotation_items` (
  `id` int(11) NOT NULL,
  `quotation_id` int(11) NOT NULL,
  `description` varchar(255) NOT NULL,
  `quantity` decimal(10,2) NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `total` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `reports`
--

CREATE TABLE `reports` (
  `id` int(11) NOT NULL,
  `report_type` enum('sales','material_usage') NOT NULL,
  `reference_id` int(11) DEFAULT NULL,
  `report_date` date NOT NULL,
  `details` text,
  `total` decimal(10,2) DEFAULT '0.00',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `subdistricts`
--

CREATE TABLE `subdistricts` (
  `id` int(11) NOT NULL,
  `name_th` varchar(150) NOT NULL,
  `district_id` int(11) NOT NULL,
  `postal_code` varchar(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `subdistricts`
--

INSERT INTO `subdistricts` (`id`, `name_th`, `district_id`, `postal_code`) VALUES
(1, 'เวียง', 1, '57000'),
(2, 'แม่สา', 22, '50180'),
(3, 'ริมใต้', 22, '50180'),
(4, 'ตลาดใหญ่', 23, '83000'),
(5, 'รัษฎา', 23, '83000'),
(6, 'ป่าตอง', 24, '83150'),
(7, 'กะทู้', 24, '83120'),
(8, 'บ้านไผ่', 26, '40110'),
(9, 'เมืองเพีย', 26, '40110'),
(10, 'ในเมือง', 27, '30000'),
(11, 'โพธิ์กลาง', 27, '30000'),
(12, 'ปากช่อง', 28, '30130'),
(13, 'ขนงพระ', 28, '30130'),
(14, 'ศรีราชา', 30, '20110'),
(15, 'สุรศักดิ์', 30, '20110'),
(16, 'ท่าประดู่', 31, '21000'),
(17, 'เนินพระ', 31, '21000'),
(18, 'บ้านฉาง', 32, '21130'),
(19, 'สำนักท้อน', 32, '21130'),
(20, 'ประตูชัย', 33, '13000'),
(21, 'ไผ่ลิง', 33, '13000'),
(22, 'วังน้อย', 34, '13170'),
(23, 'ลำไทร', 34, '13170'),
(24, 'ปากน้ำโพ', 35, '60000'),
(25, 'นครสวรรค์ตก', 35, '60000'),
(26, 'พระบรมมหาราชวัง', 2, '10200'),
(27, 'วัดราชบพิธ', 2, '10200'),
(28, 'คลองเตย', 3, '10110'),
(29, 'พระโขนง', 3, '10110'),
(30, 'ศรีภูมิ', 15, '50200'),
(31, 'พระสิงห์', 15, '50200'),
(32, 'แม่สา', 22, '50180'),
(33, 'ริมใต้', 22, '50180'),
(34, 'ตลาดใหญ่', 23, '83000'),
(35, 'รัษฎา', 23, '83000'),
(36, 'ป่าตอง', 24, '83150'),
(37, 'กะทู้', 24, '83120'),
(38, 'ในเมือง', 8, '40000'),
(39, 'ศิลา', 8, '40000'),
(40, 'บ้านไผ่', 26, '40110'),
(41, 'เมืองเพีย', 26, '40110'),
(42, 'ในเมือง', 27, '30000'),
(43, 'โพธิ์กลาง', 27, '30000'),
(44, 'ปากช่อง', 28, '30130'),
(45, 'ขนงพระ', 28, '30130'),
(46, 'บางปลาสร้อย', 11, '20000'),
(47, 'บ้านสวน', 11, '20000'),
(48, 'ศรีราชา', 30, '20110'),
(49, 'สุรศักดิ์', 30, '20110'),
(50, 'ท่าประดู่', 31, '21000'),
(51, 'เนินพระ', 31, '21000'),
(52, 'บ้านฉาง', 32, '21130'),
(53, 'สำนักท้อน', 32, '21130'),
(54, 'ประตูชัย', 33, '13000'),
(55, 'ไผ่ลิง', 33, '13000'),
(56, 'วังน้อย', 34, '13170'),
(57, 'ลำไทร', 34, '13170'),
(58, 'ปากน้ำโพ', 35, '60000'),
(59, 'นครสวรรค์ตก', 35, '60000'),
(60, 'ตาคลี', 53, '60140'),
(61, 'หัวหวาย', 53, '60140'),
(62, 'ตลาด', 54, '84000'),
(63, 'มะขามเตี้ย', 54, '84000'),
(64, 'บ่อผุด', 55, '84320'),
(65, 'แม่น้ำ', 55, '84330'),
(66, 'หาดใหญ่', 56, '90110'),
(67, 'คอหงส์', 56, '90110'),
(68, 'บ่อยาง', 57, '90000'),
(69, 'พะวง', 57, '90100'),
(70, 'ในเมือง', 58, '34000'),
(71, 'ขามใหญ่', 58, '34000'),
(72, 'วารินชำราบ', 59, '34190'),
(73, 'โนนผึ้ง', 59, '34190'),
(74, 'หมากแข้ง', 60, '41000'),
(75, 'หนองบัว', 60, '41000'),
(76, 'บ้านดุง', 61, '41190'),
(77, 'นาคำ', 61, '41190'),
(78, 'สบตุ๋ย', 62, '52100'),
(79, 'หัวเวียง', 62, '52000'),
(80, 'ท่าราบ', 63, '76000'),
(81, 'ต้นมะม่วง', 63, '76000');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`username`);

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`category_id`);

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `contact`
--
ALTER TABLE `contact`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `fk_customers_subdistrict` (`subdistrict_id`),
  ADD KEY `fk_customers_district` (`district_id`),
  ADD KEY `fk_customers_province` (`province_id`);

--
-- Indexes for table `districts`
--
ALTER TABLE `districts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_districts_province_id` (`province_id`);

--
-- Indexes for table `favorites`
--
ALTER TABLE `favorites`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `customer_id` (`customer_id`,`product_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `inbox`
--
ALTER TABLE `inbox`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `knex_migrations`
--
ALTER TABLE `knex_migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `knex_migrations_lock`
--
ALTER TABLE `knex_migrations_lock`
  ADD PRIMARY KEY (`index`);

--
-- Indexes for table `materials`
--
ALTER TABLE `materials`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indexes for table `material_requisition`
--
ALTER TABLE `material_requisition`
  ADD PRIMARY KEY (`requisition_id`);

--
-- Indexes for table `material_requisition_items`
--
ALTER TABLE `material_requisition_items`
  ADD PRIMARY KEY (`item_id`),
  ADD KEY `requisition_id` (`requisition_id`),
  ADD KEY `material_id` (`material_id`);

--
-- Indexes for table `material_usage`
--
ALTER TABLE `material_usage`
  ADD PRIMARY KEY (`id`),
  ADD KEY `material_id` (`material_id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `order_custom_details`
--
ALTER TABLE `order_custom_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `product_code` (`product_code`),
  ADD KEY `fk_category` (`category_id`);

--
-- Indexes for table `product_bom`
--
ALTER TABLE `product_bom`
  ADD PRIMARY KEY (`id`),
  ADD KEY `material_id` (`material_id`);

--
-- Indexes for table `product_colors`
--
ALTER TABLE `product_colors`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `product_ratings`
--
ALTER TABLE `product_ratings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_rating` (`customer_id`,`product_id`);

--
-- Indexes for table `provinces`
--
ALTER TABLE `provinces`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `quotations`
--
ALTER TABLE `quotations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `quotation_number` (`quotation_number`);

--
-- Indexes for table `quotation_items`
--
ALTER TABLE `quotation_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `quotation_id` (`quotation_id`);

--
-- Indexes for table `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `subdistricts`
--
ALTER TABLE `subdistricts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_subdistricts_district_id` (`district_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `districts`
--
ALTER TABLE `districts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=64;

--
-- AUTO_INCREMENT for table `favorites`
--
ALTER TABLE `favorites`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `inbox`
--
ALTER TABLE `inbox`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `knex_migrations`
--
ALTER TABLE `knex_migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `knex_migrations_lock`
--
ALTER TABLE `knex_migrations_lock`
  MODIFY `index` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `materials`
--
ALTER TABLE `materials`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `material_requisition`
--
ALTER TABLE `material_requisition`
  MODIFY `requisition_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `material_requisition_items`
--
ALTER TABLE `material_requisition_items`
  MODIFY `item_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `material_usage`
--
ALTER TABLE `material_usage`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `order_custom_details`
--
ALTER TABLE `order_custom_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `product_bom`
--
ALTER TABLE `product_bom`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `product_colors`
--
ALTER TABLE `product_colors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `product_ratings`
--
ALTER TABLE `product_ratings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `provinces`
--
ALTER TABLE `provinces`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=78;

--
-- AUTO_INCREMENT for table `quotations`
--
ALTER TABLE `quotations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `quotation_items`
--
ALTER TABLE `quotation_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reports`
--
ALTER TABLE `reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `subdistricts`
--
ALTER TABLE `subdistricts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=82;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `customers`
--
ALTER TABLE `customers`
  ADD CONSTRAINT `fk_customers_district` FOREIGN KEY (`district_id`) REFERENCES `districts` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_customers_province` FOREIGN KEY (`province_id`) REFERENCES `provinces` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_customers_subdistrict` FOREIGN KEY (`subdistrict_id`) REFERENCES `subdistricts` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `districts`
--
ALTER TABLE `districts`
  ADD CONSTRAINT `fk_districts_province` FOREIGN KEY (`province_id`) REFERENCES `provinces` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `favorites`
--
ALTER TABLE `favorites`
  ADD CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `favorites_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `favorites_ibfk_3` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`);

--
-- Constraints for table `material_requisition_items`
--
ALTER TABLE `material_requisition_items`
  ADD CONSTRAINT `material_requisition_items_ibfk_1` FOREIGN KEY (`requisition_id`) REFERENCES `material_requisition` (`requisition_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `material_requisition_items_ibfk_2` FOREIGN KEY (`material_id`) REFERENCES `materials` (`id`);

--
-- Constraints for table `material_usage`
--
ALTER TABLE `material_usage`
  ADD CONSTRAINT `material_usage_ibfk_1` FOREIGN KEY (`material_id`) REFERENCES `materials` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `order_custom_details`
--
ALTER TABLE `order_custom_details`
  ADD CONSTRAINT `order_custom_details_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  ADD CONSTRAINT `payments_ibfk_2` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`);

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `fk_category` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`) ON DELETE SET NULL;

--
-- Constraints for table `product_bom`
--
ALTER TABLE `product_bom`
  ADD CONSTRAINT `product_bom_ibfk_1` FOREIGN KEY (`material_id`) REFERENCES `materials` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `product_colors`
--
ALTER TABLE `product_colors`
  ADD CONSTRAINT `product_colors_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `quotation_items`
--
ALTER TABLE `quotation_items`
  ADD CONSTRAINT `quotation_items_ibfk_1` FOREIGN KEY (`quotation_id`) REFERENCES `quotations` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `subdistricts`
--
ALTER TABLE `subdistricts`
  ADD CONSTRAINT `fk_subdistricts_district` FOREIGN KEY (`district_id`) REFERENCES `districts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
