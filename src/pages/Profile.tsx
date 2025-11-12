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

const Profile = () => {
  // Mock data for completed experiences
  const completedExperiences = [
    {
      id: 1,
      title: "Morning as a Barista",
      host: "Sarah Chen",
      completedDate: "2024-01-15",
      category: "Creative"
    },
    {
      id: 2,
      title: "Afternoon as a UX Designer",
      host: "Marcus Johnson",
      completedDate: "2024-01-10",
      category: "Professional"
    },
    {
      id: 3,
      title: "Evening at Food Kitchen",
      host: "Elena Rodriguez",
      completedDate: "2024-01-05",
      category: "Community"
    }
  ];

  // Mock data for created life blocks
  const createdBlocks = [
    {
      id: 1,
      title: "Day as a Software Developer",
      participants: 12,
      category: "Professional",
      status: "Active"
    },
    {
      id: 2,
      title: "Weekend Gardening Session",
      participants: 8,
      category: "Lifestyle",
      status: "Active"
    }
  ];

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
                  <AvatarImage src="/placeholder.svg" alt="User" />
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl">JD</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl font-bold text-foreground mb-2">John Doe</h1>
                  <p className="text-muted-foreground mb-4">Life Explorer • Empathy Builder</p>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    <Badge variant="secondary">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      {completedExperiences.length} Experiences
                    </Badge>
                    <Badge variant="secondary">
                      <Package className="w-3 h-3 mr-1" />
                      {createdBlocks.length} Life Blocks
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
              {completedExperiences.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center py-12">
                    <CheckCircle2 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No completed experiences yet. Start exploring!</p>
                    <Button variant="hero" className="mt-4" asChild>
                      <a href="/explore">Browse Experiences</a>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                completedExperiences.map((exp) => (
                  <Card key={exp.id} className="hover:shadow-elevated transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-foreground mb-2">{exp.title}</h3>
                          <p className="text-muted-foreground text-sm mb-2">Hosted by {exp.host}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            Completed on {new Date(exp.completedDate).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge>{exp.category}</Badge>
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            {/* Created Life Blocks Tab */}
            <TabsContent value="created" className="space-y-4">
              {createdBlocks.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center py-12">
                    <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">You haven't created any life blocks yet.</p>
                    <Button variant="hero" className="mt-4" asChild>
                      <a href="/create">Create Life Block</a>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                createdBlocks.map((block) => (
                  <Card key={block.id} className="hover:shadow-elevated transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-foreground mb-2">{block.title}</h3>
                          <p className="text-muted-foreground text-sm mb-2">
                            {block.participants} participants
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge>{block.category}</Badge>
                          <Badge variant="secondary">{block.status}</Badge>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm">View</Button>
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
                      <Input id="name" defaultValue="John Doe" className="mt-2" />
                    </div>

                    <div>
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email Address
                      </Label>
                      <Input id="email" type="email" defaultValue="john.doe@example.com" className="mt-2" />
                    </div>

                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Input 
                        id="bio" 
                        defaultValue="Life Explorer • Empathy Builder" 
                        className="mt-2"
                        placeholder="Tell us about yourself..."
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
