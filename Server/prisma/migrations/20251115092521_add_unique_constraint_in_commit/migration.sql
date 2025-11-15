/*
  Warnings:

  - A unique constraint covering the columns `[userId,projectLocalId,localId]` on the table `Commit` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Commit_userId_projectLocalId_localId_key" ON "Commit"("userId", "projectLocalId", "localId");
