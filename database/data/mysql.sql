CREATE TABLE `User` (
  `id` varchar(16) NOT NULL,
  `name` varchar(50) NOT NULL,
  `credential` varchar(50) DEFAULT NULL,
  `pod` varchar(100) DEFAULT NULL,
  `role` varchar(100) DEFAULT NULL,
  `active` int(1) DEFAULT '1',
  `status` varchar(1000) DEFAULT NULL,
  `lastUpdateTimestamp` timestamp(6) NULL DEFAULT NULL,
  `lastSignTimestamp` timestamp(6) NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `TimeRecord` (
  `id` bigint(20) NOT NULL,
  `uid` varchar(16) NOT NULL,
  `date` varchar(20) DEFAULT NULL,
  `timeStart` varchar(10) DEFAULT NULL,
  `timeEnd` varchar(10) DEFAULT NULL,
  `description` varchar(200) DEFAULT NULL,
  `type` int(2) NOT NULL COMMENT '1 - Leave; 2 - Catchup',
  PRIMARY KEY (`id`)
);

CREATE TABLE `ReferenceCode` (
  `code` varchar(30) NOT NULL,
  `type` varchar(20) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` varchar(200) DEFAULT NULL,
  `active` int(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`code`,`type`)
);

CREATE TABLE `user_test` (
  `id` int(11) NOT NULL,
  `username` varchar(16) NOT NULL,
  `email` varchar(255) NOT NULL,
  `userType` int(11) NOT NULL,
  PRIMARY KEY (`id`)
);