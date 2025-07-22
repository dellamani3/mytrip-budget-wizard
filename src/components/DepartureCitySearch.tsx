import React, { useState, useEffect, useCallback } from 'react';
import { Check, ChevronsUpDown, Loader2, MapPin, Plane } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';

interface DepartureCityData {
  city: string;
  region: string;
  timezone: string;
  isHub: boolean;
}

interface DepartureCitySearchProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const DepartureCitySearch: React.FC<DepartureCitySearchProps> = ({
  value,
  onValueChange,
  placeholder = "Select departure city...",
  className
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<DepartureCityData[]>([]);
  const [popularDepartures, setPopularDepartures] = useState<DepartureCityData[]>([]);
  const [loading, setLoading] = useState(false);
  const [allCities, setAllCities] = useState<DepartureCityData[]>([]);

  // Fetch popular departure cities on mount
  useEffect(() => {
    const fetchPopularDepartures = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/departures/popular?limit=8');
        if (response.ok) {
          const data = await response.json();
          setPopularDepartures(data.data || []);
        }
      } catch (error) {
        console.error('Error fetching popular departures:', error);
      }
    };

    const fetchAllCities = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/departures');
        if (response.ok) {
          const data = await response.json();
          setAllCities(data.data || []);
        }
      } catch (error) {
        console.error('Error fetching all departure cities:', error);
      }
    };

    fetchPopularDepartures();
    fetchAllCities();
  }, []);

  // Debounced search function
  const searchDepartures = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      
      try {
        // Filter from all cities locally for better performance
        const filtered = allCities.filter(city =>
          city.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          city.region.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 10);
        
        setSuggestions(filtered);
      } catch (error) {
        console.error('Error searching departures:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    },
    [allCities]
  );

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchDepartures(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, searchDepartures]);

  const handleSelect = (selectedCity: string) => {
    onValueChange(selectedCity);
    setOpen(false);
    setQuery('');
  };

  const displaySuggestions = query.trim() ? suggestions : popularDepartures;

  const formatDisplayValue = (cityName: string) => {
    if (!cityName) return placeholder;
    // Extract just the city part before the airport code for display
    const parts = cityName.split(' (');
    return parts[0] || cityName;
  };

  const getRegionColor = (region: string) => {
    const colors = {
      northeast: 'bg-blue-100 text-blue-800',
      west: 'bg-green-100 text-green-800',
      midwest: 'bg-purple-100 text-purple-800',
      southeast: 'bg-orange-100 text-orange-800',
      south: 'bg-red-100 text-red-800',
      europe: 'bg-indigo-100 text-indigo-800',
      asia: 'bg-pink-100 text-pink-800',
      oceania: 'bg-teal-100 text-teal-800',
      middle_east: 'bg-yellow-100 text-yellow-800',
      india: 'bg-emerald-100 text-emerald-800'
    };
    return colors[region as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          <div className="flex items-center gap-2 min-w-0">
            <Plane className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="truncate">
              {formatDisplayValue(value)}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput
            placeholder="Search departure cities..."
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            {loading && query.trim() && (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="ml-2 text-sm text-muted-foreground">Searching...</span>
              </div>
            )}
            
            {!loading && displaySuggestions.length === 0 && query.trim() && (
              <CommandEmpty>No departure cities found.</CommandEmpty>
            )}
            
            {!loading && displaySuggestions.length === 0 && !query.trim() && (
              <CommandEmpty>Start typing to search departure cities...</CommandEmpty>
            )}

            {!loading && displaySuggestions.length > 0 && (
              <CommandGroup 
                heading={query.trim() ? "Search Results" : "Popular Departure Cities"}
              >
                {displaySuggestions.map((city) => (
                  <CommandItem
                    key={city.city}
                    value={city.city}
                    onSelect={() => handleSelect(city.city)}
                    className="flex items-center gap-3 py-3"
                  >
                    <div className="flex items-center gap-2 flex-grow min-w-0">
                      <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div className="flex-grow min-w-0">
                        <div className="font-medium truncate">{city.city}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge 
                            variant="secondary" 
                            className={cn("text-xs", getRegionColor(city.region))}
                          >
                            {city.region.replace('_', ' ')}
                          </Badge>
                          {city.isHub && (
                            <Badge variant="outline" className="text-xs">
                              Hub
                            </Badge>
                          )}
                          {!query.trim() && (
                            <Badge variant="outline" className="text-xs text-blue-600">
                              Popular
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === city.city ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default DepartureCitySearch; 