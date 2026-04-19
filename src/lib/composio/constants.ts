export const composioIntegrationIds = [
  "gmail",
  "github",
  "googlecalendar",
  "notion",
] as const;

export type ComposioIntegrationId = (typeof composioIntegrationIds)[number];

export const composioIntegrationDetails: Record<
  ComposioIntegrationId,
  {
    description: string;
    name: string;
  }
> = {
  gmail: {
    name: "Gmail",
    description: "Sync your emails and manage communication.",
  },
  github: {
    name: "GitHub",
    description: "Track issues, pull requests, and repositories.",
  },
  googlecalendar: {
    name: "Google Calendar",
    description: "Sync your calendar events and schedule meetings.",
  },
  notion: {
    name: "Notion",
    description: "Manage your workspace and documents.",
  },
};

export type ComposioIntegrationState = {
  connected: boolean;
  connectedAccountId: string | null;
  description: string;
  id: ComposioIntegrationId;
  isConfigured: boolean;
  name: string;
};
