import { useState } from "react";
import { Shield, AlertTriangle, CheckCircle, TrendingDown, DollarSign, Clock, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSSDITracking, useCreateSSDITracking, generateSSDIAlerts, calculateSGARisk } from "@/hooks/use-ssdi-tracking";
import { cn } from "@/lib/utils";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const SGA_LIMIT_2026 = 1620;

export function SSDIProtectionDashboard() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const { data: tracking = [], isLoading } = useSSDITracking(selectedYear);
  const createTracking = useCreateSSDITracking();

  const alerts = generateSSDIAlerts(tracking);
  const twpMonthsUsed = tracking.filter(t => t.is_twp_month).length;
  const totalPassiveIncome = tracking.reduce((sum, t) => sum + t.passive_income + t.k1_distributions + t.rental_income, 0);
  const totalEarnedIncome = tracking.reduce((sum, t) => sum + t.earned_income, 0);
  const highRiskMonths = tracking.filter(t => t.sga_risk_level === 'high').length;

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-500 bg-red-500/10';
      case 'medium': return 'text-yellow-500 bg-yellow-500/10';
      default: return 'text-emerald-500 bg-emerald-500/10';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with SSDI Protection Status */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            SSDI Protection Dashboard
          </h2>
          <p className="text-muted-foreground mt-1">
            Monitor your passive income status and SGA risk
          </p>
        </div>
        <Select value={selectedYear.toString()} onValueChange={(v) => setSelectedYear(parseInt(v))}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[currentYear - 1, currentYear, currentYear + 1].map(year => (
              <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Alerts */}
      {alerts.map((alert, i) => (
        <Alert 
          key={i} 
          variant={alert.type === 'danger' ? 'destructive' : 'default'}
          className={cn(
            alert.type === 'warning' && "border-yellow-500/50 bg-yellow-500/5",
            alert.type === 'info' && "border-emerald-500/50 bg-emerald-500/5"
          )}
        >
          {alert.type === 'danger' && <AlertTriangle className="h-4 w-4" />}
          {alert.type === 'warning' && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
          {alert.type === 'info' && <CheckCircle className="h-4 w-4 text-emerald-500" />}
          <AlertTitle>{alert.title}</AlertTitle>
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      ))}

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingDown className="h-4 w-4" />
              Passive Income
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">
              ${totalPassiveIncome.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Does NOT count toward SGA
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Earned Income
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={cn(
              "text-2xl font-bold",
              totalEarnedIncome >= SGA_LIMIT_2026 ? "text-red-500" : "text-foreground"
            )}>
              ${totalEarnedIncome.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              SGA Limit: ${SGA_LIMIT_2026}/mo
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              TWP Months Used
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {twpMonthsUsed}/9
            </div>
            <Progress value={(twpMonthsUsed / 9) * 100} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              High Risk Months
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={cn(
              "text-2xl font-bold",
              highRiskMonths > 0 ? "text-red-500" : "text-emerald-500"
            )}>
              {highRiskMonths}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {highRiskMonths === 0 ? "All clear!" : "Review immediately"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly SGA Risk Assessment</CardTitle>
          <CardDescription>
            Track your participation level to maintain passive investor status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-4 lg:grid-cols-6">
            {MONTHS.map((month, index) => {
              const monthData = tracking.find(t => t.month === index + 1);
              const riskLevel = monthData?.sga_risk_level || 'low';
              
              return (
                <div 
                  key={month}
                  className={cn(
                    "p-3 rounded-lg border text-center cursor-pointer hover:border-primary/50 transition-colors",
                    getRiskColor(riskLevel)
                  )}
                >
                  <div className="text-xs font-medium">{month.slice(0, 3)}</div>
                  <Badge 
                    variant="outline" 
                    className={cn("mt-1 text-xs", getRiskColor(riskLevel))}
                  >
                    {riskLevel}
                  </Badge>
                  {monthData && (
                    <div className="text-xs mt-1 text-muted-foreground">
                      {monthData.hours_worked}h
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Passive Role Documentation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Passive Role Documentation
          </CardTitle>
          <CardDescription>
            Your documented passive member status for SSDI protection
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
              <h4 className="font-medium text-emerald-400 mb-2">✓ What You CAN Do (Passive)</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Be named Vine Voice (personal account)</li>
                <li>• Receive K-1 distributions</li>
                <li>• Review annual financial statements</li>
                <li>• Vote on fundamental changes only</li>
                <li>• Maintain capital account</li>
              </ul>
            </div>
            
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
              <h4 className="font-medium text-red-400 mb-2">✗ What You CANNOT Do</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Order products or manage inventory</li>
                <li>• Write reviews or test products</li>
                <li>• Make management decisions</li>
                <li>• Handle customer service</li>
                <li>• Access bank accounts for transactions</li>
              </ul>
            </div>
          </div>

          <Alert className="border-primary/50 bg-primary/5">
            <Shield className="h-4 w-4" />
            <AlertTitle>SSDI Protection Active</AlertTitle>
            <AlertDescription>
              Your Operating Agreement explicitly documents your passive investor role. 
              All income received is classified as passive investment income, NOT earned income subject to SGA limits.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
