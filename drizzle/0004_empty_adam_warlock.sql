CREATE TABLE `page_contents` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`page` text NOT NULL,
	`section` text NOT NULL,
	`content_type` text NOT NULL,
	`field_name` text NOT NULL,
	`field_value` text,
	`display_order` integer DEFAULT 0,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
