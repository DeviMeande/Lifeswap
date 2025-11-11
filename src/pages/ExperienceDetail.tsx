import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, User, CheckCircle2 } from "lucide-react";
import { useParams, Link } from "react-router-dom";

const ExperienceDetail = () => {
  const { id } = useParams();

  // Mock data - in real app, would fetch based on id
  const experience = {
    title: "Morning as a Barista",
    author: "Sarah Chen",
    duration: "2 hours",
    location: "Virtual",
    category: "Food & Service",
    description: "Experience the rush and rhythm of morning coffee service, from bean to cup. You'll learn the art of espresso making, customer interaction, and the behind-the-scenes flow of a busy café morning.",
    learningOutcomes: [
      "Understand the pace and pressure of service work",
      "Learn basic barista techniques and coffee knowledge",
      "Experience customer service from the other side",
      "Appreciate the skill in seemingly simple tasks"
    ],
    tasks: [
      {
        title: "Setup & Preparation",
        description: "Learn the morning routine: machine warm-up, stock check, and workspace organization",
        duration: "20 min"
      },
      {
        title: "Customer Service Simulation",
        description: "Handle virtual orders and practice communication skills",
        duration: "45 min"
      },
      {
        title: "Coffee Making Tutorial",
        description: "Follow along with espresso techniques and latte art basics",
        duration: "35 min"
      },
      {
        title: "Reflection",
        description: "Journal about the experience and what surprised you",
        duration: "20 min"
      }
    ]
  };

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
                <Badge className="mb-3">{experience.category}</Badge>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">{experience.title}</h1>
                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                  <User className="w-4 h-4" />
                  <span>Created by {experience.author}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                <span>{experience.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                <span>{experience.location}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">About This Experience</h2>
              <p className="text-foreground/80 leading-relaxed">{experience.description}</p>
            </CardContent>
          </Card>

          {/* Learning Outcomes */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">What You'll Gain</h2>
              <ul className="space-y-3">
                {experience.learningOutcomes.map((outcome, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Journey Steps */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-6">Your Journey</h2>
              <div className="space-y-4">
                {experience.tasks.map((task, index) => (
                  <div key={index} className="flex gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
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

          {/* CTA */}
          <div className="flex gap-4">
            <Button variant="hero" size="lg" className="flex-1">
              Start This Experience
            </Button>
            <Link to="/explore" className="flex-1">
              <Button variant="outline" size="lg" className="w-full">
                Browse More
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceDetail;
