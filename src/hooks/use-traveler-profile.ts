import { useState, useEffect, useCallback } from 'react';
import { TravelerProfile, TravelerState, Pace } from '@/types/emerald-road';
import { TERRITORIES, getQuest, getTerritoryQuests } from '@/lib/emerald-road-data';

const STORAGE_KEY = 'emerald-road-traveler-profile';

const createDefaultProfile = (): TravelerProfile => ({
  id: crypto.randomUUID(),
  name: '',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  currentState: 'foggy',
  pace: 'standard',
  energy: 30,
  signal: 30,
  control: 30,
  territoryUnlocked: {
    crossing: true,
    engineFields: false,
    ledgerDistrict: false,
    hearthlands: false,
    signalTowers: false,
  },
  completedQuestIds: [],
  completedSteps: {},
  lastActiveISO: new Date().toISOString(),
  createdAt: new Date().toISOString(),
});

export function useTravelerProfile() {
  const [profile, setProfile] = useState<TravelerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load profile from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as TravelerProfile;
        setProfile(parsed);
      }
    } catch (error) {
      console.error('Failed to load traveler profile:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save profile to localStorage whenever it changes
  const saveProfile = useCallback((newProfile: TravelerProfile) => {
    const updated = { ...newProfile, lastActiveISO: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setProfile(updated);
  }, []);

  // Initialize a new profile
  const initializeProfile = useCallback((name: string, currentState: TravelerState, pace: Pace) => {
    const newProfile = createDefaultProfile();
    newProfile.name = name;
    newProfile.currentState = currentState;
    newProfile.pace = pace;
    saveProfile(newProfile);
    return newProfile;
  }, [saveProfile]);

  // Update profile fields
  const updateProfile = useCallback((updates: Partial<TravelerProfile>) => {
    if (!profile) return;
    saveProfile({ ...profile, ...updates });
  }, [profile, saveProfile]);

  // Complete a quest step
  const completeStep = useCallback((questId: string, stepId: string) => {
    if (!profile) return;
    
    const completedSteps = { ...profile.completedSteps };
    if (!completedSteps[questId]) {
      completedSteps[questId] = [];
    }
    if (!completedSteps[questId].includes(stepId)) {
      completedSteps[questId].push(stepId);
    }
    
    saveProfile({ ...profile, completedSteps });
  }, [profile, saveProfile]);

  // Complete a quest and apply rewards
  const completeQuest = useCallback((questId: string) => {
    if (!profile) return null;
    
    const quest = getQuest(questId);
    if (!quest) return null;
    
    // Add to completed quests
    const completedQuestIds = [...profile.completedQuestIds];
    if (!completedQuestIds.includes(questId)) {
      completedQuestIds.push(questId);
    }
    
    // Apply reward
    const updates: Partial<TravelerProfile> = { completedQuestIds };
    const metricKey = quest.reward.metric as keyof Pick<TravelerProfile, 'energy' | 'signal' | 'control'>;
    updates[metricKey] = Math.min(100, profile[metricKey] + quest.reward.amount);
    
    // Check for territory unlock
    let unlockedTerritory: string | null = null;
    
    // Check if all quests in the territory are complete
    const territoryQuests = getTerritoryQuests(quest.territory);
    const allTerritoryQuestsComplete = territoryQuests.every(
      q => completedQuestIds.includes(q.id)
    );
    
    if (allTerritoryQuestsComplete) {
      // Find next territory to unlock
      const currentTerritoryIndex = TERRITORIES.findIndex(t => t.id === quest.territory);
      const nextTerritory = TERRITORIES[currentTerritoryIndex + 1];
      
      if (nextTerritory && !profile.territoryUnlocked[nextTerritory.unlockKey]) {
        updates.territoryUnlocked = {
          ...profile.territoryUnlocked,
          [nextTerritory.unlockKey]: true,
        };
        unlockedTerritory = nextTerritory.id;
      }
    }
    
    saveProfile({ ...profile, ...updates });
    return { reward: quest.reward, unlockedTerritory };
  }, [profile, saveProfile]);

  // Get next recommended quest
  const getNextQuest = useCallback(() => {
    if (!profile) return null;
    
    for (const territory of TERRITORIES) {
      if (!profile.territoryUnlocked[territory.unlockKey]) continue;
      if (territory.comingSoon) continue;
      
      for (const quest of territory.quests) {
        if (!profile.completedQuestIds.includes(quest.id)) {
          return quest;
        }
      }
    }
    return null;
  }, [profile]);

  // Check if profile needs soft reset (inactive > 48 hours)
  const needsSoftReset = useCallback(() => {
    if (!profile) return false;
    const lastActive = new Date(profile.lastActiveISO);
    const hoursSinceActive = (Date.now() - lastActive.getTime()) / (1000 * 60 * 60);
    return hoursSinceActive > 48;
  }, [profile]);

  // Reset progress
  const resetProgress = useCallback(() => {
    if (!profile) return;
    saveProfile({
      ...profile,
      energy: 30,
      signal: 30,
      control: 30,
      territoryUnlocked: {
        crossing: true,
        engineFields: false,
        ledgerDistrict: false,
        hearthlands: false,
        signalTowers: false,
      },
      completedQuestIds: [],
      completedSteps: {},
    });
  }, [profile, saveProfile]);

  // Check if a quest is complete
  const isQuestComplete = useCallback((questId: string) => {
    return profile?.completedQuestIds.includes(questId) ?? false;
  }, [profile]);

  // Check if a step is complete
  const isStepComplete = useCallback((questId: string, stepId: string) => {
    return profile?.completedSteps[questId]?.includes(stepId) ?? false;
  }, [profile]);

  // Check if territory is unlocked
  const isTerritoryUnlocked = useCallback((territoryId: string) => {
    const territory = TERRITORIES.find(t => t.id === territoryId);
    if (!territory || !profile) return false;
    return profile.territoryUnlocked[territory.unlockKey];
  }, [profile]);

  // Export profile as JSON
  const exportProfile = useCallback(() => {
    if (!profile) return '';
    return JSON.stringify(profile, null, 2);
  }, [profile]);

  // Import profile from JSON
  const importProfile = useCallback((json: string) => {
    try {
      const imported = JSON.parse(json) as TravelerProfile;
      saveProfile(imported);
      return true;
    } catch {
      return false;
    }
  }, [saveProfile]);

  return {
    profile,
    isLoading,
    hasProfile: !!profile,
    initializeProfile,
    updateProfile,
    completeStep,
    completeQuest,
    getNextQuest,
    needsSoftReset,
    resetProgress,
    isQuestComplete,
    isStepComplete,
    isTerritoryUnlocked,
    exportProfile,
    importProfile,
  };
}
