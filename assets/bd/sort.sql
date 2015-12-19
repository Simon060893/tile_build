-- phpMyAdmin SQL Dump
-- version 3.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Dec 20, 2015 at 12:37 AM
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
  `prdct_size` varchar(25) NOT NULL,
  `prdct_price` int(11) DEFAULT NULL,
  `id_sort` int(11) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_product`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=15 ;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id_product`, `prdct_name`, `prdct_size`, `prdct_price`, `id_sort`, `created`) VALUES
(1, 'v1', '20*20', 4, 0, '2015-12-19 10:55:33'),
(2, 'v2', '25*25', 7, 0, '2015-12-19 10:55:33'),
(3, 'v3', '54*54', 31, 0, '2015-12-19 11:01:16'),
(4, 'v4', '100*100', 105, 0, '2015-12-19 11:01:16'),
(5, 'v5', '150*150', 236, 0, '2015-12-19 11:01:16'),
(6, 'v6', '200*200', 420, 0, '2015-12-19 11:01:16'),
(7, 'v7', '200*400', 656, 0, '2015-12-19 11:01:16'),
(8, 'v8', '250*250', 179, 0, '2015-12-19 11:01:16'),
(9, 'v9', '275*62', 116, 0, '2015-12-19 11:01:16'),
(10, 'v10', '275*400', 945, 0, '2015-12-19 11:01:16'),
(11, 'v11', '300*300', 1890, 0, '2015-12-19 11:01:16'),
(12, 'v12', '300*600', 412, 0, '2015-12-19 11:01:16'),
(13, 'v13', '400*98', 1618, 0, '2015-12-19 11:01:16'),
(14, 'v16', '400*400', 105, 0, '2015-12-19 11:01:16');

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
-- Table structure for table `sorts`
--

CREATE TABLE IF NOT EXISTS `sorts` (
  `id_sort` int(11) NOT NULL AUTO_INCREMENT,
  `srt_name` varchar(150) NOT NULL,
  `srt_adress` varchar(250) NOT NULL,
  `srt_phone` varchar(10) NOT NULL,
  `srt_email` varchar(50) NOT NULL,
  `id_user` int(11) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_sort`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

--
-- Dumping data for table `sorts`
--

INSERT INTO `sorts` (`id_sort`, `srt_name`, `srt_adress`, `srt_phone`, `srt_email`, `id_user`, `created`) VALUES
(0, 'sdf', 'dg', '0934415968', 'hgf@hj.ty', 0, '2015-12-13 10:18:41'),
(2, 'sas', 'ds', '0934415968', 'as@f.cf', 0, '2015-12-13 11:36:12'),
(3, 'sd', 'd', '0934415435', 'Ds@fd', 0, '2015-12-13 11:37:09'),
(4, 'd', 'fd', 'r', 'df', 0, '2015-12-13 12:24:36');

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
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `usr_solt` varchar(20) NOT NULL,
  `usr_type` varchar(20) NOT NULL,
  PRIMARY KEY (`id_user`),
  UNIQUE KEY `usr_email` (`usr_email`),
  UNIQUE KEY `usr_phone` (`usr_phone`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=50 ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id_user`, `usr_name`, `usr_psw`, `usr_email`, `usr_phone`, `usr_ip`, `created`, `usr_solt`, `usr_type`) VALUES
(47, 'senia', '14MuT1/YmTK6M', 'pasusam@gmail.com', '0936415968', NULL, '2015-12-12 14:14:06', '1449929645650', 'customer'),
(49, 'senia', '14MuT1/YmTK6M', 'pasku@bk.ru', '0934415968', NULL, '2015-12-13 09:14:02', '1449998041576', 'executor');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
