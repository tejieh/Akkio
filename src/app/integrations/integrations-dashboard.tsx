"use client";

import {
  AlertCircle,
  Calendar,
  Check,
  FileText,
  GitBranch,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ComposioIntegrationState } from "@/lib/composio/constants";
import { useComposioIntegrationActions } from "@/lib/composio/use-integration-actions";

type IntegrationsDashboardProps = {
  callbackMessage: string | null;
  integrations: ComposioIntegrationState[];
};

const integrationIcons = {
  gmail: Mail,
  github: GitBranch,
  googlecalendar: Calendar,
  notion: FileText,
} as const;

export function IntegrationsDashboard({
  callbackMessage,
  integrations,
}: IntegrationsDashboardProps) {
  const { connect, disconnect, error, isPending, pendingAction } =
    useComposioIntegrationActions();

  return (
    <div className="space-y-6 pb-16 pt-8">
      <div>
        <h3 className="text-2xl font-medium tracking-tight">Integrations</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your connected applications and services.
        </p>
      </div>

      {callbackMessage ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          {callbackMessage}
        </div>
      ) : null}

      {error ? (
        <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <p>{error}</p>
        </div>
      ) : null}

      {!integrations.every((integration) => integration.isConfigured) ? (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <p>
            Composio is not configured yet. Set `COMPOSIO_API_KEY` before using
            these connection controls.
          </p>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {integrations.map((integration) => {
          const Icon = integrationIcons[integration.id];
          const isWorkingOnThisCard =
            pendingAction?.integrationId === integration.id;

          return (
            <div
              key={integration.id}
              className="flex flex-col justify-between rounded-xl border bg-card p-6 text-card-foreground"
            >
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
                    <Icon className="h-6 w-6" strokeWidth={1.5} />
                  </div>
                  {integration.connected ? (
                    <span className="flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                      <Check className="mr-1 h-3 w-3" />
                      Connected
                    </span>
                  ) : null}
                </div>
                <h4 className="mb-1 text-lg font-medium">{integration.name}</h4>
                <p className="mb-2 text-sm text-muted-foreground">
                  {integration.description}
                </p>
                {integration.connectedAccountId ? (
                  <p className="truncate text-xs text-muted-foreground/80">
                    Account: {integration.connectedAccountId}
                  </p>
                ) : null}
              </div>

              <div className="mt-6 flex">
                <Button
                  variant={integration.connected ? "outline" : "default"}
                  className="w-full"
                  disabled={!integration.isConfigured || isPending}
                  onClick={() => {
                    const action = integration.connected ? disconnect : connect;
                    void action(integration.id);
                  }}
                >
                  {isWorkingOnThisCard
                    ? pendingAction?.mutation === "disconnect"
                      ? "Disconnecting..."
                      : "Redirecting..."
                    : integration.connected
                      ? "Disconnect"
                      : "Connect"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
