import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart } from "lucide-react";
import { DonationTracker } from "@/components/donations/DonationTracker";

export default function DonationTrackerPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-rose-500" />
              <h1 className="text-xl font-semibold">Donation Tracker</h1>
            </div>
          </div>
          <nav className="flex items-center gap-2">
            <Link to="/vine-tracker">
              <Button variant="ghost" size="sm">Vine Tracker</Button>
            </Link>
            <Link to="/tax-rules">
              <Button variant="ghost" size="sm">Tax Rules</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <DonationTracker />
      </main>
    </div>
  );
}
