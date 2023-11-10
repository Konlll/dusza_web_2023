/*
  Warnings:

  - A unique constraint covering the columns `[word1,word2,word3,word4,grade]` on the table `Task` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Task_word1_word2_word3_word4_grade_key` ON `Task`(`word1`, `word2`, `word3`, `word4`, `grade`);
