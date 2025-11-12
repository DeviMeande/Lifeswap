import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Compass, User, Award, UserCircle } from "lucide-react";

const Navigation = () => {
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
        </div>
        
        <Button variant="hero" size="sm">Get Started</Button>
      </div>
    </nav>
  );
};

export default Navigation;
