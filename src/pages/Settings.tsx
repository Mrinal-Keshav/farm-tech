import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  Globe, 
  Shield, 
  Smartphone, 
  CloudRain, 
  TrendingUp,
  MessageSquare,
  IndianRupee,
  ArrowLeft
} from "lucide-react";
import { useAuth } from "@/App";
import { useNavigate } from "react-router-dom";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const Settings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Settings state
  const [notifications, setNotifications] = useState({
    weatherAlerts: true,
    cropAdvice: true,
    marketPrices: false,
    communityUpdates: true,
    systemNotifications: true
  });

  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    locationSharing: true,
    dataAnalytics: false
  });

  const handleSave = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In real app with Supabase, this would update user preferences
      console.log('Saving settings:', { notifications, privacy });
      
      // Show success message
      alert('Settings saved successfully!');
    } catch (error) {
      alert('Failed to save settings. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground">Manage your preferences and account settings</p>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Language Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                Language & Region
              </CardTitle>
              <CardDescription>
                Choose your preferred language for the app interface
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">App Language</Label>
                  <p className="text-xs text-muted-foreground">
                    All content will be displayed in your selected language
                  </p>
                </div>
                <LanguageSwitcher 
                  currentLanguage={user?.language || 'en'}
                  onLanguageChange={(lang) => console.log('Language changed to:', lang)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Region</Label>
                  <p className="text-xs text-muted-foreground">India (भारत)</p>
                </div>
                <Badge variant="secondary">🇮🇳 India</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                Notifications
              </CardTitle>
              <CardDescription>
                Choose what notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CloudRain className="w-4 h-4 text-blue-500" />
                  <div>
                    <Label className="text-sm font-medium">Weather Alerts</Label>
                    <p className="text-xs text-muted-foreground">
                      Receive important weather warnings and forecasts
                    </p>
                  </div>
                </div>
                <Switch 
                  checked={notifications.weatherAlerts}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, weatherAlerts: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <div>
                    <Label className="text-sm font-medium">Crop Advice</Label>
                    <p className="text-xs text-muted-foreground">
                      AI-powered suggestions for your farming practices
                    </p>
                  </div>
                </div>
                <Switch 
                  checked={notifications.cropAdvice}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, cropAdvice: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <IndianRupee className="w-4 h-4 text-orange-500" />
                  <div>
                    <Label className="text-sm font-medium">Market Prices</Label>
                    <p className="text-xs text-muted-foreground">
                      Updates on crop prices and market trends
                    </p>
                  </div>
                </div>
                <Switch 
                  checked={notifications.marketPrices}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, marketPrices: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-4 h-4 text-purple-500" />
                  <div>
                    <Label className="text-sm font-medium">Community Updates</Label>
                    <p className="text-xs text-muted-foreground">
                      New posts and replies in farmer community
                    </p>
                  </div>
                </div>
                <Switch 
                  checked={notifications.communityUpdates}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, communityUpdates: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-4 h-4 text-gray-500" />
                  <div>
                    <Label className="text-sm font-medium">System Notifications</Label>
                    <p className="text-xs text-muted-foreground">
                      App updates and system announcements
                    </p>
                  </div>
                </div>
                <Switch 
                  checked={notifications.systemNotifications}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, systemNotifications: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Privacy & Data
              </CardTitle>
              <CardDescription>
                Control how your data is used and shared
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Profile Visibility</Label>
                  <p className="text-xs text-muted-foreground">
                    Allow other farmers to see your profile in community
                  </p>
                </div>
                <Switch 
                  checked={privacy.profileVisible}
                  onCheckedChange={(checked) => 
                    setPrivacy(prev => ({ ...prev, profileVisible: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Location Sharing</Label>
                  <p className="text-xs text-muted-foreground">
                    Share your location for better weather and crop advice
                  </p>
                </div>
                <Switch 
                  checked={privacy.locationSharing}
                  onCheckedChange={(checked) => 
                    setPrivacy(prev => ({ ...prev, locationSharing: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Data Analytics</Label>
                  <p className="text-xs text-muted-foreground">
                    Help improve the app by sharing anonymous usage data
                  </p>
                </div>
                <Switch 
                  checked={privacy.dataAnalytics}
                  onCheckedChange={(checked) => 
                    setPrivacy(prev => ({ ...prev, dataAnalytics: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button onClick={handleSave} variant="hero" className="flex-1">
              Save Settings
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/dashboard')}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>

          {/* Support Section */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg">Need Help?</CardTitle>
              <CardDescription>
                Contact our support team for assistance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button variant="outline" size="sm">
                  📞 Call Support
                </Button>
                <Button variant="outline" size="sm">
                  📧 Email Us
                </Button>
                <Button variant="outline" size="sm">
                  💬 Live Chat
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;