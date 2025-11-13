import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Mail, Calendar, CheckCircle2, Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

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

  const completedExperiences = userExperiences?.map((exp: any) => ({
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
                      {completedExperiences.length} Experiences
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
          <Tabs defaultValue="completed" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="completed">Completed Experiences</TabsTrigger>
              <TabsTrigger value="created">My Life Blocks</TabsTrigger>
              <TabsTrigger value="settings">Account Settings</TabsTrigger>
            </TabsList>

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
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-semibold">{experience.title}</h3>
                            <Badge variant="secondary">{experience.category}</Badge>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant={experience.status === "In-Progress" ? "default" : "outline"}>
                              {experience.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>Started on {experience.startedDate}</span>
                          </div>
                        </div>
                        <CheckCircle2 className="w-6 h-6 text-secondary" />
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
                      <Input id="name" defaultValue={userProfile?.name || ''} className="mt-2" />
                    </div>

                    <div>
                      <Label htmlFor="username" className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Username
                      </Label>
                      <Input id="username" defaultValue={userProfile?.userName || ''} className="mt-2" />
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
                        className="mt-2"
                        placeholder="Tell us about yourself..."
                        rows={4}
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <Button variant="hero">Save Changes</Button>
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
