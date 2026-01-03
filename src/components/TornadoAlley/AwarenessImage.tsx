import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAwarenessTracker } from '@/hooks/use-awareness-tracker';

// Import all the surreal images for rotation
import witchLandingImg from '@/assets/witch-landing.png';
import dorothyObliviousImg from '@/assets/dorothy-oblivious-landing.png';
import munchkinHelperImg from '@/assets/munchkin-helper.png';
import tornadoAlleyImg from '@/assets/tornado-alley.png';

interface AwarenessImageProps {
  location: string;
  className?: string;
  caption?: string;
}

// Array of images with their descriptions
const AWARENESS_IMAGES = [
  {
    src: witchLandingImg,
    alt: "The Landing - Surreal figure with giant legs",
    hint: "Those legs seem... different?",
  },
  {
    src: dorothyObliviousImg,
    alt: "Dorothy Oblivious - Finding calm in chaos",
    hint: "Is that a new character?",
  },
  {
    src: munchkinHelperImg,
    alt: "The Munchkin Helper - Guidance in the storm",
    hint: "Someone's here to help...",
  },
  {
    src: tornadoAlleyImg,
    alt: "Tornado Alley - The swirling thoughts",
    hint: "The storm looks different today...",
  },
];

export function AwarenessImage({ location, className = '', caption }: AwarenessImageProps) {
  const [showNoticeButton, setShowNoticeButton] = useState(false);
  const [hasNoticed, setHasNoticed] = useState(false);

  const {
    currentImageIndex,
    visitsSinceChange,
    totalObservations,
    averageVisitsToNotice,
    isLoading,
    hasJustChanged,
    reportNoticed,
  } = useAwarenessTracker({
    location,
    totalImages: AWARENESS_IMAGES.length,
    minVisitsBeforeChange: 2,
    maxVisitsBeforeChange: 8,
  });

  const currentImage = AWARENESS_IMAGES[currentImageIndex] || AWARENESS_IMAGES[0];

  const handleNotice = async () => {
    setHasNoticed(true);
    await reportNoticed();
    setTimeout(() => setHasNoticed(false), 3000);
  };

  if (isLoading) {
    return (
      <div className={`animate-pulse bg-muted rounded-lg aspect-video ${className}`} />
    );
  }

  return (
    <div 
      className={`relative group ${className}`}
      onMouseEnter={() => setShowNoticeButton(true)}
      onMouseLeave={() => setShowNoticeButton(false)}
    >
      <motion.img
        key={currentImageIndex}
        src={currentImage.src}
        alt={currentImage.alt}
        className="w-full rounded-lg shadow-lg"
        initial={{ opacity: 0.8 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      />
      
      {/* Subtle hint on hover after image changed */}
      <AnimatePresence>
        {hasJustChanged && visitsSinceChange < 3 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.7, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-12 left-0 right-0 text-center"
          >
            <span className="text-xs text-muted-foreground italic">
              {currentImage.hint}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Caption */}
      {caption && (
        <p className="text-center text-sm text-muted-foreground mt-2 italic">
          {caption}
        </p>
      )}

      {/* "I noticed something changed!" button */}
      <AnimatePresence>
        {showNoticeButton && !hasNoticed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute top-3 right-3"
          >
            <Button
              variant="secondary"
              size="sm"
              onClick={handleNotice}
              className="gap-2 bg-background/80 backdrop-blur-sm hover:bg-background/90"
            >
              <Eye className="w-4 h-4" />
              Something's different!
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success animation */}
      <AnimatePresence>
        {hasNoticed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm rounded-lg"
          >
            <div className="text-center p-4">
              <Sparkles className="w-12 h-12 text-yellow-500 mx-auto mb-2 animate-pulse" />
              <p className="text-lg font-semibold">Nice catch! 👀</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats badge for returning users */}
      {totalObservations > 0 && (
        <div className="absolute bottom-3 left-3 text-xs bg-background/80 backdrop-blur-sm px-2 py-1 rounded-full">
          <span className="text-muted-foreground">
            Avg: {averageVisitsToNotice?.toFixed(1) || '?'} visits to notice
          </span>
        </div>
      )}
    </div>
  );
}
