/*
  Warnings:

  - You are about to drop the column `messange` on the `Commit` table. All the data in the column will be lost.
  - Added the required column `message` to the `Commit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Commit" DROP COLUMN "messange",
ADD COLUMN     "message" TEXT NOT NULL;
