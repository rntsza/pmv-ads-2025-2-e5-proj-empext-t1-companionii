/*
  Warnings:

  - A unique constraint covering the columns `[reportKey]` on the table `Report` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `reportKey` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Report" ADD COLUMN     "reportKey" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Report_reportKey_key" ON "public"."Report"("reportKey");
