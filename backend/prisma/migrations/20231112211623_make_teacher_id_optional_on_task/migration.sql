-- DropForeignKey
ALTER TABLE `Task` DROP FOREIGN KEY `Task_teacherId_fkey`;

-- AlterTable
ALTER TABLE `Task` MODIFY `teacherId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_teacherId_fkey` FOREIGN KEY (`teacherId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
