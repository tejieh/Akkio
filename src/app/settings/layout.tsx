import { Metadata } from "next";
import Link from "next/link";
import { 
  User, 
  Settings, 
  CreditCard, 
  Bell, 
  Key, 
  Monitor,
  ArrowLeft
} from "lucide-react";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your account settings and preferences.",
};

const sidebarNavItems = [
  {
    title: "Profile",
    href: "/settings",
    icon: <User className="w-4 h-4 mr-2" />,
  },
  {
    title: "Account",
    href: "/settings/account",
    icon: <Settings className="w-4 h-4 mr-2" />,
  },
  {
    title: "Appearance",
    href: "/settings/appearance",
    icon: <Monitor className="w-4 h-4 mr-2" />,
  },
  {
    title: "Notifications",
    href: "/settings/notifications",
    icon: <Bell className="w-4 h-4 mr-2" />,
  },
  {
    title: "Billing",
    href: "/settings/billing",
    icon: <CreditCard className="w-4 h-4 mr-2" />,
  },
  {
    title: "API Keys",
    href: "/settings/keys",
    icon: <Key className="w-4 h-4 mr-2" />,
  },
];

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <div className="hidden border-r bg-muted/20 md:block w-64 lg:w-72 shrink-0">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/chat" className="flex items-center gap-2 font-semibold hover:text-primary transition-colors text-sm">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Chat</span>
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4 gap-1">
              <div className="px-3 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-2 mb-1">
                Personal Settings
              </div>
              {sidebarNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted font-medium"
                >
                  {item.icon}
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col flex-1 w-full overflow-hidden bg-background">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/20 px-4 lg:h-[60px] lg:px-6 md:hidden">
          <Link href="/chat" className="flex items-center gap-2 font-semibold text-sm">
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Link>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12">
          <div className="mx-auto max-w-4xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}