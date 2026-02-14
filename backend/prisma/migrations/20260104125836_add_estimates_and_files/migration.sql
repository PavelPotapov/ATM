/*
  Warnings:

  - Added the required column `createdById` to the `estimate_columns` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `estimates` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "estimate_columns" ADD COLUMN     "createdById" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "estimates" ADD COLUMN     "createdById" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "column_role_permissions" (
    "id" TEXT NOT NULL,
    "columnId" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "canView" BOOLEAN NOT NULL DEFAULT true,
    "canEdit" BOOLEAN NOT NULL DEFAULT false,
    "canCreate" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "column_role_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workspace_files" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "uploadedById" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "category" TEXT,
    "description" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workspace_files_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "column_role_permissions_columnId_idx" ON "column_role_permissions"("columnId");

-- CreateIndex
CREATE INDEX "column_role_permissions_role_idx" ON "column_role_permissions"("role");

-- CreateIndex
CREATE UNIQUE INDEX "column_role_permissions_columnId_role_key" ON "column_role_permissions"("columnId", "role");

-- CreateIndex
CREATE INDEX "workspace_files_workspaceId_idx" ON "workspace_files"("workspaceId");

-- CreateIndex
CREATE INDEX "workspace_files_uploadedById_idx" ON "workspace_files"("uploadedById");

-- CreateIndex
CREATE INDEX "workspace_files_category_idx" ON "workspace_files"("category");

-- CreateIndex
CREATE INDEX "estimate_columns_createdById_idx" ON "estimate_columns"("createdById");

-- CreateIndex
CREATE INDEX "estimates_createdById_idx" ON "estimates"("createdById");

-- AddForeignKey
ALTER TABLE "estimates" ADD CONSTRAINT "estimates_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estimate_columns" ADD CONSTRAINT "estimate_columns_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "column_role_permissions" ADD CONSTRAINT "column_role_permissions_columnId_fkey" FOREIGN KEY ("columnId") REFERENCES "estimate_columns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_files" ADD CONSTRAINT "workspace_files_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_files" ADD CONSTRAINT "workspace_files_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
