/*
  Warnings:

  - You are about to alter the column `name` on the `permissions` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to alter the column `last_used_at` on the `prompts` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `updated_at` on the `prompts` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `name` on the `roles` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - The primary key for the `user_permissions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `assigned_at` on the `user_permissions` table. All the data in the column will be lost.
  - You are about to alter the column `username` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to alter the column `email` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - Added the required column `id` to the `user_permissions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `user_permissions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `user_permissions` DROP FOREIGN KEY `user_permissions_permission_id_fkey`;

-- DropForeignKey
ALTER TABLE `user_permissions` DROP FOREIGN KEY `user_permissions_user_id_fkey`;

-- DropIndex
DROP INDEX `user_permissions_permission_id_fkey` ON `user_permissions`;

-- AlterTable
ALTER TABLE `permissions` MODIFY `name` VARCHAR(50) NOT NULL,
    MODIFY `description` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `prompts` MODIFY `last_used_at` TIMESTAMP NULL,
    MODIFY `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE `roles` ADD COLUMN `description` VARCHAR(255) NULL,
    MODIFY `name` VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE `user_permissions` DROP PRIMARY KEY,
    DROP COLUMN `assigned_at`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `users` ADD COLUMN `avatar_url` VARCHAR(255) NULL,
    ADD COLUMN `department` VARCHAR(100) NULL,
    ADD COLUMN `is_active` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `is_admin` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `last_login_at` DATETIME(3) NULL,
    ADD COLUMN `phone_number` VARCHAR(20) NULL,
    MODIFY `username` VARCHAR(50) NOT NULL,
    MODIFY `password` VARCHAR(255) NOT NULL,
    MODIFY `email` VARCHAR(100) NOT NULL;

-- CreateTable
CREATE TABLE `docs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `type` VARCHAR(50) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `author_id` INTEGER NULL,
    `file_path` VARCHAR(255) NULL,
    `file_size` INTEGER NULL,
    `is_public` BOOLEAN NOT NULL DEFAULT true,
    `status` VARCHAR(50) NOT NULL DEFAULT 'active',

    UNIQUE INDEX `docs_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_permissions` ADD CONSTRAINT `user_permissions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_permissions` ADD CONSTRAINT `user_permissions_permission_id_fkey` FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `docs` ADD CONSTRAINT `docs_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
