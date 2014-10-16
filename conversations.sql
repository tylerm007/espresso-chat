-- phpMyAdmin SQL Dump
-- version 4.0.4
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Oct 16, 2014 at 06:58 AM
-- Server version: 5.6.12-log
-- PHP Version: 5.4.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `conversations`
--
CREATE DATABASE IF NOT EXISTS `conversations` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `conversations`;

-- --------------------------------------------------------

--
-- Table structure for table `boards`
--

CREATE TABLE IF NOT EXISTS `boards` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `fk_creator` varchar(45) NOT NULL,
  `title` varchar(45) NOT NULL,
  `comments` int(11) NOT NULL,
  `open` tinyint(1) NOT NULL,
  `time` datetime NOT NULL,
  `deletable` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `creator` (`fk_creator`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=78 ;

--
-- Dumping data for table `boards`
--

INSERT INTO `boards` (`id`, `fk_creator`, `title`, `comments`, `open`, `time`, `deletable`) VALUES
(73, 'ron', 'Creating a RESTful backend', 1, 1, '2014-10-16 06:22:09', 0),
(74, 'michael', 'Logic Designer', 0, 1, '2014-10-16 06:23:39', 1),
(75, 'michael', 'Rules', 0, 1, '2014-10-16 06:23:51', 1),
(76, 'michael', 'Security', 0, 0, '2014-10-16 06:24:02', 1),
(77, 'michael', 'Resourses', 0, 1, '2014-10-16 06:24:05', 1);

-- --------------------------------------------------------

--
-- Table structure for table `likes`
--

CREATE TABLE IF NOT EXISTS `likes` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `fk_line_id` bigint(20) NOT NULL,
  `fk_username` varchar(45) NOT NULL,
  `fk_liked_user` varchar(45) NOT NULL,
  PRIMARY KEY (`fk_line_id`,`fk_username`),
  KEY `username` (`fk_username`),
  KEY `message_id` (`fk_line_id`),
  KEY `id` (`id`),
  KEY `username_2` (`fk_username`),
  KEY `creator` (`fk_liked_user`),
  KEY `liked_user` (`fk_liked_user`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=56 ;

--
-- Dumping data for table `likes`
--

INSERT INTO `likes` (`id`, `fk_line_id`, `fk_username`, `fk_liked_user`) VALUES
(55, 145, 'michael', 'ron'),
(54, 145, 'ron', 'ron');

-- --------------------------------------------------------

--
-- Table structure for table `lines`
--

CREATE TABLE IF NOT EXISTS `lines` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `fk_parent_id` bigint(20) NOT NULL,
  `fk_board_id` bigint(20) NOT NULL,
  `fk_creator` varchar(45) NOT NULL,
  `message` text NOT NULL,
  `time` datetime NOT NULL,
  `likes` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `conversation_id` (`fk_board_id`),
  KEY `creator` (`fk_creator`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=146 ;

--
-- Dumping data for table `lines`
--

INSERT INTO `lines` (`id`, `fk_parent_id`, `fk_board_id`, `fk_creator`, `message`, `time`, `likes`) VALUES
(145, 0, 73, 'ron', 'Good Morning!', '2014-10-16 06:23:07', 2);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `uq_username` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `password` varchar(40) NOT NULL,
  `comment_count` int(11) DEFAULT '0',
  `likes_count` int(11) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`uq_username`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=52 ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `uq_username`, `email`, `password`, `comment_count`, `likes_count`) VALUES
(50, 'ron', 'ron@espressologic.com', '45798f269709550d6f6e1d2cf4b7d485=chat', 1, 2),
(51, 'michael', 'michael@espressologic.com', '0acf4539a14b3aa27deeb4cbdf6e989f=chat', 0, 0);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `boards`
--
ALTER TABLE `boards`
  ADD CONSTRAINT `board_owner` FOREIGN KEY (`fk_creator`) REFERENCES `users` (`uq_username`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `likes`
--
ALTER TABLE `likes`
  ADD CONSTRAINT `liked_user` FOREIGN KEY (`fk_username`) REFERENCES `users` (`uq_username`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `line_likes` FOREIGN KEY (`fk_line_id`) REFERENCES `lines` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `user_liked` FOREIGN KEY (`fk_liked_user`) REFERENCES `users` (`uq_username`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `user_liking` FOREIGN KEY (`fk_username`) REFERENCES `users` (`uq_username`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `lines`
--
ALTER TABLE `lines`
  ADD CONSTRAINT `line_owner` FOREIGN KEY (`fk_creator`) REFERENCES `users` (`uq_username`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `dialogue` FOREIGN KEY (`fk_board_id`) REFERENCES `boards` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
