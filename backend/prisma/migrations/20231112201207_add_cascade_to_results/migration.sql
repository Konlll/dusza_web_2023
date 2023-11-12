-- DropForeignKey
ALTER TABLE `Result` DROP FOREIGN KEY `Result_competitionId_fkey`;

-- AddForeignKey
ALTER TABLE `Result` ADD CONSTRAINT `Result_competitionId_fkey` FOREIGN KEY (`competitionId`) REFERENCES `Competition`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
