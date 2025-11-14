import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ExperienceCard from "@/components/ExperienceCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const Explore = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    "All", "Creative", "Food & Service", "Community", "Technology", 
    "Health & Wellness", "Education", "Urban Living"
  ];

  const { data: lifeBlocks, isLoading } = useQuery({
    queryKey: ['lifeBlocks'],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('lifeBlock')
        .select(`
          *,
          creator:user!created_by (
            name
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const experiences = lifeBlocks?.map((block: any) => ({
    id: block.id,
    title: block.title || "Untitled Experience",
    creatorName: block.creator?.name,
    duration: block.duration || "Not specified",
    location: block.locationType || "Not specified",
    category: block.category || "Uncategorized",
    description: block.description || "No description available",
    image: block.image_url,
  })) || [];

  const filteredExperiences = selectedCategory && selectedCategory !== "All"
    ? experiences.filter(exp => exp.category === selectedCategory)
    : experiences;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Explore Life <span className="bg-gradient-warm bg-clip-text text-transparent">Experiences</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Discover perspectives from people living completely different lives
          </p>
        </div>

        {/* Search & Filters */}
        <div className="mb-8 space-y-6">
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search experiences, themes, or interests..."
              className="pl-10 h-12"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category || (category === "All" && !selectedCategory) ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => setSelectedCategory(category === "All" ? null : category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Experience Grid */}
        {isLoading ? (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">Loading experiences...</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExperiences.map((experience) => (
                <ExperienceCard key={experience.id} {...experience} />
              ))}
            </div>

            {filteredExperiences.length === 0 && (
              <div className="text-center py-20">
                <p className="text-xl text-muted-foreground">
                  {selectedCategory ? "No experiences found in this category" : "No experiences available yet"}
                </p>
                {selectedCategory && (
                  <Button variant="link" onClick={() => setSelectedCategory(null)} className="mt-4">
                    Clear filters
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Explore;
