Roulette


DDL Generated


CREATE TABLE `bets` (
  `betID` int(11) NOT NULL AUTO_INCREMENT,
  `betNumber` int(11) NOT NULL,
  `betAmount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `betTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `gameID` int(11) NOT NULL,
  `userID` int(11) NOT NULL,
  PRIMARY KEY (`betID`),
  KEY `gameID` (`gameID`),
  KEY `userID` (`userID`),
  CONSTRAINT `bets_ibfk_1` FOREIGN KEY (`gameID`) REFERENCES `games` (`gameID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `bets_ibfk_2` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `betsummaries` (
  `betSummaryID` int(11) NOT NULL AUTO_INCREMENT,
  `betNumber` int(11) NOT NULL,
  `totalBetAmount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userID` int(11) NOT NULL,
  `gameID` int(11) NOT NULL,
  PRIMARY KEY (`betSummaryID`),
  KEY `gameID` (`gameID`),
  KEY `user_bets` (`userID`,`gameID`,`betNumber`),
  CONSTRAINT `betsummaries_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `betsummaries_ibfk_2` FOREIGN KEY (`gameID`) REFERENCES `games` (`gameID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci


CREATE TABLE `casinos` (
  `casinoID` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `BalanceAmount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`casinoID`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci


CREATE TABLE `casinousers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userStatus` tinyint(1) DEFAULT '1',
  `userID` int(11) NOT NULL,
  `casinoID` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userID` (`userID`),
  KEY `casinoID` (`casinoID`),
  CONSTRAINT `casinousers_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `casinousers_ibfk_2` FOREIGN KEY (`casinoID`) REFERENCES `casinos` (`casinoID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `dealers` (
  `dealerID` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `casinoID` int(11) DEFAULT NULL,
  PRIMARY KEY (`dealerID`),
  KEY `casinoID` (`casinoID`),
  CONSTRAINT `dealers_ibfk_1` FOREIGN KEY (`casinoID`) REFERENCES `casinos` (`casinoID`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci


CREATE TABLE `games` (
  `gameID` int(11) NOT NULL AUTO_INCREMENT,
  `status` int(2) NOT NULL DEFAULT '0',
  `startTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `endTime` datetime DEFAULT NULL,
  `winningNumber` int(11) DEFAULT NULL,
  `casinoID` int(11) DEFAULT NULL,
  PRIMARY KEY (`gameID`),
  KEY `casinoID` (`casinoID`),
  CONSTRAINT `games_ibfk_1` FOREIGN KEY (`casinoID`) REFERENCES `casinos` (`casinoID`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `usergames` (
  `userID` int(11) NOT NULL,
  `gameID` int(11) NOT NULL,
  PRIMARY KEY (`userID`,`gameID`),
  KEY `gameID` (`gameID`),
  CONSTRAINT `usergames_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `usergames_ibfk_2` FOREIGN KEY (`gameID`) REFERENCES `games` (`gameID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `users` (
  `userID` int(11) NOT NULL AUTO_INCREMENT,
  `userName` varchar(255) NOT NULL,
  `BalanceAmount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`userID`),
  UNIQUE KEY `userName` (`userName`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci