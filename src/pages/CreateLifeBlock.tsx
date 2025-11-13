import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { lifeBlockSchema } from "@/lib/validationSchemas";
import { z } from "zod";

const CreateLifeBlock = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    duration: "",
    location: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const isEditMode = !!id;

  // Fetch existing life block data if editing
  const { data: existingBlock, isLoading: loadingBlock } = useQuery({
    queryKey: ['lifeBlock', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await (supabase as any)
        .from('lifeBlock')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id && !!user,
  });

  // Load existing data into form
  useEffect(() => {
    if (existingBlock) {
      setFormData({
        title: existingBlock.title || "",
        category: existingBlock.category || "",
        duration: existingBlock.duration || "",
        location: existingBlock.locationType || "",
        description: existingBlock.description || "",
      });
    }
  }, [existingBlock]);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate(`/auth?redirect=${isEditMode ? `/edit/${id}` : '/create'}`);
    }
  }, [user, loading, navigate, isEditMode, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    // Validate input
    try {
      lifeBlockSchema.parse(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: { [key: string]: string } = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0] as string] = err.message;
          }
        });
        setFormErrors(errors);
        toast({
          title: "Validation Error",
          description: "Please fix the errors in the form.",
          variant: "destructive",
        });
        return;
      }
    }

    setIsSubmitting(true);

    try {
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to create a life block.",
          variant: "destructive",
        });
        navigate(`/auth?redirect=${isEditMode ? `/edit/${id}` : '/create'}`);
        return;
      }

      if (isEditMode) {
        // Update existing life block
        const { error } = await (supabase as any)
          .from("lifeBlock")
          .update({
            "title": formData.title,
            "category": formData.category,
            "duration": formData.duration,
            "locationType": formData.location,
            "description": formData.description,
          })
          .eq("id", id);

        if (error) throw error;

        toast({
          title: "Life Block Updated!",
          description: "Now let's update goals and tasks.",
        });

        navigate(`/edit/steps/${id}`);
      } else {
        // Create new life block
        const { data, error } = await (supabase as any)
          .from("lifeBlock")
          .insert({
            "title": formData.title,
            "category": formData.category,
            "duration": formData.duration,
            "locationType": formData.location,
            "description": formData.description,
            "created_by": user.id
          })
          .select()
          .single();

        if (error) throw error;

        toast({
          title: "Life Block Created!",
          description: "Now let's add goals and tasks to complete your experience.",
        });

        navigate(`/create/steps/${data.id}`);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${isEditMode ? 'update' : 'create'} life block. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || (isEditMode && loadingBlock)) {
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

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {isEditMode ? 'Edit Your' : 'Create Your'} <span className="bg-gradient-warm bg-clip-text text-transparent">Life Block</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              {isEditMode ? 'Update your life block details' : 'Share a snapshot of your routine or passion with the world'}
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
                  {formErrors.title && <p className="text-sm text-destructive">{formErrors.title}</p>}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select 
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
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
                    {formErrors.category && <p className="text-sm text-destructive">{formErrors.category}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration *</Label>
                    <Select 
                      value={formData.duration}
                      onValueChange={(value) => setFormData({ ...formData, duration: value })}
                    >
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
                    {formErrors.duration && <p className="text-sm text-destructive">{formErrors.duration}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location Type *</Label>
                  <Select 
                    value={formData.location}
                    onValueChange={(value) => setFormData({ ...formData, location: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select location type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Virtual">Virtual</SelectItem>
                      <SelectItem value="In-Person">In-Person</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.location && <p className="text-sm text-destructive">{formErrors.location}</p>}
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
                  {formErrors.description && <p className="text-sm text-destructive">{formErrors.description}</p>}
                </div>

                <div className="bg-muted/30 p-6 rounded-lg">
                  <h3 className="font-semibold mb-2">Next Steps</h3>
                  <p className="text-sm text-muted-foreground">
                    After submitting your life block, you'll be guided through adding micro-tasks, context notes, and reflection prompts to complete your experience.
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" variant="hero" className="flex-1" disabled={isSubmitting}>
                    {isSubmitting ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Update Life Block" : "Create Life Block")}
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
