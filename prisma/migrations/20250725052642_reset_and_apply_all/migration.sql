/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Institute` table. All the data in the column will be lost.
  - You are about to drop the column `instituteId` on the `InstituteAdmin` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `refreshToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Complaint` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Lab` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LabReport` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updated_at` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "InstituteAdmin" DROP CONSTRAINT "InstituteAdmin_instituteId_fkey";

-- DropIndex
DROP INDEX "Institute_userId_key";

-- DropIndex
DROP INDEX "InstituteAdmin_instituteId_key";

-- AlterTable
ALTER TABLE "Doctor" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Institute" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "InstituteAdmin" DROP COLUMN "instituteId",
ADD COLUMN     "institute_id" INTEGER;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "createdAt",
DROP COLUMN "refreshToken",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "refresh_token" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "Complaint";

-- DropTable
DROP TABLE "Lab";

-- DropTable
DROP TABLE "LabReport";

-- CreateTable
CREATE TABLE "labs" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "registration_number" TEXT NOT NULL,
    "contact_number" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "certificate" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "labs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "complaints" (
    "id" SERIAL NOT NULL,
    "complaint_id" TEXT NOT NULL,
    "complaint_text" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "category" TEXT NOT NULL DEFAULT 'GENERAL',
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "user_id" TEXT,
    "user_email" TEXT,
    "admin_response" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "resolved_at" TIMESTAMP(3),

    CONSTRAINT "complaints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lab_reports" (
    "id" SERIAL NOT NULL,
    "patient_id" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "report_link" TEXT,
    "image_path" TEXT,
    "pdf_path" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lab_reports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "labs_user_id_key" ON "labs"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "complaints_complaint_id_key" ON "complaints"("complaint_id");

-- AddForeignKey
ALTER TABLE "InstituteAdmin" ADD CONSTRAINT "InstituteAdmin_institute_id_fkey" FOREIGN KEY ("institute_id") REFERENCES "Institute"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "labs" ADD CONSTRAINT "labs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
