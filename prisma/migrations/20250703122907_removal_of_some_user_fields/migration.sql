/*
  Warnings:

  - You are about to drop the column `icon` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `isPublished` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Document" DROP COLUMN "icon",
DROP COLUMN "isPublished";

-- DropTable
DROP TABLE "User";
