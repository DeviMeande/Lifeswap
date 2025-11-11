import Navigation from "@/components/Navigation";
import ExperienceCard from "@/components/ExperienceCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { useState } from "react";

const Explore = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    "All", "Creative", "Food & Service", "Community", "Technology", 
    "Health & Wellness", "Education", "Urban Living"
  ];

  const experiences = [
    {
      id: 1,
      title: "Morning as a Barista",
      author: "Sarah Chen",
      duration: "2 hours",
      location: "Virtual",
      category: "Food & Service",
      description: "Experience the rush and rhythm of morning coffee service, from bean to cup.",
    },
    {
      id: 2,
      title: "Afternoon UX Design Sprint",
      author: "Marcus Rodriguez",
      duration: "3 hours",
      location: "Hybrid",
      category: "Creative",
      description: "Dive into user research, wireframing, and design thinking processes.",
    },
    {
      id: 3,
      title: "Evening at Food Kitchen",
      author: "Aisha Patel",
      duration: "2 hours",
      location: "In-Person",
      category: "Community",
      description: "Volunteer and connect with community members while serving meals.",
    },
    {
      id: 4,
      title: "Day in Software Engineering",
      author: "James Liu",
      duration: "4 hours",
      location: "Virtual",
      category: "Technology",
      description: "From standup to deployment, experience the lifecycle of code.",
    },
    {
      id: 5,
      title: "Yoga Teacher's Morning",
      author: "Priya Sharma",
      duration: "2.5 hours",
      location: "Hybrid",
      category: "Health & Wellness",
      description: "Learn the preparation, practice, and mindfulness behind teaching yoga.",
    },
    {
      id: 6,
      title: "Elementary School Teacher's Day",
      author: "Tom Anderson",
      duration: "3 hours",
      location: "Virtual",
      category: "Education",
      description: "Experience lesson planning, classroom management, and student engagement.",
    },
  ];

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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExperiences.map((experience) => (
            <ExperienceCard key={experience.id} {...experience} />
          ))}
        </div>

        {filteredExperiences.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">No experiences found in this category</p>
            <Button variant="link" onClick={() => setSelectedCategory(null)} className="mt-4">
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
