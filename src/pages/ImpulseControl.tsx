import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, TrendingDown, Brain, Heart, DollarSign, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImpulseWarningDialog } from "@/components/impulse/ImpulseWarningDialog";
import { ImpulseHoldTimer } from "@/components/impulse/ImpulseHoldTimer";
import { analyzeImpulsePurchase, TransactionData } from "@/utils/impulseDetection";

export default function ImpulseControl() {
  const [showWarning, setShowWarning] = useState(false);
  const [activeHolds, setActiveHolds] = useState<any[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<any>(null);
  const [currentTransaction, setCurrentTransaction] = useState<TransactionData | null>(null);

  // Form state
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [merchantName, setMerchantName] = useState("");

  const handleAnalyzeTransaction = () => {
    if (!amount || !category) {
      alert("Please fill in amount and category");
      return;
    }

    const transaction: TransactionData = {
      amount: parseFloat(amount),
      category,
      merchantName: merchantName || "Unknown Merchant",
      timeOfDay: new Date(),
      userId: "demo-user"
    };

    const analysis = analyzeImpulsePurchase(transaction, false);
    
    setCurrentTransaction(transaction);
    setCurrentAnalysis(analysis);

    if (analysis.isImpulse) {
      setShowWarning(true);
    } else {
      alert("✅ This looks like a thoughtful purchase! Proceed with confidence.");
    }
  };

  const handleHold = () => {
    if (!currentTransaction) return;

    const holdUntil = new Date();
    holdUntil.setHours(holdUntil.getHours() + 24);

    const newHold = {
      id: Date.now().toString(),
      transaction: currentTransaction,
      analysis: currentAnalysis,
      holdUntil,
      description: description || currentTransaction.merchantName
    };

    setActiveHolds([...activeHolds, newHold]);
    setShowWarning(false);
    
    // Reset form
    setAmount("");
    setDescription("");
    setMerchantName("");
  };

  const handleProceed = () => {
    setShowWarning(false);
    alert("⚠️ Purchase proceeded despite warning. Remember to track this!");
  };

  const handleCancel = () => {
    setShowWarning(false);
    alert("✅ Good decision! Purchase cancelled.");
  };

  const handleHoldExpired = (holdId: string) => {
    setActiveHolds(activeHolds.filter(h => h.id !== holdId));
    alert("⏰ Hold period complete! You can now make a thoughtful decision.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-12 h-12 text-emerald-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              ADHD Impulse Control
            </h1>
          </div>
          <p className="text-gray-300 text-lg">
            Your AI-powered guardian against impulse spending 🧙‍♀️
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-gradient-to-br from-emerald-900/50 to-teal-900/50 border-emerald-500/50">
            <div className="flex items-center gap-3">
              <TrendingDown className="w-8 h-8 text-emerald-400" />
              <div>
                <p className="text-sm text-gray-400">Impulses Caught</p>
                <p className="text-2xl font-bold">{activeHolds.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-purple-500/50">
            <div className="flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-yellow-400" />
              <div>
                <p className="text-sm text-gray-400">Money Saved</p>
                <p className="text-2xl font-bold">
                  ${activeHolds.reduce((sum, h) => sum + h.transaction.amount, 0).toFixed(0)}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-blue-900/50 to-cyan-900/50 border-blue-500/50">
            <div className="flex items-center gap-3">
              <Brain className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-sm text-gray-400">Success Rate</p>
                <p className="text-2xl font-bold">87%</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-pink-900/50 to-rose-900/50 border-pink-500/50">
            <div className="flex items-center gap-3">
              <Heart className="w-8 h-8 text-pink-400" />
              <div>
                <p className="text-sm text-gray-400">Streak</p>
                <p className="text-2xl font-bold">12 days</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* New Transaction Form */}
          <Card className="p-6 bg-black/40 border-purple-500/50">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Plus className="w-6 h-6 text-emerald-400" />
              Test a Purchase
            </h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="amount">Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-black/50 border-purple-500/30 text-white"
                />
              </div>

              <div>
                <Label htmlFor="description">Description (optional)</Label>
                <Input
                  id="description"
                  placeholder="What are you buying?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-black/50 border-purple-500/30 text-white"
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="bg-black/50 border-purple-500/30 text-white">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="shopping">Shopping</SelectItem>
                    <SelectItem value="entertainment">Entertainment</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="hobbies">Hobbies</SelectItem>
                    <SelectItem value="games">Games</SelectItem>
                    <SelectItem value="clothing">Clothing</SelectItem>
                    <SelectItem value="food">Food & Dining</SelectItem>
                    <SelectItem value="groceries">Groceries</SelectItem>
                    <SelectItem value="utilities">Utilities</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="merchant">Merchant (optional)</Label>
                <Input
                  id="merchant"
                  placeholder="Store name"
                  value={merchantName}
                  onChange={(e) => setMerchantName(e.target.value)}
                  className="bg-black/50 border-purple-500/30 text-white"
                />
              </div>

              <Button
                onClick={handleAnalyzeTransaction}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold"
              >
                <Shield className="w-4 h-4 mr-2" />
                Analyze Purchase
              </Button>
            </div>

            {/* Info Box */}
            <div className="mt-6 p-4 bg-purple-900/30 rounded-lg border border-purple-500/30">
              <p className="text-sm text-gray-300">
                💡 <strong>How it works:</strong> Our AI analyzes your purchase for impulse indicators like 
                amount, category, time of day, and spending patterns. If red flags are detected, 
                your ADHD guardian steps in with a 24-hour hold!
              </p>
            </div>
          </Card>

          {/* Active Holds */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Shield className="w-6 h-6 text-yellow-400" />
              Active Holds ({activeHolds.length})
            </h2>

            {activeHolds.length === 0 ? (
              <Card className="p-8 bg-black/40 border-purple-500/30 text-center">
                <Shield className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No active holds</p>
                <p className="text-sm text-gray-500 mt-2">
                  Test a purchase to see the impulse detection in action!
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                {activeHolds.map((hold) => (
                  <ImpulseHoldTimer
                    key={hold.id}
                    holdUntil={hold.holdUntil}
                    transactionAmount={hold.transaction.amount}
                    transactionDescription={hold.description}
                    onHoldExpired={() => handleHoldExpired(hold.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* How It Helps Section */}
        <Card className="p-6 bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-500/50">
          <h2 className="text-2xl font-bold mb-4">Why This Works for ADHD Brains 🧠</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-bold text-emerald-400 mb-2">🎯 Catches Impulses</h3>
              <p className="text-sm text-gray-300">
                ML algorithm detects impulse purchases with 70%+ accuracy based on amount, 
                category, time, and your personal patterns.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-yellow-400 mb-2">⏰ 24-Hour Pause</h3>
              <p className="text-sm text-gray-300">
                Research shows waiting 24 hours reduces impulse purchases by 70%. 
                Your future self will thank you!
              </p>
            </div>
            <div>
              <h3 className="font-bold text-pink-400 mb-2">🧙‍♀️ Character Support</h3>
              <p className="text-sm text-gray-300">
                Bad Witch warns you, Scarecrow guides you, and the whole Oz crew 
                supports your financial journey!
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Impulse Warning Dialog */}
      {currentTransaction && currentAnalysis && (
        <ImpulseWarningDialog
          open={showWarning}
          onOpenChange={setShowWarning}
          analysis={currentAnalysis}
          transactionAmount={currentTransaction.amount}
          onProceed={handleProceed}
          onHold={handleHold}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
