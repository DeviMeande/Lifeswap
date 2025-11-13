import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Compass, User, Award, UserCircle, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const Navigation = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Logged out",
        description: "You've been successfully logged out",
      });
      navigate("/");
    }
  };

  const handleGetStarted = () => {
    if (!user) {
      navigate("/auth?redirect=/create");
    } else {
      navigate("/create");
    }
  };

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold bg-gradient-warm bg-clip-text text-transparent">
          LifeSwap
        </Link>
        
        <div className="hidden md:flex items-center gap-6">
          <Link to="/explore" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <Compass className="w-4 h-4" />
            Explore
          </Link>
          {user && (
            <>
              <Link to="/create" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
                <User className="w-4 h-4" />
                Create Block
              </Link>
              <Link to="/badges" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
                <Award className="w-4 h-4" />
                My Badges
              </Link>
              <Link to="/profile" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
                <UserCircle className="w-4 h-4" />
                Profile
              </Link>
            </>
          )}
        </div>
        
        {!loading && (
          <>
            {user ? (
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            ) : (
              <Button variant="hero" size="sm" onClick={handleGetStarted}>
                Get Started
              </Button>
            )}
          </>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
