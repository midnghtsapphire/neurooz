import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Trophy, Flame, TrendingUp, Award, Sparkles } from 'lucide-react';
import { ERNavbar } from '@/components/emerald-road/ERNavbar';
import { calculateLevel, getTierEmoji, getStreakEmoji } from '@/utils/dopamineEngine';
import type { GamificationStatus, Achievement, StreakData } from '@/utils/dopamineEngine';

export default function RewardsDashboard() {
  const [gamification, setGamification] = useState<GamificationStatus>({
    totalPoints: 450,
    currentLevel: 2,
    levelName: 'Yellow Brick Walker',
    nextLevelPoints: 500,
    actionsSinceLastReward: 2,
    surpriseRewardEligible: true,
  });

  const [streaks, setStreaks] = useState({
    daily_login: { currentStreak: 7, longestStreak: 12, isNewRecord: false },
    medication: { currentStreak: 5, longestStreak: 14, isNewRecord: false },
    impulse_control: { currentStreak: 3, longestStreak: 8, isNewRecord: false },
  });

  const [recentRewards, setRecentRewards] = useState([
    { id: '1', rewardName: 'Smart Move!', pointsEarned: 10, character: 'scarecrow', createdAt: '2 hours ago' },
    { id: '2', rewardName: 'Keep Going!', pointsEarned: 5, character: 'dorothy', createdAt: '5 hours ago' },
    { id: '3', rewardName: '🔥 7 Day Login Streak!', pointsEarned: 70, character: 'lion', createdAt: '1 day ago' },
  ]);

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      achievementId: 'first_impulse_hold',
      achievementName: 'First Hold',
      achievementDescription: 'You held your first impulse purchase for 24 hours!',
      achievementTier: 'bronze',
      pointsValue: 50,
      character: 'bad_witch',
    },
    {
      achievementId: 'medication_week',
      achievementName: 'Week of Wellness',
      achievementDescription: 'Logged medication for 7 days straight',
      achievementTier: 'bronze',
      pointsValue: 100,
      character: 'tin_man',
    },
  ]);

  const progressToNextLevel = ((gamification.totalPoints / gamification.nextLevelPoints) * 100).toFixed(0);

  return (
    <div className="min-h-screen bg-night-emerald">
      <ERNavbar />

      <main className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-clean-white mb-2 flex items-center gap-3">
            <Trophy className="w-10 h-10 text-emerald-gold" />
            Your Rewards
          </h1>
          <p className="text-moon-silver">
            Track your progress, celebrate achievements, and level up!
          </p>
        </div>

        {/* Level & Points Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl p-6 mb-6 shadow-xl border border-emerald-gold/20"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-emerald-gold text-sm font-semibold mb-1">LEVEL {gamification.currentLevel}</div>
              <h2 className="text-3xl font-bold text-white">{gamification.levelName}</h2>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 justify-end mb-1">
                <Star className="w-6 h-6 text-yellow-300 fill-yellow-300" />
                <span className="text-3xl font-bold text-white">{gamification.totalPoints}</span>
              </div>
              <div className="text-white/70 text-sm">Total Points</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative">
            <div className="h-4 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressToNextLevel}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-yellow-400 to-emerald-gold rounded-full"
              />
            </div>
            <div className="flex justify-between mt-2 text-sm text-white/80">
              <span>{gamification.totalPoints} points</span>
              <span>{gamification.nextLevelPoints} points to next level</span>
            </div>
          </div>
        </motion.div>

        {/* Streaks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-5 shadow-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <Flame className="w-8 h-8 text-white" />
              <span className="text-3xl">{getStreakEmoji(streaks.daily_login.currentStreak)}</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{streaks.daily_login.currentStreak} Days</div>
            <div className="text-white/80 text-sm">Daily Login Streak</div>
            <div className="text-white/60 text-xs mt-1">Record: {streaks.daily_login.longestStreak} days</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl p-5 shadow-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <Flame className="w-8 h-8 text-white" />
              <span className="text-3xl">💊</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{streaks.medication.currentStreak} Days</div>
            <div className="text-white/80 text-sm">Medication Streak</div>
            <div className="text-white/60 text-xs mt-1">Record: {streaks.medication.longestStreak} days</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-5 shadow-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <Flame className="w-8 h-8 text-white" />
              <span className="text-3xl">🛡️</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{streaks.impulse_control.currentStreak} Days</div>
            <div className="text-white/80 text-sm">Impulse Control Streak</div>
            <div className="text-white/60 text-xs mt-1">Record: {streaks.impulse_control.longestStreak} days</div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Rewards */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-night-darker rounded-xl p-6 border border-emerald-gold/20"
          >
            <h3 className="text-xl font-bold text-clean-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-gold" />
              Recent Rewards
            </h3>
            <div className="space-y-3">
              {recentRewards.map((reward, index) => (
                <motion.div
                  key={reward.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-gold/20 flex items-center justify-center text-xl">
                      {reward.character === 'scarecrow' && '🧠'}
                      {reward.character === 'dorothy' && '👧'}
                      {reward.character === 'lion' && '🦁'}
                    </div>
                    <div>
                      <div className="text-clean-white font-medium">{reward.rewardName}</div>
                      <div className="text-moon-silver text-sm">{reward.createdAt}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-gold font-bold">
                    <Star className="w-4 h-4 fill-emerald-gold" />
                    +{reward.pointsEarned}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-night-darker rounded-xl p-6 border border-emerald-gold/20"
          >
            <h3 className="text-xl font-bold text-clean-white mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-gold" />
              Achievements Unlocked
            </h3>
            <div className="space-y-3">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.achievementId}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="p-4 bg-gradient-to-r from-emerald-600/20 to-emerald-800/20 rounded-lg border border-emerald-gold/30"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{getTierEmoji(achievement.achievementTier)}</div>
                    <div className="flex-1">
                      <div className="text-clean-white font-bold mb-1">{achievement.achievementName}</div>
                      <div className="text-moon-silver text-sm mb-2">{achievement.achievementDescription}</div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-emerald-gold uppercase font-semibold">{achievement.achievementTier}</span>
                        <span className="text-emerald-gold text-sm font-bold">+{achievement.pointsValue} points</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
