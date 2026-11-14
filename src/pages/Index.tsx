import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import OzStoryIntro from "@/components/oz-intro/OzStoryIntro";
import OzCharacterSplash from "@/components/oz-intro/OzCharacterSplash";
import OzFocusHome from "@/components/oz-intro/OzFocusHome";
import { loadVisitorSession } from "@/seo/sessionAvailability";
import { PROBLEM_HEADLINE } from "@/seo/site";

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [hasSeenIntro, setHasSeenIntro] = useState(false); // Always start fresh for testing
  const [hasSeenSplash, setHasSeenSplash] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    if (!isSupabaseConfigured) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!cancelled) {
          setUser(session?.user ?? null);
          setLoading(false);
        }
      }
    );

    loadVisitorSession({
      configured: true,
      getSession: () => supabase.auth.getSession(),
    }).then((result) => {
      if (!cancelled) {
        setUser(result.user);
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const handleSplashComplete = () => {
    setHasSeenSplash(true);
  };

  const handleIntroComplete = () => {
    localStorage.setItem("oz-intro-seen", "true");
    setHasSeenIntro(true);
    navigate("/auth");
  };

  const handleSignIn = () => {
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <img 
          src="/neurooz-logo.png" 
          alt="Neurooz" 
          className="w-32 h-32 animate-pulse mb-4"
        />
        <h1 className="text-white text-2xl font-display text-center px-6">{PROBLEM_HEADLINE}</h1>
        <div className="text-white/60 text-lg font-display mt-3">Loading your journey...</div>
      </div>
    );
  }

  // Authenticated users get the focused home
  if (user) {
    return <OzFocusHome userEmail={user.email} />;
  }

  // New visitors get the character splash first
  if (!hasSeenSplash) {
    return <OzCharacterSplash onComplete={handleSplashComplete} />;
  }

  // Then the story intro
  if (!hasSeenIntro) {
    return (
      <OzStoryIntro 
        onComplete={handleIntroComplete}
        onSignIn={handleSignIn}
      />
    );
  }

  // Returning visitors who've seen intro but aren't logged in
  return (
    <OzStoryIntro 
      onComplete={handleIntroComplete}
      onSignIn={handleSignIn}
    />
  );
};

export default Index;
