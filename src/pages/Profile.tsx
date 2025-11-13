import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Mail, Calendar, CheckCircle2, Package, Edit, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { profileSchema } from "@/lib/validationSchemas";
import { z } from "zod";

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    name: '',
    userName: '',
    bio: ''
  });
  const [formErrors, setFormErrors] = useState<{ name?: string; userName?: string }>({});

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth?redirect=/profile");
    }
  }, [user, authLoading, navigate]);

  // Fetch user profile data
  const { data: userProfile } = useQuery({
    queryKey: ['userProfile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await (supabase as any)
        .from('user')
        .select('userName, name')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Update form data when profile loads
  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || '',
        userName: userProfile.userName || '',
        bio: ''
      });
    }
  }, [userProfile]);

  // Handle profile update with validation
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    // Validate input
    try {
      profileSchema.parse({ name: formData.name, userName: formData.userName });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: { name?: string; userName?: string } = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0] as keyof typeof errors] = err.message;
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

    updateProfileMutation.mutate({ name: formData.name, userName: formData.userName });
  };

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: { name: string; userName: string }) => {
      if (!user) throw new Error("No user");
      
      const { error } = await (supabase as any)
        .from('user')
        .update({
          name: data.name,
          userName: data.userName
        })
        .eq('id', user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile', user?.id] });
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
      console.error("Profile update error:", error);
    },
  });

  // Complete experience mutation
  const completeExperienceMutation = useMutation({
    mutationFn: async (experienceId: number) => {
      if (!user) throw new Error("No user");
      
      const { error } = await (supabase as any)
        .from('userwiseExperiences')
        .update({ status: 'Completed' })
        .eq('id', experienceId)
        .eq('user_id', user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userExperiences', user?.id] });
      toast({
        title: "Experience completed!",
        description: "Great job completing this experience.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update experience. Please try again.",
        variant: "destructive",
      });
      console.error("Experience update error:", error);
    },
  });

  const handleSaveChanges = () => {
    updateProfileMutation.mutate({
      name: formData.name,
      userName: formData.userName
    });
  };

  const handleCompleteExperience = (experienceId: number) => {
    completeExperienceMutation.mutate(experienceId);
  };

  const { data: userExperiences, isLoading: loadingExperiences } = useQuery({
    queryKey: ['userExperiences', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await (supabase as any)
        .from('userwiseExperiences')
        .select(`
          *,
          lifeBlock:lifeblock (
            title,
            category,
            duration
          )
        `)
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const { data: createdBlocks, isLoading: loadingBlocks } = useQuery({
    queryKey: ['createdBlocks', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await (supabase as any)
        .from('lifeBlock')
        .select('*')
        .eq('created_by', user.id);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  if (authLoading) {
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

  const completedExperiences = userExperiences?.filter((exp: any) => 
    exp.status === "Completed"
  ).map((exp: any) => ({
    id: exp.id,
    title: exp.lifeBlock?.title || "Unknown Experience",
    status: exp.status,
    category: exp.lifeBlock?.category || "Uncategorized",
    startedDate: new Date(exp.created_at).toLocaleDateString(),
  })) || [];

  const inProgressExperiences = userExperiences?.filter((exp: any) => 
    exp.status === "In-Progress"
  ).map((exp: any) => ({
    id: exp.id,
    title: exp.lifeBlock?.title || "Unknown Experience",
    status: exp.status,
    category: exp.lifeBlock?.category || "Uncategorized",
    startedDate: new Date(exp.created_at).toLocaleDateString(),
  })) || [];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}`} alt="User" />
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl">{userProfile?.name?.charAt(0)?.toUpperCase() || userProfile?.userName?.charAt(0)?.toUpperCase() || 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl font-bold text-foreground mb-2">{userProfile?.name || userProfile?.userName || 'User'}</h1>
                  <p className="text-muted-foreground mb-4">{user?.email}</p>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    <Badge variant="secondary">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      {completedExperiences.length} Completed
                    </Badge>
                    <Badge variant="secondary">
                      <Clock className="w-3 h-3 mr-1" />
                      {inProgressExperiences.length} In Progress
                    </Badge>
                    <Badge variant="secondary">
                      <Package className="w-3 h-3 mr-1" />
                      {createdBlocks?.length || 0} Life Blocks
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs for different sections */}
          <Tabs defaultValue="in-progress" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="in-progress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="created">My Life Blocks</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* In Progress Experiences Tab */}
            <TabsContent value="in-progress" className="space-y-4">
              {loadingExperiences ? (
                <Card>
                  <CardContent className="pt-6 text-center py-12">
                    <p className="text-muted-foreground">Loading experiences...</p>
                  </CardContent>
                </Card>
              ) : inProgressExperiences.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center py-12">
                    <Clock className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No experiences in progress.</p>
                    <Button variant="hero" className="mt-4" asChild>
                      <Link to="/explore">Explore Experiences</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                inProgressExperiences.map((experience: any) => (
                  <Card key={experience.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-semibold">{experience.title}</h3>
                            <Badge variant="secondary">{experience.category}</Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>Started on {experience.startedDate}</span>
                          </div>
                        </div>
                        <Badge variant="default" className="ml-2">
                          {experience.status}
                        </Badge>
                      </div>
                      <Button 
                        variant="hero" 
                        size="sm"
                        onClick={() => handleCompleteExperience(experience.id)}
                        disabled={completeExperienceMutation.isPending}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        {completeExperienceMutation.isPending ? "Completing..." : "Mark as Complete"}
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            {/* Completed Experiences Tab */}
            <TabsContent value="completed" className="space-y-4">
              {loadingExperiences ? (
                <Card>
                  <CardContent className="pt-6 text-center py-12">
                    <p className="text-muted-foreground">Loading experiences...</p>
                  </CardContent>
                </Card>
              ) : completedExperiences.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center py-12">
                    <CheckCircle2 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No experiences yet. Start exploring!</p>
                    <Button variant="hero" className="mt-4" asChild>
                      <Link to="/explore">Explore Experiences</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                completedExperiences.map((experience: any) => (
                  <Card key={experience.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-semibold">{experience.title}</h3>
                            <Badge variant="secondary">{experience.category}</Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>Started on {experience.startedDate}</span>
                          </div>
                        </div>
                        <Badge variant="outline" className="ml-2">
                          {experience.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            {/* Created Life Blocks Tab */}
            <TabsContent value="created" className="space-y-4">
              {loadingBlocks ? (
                <Card>
                  <CardContent className="pt-6 text-center py-12">
                    <p className="text-muted-foreground">Loading life blocks...</p>
                  </CardContent>
                </Card>
              ) : !createdBlocks || createdBlocks.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center py-12">
                    <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">You haven't created any life blocks yet.</p>
                    <Button variant="hero" className="mt-4" asChild>
                      <Link to="/create">Create Life Block</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                createdBlocks.map((block: any) => (
                  <Card key={block.id} className="hover:shadow-elevated transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-foreground mb-2">{block.title}</h3>
                          <p className="text-muted-foreground text-sm mb-2">
                            {block.duration || "Not specified"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge>{block.category || "Uncategorized"}</Badge>
                          <Button 
                            variant="outline" 
                            size="sm"
                            asChild
                          >
                            <Link to={`/edit/${block.id}`}>
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            {/* Account Settings Tab */}
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Full Name
                      </Label>
                      <Input 
                        id="name" 
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="mt-2" 
                      />
                      {formErrors.name && <p className="text-sm text-destructive mt-1">{formErrors.name}</p>}
                    </div>

                    <div>
                      <Label htmlFor="username" className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Username
                      </Label>
                      <Input 
                        id="username" 
                        value={formData.userName}
                        onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                        className="mt-2" 
                      />
                      {formErrors.userName && <p className="text-sm text-destructive mt-1">{formErrors.userName}</p>}
                    </div>

                    <div>
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email Address
                      </Label>
                      <Input id="email" type="email" defaultValue={user?.email || ''} className="mt-2" disabled />
                    </div>

                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea 
                        id="bio" 
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        className="mt-2"
                        placeholder="Tell us about yourself..."
                        rows={4}
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <Button 
                      variant="hero" 
                      onClick={handleSaveChanges}
                      disabled={updateProfileMutation.isPending}
                    >
                      {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
