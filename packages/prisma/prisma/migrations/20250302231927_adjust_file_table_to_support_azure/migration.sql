/*
  Warnings:

  - You are about to drop the column `bucket` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `s3Key` on the `File` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "File" DROP COLUMN "bucket",
DROP COLUMN "s3Key";
