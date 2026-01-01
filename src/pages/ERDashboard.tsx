import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTravelerProfile } from '@/hooks/use-traveler-profile';
import { TERRITORIES } from '@/lib/emerald-road-data';
import { ERNavbar } from '@/components/emerald-road/ERNavbar';
import { TerritoryCard } from '@/components/emerald-road/TerritoryCard';
import { MeterWidget } from '@/components/emerald-road/MeterWidget';
import { MentorPanel } from '@/components/emerald-road/MentorPanel';
import { SoftResetBanner } from '@/components/emerald-road/SoftResetBanner';
import { Button } from '@/components/ui/button';
import { Zap, Radio, Shield, ChevronRight, Target } from 'lucide-react';

export default function ERDashboard() {
  const navigate = useNavigate();
  const { profile, isLoading, hasProfile, getNextQuest, needsSoftReset, updateProfile } = useTravelerProfile();
  const [showResetBanner, setShowResetBanner] = useState(false);

  useEffect(() => {
    if (!isLoading && !hasProfile) {
      navigate('/onboarding');
    }
  }, [isLoading, hasProfile, navigate]);

  useEffect(() => {
    if (profile && needsSoftReset()) {
      setShowResetBanner(true);
    }
  }, [profile, needsSoftReset]);

  const handleDismissReset = () => {
    setShowResetBanner(false);
    updateProfile({ lastActiveISO: new Date().toISOString() });
  };

  if (isLoading || !profile) {
    return (
      <div className="min-h-screen bg-night-emerald flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-gold/30 border-t-emerald-gold rounded-full animate-spin" />
      </div>
    );
  }

  const nextQuest = getNextQuest();
  const nextQuestTerritory = nextQuest ? TERRITORIES.find(t => t.id === nextQuest.territory) : null;

  return (
    <div className="min-h-screen bg-night-emerald">
      <ERNavbar />
      
      <main className="container mx-auto px-4 py-6">
        {/* Welcome */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-clean-white mb-1">
            Welcome back, {profile.name}.
          </h1>
          <p className="text-moon-silver/70">
            Your road continues. One node at a time.
          </p>
        </div>

        {/* Soft Reset Banner */}
        {showResetBanner && <SoftResetBanner onDismiss={handleDismissReset} />}

        {/* Main Grid */}
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left: Territories */}
          <div className="lg:col-span-4 space-y-4">
            <h2 className="text-sm font-medium text-moon-silver/60 uppercase tracking-wider mb-3">
              Territories
            </h2>
            {TERRITORIES.map((territory) => {
              const completedQuests = territory.quests.filter(
                q => profile.completedQuestIds.includes(q.id)
              ).length;
              const isUnlocked = profile.territoryUnlocked[territory.unlockKey];
              const isActive = nextQuest?.territory === territory.id;
              
              return (
                <TerritoryCard
                  key={territory.id}
                  territory={territory}
                  isUnlocked={isUnlocked}
                  completedQuests={completedQuests}
                  isActive={isActive}
                />
              );
            })}
          </div>

          {/* Center: Current Node */}
          <div className="lg:col-span-5 space-y-4">
            <h2 className="text-sm font-medium text-moon-silver/60 uppercase tracking-wider mb-3">
              Today's Focus
            </h2>
            
            {nextQuest ? (
              <div className="p-6 rounded-xl bg-dark-emerald border border-emerald-gold/30">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-gold/20 flex items-center justify-center flex-shrink-0">
                    <Target className="w-6 h-6 text-emerald-gold" />
                  </div>
                  <div>
                    <p className="text-xs text-emerald-gold font-medium">
                      {nextQuestTerritory?.name} — {nextQuest.nodeName}
                    </p>
                    <h3 className="text-xl font-bold text-clean-white">{nextQuest.title}</h3>
                    <p className="text-sm text-moon-silver/70 mt-1">{nextQuest.description}</p>
                  </div>
                </div>
                
                <div className="space-y-2 mb-5 pl-16">
                  <div className="flex items-center gap-2 text-sm text-moon-silver/60">
                    <span className="w-2 h-2 rounded-full bg-moon-silver/40" />
                    <span className="font-medium">Stabilize:</span>
                    <span>{nextQuest.stabilizeStep.instruction}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-moon-silver/60">
                    <span className="w-2 h-2 rounded-full bg-moon-silver/40" />
                    <span className="font-medium">Build:</span>
                    <span>{nextQuest.buildStep.instruction}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-moon-silver/60">
                    <span className="w-2 h-2 rounded-full bg-moon-silver/40" />
                    <span className="font-medium">Expand:</span>
                    <span>{nextQuest.expandStep.instruction}</span>
                  </div>
                </div>
                
                <Button
                  onClick={() => navigate(`/quest/${nextQuest.id}`)}
                  className="w-full bg-emerald-gold hover:bg-emerald-gold/90 text-night-emerald font-bold h-12"
                >
                  Start This Node
                  <ChevronRight className="w-5 h-5 ml-1" />
                </Button>
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-dark-emerald border border-moon-silver/20 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-gold/20 flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-emerald-gold" />
                </div>
                <h3 className="text-xl font-bold text-clean-white mb-2">All nodes complete.</h3>
                <p className="text-moon-silver/70">
                  You've completed all available territories. More systems are coming soon.
                </p>
              </div>
            )}

            {/* Mentor Panel */}
            <MentorPanel />
          </div>

          {/* Right: Meters */}
          <div className="lg:col-span-3 space-y-4">
            <h2 className="text-sm font-medium text-moon-silver/60 uppercase tracking-wider mb-3">
              System Status
            </h2>
            
            <MeterWidget
              label="Energy"
              value={profile.energy}
              icon={<Zap className="w-4 h-4" />}
            />
            
            <MeterWidget
              label="Signal"
              value={profile.signal}
              icon={<Radio className="w-4 h-4" />}
            />
            
            <MeterWidget
              label="Control"
              value={profile.control}
              icon={<Shield className="w-4 h-4" />}
            />

            {/* Status card */}
            <div className="p-4 rounded-xl bg-dark-emerald border border-moon-silver/10">
              <p className="text-xs text-moon-silver/50 mb-1">Current State</p>
              <p className="text-sm font-medium text-clean-white capitalize">{profile.currentState}</p>
            </div>
            
            <div className="p-4 rounded-xl bg-dark-emerald border border-moon-silver/10">
              <p className="text-xs text-moon-silver/50 mb-1">Quests Completed</p>
              <p className="text-sm font-medium text-clean-white">{profile.completedQuestIds.length}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
