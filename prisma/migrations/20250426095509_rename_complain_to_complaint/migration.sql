/*
  Warnings:

  - You are about to drop the `complain` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "complain";

-- CreateTable
CREATE TABLE "complaint" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "complaint_pkey" PRIMARY KEY ("id")
);
