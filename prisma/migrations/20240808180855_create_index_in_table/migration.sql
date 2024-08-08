/*
  Warnings:

  - A unique constraint covering the columns `[document,documentType]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "users_document_documentType_key" ON "users"("document", "documentType");
