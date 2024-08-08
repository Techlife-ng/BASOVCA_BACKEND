-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 27, 2024 at 12:28 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `brainstorm`
--

-- --------------------------------------------------------

--
-- Table structure for table `blog`
--

CREATE TABLE `blog` (
  `id` int(100) NOT NULL,
  `title` varchar(100) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `attechment` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `blog`
--

INSERT INTO `blog` (`id`, `title`, `content`, `attechment`, `created_at`) VALUES
(3, 'In property law, title is an intangible construct representing a bundle of rights in a piece of prop', 'A new look is coming soon. Google is improving its sign-in page with a more modern look and feel. Di', 'C:\\fakepath\\IMG_8714.jpg', '2024-02-12 12:56:51'),
(6, 'Upgrading to Reactstrap 9', 'trap 9\nReactstrap 9+ now requires on Bootstrap 5.1+. Do not upgrade to Reactstrap v9 if you are usin', 'C:\\fakepath\\IMG_8697.jpg', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `firstname` varchar(255) DEFAULT NULL,
  `lastname` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `firstname`, `lastname`, `username`, `email`, `password`, `role`, `createdAt`, `updatedAt`) VALUES
(1, NULL, NULL, 'admin', 'admin@brainstorm.ng', '$2a$10$m2ojLGXf8M65D8ov8Q6Rk.UjmQdR6eexe1qqVEuAlr65rlGJ9uZQm', NULL, '2024-02-19 12:40:52', '2024-02-19 12:40:52');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `blog`
--
ALTER TABLE `blog`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `blog`
--
ALTER TABLE `blog`
  MODIFY `id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;



DELIMITER $$
--
-- Procedures
--
CREATE PROCEDURE `blog` (IN `query_type` VARCHAR(20), IN `in_id` INT(9), IN `in_title` VARCHAR(100), IN `in_content` VARCHAR(100), IN `in_attechment` VARCHAR(100), IN `in_created_at` VARCHAR(50))   BEGIN 
IF query_type='insert' THEN
INSERT INTO `blog`(title,content,attechment, created_at)
VALUES (in_title,in_content,in_attechment,in_created_at);
ELSEIF query_type='select' THEN
SELECT * FROM `blog`;
ELSEIF query_type='update' THEN
UPDATE `blog` SET `title`=in_tatle,`content`=in_content,`attechment`=in_attechment WHERE id = in_id;
ELSEIF query_type='delete' THEN
DELETE FROM `blog` WHERE id = in_id;
END IF;
END$$

DELIMITER ;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
