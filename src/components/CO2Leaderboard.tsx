import { useCO2Leaderboard, useCurrentUserRank } from "@/hooks/use-co2-leaderboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trophy, Medal, Award, Leaf, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Trophy className="h-5 w-5 text-yellow-500" />;
    case 2:
      return <Medal className="h-5 w-5 text-slate-400" />;
    case 3:
      return <Medal className="h-5 w-5 text-amber-600" />;
    default:
      return <span className="text-muted-foreground font-medium">{rank}</span>;
  }
};

const getRankBgClass = (rank: number) => {
  switch (rank) {
    case 1:
      return "bg-yellow-500/10 border-yellow-500/30";
    case 2:
      return "bg-slate-400/10 border-slate-400/30";
    case 3:
      return "bg-amber-600/10 border-amber-600/30";
    default:
      return "";
  }
};

export function CO2Leaderboard() {
  const { leaderboard, isLoading } = useCO2Leaderboard();
  const { data: currentUserRank } = useCurrentUserRank();

  if (isLoading) {
    return (
      <Card className="border-primary/20 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5 text-primary" />
            CO₂ Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (leaderboard.length === 0) {
    return (
      <Card className="border-primary/20 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5 text-primary" />
            CO₂ Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Leaf className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>No gardeners yet!</p>
            <p className="text-sm">Complete tasks to join the leaderboard.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20 bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5 text-primary" />
            CO₂ Leaderboard
          </span>
          {currentUserRank && (
            <span className="text-sm font-normal text-muted-foreground">
              Your rank: #{currentUserRank}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-16">Rank</TableHead>
              <TableHead>Gardener</TableHead>
              <TableHead className="text-right">CO₂ Saved</TableHead>
              <TableHead className="text-right hidden sm:table-cell">Tasks</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaderboard.map((entry) => (
              <TableRow
                key={entry.id}
                className={cn(
                  "transition-colors",
                  entry.rank && entry.rank <= 3 && getRankBgClass(entry.rank)
                )}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center justify-center w-8 h-8">
                    {getRankIcon(entry.rank || 0)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <Leaf className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-medium truncate max-w-[120px] sm:max-w-[200px]">
                      {entry.display_name || "Anonymous Gardener"}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {entry.total_co2_saved.toFixed(1)} kg
                  </span>
                </TableCell>
                <TableCell className="text-right hidden sm:table-cell text-muted-foreground">
                  {entry.completed_tasks_count}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
