/*
 Navicat Premium Dump SQL

 Source Server         : aiforus
 Source Server Type    : MySQL
 Source Server Version : 80100 (8.1.0)
 Source Host           : localhost:3306
 Source Schema         : aiforusdb

 Target Server Type    : MySQL
 Target Server Version : 80100 (8.1.0)
 File Encoding         : 65001

 Date: 05/08/2025 22:35:44
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for coupons
-- ----------------------------
DROP TABLE IF EXISTS `coupons`;
CREATE TABLE `coupons` (
  `coupon_id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `created_by` int DEFAULT NULL,
  `discount_percent` decimal(5,2) DEFAULT '0.00',
  `credit_percent` decimal(5,2) DEFAULT '0.00',
  `is_teaching_coupon` tinyint(1) DEFAULT '0',
  `max_uses` int DEFAULT '999',
  `num_uses` int DEFAULT '0',
  `expiration_date` date DEFAULT NULL,
  PRIMARY KEY (`coupon_id`),
  UNIQUE KEY `code` (`code`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `coupons_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of coupons
-- ----------------------------
BEGIN;
INSERT INTO `coupons` (`coupon_id`, `code`, `created_by`, `discount_percent`, `credit_percent`, `is_teaching_coupon`, `max_uses`, `num_uses`, `expiration_date`) VALUES (1, 'COUPON2024', 1, 10.00, 5.00, 0, 100, 0, '2025-12-31');
INSERT INTO `coupons` (`coupon_id`, `code`, `created_by`, `discount_percent`, `credit_percent`, `is_teaching_coupon`, `max_uses`, `num_uses`, `expiration_date`) VALUES (2, 'BOB20', 2, 20.00, 7.00, 0, 50, 0, '2025-11-30');
INSERT INTO `coupons` (`coupon_id`, `code`, `created_by`, `discount_percent`, `credit_percent`, `is_teaching_coupon`, `max_uses`, `num_uses`, `expiration_date`) VALUES (3, 'CHARLIE30', 3, 30.00, 0.00, 1, 20, 0, '2025-06-30');
COMMIT;

-- ----------------------------
-- Table structure for user_dict
-- ----------------------------
DROP TABLE IF EXISTS `user_dict`;
CREATE TABLE `user_dict` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'Primary key',
  `dict_type` varchar(32) COLLATE utf8mb4_general_ci NOT NULL COMMENT 'Dictionary type (e.g., age, occupation, education)',
  `code` varchar(64) COLLATE utf8mb4_general_ci NOT NULL COMMENT 'Unique code for this dictionary item',
  `label` varchar(64) COLLATE utf8mb4_general_ci NOT NULL COMMENT 'Display label',
  `sort_order` int DEFAULT '0' COMMENT 'Display sorting order',
  PRIMARY KEY (`id`),
  UNIQUE KEY `dict_type` (`dict_type`,`code`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Unified dictionary table for user metadata (age, occupation, education)';

-- ----------------------------
-- Records of user_dict
-- ----------------------------
BEGIN;
INSERT INTO `user_dict` (`id`, `dict_type`, `code`, `label`, `sort_order`) VALUES (1, 'age', 'AGE_UNDER_18', 'Under 18', 1);
INSERT INTO `user_dict` (`id`, `dict_type`, `code`, `label`, `sort_order`) VALUES (2, 'age', 'AGE_18_24', '18-24', 2);
INSERT INTO `user_dict` (`id`, `dict_type`, `code`, `label`, `sort_order`) VALUES (3, 'age', 'AGE_25_34', '25-34', 3);
INSERT INTO `user_dict` (`id`, `dict_type`, `code`, `label`, `sort_order`) VALUES (4, 'age', 'AGE_35_44', '35-44', 4);
INSERT INTO `user_dict` (`id`, `dict_type`, `code`, `label`, `sort_order`) VALUES (5, 'age', 'AGE_45_54', '45-54', 5);
INSERT INTO `user_dict` (`id`, `dict_type`, `code`, `label`, `sort_order`) VALUES (6, 'age', 'AGE_55_64', '55-64', 6);
INSERT INTO `user_dict` (`id`, `dict_type`, `code`, `label`, `sort_order`) VALUES (7, 'age', 'AGE_65_PLUS', '65+', 7);
INSERT INTO `user_dict` (`id`, `dict_type`, `code`, `label`, `sort_order`) VALUES (8, 'occupation', 'SOFTWARE_ENGINEER', 'Software Engineer', 1);
INSERT INTO `user_dict` (`id`, `dict_type`, `code`, `label`, `sort_order`) VALUES (9, 'occupation', 'DATA_SCIENTIST', 'Data Scientist', 2);
INSERT INTO `user_dict` (`id`, `dict_type`, `code`, `label`, `sort_order`) VALUES (10, 'occupation', 'PRODUCT_MANAGER', 'Product Manager', 3);
INSERT INTO `user_dict` (`id`, `dict_type`, `code`, `label`, `sort_order`) VALUES (11, 'occupation', 'PROJECT_MANAGER', 'Project Manager', 4);
INSERT INTO `user_dict` (`id`, `dict_type`, `code`, `label`, `sort_order`) VALUES (12, 'occupation', 'MARKETING_MANAGER', 'Marketing Manager', 5);
INSERT INTO `user_dict` (`id`, `dict_type`, `code`, `label`, `sort_order`) VALUES (13, 'occupation', 'SALES_REPRESENTATIVE', 'Sales Representative', 6);
INSERT INTO `user_dict` (`id`, `dict_type`, `code`, `label`, `sort_order`) VALUES (14, 'occupation', 'BUSINESS_ANALYST', 'Business Analyst', 7);
INSERT INTO `user_dict` (`id`, `dict_type`, `code`, `label`, `sort_order`) VALUES (15, 'occupation', 'UI_UX_DESIGNER', 'UI/UX Designer', 8);
INSERT INTO `user_dict` (`id`, `dict_type`, `code`, `label`, `sort_order`) VALUES (16, 'occupation', 'GRAPHIC_DESIGNER', 'Graphic Designer', 9);
INSERT INTO `user_dict` (`id`, `dict_type`, `code`, `label`, `sort_order`) VALUES (17, 'occupation', 'TEACHER', 'Teacher', 10);
INSERT INTO `user_dict` (`id`, `dict_type`, `code`, `label`, `sort_order`) VALUES (18, 'occupation', 'DOCTOR', 'Doctor', 11);
INSERT INTO `user_dict` (`id`, `dict_type`, `code`, `label`, `sort_order`) VALUES (19, 'occupation', 'NURSE', 'Nurse', 12);
INSERT INTO `user_dict` (`id`, `dict_type`, `code`, `label`, `sort_order`) VALUES (20, 'occupation', 'LAWYER', 'Lawyer', 13);
INSERT INTO `user_dict` (`id`, `dict_type`, `code`, `label`, `sort_order`) VALUES (21, 'occupation', 'ACCOUNTANT', 'Accountant', 14);
INSERT INTO `user_dict` (`id`, `dict_type`, `code`, `label`, `sort_order`) VALUES (22, 'occupation', 'ENGINEER', 'Engineer (non-software)', 15);
INSERT INTO `user_dict` (`id`, `dict_type`, `code`, `label`, `sort_order`) VALUES (23, 'occupation', 'CONSULTANT', 'Consultant', 16);
INSERT INTO `user_dict` (`id`, `dict_type`, `code`, `label`, `sort_order`) VALUES (24, 'occupation', 'CIVIL_SERVANT', 'Civil Servant / Government Worker', 17);
INSERT INTO `user_dict` (`id`, `dict_type`, `code`, `label`, `sort_order`) VALUES (25, 'occupation', 'STUDENT', 'Student', 18);
INSERT INTO `user_dict` (`id`, `dict_type`, `code`, `label`, `sort_order`) VALUES (26, 'occupation', 'RETIRED', 'Retired', 19);
INSERT INTO `user_dict` (`id`, `dict_type`, `code`, `label`, `sort_order`) VALUES (27, 'occupation', 'SELF_EMPLOYED', 'Self-employed / Freelancer', 20);
INSERT INTO `user_dict` (`id`, `dict_type`, `code`, `label`, `sort_order`) VALUES (28, 'occupation', 'UNEMPLOYED', 'Unemployed', 21);
INSERT INTO `user_dict` (`id`, `dict_type`, `code`, `label`, `sort_order`) VALUES (29, 'occupation', 'OTHER', 'Other', 22);
INSERT INTO `user_dict` (`id`, `dict_type`, `code`, `label`, `sort_order`) VALUES (30, 'education', 'EDU_NONE', 'No formal education', 1);
INSERT INTO `user_dict` (`id`, `dict_type`, `code`, `label`, `sort_order`) VALUES (31, 'education', 'EDU_PRIMARY', 'Primary School', 2);
INSERT INTO `user_dict` (`id`, `dict_type`, `code`, `label`, `sort_order`) VALUES (32, 'education', 'EDU_JUNIOR', 'Middle School', 3);
INSERT INTO `user_dict` (`id`, `dict_type`, `code`, `label`, `sort_order`) VALUES (33, 'education', 'EDU_HIGH', 'High School / Technical School', 4);
INSERT INTO `user_dict` (`id`, `dict_type`, `code`, `label`, `sort_order`) VALUES (34, 'education', 'EDU_ASSOCIATE', 'Associate Degree', 5);
INSERT INTO `user_dict` (`id`, `dict_type`, `code`, `label`, `sort_order`) VALUES (35, 'education', 'EDU_BACHELOR', 'Bachelor\'s Degree', 6);
INSERT INTO `user_dict` (`id`, `dict_type`, `code`, `label`, `sort_order`) VALUES (36, 'education', 'EDU_MASTER', 'Master\'s Degree', 7);
INSERT INTO `user_dict` (`id`, `dict_type`, `code`, `label`, `sort_order`) VALUES (37, 'education', 'EDU_PHD', 'Doctoral Degree', 8);
INSERT INTO `user_dict` (`id`, `dict_type`, `code`, `label`, `sort_order`) VALUES (38, 'education', 'EDU_OTHER', 'Other', 9);
COMMIT;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `user_name` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `role` enum('admin','user') COLLATE utf8mb4_general_ci DEFAULT 'user',
  `first_name` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `last_name` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `auth_provider` enum('email','google','facebook') COLLATE utf8mb4_general_ci DEFAULT 'email',
  `license_type` enum('trial','silver','gold','platinum') COLLATE utf8mb4_general_ci DEFAULT 'trial',
  `license_start_date` date DEFAULT NULL,
  `license_expiration_date` date DEFAULT NULL,
  `registration_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `license_state` enum('active','expired','suspended','none') COLLATE utf8mb4_general_ci DEFAULT 'none',
  `notes` text COLLATE utf8mb4_general_ci,
  `occupation` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `education` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `age_range` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `license_token` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `emailVerified` tinyint(1) DEFAULT '0',
  `verificationToken` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `verificationTokenExpires` datetime DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of users
-- ----------------------------
BEGIN;
INSERT INTO `users` (`user_id`, `user_name`, `role`, `first_name`, `last_name`, `email`, `password_hash`, `auth_provider`, `license_type`, `license_start_date`, `license_expiration_date`, `registration_date`, `license_state`, `notes`, `occupation`, `education`, `age_range`, `license_token`, `emailVerified`, `verificationToken`, `verificationTokenExpires`) VALUES (1, 'test1', 'user', 'Alice', 'Wang', 'alice@example.com', '123456', 'email', 'gold', '2025-01-01', '2025-12-31', '2025-06-28 16:56:52', 'active', 'VIP user', 'SOFTWARE_ENGINEER', 'EDU_MASTER', 'AGE_25_34', NULL, 0, NULL, NULL);
INSERT INTO `users` (`user_id`, `user_name`, `role`, `first_name`, `last_name`, `email`, `password_hash`, `auth_provider`, `license_type`, `license_start_date`, `license_expiration_date`, `registration_date`, `license_state`, `notes`, `occupation`, `education`, `age_range`, `license_token`, `emailVerified`, `verificationToken`, `verificationTokenExpires`) VALUES (2, 'test2', 'user', 'Bob', 'Li', 'bob@example.com', '123456', 'google', 'silver', '2025-02-01', '2025-11-30', '2025-06-28 16:56:52', 'active', 'Regular user', 'SOFTWARE_ENGINEER', 'EDU_MASTER', 'AGE_25_34', NULL, 0, NULL, NULL);
INSERT INTO `users` (`user_id`, `user_name`, `role`, `first_name`, `last_name`, `email`, `password_hash`, `auth_provider`, `license_type`, `license_start_date`, `license_expiration_date`, `registration_date`, `license_state`, `notes`, `occupation`, `education`, `age_range`, `license_token`, `emailVerified`, `verificationToken`, `verificationTokenExpires`) VALUES (3, 'test3', 'user', 'Charlie', 'Zhao', 'charlie@example.com', '123456', 'facebook', 'trial', '2025-03-01', '2025-06-30', '2025-06-28 16:56:52', 'expired', 'Trial user', 'SOFTWARE_ENGINEER', 'EDU_MASTER', 'AGE_25_34', NULL, 0, NULL, NULL);
INSERT INTO `users` (`user_id`, `user_name`, `role`, `first_name`, `last_name`, `email`, `password_hash`, `auth_provider`, `license_type`, `license_start_date`, `license_expiration_date`, `registration_date`, `license_state`, `notes`, `occupation`, `education`, `age_range`, `license_token`, `emailVerified`, `verificationToken`, `verificationTokenExpires`) VALUES (4, 'admin', 'admin', 'ziting', 'mao', 'admin@qq.com', '$2b$10$4qmOnnk2oZCWQl7dCI54ku7dAwPCeuEB1QeAI0nOdXQEM9lwoLIj.', 'email', 'trial', NULL, NULL, '2025-06-28 16:57:21', 'none', 'notes', 'SOFTWARE_ENGINEER', 'EDU_MASTER', 'AGE_25_34', NULL, 0, NULL, NULL);
INSERT INTO `users` (`user_id`, `user_name`, `role`, `first_name`, `last_name`, `email`, `password_hash`, `auth_provider`, `license_type`, `license_start_date`, `license_expiration_date`, `registration_date`, `license_state`, `notes`, `occupation`, `education`, `age_range`, `license_token`, `emailVerified`, `verificationToken`, `verificationTokenExpires`) VALUES (5, 'userzt', 'user', 'shuai', 'Zeng', 'test@qq.com', '$2b$10$jddOUmjFR75K1Vn0ABIS3uPAbnxMYmXZgEzTWJPX1LK5u/1syq7wK', 'email', 'silver', '2025-03-01', '2025-11-30', '2025-06-28 17:27:11', 'active', NULL, 'DATA_SCIENTIST', 'EDU_BACHELOR', 'AGE_25_34', NULL, 0, NULL, NULL);
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
