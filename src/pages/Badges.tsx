import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Lock } from "lucide-react";

const Badges = () => {
  const earnedBadges = [
    {
      id: 1,
      name: "First Swap",
      description: "Complete your first life experience swap",
      icon: "🎯",
      earned: true,
      earnedDate: "2024-01-15"
    },
    {
      id: 2,
      name: "Empathy Builder",
      description: "Complete 5 life swaps",
      icon: "💝",
      earned: true,
      earnedDate: "2024-02-20"
    },
    {
      id: 3,
      name: "Perspective Seeker",
      description: "Try experiences from 3 different categories",
      icon: "🔍",
      earned: true,
      earnedDate: "2024-03-10"
    },
  ];

  const lockedBadges = [
    {
      id: 4,
      name: "Community Connector",
      description: "Complete 10 life swaps",
      icon: "🤝",
      earned: false,
      progress: "7/10"
    },
    {
      id: 5,
      name: "Life Sharer",
      description: "Create your first life block",
      icon: "📖",
      earned: false,
      progress: "0/1"
    },
    {
      id: 6,
      name: "Reflection Master",
      description: "Complete 20 reflection prompts",
      icon: "✨",
      earned: false,
      progress: "12/20"
    },
    {
      id: 7,
      name: "World Traveler",
      description: "Complete experiences from 7 different categories",
      icon: "🌍",
      earned: false,
      progress: "3/7"
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12 text-center">
            <div className="w-20 h-20 bg-gradient-warm rounded-full flex items-center justify-center mx-auto mb-6 shadow-elevated">
              <Award className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Your <span className="bg-gradient-warm bg-clip-text text-transparent">Badges</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Track your journey of perspective-taking and empathy building
            </p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-4xl font-bold text-primary mb-2">3</div>
                <div className="text-muted-foreground">Badges Earned</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-4xl font-bold text-secondary mb-2">7</div>
                <div className="text-muted-foreground">Swaps Completed</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-4xl font-bold text-accent mb-2">4</div>
                <div className="text-muted-foreground">In Progress</div>
              </CardContent>
            </Card>
          </div>

          {/* Earned Badges */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Earned Badges</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {earnedBadges.map((badge) => (
                <Card key={badge.id} className="hover:shadow-elevated transition-all duration-300 border-primary/20">
                  <CardContent className="p-6 text-center">
                    <div className="text-6xl mb-4">{badge.icon}</div>
                    <h3 className="font-semibold text-lg mb-2">{badge.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{badge.description}</p>
                    <Badge variant="default" className="bg-gradient-warm border-0">
                      Earned {new Date(badge.earnedDate).toLocaleDateString()}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Locked Badges */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Locked Badges</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {lockedBadges.map((badge) => (
                <Card key={badge.id} className="hover:shadow-soft transition-all duration-300 opacity-75">
                  <CardContent className="p-6 text-center">
                    <div className="relative mb-4">
                      <div className="text-5xl opacity-50">{badge.icon}</div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Lock className="w-8 h-8 text-muted-foreground" />
                      </div>
                    </div>
                    <h3 className="font-semibold mb-2">{badge.name}</h3>
                    <p className="text-xs text-muted-foreground mb-3">{badge.description}</p>
                    <Badge variant="outline">{badge.progress}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Badges;
