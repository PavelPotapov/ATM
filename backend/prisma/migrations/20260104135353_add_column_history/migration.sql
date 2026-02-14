-- CreateTable
CREATE TABLE "column_history" (
    "id" TEXT NOT NULL,
    "columnId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "field" TEXT,
    "oldValue" TEXT,
    "newValue" TEXT,
    "metadata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "column_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "column_history_columnId_idx" ON "column_history"("columnId");

-- CreateIndex
CREATE INDEX "column_history_userId_idx" ON "column_history"("userId");

-- CreateIndex
CREATE INDEX "column_history_action_idx" ON "column_history"("action");

-- CreateIndex
CREATE INDEX "column_history_createdAt_idx" ON "column_history"("createdAt");

-- AddForeignKey
ALTER TABLE "column_history" ADD CONSTRAINT "column_history_columnId_fkey" FOREIGN KEY ("columnId") REFERENCES "estimate_columns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "column_history" ADD CONSTRAINT "column_history_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
