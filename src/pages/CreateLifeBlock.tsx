import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const CreateLifeBlock = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    duration: "",
    location: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Life Block Created!",
      description: "Your experience has been published and is now available for others to explore.",
    });
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
                        <SelectItem value="creative">Creative</SelectItem>
                        <SelectItem value="food">Food & Service</SelectItem>
                        <SelectItem value="community">Community</SelectItem>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="wellness">Health & Wellness</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="urban">Urban Living</SelectItem>
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
                        <SelectItem value="1">1 hour</SelectItem>
                        <SelectItem value="2">2 hours</SelectItem>
                        <SelectItem value="3">3 hours</SelectItem>
                        <SelectItem value="4">4 hours</SelectItem>
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
                      <SelectItem value="virtual">Virtual</SelectItem>
                      <SelectItem value="in-person">In-Person</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
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
                  <Button type="submit" variant="hero" className="flex-1">
                    Create Life Block
                  </Button>
                  <Button type="button" variant="outline" className="flex-1">
                    Save as Draft
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateLifeBlock;
