-- DropForeignKey
ALTER TABLE `Result` DROP FOREIGN KEY `Result_userId_fkey`;

-- AddForeignKey
ALTER TABLE `Result` ADD CONSTRAINT `Result_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
