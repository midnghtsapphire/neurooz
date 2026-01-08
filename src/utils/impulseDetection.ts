// ADHD Impulse Detection Utility Functions
// Based on SnapWealth ADHD FinTech Blue Ocean Strategy

export interface TransactionData {
  amount: number;
  category: string;
  merchantName: string;
  timeOfDay: Date;
  userId: string;
}

export interface ImpulseAnalysis {
  isImpulse: boolean;
  confidenceScore: number;
  riskFactors: string[];
  recommendation: string;
  characterWarning: 'bad_witch' | 'scarecrow' | 'none';
}

/**
 * Calculate impulse purchase confidence score
 * Returns a score between 0 and 1, where higher = more likely impulse
 */
export function calculateImpulseScore(transaction: TransactionData): number {
  let score = 0;
  
  // Factor 1: Amount (higher amounts = higher risk)
  if (transaction.amount > 100) {
    score += 0.2;
  }
  if (transaction.amount > 500) {
    score += 0.2;
  }
  if (transaction.amount > 1000) {
    score += 0.1;
  }
  
  // Factor 2: High-risk categories
  const highRiskCategories = [
    'shopping',
    'entertainment',
    'electronics',
    'hobbies',
    'games',
    'clothing',
    'gadgets',
    'subscriptions'
  ];
  
  if (highRiskCategories.some(cat => 
    transaction.category.toLowerCase().includes(cat)
  )) {
    score += 0.2;
  }
  
  // Factor 3: Time of day (late night = higher risk)
  const hour = transaction.timeOfDay.getHours();
  if (hour >= 22 || hour <= 6) {
    score += 0.15; // Late night purchases
  } else if (hour >= 11 && hour <= 14) {
    score += 0.05; // Lunch break impulse
  }
  
  // Factor 4: Day of week (weekends = slightly higher risk)
  const dayOfWeek = transaction.timeOfDay.getDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    score += 0.05;
  }
  
  // Cap at 1.0
  return Math.min(score, 1.0);
}

/**
 * Analyze transaction for impulse purchase indicators
 */
export function analyzeImpulsePurchase(
  transaction: TransactionData,
  recentMedicationTaken: boolean = false,
  userThreshold: number = 0.7
): ImpulseAnalysis {
  const confidenceScore = calculateImpulseScore(transaction);
  const riskFactors: string[] = [];
  
  // Identify specific risk factors
  if (transaction.amount > 500) {
    riskFactors.push(`High amount: $${transaction.amount}`);
  }
  
  const hour = transaction.timeOfDay.getHours();
  if (hour >= 22 || hour <= 6) {
    riskFactors.push('Late night purchase');
  }
  
  const highRiskCategories = ['shopping', 'entertainment', 'electronics'];
  if (highRiskCategories.some(cat => 
    transaction.category.toLowerCase().includes(cat)
  )) {
    riskFactors.push(`High-risk category: ${transaction.category}`);
  }
  
  if (!recentMedicationTaken) {
    riskFactors.push('No recent medication logged');
  }
  
  // Determine if it's an impulse purchase
  const isImpulse = confidenceScore >= userThreshold;
  
  // Generate recommendation
  let recommendation = '';
  let characterWarning: 'bad_witch' | 'scarecrow' | 'none' = 'none';
  
  if (isImpulse) {
    if (confidenceScore >= 0.8) {
      recommendation = "Strong impulse indicators detected. Let's take a 24-hour pause to think this through.";
      characterWarning = 'bad_witch';
    } else {
      recommendation = "This might be an impulse purchase. Consider waiting before completing this transaction.";
      characterWarning = 'scarecrow';
    }
  } else {
    recommendation = "This looks like a thoughtful purchase. Proceed with confidence!";
  }
  
  return {
    isImpulse,
    confidenceScore,
    riskFactors,
    recommendation,
    characterWarning
  };
}

/**
 * Calculate time since last medication
 */
export function calculateTimeSinceMedication(lastMedicationTime: Date | null): number | null {
  if (!lastMedicationTime) return null;
  
  const now = new Date();
  const diffMs = now.getTime() - lastMedicationTime.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  
  return diffMinutes;
}

/**
 * Check if user is within optimal medication window
 */
export function isWithinMedicationWindow(
  lastMedicationTime: Date | null,
  optimalWindowHours: number = 4
): boolean {
  if (!lastMedicationTime) return false;
  
  const minutesSinceMed = calculateTimeSinceMedication(lastMedicationTime);
  if (minutesSinceMed === null) return false;
  
  const windowMinutes = optimalWindowHours * 60;
  return minutesSinceMed <= windowMinutes;
}

/**
 * Calculate velocity score (how many purchases in short time)
 */
export function calculateVelocityScore(
  recentTransactions: TransactionData[],
  timeWindowMinutes: number = 60
): number {
  if (recentTransactions.length === 0) return 0;
  
  const now = new Date();
  const recentCount = recentTransactions.filter(t => {
    const diffMs = now.getTime() - t.timeOfDay.getTime();
    const diffMinutes = diffMs / (1000 * 60);
    return diffMinutes <= timeWindowMinutes;
  }).length;
  
  // Normalize: 0 = no recent purchases, 1 = many rapid purchases
  return Math.min(recentCount / 5, 1.0);
}

/**
 * Get character message based on impulse analysis
 */
export function getCharacterMessage(analysis: ImpulseAnalysis): {
  character: string;
  message: string;
  imageUrl: string;
} {
  if (analysis.characterWarning === 'bad_witch') {
    return {
      character: 'Bad Witch',
      message: "⚠️ HOLD UP! Your ADHD brain is in impulse mode. I can feel it! Let's wait 24 hours before this purchase. Trust me, future you will thank you. 🧙‍♀️",
      imageUrl: '/bad-witch-tall-hat.webp'
    };
  } else if (analysis.characterWarning === 'scarecrow') {
    return {
      character: 'Scarecrow',
      message: "🧠 Hey friend, let me help you think this through. This purchase has some impulse indicators. How about we sleep on it? I've got your back! 🌾",
      imageUrl: '/scarecrow-hacker.png'
    };
  } else {
    return {
      character: 'Glinda',
      message: "✨ This looks like a thoughtful decision! You're doing great. Proceed with confidence, dear! 💚",
      imageUrl: '/glinda-good-witch-final.webp'
    };
  }
}

/**
 * Format hold duration for display
 */
export function formatHoldDuration(hours: number): string {
  if (hours < 1) {
    const minutes = Math.round(hours * 60);
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  } else if (hours === 24) {
    return '24 hours (1 day)';
  } else {
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  }
}

/**
 * Calculate remaining hold time
 */
export function calculateRemainingHoldTime(holdUntil: Date): {
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  isExpired: boolean;
} {
  const now = new Date();
  const diffMs = holdUntil.getTime() - now.getTime();
  
  if (diffMs <= 0) {
    return {
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalSeconds: 0,
      isExpired: true
    };
  }
  
  const totalSeconds = Math.floor(diffMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  return {
    hours,
    minutes,
    seconds,
    totalSeconds,
    isExpired: false
  };
}
