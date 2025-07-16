/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Institute` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[instituteId]` on the table `InstituteAdmin` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Institute` table without a default value. This is not possible if the table is not empty.
  - Added the required column `instituteId` to the `InstituteAdmin` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Institute" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "InstituteAdmin" ADD COLUMN     "instituteId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Institute_userId_key" ON "Institute"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "InstituteAdmin_instituteId_key" ON "InstituteAdmin"("instituteId");

-- AddForeignKey
ALTER TABLE "InstituteAdmin" ADD CONSTRAINT "InstituteAdmin_instituteId_fkey" FOREIGN KEY ("instituteId") REFERENCES "Institute"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
