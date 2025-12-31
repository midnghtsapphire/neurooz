import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Server, FlaskConical, TestTube, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

export type Environment = "sandbox" | "dev" | "test" | "live";

interface EnvironmentSelectorProps {
  value: Environment;
  onChange: (env: Environment) => void;
}

const environments: { value: Environment; label: string; icon: React.ElementType; color: string }[] = [
  { value: "sandbox", label: "Sandbox", icon: FlaskConical, color: "bg-purple-500" },
  { value: "dev", label: "Dev", icon: Server, color: "bg-blue-500" },
  { value: "test", label: "Test", icon: TestTube, color: "bg-amber-500" },
  { value: "live", label: "Live", icon: Globe, color: "bg-green-500" },
];

export function EnvironmentSelector({ value, onChange }: EnvironmentSelectorProps) {
  const currentEnv = environments.find((e) => e.value === value) || environments[0];
  const Icon = currentEnv.icon;

  return (
    <Select value={value} onValueChange={(v) => onChange(v as Environment)}>
      <SelectTrigger className="w-[140px] h-9">
        <SelectValue>
          <div className="flex items-center gap-2">
            <div className={cn("w-2 h-2 rounded-full", currentEnv.color)} />
            <span>{currentEnv.label}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-popover">
        {environments.map((env) => {
          const EnvIcon = env.icon;
          return (
            <SelectItem key={env.value} value={env.value}>
              <div className="flex items-center gap-2">
                <div className={cn("w-2 h-2 rounded-full", env.color)} />
                <EnvIcon className="h-4 w-4" />
                <span>{env.label}</span>
                {env.value === "live" && (
                  <Badge variant="outline" className="ml-1 text-[10px] px-1 py-0">
                    PROD
                  </Badge>
                )}
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}

export function EnvironmentBadge({ environment }: { environment: Environment }) {
  const env = environments.find((e) => e.value === environment) || environments[0];
  
  return (
    <Badge 
      variant="outline" 
      className={cn(
        "gap-1 font-medium",
        environment === "live" && "border-green-500 text-green-700 bg-green-50",
        environment === "test" && "border-amber-500 text-amber-700 bg-amber-50",
        environment === "dev" && "border-blue-500 text-blue-700 bg-blue-50",
        environment === "sandbox" && "border-purple-500 text-purple-700 bg-purple-50"
      )}
    >
      <div className={cn("w-1.5 h-1.5 rounded-full", env.color)} />
      {env.label}
    </Badge>
  );
}
