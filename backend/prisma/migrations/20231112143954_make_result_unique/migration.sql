/*
  Warnings:

  - A unique constraint covering the columns `[competitionId,userId]` on the table `Result` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Result_competitionId_userId_key` ON `Result`(`competitionId`, `userId`);
