import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Clock, Shield, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImpulseAnalysis } from "@/utils/impulseDetection";

interface ImpulseWarningDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  analysis: ImpulseAnalysis;
  transactionAmount: number;
  onProceed: () => void;
  onHold: () => void;
  onCancel: () => void;
}

export function ImpulseWarningDialog({
  open,
  onOpenChange,
  analysis,
  transactionAmount,
  onProceed,
  onHold,
  onCancel,
}: ImpulseWarningDialogProps) {
  const [showOverrideConfirm, setShowOverrideConfirm] = useState(false);

  const characterData = analysis.characterWarning === 'bad_witch' 
    ? {
        name: 'Bad Witch',
        image: '/bad-witch-tall-hat.webp',
        message: "⚠️ HOLD UP! Your ADHD brain is in impulse mode. I can feel it! Let's wait 24 hours before this purchase. Trust me, future you will thank you.",
        color: 'from-purple-600 to-pink-600'
      }
    : {
        name: 'Scarecrow',
        image: '/scarecrow-hacker.png',
        message: "🧠 Hey friend, let me help you think this through. This purchase has some impulse indicators. How about we sleep on it? I've got your back!",
        color: 'from-yellow-600 to-orange-600'
      };

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 z-50 bg-black/80"
          />
          
          {/* Dialog Content */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-2xl bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border-2 border-purple-500/50 text-white rounded-lg shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => onOpenChange(false)}
                className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity z-10"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="p-6 space-y-6">
                {/* Header */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <AlertTriangle className="w-6 h-6 text-yellow-400 animate-pulse" />
                    <h2 className="text-2xl font-bold">Impulse Purchase Detected!</h2>
                  </div>
                  <p className="text-gray-300">
                    Your ADHD-aware guardian has noticed some red flags...
                  </p>
                </div>

                {/* Character Warning */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-start gap-4 p-4 rounded-lg bg-black/30 border-2 border-purple-500/30"
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={characterData.image}
                      alt={characterData.name}
                      className="w-20 h-20 rounded-full object-cover border-4 border-purple-500"
                      style={{ boxShadow: '0 0 20px rgba(168, 85, 247, 0.6)' }}
                    />
                    <motion.div
                      className="absolute inset-0 rounded-full bg-purple-500/20"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2">{characterData.name} says:</h3>
                    <p className="text-gray-200 leading-relaxed">{characterData.message}</p>
                  </div>
                </motion.div>

                {/* Transaction Details */}
                <div className="bg-black/20 p-4 rounded-lg border border-purple-500/20">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-400">Purchase Amount:</span>
                    <span className="text-2xl font-bold text-yellow-400">${transactionAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Impulse Confidence:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full bg-gradient-to-r ${
                            analysis.confidenceScore >= 0.8 ? 'from-red-500 to-red-600' :
                            analysis.confidenceScore >= 0.6 ? 'from-yellow-500 to-orange-500' :
                            'from-green-500 to-green-600'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${analysis.confidenceScore * 100}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                      </div>
                      <span className="font-bold">{Math.round(analysis.confidenceScore * 100)}%</span>
                    </div>
                  </div>
                </div>

                {/* Risk Factors */}
                {analysis.riskFactors.length > 0 && (
                  <div className="bg-red-900/20 p-4 rounded-lg border border-red-500/30">
                    <h4 className="font-bold mb-2 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Risk Factors Detected:
                    </h4>
                    <ul className="space-y-1">
                      {analysis.riskFactors.map((factor, index) => (
                        <motion.li
                          key={index}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="text-sm text-gray-300 flex items-center gap-2"
                        >
                          <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                          {factor}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 24-Hour Hold Recommendation */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-r from-emerald-900/30 to-teal-900/30 p-4 rounded-lg border-2 border-emerald-500/50"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="w-5 h-5 text-emerald-400" />
                    <h4 className="font-bold text-emerald-400">24-Hour Cooling Off Period</h4>
                  </div>
                  <p className="text-sm text-gray-300">
                    Research shows that waiting 24 hours reduces impulse purchases by 70%. 
                    Your future self will appreciate this pause! 🌟
                  </p>
                </motion.div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 pt-4">
                  {!showOverrideConfirm ? (
                    <>
                      <Button
                        variant="outline"
                        onClick={onCancel}
                        className="border-gray-500 text-gray-300 hover:bg-gray-800 flex-1"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel Purchase
                      </Button>
                      <Button
                        onClick={onHold}
                        className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold flex-1"
                      >
                        <Clock className="w-4 h-4 mr-2" />
                        Hold for 24 Hours
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => setShowOverrideConfirm(true)}
                        className="text-gray-400 hover:text-white text-xs"
                      >
                        Proceed Anyway
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="w-full text-center mb-2">
                        <p className="text-yellow-400 text-sm font-bold">
                          Are you absolutely sure? This might be your ADHD talking...
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setShowOverrideConfirm(false)}
                        className="border-gray-500 flex-1"
                      >
                        Go Back
                      </Button>
                      <Button
                        onClick={onProceed}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold flex-1"
                      >
                        Yes, Proceed Anyway
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
