import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, DollarSign, Calendar, Sparkles, ArrowRight, Heart, Plane } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DestinationSearch from "@/components/DestinationSearch";
import DepartureCitySearch from "@/components/DepartureCitySearch";

const TripPlanner = () => {
  const [budget, setBudget] = useState([2000]);
  const [destination, setDestination] = useState("");
  const [travelers, setTravelers] = useState("");
  const [duration, setDuration] = useState("");
  const [travelStyle, setTravelStyle] = useState("");
  const [specialRequirements, setSpecialRequirements] = useState("");
  const [departureCity, setDepartureCity] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleGenerateTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!travelers || !duration) {
      toast({
        title: "Missing Information",
        description: "Please fill in at least the number of travelers and trip duration.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Get authentication token
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please log in to generate a trip plan.",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      const response = await fetch('http://localhost:5000/api/trips/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          destination: destination || null,
          budget: budget[0],
          travelers,
          duration,
          travelStyle: travelStyle || null,
          specialRequirements: specialRequirements || null,
          departureCity: departureCity || null
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Trip Generated!",
          description: "Your personalized travel plan is ready!",
        });
        
        // Pass trip data to results page
        navigate("/results", {
          state: {
            tripId: data.data.trip.id,
            budget: budget[0],
            destination: data.data.trip.destination,
            travelers,
            duration,
            travelStyle,
            specialRequirements,
            tripData: data.data.trip.tripData
          }
        });
      } else {
        toast({
          title: "Trip Generation Failed",
          description: data.message || "Unable to generate trip plan. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Trip generation error:', error);
      toast({
        title: "Connection Error",
        description: "Unable to connect to the server. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const budgetRanges = [
    { min: 500, max: 1000, label: "Budget" },
    { min: 1000, max: 3000, label: "Moderate" },
    { min: 3000, max: 7000, label: "Comfortable" },
    { min: 7000, max: 15000, label: "Luxury" },
  ];

  const getCurrentBudgetLabel = (value: number) => {
    const range = budgetRanges.find(r => value >= r.min && value <= r.max);
    return range ? range.label : "Custom";
  };

  return (
    <div className="min-h-screen bg-gradient-sky">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Plan Your Dream Trip</h1>
          <p className="text-white/90 text-lg">Tell us your preferences and let AI create the perfect itinerary</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-travel">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                Trip Preferences
              </CardTitle>
              <CardDescription>
                Provide your details below and our AI will craft a personalized travel experience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGenerateTrip} className="space-y-6">
                {/* Budget Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-secondary" />
                      Budget Range
                    </Label>
                    <Badge variant="secondary">
                      ${budget[0].toLocaleString()} - {getCurrentBudgetLabel(budget[0])}
                    </Badge>
                  </div>
                  <Slider
                    value={budget}
                    onValueChange={setBudget}
                    max={15000}
                    min={500}
                    step={100}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>$500</span>
                    <span>$15,000+</span>
                  </div>
                </div>

                {/* Destination and Travelers Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <DestinationSearch
                    value={destination}
                    onChange={setDestination}
                  />

                  <div className="space-y-2">
                    <Label htmlFor="travelers" className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      Number of Travelers *
                    </Label>
                    <Select value={travelers} onValueChange={setTravelers}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select travelers" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Solo Traveler</SelectItem>
                        <SelectItem value="2">Couple (2 people)</SelectItem>
                        <SelectItem value="3-4">Small Group (3-4 people)</SelectItem>
                        <SelectItem value="5-8">Family/Friends (5-8 people)</SelectItem>
                        <SelectItem value="9+">Large Group (9+ people)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Duration and Travel Style Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="duration" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-secondary" />
                      Trip Duration *
                    </Label>
                    <Select value={duration} onValueChange={setDuration}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2-3">Weekend (2-3 days)</SelectItem>
                        <SelectItem value="4-6">Short Trip (4-6 days)</SelectItem>
                        <SelectItem value="7-10">Week-long (7-10 days)</SelectItem>
                        <SelectItem value="11-14">Extended (11-14 days)</SelectItem>
                        <SelectItem value="15+">Long Journey (15+ days)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="travel-style">Travel Style</Label>
                    <Select value={travelStyle} onValueChange={setTravelStyle}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose your style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="adventure">Adventure & Outdoor</SelectItem>
                        <SelectItem value="cultural">Cultural & Historical</SelectItem>
                        <SelectItem value="relaxation">Beach & Relaxation</SelectItem>
                        <SelectItem value="city">City & Urban</SelectItem>
                        <SelectItem value="nature">Nature & Wildlife</SelectItem>
                        <SelectItem value="luxury">Luxury & Fine Dining</SelectItem>
                        <SelectItem value="budget">Backpacking & Budget</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Departure City */}
                <div className="space-y-2">
                  <Label htmlFor="departure-city" className="flex items-center gap-2">
                    <Plane className="h-4 w-4 text-secondary" />
                    Departure City
                  </Label>
                  <DepartureCitySearch
                    value={departureCity}
                    onValueChange={setDepartureCity}
                  />
                </div>

                {/* Special Requirements */}
                <div className="space-y-2">
                  <Label htmlFor="requirements">Special Requirements</Label>
                  <Textarea
                    id="requirements"
                    placeholder="e.g., traveling with kids, dietary restrictions, accessibility needs, specific interests..."
                    value={specialRequirements}
                    onChange={(e) => setSpecialRequirements(e.target.value)}
                    rows={3}
                  />
                </div>

                {/* Generate Button */}
                <Button 
                  type="submit" 
                  className="w-full" 
                  variant="travel"
                  size="lg"
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                      Generating Your Perfect Trip...
                    </>
                  ) : (
                    <>
                      Generate My Trip Plan
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TripPlanner;