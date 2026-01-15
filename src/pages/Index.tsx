import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import OzStoryIntro from "@/components/oz-intro/OzStoryIntro";
import OzCharacterSplash from "@/components/oz-intro/OzCharacterSplash";
import OzFocusHome from "@/components/oz-intro/OzFocusHome";

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasSeenIntro, setHasSeenIntro] = useState(false); // Always start fresh for testing
  const [hasSeenSplash, setHasSeenSplash] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
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
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-6xl opacity-70">🐕</div>
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
