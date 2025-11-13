import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const CreateLifeBlock = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    duration: "",
    location: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await (supabase as any)
        .from("lifeBlock")
        .insert({
          "title": formData.title,
          "category": formData.category,
          "duration": formData.duration,
          "locationType": formData.location,
          "description": formData.description,
          "created_at":new Date(),
          "createdBy":1
        });

      if (error) throw error;

      toast({
        title: "Life Block Created!",
        description: "Your experience has been published and is now available for others to explore.",
      });

      // Reset form
      setFormData({
        title: "",
        category: "",
        duration: "",
        location: "",
        description: "",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create life block. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Create Your <span className="bg-gradient-warm bg-clip-text text-transparent">Life Block</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Share a snapshot of your routine or passion with the world
            </p>
          </div>

          <Card>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Experience Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Morning as a Barista"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select onValueChange={(value) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Creative">Creative</SelectItem>
                        <SelectItem value="Food & Service">Food & Service</SelectItem>
                        <SelectItem value="Community">Community</SelectItem>
                        <SelectItem value="Technology">Technology</SelectItem>
                        <SelectItem value="Health & Wellness">Health & Wellness</SelectItem>
                        <SelectItem value="Education">Education</SelectItem>
                        <SelectItem value="Urban Living">Urban Living</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration *</Label>
                    <Select onValueChange={(value) => setFormData({ ...formData, duration: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1 Hour">1 Hour</SelectItem>
                        <SelectItem value="2 Hours">2 Hours</SelectItem>
                        <SelectItem value="3 Hours">3 Hours</SelectItem>
                        <SelectItem value="4 Hours">4 Hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location Type *</Label>
                  <Select onValueChange={(value) => setFormData({ ...formData, location: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Virtual">Virtual</SelectItem>
                      <SelectItem value="In-Person">In-Person</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what participants will experience, what they'll learn, and why this perspective matters..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={6}
                    required
                  />
                </div>

                <div className="bg-muted/30 p-6 rounded-lg">
                  <h3 className="font-semibold mb-2">Next Steps</h3>
                  <p className="text-sm text-muted-foreground">
                    After submitting your life block, you'll be guided through adding micro-tasks, context notes, and reflection prompts to complete your experience.
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" variant="hero" className="flex-1" disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create Life Block"}
                  </Button>
                  <Button type="button" variant="outline" className="flex-1" disabled={isSubmitting}>
                    Save as Draft
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CreateLifeBlock;
