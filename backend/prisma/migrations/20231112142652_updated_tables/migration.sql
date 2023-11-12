/*
  Warnings:

  - You are about to drop the column `document` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `picture` on the `Picture` table. All the data in the column will be lost.
  - Added the required column `pictureName` to the `Picture` table without a default value. This is not possible if the table is not empty.
  - Added the required column `picturePath` to the `Picture` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Document` DROP COLUMN `document`,
    ADD COLUMN `documentName` VARCHAR(191) NULL,
    ADD COLUMN `documentPath` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Picture` DROP COLUMN `picture`,
    ADD COLUMN `pictureName` VARCHAR(191) NOT NULL,
    ADD COLUMN `picturePath` VARCHAR(191) NOT NULL;
