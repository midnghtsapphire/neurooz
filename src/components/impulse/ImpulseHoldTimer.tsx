import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, CheckCircle, AlertCircle } from "lucide-react";
import { calculateRemainingHoldTime } from "@/utils/impulseDetection";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ImpulseHoldTimerProps {
  holdUntil: Date;
  transactionAmount: number;
  transactionDescription: string;
  onHoldExpired: () => void;
  onOverride?: () => void;
}

export function ImpulseHoldTimer({
  holdUntil,
  transactionAmount,
  transactionDescription,
  onHoldExpired,
  onOverride,
}: ImpulseHoldTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(calculateRemainingHoldTime(holdUntil));

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = calculateRemainingHoldTime(holdUntil);
      setTimeRemaining(remaining);

      if (remaining.isExpired) {
        clearInterval(interval);
        onHoldExpired();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [holdUntil, onHoldExpired]);

  const progressPercentage = timeRemaining.isExpired 
    ? 100 
    : ((24 * 3600 - timeRemaining.totalSeconds) / (24 * 3600)) * 100;

  if (timeRemaining.isExpired) {
    return (
      <Card className="p-6 bg-gradient-to-br from-emerald-900/50 to-teal-900/50 border-2 border-emerald-500">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
          </motion.div>
          <h3 className="text-2xl font-bold text-emerald-400 mb-2">
            Cooling Off Period Complete! 🎉
          </h3>
          <p className="text-gray-300 mb-4">
            You've successfully waited 24 hours. Now you can make a more thoughtful decision!
          </p>
          <div className="bg-black/30 p-4 rounded-lg mb-4">
            <p className="text-sm text-gray-400">Transaction:</p>
            <p className="text-xl font-bold text-white">${transactionAmount.toFixed(2)}</p>
            <p className="text-sm text-gray-300">{transactionDescription}</p>
          </div>
          <p className="text-sm text-gray-400">
            Do you still want to proceed with this purchase?
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-2 border-purple-500">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Clock className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
          </motion.div>
          <h3 className="text-2xl font-bold text-white mb-2">
            24-Hour Hold Active
          </h3>
          <p className="text-gray-300 text-sm">
            Your ADHD guardian is protecting you from impulse spending
          </p>
        </div>

        {/* Transaction Details */}
        <div className="bg-black/30 p-4 rounded-lg">
          <p className="text-sm text-gray-400 mb-1">Held Purchase:</p>
          <p className="text-2xl font-bold text-yellow-400 mb-2">
            ${transactionAmount.toFixed(2)}
          </p>
          <p className="text-sm text-gray-300">{transactionDescription}</p>
        </div>

        {/* Countdown Timer */}
        <div className="bg-black/40 p-6 rounded-lg">
          <p className="text-center text-gray-400 text-sm mb-3">Time Remaining:</p>
          <div className="flex justify-center gap-4 mb-4">
            <div className="text-center">
              <motion.div
                key={timeRemaining.hours}
                initial={{ scale: 1.2, color: "#fbbf24" }}
                animate={{ scale: 1, color: "#ffffff" }}
                className="text-4xl font-bold"
              >
                {String(timeRemaining.hours).padStart(2, '0')}
              </motion.div>
              <p className="text-xs text-gray-400 mt-1">Hours</p>
            </div>
            <div className="text-4xl font-bold text-gray-500">:</div>
            <div className="text-center">
              <motion.div
                key={timeRemaining.minutes}
                initial={{ scale: 1.2, color: "#fbbf24" }}
                animate={{ scale: 1, color: "#ffffff" }}
                className="text-4xl font-bold"
              >
                {String(timeRemaining.minutes).padStart(2, '0')}
              </motion.div>
              <p className="text-xs text-gray-400 mt-1">Minutes</p>
            </div>
            <div className="text-4xl font-bold text-gray-500">:</div>
            <div className="text-center">
              <motion.div
                key={timeRemaining.seconds}
                initial={{ scale: 1.2, color: "#fbbf24" }}
                animate={{ scale: 1, color: "#ffffff" }}
                className="text-4xl font-bold"
              >
                {String(timeRemaining.seconds).padStart(2, '0')}
              </motion.div>
              <p className="text-xs text-gray-400 mt-1">Seconds</p>
            </div>
          </div>

          {/* Yellow Brick Road Progress Bar */}
          <div className="relative">
            <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5 }}
                style={{
                  boxShadow: '0 0 20px rgba(250, 204, 21, 0.6)'
                }}
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-white drop-shadow-lg">
                {Math.round(progressPercentage)}% Complete
              </span>
            </div>
          </div>
        </div>

        {/* Motivational Message */}
        <motion.div
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="bg-emerald-900/30 p-4 rounded-lg border border-emerald-500/30"
        >
          <p className="text-center text-emerald-400 text-sm">
            ✨ You're doing great! Every minute that passes is a win for your financial health. 
            Future you is already thanking you! 💚
          </p>
        </motion.div>

        {/* Override Option (if provided) */}
        {onOverride && (
          <div className="text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={onOverride}
              className="text-gray-500 hover:text-gray-300 text-xs"
            >
              <AlertCircle className="w-3 h-3 mr-1" />
              Override Hold (Not Recommended)
            </Button>
          </div>
        )}

        {/* Character Support */}
        <div className="flex items-center gap-3 p-3 bg-black/20 rounded-lg">
          <img
            src="/scarecrow-hacker.png"
            alt="Scarecrow"
            className="w-12 h-12 rounded-full object-cover border-2 border-yellow-500"
          />
          <div className="flex-1">
            <p className="text-xs text-gray-400">Scarecrow says:</p>
            <p className="text-sm text-gray-200">
              "You've got this! I'm here with you every step of the way. 🧠💪"
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
