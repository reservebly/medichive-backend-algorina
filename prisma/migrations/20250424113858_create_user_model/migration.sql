-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('MEDICHIVE_ADMIN', 'INSTITUTE_ADMIN', 'LAB_ADMIN', 'DOCTOR', 'PATIENT');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "nic" TEXT NOT NULL,
    "contactNo" TEXT NOT NULL,
    "roles" "UserRole" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
