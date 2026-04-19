import type { Metadata } from "next";
import { Separator } from "@/components/ui/separator";
import { FloatingAssistant } from "@/components/assistant-ui/floating-chat";
import { composioIntegrationDetails } from "@/lib/composio/constants";
import { requireServerSession } from "@/lib/auth-session";
import { listComposioIntegrationStatesForUser } from "@/lib/composio/server";
import { IntegrationsDashboard } from "@/app/integrations/integrations-dashboard";

export const metadata: Metadata = {
  title: "Integrations",
  description: "Manage your integrations.",
};

function getCallbackMessage(searchParams: {
  integration?: string;
  status?: string;
}) {
  if (
    !searchParams.integration ||
    !(searchParams.integration in composioIntegrationDetails)
  ) {
    return null;
  }

  const integration =
    composioIntegrationDetails[
      searchParams.integration as keyof typeof composioIntegrationDetails
    ];

  if (searchParams.status === "success") {
    return `${integration.name} connected successfully.`;
  }

  if (searchParams.status === "failed") {
    return `${integration.name} could not be connected.`;
  }

  return null;
}

export default async function IntegrationsPage({
  searchParams,
}: {
  searchParams: Promise<{
    integration?: string;
    status?: string;
  }>;
}) {
  const session = await requireServerSession();
  const resolvedSearchParams = await searchParams;
  const integrations = await listComposioIntegrationStatesForUser(
    session.user.id,
  );

  return (
    <>
      <div className="container mx-auto max-w-7xl px-4 py-10">
        <Separator />
        <IntegrationsDashboard
          integrations={integrations}
          callbackMessage={getCallbackMessage(resolvedSearchParams)}
        />
      </div>
      <FloatingAssistant />
    </>
  );
}
