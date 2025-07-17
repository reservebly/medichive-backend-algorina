/*
  Warnings:

  - A unique constraint covering the columns `[patientId]` on the table `Diagnosis` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `patientId` to the `Diagnosis` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Diagnosis" ADD COLUMN     "patientId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Symptom" (
    "id" SERIAL NOT NULL,
    "symptoms" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "patientId" INTEGER NOT NULL,

    CONSTRAINT "Symptom_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Symptom_patientId_key" ON "Symptom"("patientId");

-- CreateIndex
CREATE UNIQUE INDEX "Diagnosis_patientId_key" ON "Diagnosis"("patientId");

-- AddForeignKey
ALTER TABLE "Diagnosis" ADD CONSTRAINT "Diagnosis_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Symptom" ADD CONSTRAINT "Symptom_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
