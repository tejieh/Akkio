CREATE TABLE "composio_entities" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "composio_entities_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "composio_entities_userId_key" ON "composio_entities"("userId");
CREATE UNIQUE INDEX "composio_entities_entityId_key" ON "composio_entities"("entityId");
CREATE INDEX "composio_entities_entityId_idx" ON "composio_entities"("entityId");

ALTER TABLE "composio_entities"
ADD CONSTRAINT "composio_entities_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "auth_users"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;
