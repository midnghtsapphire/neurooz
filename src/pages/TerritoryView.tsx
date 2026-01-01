import { useParams, useNavigate } from 'react-router-dom';
import { useTravelerProfile } from '@/hooks/use-traveler-profile';
import { getTerritory } from '@/lib/emerald-road-data';
import { ERNavbar } from '@/components/emerald-road/ERNavbar';
import { QuestCard } from '@/components/emerald-road/QuestCard';
import { MapPin, Lock } from 'lucide-react';
import { useEffect } from 'react';

export default function TerritoryView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profile, isLoading, hasProfile, isTerritoryUnlocked, isQuestComplete } = useTravelerProfile();

  const territory = id ? getTerritory(id) : null;

  useEffect(() => {
    if (!isLoading && !hasProfile) {
      navigate('/onboarding');
    }
  }, [isLoading, hasProfile, navigate]);

  if (isLoading || !profile) {
    return (
      <div className="min-h-screen bg-night-emerald flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-gold/30 border-t-emerald-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (!territory) {
    return (
      <div className="min-h-screen bg-night-emerald">
        <ERNavbar showBack backTo="/dashboard" backLabel="Dashboard" />
        <main className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-clean-white">Territory not found.</h1>
        </main>
      </div>
    );
  }

  const isUnlocked = isTerritoryUnlocked(territory.id);

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-night-emerald">
        <ERNavbar showBack backTo="/dashboard" backLabel="Dashboard" />
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto text-center">
            <div className="w-16 h-16 rounded-full bg-moon-silver/10 flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8 text-moon-silver/50" />
            </div>
            <h1 className="text-2xl font-bold text-clean-white mb-2">{territory.name}</h1>
            <p className="text-moon-silver/70">
              This territory is locked. Complete the previous territory to unlock it.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-night-emerald">
      <ERNavbar showBack backTo="/dashboard" backLabel="Dashboard" />
      
      <main className="container mx-auto px-4 py-6">
        {/* Territory Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-emerald-gold/20 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-emerald-gold" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-clean-white">{territory.name}</h1>
              <p className="text-sm text-emerald-gold font-medium">{territory.theme}</p>
            </div>
          </div>
          <p className="text-moon-silver/70 max-w-2xl">{territory.description}</p>
        </div>

        {/* Coming Soon */}
        {territory.comingSoon && (
          <div className="p-6 rounded-xl bg-dark-emerald border border-warning-amber/30 text-center">
            <p className="text-warning-amber font-medium">This territory is coming soon.</p>
            <p className="text-moon-silver/60 text-sm mt-1">New nodes are being developed.</p>
          </div>
        )}

        {/* Quest List */}
        {!territory.comingSoon && (
          <div className="space-y-4">
            <h2 className="text-sm font-medium text-moon-silver/60 uppercase tracking-wider">
              Nodes ({territory.quests.filter(q => isQuestComplete(q.id)).length}/{territory.quests.length} complete)
            </h2>
            
            {territory.quests.map((quest) => {
              const isComplete = isQuestComplete(quest.id);
              const completedSteps = profile.completedSteps[quest.id] || [];
              
              return (
                <QuestCard
                  key={quest.id}
                  quest={quest}
                  isComplete={isComplete}
                  completedSteps={completedSteps}
                />
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
