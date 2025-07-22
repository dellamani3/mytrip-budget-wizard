import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plane, MapPin, Calendar, Sparkles, ArrowRight, DollarSign, Star, Globe } from "lucide-react";
import heroImage from "@/assets/travel-hero.jpg";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Hero Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-ocean/80"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                <Plane className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">MYTripGenie</h1>
            </div>
            <Button 
              variant="outline" 
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              onClick={() => navigate("/login")}
            >
              Sign In
            </Button>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6">
              <Badge className="bg-white/20 text-white border-white/30 mb-4">
                <Sparkles className="h-4 w-4 mr-2" />
                AI-Powered Travel Planning
              </Badge>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Your Perfect Trip,
              <span className="bg-gradient-sunset bg-clip-text text-transparent block">
                Planned by AI
              </span>
            </h1>
            
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Tell us your budget, preferences, and dreams. Our AI creates personalized itineraries 
              with flights, accommodations, and activities tailored just for you.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                variant="travel" 
                size="lg" 
                onClick={() => navigate("/login")}
                className="text-lg px-8 py-6"
              >
                Start Planning Your Trip
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 text-lg px-8 py-6"
              >
                See How It Works
              </Button>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardHeader>
                  <div className="bg-secondary/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                    <DollarSign className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-center">Budget-Optimized</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-white/80 text-center">
                    Get the best value for your money with AI-optimized flight and hotel combinations
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardHeader>
                  <div className="bg-accent/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-center">Smart Destinations</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-white/80 text-center">
                    Don't know where to go? Our AI suggests perfect destinations based on your preferences
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardHeader>
                  <div className="bg-primary-glow/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-center">Complete Itineraries</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-white/80 text-center">
                    Day-by-day plans with activities, restaurants, and local experiences included
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center text-white">
              <div>
                <div className="text-3xl font-bold mb-2">10,000+</div>
                <div className="text-white/80">Trips Planned</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">150+</div>
                <div className="text-white/80">Countries</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">95%</div>
                <div className="text-white/80">Satisfaction Rate</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">30%</div>
                <div className="text-white/80">Average Savings</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
