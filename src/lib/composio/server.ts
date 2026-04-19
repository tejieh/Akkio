import "server-only";

import { Composio } from "@composio/core";
import { VercelProvider } from "@composio/vercel";
import {
  composioIntegrationDetails,
  composioIntegrationIds,
  type ComposioIntegrationState,
  type ComposioIntegrationId,
} from "@/lib/composio/constants";
import { getComposioEnv, isComposioConfigured } from "@/lib/env";
import { logger } from "@/lib/logger";
import { getPrisma } from "@/server/db/prisma";

const COMPOSIO_ENTITY_PREFIX = "akkio_entity";

type ScopedSessionOptions = {
  connectedAccounts?: Partial<Record<ComposioIntegrationId, string>>;
  integrationIds?: readonly ComposioIntegrationId[];
  manageConnections?: boolean;
};

let composioClient: Composio<VercelProvider> | null = null;

function createComposioEntityId() {
  return `${COMPOSIO_ENTITY_PREFIX}_${crypto.randomUUID()}`;
}

function getComposioClient() {
  const composioEnv = getComposioEnv();

  if (!composioEnv) {
    throw new Error("Composio is not configured.");
  }

  composioClient ??= new Composio({
    apiKey: composioEnv.apiKey,
    provider: new VercelProvider(),
  });

  return composioClient;
}

function pickDefinedAuthConfigs(
  integrationIds: readonly ComposioIntegrationId[],
) {
  const authConfigs = getComposioEnv()?.authConfigs;

  if (!authConfigs) {
    return undefined;
  }

  const scopedAuthConfigs = Object.fromEntries(
    integrationIds.flatMap((integrationId) => {
      const authConfigId = authConfigs[integrationId];
      return authConfigId ? [[integrationId, authConfigId]] : [];
    }),
  ) as Partial<Record<ComposioIntegrationId, string>>;

  return Object.keys(scopedAuthConfigs).length > 0
    ? scopedAuthConfigs
    : undefined;
}

function pickDefinedConnectedAccounts(
  connectedAccounts: Partial<Record<ComposioIntegrationId, string>> | undefined,
) {
  if (!connectedAccounts) {
    return undefined;
  }

  const scopedConnectedAccounts = Object.fromEntries(
    Object.entries(connectedAccounts).filter(
      (entry): entry is [string, string] => Boolean(entry[1]),
    ),
  ) as Partial<Record<ComposioIntegrationId, string>>;

  return Object.keys(scopedConnectedAccounts).length > 0
    ? scopedConnectedAccounts
    : undefined;
}

export async function getOrCreateComposioEntityId(userId: string) {
  const prisma = getPrisma();
  const existingEntity = await prisma.composio_entities.findUnique({
    where: { userId },
  });

  if (existingEntity) {
    return existingEntity.entityId;
  }

  const entity = await prisma.composio_entities.create({
    data: {
      userId,
      entityId: createComposioEntityId(),
    },
  });

  logger.info("composio.entity.created", {
    userId,
  });

  return entity.entityId;
}

export async function createScopedComposioSessionForUser(
  userId: string,
  options: ScopedSessionOptions = {},
) {
  const entityId = await getOrCreateComposioEntityId(userId);
  const integrationIds = options.integrationIds ?? composioIntegrationIds;
  const authConfigs = pickDefinedAuthConfigs(integrationIds);
  const connectedAccounts = pickDefinedConnectedAccounts(
    options.connectedAccounts,
  );

  const session = await getComposioClient().create(entityId, {
    toolkits: [...integrationIds],
    manageConnections: options.manageConnections ?? false,
    workbench: {
      enable: false,
    },
    ...(authConfigs ? { authConfigs } : {}),
    ...(connectedAccounts ? { connectedAccounts } : {}),
  });

  return {
    entityId,
    session,
  };
}

export async function createComposioConnectLinkForUser(
  userId: string,
  integrationId: ComposioIntegrationId,
  callbackUrl: string,
) {
  const { session } = await createScopedComposioSessionForUser(userId, {
    integrationIds: [integrationId],
  });
  const connectionRequest = await session.authorize(integrationId, {
    callbackUrl,
  });

  return connectionRequest.redirectUrl;
}

export async function deleteComposioConnectionForUser(
  userId: string,
  integrationId: ComposioIntegrationId,
) {
  const { session } = await createScopedComposioSessionForUser(userId, {
    integrationIds: [integrationId],
  });
  const toolkits = await session.toolkits();
  const activeConnectionId =
    toolkits.items.find((toolkit) => toolkit.slug === integrationId)?.connection
      ?.connectedAccount?.id ?? null;

  if (!activeConnectionId) {
    return false;
  }

  await getComposioClient().connectedAccounts.delete(activeConnectionId);
  return true;
}

export async function listComposioIntegrationStatesForUser(userId: string) {
  const defaults = composioIntegrationIds.map<ComposioIntegrationState>(
    (integrationId) => ({
      id: integrationId,
      name: composioIntegrationDetails[integrationId].name,
      description: composioIntegrationDetails[integrationId].description,
      connected: false,
      connectedAccountId: null,
      isConfigured: isComposioConfigured,
    }),
  );

  if (!isComposioConfigured) {
    return defaults;
  }

  const { session } = await createScopedComposioSessionForUser(userId);
  const toolkits = await session.toolkits();
  const toolkitBySlug = new Map(
    toolkits.items.map((toolkit) => [toolkit.slug, toolkit]),
  );

  return defaults.map((integration) => {
    const toolkit = toolkitBySlug.get(integration.id);

    return {
      ...integration,
      connected: toolkit?.connection?.isActive ?? false,
      connectedAccountId: toolkit?.connection?.connectedAccount?.id ?? null,
    };
  });
}
