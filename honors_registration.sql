-- MySQL dump 10.13  Distrib 8.0.35, for Win64 (x86_64)
--
-- Host: localhost    Database: honors_registration
-- ------------------------------------------------------
-- Server version	8.0.35

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin` (
  `username` varchar(50) NOT NULL,
  `password` varchar(100) NOT NULL,
  `role_id` int NOT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` VALUES ('212025','hodmam@cse',2);
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cgpa`
--

DROP TABLE IF EXISTS `cgpa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cgpa` (
  `username` varchar(50) DEFAULT NULL,
  `Name` varchar(100) DEFAULT NULL,
  `CGPA` float DEFAULT NULL,
  UNIQUE KEY `rollNo` (`username`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cgpa`
--

LOCK TABLES `cgpa` WRITE;
/*!40000 ALTER TABLE `cgpa` DISABLE KEYS */;
INSERT INTO `cgpa` VALUES ('1','Aswani Bolisetti',8.75),('2','John Doe',7.9),('3','Jane Smith',8.2),('4','Alice Johnson',9.1),('5','Bob Williams',7.8);
/*!40000 ALTER TABLE `cgpa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `courses`
--

DROP TABLE IF EXISTS `courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `courses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `course_name` varchar(255) NOT NULL,
  `course_id` varchar(50) NOT NULL,
  `duration` varchar(255) DEFAULT NULL,
  `fees` decimal(10,2) DEFAULT NULL,
  `department` varchar(255) NOT NULL,
  `insert_ts` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_ts` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `year` int DEFAULT NULL,
  `sem` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `course_id` (`course_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courses`
--

LOCK TABLES `courses` WRITE;
/*!40000 ALTER TABLE `courses` DISABLE KEYS */;
INSERT INTO `courses` VALUES (3,'Regression Modelling Techniques','20CST01',NULL,NULL,'CSE','2025-03-11 06:28:01','2025-03-11 06:28:01',3,1),(4,'it','510',NULL,NULL,'CSE','2025-03-11 06:36:40','2025-03-11 06:36:40',3,2),(5,'YTRY','20CST02',NULL,NULL,'CSE','2025-03-11 06:39:51','2025-03-11 06:39:51',4,1);
/*!40000 ALTER TABLE `courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `droprequests`
--

DROP TABLE IF EXISTS `droprequests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `droprequests` (
  `rollNo` varchar(20) NOT NULL,
  `year` int DEFAULT NULL,
  `sem` int DEFAULT NULL,
  `current_year` varchar(20) DEFAULT NULL,
  `department` varchar(50) DEFAULT NULL,
  `status` tinyint(1) DEFAULT '0',
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`rollNo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `droprequests`
--

LOCK TABLES `droprequests` WRITE;
/*!40000 ALTER TABLE `droprequests` DISABLE KEYS */;
/*!40000 ALTER TABLE `droprequests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `registrations`
--

DROP TABLE IF EXISTS `registrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `registrations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `course_id` varchar(50) DEFAULT NULL,
  `course_name` varchar(255) DEFAULT NULL,
  `student_id` varchar(100) NOT NULL,
  `year` int NOT NULL,
  `sem` tinyint NOT NULL,
  `insert_ts` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_ts` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `department` varchar(255) DEFAULT NULL,
  `course_ids` json DEFAULT NULL,
  `course_names` json DEFAULT NULL,
  `current_year` int DEFAULT NULL,
  `dropped_status` tinyint(1) DEFAULT '0',
  `trackcourse` varchar(255) DEFAULT NULL,
  `passout_year` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `registrations`
--

LOCK TABLES `registrations` WRITE;
/*!40000 ALTER TABLE `registrations` DISABLE KEYS */;
INSERT INTO `registrations` VALUES (2,'[\"20CST01\"]','[\"20CST01 - Regression Modelling Techniques\"]','1',3,1,'2025-03-15 05:01:08','2025-03-15 05:01:08','CSE',NULL,NULL,2025,0,NULL,'2023-2027');
/*!40000 ALTER TABLE `registrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role` varchar(50) NOT NULL,
  `role_id` int NOT NULL,
  `other_details` json DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Student',1,NULL),(2,'Admin',2,NULL),(3,'Teacher',3,NULL);
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `students` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `rollNo` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `department` varchar(255) NOT NULL,
  `insert_ts` bigint DEFAULT NULL,
  `update_ts` bigint DEFAULT NULL,
  `other_details` json DEFAULT NULL,
  `mobile_no` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `rollNo` (`rollNo`),
  UNIQUE KEY `mobile_no` (`mobile_no`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
INSERT INTO `students` VALUES (1,'Aswani Bolisetti','1','aswanibolisetti@gmail.com','CSE',NULL,NULL,NULL,9392700233);
/*!40000 ALTER TABLE `students` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trackcourses`
--

DROP TABLE IF EXISTS `trackcourses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trackcourses` (
  `department` varchar(50) DEFAULT NULL,
  `year` int DEFAULT NULL,
  `sem` int DEFAULT NULL,
  `trackCourseName` varchar(100) DEFAULT NULL,
  `course_id` varchar(255) NOT NULL,
  `course_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`course_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trackcourses`
--

LOCK TABLES `trackcourses` WRITE;
/*!40000 ALTER TABLE `trackcourses` DISABLE KEYS */;
INSERT INTO `trackcourses` VALUES ('CSE',3,2,'Data Science','20CST03','Augumented Reality'),('CSE',3,2,'Artificial Intelligence','20CST04','Sentiment Analysis'),('CSE',4,1,'Data Science','20CST05','OOPS');
/*!40000 ALTER TABLE `trackcourses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `other_details` json DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `unique_username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'1','aswanibolisetti@gmail.com','12345',1,'2025-03-15 05:00:14','2025-03-15 05:00:55',NULL,1),(2,'2','johndoe@example.com',NULL,1,'2025-03-15 05:00:14','2025-03-15 05:00:14',NULL,1),(3,'3','janesmith@example.com',NULL,1,'2025-03-15 05:00:14','2025-03-15 05:00:14',NULL,1),(4,'4','alicejohnson@example.com',NULL,1,'2025-03-15 05:00:14','2025-03-15 05:00:14',NULL,1),(5,'10','student10@example.com',NULL,1,'2025-03-15 05:49:02','2025-03-15 05:49:02',NULL,1),(6,'11','student11@example.com',NULL,1,'2025-03-15 05:49:02','2025-03-15 05:49:02',NULL,1),(7,'12','student12@example.com',NULL,1,'2025-03-15 05:49:03','2025-03-15 05:49:03',NULL,1),(8,'13','student13@example.com',NULL,1,'2025-03-15 05:49:03','2025-03-15 05:49:03',NULL,1),(9,'14','student14@example.com',NULL,1,'2025-03-15 05:49:03','2025-03-15 05:49:03',NULL,1);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-15 15:47:58
