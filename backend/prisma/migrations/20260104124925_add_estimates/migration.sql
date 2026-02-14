-- CreateEnum
CREATE TYPE "ColumnDataType" AS ENUM ('STRING', 'NUMBER', 'ENUM', 'BOOLEAN', 'DATE');

-- CreateTable
CREATE TABLE "estimates" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "estimates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "estimate_columns" (
    "id" TEXT NOT NULL,
    "estimateId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dataType" "ColumnDataType" NOT NULL DEFAULT 'STRING',
    "order" INTEGER NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "allowedValues" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "estimate_columns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "estimate_rows" (
    "id" TEXT NOT NULL,
    "estimateId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "estimate_rows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cells" (
    "id" TEXT NOT NULL,
    "rowId" TEXT NOT NULL,
    "columnId" TEXT NOT NULL,
    "value" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cells_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cell_history" (
    "id" TEXT NOT NULL,
    "cellId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "oldValue" TEXT,
    "newValue" TEXT,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cell_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "estimates_workspaceId_idx" ON "estimates"("workspaceId");

-- CreateIndex
CREATE INDEX "estimate_columns_estimateId_idx" ON "estimate_columns"("estimateId");

-- CreateIndex
CREATE INDEX "estimate_columns_estimateId_order_idx" ON "estimate_columns"("estimateId", "order");

-- CreateIndex
CREATE INDEX "estimate_rows_estimateId_idx" ON "estimate_rows"("estimateId");

-- CreateIndex
CREATE INDEX "estimate_rows_estimateId_order_idx" ON "estimate_rows"("estimateId", "order");

-- CreateIndex
CREATE INDEX "cells_rowId_idx" ON "cells"("rowId");

-- CreateIndex
CREATE INDEX "cells_columnId_idx" ON "cells"("columnId");

-- CreateIndex
CREATE UNIQUE INDEX "cells_rowId_columnId_key" ON "cells"("rowId", "columnId");

-- CreateIndex
CREATE INDEX "cell_history_cellId_idx" ON "cell_history"("cellId");

-- CreateIndex
CREATE INDEX "cell_history_userId_idx" ON "cell_history"("userId");

-- CreateIndex
CREATE INDEX "cell_history_createdAt_idx" ON "cell_history"("createdAt");

-- AddForeignKey
ALTER TABLE "estimates" ADD CONSTRAINT "estimates_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estimate_columns" ADD CONSTRAINT "estimate_columns_estimateId_fkey" FOREIGN KEY ("estimateId") REFERENCES "estimates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estimate_rows" ADD CONSTRAINT "estimate_rows_estimateId_fkey" FOREIGN KEY ("estimateId") REFERENCES "estimates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cells" ADD CONSTRAINT "cells_rowId_fkey" FOREIGN KEY ("rowId") REFERENCES "estimate_rows"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cells" ADD CONSTRAINT "cells_columnId_fkey" FOREIGN KEY ("columnId") REFERENCES "estimate_columns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cell_history" ADD CONSTRAINT "cell_history_cellId_fkey" FOREIGN KEY ("cellId") REFERENCES "cells"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cell_history" ADD CONSTRAINT "cell_history_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
