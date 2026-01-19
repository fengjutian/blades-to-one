-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: blades_to_one_database
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `prompts`
--

DROP TABLE IF EXISTS `prompts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prompts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `tags` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `version` int NOT NULL DEFAULT '1',
  `status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `author_id` int DEFAULT NULL,
  `usage_count` int NOT NULL DEFAULT '0',
  `last_used_at` timestamp NULL DEFAULT NULL,
  `is_public` tinyint(1) NOT NULL DEFAULT '1',
  `source` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `remarks` text COLLATE utf8mb4_unicode_ci,
  `role` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `category_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `prompts_author_id_fkey` (`author_id`),
  KEY `prompts_category_id_fkey` (`category_id`),
  CONSTRAINT `prompts_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `prompts_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prompts`
--

LOCK TABLES `prompts` WRITE;
/*!40000 ALTER TABLE `prompts` DISABLE KEYS */;
INSERT INTO `prompts` VALUES (3,'Test Prompt',NULL,'This is a test prompt',NULL,1,'active',4,0,NULL,1,NULL,NULL,'user','2026-01-18 22:58:05',NULL),(4,'Test Prompt',NULL,'This is a test prompt',NULL,1,'active',4,0,NULL,1,NULL,NULL,'user','2026-01-18 23:34:12',NULL),(5,'Test Prompt',NULL,'This is a test prompt',NULL,1,'active',4,0,NULL,1,NULL,NULL,'user','2026-01-18 23:35:37',NULL),(6,'Test Prompt',NULL,'This is a test prompt',NULL,1,'active',4,0,NULL,1,NULL,NULL,'user','2026-01-18 23:40:14',NULL),(7,'Test Prompt',NULL,'This is a test prompt',NULL,1,'active',4,0,NULL,1,NULL,NULL,'user','2026-01-18 23:55:55',NULL),(10,'dsqwdsqdqwdwd','dqwdqwwdq','dqwdqwdqwdqd你还发广告','dqwdqwdq',1,'draft',5,0,NULL,0,'系统生成','qwdqwdqwdqwd','user','2026-01-19 01:09:04',1);
/*!40000 ALTER TABLE `prompts` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-19 17:21:31
