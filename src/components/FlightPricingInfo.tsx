import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Plane, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  DollarSign, 
  AlertTriangle,
  CheckCircle,
  Info,
  Clock
} from 'lucide-react';

interface FlightPricingInfoProps {
  flightOptions: Array<{
    id: string;
    type: string;
    cost: number;
    totalCost?: number;
    withinBudget?: boolean;
    budgetPercentage?: number;
    duration: string;
    airline: string;
    isRealData?: boolean;
  }>;
  flightInsights?: {
    priceRange: string;
    bestTime: string;
    seasonality: string;
    currentSeason?: string;
  };
  budget: number;
  travelers: string;
  destination: string;
}

const FlightPricingInfo: React.FC<FlightPricingInfoProps> = ({
  flightOptions,
  flightInsights,
  budget,
  travelers,
  destination
}) => {
  const travelerCount = parseInt(travelers) || 1;
  const cheapestFlight = flightOptions.reduce((min, flight) => 
    flight.cost < min.cost ? flight : min, flightOptions[0]);
  const mostExpensiveFlight = flightOptions.reduce((max, flight) => 
    flight.cost > max.cost ? flight : max, flightOptions[0]);

  const getSeasonalIcon = (seasonality: string) => {
    if (seasonality.includes('Peak season') || seasonality.includes('elevated')) {
      return <TrendingUp className="h-4 w-4 text-red-500" />;
    } else if (seasonality.includes('Off-peak') || seasonality.includes('reasonable')) {
      return <TrendingDown className="h-4 w-4 text-green-500" />;
    }
    return <Calendar className="h-4 w-4 text-yellow-500" />;
  };

  const getBudgetStatus = (budgetPercentage: number) => {
    if (budgetPercentage <= 30) return { color: 'text-green-600', icon: CheckCircle, status: 'Great value' };
    if (budgetPercentage <= 50) return { color: 'text-yellow-600', icon: Info, status: 'Reasonable' };
    return { color: 'text-red-600', icon: AlertTriangle, status: 'Expensive' };
  };

  return (
    <div className="space-y-4">
      {/* Flight Price Overview */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plane className="h-5 w-5 text-primary" />
            Flight Pricing for {destination}
            {flightOptions.some(f => f.isRealData) && (
              <Badge variant="default" className="bg-green-600 text-white text-xs">
                Real-time Data
              </Badge>
            )}
            {!flightOptions.some(f => f.isRealData) && (
              <Badge variant="secondary" className="text-xs">
                Market Estimate
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            {flightOptions.some(f => f.isRealData) 
              ? "Live flight prices from airline partners via Amadeus API"
              : "Real-time pricing based on current market rates and seasonality"
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Price Range Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="text-lg font-bold text-green-700">
                ${cheapestFlight.cost * travelerCount}
              </div>
              <div className="text-sm text-green-600">Lowest Price</div>
              <div className="text-xs text-muted-foreground">{cheapestFlight.type}</div>
            </div>
            
            <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-lg font-bold text-blue-700">
                ${Math.round((cheapestFlight.cost + mostExpensiveFlight.cost) / 2) * travelerCount}
              </div>
              <div className="text-sm text-blue-600">Average Price</div>
              <div className="text-xs text-muted-foreground">Estimated</div>
            </div>
            
            <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-lg font-bold text-purple-700">
                ${mostExpensiveFlight.cost * travelerCount}
              </div>
              <div className="text-sm text-purple-600">Premium Price</div>
              <div className="text-xs text-muted-foreground">{mostExpensiveFlight.type}</div>
            </div>
          </div>

          {/* Budget Impact Analysis */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Budget Impact Analysis
            </h4>
            {flightOptions.map((flight) => {
              const budgetPercentage = flight.budgetPercentage || 
                Math.round(((flight.cost * travelerCount) / budget) * 100);
              const status = getBudgetStatus(budgetPercentage);
              const StatusIcon = status.icon;
              
              return (
                <div key={flight.id} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center gap-3">
                    <StatusIcon className={`h-4 w-4 ${status.color}`} />
                    <div>
                      <div className="font-medium text-sm">{flight.type}</div>
                      <div className="text-xs text-muted-foreground">{flight.airline}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={budgetPercentage <= 30 ? "default" : budgetPercentage <= 50 ? "secondary" : "destructive"}
                      className="text-xs"
                    >
                      {budgetPercentage}% of budget
                    </Badge>
                    <div className="text-xs text-muted-foreground mt-1">
                      ${flight.cost * travelerCount} total
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Flight Insights & Recommendations */}
      {flightInsights && (
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-500" />
              Flight Booking Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Market Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {flightInsights.priceRange}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  These are typical market rates for this route
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Best Booking Time</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {flightInsights.bestTime}
                </p>
              </div>
            </div>

            {/* Seasonal Information */}
            <Alert className="border-yellow-200 bg-yellow-50">
              <div className="flex items-center gap-2">
                {getSeasonalIcon(flightInsights.seasonality)}
                <AlertDescription className="text-sm">
                  <strong>Seasonal Pricing:</strong> {flightInsights.seasonality}
                  {flightInsights.currentSeason && (
                    <span className="block mt-1 text-xs">
                      <strong>Current Season:</strong> {flightInsights.currentSeason}
                    </span>
                  )}
                </AlertDescription>
              </div>
            </Alert>

            {/* Budget Warnings */}
            {flightOptions.some(flight => !flight.withinBudget) && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  Some flight options exceed your recommended flight budget (50% of total budget). 
                  Consider adjusting your total budget or look for alternative dates/routes.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FlightPricingInfo; 