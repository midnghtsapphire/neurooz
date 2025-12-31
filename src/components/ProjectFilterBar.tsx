import { useState } from "react";
import { Project } from "@/hooks/use-projects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Filter, X, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export interface ProjectFilters {
  search: string;
  assignedTo: string;
  status: "all" | "active" | "completed";
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
  projectId: string;
}

interface ProjectFilterBarProps {
  filters: ProjectFilters;
  onFiltersChange: (filters: ProjectFilters) => void;
  projects: Project[];
  assignees: string[];
}

export function ProjectFilterBar({ 
  filters, 
  onFiltersChange, 
  projects, 
  assignees 
}: ProjectFilterBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilter = <K extends keyof ProjectFilters>(key: K, value: ProjectFilters[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: "",
      assignedTo: "",
      status: "all",
      dateFrom: undefined,
      dateTo: undefined,
      projectId: "",
    });
  };

  const hasActiveFilters = 
    filters.search || 
    filters.assignedTo || 
    filters.status !== "all" || 
    filters.dateFrom || 
    filters.dateTo ||
    filters.projectId;

  return (
    <div className="bg-card border rounded-lg p-4 mb-6 space-y-4">
      {/* Quick Search Row */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="Search projects and items..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="w-full"
          />
        </div>
        
        <Button
          variant={isExpanded ? "secondary" : "outline"}
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <span className="bg-primary text-primary-foreground rounded-full px-1.5 py-0.5 text-xs">
              !
            </span>
          )}
        </Button>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1 text-muted-foreground">
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
          {/* Project Filter */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Project</Label>
            <Select 
              value={filters.projectId} 
              onValueChange={(val) => updateFilter("projectId", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All projects" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="">All projects</SelectItem>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: p.color }} 
                      />
                      {p.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Assigned To Filter */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Assigned To</Label>
            <Select 
              value={filters.assignedTo} 
              onValueChange={(val) => updateFilter("assignedTo", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Anyone" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="">Anyone</SelectItem>
                {assignees.map((a) => (
                  <SelectItem key={a} value={a}>{a}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Status</Label>
            <Select 
              value={filters.status} 
              onValueChange={(val) => updateFilter("status", val as ProjectFilters["status"])}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Date Range</Label>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "flex-1 justify-start text-left font-normal",
                      !filters.dateFrom && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-3 w-3" />
                    {filters.dateFrom ? format(filters.dateFrom, "MM/dd") : "From"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-popover" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.dateFrom}
                    onSelect={(date) => updateFilter("dateFrom", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "flex-1 justify-start text-left font-normal",
                      !filters.dateTo && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-3 w-3" />
                    {filters.dateTo ? format(filters.dateTo, "MM/dd") : "To"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-popover" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.dateTo}
                    onSelect={(date) => updateFilter("dateTo", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
