-- CreateTable
CREATE TABLE `prompts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `content` TEXT NOT NULL,
    `tags` VARCHAR(255) NULL,
    `version` INTEGER NOT NULL DEFAULT 1,
    `status` VARCHAR(50) NOT NULL DEFAULT 'active',
    `author_id` INTEGER NULL,
    `category` VARCHAR(100) NULL,
    `usage_count` INTEGER NOT NULL DEFAULT 0,
    `last_used_at` TIMESTAMP NULL,
    `is_public` BOOLEAN NOT NULL DEFAULT true,
    `source` VARCHAR(255) NULL,
    `remarks` TEXT NULL,
    `role` VARCHAR(50) NOT NULL DEFAULT 'user',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `prompts` ADD CONSTRAINT `prompts_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
