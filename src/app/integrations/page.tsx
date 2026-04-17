import { Mail, GitBranch, Calendar, FileText, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { requireServerSession } from "@/lib/auth-session";

export const metadata = {
  title: "Integrations",
  description: "Manage your integrations.",
};

const INTEGRATIONS = [
  {
    id: "gmail",
    name: "Gmail",
    description: "Sync your emails and manage communication.",
    icon: Mail,
    connected: true, // Example connected state
  },
  {
    id: "github",
    name: "GitHub",
    description: "Track issues, pull requests, and repositories.",
    icon: GitBranch,
    connected: false, // Example disconnected state
  },
  {
    id: "gcal",
    name: "Google Calendar",
    description: "Sync your calendar events and schedule meetings.",
    icon: Calendar,
    connected: true,
  },
  {
    id: "notion",
    name: "Notion",
    description: "Manage your workspace and documents.",
    icon: FileText,
    connected: false,
  }
];

export default async function IntegrationsPage() {
  await requireServerSession();

  return (
    <div className="container mx-auto px-4 py-10 max-w-7xl">
      <div className="space-y-6 pb-16 pt-8">
        <div>
          <h3 className="text-2xl font-medium tracking-tight">Integrations</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your connected applications and services.
          </p>
        </div>
        <Separator />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {INTEGRATIONS.map((integration) => {
            const Icon = integration.icon;
            return (
              <div 
                key={integration.id}
                className="bg-card text-card-foreground p-6 rounded-xl border flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                      <Icon className="w-6 h-6" strokeWidth={1.5} />
                    </div>
                    {integration.connected && (
                      <span className="flex items-center text-xs font-medium text-emerald-700 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-400 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                        <Check className="w-3 h-3 mr-1" />
                        Connected
                      </span>
                    )}
                  </div>
                  <h4 className="text-lg font-medium mb-1">{integration.name}</h4>
                  <p className="text-sm text-muted-foreground mb-6">
                    {integration.description}
                  </p>
                </div>
                
                <div className="flex">
                  <Button 
                    variant={integration.connected ? "outline" : "default"}
                    className="w-full"
                  >
                    {integration.connected ? "Disconnect" : "Connect"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
