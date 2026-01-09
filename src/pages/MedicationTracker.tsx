import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Heart, Clock, TrendingDown, TrendingUp, Calendar, Plus, Check } from 'lucide-react';
import { format, subDays, parseISO } from 'date-fns';

interface MedicationLog {
  id: string;
  medication_name: string;
  dosage: string;
  taken_at: string;
  notes?: string;
}

interface SpendingCorrelation {
  date: string;
  medicated_spending: number;
  unmedicated_spending: number;
  impulse_count_medicated: number;
  impulse_count_unmedicated: number;
}

export default function MedicationTracker() {
  const [medications, setMedications] = useState<MedicationLog[]>([]);
  const [todayLogged, setTodayLogged] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMed, setNewMed] = useState({ name: '', dosage: '', time: '' });
  const [correlation, setCorrelation] = useState<SpendingCorrelation | null>(null);
  const [streak, setStreak] = useState(0);

  // Mock data for demo - in production, fetch from Supabase
  useEffect(() => {
    // Simulate loading recent medications
    const mockMeds: MedicationLog[] = [
      {
        id: '1',
        medication_name: 'Adderall XR',
        dosage: '20mg',
        taken_at: new Date().toISOString(),
        notes: 'Taken with breakfast'
      }
    ];
    setMedications(mockMeds);
    setStreak(7); // 7-day streak

    // Simulate correlation data
    const mockCorrelation: SpendingCorrelation = {
      date: format(new Date(), 'yyyy-MM-dd'),
      medicated_spending: 45.20,
      unmedicated_spending: 127.80,
      impulse_count_medicated: 1,
      impulse_count_unmedicated: 5
    };
    setCorrelation(mockCorrelation);
  }, []);

  const handleLogMedication = () => {
    if (!newMed.name || !newMed.time) return;

    const newLog: MedicationLog = {
      id: Date.now().toString(),
      medication_name: newMed.name,
      dosage: newMed.dosage,
      taken_at: new Date().toISOString(),
      notes: ''
    };

    setMedications([newLog, ...medications]);
    setTodayLogged(true);
    setShowAddForm(false);
    setNewMed({ name: '', dosage: '', time: '' });
  };

  const calculateReduction = () => {
    if (!correlation) return 0;
    const reduction = ((correlation.unmedicated_spending - correlation.medicated_spending) / correlation.unmedicated_spending) * 100;
    return Math.round(reduction);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header with Tin Man */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <img 
                src="/tin-man-pink-heart.png" 
                alt="Tin Man - Your Medication Guide"
                className="w-32 h-32 rounded-full border-4 border-pink-400 shadow-2xl object-cover"
              />
              <div className="absolute -bottom-2 -right-2 bg-pink-500 rounded-full p-2">
                <Heart className="w-6 h-6 text-white" fill="currentColor" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white">Medication Tracker</h1>
          <p className="text-purple-200 text-lg">
            Track your meds and see how they help your spending 💊
          </p>
        </div>

        {/* Quick Log Card */}
        <Card className="bg-gradient-to-br from-pink-500 to-rose-600 border-none text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-6 h-6" fill="currentColor" />
              Today's Medication
            </CardTitle>
            <CardDescription className="text-pink-100">
              {todayLogged ? "✓ Logged for today!" : "Log your medication to track patterns"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!showAddForm && !todayLogged && (
              <Button 
                onClick={() => setShowAddForm(true)}
                className="w-full bg-white text-pink-600 hover:bg-pink-50"
              >
                <Plus className="w-4 h-4 mr-2" />
                Log Medication
              </Button>
            )}

            {showAddForm && (
              <div className="space-y-4 bg-white/10 p-4 rounded-lg backdrop-blur">
                <div>
                  <Label className="text-white">Medication Name</Label>
                  <Input 
                    placeholder="e.g., Adderall XR"
                    value={newMed.name}
                    onChange={(e) => setNewMed({...newMed, name: e.target.value})}
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                  />
                </div>
                <div>
                  <Label className="text-white">Dosage (optional)</Label>
                  <Input 
                    placeholder="e.g., 20mg"
                    value={newMed.dosage}
                    onChange={(e) => setNewMed({...newMed, dosage: e.target.value})}
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                  />
                </div>
                <div>
                  <Label className="text-white">Time Taken</Label>
                  <Input 
                    type="time"
                    value={newMed.time}
                    onChange={(e) => setNewMed({...newMed, time: e.target.value})}
                    className="bg-white/20 border-white/30 text-white"
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleLogMedication}
                    className="flex-1 bg-white text-pink-600 hover:bg-pink-50"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Log It
                  </Button>
                  <Button 
                    onClick={() => setShowAddForm(false)}
                    variant="outline"
                    className="flex-1 border-white/30 text-white hover:bg-white/10"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {todayLogged && (
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur text-center">
                <Check className="w-12 h-12 mx-auto mb-2 text-white" />
                <p className="text-lg font-semibold">Great job! 🎉</p>
                <p className="text-sm text-pink-100">You've logged your medication for today</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Streak Card */}
        <Card className="bg-gradient-to-br from-amber-500 to-orange-600 border-none text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-100">Current Streak</p>
                <p className="text-4xl font-bold">{streak} days 🔥</p>
              </div>
              <Calendar className="w-16 h-16 text-white/30" />
            </div>
          </CardContent>
        </Card>

        {/* Correlation Insights */}
        {correlation && (
          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingDown className="w-6 h-6 text-emerald-400" />
                Your Medication Impact
              </CardTitle>
              <CardDescription className="text-purple-200">
                How your medication affects your spending patterns
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Main Stat */}
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 rounded-xl text-center">
                <p className="text-emerald-100 text-sm mb-2">You spend</p>
                <p className="text-5xl font-bold text-white mb-2">{calculateReduction()}%</p>
                <p className="text-emerald-100">less when medicated!</p>
              </div>

              {/* Detailed Comparison */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-emerald-500/20 p-4 rounded-lg border border-emerald-400/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="w-5 h-5 text-emerald-400" fill="currentColor" />
                    <p className="text-emerald-300 font-semibold">With Medication</p>
                  </div>
                  <p className="text-3xl font-bold text-white mb-1">
                    ${correlation.medicated_spending.toFixed(2)}
                  </p>
                  <p className="text-sm text-emerald-200">
                    {correlation.impulse_count_medicated} impulse purchase{correlation.impulse_count_medicated !== 1 ? 's' : ''}
                  </p>
                </div>

                <div className="bg-red-500/20 p-4 rounded-lg border border-red-400/30">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-red-400" />
                    <p className="text-red-300 font-semibold">Without Medication</p>
                  </div>
                  <p className="text-3xl font-bold text-white mb-1">
                    ${correlation.unmedicated_spending.toFixed(2)}
                  </p>
                  <p className="text-sm text-red-200">
                    {correlation.impulse_count_unmedicated} impulse purchase{correlation.impulse_count_unmedicated !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {/* Tin Man Insight */}
              <div className="bg-pink-500/20 p-4 rounded-lg border border-pink-400/30">
                <div className="flex gap-3">
                  <img 
                    src="/tin-man-pink-heart.png" 
                    alt="Tin Man"
                    className="w-12 h-12 rounded-full border-2 border-pink-400 object-cover flex-shrink-0"
                  />
                  <div>
                    <p className="text-pink-300 font-semibold mb-1">💝 Tin Man's Insight</p>
                    <p className="text-white text-sm">
                      Your medication is working! You make {correlation.impulse_count_unmedicated - correlation.impulse_count_medicated} fewer impulse purchases 
                      when you take your meds. Keep up the great routine! 🎯
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Logs */}
        <Card className="bg-white/10 backdrop-blur border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Clock className="w-6 h-6" />
              Recent Medication Logs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {medications.map((med) => (
                <div 
                  key={med.id}
                  className="bg-white/5 p-4 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-white font-semibold">{med.medication_name}</p>
                      {med.dosage && (
                        <p className="text-purple-300 text-sm">{med.dosage}</p>
                      )}
                      <p className="text-purple-400 text-xs mt-1">
                        {format(parseISO(med.taken_at), 'MMM d, yyyy • h:mm a')}
                      </p>
                    </div>
                    <Check className="w-5 h-5 text-emerald-400" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Educational Info */}
        <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 border-none text-white">
          <CardHeader>
            <CardTitle>Why Track Medication? 🧠</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="text-purple-100">
              <strong>For ADHD brains,</strong> medication timing significantly affects impulse control and decision-making.
            </p>
            <p className="text-purple-100">
              By tracking when you take your medication and correlating it with spending patterns, 
              you can see real data on how your treatment helps you make better financial decisions.
            </p>
            <p className="text-purple-100">
              <strong>Privacy first:</strong> Your medication data is encrypted and never shared. 
              It's only used to help YOU understand your patterns.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
