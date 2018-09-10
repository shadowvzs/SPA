-- phpMyAdmin SQL Dump
-- version 4.5.4.1deb2ubuntu2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Apr 02, 2018 at 04:09 PM
-- Server version: 5.7.20-0ubuntu0.16.04.1
-- PHP Version: 7.0.22-0ubuntu0.16.04.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `kovacscsaba`
--

-- --------------------------------------------------------

--
-- Table structure for table `albums`
--

CREATE TABLE `albums` (
  `id` int(11) NOT NULL,
  `status` tinyint(4) NOT NULL,
  `user_id` int(15) NOT NULL,
  `title` varchar(100) COLLATE utf8_hungarian_ci NOT NULL,
  `description` text COLLATE utf8_hungarian_ci NOT NULL,
  `created` datetime NOT NULL,
  `updated` datetime DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- Dumping data for table `albums`
--

INSERT INTO `albums` (`id`, `status`, `user_id`, `title`, `description`, `created`, `updated`) VALUES
(1, 1, 1, 'Gyülekezet', 'A gyülekezetünk jelen és múltjáről képek.', '2011-11-27 09:44:20', NULL),
(2, 1, 1, 'Munkálatok nálunk', 'Ez egy album', '2011-11-27 09:44:20', NULL),
(3, 1, 1, 'Vendégek', '', '2011-11-27 09:44:20', NULL),
(4, 1, 1, 'Misszió', '', '2011-11-27 09:44:20', NULL),
(5, 1, 1, 'Keresztség (régebbrôl)', '', '2011-11-27 09:44:20', NULL),
(6, 1, 1, 'Szalontai Győzelem Gyülekezet', '', '2011-11-27 09:44:20', NULL),
(7, 1, 1, 'Egyéb', '', '2011-11-27 09:44:20', NULL),
(8, 1, 1, 'Keresztség - 2012', 'Keresztség 2012 Július 22', '2012-07-22 16:08:12', NULL),
(9, 1, 1, '2012 szilveszter', 'A képek a 2012-es szilveszteri alkalomról', '2013-01-02 18:21:46', NULL),
(10, 1, 1, 'Keresztség - 2013', 'Keresztség,  2013 május 5.', '2013-05-06 05:13:04', NULL),
(11, 1, 1, 'Yun testvér', 'Yun (Jün) testvér a sportcsarnokban 2013 Nagyvárad', '2013-05-16 18:42:51', NULL),
(12, 1, 1, 'Arnaldo Fernandez', 'Szeretet nyelve elôadása', '2013-06-04 19:08:12', NULL),
(13, 1, 1, '2014', '', '2014-12-25 18:30:24', NULL),
(14, 1, 1, '2015 Jan. böjt téma', 'A 21 napos (január 5-25) böjt témái', '2015-01-18 11:52:00', NULL),
(16, 3, 1, 'Majális 2015', '2015 Május elsejei majálisozás a gyüli egy részével', '2015-05-01 18:03:19', NULL),
(17, 1, 1, 'Karácsony - 2015', 'A képek a 2015 -ös karácsonyi alkalomról készültek', '2016-01-04 17:35:47', NULL),
(18, 1, 1, 'Szilveszter - 2015', 'Szilveszteri alkalomról képek', '2016-01-05 15:54:24', NULL),
(19, 1, 1, '2016 Jan. böjt téma', '2016 Januári (4-24) böjti téma', '2016-01-08 17:49:19', NULL),
(20, 1, 1, 'Keresztség - 2016', 'A 2016 májusi keresztség képei', '2016-06-02 14:28:12', NULL),
(21, 1, 1, 'Magura Racatau', 'Kirándulás Magura Racataun 2016. Július', '2016-08-14 13:08:14', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `guests`
--

CREATE TABLE `guests` (
  `id` int(11) NOT NULL,
  `guest` varchar(100) COLLATE utf8_hungarian_ci NOT NULL,
  `gdate` varchar(20) COLLATE utf8_hungarian_ci NOT NULL,
  `title` varchar(100) COLLATE utf8_hungarian_ci NOT NULL,
  `txt` varchar(255) COLLATE utf8_hungarian_ci NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- Dumping data for table `guests`
--

INSERT INTO `guests` (`id`, `guest`, `gdate`, `title`, `txt`) VALUES
(1, 'Mikes Attila,Szilágyi Zsolt,Popovics Krisztián', '2011.11.27 16:00', '-', '-'),
(2, 'Nagy Péter', '2011.12.11 10:00', '-', 'reggel 10-tôl, délután 3-tól'),
(3, 'Bálint Gyula', '2012.01.08 16:00', '', ''),
(4, 'Berkes Sándor', '2012.05.05 18:00', 'özönvíz', 'elôtte 1 héttel lesz pontos óra'),
(5, 'Bálint Gyula', '2012.06.24 16:00', '-', '-'),
(6, 'Nagy Péter', '2012.07.15 10:00', '', ''),
(7, 'Bálint Gyula', '2012.11.17 18:00', '-', ''),
(8, 'Cselovszki Attila', '2013.04.14 16:00', '-', '-'),
(9, 'Perjesi István', '2013.09.01 16:00', '', ''),
(10, 'Kiss József', '2014.02.23 16:00', '', ''),
(11, 'Kiss József', '2014.04.06 16:00', '', ''),
(12, 'Berkes Sándor', '2014.04.17 10:00', 'Teremtés, b&#369;neset, helyreállítás', ''),
(13, 'Kiss József', '2014.08.24 18:00', '', ''),
(14, 'Berkes Sándor', '2014.10.26 10:00', 'Teremtés, Helyreállítás', 'Vatikán végnapjai'),
(15, 'Perjes István', '2015.01.18 16:00', '', ''),
(16, 'Ambrus Tibor, Kiss József', '2015.02.08 16:00', '', ''),
(17, 'Gégény Csava & Éva', '2015.07.05 16:00', '', ''),
(18, 'Bálint Gyula', '2015.08.23 16:00', '', ''),
(19, 'Ambrus Tibor, Kiss József', '2015.10.18 16:00', '', ''),
(20, 'Perjesi István', '2015.11.22 16:00', '', ''),
(21, 'Boros Gyula', '2015.12.06 16:00', '', ''),
(22, 'Perjesi István', '2016.02.21 10:00', '', ''),
(25, 'Ambrus Tibor', '2016.05.22 16:00', '', ''),
(24, 'Berkes Sándor', '2016.05.15 10:00', '', 'Isten pecsétje, és a fenevad bélyege'),
(26, 'Perjesi István', '2016.10.09 16:00', '', '');

-- --------------------------------------------------------

--
-- Table structure for table `images`
--

CREATE TABLE `images` (
  `id` int(11) NOT NULL,
  `status` tinyint(4) UNSIGNED NOT NULL DEFAULT '1',
  `album_id` int(11) UNSIGNED NOT NULL,
  `user_id` int(11) UNSIGNED NOT NULL,
  `path` varchar(255) COLLATE utf8_hungarian_ci NOT NULL,
  `description` varchar(255) COLLATE utf8_hungarian_ci NOT NULL,
  `created` datetime NOT NULL,
  `updated` datetime DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- Dumping data for table `images`
--

INSERT INTO `images` (`id`, `status`, `album_id`, `user_id`, `path`, `description`, `created`, `updated`) VALUES
(1, 1, 1, 1, 'gyuli1.jpg', 'Egy regi kep :)\r\n', '2011-11-27 09:44:20', NULL),
(2, 1, 1, 1, 'gyuli3.jpg', ' ', '2011-11-27 09:44:20', NULL),
(3, 1, 1, 1, 'gyuli4.jpg', ' ', '2011-11-27 09:44:20', NULL),
(4, 1, 1, 1, 'gyuli5.jpg', ' ', '2011-11-27 09:44:20', NULL),
(5, 1, 1, 1, 'gyuli6.jpg', ' ', '2011-11-27 09:44:20', NULL),
(6, 1, 1, 1, 'gyuli7.jpg', ' ', '2011-11-27 09:44:20', NULL),
(7, 1, 1, 1, 'gyuli8.jpg', ' ', '2011-11-27 09:44:20', NULL),
(8, 1, 1, 1, 'gyuli9.jpg', ' ', '2011-11-27 09:44:20', NULL),
(9, 1, 1, 1, 'gyuli11.jpg', ' ', '2011-11-27 09:44:20', NULL),
(10, 1, 1, 1, 'gyuli12.jpg', ' ', '2011-11-27 09:44:20', NULL),
(11, 1, 1, 1, 'gyuli13.jpg', 'Régebbi kép', '2011-11-27 09:44:20', NULL),
(12, 1, 1, 1, 'gyuli14.jpg', 'Régebbi kép', '2011-11-27 09:44:20', NULL),
(13, 1, 1, 1, 'gyuli15.jpg', 'Lajos család Mihályfalváről', '2011-11-27 09:44:20', NULL),
(14, 1, 1, 1, 'gyuli_o1.jpg', 'Régen - még átalakítás előtt', '2011-11-27 09:44:20', NULL),
(15, 1, 1, 1, 'gyuli_o2.jpg', ' Egy masik regi kep\r\n', '2011-11-27 09:44:20', NULL),
(16, 1, 2, 1, 'gyuli_m0.jpg', ' ', '2011-11-27 09:44:20', NULL),
(17, 1, 2, 1, 'gyuli_m1.jpg', ' ', '2011-11-27 09:44:20', NULL),
(18, 1, 2, 1, 'gyuli_m2.jpg', ' ', '2011-11-27 09:44:20', NULL),
(19, 1, 2, 1, 'gyuli_m3.jpg', ' ', '2011-11-27 09:44:20', NULL),
(20, 1, 2, 1, 'gyuli_m4.jpg', ' ', '2011-11-27 09:44:20', NULL),
(21, 1, 2, 1, 'gyuli_m5.jpg', ' ', '2011-11-27 09:44:20', NULL),
(22, 1, 2, 1, 'gyuli_m6.jpg', ' ', '2011-11-27 09:44:20', NULL),
(23, 1, 2, 1, 'gyuli_k0.jpg', ' ', '2011-11-27 09:44:20', NULL),
(24, 1, 2, 1, 'gyuli_k1.jpg', ' ', '2011-11-27 09:44:20', NULL),
(25, 1, 2, 1, 'gyuli_k2.jpg', ' ', '2011-11-27 09:44:20', NULL),
(26, 1, 3, 1, 'P001.jpg', ' Katona Zsolt\r\n', '2011-11-27 09:44:20', NULL),
(27, 1, 3, 1, 'P002.jpg', ' Dinnyés Imre\r\n', '2011-11-27 09:44:20', NULL),
(28, 1, 3, 1, 'guest0.jpg', ' Berkes Sándor és veje James\r\n', '2011-11-27 09:44:20', NULL),
(29, 1, 3, 1, 'guest1.jpg', ' Berkes Sándor\r\n', '2011-11-27 09:44:20', NULL),
(30, 1, 3, 1, 'guest2.jpg', ' Nagy Péter\r\n', '2011-11-27 09:44:20', NULL),
(31, 1, 3, 1, 'guest3.jpg', ' Nagy Péter\r\n', '2011-11-27 09:44:20', NULL),
(32, 1, 3, 1, 'guest4.jpg', ' Nagy Péter\r\n', '2011-11-27 09:44:20', NULL),
(33, 1, 4, 1, 'misszio0.jpg', ' ', '2011-11-27 09:44:20', NULL),
(34, 1, 4, 1, 'misszio1.jpg', ' ', '2011-11-27 09:44:20', NULL),
(35, 1, 4, 1, 'misszio2.jpg', ' ', '2011-11-27 09:44:20', NULL),
(36, 1, 4, 1, 'misszio3.jpg', ' ', '2011-11-27 09:44:20', NULL),
(37, 1, 4, 1, 'misszio4.jpg', ' ', '2011-11-27 09:44:20', NULL),
(38, 1, 4, 1, 'misszio5.jpg', ' ', '2011-11-27 09:44:20', NULL),
(39, 1, 4, 1, 'petri0.jpg', ' ', '2011-11-27 09:44:20', NULL),
(40, 1, 4, 1, 'petri1.jpg', ' ', '2011-11-27 09:44:20', NULL),
(41, 1, 4, 1, 'petri2.jpg', ' ', '2011-11-27 09:44:20', NULL),
(42, 1, 4, 1, 'petri3.jpg', ' ', '2011-11-27 09:44:20', NULL),
(43, 1, 5, 1, 'keresztseg0.jpg', ' ', '2011-11-27 09:44:20', NULL),
(44, 1, 5, 1, 'keresztseg1.jpg', ' ', '2011-11-27 09:44:20', NULL),
(45, 1, 5, 1, 'keresztseg2.jpg', ' ', '2011-11-27 09:44:20', NULL),
(46, 1, 5, 1, 'keresztseg3.jpg', ' ', '2011-11-27 09:44:20', NULL),
(47, 1, 5, 1, 'keresztseg4.jpg', ' ', '2011-11-27 09:44:20', NULL),
(48, 1, 5, 1, 'keresztseg6.jpg', ' ', '2011-11-27 09:44:20', NULL),
(49, 1, 5, 1, 'keresztseg7.jpg', ' ', '2011-11-27 09:44:20', NULL),
(50, 1, 5, 1, 'keresztseg8.jpg', ' ', '2011-11-27 09:44:20', NULL),
(51, 1, 5, 1, 'keresztseg9.jpg', ' ', '2011-11-27 09:44:20', NULL),
(52, 1, 5, 1, 'keresztseg10.jpg', ' ', '2011-11-27 09:44:20', NULL),
(53, 1, 5, 1, 'keresztseg11.jpg', ' ', '2011-11-27 09:44:20', NULL),
(54, 1, 5, 1, 'keresztseg12.jpg', ' ', '2011-11-27 09:44:20', NULL),
(55, 1, 5, 1, 'keresztseg13.jpg', ' ', '2011-11-27 09:44:20', NULL),
(56, 1, 5, 1, 'keresztseg14.jpg', ' ', '2011-11-27 09:44:20', NULL),
(57, 1, 6, 1, 'salonta_e0.jpg', ' ', '2011-11-27 09:44:20', NULL),
(58, 1, 6, 1, 'salonta_e1.jpg', ' ', '2011-11-27 09:44:20', NULL),
(59, 1, 6, 1, 'salonta_e2.jpg', ' ', '2011-11-27 09:44:20', NULL),
(60, 1, 6, 1, 'salonta_e3.jpg', ' ', '2011-11-27 09:44:20', NULL),
(61, 1, 6, 1, 'salonta_e4.jpg', ' ', '2011-11-27 09:44:20', NULL),
(62, 1, 6, 1, 'salonta_e5.jpg', ' ', '2011-11-27 09:44:20', NULL),
(63, 1, 6, 1, 'salonta_e6.jpg', ' ', '2011-11-27 09:44:20', NULL),
(64, 1, 6, 1, 'salonta_e7.jpg', ' ', '2011-11-27 09:44:20', NULL),
(65, 1, 6, 1, 'salonta_e8.jpg', ' ', '2011-11-27 09:44:20', NULL),
(66, 1, 6, 1, 'salonta_e9.jpg', ' ', '2011-11-27 09:44:20', NULL),
(67, 1, 7, 1, 'usa1.jpg', 'Amerikában', '2011-11-27 09:44:20', NULL),
(68, 1, 7, 1, 'usa0.jpg', ' ', '2011-11-27 09:44:20', NULL),
(69, 1, 7, 1, 'sofar.jpg', 'Sofár', '2011-11-27 09:44:20', NULL),
(70, 1, 7, 1, 'kolozsvar.jpg', 'A kolozsvári Petrában', '2011-11-27 09:44:20', NULL),
(71, 1, 3, 1, '4_47.jpg', 'Mikes Attila', '2011-11-28 19:20:40', NULL),
(72, 1, 3, 1, '4_48.jpg', 'Popovics Krisztián', '2011-11-28 19:21:51', NULL),
(73, 1, 3, 1, '4_49.jpg', 'Szilágyi Zsolt', '2011-11-28 19:22:44', NULL),
(74, 1, 1, 1, '2_4a.jpg', 'Dics&#337;ités', '2011-11-28 19:23:51', NULL),
(81, 1, 3, 1, '4_4b.jpg', 'Új kép leírás', '2012-05-30 16:25:33', NULL),
(82, 1, 3, 1, '4_52.jpg', 'Új kép leírás', '2012-05-30 16:25:45', NULL),
(83, 1, 3, 1, '4_53.jpg', 'Új kép leírás', '2012-05-30 16:25:54', NULL),
(84, 1, 3, 1, '4_54.jpg', 'Új kép leírás', '2012-05-30 16:26:03', NULL),
(85, 1, 8, 1, '6_55.jpg', '', '2012-07-22 14:04:25', NULL),
(86, 1, 8, 1, '6_56.jpg', '', '2012-07-22 14:05:43', NULL),
(87, 1, 8, 1, '6_57.jpg', '', '2012-07-22 14:06:01', NULL),
(88, 1, 8, 1, '6_58.jpg', '', '2012-07-22 14:06:19', NULL),
(89, 1, 8, 1, '6_59.jpg', '', '2012-07-22 14:06:38', NULL),
(90, 1, 8, 1, '6_5a.jpg', '', '2012-07-22 14:06:55', NULL),
(91, 1, 8, 1, '6_5b.jpg', '', '2012-07-22 14:07:49', NULL),
(92, 1, 8, 1, '6_5c.jpg', '', '2012-07-22 14:08:05', NULL),
(93, 1, 8, 1, '6_5d.jpg', '', '2012-07-22 14:08:17', NULL),
(94, 1, 8, 1, '6_5e.jpg', '', '2012-07-22 14:08:32', NULL),
(95, 1, 8, 1, '6_5f.jpg', '', '2012-07-22 14:08:46', NULL),
(97, 1, 8, 1, '6_60.jpg', '', '2012-07-22 14:09:31', NULL),
(98, 1, 8, 1, '6_62.jpg', '', '2012-07-22 14:09:48', NULL),
(99, 1, 8, 1, '6_63.jpg', '', '2012-07-22 14:10:33', NULL),
(100, 1, 1, 1, '2_64.jpg', '', '2012-07-22 14:10:53', NULL),
(101, 1, 8, 1, '6_65.jpg', '', '2012-07-22 14:12:15', NULL),
(102, 1, 8, 1, '6_66.jpg', '', '2012-07-22 14:12:35', NULL),
(103, 1, 8, 1, '6_67.jpg', '', '2012-07-22 14:12:48', NULL),
(106, 1, 8, 1, '8_6a.jpg', '', '2012-07-22 16:08:12', NULL),
(107, 1, 9, 1, '9_6b.jpg', 'Tánc', '2013-01-02 18:21:46', NULL),
(108, 1, 9, 1, 'a_6c.jpg', '', '2013-01-02 18:22:02', NULL),
(109, 1, 9, 1, 'a_6d.jpg', '', '2013-01-02 18:22:13', NULL),
(110, 1, 9, 1, 'a_6e.jpg', '', '2013-01-02 18:22:24', NULL),
(111, 1, 9, 1, 'a_6f.jpg', '', '2013-01-02 18:22:36', NULL),
(112, 1, 9, 1, 'a_70.jpg', '', '2013-01-02 18:22:47', NULL),
(113, 1, 9, 1, 'a_71.jpg', '', '2013-01-02 18:22:59', NULL),
(114, 1, 9, 1, 'a_72.jpg', '', '2013-01-02 18:23:12', NULL),
(115, 1, 9, 1, 'a_73.jpg', '', '2013-01-02 18:23:23', NULL),
(117, 1, 9, 1, 'a_74.jpg', '', '2013-01-02 18:24:01', NULL),
(118, 1, 9, 1, 'a_76.jpg', '', '2013-01-02 18:24:12', NULL),
(119, 1, 9, 1, 'a_77.jpg', '', '2013-01-02 18:24:23', NULL),
(120, 1, 9, 1, 'a_78.jpg', '', '2013-01-02 18:24:45', NULL),
(121, 1, 9, 1, 'a_79.jpg', '', '2013-01-02 18:24:57', NULL),
(122, 1, 9, 1, 'a_7a.jpg', '', '2013-01-02 18:25:08', NULL),
(123, 1, 9, 1, 'a_7b.jpg', '', '2013-01-02 18:25:18', NULL),
(124, 1, 9, 1, '2_7c.jpg', '', '2013-01-02 18:25:27', NULL),
(125, 1, 9, 1, 'a_7d.jpg', '', '2013-01-02 18:25:37', NULL),
(126, 1, 9, 1, 'a_7e.jpg', '', '2013-01-02 18:26:00', NULL),
(127, 1, 9, 1, '2_7f.jpg', '', '2013-01-02 18:26:07', NULL),
(128, 1, 9, 1, '2_80.jpg', '', '2013-01-02 18:26:15', NULL),
(129, 1, 9, 1, '2_81.jpg', '', '2013-01-02 18:26:24', NULL),
(130, 1, 9, 1, 'a_82.jpg', '', '2013-01-02 18:26:35', NULL),
(131, 1, 9, 1, '2_83.jpg', '', '2013-01-02 18:26:44', NULL),
(132, 1, 9, 1, 'a_84.jpg', '', '2013-01-02 18:27:31', NULL),
(133, 1, 9, 1, '2_85.jpg', '', '2013-01-02 18:27:39', NULL),
(134, 1, 9, 1, '2_86.jpg', '', '2013-01-02 18:27:47', NULL),
(135, 1, 9, 1, '2_87.jpg', '', '2013-01-02 18:27:58', NULL),
(136, 1, 9, 1, '2_88.jpg', '', '2013-01-02 18:28:06', NULL),
(137, 1, 9, 1, '2_89.jpg', '', '2013-01-02 18:28:15', NULL),
(138, 1, 9, 1, '2_8a.jpg', '', '2013-01-02 18:28:25', NULL),
(139, 1, 9, 1, '2_8b.jpg', '', '2013-01-02 18:28:35', NULL),
(140, 1, 9, 1, '2_8c.jpg', '', '2013-01-02 18:28:44', NULL),
(141, 1, 10, 1, 'a_8d.jpg', '', '2013-05-06 05:13:04', NULL),
(142, 1, 10, 1, 'b_8e.jpg', '', '2013-05-06 05:13:25', NULL),
(143, 1, 10, 1, 'b_8f.jpg', '', '2013-05-06 05:13:40', NULL),
(144, 1, 10, 1, 'b_90.jpg', '', '2013-05-06 05:13:54', NULL),
(145, 1, 10, 1, 'b_91.jpg', '', '2013-05-06 05:14:08', NULL),
(146, 1, 10, 1, 'b_92.jpg', '', '2013-05-06 05:14:23', NULL),
(147, 1, 10, 1, 'b_93.jpg', '', '2013-05-06 05:14:36', NULL),
(150, 1, 10, 1, 'b_96.jpg', '', '2013-05-06 05:15:58', NULL),
(149, 1, 10, 1, 'b_95.jpg', '', '2013-05-06 05:15:01', NULL),
(151, 1, 10, 1, 'b_97.jpg', '', '2013-05-06 05:16:09', NULL),
(152, 1, 10, 1, 'b_98.jpg', '', '2013-05-06 05:16:28', NULL),
(153, 1, 10, 1, 'b_99.jpg', '', '2013-05-06 05:17:03', NULL),
(154, 1, 10, 1, 'b_9a.jpg', '', '2013-05-06 05:17:13', NULL),
(155, 1, 10, 1, 'b_9b.jpg', '', '2013-05-06 05:17:27', NULL),
(156, 1, 10, 1, 'b_9c.jpg', '', '2013-05-06 05:17:41', NULL),
(157, 1, 10, 1, 'b_9d.jpg', '', '2013-05-06 05:17:56', NULL),
(158, 1, 10, 1, 'b_9e.jpg', '', '2013-05-06 05:18:15', NULL),
(159, 1, 10, 1, 'b_9f.jpg', '', '2013-05-06 05:18:30', NULL),
(160, 1, 10, 1, 'b_a0.jpg', '', '2013-05-06 05:18:46', NULL),
(161, 1, 10, 1, 'b_a1.jpg', '', '2013-05-06 05:18:58', NULL),
(162, 1, 10, 1, 'b_a2.jpg', '', '2013-05-06 05:19:11', NULL),
(167, 1, 10, 1, 'b_a7.jpg', '', '2013-05-06 05:22:24', NULL),
(164, 1, 10, 1, 'b_a4.jpg', '', '2013-05-06 05:19:42', NULL),
(165, 1, 10, 1, 'b_a5.jpg', '', '2013-05-06 05:19:52', NULL),
(166, 1, 10, 1, 'b_a6.jpg', '', '2013-05-06 05:20:03', NULL),
(168, 1, 10, 1, 'b_a8.jpg', '', '2013-05-06 05:22:36', NULL),
(169, 1, 11, 1, 'b_a9.jpg', '', '2013-05-16 18:42:51', NULL),
(170, 1, 11, 1, 'c_aa.jpg', '', '2013-05-16 18:45:20', NULL),
(171, 1, 11, 1, 'c_ab.jpg', '', '2013-05-16 18:46:03', NULL),
(172, 1, 11, 1, 'c_ac.jpg', '', '2013-05-16 18:46:57', NULL),
(173, 1, 11, 1, 'c_ad.jpg', '', '2013-05-16 18:50:49', NULL),
(174, 1, 11, 1, 'c_ae.jpg', '', '2013-05-16 18:51:28', NULL),
(175, 1, 11, 1, 'c_af.jpg', '', '2013-05-16 18:51:49', NULL),
(176, 1, 12, 1, 'c_b0.jpg', '', '2013-06-04 19:08:12', NULL),
(181, 1, 12, 1, 'd_b5.jpg', '', '2013-06-04 19:11:08', NULL),
(178, 1, 12, 1, 'd_b2.jpg', 'Spanyolhonból Arnaldo Fernandez', '2013-06-04 19:09:09', NULL),
(179, 1, 12, 1, 'd_b3.jpg', '', '2013-06-04 19:09:25', NULL),
(180, 1, 12, 1, 'd_b4.jpg', '', '2013-06-04 19:09:41', NULL),
(182, 1, 12, 1, 'd_b6.jpg', '', '2013-06-04 19:11:29', NULL),
(183, 1, 12, 1, 'd_b7.jpg', '', '2013-06-04 19:11:42', NULL),
(184, 1, 12, 1, 'd_b8.jpg', '', '2013-06-04 19:11:54', NULL),
(185, 1, 3, 1, '4_b9.jpg', 'Boros Gyula ', '2014-10-07 19:30:04', NULL),
(186, 1, 3, 1, '4_ba.jpg', 'Boros Gyula', '2014-10-07 19:31:05', NULL),
(187, 1, 3, 1, '4_bb.jpg', 'Bárka gyülekezet', '2014-10-07 19:32:43', NULL),
(188, 1, 13, 1, 'd_bc.jpg', '', '2014-12-25 18:30:24', NULL),
(189, 1, 13, 1, 'e_bd.jpg', '', '2014-12-25 18:34:46', NULL),
(190, 1, 13, 1, 'e_be.jpg', '', '2014-12-25 18:35:19', NULL),
(191, 1, 14, 1, 'e_bf.jpg', 'Aki nem tudja kiolvasni, klikkeljen a teljes képernyôre, jobb alsó sarokban az elsô ikon', '2015-01-18 11:52:00', NULL),
(192, 1, 6, 1, '7_c0.jpg', '2015-os kép', '2015-03-22 19:52:10', NULL),
(193, 1, 6, 1, '7_c1.jpg', '2015-os kép', '2015-03-22 19:52:29', NULL),
(194, 1, 6, 1, '7_c2.jpg', '2015-os kép', '2015-03-22 19:52:37', NULL),
(195, 1, 6, 1, '7_c3.jpg', '2015-os kép', '2015-03-22 19:52:46', NULL),
(196, 1, 6, 1, '7_c4.jpg', '2015-os kép', '2015-03-22 19:52:55', NULL),
(197, 1, 3, 1, '4_c5.jpg', '', '2015-03-22 20:06:40', NULL),
(198, 1, 3, 1, '4_c6.jpg', '', '2015-03-22 20:07:04', NULL),
(199, 1, 3, 1, '4_c7.jpg', '', '2015-03-22 20:07:33', NULL),
(200, 1, 3, 1, '4_c8.jpg', '', '2015-03-22 20:07:56', NULL),
(202, 1, 16, 1, '11_c9.jpg', 'Új kép leírás', '2015-05-01 18:41:46', NULL),
(203, 1, 16, 1, '11_cb.jpg', 'Új kép leírás', '2015-05-01 18:41:58', NULL),
(204, 1, 16, 1, '11_cc.jpg', 'Új kép leírás', '2015-05-01 18:42:11', NULL),
(205, 1, 16, 1, '11_cd.jpg', 'Új kép leírás', '2015-05-01 18:43:38', NULL),
(206, 1, 16, 1, '11_ce.jpg', 'Új kép leírás', '2015-05-01 18:43:48', NULL),
(207, 1, 16, 1, '11_cf.jpg', 'Új kép leírás', '2015-05-01 18:46:25', NULL),
(208, 1, 16, 1, '11_d0.jpg', 'Új kép leírás', '2015-05-01 18:46:33', NULL),
(209, 1, 16, 1, '11_d1.jpg', 'Új kép leírás', '2015-05-01 18:46:42', NULL),
(210, 1, 16, 1, '11_d2.jpg', 'Új kép leírás', '2015-05-01 18:46:50', NULL),
(211, 1, 16, 1, '11_d3.jpg', 'Új kép leírás', '2015-05-01 18:46:59', NULL),
(212, 1, 16, 1, '11_d4.jpg', 'Új kép leírás', '2015-05-01 18:50:33', NULL),
(213, 1, 16, 1, '11_d5.jpg', 'Új kép leírás', '2015-05-01 18:50:45', NULL),
(214, 1, 16, 1, '11_d6.jpg', 'Új kép leírás', '2015-05-01 18:55:44', NULL),
(215, 1, 16, 1, '11_d7.jpg', 'Új kép leírás', '2015-05-01 18:56:01', NULL),
(216, 1, 16, 1, '11_d8.jpg', 'Új kép leírás', '2015-05-01 18:56:14', NULL),
(217, 1, 16, 1, '11_d9.jpg', 'Új kép leírás', '2015-05-01 18:56:22', NULL),
(218, 1, 16, 1, '11_da.jpg', 'Új kép leírás', '2015-05-01 18:56:30', NULL),
(219, 1, 16, 1, '11_db.jpg', 'Új kép leírás', '2015-05-01 18:56:41', NULL),
(220, 1, 16, 1, '11_dc.jpg', 'Új kép leírás', '2015-05-01 18:56:50', NULL),
(221, 1, 16, 1, '11_dd.jpg', 'Új kép leírás', '2015-05-01 18:56:59', NULL),
(222, 1, 16, 1, '11_de.jpg', 'Új kép leírás', '2015-05-01 18:57:09', NULL),
(223, 1, 16, 1, '11_df.jpg', 'Új kép leírás', '2015-05-01 18:57:18', NULL),
(224, 1, 16, 1, '11_e0.jpg', 'Új kép leírás', '2015-05-01 18:57:31', NULL),
(225, 1, 16, 1, '11_e1.jpg', 'Új kép leírás', '2015-05-01 18:57:48', NULL),
(226, 1, 16, 1, '11_e2.jpg', 'Új kép leírás', '2015-05-01 18:58:01', NULL),
(227, 1, 16, 1, '11_e3.jpg', 'Új kép leírás', '2015-05-01 18:58:15', NULL),
(228, 1, 16, 1, '11_e4.jpg', 'Új kép leírás', '2015-05-01 18:58:27', NULL),
(229, 1, 16, 1, '11_e5.jpg', 'Új kép leírás', '2015-05-01 18:58:37', NULL),
(230, 1, 3, 1, '4_e6.jpg', 'Gégény Csaba', '2015-07-06 17:09:30', NULL),
(231, 1, 3, 1, '4_e7.jpg', 'Gégény Éva', '2015-07-06 17:10:01', NULL),
(232, 1, 1, 1, '2_e8.jpg', 'A gyülekezet egy része 2015 - május elsején', '2015-07-06 17:11:14', NULL),
(233, 1, 17, 1, '12_e9.jpg', 'Gyerekszoba és a gyerekek', '2016-01-04 17:36:28', NULL),
(234, 1, 17, 1, '12_ea.jpg', 'A gyerekek énekeltek', '2016-01-04 17:37:27', NULL),
(235, 1, 17, 1, '12_eb.jpg', '', '2016-01-04 17:38:09', NULL),
(236, 1, 17, 1, '12_ec.jpg', 'Díszítés', '2016-01-04 17:38:30', NULL),
(237, 1, 17, 1, '12_ed.jpg', 'Fiatalok egyrésze', '2016-01-04 17:39:07', NULL),
(238, 1, 17, 1, '12_ee.jpg', 'Eliza', '2016-01-04 17:39:41', NULL),
(239, 1, 17, 1, '12_ef.jpg', '', '2016-01-04 17:40:21', NULL),
(240, 1, 17, 1, '12_f0.jpg', '', '2016-01-04 17:40:35', NULL),
(241, 1, 17, 1, '12_f1.jpg', '', '2016-01-04 17:40:58', NULL),
(242, 1, 17, 1, '12_f2.jpg', 'Jamie megáldása', '2016-01-04 17:41:20', NULL),
(243, 1, 17, 1, '12_f3.jpg', 'Petra megáldása', '2016-01-04 17:41:46', NULL),
(244, 1, 17, 1, '12_f4.jpg', 'Gyerek megáldások', '2016-01-04 17:42:19', NULL),
(245, 1, 17, 1, '12_f5.jpg', 'Edit és Ricsi', '2016-01-04 17:42:58', NULL),
(246, 1, 17, 1, '12_f6.jpg', '', '2016-01-04 17:43:18', NULL),
(247, 1, 17, 1, '12_f7.jpg', '', '2016-01-04 17:43:32', NULL),
(248, 1, 17, 1, '12_f8.jpg', 'Díszítés 2', '2016-01-04 17:43:53', NULL),
(249, 1, 17, 1, '12_f9.jpg', '', '2016-01-04 17:44:17', NULL),
(250, 1, 17, 1, '12_fa.jpg', 'A gyerekek', '2016-01-04 17:44:43', NULL),
(251, 1, 17, 1, '12_fb.jpg', '', '2016-01-04 17:45:00', NULL),
(252, 1, 17, 1, '12_fc.jpg', '', '2016-01-04 17:45:31', NULL),
(253, 1, 17, 1, '12_fd.jpg', '', '2016-01-04 17:46:05', NULL),
(254, 1, 17, 1, '12_fe.jpg', '', '2016-01-04 17:46:58', NULL),
(260, 1, 18, 1, '13_104.jpg', 'Új kép leírás', '2016-01-05 16:15:41', NULL),
(257, 1, 18, 1, '13_101.jpg', 'Új kép leírás', '2016-01-05 16:14:37', NULL),
(258, 1, 18, 1, '13_102.jpg', 'Új kép leírás', '2016-01-05 16:14:54', NULL),
(259, 1, 18, 1, '13_103.jpg', 'Új kép leírás', '2016-01-05 16:15:17', NULL),
(261, 1, 18, 1, '13_105.jpg', 'Új kép leírás', '2016-01-05 16:15:53', NULL),
(262, 1, 18, 1, '13_106.jpg', 'Új kép leírás', '2016-01-05 16:16:05', NULL),
(263, 1, 18, 1, '13_107.jpg', '', '2016-01-05 16:16:33', NULL),
(264, 1, 18, 1, '13_108.jpg', '', '2016-01-05 16:16:48', NULL),
(265, 1, 18, 1, '13_109.jpg', '', '2016-01-05 16:17:01', NULL),
(266, 1, 18, 1, '13_10a.jpg', '', '2016-01-05 16:17:16', NULL),
(267, 1, 18, 1, '13_10b.jpg', '', '2016-01-05 16:17:29', NULL),
(268, 1, 18, 1, '13_10c.jpg', '', '2016-01-05 16:17:45', NULL),
(269, 1, 18, 1, '13_10d.jpg', 'Új kép leírás', '2016-01-05 16:17:59', NULL),
(279, 1, 18, 1, '13_117.jpg', '', '2016-01-05 16:22:26', NULL),
(271, 1, 18, 1, '13_10f.jpg', 'Új kép leírás', '2016-01-05 16:18:35', NULL),
(272, 1, 18, 1, '13_110.jpg', 'Új kép leírás', '2016-01-05 16:18:47', NULL),
(273, 1, 18, 1, '13_111.jpg', 'Új kép leírás', '2016-01-05 16:19:01', NULL),
(278, 1, 18, 1, '13_116.jpg', '', '2016-01-05 16:21:06', NULL),
(277, 1, 18, 1, '13_115.jpg', '', '2016-01-05 16:20:52', NULL),
(276, 1, 18, 1, '13_114.jpg', '', '2016-01-05 16:19:47', NULL),
(281, 1, 19, 1, '14_118.jpg', 'Ajánlott letölteni vagy teljes képernyőben nézni', '2016-01-08 17:53:57', NULL),
(282, 1, 19, 1, '14_11a.jpg', '', '2016-01-08 17:54:28', NULL),
(283, 1, 19, 1, '14_11b.jpg', 'Ajánlott letölteni vagy teljes képernyőben nézni', '2016-01-08 17:58:20', NULL),
(284, 1, 19, 1, '14_11c.jpg', '', '2016-01-08 17:58:31', NULL),
(285, 1, 19, 1, '14_11d.jpg', 'Ajánlott letölteni vagy teljes képernyőben nézni', '2016-01-10 10:34:40', NULL),
(286, 1, 19, 1, '14_11e.jpg', 'Ajánlott letölteni vagy teljes képernyőben nézni', '2016-01-10 10:39:52', NULL),
(287, 1, 19, 1, '14_11f.jpg', 'Ajánlott letölteni vagy teljes képernyőben nézni', '2016-01-10 10:49:21', NULL),
(288, 1, 19, 1, '14_120.jpg', 'Ajánlott letölteni vagy teljes képernyőben nézni', '2016-01-10 10:50:12', NULL),
(289, 1, 19, 1, '14_121.jpg', 'Ajánlott letölteni vagy teljes képernyőben nézni', '2016-01-10 10:51:00', NULL),
(290, 1, 19, 1, '14_122.jpg', 'Ajánlott letölteni vagy teljes képernyőben nézni', '2016-01-10 10:52:45', NULL),
(291, 1, 20, 1, '15_123.jpg', '', '2016-06-02 14:35:30', NULL),
(292, 1, 20, 1, '15_124.jpg', '', '2016-06-02 14:35:41', NULL),
(293, 1, 20, 1, '15_125.jpg', '', '2016-06-02 14:35:51', NULL),
(294, 1, 20, 1, '15_126.jpg', '', '2016-06-02 14:35:58', NULL),
(295, 1, 20, 1, '15_127.jpg', '', '2016-06-02 14:36:08', NULL),
(296, 1, 20, 1, '15_128.jpg', '', '2016-06-02 14:36:23', NULL),
(297, 1, 20, 1, '15_129.jpg', '', '2016-06-02 14:36:31', NULL),
(298, 1, 3, 1, '4_12a.jpg', 'Új kép leírás', '2016-06-02 14:41:33', NULL),
(299, 1, 3, 1, '4_12b.jpg', 'Új kép leírás', '2016-06-02 14:41:42', NULL),
(300, 1, 1, 1, '2_12c.jpg', '2016 május 15', '2016-06-02 14:42:26', NULL),
(301, 1, 21, 1, '16_12d.jpg', 'Fiatalok sátorral', '2016-08-14 13:22:32', NULL),
(302, 1, 21, 1, '16_12e.jpg', 'A hegy :)', '2016-08-14 13:23:11', NULL),
(303, 1, 21, 1, '16_12f.jpg', 'Jó kedvű dicsőítés', '2016-08-14 13:24:57', NULL),
(304, 1, 21, 1, '16_130.jpg', 'A hinta és a lányok', '2016-08-14 13:25:32', NULL),
(305, 1, 21, 1, '16_131.jpg', 'Készülödés', '2016-08-14 13:25:57', NULL),
(306, 1, 21, 1, '16_132.jpg', 'Fiatalok a panzió elött', '2016-08-14 13:26:23', NULL),
(307, 1, 21, 1, '16_133.jpg', 'Pihenés a folyó mellett', '2016-08-14 13:26:44', NULL),
(308, 1, 21, 1, '16_134.jpg', 'Itt voltunk', '2016-08-14 13:26:59', NULL),
(309, 1, 21, 1, '16_135.jpg', 'Szép hely s messze a várostól', '2016-08-14 13:27:32', NULL),
(310, 1, 21, 1, '16_136.jpg', 'Közös kép', '2016-08-14 13:27:46', NULL),
(311, 1, 21, 1, '16_137.jpg', 'Csoportkép mindenkivel', '2016-08-14 13:28:02', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `news`
--

CREATE TABLE `news` (
  `id` int(11) NOT NULL,
  `writer` int(11) NOT NULL,
  `wdate` varchar(20) COLLATE utf8_hungarian_ci NOT NULL,
  `title` varchar(100) COLLATE utf8_hungarian_ci NOT NULL,
  `txt` varchar(512) COLLATE utf8_hungarian_ci NOT NULL,
  `showcat` tinyint(4) NOT NULL DEFAULT '1'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- Dumping data for table `news`
--

INSERT INTO `news` (`id`, `writer`, `wdate`, `title`, `txt`, `showcat`) VALUES
(1, 1, '2011.11.27 10:13:06', 'Vendégek', 'November 27 - Vasárnap vendégeink lesznek.\r\nRészletek a Vendégek menüpont alatt.', 1),
(2, 1, '2011.11.28 15:40:48', 'Regisztráció', 'kicsit átfutottam a regisztrációt az oldalra, volt egy kis bibi tegnap, ma már megy jól.', 1),
(4, 1, '2011.12.09 15:37:32', 'Most vasárnap', 'Nagy Péter jön most vasárnap reggel 10:00 és délután 15:00.', 1),
(5, 8, '2011.12.21 19:51:30', 'Karácsony', 'Áldott,békés,boldog Karácsonyt kívánunk mindenkinek!', 1),
(6, 1, '2012.01.01 09:03:49', '2012', 'Legyen egy áldott, boldog új éve mindenkinek!', 1),
(7, 8, '2012.01.01 20:03:38', 'Vendég', 'Vasárnap(jan. 8) 16 órától vendégünk lesz Bálint Gyula Várpalotáról,mindenkit várunk szeretettel!', 1),
(8, 1, '2012.01.20 16:47:45', 'Nagy Péter', 'Nehány tanítás Nagy Pétertõl, feltöltve a Felvételek/Hangfelvételeknél', 1),
(9, 1, '2012.04.11 18:29:48', '2012. 04. 22', '22. -én 10 órától kezdôdik az alkalom', 1),
(10, 1, '2012.04.22 11:28:26', 'Május 5.', 'Berkes Sándor itt lesz május 5-6 -án, özönvíz a téma', 1),
(11, 8, '2012.05.30 16:03:41', '', 'Üdvözlünk honlapunkon!', 1),
(12, 1, '2012.06.21 17:01:13', 'Vendég', 'Lesz vendég vasárnap, részletek a <b>Vendégek és Programok</b>', 1),
(13, 1, '2012.07.02 17:15:53', 'Július 7.', 'Lesz egy meglepetés vendég család vasárnap.', 1),
(14, 1, '2012.07.08 20:44:16', 'Július 15 és 22', 'Július 15 és 22-én délelôtt 10 óratól kezdôdik az alkalom', 1),
(15, 1, '2012.07.22 14:03:42', 'Július 29.', 'Július 29-én szintén 10 órától kezdôdik az istentisztelet.', 1),
(16, 1, '2012.08.04 20:10:55', 'Videók', 'picit rendezve a youtubeos dícséretek <a href=http://gyozelem.ro/index.php?page=5 target=_blank> Felvételek kategóriában</a>', 1),
(18, 1, '2012.09.10 15:04:52', 'Bizonyságok', 'Két átélés került a Bizonyságok szekcióba. <a href=\'http://gyozelem.ro/index.php?page=14\' target=\'_blank\'> Klikk ide a megtekintéshez</a>', 1),
(19, 1, '2012.11.16 13:19:21', 'Szombat', 'November 17.-én Bálint Gyula lesz vendégünk, 18:00 órától', 1),
(20, 1, '2012.12.02 19:34:01', 'December 15-17.', 'Gyülekezetben lesz gyerekfoglalkozás, lesz kézimunka, zene, tánc, bábszínház és még sok más 3 év feletti gyerekeknek(ingyenes természetesen). December 15, 16. 15:00 órakor és 17.-én 16:00 órakor.', 1),
(21, 1, '2012.12.24 12:19:57', 'Dec. 25.', 'December 25.-én kedden is lesz alkalom, dél után 4 órától.\r\nBékés, áldott és boldog karácsonyt mindenkinek!', 1),
(22, 1, '2012.12.30 12:43:01', 'Dec. 31 - Szilveszter', 'Szilveszter 20:00 órától lesz az alkalom, lesznek programok és aki tudd az hozhat ételt (üdítõ és kenyér bizyosítva). \r\nMindenkit szertettel várunk! :)', 1),
(23, 1, '2013.01.02 18:42:27', 'Szilveszter', 'A szilveszteri alkalomról készült képeket <a href=http://gyozelem.ro/index.php?page=1&id=9><b>itt</b></a> lehet megnézni. Boldog, áldott új évet mindenkinek!', 1),
(24, 1, '2013.01.13 17:55:20', 'Ima és böjt', 'Agapé, Filadelfia, Bárka és a mi gyülink böjt és ima januárt hírdet, csütörtönként 19:00 órától.\r\n<br>\r\nMúlt csütörtök felvételek (.mp3):\r\nBudai Béla és Pokorny Istvánnal - útmutató (.MP3) <a href="https://docs.google.com/uc?id=0B2Xnb7P1IwsFUjR0WEp4VEdSejQ&export=download" target="_blank"> <b>Letöltés ITT</b> </a>\r\n<br>Kiss Zsolt - a böjt <a href="https://docs.google.com/file/d/0B2Xnb7P1IwsFU3hqeXFrWnk5Rnc/edit?pli=1" target="_blank"> <b>Letöltés ITT </b></a>', 1),
(25, 1, '2013.01.28 16:10:21', 'Ne felejtsétek el...', 'Most csütörtökön 19:00-kor lesz az utolsó közöz alkalom (reméljük lesz folytatása persze, csak még nem tudjuk mikor). (Dunarea utca 13-as szám)\r\n\r\nMindenkinek nagyon ajánlom, hogy jöjjön el mert nagyon jó alkalmak voltak eddig is!!!', 1),
(26, 1, '2013.03.24 19:19:04', 'Következô heti program', 'Március 28, 29, 30, 31.<br>\r\nCsütörtökön 19:00 - Imaóra<br> Pénteken 15:00 - Gyerek programok (sok szerettet várunk minden gyereket)<br> Szombaton 20:00 - Imaéjszaka<br> Vasárnap 16:00 - Alkalom', 1),
(27, 1, '2013.04.10 15:51:30', 'Most vasárnap', 'Most vasárnap Cselovszki Attila - evangélista lesz a vendégünk, mindenkit szeretettel várunk!', 1),
(29, 1, '2013.05.02 17:25:25', 'Május 5.', 'Keresztség lesz, mindenkit szeretettel várunk :)\r\n\r\nVendégünk lesz Boros Gyula, a Bárka gyülekezetbôl.', 1),
(30, 1, '2013.05.06 12:02:38', 'Kép feltöltés', 'A keresztségrôl készült képek fel vannak töltve. <a href=\'http://gyozelem.ro/index.php?page=1&id=10\'> ITT </a>', 1),
(31, 1, '2013.05.16 18:54:52', 'Képek (Yun)', 'Nehány kép felkerült a Yun (Jün) testvér látogatásáról a nagyváradi sportcsarnokban. <a href=\'http://gyozelem.ro/index.php?page=1&id=11\'> Album itt </a>, jó nézzelôdést! :)', 1),
(32, 1, '2013.05.28 15:50:40', 'Igeversek', 'Napi igeversek a facebookon <a href=\'https://www.facebook.com/Igeversek\'> https://www.facebook.com/Igeversek </a>', 1),
(33, 1, '2013.05.30 15:54:00', 'Június 4.', 'Június 4. - Kedden 18:00 órától Arnaldo Fernandez tart elôadást fiatal vagy leendô házasoknak nálunk (Dunarii 13.), mindenkit szerettel várunk!', 1),
(34, 1, '2013.06.04 19:15:53', 'Szeretet nyelve', 'Feltöltve a Szeretet nyelve alaklom házastársaknak -ról néhánykép <a href =\'http://gyozelem.ro/index.php?page=1&id=12\' target=\'_blank\'><b><font color=\'#dd0000\'> Arnaldo Fernandez album</font></b></a>', 1),
(35, 1, '2013.08.21 17:31:40', 'Szept. 1', '<b>Perjesi István</b> lesz a vendégünk szeptember elsején.<br>Mindenkit szeretettel várunk!', 1),
(36, 1, '2013.09.22 19:53:21', 'Változás', 'Ezentúl reggel 8-tól van az imádkozás, a szombati imaéjszaka pedig a következô szombatra esik majd szóval október elsô szombatja.', 1),
(37, 1, '2013.11.10 09:15:23', 'Vendég', 'Kiss József (Jocó) a debreceni Élet gyülekezet pásztora lesz vendégünk ma, 16:00 órái alkalmunkon.', 1),
(39, 1, '2013.11.18 16:12:39', 'Konferencia', '<b>N&#337;i konferencia:</b><br> November 23.-án  10:00 óratól (Szombat) szeretttel várunk minden kedves feleséget az egész napos n&#337;i konferenciára  (felekezettöl függetlenül). Dunarii 13 szám, ', 1),
(40, 1, '2013.12.21 17:48:51', 'Karácsony', 'Mindenkinek legyen békés, áldott karácsonya és ne feledkezzünk meg, hogy mit is ünneplünk!', 1),
(41, 1, '2013.12.28 14:04:41', 'Szilveszter', 'Mindenkit szerettel várunk a <b>szilveszteri</b> alkalmunkra, hogy közösen, az Urat dícsérve lépjünk az új évbe! Kedden este 9 órától a gyüliben, mindenki hozzon egy kis ételt vagy sütit.', 1),
(42, 1, '2014.01.01 16:33:38', 'Az új év itt van!', 'Szeretnénk kíváni áldott boldog új évet mindenkinek!', 1),
(43, 1, '2014.02.17 14:22:58', 'Kiss Jocó', 'Vasárnap (Feb. 23)Kiss József lesz vendégünk 16:00 órai kezdettel.', 1),
(44, 1, '2014.02.24 17:19:02', 'Felvétel', 'Egy újabb felvétel Kis József tanításaval az albumba (<a href=\'http://www.youtube.com/watch?v=DTAFM7_X5eI\'>video link</a>).', 1),
(45, 1, '2014.04.06 10:44:54', 'Most vasárnap', 'Ma 16:00 órától Kiss József pásztor lesz nálunk, mindenkit szeretettel várunk!', 1),
(46, 1, '2014.04.20 16:55:37', 'Vendég', 'Berkes Sándor tart elôadást április 27-én, 10:00 órától a gyülekezetben. <br>Téma: Teremtés, b&#369;neset, helyreállítás.<br>Mindenki szerettel várunk!', 1),
(47, 1, '2014.05.25 10:43:03', 'Május 25', 'Május 25-ikén, 16:00 órától Kiss József lesz vendégünk! Mindenkit szerettel várunk!', 1),
(48, 1, '2014.06.08 17:02:59', 'Változás!!', 'Ezentúl a vasárnapi alkalom 18:00 órától kezdôdik!', 1),
(49, 1, '2014.08.21 17:37:07', '24.-e', 'Kiss József jön augusztus 24.-én 18:00 órától, mindenkit szeretettel várunk! ', 1),
(51, 1, '2014.08.24 19:19:46', 'Visszaállás', 'Ezentúl újból vasárnap 16:00 órától van az alkalom. Keresztség lesz 31-én és 30-án imaéjszaka 9tôl.', 1),
(52, 1, '2014.09.27 06:27:34', 'Bárka gyülekezet', 'Október 5. -én, 16:00 órától együtt a Bárka gyülekezettel lesz együtt áldott alkalmunk.', 1),
(53, 1, '2014.10.19 17:12:47', 'Vasánap', 'Október 26. -án (vasárnap) Berkes Sándor lesz vendégünk, 10:00 órától. Mindenkit szeretettel várunk!', 1),
(54, 1, '2014.12.25 18:37:21', 'Karácsony', 'Boldog, békés Karácsonyt mindenkinek!\r\n\r\n(nehány kép felkerült a 2014-es albumba)', 1),
(55, 1, '2015.01.10 05:42:33', 'Vendég', 'Január 18. - Perjesi István lesz vendégünk, mindenkit szeretettel várunk!', 1),
(56, 1, '2015.01.18 11:59:03', 'Harmadik böjt hét', 'Böjti hét harmadik hete következik akinek esetleg nincs meg a témáink itt megnézzheti <a href=\'http://gyozelem.ro/index.php?page=1&id=14&picid=191\'>Klikk ide</a>', 1),
(57, 1, '2015.02.08 08:39:40', 'feb 8. vendégek', '<b>Ambrus Tibor, Kiss József</b> lesz a vendégeink, ma 16:00 órai kezdettel!<b> Mindenkit szerettel várunk!</b>', 1),
(58, 1, '2015.03.22 19:49:28', 'Böjt', 'A következő héten böjt, mindenki aki tud válalni egy vagy több napot, azt kérem imádkozon az ország békességéért.', 1),
(60, 1, '2015.04.12 18:17:14', '16. Csütörtök', 'Április 16.-án csütörtök 19:00 óratól egy hollandiai testvér lesz vendégünk, mindekit szeretettel várunk.', 1),
(61, 1, '2015.04.26 20:02:34', 'Május 1.', 'Május 1: Péntek 10:00 órakor találkozunk...', 1),
(62, 1, '2015.05.01 19:28:36', 'Képek', 'Május elsejés képek megnéhetök <a href=\'http://gyozelem.ro/album.php?id=16#25\'><b> itt </b></a>.', 3),
(63, 1, '2015.05.07 18:46:19', 'Biblia', 'Ajánló: <a href=\'http://biblia.gyozelem.ro?book=40&chapter=1&vers=1#1\'> Online Biblia </a> (Mátétól - Jelenések könyvéig utalásokkal)', 1),
(64, 1, '2015.05.26 12:36:22', 'Szalonta Máj. 31', 'Szalontán a Lacul Rosu utca, 14 szám alatt zenés istentiszteletet tartunk Május 31-én, vasárnap 17:00 órától, mindenkit szeretettel várunk!', 1),
(65, 1, '2015.06.23 14:39:46', 'Július 5 - Gégény', 'Július 5-én 16 órai kezdettel vendégünk lesz Gégény Csaba és Éva, a Dünamisz Magyarország Evangélizáció szolgálói.Várunk szeretettel e különleges alkalomra, hívd el barátaidat is!', 1),
(66, 1, '2015.08.23 08:52:05', 'Augusztus 23', 'Bálint Gyula lesz ma a vendégünk, mindenkit szeretettel várunk.', 1),
(68, 1, '2015.09.07 17:59:06', 'Oldal frissítés', 'Az oldal egy új részleggel egészült ki.<br><a href=\'http://gyozelem.ro/articles.php\'><b>Cikkek</b></a>: bal oldalon található az album és felvételek között.', 1),
(70, 1, '2015.09.20 18:19:36', 'Böjt a következő héten', 'Kérjük mindenkit, hogy böjtöljünk és imádkozunk az európai inváziós helyzetért, az országok vezetőiért, hogy legyen meg az Úr akarata.<br>\r\n<b>Szerdán, szombaton 19:00 közös alkalom.</b>\r\n<br>Mottó: <a href=\'http://biblia.gyozelem.ro/?book=29&chapter=2&vers=12&counter=6\'> Jóel 12-17</a>', 1),
(72, 1, '2015.11.16 14:34:30', 'November 22', 'November 22. 16:00 órai kezdettel vendégünk lesz Perjesi István, a budapesti Agapé gyülekezetből.', 1),
(73, 1, '2015.12.02 14:09:35', 'December 6', 'December 6. 16:00 órai kezdettel vendégünk lesz Boros Gyula, a Bárka gyülekezetből.', 1),
(74, 1, '2015.12.24 19:01:11', 'Karácsony', 'Békés, boldog Karácsonyt kívánok mindenkinek!', 1),
(75, 1, '2015.12.31 18:14:18', '2016', 'Aldott, boldog uj evet kivanunk 2016 -os evre!', 1),
(76, 1, '2016.01.08 18:11:53', 'Böjt', 'Január 4-24 közötti böjti témák <a href=\'http://gyozelem.ro/album.php?id=19#1\'> itt </a> találhatóak meg. \r\nJak 2:20b - "hogy a hit cselekedetek nélkül megholt?"\r\n22b - " cselekedetekből lett teljessé a hit;"', 1),
(77, 1, '2016.01.08 18:14:09', 'Böjt', 'Január 4-24 közötti böjti témák  <a href=\'http://gyozelem.ro/album.php?id=19#1\'>itt</a>  találhatóak meg.<br> <b>Jak 2:20b</b> - <i>"hogy a hit cselekedetek nélkül megholt?"</i> <br><b>22b</b> - <i>" cselekedetekből lett teljessé a hit;"</i>', 1),
(80, 1, '2016.02.13 07:16:38', 'Február 21', 'Február 21. -én 10:00 órától <b>Perjesi István</b> tesvérünk lesz vendégünk a budapesti Agapé gyülekezetből.<br><br> Mindenkit szerettel várunk egésznapos alkalmunkra!', 1),
(81, 1, '2016.02.25 08:18:24', 'Felvétel', 'A Perjesi István február 21.-i szolgálatáról készült felvétel a <a href=\'http://gyozelem.ro/video.php#2\'> <b>Felvételek</b> </a> oldalon tekinthető meg.', 1),
(82, 1, '2016.03.27 11:03:13', 'Húsvét', 'Áldott Húsvétot kívánunk minden család számára!<br><br>ne felejtsük el: <br><b>Jézus ma is él és Úr!</b>', 1),
(83, 1, '2016.04.26 15:49:53', 'Május 15', 'Május 15.-én vendégünk lesz Berkes Sándor. Az alkalom egész napos lesz és 10 órakor kezdődik, majd ebédszünet után délután folytatodik.<br>\r\nVárunk szeretettel mindenkit!', 1),
(84, 1, '2016.09.18 16:36:03', 'Szeptember 25.', '<b>Ambrus Tibor</b> lesz vendégünk szeptember 25.-én és egy <b>Fülöp szigeti pásztor</b>ral. <br>mindenkit szeretettel várunk!', 1),
(85, 1, '2016.10.08 03:10:58', 'Október 9', 'Október 9. Perjesi István lesz vendégünk 16:00 órától, mindenkit szeretettel várunk!', 1),
(86, 1, '2017.03.24 19:55:46', 'Március 26', 'Vasárnap (26-án) Deli Vilmos lesz vendégünk 16:00 -tól.<br> \r\nMindenkit szeretettel várunk!', 1),
(87, 1, '2017.06.04 08:10:22', 'Alkalom', 'Ma 18:00 órától van az alkalom.', 1),
(88, 1, '2017.07.23 20:46:16', 'Augusztus 6.', 'Augusztus 6. <b>Berkes Sándor</b> lesz vendégünk 10:00 órától majd szünet és folytatás 14:00 fele egy másik temával, mindenkit szeretettel várunk!', 1),
(89, 1, '2017.10.20 16:12:28', 'Október 29.', 'Pokorny István lesy vendégünk október 29 -én.<br>Mindenkit szeretettel várunk!', 1),
(90, 1, '2017.11.07 13:43:19', 'November 12.', 'Perjesi István lesz a vendégünk, mindenkit szeretettel várunk 16:00 -ra!', 1);

-- --------------------------------------------------------

--
-- Table structure for table `token`
--

CREATE TABLE `token` (
  `id` int(11) NOT NULL,
  `date` varchar(20) NOT NULL,
  `email` varchar(60) NOT NULL,
  `password` varchar(60) NOT NULL,
  `realname` varchar(60) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
  `rank` tinyint(1) NOT NULL,
  `token` varchar(500) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dumping data for table `token`
--

INSERT INTO `token` (`id`, `date`, `email`, `password`, `realname`, `rank`, `token`) VALUES
(5, '2015.03.25 20:07:21', 'f.ibus@yahoo.com', '123Fibi', 'Ferenczi Ibolya', 2, '8ed6cd78228a6fe2794bf4c55e76e292'),
(8, '2015.03.25 20:11:53', 'kocsaba@yahoo.com', '123Csaba', 'Kovács Csaba', 2, '0284b994450dc81dcbe5be8ecb54d74d'),
(9, '2015.03.25 20:15:23', 'ropihappy@gmail.com', '123Robert', 'Csatlós Róbert', 1, '2e31a074edd2b98d1885541e9b6ea07a');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) UNSIGNED NOT NULL,
  `name` varchar(60) COLLATE utf8_hungarian_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8 NOT NULL,
  `password` varchar(255) CHARACTER SET utf8 NOT NULL,
  `phone` varchar(50) CHARACTER SET utf8 DEFAULT NULL,
  `address` varchar(255) COLLATE utf8_hungarian_ci DEFAULT NULL,
  `city` varchar(255) COLLATE utf8_hungarian_ci DEFAULT NULL,
  `country` varchar(255) COLLATE utf8_hungarian_ci DEFAULT NULL,
  `rank` tinyint(10) UNSIGNED DEFAULT NULL,
  `status` tinyint(1) UNSIGNED DEFAULT NULL,
  `ip` varchar(20) CHARACTER SET utf8 DEFAULT NULL,
  `browser` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `reg_hash` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `rec_hash` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `updated` datetime DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `phone`, `address`, `city`, `country`, `rank`, `status`, `ip`, `browser`, `reg_hash`, `rec_hash`, `created`, `updated`) VALUES
(46, 'Varga Zsolt', 'shadowvzs15@gmail.com', 'e10adc3949ba59abbe56e057f20f883e', NULL, NULL, NULL, NULL, 1, 1, NULL, NULL, NULL, NULL, '2018-03-28 20:09:33', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `albums`
--
ALTER TABLE `albums`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `guests`
--
ALTER TABLE `guests`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `images`
--
ALTER TABLE `images`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `news`
--
ALTER TABLE `news`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `token`
--
ALTER TABLE `token`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD KEY `email` (`email`),
  ADD KEY `password` (`password`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `albums`
--
ALTER TABLE `albums`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;
--
-- AUTO_INCREMENT for table `guests`
--
ALTER TABLE `guests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;
--
-- AUTO_INCREMENT for table `images`
--
ALTER TABLE `images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=312;
--
-- AUTO_INCREMENT for table `news`
--
ALTER TABLE `news`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=91;
--
-- AUTO_INCREMENT for table `token`
--
ALTER TABLE `token`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
