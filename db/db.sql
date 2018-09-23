CREATE TABLE `albums` (
  `id` int(11) NOT NULL,
  `status` tinyint(4) NOT NULL,
  `user_id` int(15) NOT NULL,
  `slug` varchar(255) COLLATE utf8_hungarian_ci NOT NULL,
  `title` varchar(100) COLLATE utf8_hungarian_ci NOT NULL,
  `description` text COLLATE utf8_hungarian_ci NOT NULL,
  `created` datetime NOT NULL,
  `updated` datetime DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

CREATE TABLE `articles` (
  `id` int(6) UNSIGNED NOT NULL,
  `user_id` int(11) NOT NULL,
  `category_slug` varchar(100) NOT NULL,
  `rank` tinyint(4) NOT NULL,
  `title` varchar(100) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `content` longtext NOT NULL,
  `view` int(9) DEFAULT NULL,
  `created` datetime NOT NULL,
  `updated` datetime DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

CREATE TABLE `audios` (
  `id` int(11) NOT NULL,
  `title` varchar(255) COLLATE utf8_hungarian_ci DEFAULT NULL,
  `duration` int(11) NOT NULL DEFAULT '0',
  `source` varchar(255) COLLATE utf8_hungarian_ci DEFAULT NULL,
  `lyric` text COLLATE utf8_hungarian_ci,
  `created` datetime DEFAULT NULL,
  `updated` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

CREATE TABLE `guestbook` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL DEFAULT '0',
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `name` varchar(255) COLLATE utf8_hungarian_ci NOT NULL,
  `email` varchar(100) COLLATE utf8_hungarian_ci NOT NULL,
  `message` text COLLATE utf8_hungarian_ci NOT NULL,
  `created` datetime NOT NULL,
  `updated` datetime DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

CREATE TABLE `guests` (
  `id` int(11) UNSIGNED NOT NULL,
  `user_id` int(11) UNSIGNED NOT NULL,
  `status` tinyint(4) UNSIGNED NOT NULL DEFAULT '1',
  `title` varchar(255) COLLATE utf8_hungarian_ci NOT NULL,
  `message` text COLLATE utf8_hungarian_ci,
  `created` datetime NOT NULL,
  `updated` datetime DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

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

CREATE TABLE `logs` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `type` tinyint(10) NOT NULL COMMENT '1=query, 2=query error',
  `action` varchar(255) COLLATE utf8_hungarian_ci NOT NULL,
  `data` text COLLATE utf8_hungarian_ci NOT NULL,
  `ip` varchar(16) COLLATE utf8_hungarian_ci DEFAULT NULL,
  `created` datetime NOT NULL,
  `updated` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;


CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `status` tinyint(11) NOT NULL DEFAULT '0',
  `visibility` tinyint(3) NOT NULL DEFAULT '0' COMMENT '1=sender deleted, 2=target deleted, 3=both',
  `sender_id` int(11) NOT NULL,
  `target_id` int(11) NOT NULL,
  `subject` varchar(255) COLLATE utf8_hungarian_ci DEFAULT NULL,
  `content` text COLLATE utf8_hungarian_ci,
  `created` datetime DEFAULT NULL,
  `updated` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

CREATE TABLE `news` (
  `id` int(11) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '1',
  `user_id` int(11) NOT NULL,
  `title` varchar(100) COLLATE utf8_hungarian_ci NOT NULL,
  `message` varchar(512) COLLATE utf8_hungarian_ci NOT NULL,
  `created` datetime NOT NULL,
  `updated` datetime DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

CREATE TABLE `schedules` (
  `id` int(11) UNSIGNED NOT NULL,
  `status` tinyint(2) UNSIGNED NOT NULL,
  `user_id` int(11) UNSIGNED NOT NULL,
  `event_at` varchar(255) DEFAULT NULL,
  `event_name` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `created` datetime NOT NULL,
  `updated` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `token` (
  `id` int(11) NOT NULL,
  `date` varchar(20) NOT NULL,
  `email` varchar(60) NOT NULL,
  `password` varchar(60) NOT NULL,
  `realname` varchar(60) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
  `rank` tinyint(1) NOT NULL,
  `token` varchar(500) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

CREATE TABLE `users` (
  `id` int(11) UNSIGNED NOT NULL,
  `rank` tinyint(10) UNSIGNED DEFAULT NULL,
  `status` tinyint(1) UNSIGNED DEFAULT NULL,
  `name` varchar(60) COLLATE utf8_hungarian_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8 NOT NULL,
  `password` varchar(255) CHARACTER SET utf8 NOT NULL,
  `phone` varchar(50) CHARACTER SET utf8 DEFAULT NULL,
  `address` varchar(255) COLLATE utf8_hungarian_ci DEFAULT NULL,
  `city` varchar(255) COLLATE utf8_hungarian_ci DEFAULT NULL,
  `country` varchar(255) COLLATE utf8_hungarian_ci DEFAULT NULL,
  `ip` varchar(20) CHARACTER SET utf8 DEFAULT NULL,
  `browser` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `reg_hash` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `rec_hash` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `last_action` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `login` int(11) NOT NULL DEFAULT '0',
  `created` datetime DEFAULT NULL,
  `updated` datetime DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

ALTER TABLE `albums`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `articles`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `audios`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `guestbook`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `guests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

ALTER TABLE `images`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `logs`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `news`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `schedules`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `token`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD KEY `email` (`email`),
  ADD KEY `password` (`password`);

ALTER TABLE `albums`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=64;

ALTER TABLE `articles`
  MODIFY `id` int(6) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

ALTER TABLE `audios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

ALTER TABLE `guestbook`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=309;

ALTER TABLE `guests`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

ALTER TABLE `images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3981;

ALTER TABLE `logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=234;

ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

ALTER TABLE `news`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=126;

ALTER TABLE `schedules`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

ALTER TABLE `token`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

ALTER TABLE `users`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

