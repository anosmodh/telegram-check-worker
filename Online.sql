-- MySQL dump 10.19  Distrib 10.3.35-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: scam_vipmodkey
-- ------------------------------------------------------
-- Server version	10.3.35-MariaDB-cll-lve

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `_ftext`
--

DROP TABLE IF EXISTS `_ftext`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `_ftext` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `_status` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `_ftext` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_ftext`
--

LOCK TABLES `_ftext` WRITE;
/*!40000 ALTER TABLE `_ftext` DISABLE KEYS */;
INSERT INTO `_ftext` (`id`, `_status`, `_ftext`) VALUES (1,'Play Safe || Avoid Report','TEST 123');
/*!40000 ALTER TABLE `_ftext` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `history`
--

DROP TABLE IF EXISTS `history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `history` (
  `id_history` int(11) NOT NULL AUTO_INCREMENT,
  `keys_id` varchar(33) DEFAULT NULL,
  `user_do` varchar(33) DEFAULT NULL,
  `info` mediumtext NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id_history`)
) ENGINE=InnoDB AUTO_INCREMENT=4563 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `history`
--

LOCK TABLES `history` WRITE;
/*!40000 ALTER TABLE `history` DISABLE KEYS */;
/*!40000 ALTER TABLE `history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `keys_code`
--

DROP TABLE IF EXISTS `keys_code`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `keys_code` (
  `id_keys` int(11) NOT NULL AUTO_INCREMENT,
  `game` varchar(32) NOT NULL,
  `user_key` varchar(32) DEFAULT NULL,
  `duration` int(11) DEFAULT NULL,
  `expired_date` datetime DEFAULT NULL,
  `max_devices` int(11) DEFAULT NULL,
  `devices` mediumtext DEFAULT NULL,
  `status` tinyint(1) DEFAULT 1,
  `registrator` varchar(32) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id_keys`),
  UNIQUE KEY `user_key` (`user_key`)
) ENGINE=InnoDB AUTO_INCREMENT=4673 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `keys_code`
--

LOCK TABLES `keys_code` WRITE;
/*!40000 ALTER TABLE `keys_code` DISABLE KEYS */;
/*!40000 ALTER TABLE `keys_code` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `modname`
--

DROP TABLE IF EXISTS `modname`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `modname` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `modname` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `modname`
--

LOCK TABLES `modname` WRITE;
/*!40000 ALTER TABLE `modname` DISABLE KEYS */;
INSERT INTO `modname` (`id`, `modname`) VALUES (1,'hello everyone');
/*!40000 ALTER TABLE `modname` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `onoff`
--

DROP TABLE IF EXISTS `onoff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `onoff` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `status` varchar(5) COLLATE utf8_unicode_ci NOT NULL,
  `myinput` varchar(500) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `onoff`
--

LOCK TABLES `onoff` WRITE;
/*!40000 ALTER TABLE `onoff` DISABLE KEYS */;
INSERT INTO `onoff` (`id`, `status`, `myinput`) VALUES (11,'on','');
/*!40000 ALTER TABLE `onoff` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `referral_code`
--

DROP TABLE IF EXISTS `referral_code`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `referral_code` (
  `id_reff` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(128) DEFAULT NULL,
  `set_saldo` int(11) DEFAULT NULL,
  `used_by` varchar(66) DEFAULT NULL,
  `created_by` varchar(66) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id_reff`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `referral_code`
--

LOCK TABLES `referral_code` WRITE;
/*!40000 ALTER TABLE `referral_code` DISABLE KEYS */;
/*!40000 ALTER TABLE `referral_code` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id_users` int(11) NOT NULL AUTO_INCREMENT,
  `fullname` varchar(155) DEFAULT NULL,
  `username` varchar(66) NOT NULL,
  `level` int(11) DEFAULT 2,
  `saldo` int(11) DEFAULT NULL,
  `status` tinyint(1) DEFAULT 1,
  `uplink` varchar(66) DEFAULT NULL,
  `password` varchar(155) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id_users`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=136 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`id_users`, `fullname`, `username`, `level`, `saldo`, `status`, `uplink`, `password`, `created_at`, `updated_at`) VALUES (1,' OMAR MOD','admin',1,2147483647,1,'admin','$2y$08$RM54Cv11ltGv9niTn7NS0.149d8rgeFFF5UvNo0Fh7aoNek9/RSoi','2022-09-18 16:56:09','2022-09-18 16:57:08');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'scam_vipmodkey'
--

--
-- Dumping routines for database 'scam_vipmodkey'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-09-18 15:28:42
