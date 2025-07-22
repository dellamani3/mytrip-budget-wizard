import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plane, MapPin, Calendar, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import heroImage from "@/assets/travel-hero.jpg";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }

    setIsLoading(true);
    setError("");
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Store the JWT token
        localStorage.setItem('authToken', data.data.token);
        localStorage.setItem('userData', JSON.stringify(data.data.user));
        
        toast({
          title: "Welcome to MYTripGenie!",
          description: `Hello ${data.data.user.firstName || data.data.user.username}! Let's plan your dream trip!`,
        });
        
        navigate("/planner");
      } else {
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error('Login error:', error);
      setError("Unable to connect to the server. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = () => {
    toast({
      title: "Registration",
      description: "Registration feature coming soon! For now, use any username/password to continue.",
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Hero Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-sky/70"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo and Brand */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                <Plane className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">MYTripGenie</h1>
            <p className="text-white/90 text-lg">Your AI-Powered Travel Companion</p>
          </div>

          {/* Login Card */}
          <Card className="backdrop-blur-sm bg-white/95 border-0 shadow-travel">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Welcome Back</CardTitle>
              <CardDescription>
                Sign in to continue planning your perfect trips
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="transition-smooth focus:shadow-soft"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="transition-smooth focus:shadow-soft"
                  />
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button 
                  type="submit" 
                  className="w-full" 
                  variant="travel"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>

                <div className="text-center">
                  <Button 
                    type="button"
                    variant="ghost" 
                    onClick={handleRegister}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    Don't have an account? Sign up here
                  </Button>
                </div>
              </form>

              {/* Features Preview */}
              <div className="mt-6 pt-6 border-t border-border/60">
                <p className="text-sm text-muted-foreground text-center mb-4">
                  What you'll get with MYTripGenie:
                </p>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="space-y-2">
                    <MapPin className="h-6 w-6 text-accent mx-auto" />
                    <p className="text-xs text-muted-foreground">Smart Destinations</p>
                  </div>
                  <div className="space-y-2">
                    <Calendar className="h-6 w-6 text-secondary mx-auto" />
                    <p className="text-xs text-muted-foreground">Perfect Itineraries</p>
                  </div>
                  <div className="space-y-2">
                    <Plane className="h-6 w-6 text-primary mx-auto" />
                    <p className="text-xs text-muted-foreground">Best Deals</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;