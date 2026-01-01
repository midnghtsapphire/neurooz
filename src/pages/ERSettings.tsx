import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTravelerProfile } from '@/hooks/use-traveler-profile';
import { ERNavbar } from '@/components/emerald-road/ERNavbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { User, RotateCcw, Download, Upload, Eye, Type, Trash2 } from 'lucide-react';

export default function ERSettings() {
  const navigate = useNavigate();
  const { profile, isLoading, hasProfile, updateProfile, resetProgress, exportProfile, importProfile } = useTravelerProfile();
  
  const [name, setName] = useState('');
  const [reduceMotion, setReduceMotion] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [importJson, setImportJson] = useState('');
  const [showImport, setShowImport] = useState(false);

  useEffect(() => {
    if (!isLoading && !hasProfile) {
      navigate('/onboarding');
    }
  }, [isLoading, hasProfile, navigate]);

  useEffect(() => {
    if (profile) {
      setName(profile.name);
    }
  }, [profile]);

  if (isLoading || !profile) {
    return (
      <div className="min-h-screen bg-night-emerald flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-gold/30 border-t-emerald-gold rounded-full animate-spin" />
      </div>
    );
  }

  const handleSaveName = () => {
    if (name.trim()) {
      updateProfile({ name: name.trim() });
      toast.success('Name updated.');
    }
  };

  const handleExport = () => {
    const json = exportProfile();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `emerald-road-profile-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Profile exported.');
  };

  const handleImport = () => {
    if (importProfile(importJson)) {
      toast.success('Profile imported successfully.');
      setShowImport(false);
      setImportJson('');
    } else {
      toast.error('Invalid profile data.');
    }
  };

  const handleReset = () => {
    resetProgress();
    toast.success('Progress reset. Your road begins again.');
  };

  return (
    <div className="min-h-screen bg-night-emerald">
      <ERNavbar />
      
      <main className="container mx-auto px-4 py-6 max-w-lg">
        <h1 className="text-2xl font-bold text-clean-white mb-6">Settings</h1>

        {/* Profile Section */}
        <section className="p-5 rounded-xl bg-dark-emerald border border-moon-silver/20 mb-4">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-5 h-5 text-emerald-gold" />
            <h2 className="text-lg font-bold text-clean-white">Profile</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-moon-silver">Name</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-night-emerald border-moon-silver/20 text-clean-white focus:border-emerald-gold"
                />
                <Button
                  onClick={handleSaveName}
                  disabled={name === profile.name}
                  className="bg-emerald-gold hover:bg-emerald-gold/90 text-night-emerald"
                >
                  Save
                </Button>
              </div>
            </div>
            
            <div className="pt-2 border-t border-moon-silver/10">
              <p className="text-xs text-moon-silver/50">Traveler ID</p>
              <p className="text-sm text-moon-silver font-mono">{profile.id.slice(0, 8)}</p>
            </div>
          </div>
        </section>

        {/* Accessibility Section */}
        <section className="p-5 rounded-xl bg-dark-emerald border border-moon-silver/20 mb-4">
          <div className="flex items-center gap-3 mb-4">
            <Eye className="w-5 h-5 text-emerald-gold" />
            <h2 className="text-lg font-bold text-clean-white">Accessibility</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Type className="w-4 h-4 text-moon-silver/60" />
                <div>
                  <p className="text-sm text-clean-white">Large Text</p>
                  <p className="text-xs text-moon-silver/50">Increase text size throughout</p>
                </div>
              </div>
              <Switch
                checked={largeText}
                onCheckedChange={setLargeText}
                className="data-[state=checked]:bg-emerald-gold"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <RotateCcw className="w-4 h-4 text-moon-silver/60" />
                <div>
                  <p className="text-sm text-clean-white">Reduce Motion</p>
                  <p className="text-xs text-moon-silver/50">Minimize animations</p>
                </div>
              </div>
              <Switch
                checked={reduceMotion}
                onCheckedChange={setReduceMotion}
                className="data-[state=checked]:bg-emerald-gold"
              />
            </div>
          </div>
        </section>

        {/* Data Section */}
        <section className="p-5 rounded-xl bg-dark-emerald border border-moon-silver/20 mb-4">
          <div className="flex items-center gap-3 mb-4">
            <Download className="w-5 h-5 text-emerald-gold" />
            <h2 className="text-lg font-bold text-clean-white">Data</h2>
          </div>
          
          <div className="space-y-3">
            <Button
              onClick={handleExport}
              variant="outline"
              className="w-full justify-start border-moon-silver/20 text-moon-silver hover:bg-night-emerald"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Profile (JSON)
            </Button>
            
            <Button
              onClick={() => setShowImport(!showImport)}
              variant="outline"
              className="w-full justify-start border-moon-silver/20 text-moon-silver hover:bg-night-emerald"
            >
              <Upload className="w-4 h-4 mr-2" />
              Import Profile
            </Button>
            
            {showImport && (
              <div className="space-y-2 pt-2">
                <Textarea
                  value={importJson}
                  onChange={(e) => setImportJson(e.target.value)}
                  placeholder="Paste JSON data here..."
                  className="bg-night-emerald border-moon-silver/20 text-clean-white min-h-[100px]"
                />
                <Button
                  onClick={handleImport}
                  disabled={!importJson.trim()}
                  className="w-full bg-emerald-gold hover:bg-emerald-gold/90 text-night-emerald"
                >
                  Import
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Danger Zone */}
        <section className="p-5 rounded-xl bg-dark-emerald border border-warning-amber/30">
          <div className="flex items-center gap-3 mb-4">
            <Trash2 className="w-5 h-5 text-warning-amber" />
            <h2 className="text-lg font-bold text-clean-white">Reset</h2>
          </div>
          
          <p className="text-sm text-moon-silver/70 mb-4">
            This will reset all progress. Your territories, quests, and meters will return to their initial state. 
            Your name and profile will be preserved.
          </p>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full border-warning-amber/50 text-warning-amber hover:bg-warning-amber/10"
              >
                Reset Progress
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-night-emerald border-moon-silver/20">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-clean-white">Reset all progress?</AlertDialogTitle>
                <AlertDialogDescription className="text-moon-silver/70">
                  This will reset your territories, quests, and meters. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-moon-silver/20 text-moon-silver hover:bg-dark-emerald">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleReset}
                  className="bg-warning-amber hover:bg-warning-amber/90 text-night-emerald"
                >
                  Reset
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </section>
      </main>
    </div>
  );
}
