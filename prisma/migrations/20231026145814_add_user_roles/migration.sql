/*
  Warnings:

  - Added the required column `roleId` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "roleId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "users_roles" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "users_roles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_roles_name_key" ON "users_roles"("name");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "users_roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
