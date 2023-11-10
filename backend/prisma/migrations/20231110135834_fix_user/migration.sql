-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_groupId_fkey`;

-- AlterTable
ALTER TABLE `User` MODIFY `groupId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `Group`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
