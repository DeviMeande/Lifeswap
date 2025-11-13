import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, User, CheckCircle2 } from "lucide-react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const ExperienceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isStarting, setIsStarting] = useState(false);

  const { data: lifeBlock, isLoading } = useQuery({
    queryKey: ['lifeBlock', id],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('lifeBlock')
        .select(`
          *,
          creator:user!created_by (
            name
          )
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const { data: tasks } = useQuery({
    queryKey: ['lifeBlockTasks', id],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('lifeBlockTasks')
        .select('*')
        .eq('lifeBlockId', id);
      
      if (error) throw error;
      return data || [];
    },
  });

  const handleStartExperience = async () => {
    if (!user) {
      navigate(`/auth?redirect=/experience/${id}`);
      return;
    }

    setIsStarting(true);
    try {
      const { error } = await (supabase as any)
        .from('userwiseExperiences')
        .insert({
          user_id: user.id,
          lifeblock: id,
          status: 'In-Progress'
        });

      if (error) throw error;

      toast({
        title: "Experience Started!",
        description: "You can now track your progress in your profile.",
      });

      // Redirect to profile page
      navigate('/profile');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start experience. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsStarting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-xl text-muted-foreground">Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!lifeBlock) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-xl text-muted-foreground">Experience not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  const goals = lifeBlock.goals || [];
  const journeyTasks = tasks || [];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="mb-8">
            <div className="h-64 bg-gradient-warm rounded-3xl mb-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-black/20" />
            </div>
            
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <Badge className="mb-3">{lifeBlock.category || "Uncategorized"}</Badge>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">{lifeBlock.title}</h1>
                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                  <User className="w-4 h-4" />
                  <span>Created by {lifeBlock.creator?.name || 'Anonymous'}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                <span>{lifeBlock.duration || "Not specified"}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                <span>{lifeBlock.locationType || "Not specified"}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">About This Experience</h2>
              <p className="text-foreground/80 leading-relaxed">{lifeBlock.description || "No description available"}</p>
            </CardContent>
          </Card>

          {/* Learning Outcomes */}
          {goals.length > 0 && (
            <Card className="mb-8">
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4">What You'll Gain</h2>
                <ul className="space-y-3">
                  {goals.map((goal: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                      <span>{goal}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Journey Steps */}
          {journeyTasks.length > 0 && (
            <Card className="mb-8">
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-6">Your Journey</h2>
                <div className="space-y-4">
                  {journeyTasks.map((task: any, index: number) => (
                    <div key={task.id} className="flex gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold">{task.title}</h3>
                          <span className="text-sm text-muted-foreground">{task.duration}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{task.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* CTA */}
          <div className="flex gap-4">
            <Button 
              variant="hero" 
              size="lg" 
              className="flex-1"
              onClick={handleStartExperience}
              disabled={isStarting}
            >
              {isStarting ? "Starting..." : "Start This Experience"}
            </Button>
            <Link to="/explore" className="flex-1">
              <Button variant="outline" size="lg" className="w-full">
                Browse More
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ExperienceDetail;
