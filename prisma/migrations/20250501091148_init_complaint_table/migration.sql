/*
  Warnings:

  - Added the required column `complain` to the `Complaint` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Complaint" ADD COLUMN     "complain" TEXT NOT NULL;
