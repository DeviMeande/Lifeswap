import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface ShareCardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  experience: {
    title: string;
    category: string;
    duration: string;
    locationType: string;
    description: string;
    image_url?: string;
  };
}

export const ShareCardModal = ({ open, onOpenChange, experience }: ShareCardModalProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Failed to get canvas context");

      // Instagram Story dimensions
      canvas.width = 1080;
      canvas.height = 1920;

      // Load and draw background image if available
      if (experience.image_url) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = experience.image_url || "";
        });
        
        ctx.drawImage(img, 0, 0, 1080, 1920);
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(0, 0, 1080, 1920);
      } else {
        // Gradient background
        const gradient = ctx.createLinearGradient(0, 0, 1080, 1920);
        gradient.addColorStop(0, "#8B5CF6");
        gradient.addColorStop(0.5, "#D946EF");
        gradient.addColorStop(1, "#F59E0B");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 1080, 1920);
      }

      // Category badge
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.roundRect(80, 120, 300, 60, 30);
      ctx.fill();
      ctx.fillStyle = "#8B5CF6";
      ctx.font = "bold 32px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(experience.category, 230, 165);

      // Title
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 72px sans-serif";
      ctx.textAlign = "left";
      const words = experience.title.split(" ");
      let line = "";
      let y = 280;
      words.forEach((word) => {
        const testLine = line + word + " ";
        const metrics = ctx.measureText(testLine);
        if (metrics.width > 920 && line !== "") {
          ctx.fillText(line, 80, y);
          line = word + " ";
          y += 90;
        } else {
          line = testLine;
        }
      });
      ctx.fillText(line, 80, y);

      // Description
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.font = "32px sans-serif";
      const descWords = experience.description.split(" ");
      line = "";
      y += 120;
      const maxLines = 4;
      let lineCount = 0;
      descWords.forEach((word) => {
        if (lineCount >= maxLines) return;
        const testLine = line + word + " ";
        const metrics = ctx.measureText(testLine);
        if (metrics.width > 920 && line !== "") {
          ctx.fillText(line, 80, y);
          line = word + " ";
          y += 50;
          lineCount++;
        } else {
          line = testLine;
        }
      });
      if (lineCount < maxLines) ctx.fillText(line, 80, y);

      // Info badges at bottom
      ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
      ctx.roundRect(80, 1520, 200, 70, 20);
      ctx.fill();
      ctx.roundRect(300, 1520, 220, 70, 20);
      ctx.fill();

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "28px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`⏱️ ${experience.duration}`, 180, 1565);
      ctx.fillText(`📍 ${experience.locationType}`, 410, 1565);

      // CTA box
      ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
      ctx.roundRect(80, 1630, 920, 160, 24);
      ctx.fill();
      
      ctx.fillStyle = "#8B5CF6";
      ctx.font = "bold 40px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Start Your Journey", 540, 1700);
      
      ctx.fillStyle = "#666666";
      ctx.font = "28px sans-serif";
      ctx.fillText(`Visit ${window.location.hostname}`, 540, 1755);

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (!blob) {
          toast({
            title: "Error",
            description: "Failed to generate image",
            variant: "destructive",
          });
          return;
        }

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = `${experience.title.replace(/\s+/g, "-")}-story.png`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);

        toast({
          title: "Downloaded!",
          description: "Your Instagram Story card is ready to share",
        });
      });
    } catch (error) {
      console.error("Error generating card:", error);
      toast({
        title: "Error",
        description: "Failed to generate card",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Share to Instagram Story</DialogTitle>
          <DialogDescription>
            Download this card and share it on your Instagram Story
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* Preview - Shows what will be generated */}
          <div className="bg-muted rounded-lg p-4 overflow-hidden">
            <div
              className="w-[270px] h-[480px] mx-auto relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent"
              style={{
                backgroundImage: experience.image_url
                  ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${experience.image_url})`
                  : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 p-8 flex flex-col justify-between">
                <div>
                  <div className="inline-block px-4 py-1.5 bg-white/90 rounded-full text-xs font-semibold text-primary mb-4">
                    {experience.category}
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-3 leading-tight">
                    {experience.title}
                  </h2>
                  <p className="text-white/90 text-sm line-clamp-4">
                    {experience.description}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-white">
                    <div className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-xs">
                      ⏱️ {experience.duration}
                    </div>
                    <div className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-xs">
                      📍 {experience.locationType}
                    </div>
                  </div>

                  <div className="bg-white/95 rounded-xl p-4 text-center">
                    <p className="text-xs font-semibold text-primary mb-1">
                      Start Your Journey
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Visit {window.location.hostname}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Button
            onClick={handleDownload}
            disabled={isGenerating}
            className="w-full"
            size="lg"
          >
            <Download className="w-4 h-4 mr-2" />
            {isGenerating ? "Generating..." : "Download Story Card"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
