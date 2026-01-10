import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star, Zap } from 'lucide-react';
import type { Reward, CharacterType } from '@/utils/dopamineEngine';
import { getCharacterMessage } from '@/utils/dopamineEngine';

interface RewardCelebrationProps {
  reward: Reward | null;
  onClose: () => void;
}

const CHARACTER_IMAGES: Record<CharacterType, string> = {
  oz: '/images/oz-wizard.png',
  dorothy: '/images/dorothy-gingham.png',
  scarecrow: '/images/scarecrow-tech.png',
  tin_man: '/images/tin-man-heart.png',
  lion: '/images/lion-warrior.png',
  glinda: '/images/glinda-good.png',
  toto: '/images/toto-companion.png',
  tornado: '/images/tornado-swirl.png',
  bad_witch: '/images/bad-witch.png',
};

export function RewardCelebration({ reward, onClose }: RewardCelebrationProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (reward) {
      setShow(true);
      // Auto-close after 4 seconds
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onClose, 300); // Wait for exit animation
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [reward, onClose]);

  if (!reward) return null;

  const characterMessage = getCharacterMessage(reward.character, reward.rewardType);
  const isSurprise = reward.isSurprise;

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={() => {
              setShow(false);
              setTimeout(onClose, 300);
            }}
          />

          {/* Celebration Card */}
          <motion.div
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0, rotate: 180, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.6 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className={`
                relative max-w-md w-full rounded-2xl p-8 shadow-2xl pointer-events-auto
                ${isSurprise 
                  ? 'bg-gradient-to-br from-emerald-500 via-yellow-400 to-emerald-600' 
                  : 'bg-gradient-to-br from-emerald-600 to-emerald-800'
                }
              `}
            >
              {/* Confetti/Sparkles */}
              {isSurprise && (
                <div className="absolute inset-0 overflow-hidden rounded-2xl">
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ y: -20, x: Math.random() * 400, opacity: 1 }}
                      animate={{ 
                        y: 600, 
                        x: Math.random() * 400,
                        rotate: Math.random() * 360,
                        opacity: 0 
                      }}
                      transition={{ duration: 2, delay: Math.random() * 0.5 }}
                      className="absolute"
                    >
                      {i % 3 === 0 ? (
                        <Sparkles className="w-4 h-4 text-yellow-300" />
                      ) : i % 3 === 1 ? (
                        <Star className="w-4 h-4 text-white" />
                      ) : (
                        <Zap className="w-4 h-4 text-emerald-300" />
                      )}
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Character Image */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="flex justify-center mb-4"
              >
                <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden border-4 border-white/40">
                  <img
                    src={CHARACTER_IMAGES[reward.character]}
                    alt={reward.character}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to emoji if image fails
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="text-4xl">
                    {reward.character === 'oz' && '🧙‍♂️'}
                    {reward.character === 'dorothy' && '👧'}
                    {reward.character === 'scarecrow' && '🧠'}
                    {reward.character === 'tin_man' && '💝'}
                    {reward.character === 'lion' && '🦁'}
                    {reward.character === 'glinda' && '✨'}
                    {reward.character === 'toto' && '🐕'}
                    {reward.character === 'tornado' && '🌪️'}
                    {reward.character === 'bad_witch' && '🧙‍♀️'}
                  </div>
                </div>
              </motion.div>

              {/* Reward Name */}
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold text-center text-white mb-2"
              >
                {reward.rewardName}
              </motion.h2>

              {/* Character Message */}
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-lg text-center text-white/90 mb-3 italic"
              >
                "{characterMessage}"
              </motion.p>

              {/* Reward Description */}
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center text-white/80 mb-4"
              >
                {reward.rewardDescription}
              </motion.p>

              {/* Points Earned */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: 'spring' }}
                className="flex items-center justify-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3"
              >
                <Star className="w-6 h-6 text-yellow-300 fill-yellow-300" />
                <span className="text-2xl font-bold text-white">
                  +{reward.pointsEarned} points
                </span>
                <Star className="w-6 h-6 text-yellow-300 fill-yellow-300" />
              </motion.div>

              {/* Tap to continue hint */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="text-center text-white/60 text-sm mt-4"
              >
                Tap anywhere to continue
              </motion.p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
