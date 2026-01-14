/*
  Warnings:

  - You are about to drop the column `created_at` on the `prompts` table. All the data in the column will be lost.
  - You are about to alter the column `last_used_at` on the `prompts` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `updated_at` on the `prompts` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.

*/
-- AlterTable
ALTER TABLE `prompts` DROP COLUMN `created_at`,
    MODIFY `last_used_at` TIMESTAMP NULL,
    MODIFY `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
