/*
  Warnings:

  - You are about to drop the column `name` on the `LabReport` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[doctorId]` on the table `Diagnosis` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[patientId]` on the table `LabReport` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `doctorId` to the `Diagnosis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category` to the `LabReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patientId` to the `LabReport` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Diagnosis" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "doctorId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Doctor" ADD COLUMN     "labReportId" INTEGER;

-- AlterTable
ALTER TABLE "LabReport" DROP COLUMN "name",
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "patientId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Symptom" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "Prescription" (
    "id" SERIAL NOT NULL,
    "imageUrl" TEXT,
    "notes" TEXT,
    "patientId" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Prescription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Prescription_patientId_key" ON "Prescription"("patientId");

-- CreateIndex
CREATE UNIQUE INDEX "Prescription_doctorId_key" ON "Prescription"("doctorId");

-- CreateIndex
CREATE UNIQUE INDEX "Diagnosis_doctorId_key" ON "Diagnosis"("doctorId");

-- CreateIndex
CREATE UNIQUE INDEX "LabReport_patientId_key" ON "LabReport"("patientId");

-- AddForeignKey
ALTER TABLE "Doctor" ADD CONSTRAINT "Doctor_labReportId_fkey" FOREIGN KEY ("labReportId") REFERENCES "LabReport"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Diagnosis" ADD CONSTRAINT "Diagnosis_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LabReport" ADD CONSTRAINT "LabReport_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
