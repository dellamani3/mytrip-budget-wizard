import React, { useState, useEffect, useCallback } from 'react';
import { MapPin, Search, Globe } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface Destination {
  id: number;
  name: string;
  country: string;
  region: string;
  display: string;
  popular: boolean;
}

interface DestinationSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const DestinationSearch: React.FC<DestinationSearchProps> = ({
  value,
  onChange,
  placeholder = "e.g., Paris, Tokyo, or leave blank for AI suggestions",
  className
}) => {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<Destination[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [popularDestinations, setPopularDestinations] = useState<Destination[]>([]);

  // Debounce function
  const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  // Search destinations API call
  const searchDestinations = async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setSuggestions(popularDestinations.slice(0, 8));
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/destinations/search?q=${encodeURIComponent(searchQuery)}&limit=8`
      );
      const data = await response.json();
      
      if (data.success) {
        setSuggestions(data.data.destinations);
      }
    } catch (error) {
      console.error('Error searching destinations:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search function
  const debouncedSearch = useCallback(debounce(searchDestinations, 300), [popularDestinations]);

  // Load popular destinations on component mount
  useEffect(() => {
    const loadPopularDestinations = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/destinations/popular?limit=12');
        const data = await response.json();
        
        if (data.success) {
          setPopularDestinations(data.data.destinations);
          if (!query) {
            setSuggestions(data.data.destinations.slice(0, 8));
          }
        }
      } catch (error) {
        console.error('Error loading popular destinations:', error);
      }
    };

    loadPopularDestinations();
  }, []);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    onChange(newQuery);
    
    if (newQuery.length >= 0) {
      setShowSuggestions(true);
      debouncedSearch(newQuery);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
  };

  // Handle suggestion selection
  const handleSuggestionClick = (destination: Destination) => {
    setQuery(destination.display);
    onChange(destination.display);
    setShowSuggestions(false);
  };

  // Handle input focus
  const handleFocus = () => {
    setShowSuggestions(true);
    if (suggestions.length === 0 && !query) {
      setSuggestions(popularDestinations.slice(0, 8));
    }
  };

  // Handle input blur (with delay to allow click on suggestions)
  const handleBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
    }, 150);
  };

  return (
    <div className={cn("relative", className)}>
      <Label htmlFor="destination" className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-accent" />
        Preferred Destination (Optional)
      </Label>
      
      <div className="relative mt-2">
        <Input
          id="destination"
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="pr-10"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-accent"></div>
          ) : (
            <Search className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-64 overflow-y-auto">
          {/* Popular Destinations Header (when no search query) */}
          {!query && (
            <div className="px-3 py-2 text-xs font-medium text-muted-foreground bg-muted/50 border-b flex items-center gap-2">
              <Globe className="h-3 w-3" />
              Popular Destinations
            </div>
          )}
          
          {/* Suggestion Items */}
          {suggestions.map((destination) => (
            <div
              key={destination.id}
              className="px-3 py-2 hover:bg-accent/50 cursor-pointer border-b border-border/50 last:border-b-0 transition-colors"
              onClick={() => handleSuggestionClick(destination)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">{destination.display}</div>
                    <div className="text-xs text-muted-foreground">{destination.region}</div>
                  </div>
                </div>
                {destination.popular && (
                  <div className="text-xs bg-accent/20 text-accent px-2 py-1 rounded-full">
                    Popular
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {/* No results message */}
          {suggestions.length === 0 && query && !loading && (
            <div className="px-3 py-4 text-center text-sm text-muted-foreground">
              No destinations found. Try searching for a city or country.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DestinationSearch; 