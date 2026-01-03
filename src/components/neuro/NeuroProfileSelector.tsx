import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNeuroProfile, NeuroProfile, NEURO_PROFILE_INFO } from "@/hooks/use-neuro-profile";
import { Accessibility, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function NeuroProfileSelector() {
  const { profile, setProfile } = useNeuroProfile();
  const currentProfile = NEURO_PROFILE_INFO[profile];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 h-9">
          <Accessibility className="h-4 w-4" />
          <span className="hidden sm:inline">{currentProfile.shortLabel}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Accessibility Profile</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {(Object.keys(NEURO_PROFILE_INFO) as NeuroProfile[]).map((p) => {
          const info = NEURO_PROFILE_INFO[p];
          const isActive = profile === p;
          
          return (
            <DropdownMenuItem
              key={p}
              onClick={() => setProfile(p)}
              className={cn(
                "flex items-start gap-3 py-2.5 cursor-pointer",
                isActive && "bg-muted"
              )}
            >
              <span className="text-lg mt-0.5">{info.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{info.label}</span>
                  {isActive && <Check className="h-4 w-4 text-primary" />}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {info.description}
                </p>
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
