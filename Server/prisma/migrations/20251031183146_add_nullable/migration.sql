/*
  Warnings:

  - Added the required column `status` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "deadline" TIMESTAMP(3),
ADD COLUMN     "status" BOOLEAN NOT NULL,
ADD COLUMN     "totalCommit" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "totalProject" INTEGER NOT NULL DEFAULT 0;
