-- AlterTable
ALTER TABLE "LabAdmin" ADD COLUMN     "lab_id" INTEGER;

-- AlterTable
ALTER TABLE "lab_reports" ADD COLUMN     "lab_id" INTEGER;

-- AddForeignKey
ALTER TABLE "LabAdmin" ADD CONSTRAINT "LabAdmin_lab_id_fkey" FOREIGN KEY ("lab_id") REFERENCES "labs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "complaints" ADD CONSTRAINT "complaints_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lab_reports" ADD CONSTRAINT "lab_reports_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lab_reports" ADD CONSTRAINT "lab_reports_lab_id_fkey" FOREIGN KEY ("lab_id") REFERENCES "labs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
