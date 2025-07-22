import { useLocation, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Plane, 
  Hotel, 
  Car, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Star,
  Download,
  Share2,
  ArrowLeft,
  Coffee,
  Camera,
  Utensils,
  Check,
  Clock,
  Users,
  ExternalLink,
  Info
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import FlightPricingInfo from "@/components/FlightPricingInfo";
import { AITripChat } from "@/components/AITripChat";

const TripResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const tripData = location.state;

  // Use real trip data from the backend
  const realTripData = tripData?.tripData;
  
  // Flight options from backend API
  const flightOptions = realTripData?.flightOptions || [
    {
      id: "economy",
      airline: "SkyConnect Airlines",
      type: "Economy Class",
      route: "Your City → Bali",
      duration: "14h 30m (1 stop)",
      cost: Math.floor((tripData?.budget || 2000) * 0.35),
      departure: "08:30 AM",
      arrival: "11:00 PM (+1 day)",
      stopover: "Singapore (2h 30m)",
      aircraft: "Boeing 787-9",
      baggage: "23kg checked, 7kg carry-on",
      meals: "2 meals included",
      entertainment: "Personal screen with 1000+ movies",
      bookingLink: "https://skyconnect.com/book/flight123"
    }
  ];

  // Accommodation options from backend API
  const accommodationOptions = realTripData?.accommodationOptions || [
    {
      id: "standard",
      name: "Tropical Paradise Resort",
      type: "4-star beachfront resort",
      cost: Math.floor((tripData?.budget || 2000) * 0.35),
      amenities: ["Pool", "Spa", "Beach Access", "Free WiFi"],
      location: "Premium Beach Area",
      description: "Elegant resort offering perfect blend of comfort and traditional hospitality",
      roomType: "Deluxe Ocean View Room",
      checkIn: "3:00 PM",
      checkOut: "12:00 PM",
      included: ["Daily breakfast", "Airport shuttle", "Welcome drink", "Beach activities"],
      facilities: ["3 restaurants", "Infinity pool", "Spa & wellness center", "Kids club", "Fitness center"],
      distance: "Beachfront location, 15 min to shopping center",
      cancellation: "Free cancellation up to 48 hours",
      rating: "4.6/5 (Based on 2,180 reviews)",
      bookingLink: "https://tropicalparadise.com/book/room456"
    }
  ];

  // State for selected options and dialog
  const [selectedFlight, setSelectedFlight] = useState("economy");
  const [selectedAccommodation, setSelectedAccommodation] = useState("standard");
  const [flightDialogOpen, setFlightDialogOpen] = useState(false);
  const [selectedFlightDetails, setSelectedFlightDetails] = useState(null);
  const [accommodationDialogOpen, setAccommodationDialogOpen] = useState(false);
  const [selectedAccommodationDetails, setSelectedAccommodationDetails] = useState(null);

  // Calculate dynamic costs with safety checks
  const selectedFlightOption = flightOptions.find(f => f.id === selectedFlight) || flightOptions[0];
  const selectedAccommodationOption = accommodationOptions.find(a => a.id === selectedAccommodation) || accommodationOptions[1];
  
  // Use activities from backend API with state for AI chat updates
  const [activities, setActivities] = useState(realTripData?.activities || [
    { day: 1, title: "Arrival & Local Exploration", cost: 50, type: "culture" },
    { day: 2, title: "Cultural Tour & Sightseeing", cost: 80, type: "sightseeing" },
    { day: 3, title: "Adventure Activity", cost: 100, type: "adventure" },
    { day: 4, title: "Relaxation & Spa", cost: 70, type: "relaxation" },
    { day: 5, title: "Local Experience", cost: 60, type: "culture" },
    { day: 6, title: "Shopping & Leisure", cost: 40, type: "shopping" },
    { day: 7, title: "Departure Preparation", cost: 30, type: "relaxation" }
  ]);

  // Handle itinerary updates from AI chat
  const handleItineraryUpdate = (updatedActivities: any[], dayNumber: number) => {
    setActivities(prevActivities => {
      const newActivities = [...prevActivities];
      
      // Create new activities for the specified day
      const newDayActivities = updatedActivities.map((activity, index) => ({
        day: dayNumber,
        title: activity.activity || activity.title,
        cost: parseInt(activity.cost?.replace(/[^0-9]/g, '') || '50'),
        type: activity.category || activity.type || 'culture',
        time: activity.time,
        description: activity.description,
        duration: activity.duration
      }));

      // Remove existing activities for this day and add new ones
      const filteredActivities = newActivities.filter(act => act.day !== dayNumber);
      return [...filteredActivities, ...newDayActivities].sort((a, b) => a.day - b.day);
    });

    toast({
      title: "Itinerary Updated!",
      description: `Day ${dayNumber} has been customized according to your preferences.`,
    });
  };
  
  const staticCosts = {
    transport: Math.floor((tripData?.budget || 2000) * 0.1),
    activities: activities
  };

  const totalActivitiesCost = activities.reduce((sum, act) => sum + act.cost, 0);
  
  const totalCost = useMemo(() => {
    return (selectedFlightOption?.cost || 0) + 
           (selectedAccommodationOption?.cost || 0) + 
           staticCosts.transport + 
           totalActivitiesCost;
  }, [selectedFlightOption, selectedAccommodationOption, staticCosts.transport, totalActivitiesCost]);

  const generatedTrip = {
    destination: tripData?.destination || "AI-Generated Destination",
    duration: tripData?.duration || "7-10",
    travelers: tripData?.travelers || "2"
  };

  const handleShare = () => {
    toast({
      title: "Trip Shared!",
      description: "Your trip plan has been copied to clipboard.",
    });
  };

  const handleDownload = () => {
    toast({
      title: "Downloaded!",
      description: "Your trip plan has been saved as PDF.",
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "culture": return <Camera className="h-4 w-4" />;
      case "adventure": return <MapPin className="h-4 w-4" />;
      case "relaxation": return <Coffee className="h-4 w-4" />;
      case "sightseeing": return <Star className="h-4 w-4" />;
      case "shopping": return <Utensils className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  const handleFlightDetails = (flight) => {
    setSelectedFlightDetails(flight);
    setFlightDialogOpen(true);
  };

  const handleBookFlight = (bookingLink) => {
    window.open(bookingLink, '_blank');
    toast({
      title: "Redirecting to booking...",
      description: "Opening airline website in a new tab.",
    });
  };

  const handleAccommodationDetails = (accommodation) => {
    setSelectedAccommodationDetails(accommodation);
    setAccommodationDialogOpen(true);
  };

  const handleBookAccommodation = (bookingLink) => {
    window.open(bookingLink, '_blank');
    toast({
      title: "Redirecting to booking...",
      description: "Opening accommodation website in a new tab.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate("/planner")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Plan Another Trip
          </Button>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="secondary" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>

        {/* Trip Overview */}
        <Card className="mb-8 shadow-travel">
          <CardHeader className="bg-gradient-sky text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl">{generatedTrip.destination}</CardTitle>
                <CardDescription className="text-white/90 text-lg">
                  Your Personalized Trip Plan
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">${totalCost.toLocaleString()}</div>
                <div className="text-white/90">Total Budget</div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-secondary" />
                <div>
                  <div className="font-semibold">{generatedTrip.duration} days</div>
                  <div className="text-sm text-muted-foreground">Duration</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-accent" />
                <div>
                  <div className="font-semibold">{generatedTrip.travelers} travelers</div>
                  <div className="text-sm text-muted-foreground">Group Size</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Star className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-semibold">Premium</div>
                  <div className="text-sm text-muted-foreground">Experience Level</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Flight Pricing Insights */}
        {realTripData?.flightInsights && realTripData?.flightOptions && (
          <FlightPricingInfo
            flightOptions={realTripData.flightOptions}
            flightInsights={realTripData.flightInsights}
            budget={tripData?.budget || 2000}
            travelers={tripData?.travelers || "2"}
            destination={tripData?.destination || "Unknown"}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Transportation & Accommodation */}
          <div className="space-y-6">
            {/* Flights */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plane className="h-5 w-5 text-primary" />
                  Flight Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup value={selectedFlight} onValueChange={setSelectedFlight}>
                  {flightOptions.map((option) => (
                    <div key={option.id} className="border rounded-lg p-3 hover:bg-muted/50 transition-smooth">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value={option.id} id={option.id} />
                        <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-semibold text-sm">{option.airline}</div>
                              <div className="text-xs text-muted-foreground">{option.type}</div>
                              <div className="text-xs text-muted-foreground">{option.duration}</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={selectedFlight === option.id ? "default" : "outline"}>
                                ${option.cost}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleFlightDetails(option);
                                }}
                                className="p-1 h-6 w-6"
                              >
                                <Info className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </Label>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Accommodation */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hotel className="h-5 w-5 text-accent" />
                  Accommodation Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup value={selectedAccommodation} onValueChange={setSelectedAccommodation}>
                  {accommodationOptions.map((option) => (
                    <div key={option.id} className="border rounded-lg p-3 hover:bg-muted/50 transition-smooth">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value={option.id} id={`acc-${option.id}`} />
                        <Label htmlFor={`acc-${option.id}`} className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <div className="font-semibold text-sm">{option.name}</div>
                              <div className="text-xs text-muted-foreground">{option.type}</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={selectedAccommodation === option.id ? "default" : "outline"}>
                                ${option.cost}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleAccommodationDetails(option);
                                }}
                                className="p-1 h-6 w-6"
                              >
                                <Info className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {option.amenities.map((amenity, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {amenity}
                              </Badge>
                            ))}
                          </div>
                        </Label>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Transportation */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5 text-secondary" />
                  Local Transport
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="font-semibold">Private car + scooter rental</div>
                  <div className="flex items-center justify-between">
                    <span>Total Transport Cost</span>
                    <Badge variant="secondary">${staticCosts.transport}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Daily Itinerary */}
          <div className="lg:col-span-2">
            <Card className="shadow-travel">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Daily Itinerary
                </CardTitle>
                <CardDescription>
                  Your personalized day-by-day activities and experiences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {activities.map((activity, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:shadow-soft transition-smooth">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div>
                          <div className="font-semibold">Day {activity.day}</div>
                          <div className="text-sm text-muted-foreground capitalize">{activity.type}</div>
                        </div>
                      </div>
                      <Badge variant="outline">${activity.cost}</Badge>
                    </div>
                    <div className="ml-11">
                      <h4 className="font-medium">{activity.title}</h4>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            
            {/* AI Trip Chat */}
            <AITripChat
              tripData={realTripData || tripData}
              onItineraryUpdate={handleItineraryUpdate}
              className="mt-6"
            />
          </div>
        </div>

        {/* Budget Breakdown */}
        <Card className="mt-8 shadow-travel">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-secondary" />
              Budget Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">${selectedFlightOption?.cost || 0}</div>
                <div className="text-sm text-muted-foreground">Flights</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-accent">${selectedAccommodationOption?.cost || 0}</div>
                <div className="text-sm text-muted-foreground">Accommodation</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-secondary">${totalActivitiesCost}</div>
                <div className="text-sm text-muted-foreground">Activities</div>
              </div>
              <div className="text-center p-4 bg-gradient-sky text-white rounded-lg">
                <div className="text-2xl font-bold">${totalCost}</div>
                <div className="text-sm text-white/90">Total Cost</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Flight Details Dialog */}
      <Dialog open={flightDialogOpen} onOpenChange={setFlightDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plane className="h-5 w-5 text-primary" />
              Flight Details - {selectedFlightDetails?.airline}
            </DialogTitle>
          </DialogHeader>
          
          {selectedFlightDetails && (
            <div className="space-y-6">
              {/* Flight Overview */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Flight Class</div>
                  <div className="font-semibold">{selectedFlightDetails.type}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Aircraft</div>
                  <div className="font-semibold">{selectedFlightDetails.aircraft}</div>
                </div>
              </div>

              <Separator />

              {/* Schedule */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Flight Schedule
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Departure</div>
                    <div className="font-semibold">{selectedFlightDetails.departure}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Arrival</div>
                    <div className="font-semibold">{selectedFlightDetails.arrival}</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Duration & Stops</div>
                  <div className="font-semibold">{selectedFlightDetails.duration}</div>
                  <div className="text-sm text-muted-foreground">{selectedFlightDetails.stopover}</div>
                </div>
              </div>

              <Separator />

              {/* Amenities */}
              <div className="space-y-4">
                <h3 className="font-semibold">Included Amenities</h3>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-xs">Baggage</Badge>
                    <span className="text-sm">{selectedFlightDetails.baggage}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-xs">Meals</Badge>
                    <span className="text-sm">{selectedFlightDetails.meals}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-xs">Entertainment</Badge>
                    <span className="text-sm">{selectedFlightDetails.entertainment}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Pricing & Booking */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-primary">${selectedFlightDetails.cost}</div>
                  <div className="text-sm text-muted-foreground">Per person</div>
                </div>
                <Button 
                  variant="travel" 
                  onClick={() => handleBookFlight(selectedFlightDetails.bookingLink)}
                  className="flex items-center gap-2"
                >
                  Book Flight <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Accommodation Details Dialog */}
      <Dialog open={accommodationDialogOpen} onOpenChange={setAccommodationDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Hotel className="h-5 w-5 text-accent" />
              Accommodation Details - {selectedAccommodationDetails?.name}
            </DialogTitle>
          </DialogHeader>
          
          {selectedAccommodationDetails && (
            <div className="space-y-6">
              {/* Accommodation Overview */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Room Type</div>
                  <div className="font-semibold">{selectedAccommodationDetails.roomType}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Location</div>
                  <div className="font-semibold">{selectedAccommodationDetails.location}</div>
                </div>
              </div>

              <Separator />

              {/* Schedule */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Check-in & Check-out
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Check-in</div>
                    <div className="font-semibold">{selectedAccommodationDetails.checkIn}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Check-out</div>
                    <div className="font-semibold">{selectedAccommodationDetails.checkOut}</div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Amenities */}
              <div className="space-y-4">
                <h3 className="font-semibold">Included Amenities</h3>
                <div className="grid grid-cols-1 gap-3">
                  {selectedAccommodationDetails.included.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-success" />
                      <span className="text-sm">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Facilities */}
              <div className="space-y-4">
                <h3 className="font-semibold">Facilities</h3>
                <div className="grid grid-cols-1 gap-3">
                  {selectedAccommodationDetails.facilities.map((facility, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-success" />
                      <span className="text-sm">{facility}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Pricing & Booking */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-accent">${selectedAccommodationDetails.cost}</div>
                  <div className="text-sm text-muted-foreground">Per night</div>
                </div>
                <Button 
                  variant="travel" 
                  onClick={() => handleBookAccommodation(selectedAccommodationDetails.bookingLink)}
                  className="flex items-center gap-2"
                >
                  Book Accommodation <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TripResults;
