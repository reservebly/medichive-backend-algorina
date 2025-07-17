-- CreateTable
CREATE TABLE "DoctorRating" (
    "id" SERIAL NOT NULL,
    "doctorId" TEXT NOT NULL,
    "patientId" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DoctorRating_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DoctorRating" ADD CONSTRAINT "DoctorRating_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorRating" ADD CONSTRAINT "DoctorRating_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
