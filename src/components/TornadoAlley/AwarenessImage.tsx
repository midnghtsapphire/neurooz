import witchLandingImg from '@/assets/witch-landing.png';

interface AwarenessImageProps {
  location?: string;
  className?: string;
  caption?: string;
}

export function AwarenessImage({ className = '' }: AwarenessImageProps) {
  return (
    <img
      src={witchLandingImg}
      alt="The witch's dramatic landing in Oz"
      className={`w-full h-full object-cover ${className}`}
    />
  );
}
