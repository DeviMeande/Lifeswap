import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ExperienceCard from "@/components/ExperienceCard";
import { ArrowRight, Heart, Lightbulb, Users } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-lifeswap.jpg";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const Index = () => {
  const { data: featuredExperiences = [], isLoading } = useQuery({
    queryKey: ['featuredExperiences'],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('lifeBlock')
        .select(`
          *,
          creator:created_by (
            userName
          )
        `)
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (error) throw error;
      return data || [];
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-warm opacity-10"  style={{ zIndex: -1 }}/>
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Walk in Someone Else's{" "}
                <span className="bg-gradient-warm bg-clip-text text-transparent">Shoes</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Swap life experiences with people from different walks of life. Build empathy, gain perspective, and discover new possibilities.
              </p>
              <div className="flex flex-wrap gap-4">
                {/* <a href="/explore" target="_blank" rel="noopener noreferrer"> */}
                <Link to="/explore">
                  <Button variant="hero" size="lg" className="group">
                    Explore Experiences
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  </Link>
                {/* </a> */}
                <Link to="/create">
                  <Button variant="outline" size="lg">
                    Share Your Life
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-warm rounded-3xl blur-3xl opacity-20" />
              <img
                src={heroImage}
                alt="Diverse people connecting"
                className="relative rounded-3xl shadow-elevated w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">How LifeSwap Works</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            A simple, structured journey to immerse yourself in another person's daily reality
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto shadow-soft">
                <Heart className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-semibold">1. Choose</h3>
              <p className="text-muted-foreground">
                Browse life blocks based on your interests, goals, or curiosity themes like "creative burnout" or "urban living"
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto shadow-soft">
                <Users className="w-8 h-8 text-secondary-foreground" />
              </div>
              <h3 className="text-2xl font-semibold">2. Experience</h3>
              <p className="text-muted-foreground">
                Step into their world through guided micro-tasks, storytelling, and immersive context notes
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto shadow-soft">
                <Lightbulb className="w-8 h-8 text-accent-foreground" />
              </div>
              <h3 className="text-2xl font-semibold">3. Reflect & Share</h3>
              <p className="text-muted-foreground">
                Complete reflection prompts and share your learnings with the community to foster empathy
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Experiences */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-2">Featured Experiences</h2>
              <p className="text-muted-foreground">Start your journey of perspective-taking</p>
            </div>
            <Link to="/explore">
              <Button variant="ghost" className="group">
                View All
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {isLoading ? (
              <p className="text-muted-foreground col-span-3 text-center">Loading experiences...</p>
            ) : featuredExperiences.length === 0 ? (
              <p className="text-muted-foreground col-span-3 text-center">No experiences available yet.</p>
            ) : (
              featuredExperiences.map((experience) => (
                <ExperienceCard 
                  key={experience.id} 
                  id={experience.id}
                  title={experience.title}
                  duration={experience.duration}
                  location={experience.locationType}
                  category={experience.category}
                  description={experience.description}
                  creatorName={experience.creator?.userName}
                />
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-warm text-primary-foreground">
        <div className="container mx-auto px-4 text-center space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold">Ready to Expand Your Perspective?</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Join thousands discovering empathy through lived experiences
          </p>
          <Link to="/create">
            <Button variant="outline" size="lg" className="bg-background text-foreground hover:bg-background/90 border-0">
              Create Your First Life Block
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
