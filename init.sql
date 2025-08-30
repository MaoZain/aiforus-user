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

 Date: 30/08/2025 14:07:41
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
  `credits` int DEFAULT NULL,
  `emailVerified` tinyint(1) DEFAULT '0',
  `verificationToken` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `verificationTokenExpires` datetime DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of users
-- ----------------------------
BEGIN;
INSERT INTO `users` (`user_id`, `user_name`, `role`, `first_name`, `last_name`, `email`, `password_hash`, `auth_provider`, `license_type`, `license_start_date`, `license_expiration_date`, `registration_date`, `license_state`, `notes`, `occupation`, `education`, `age_range`, `license_token`, `credits`, `emailVerified`, `verificationToken`, `verificationTokenExpires`) VALUES (1, 'test1', 'user', 'Alice', 'Wang', 'alice@example.com', '123456', 'email', 'gold', '2025-01-01', '2025-12-31', '2025-06-28 16:56:52', 'active', 'VIP user', 'SOFTWARE_ENGINEER', 'EDU_MASTER', 'AGE_25_34', NULL, NULL, 0, NULL, NULL);
INSERT INTO `users` (`user_id`, `user_name`, `role`, `first_name`, `last_name`, `email`, `password_hash`, `auth_provider`, `license_type`, `license_start_date`, `license_expiration_date`, `registration_date`, `license_state`, `notes`, `occupation`, `education`, `age_range`, `license_token`, `credits`, `emailVerified`, `verificationToken`, `verificationTokenExpires`) VALUES (2, 'test2', 'user', 'Bob', 'Li', 'bob@example.com', '123456', 'google', 'silver', '2025-02-01', '2025-11-30', '2025-06-28 16:56:52', 'active', 'Regular user', 'SOFTWARE_ENGINEER', 'EDU_MASTER', 'AGE_25_34', NULL, NULL, 0, NULL, NULL);
INSERT INTO `users` (`user_id`, `user_name`, `role`, `first_name`, `last_name`, `email`, `password_hash`, `auth_provider`, `license_type`, `license_start_date`, `license_expiration_date`, `registration_date`, `license_state`, `notes`, `occupation`, `education`, `age_range`, `license_token`, `credits`, `emailVerified`, `verificationToken`, `verificationTokenExpires`) VALUES (3, 'test3', 'user', 'Charlie', 'Zhao', 'charlie@example.com', '123456', 'facebook', 'trial', '2025-03-01', '2025-06-30', '2025-06-28 16:56:52', 'expired', 'Trial user', 'SOFTWARE_ENGINEER', 'EDU_MASTER', 'AGE_25_34', NULL, NULL, 0, NULL, NULL);
INSERT INTO `users` (`user_id`, `user_name`, `role`, `first_name`, `last_name`, `email`, `password_hash`, `auth_provider`, `license_type`, `license_start_date`, `license_expiration_date`, `registration_date`, `license_state`, `notes`, `occupation`, `education`, `age_range`, `license_token`, `credits`, `emailVerified`, `verificationToken`, `verificationTokenExpires`) VALUES (4, 'admin', 'admin', 'ziting', 'mao', 'admin@qq.com', '$2b$10$4qmOnnk2oZCWQl7dCI54ku7dAwPCeuEB1QeAI0nOdXQEM9lwoLIj.', 'email', 'trial', NULL, NULL, '2025-06-28 16:57:21', 'none', 'notes', 'SOFTWARE_ENGINEER', 'EDU_MASTER', 'AGE_25_34', NULL, NULL, 0, NULL, NULL);
INSERT INTO `users` (`user_id`, `user_name`, `role`, `first_name`, `last_name`, `email`, `password_hash`, `auth_provider`, `license_type`, `license_start_date`, `license_expiration_date`, `registration_date`, `license_state`, `notes`, `occupation`, `education`, `age_range`, `license_token`, `credits`, `emailVerified`, `verificationToken`, `verificationTokenExpires`) VALUES (5, 'userzt', 'user', 'shuai', 'Zeng', 'test@qq.com', '$2b$10$jddOUmjFR75K1Vn0ABIS3uPAbnxMYmXZgEzTWJPX1LK5u/1syq7wK', 'email', 'silver', '2025-03-01', '2025-11-30', '2025-06-28 17:27:11', 'active', NULL, 'DATA_SCIENTIST', 'EDU_BACHELOR', 'AGE_25_34', NULL, NULL, 0, NULL, NULL);
INSERT INTO `users` (`user_id`, `user_name`, `role`, `first_name`, `last_name`, `email`, `password_hash`, `auth_provider`, `license_type`, `license_start_date`, `license_expiration_date`, `registration_date`, `license_state`, `notes`, `occupation`, `education`, `age_range`, `license_token`, `credits`, `emailVerified`, `verificationToken`, `verificationTokenExpires`) VALUES (23, '1111', 'user', NULL, NULL, '391052034@qq.com', '$2b$10$TfE60mf4c1agipyzHUGswOPi4wUAPipXjT0HzEzMAC10wEhvzhBK6', 'email', 'trial', '2025-08-05', '2026-02-27', '2025-08-05 22:39:10', 'active', NULL, NULL, NULL, NULL, 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IjM5MTA1MjAzNEBxcS5jb20iLCJwYXNzd29yZCI6IiQyYiQxMCRUZkU2MG1mNGMxYWdpcHl6SFVHc3dPUGk0d1VBUGlwWGpUMEh6RXpNQUMxMHdFaHZ6aEJLNiIsImxpY2Vuc2VTdGFydERhdGUiOiIyMDI1LTA4LTA0VDE2OjAwOjAwLjAwMFoiLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwibGljZW5zZUV4cGlyYXRpb25EYXRlIjoiMjAyNS0xMS0wMlQxNjowMDowMC4wMDBaIiwibGljZW5zZVN0YXRlIjoiYWN0aXZlIiwicm9sZSI6InVzZXIiLCJ1c2VybmFtZSI6IjExMTEiLCJpYXQiOjE3NTQ4MzU2NTV9.h5vAGJUDbm2RWSkEPodMHcxKBIzLHDNz95OukPWThDAsxUh-C4jCy1YRO6zBIqnjA20RS96oIsB3nwEmhyeYrhg-l5C38ZE8CEurhHrWKqG39yOq-l9omy2WiCJwTPI7WDQJFRPCsKOi8YHgVHJuvgzGJt0F-qbep1T99n6cQzumLSeFBUTUzWmKdsfX2MykloHg_SwknmS6AnZPfetgaHVWkLfP7UgXQBoijoTJdF6etymjT2qqdObvc9xWNF0Qy6OzoDl0hSwHab5xuTECjd6_vxtgFT5PIq4ZGR6MVj60VnmDUGqWl6eDUl6IYtmK0ZFLTdCoXB0pcUKJpdlwwQ', 90, 1, NULL, NULL);
INSERT INTO `users` (`user_id`, `user_name`, `role`, `first_name`, `last_name`, `email`, `password_hash`, `auth_provider`, `license_type`, `license_start_date`, `license_expiration_date`, `registration_date`, `license_state`, `notes`, `occupation`, `education`, `age_range`, `license_token`, `credits`, `emailVerified`, `verificationToken`, `verificationTokenExpires`) VALUES (24, '222', 'user', NULL, NULL, '11@qq.com', '$2b$10$IQHryyM2dAtShvptMKAN.OAN2njYO2uTZpCzknRRM6lU5bif6N5NG', 'email', 'trial', '2025-08-24', '2025-11-22', '2025-08-24 00:52:14', 'suspended', NULL, NULL, NULL, NULL, NULL, NULL, 0, '9ee0eec58437031385a83e07b7ad9111b89949d07d923873b16e7b710a6bc79f', '2025-08-24 01:52:14');
INSERT INTO `users` (`user_id`, `user_name`, `role`, `first_name`, `last_name`, `email`, `password_hash`, `auth_provider`, `license_type`, `license_start_date`, `license_expiration_date`, `registration_date`, `license_state`, `notes`, `occupation`, `education`, `age_range`, `license_token`, `credits`, `emailVerified`, `verificationToken`, `verificationTokenExpires`) VALUES (32, '99', 'user', NULL, NULL, '99@qq.com', '$2b$10$k.jfZMJU5hozUmsHEjPxy.xPdivEiuJD4F1QOVWVPznQSN8oN6UoW', 'email', 'trial', '2025-08-24', '2025-12-21', '2025-08-24 01:28:49', 'suspended', NULL, NULL, NULL, NULL, NULL, NULL, 0, '8cf86a2fe8e78f38293bb6dcc8c486793c5462100c284c2bf9c2214a9fabdf6e', '2025-08-24 02:28:49');
INSERT INTO `users` (`user_id`, `user_name`, `role`, `first_name`, `last_name`, `email`, `password_hash`, `auth_provider`, `license_type`, `license_start_date`, `license_expiration_date`, `registration_date`, `license_state`, `notes`, `occupation`, `education`, `age_range`, `license_token`, `credits`, `emailVerified`, `verificationToken`, `verificationTokenExpires`) VALUES (33, '22', 'user', NULL, NULL, '222@qq.com', '$2b$10$QlRBjZgJRHpGNOkoEfSpMuuihk1ShJoGo6/TA9tL51YdGxcP0H1UC', 'email', 'trial', '2025-08-24', '2025-12-21', '2025-08-24 21:03:27', 'suspended', NULL, NULL, NULL, NULL, NULL, NULL, 0, '9dd949dfbfdf3faa449125c0bbde90baae871eb54bc3d840ce79d38a3df65894', '2025-08-24 22:03:27');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
