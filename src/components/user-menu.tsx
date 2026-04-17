"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { Puzzle, LogOut, Settings } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserMenuProps {
  email: string;
  image?: string | null;
  name?: string | null;
}

function getInitials(name?: string | null, email?: string) {
  if (name) {
    const parts = name.trim().split(/\s+/).slice(0, 2);
    const initials = parts.map((part) => part[0]?.toUpperCase()).join("");

    if (initials) {
      return initials;
    }
  }

  return email?.[0]?.toUpperCase() ?? "U";
}

export function UserMenu({ email, image, name }: UserMenuProps) {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    if (isSigningOut) {
      return;
    }

    setIsSigningOut(true);

    const { error } = await authClient.signOut();

    setIsSigningOut(false);

    if (!error) {
      startTransition(() => {
        router.push("/sign-in");
        router.refresh();
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="cursor-pointer">
          <AvatarImage src={image ?? undefined} alt={name ?? email} />
          <AvatarFallback>{getInitials(name, email)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8}>
        <DropdownMenuItem
          onClick={() => {
            startTransition(() => {
              router.push("/integrations");
            });
          }}
        >
          <Puzzle className="w-4 h-4" />
          Integrations
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            startTransition(() => {
              router.push("/settings");
            });
          }}
        >
          <Settings className="w-4 h-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={isSigningOut}
          onClick={(event) => {
            event.preventDefault();
            void handleSignOut();
          }}
        >
          <LogOut className="w-4 h-4" />
          {isSigningOut ? "Signing out..." : "Sign out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
