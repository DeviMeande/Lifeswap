import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { X, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { goalSchema, taskSchema } from "@/lib/validationSchemas";
import { z } from "zod";

interface Task {
  title: string;
  description: string;
  duration: string;
}

const LifeBlockSteps = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [goals, setGoals] = useState<string[]>([""]);
  const [tasks, setTasks] = useState<Task[]>([{ title: "", description: "", duration: "" }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [goalErrors, setGoalErrors] = useState<{ [key: number]: string }>({});
  const [taskErrors, setTaskErrors] = useState<{ [key: number]: { [field: string]: string } }>({});
  const isEditMode = window.location.pathname.includes('/edit/');

  // Fetch existing goals and tasks if editing
  const { data: existingBlock } = useQuery({
    queryKey: ['lifeBlock', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await (supabase as any)
        .from('lifeBlock')
        .select('goals')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id && isEditMode,
  });

  const { data: existingTasks } = useQuery({
    queryKey: ['lifeBlockTasks', id],
    queryFn: async () => {
      if (!id) return [];
      const { data, error } = await (supabase as any)
        .from('lifeBlockTasks')
        .select('*')
        .eq('lifeBlockId', id);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!id && isEditMode,
  });

  // Load existing data
  useEffect(() => {
    if (existingBlock?.goals && existingBlock.goals.length > 0) {
      setGoals(existingBlock.goals);
    }
  }, [existingBlock]);

  useEffect(() => {
    if (existingTasks && existingTasks.length > 0) {
      setTasks(existingTasks.map((task: any) => ({
        title: task.title || "",
        description: task.description || "",
        duration: task.duration || "",
      })));
    }
  }, [existingTasks]);

  const addGoal = () => {
    setGoals([...goals, ""]);
  };

  const removeGoal = (index: number) => {
    setGoals(goals.filter((_, i) => i !== index));
  };

  const updateGoal = (index: number, value: string) => {
    const newGoals = [...goals];
    newGoals[index] = value;
    setGoals(newGoals);
  };

  const addTask = () => {
    setTasks([...tasks, { title: "", description: "", duration: "" }]);
  };

  const removeTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const updateTask = (index: number, field: keyof Task, value: string) => {
    const newTasks = [...tasks];
    newTasks[index][field] = value;
    setTasks(newTasks);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGoalErrors({});
    setTaskErrors({});

    // Validate goals
    const filteredGoals: string[] = [];
    const newGoalErrors: { [key: number]: string } = {};
    
    goals.forEach((goal, index) => {
      if (goal.trim() === "") return; // Skip empty goals
      
      try {
        goalSchema.parse(goal);
        filteredGoals.push(goal);
      } catch (error) {
        if (error instanceof z.ZodError) {
          newGoalErrors[index] = error.errors[0].message;
        }
      }
    });

    // Validate tasks
    const validTasks: Task[] = [];
    const newTaskErrors: { [key: number]: { [field: string]: string } } = {};
    
    tasks.forEach((task, index) => {
      // Skip completely empty tasks
      if (!task.title.trim() && !task.description.trim() && !task.duration.trim()) {
        return;
      }
      
      try {
        taskSchema.parse(task);
        validTasks.push(task);
      } catch (error) {
        if (error instanceof z.ZodError) {
          const taskError: { [field: string]: string } = {};
          error.errors.forEach((err) => {
            if (err.path[0]) {
              taskError[err.path[0] as string] = err.message;
            }
          });
          newTaskErrors[index] = taskError;
        }
      }
    });

    // Show errors if any
    if (Object.keys(newGoalErrors).length > 0 || Object.keys(newTaskErrors).length > 0) {
      setGoalErrors(newGoalErrors);
      setTaskErrors(newTaskErrors);
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {

      // Update life block with goals
      const { error: goalsError } = await (supabase as any)
        .from("lifeBlock")
        .update({ goals: filteredGoals })
        .eq("id", id);

      if (goalsError) throw goalsError;

      // If editing, delete existing tasks first
      if (isEditMode) {
        const { error: deleteError } = await (supabase as any)
          .from("lifeBlockTasks")
          .delete()
          .eq("lifeBlockId", id);

        if (deleteError) throw deleteError;
      }

      // Filter out empty tasks and insert into lifeBlockTasks
      const validTasks = tasks.filter(task => task.title.trim() !== "");
      
      if (validTasks.length > 0) {
        const tasksToInsert = validTasks.map(task => ({
          title: task.title,
          description: task.description,
          duration: task.duration,
          lifeBlockId: parseInt(id!),
          created_at: new Date(),
        }));

        const { error: tasksError } = await (supabase as any)
          .from("lifeBlockTasks")
          .insert(tasksToInsert);

        if (tasksError) throw tasksError;
      }

      toast({
        title: isEditMode ? "Life Block Updated!" : "Life Block Completed!",
        description: "Your goals and tasks have been saved successfully.",
      });

      navigate(isEditMode ? "/profile" : "/explore");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save goals and tasks. Please try again.",
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
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {isEditMode ? 'Edit Your' : 'Complete Your'} <span className="bg-gradient-warm bg-clip-text text-transparent">Life Block</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              {isEditMode ? 'Update goals and tasks for your experience' : 'Add goals and tasks to make your experience actionable'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Goals Section */}
            <Card>
              <CardHeader>
                <CardTitle>Learning Goals</CardTitle>
                <p className="text-sm text-muted-foreground">
                  What should participants take away from this experience?
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {goals.map((goal, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        placeholder={`Goal ${index + 1}`}
                        value={goal}
                        onChange={(e) => updateGoal(index, e.target.value)}
                      />
                      {goals.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeGoal(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    {goalErrors[index] && <p className="text-sm text-destructive">{goalErrors[index]}</p>}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addGoal}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Goal
                </Button>
              </CardContent>
            </Card>

            {/* Tasks Section */}
            <Card>
              <CardHeader>
                <CardTitle>Micro-Tasks</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Break down the experience into specific, actionable steps
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {tasks.map((task, index) => (
                  <div key={index} className="space-y-4 p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold">Task {index + 1}</h4>
                      {tasks.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeTask(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`task-title-${index}`}>Task Title *</Label>
                      <Input
                        id={`task-title-${index}`}
                        placeholder="e.g., Prepare coffee station"
                        value={task.title}
                        onChange={(e) => updateTask(index, "title", e.target.value)}
                        required={index === 0}
                      />
                      {taskErrors[index]?.title && <p className="text-sm text-destructive">{taskErrors[index].title}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`task-description-${index}`}>Description</Label>
                      <Textarea
                        id={`task-description-${index}`}
                        placeholder="Describe what needs to be done..."
                        value={task.description}
                        onChange={(e) => updateTask(index, "description", e.target.value)}
                        rows={3}
                      />
                      {taskErrors[index]?.description && <p className="text-sm text-destructive">{taskErrors[index].description}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`task-duration-${index}`}>Duration</Label>
                      <Select
                        value={task.duration}
                        onValueChange={(value) => updateTask(index, "duration", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5 mins">5 mins</SelectItem>
                          <SelectItem value="10 mins">10 mins</SelectItem>
                          <SelectItem value="15 mins">15 mins</SelectItem>
                          <SelectItem value="30 mins">30 mins</SelectItem>
                          <SelectItem value="45 mins">45 mins</SelectItem>
                          <SelectItem value="1 hour">1 hour</SelectItem>
                        </SelectContent>
                      </Select>
                      {taskErrors[index]?.duration && <p className="text-sm text-destructive">{taskErrors[index].duration}</p>}
                    </div>
                  </div>
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={addTask}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Task
                </Button>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button 
                type="submit" 
                variant="hero" 
                className="flex-1" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : (isEditMode ? "Update Life Block" : "Complete Life Block")}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1" 
                onClick={() => navigate(isEditMode ? "/profile" : "/explore")}
                disabled={isSubmitting}
              >
                Skip for Now
              </Button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LifeBlockSteps;
