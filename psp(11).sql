-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 07, 2025 at 12:47 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `psp`
--

-- --------------------------------------------------------

--
-- Table structure for table `akcje`
--

CREATE TABLE `akcje` (
  `ID` int(11) NOT NULL,
  `CzasWejscia` datetime NOT NULL,
  `BudynekID` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `beaconyuwb`
--

CREATE TABLE `beaconyuwb` (
  `ID` varchar(11) NOT NULL,
  `AkcjaID` int(11) NOT NULL,
  `Nazwa` varchar(30) NOT NULL,
  `Bateria` int(11) NOT NULL,
  `X` float NOT NULL,
  `Y` float NOT NULL,
  `Z` float NOT NULL,
  `Status` int(11) NOT NULL,
  `Lat` float NOT NULL,
  `Lon` float NOT NULL,
  `Alt` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_polish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `budynek`
--

CREATE TABLE `budynek` (
  `ID` varchar(30) NOT NULL,
  `Nazwa` text NOT NULL,
  `Adres` text NOT NULL,
  `TypID` int(11) NOT NULL,
  `X` float NOT NULL,
  `Y` float NOT NULL,
  `Z` float NOT NULL,
  `Lat` float NOT NULL,
  `Lon` float NOT NULL,
  `Alt` float NOT NULL,
  `Rot` float NOT NULL,
  `PrzelicznikLat` int(11) NOT NULL,
  `PrzelicznikLon` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `hazard_zones`
--

CREATE TABLE `hazard_zones` (
  `ID` varchar(30) NOT NULL,
  `Nazwa` text NOT NULL,
  `PietroID` varchar(30) NOT NULL,
  `x1` float NOT NULL,
  `y1` float NOT NULL,
  `x2` float NOT NULL,
  `y2` float NOT NULL,
  `TypZagrozeniaID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `historia_beacon-strazak`
--

CREATE TABLE `historia_beacon-strazak` (
  `ID` int(11) NOT NULL,
  `AkcjaID` int(11) NOT NULL,
  `StrazakID` varchar(11) NOT NULL,
  `BeaconID` varchar(11) NOT NULL,
  `Czas` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_polish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `klatka-pietra`
--

CREATE TABLE `klatka-pietra` (
  `ID` int(11) NOT NULL,
  `KlatkaSchodowaID` int(11) NOT NULL,
  `PietroID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_polish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `klatkaschodowa`
--

CREATE TABLE `klatkaschodowa` (
  `ID` varchar(30) NOT NULL,
  `BudynekID` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_polish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pietra`
--

CREATE TABLE `pietra` (
  `ID` int(11) NOT NULL,
  `BudynekID` varchar(30) NOT NULL,
  `Numer` int(11) NOT NULL,
  `Nazwa` text NOT NULL,
  `Wysokosc` float NOT NULL,
  `Hazard_level` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pozycja`
--

CREATE TABLE `pozycja` (
  `ID` int(11) NOT NULL,
  `StrazakID` varchar(11) NOT NULL,
  `X` float NOT NULL,
  `Y` float NOT NULL,
  `Z` float NOT NULL,
  `Czas` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `punkty_wejscia`
--

CREATE TABLE `punkty_wejscia` (
  `ID` varchar(30) NOT NULL,
  `nazwa` text NOT NULL,
  `x` float NOT NULL,
  `y` float NOT NULL,
  `PietroID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `status`
--

CREATE TABLE `status` (
  `ID` int(11) NOT NULL,
  `Status` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `status`
--

INSERT INTO `status` (`ID`, `Status`) VALUES
(1, 'active'),
(2, 'pre_alarm'),
(3, 'alarm');

-- --------------------------------------------------------

--
-- Table structure for table `strazak`
--

CREATE TABLE `strazak` (
  `ID` varchar(11) NOT NULL,
  `ImieNazwisko` text NOT NULL,
  `Zespol` int(11) NOT NULL,
  `Status` int(11) NOT NULL,
  `Bateria` int(11) NOT NULL,
  `StanRuchu` int(11) NOT NULL,
  `BPM` int(11) NOT NULL,
  `tag_id` varchar(50) NOT NULL,
  `rola` varchar(50) NOT NULL,
  `ranga` varchar(50) NOT NULL,
  `hr_brand_id` varchar(50) NOT NULL,
  `scba_id` varchar(50) NOT NULL,
  `recco_id` varchar(12) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `typybudynkow`
--

CREATE TABLE `typybudynkow` (
  `ID` int(11) NOT NULL,
  `Nazwa` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_polish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `zagrozenia`
--

CREATE TABLE `zagrozenia` (
  `ID` int(11) NOT NULL,
  `Nazwa` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_polish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `zespoly`
--

CREATE TABLE `zespoly` (
  `ID` int(11) NOT NULL,
  `ZespolName` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `zespoly`
--

INSERT INTO `zespoly` (`ID`, `ZespolName`) VALUES
(1, 'Rota 1'),
(2, 'RIT');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `hazard_zones`
--
ALTER TABLE `hazard_zones`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `historia_beacon-strazak`
--
ALTER TABLE `historia_beacon-strazak`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `klatka-pietra`
--
ALTER TABLE `klatka-pietra`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `klatkaschodowa`
--
ALTER TABLE `klatkaschodowa`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `pietra`
--
ALTER TABLE `pietra`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `pozycja`
--
ALTER TABLE `pozycja`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `status`
--
ALTER TABLE `status`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `strazak`
--
ALTER TABLE `strazak`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `strazak_zespol` (`Zespol`),
  ADD KEY `strazak_status` (`Status`);

--
-- Indexes for table `typybudynkow`
--
ALTER TABLE `typybudynkow`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `zagrozenia`
--
ALTER TABLE `zagrozenia`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `zespoly`
--
ALTER TABLE `zespoly`
  ADD PRIMARY KEY (`ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `historia_beacon-strazak`
--
ALTER TABLE `historia_beacon-strazak`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `klatka-pietra`
--
ALTER TABLE `klatka-pietra`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pietra`
--
ALTER TABLE `pietra`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pozycja`
--
ALTER TABLE `pozycja`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `status`
--
ALTER TABLE `status`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `typybudynkow`
--
ALTER TABLE `typybudynkow`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `zagrozenia`
--
ALTER TABLE `zagrozenia`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `zespoly`
--
ALTER TABLE `zespoly`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
