/*
 Navicat Premium Dump SQL

 Source Server         : localhost_3306
 Source Server Type    : MySQL
 Source Server Version : 80403 (8.4.3)
 Source Host           : localhost:3306
 Source Schema         : smart_park_db

 Target Server Type    : MySQL
 Target Server Version : 80403 (8.4.3)
 File Encoding         : 65001

 Date: 23/05/2025 20:05:17
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for _prisma_migrations
-- ----------------------------
DROP TABLE IF EXISTS `_prisma_migrations`;
CREATE TABLE `_prisma_migrations`  (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) NULL DEFAULT NULL,
  `migration_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `rolled_back_at` datetime(3) NULL DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of _prisma_migrations
-- ----------------------------
INSERT INTO `_prisma_migrations` VALUES ('a01ac073-2d5a-4b96-ab99-36284dea83d4', '5c60beb1a0447afd1a16b0f2a9c91a4fa408e90c2d548bc48a0f410c9745544d', '2025-05-23 09:08:01.933', '20250523090801_init', NULL, NULL, '2025-05-23 09:08:01.487', 1);

-- ----------------------------
-- Table structure for alarms
-- ----------------------------
DROP TABLE IF EXISTS `alarms`;
CREATE TABLE `alarms`  (
  `api_record_id` bigint NOT NULL,
  `device_code` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `alarm_type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `alarm_level` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `alarm_time` datetime(3) NOT NULL,
  `alarm_status` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `location_at_alarm` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `last_updated` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`api_record_id`) USING BTREE,
  INDEX `Alarms_device_code_fkey`(`device_code` ASC) USING BTREE,
  CONSTRAINT `Alarms_device_code_fkey` FOREIGN KEY (`device_code`) REFERENCES `devices` (`device_code`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of alarms
-- ----------------------------
INSERT INTO `alarms` VALUES (2001, 'D002', '烟雾报警', '高', '2025-05-23 19:56:45.000', '未处理', 'B002-2F', '2025-05-23 19:56:45.853');
INSERT INTO `alarms` VALUES (2002, 'D003', '掉线', '中', '2025-05-23 17:56:45.000', '处理中', 'B003-1F', '2025-05-23 19:56:45.853');
INSERT INTO `alarms` VALUES (2003, 'D004', '非法入侵', '高', '2025-05-22 19:56:45.000', '已处理', 'B004-B1', '2025-05-23 19:56:45.853');

-- ----------------------------
-- Table structure for buildings
-- ----------------------------
DROP TABLE IF EXISTS `buildings`;
CREATE TABLE `buildings`  (
  `building_code` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `yq_app_code` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `building_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `floors_info_json` json NULL,
  PRIMARY KEY (`building_code`) USING BTREE,
  INDEX `Buildings_yq_app_code_fkey`(`yq_app_code` ASC) USING BTREE,
  CONSTRAINT `Buildings_yq_app_code_fkey` FOREIGN KEY (`yq_app_code`) REFERENCES `parks` (`yq_app_code`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of buildings
-- ----------------------------
INSERT INTO `buildings` VALUES ('B001', 'YQ001', 'A栋', '[\"1F\", \"2F\", \"3F\"]');
INSERT INTO `buildings` VALUES ('B002', 'YQ001', 'B栋', '[\"1F\", \"2F\"]');
INSERT INTO `buildings` VALUES ('B003', 'YQ002', 'C栋', '[\"1F\", \"2F\", \"3F\", \"4F\"]');
INSERT INTO `buildings` VALUES ('B004', 'YQ003', 'D栋', '[\"B1\", \"1F\", \"2F\"]');
INSERT INTO `buildings` VALUES ('BLD_A01_P001', 'YQ_PARK_001', '研发中心A座', '{\"labs\": [\"1-2F\"], \"office_areas\": [\"3-12F\"], \"total_floors\": 12, \"parking_spaces\": 200, \"underground_floors\": 2}');
INSERT INTO `buildings` VALUES ('BLD_B01_P001', 'YQ_PARK_001', '孵化器B座', '{\"total_floors\": 8, \"shared_workspaces\": true, \"underground_floors\": 1, \"meeting_rooms_count\": 15}');
INSERT INTO `buildings` VALUES ('BLD_C01_P003', 'YQ_PARK_003', '艺术展览馆', NULL);
INSERT INTO `buildings` VALUES ('BLD_W01_P002', 'YQ_PARK_002', '1号智能仓库', '{\"total_floors\": 1, \"storage_capacity_m3\": 50000, \"temperature_controlled_zones\": [\"Zone A\", \"Zone B\"]}');
INSERT INTO `buildings` VALUES ('BLD_W02_P002', 'YQ_PARK_002', '2号转运中心', '{\"total_floors\": 2, \"loading_docks\": 20}');

-- ----------------------------
-- Table structure for devices
-- ----------------------------
DROP TABLE IF EXISTS `devices`;
CREATE TABLE `devices`  (
  `device_code` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `api_record_id` bigint NULL DEFAULT NULL,
  `yq_app_code` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `building_code` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `device_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `device_type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `device_status` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `location` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `responsible_person_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `channels_info_json` json NULL,
  `last_updated` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`device_code`) USING BTREE,
  UNIQUE INDEX `Devices_api_record_id_key`(`api_record_id` ASC) USING BTREE,
  INDEX `Devices_yq_app_code_fkey`(`yq_app_code` ASC) USING BTREE,
  INDEX `Devices_building_code_fkey`(`building_code` ASC) USING BTREE,
  CONSTRAINT `Devices_building_code_fkey` FOREIGN KEY (`building_code`) REFERENCES `buildings` (`building_code`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Devices_yq_app_code_fkey` FOREIGN KEY (`yq_app_code`) REFERENCES `parks` (`yq_app_code`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of devices
-- ----------------------------
INSERT INTO `devices` VALUES ('D001', 1001, 'YQ001', 'B001', '温湿度传感器A1', 'Sensor', 'Active', 'B001-1F', '张三', '[\"CH1\", \"CH2\"]', '2025-05-23 19:56:45.849');
INSERT INTO `devices` VALUES ('D002', 1002, 'YQ001', 'B002', '烟雾报警器B2', 'Alarm', 'Active', 'B002-2F', '李四', '[\"CH1\"]', '2025-05-23 19:56:45.849');
INSERT INTO `devices` VALUES ('D003', 1003, 'YQ002', 'B003', '摄像头C1', 'Camera', 'Offline', 'B003-1F', '王五', '[\"CH1\", \"CH2\", \"CH3\"]', '2025-05-23 19:56:45.849');
INSERT INTO `devices` VALUES ('D004', 1004, 'YQ003', 'B004', '门禁设备D1', 'Access', 'Active', 'B004-B1', '赵六', '[\"IN\", \"OUT\"]', '2025-05-23 19:56:45.849');

-- ----------------------------
-- Table structure for generic_records
-- ----------------------------
DROP TABLE IF EXISTS `generic_records`;
CREATE TABLE `generic_records`  (
  `record_id` int NOT NULL AUTO_INCREMENT,
  `record_type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `yq_app_code_context` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `related_entity_code` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `record_data_json` json NOT NULL,
  `timestamp` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`record_id`) USING BTREE,
  INDEX `Generic_Records_yq_app_code_context_fkey`(`yq_app_code_context` ASC) USING BTREE,
  CONSTRAINT `Generic_Records_yq_app_code_context_fkey` FOREIGN KEY (`yq_app_code_context`) REFERENCES `parks` (`yq_app_code`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of generic_records
-- ----------------------------
INSERT INTO `generic_records` VALUES (1, '设备巡检', 'YQ001', 'D001', '{\"status\": \"正常\", \"inspector\": \"张三\"}', '2025-05-23 19:56:45.857');
INSERT INTO `generic_records` VALUES (2, '能耗记录', 'YQ001', 'B001', '{\"water\": 67.89, \"electricity\": 123.45}', '2025-05-23 19:56:45.857');
INSERT INTO `generic_records` VALUES (3, '安保事件', 'YQ002', 'D003', '{\"time\": \"2025-05-23 19:56:45.000000\", \"event\": \"可疑人员入侵\"}', '2025-05-23 19:56:45.857');
INSERT INTO `generic_records` VALUES (4, '维保记录', 'YQ003', 'D004', '{\"result\": \"完成\", \"maintainer\": \"赵六\"}', '2025-05-23 19:56:45.857');

-- ----------------------------
-- Table structure for generic_stats_and_timeseries
-- ----------------------------
DROP TABLE IF EXISTS `generic_stats_and_timeseries`;
CREATE TABLE `generic_stats_and_timeseries`  (
  `entry_id` int NOT NULL AUTO_INCREMENT,
  `metric_source_api` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `metric_description` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `yq_app_code_context` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `related_entity_code_context` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `time_period_or_timestamp` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `value_numeric` decimal(18, 4) NULL DEFAULT NULL,
  `value_text` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `value_complex_json` json NULL,
  `last_updated` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`entry_id`) USING BTREE,
  INDEX `Generic_Stats_And_TimeSeries_yq_app_code_context_fkey`(`yq_app_code_context` ASC) USING BTREE,
  CONSTRAINT `Generic_Stats_And_TimeSeries_yq_app_code_context_fkey` FOREIGN KEY (`yq_app_code_context`) REFERENCES `parks` (`yq_app_code`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of generic_stats_and_timeseries
-- ----------------------------
INSERT INTO `generic_stats_and_timeseries` VALUES (1, 'api.energy', '电能消耗', 'YQ001', 'B001', '2025-05-01', 150.2300, NULL, NULL, '2025-05-23 19:56:45.861');
INSERT INTO `generic_stats_and_timeseries` VALUES (2, 'api.temperature', '平均温度', 'YQ001', 'D001', '2025-05-01T08:00:00', 23.4000, NULL, NULL, '2025-05-23 19:56:45.861');
INSERT INTO `generic_stats_and_timeseries` VALUES (3, 'api.security', '安保事件数', 'YQ002', NULL, '2025-Q2', 5.0000, NULL, NULL, '2025-05-23 19:56:45.861');
INSERT INTO `generic_stats_and_timeseries` VALUES (4, 'api.maintenance', '维保状态', 'YQ003', 'D004', '2025-05-20T10:00:00', NULL, '已完成', NULL, '2025-05-23 19:56:45.861');

-- ----------------------------
-- Table structure for parks
-- ----------------------------
DROP TABLE IF EXISTS `parks`;
CREATE TABLE `parks`  (
  `yq_app_code` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `yq_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `kj_type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `extra_details_json` json NULL,
  PRIMARY KEY (`yq_app_code`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of parks
-- ----------------------------
INSERT INTO `parks` VALUES ('YQ_PARK_001', '未来科技创新园', '高新技术园区', '{\"contact_phone\": \"13800138001\", \"contact_person\": \"王经理\", \"total_area_sqm\": 150000, \"established_year\": 2010, \"green_coverage_rate\": 0.4}');
INSERT INTO `parks` VALUES ('YQ_PARK_002', '环球贸易物流港', '物流仓储园区', '{\"total_area_sqm\": 300000, \"warehouse_count\": 50, \"established_year\": 2015, \"annual_throughput_tons\": 5000000}');
INSERT INTO `parks` VALUES ('YQ_PARK_003', '创意文化产业园', '文化创意园区', NULL);
INSERT INTO `parks` VALUES ('YQ001', '智慧园区A', '工业', '{\"address\": \"科技路1号\"}');
INSERT INTO `parks` VALUES ('YQ002', '智慧园区B', '商业', '{\"address\": \"产业园2号\"}');
INSERT INTO `parks` VALUES ('YQ003', '智慧园区C', '住宅', '{\"address\": \"未来城3号\"}');

SET FOREIGN_KEY_CHECKS = 1;
