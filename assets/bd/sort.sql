-- phpMyAdmin SQL Dump
-- version 3.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Nov 29, 2015 at 01:50 PM
-- Server version: 5.5.25
-- PHP Version: 5.3.13

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `sort`
--

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE IF NOT EXISTS `products` (
  `id_product` int(11) NOT NULL AUTO_INCREMENT,
  `prdct_name` varchar(120) DEFAULT NULL,
  `prdct_price` int(11) DEFAULT NULL,
  `id_sort` int(11) NOT NULL,
  PRIMARY KEY (`id_product`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `purchase`
--

CREATE TABLE IF NOT EXISTS `purchase` (
  `id_purchase` int(11) NOT NULL AUTO_INCREMENT,
  `id_product` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `prcs_state` tinyint(1) NOT NULL,
  `prcs_img` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`id_purchase`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id_user` int(11) NOT NULL AUTO_INCREMENT,
  `usr_name` varchar(50) DEFAULT NULL,
  `usr_psw` varchar(150) NOT NULL,
  `usr_email` varchar(50) NOT NULL,
  `usr_phone` varchar(20) NOT NULL,
  `usr_ip` varchar(50) DEFAULT NULL,
  `usr_date_crt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `usr_solt` varchar(20) NOT NULL,
  PRIMARY KEY (`id_user`),
  UNIQUE KEY `usr_email` (`usr_email`),
  UNIQUE KEY `usr_phone` (`usr_phone`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=40 ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id_user`, `usr_name`, `usr_psw`, `usr_email`, `usr_phone`, `usr_ip`, `usr_date_crt`, `usr_solt`) VALUES
(20, 'simom', '41e4jOQBgjGjk', 'pasku@bk.rh', '0934564212', NULL, '2015-11-21 10:35:45', '412'),
(32, 'simom', '14Ol5C7zVA8wk', 'pasku@bk.ru', '0934564212k', NULL, '2015-11-21 10:43:04', '1448102583772'),
(37, 'simom', '14T/ymf1.ww5.', 'pasku@bk.rur', '0934564254', NULL, '2015-11-21 10:50:26', '1448103025216'),
(39, 'simom', '14axB.MN6zKt6', 'pdasku@bk.ru', '0544564212', NULL, '2015-11-21 10:55:34', '1448103333121');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
