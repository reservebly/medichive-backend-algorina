/*
  Warnings:

  - You are about to drop the `complaint` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "complaint";

-- CreateTable
CREATE TABLE "Complaint" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "Complaint_pkey" PRIMARY KEY ("id")
);
