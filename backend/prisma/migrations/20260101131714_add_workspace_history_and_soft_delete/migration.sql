-- AlterTable
ALTER TABLE "workspaces" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "workspace_history" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "field" TEXT,
    "oldValue" TEXT,
    "newValue" TEXT,
    "metadata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "workspace_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "workspace_history_workspaceId_idx" ON "workspace_history"("workspaceId");

-- CreateIndex
CREATE INDEX "workspace_history_userId_idx" ON "workspace_history"("userId");

-- CreateIndex
CREATE INDEX "workspace_history_action_idx" ON "workspace_history"("action");

-- AddForeignKey
ALTER TABLE "workspace_history" ADD CONSTRAINT "workspace_history_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_history" ADD CONSTRAINT "workspace_history_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
