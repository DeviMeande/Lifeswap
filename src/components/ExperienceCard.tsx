import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

interface ExperienceCardProps {
  id: number;
  title: string;
  author?: string;
  creatorName?: string;
  duration: string;
  location: string;
  category: string;
  description: string;
  image?: string;
}

const ExperienceCard = ({ id, title, author, creatorName, duration, location, category, description }: ExperienceCardProps) => {
  const displayName = creatorName || author || "LifeSwap User";
  return (
    <Link to={`/experience/${id}`}>
      <Card className="overflow-hidden hover:shadow-elevated transition-all duration-300 h-full group cursor-pointer">
        <div className="h-48 bg-gradient-warm relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
          <div className="absolute bottom-4 left-4 right-4">
            <Badge className="bg-background/90 text-foreground border-0 mb-2">{category}</Badge>
          </div>
        </div>
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{title}</h3>
          <p className="text-muted-foreground text-sm mb-4">by {displayName}</p>
          <p className="text-foreground/80 mb-4 line-clamp-2">{description}</p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {duration}
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {location}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ExperienceCard;
