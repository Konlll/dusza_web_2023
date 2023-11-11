-- DropForeignKey
ALTER TABLE `group` DROP FOREIGN KEY `Group_competitionId_fkey`;

-- AlterTable
ALTER TABLE `group` MODIFY `competitionId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Group` ADD CONSTRAINT `Group_competitionId_fkey` FOREIGN KEY (`competitionId`) REFERENCES `Competition`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
