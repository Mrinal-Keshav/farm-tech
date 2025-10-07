import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft,
  Phone,
  Eye,
  EyeOff,
  Smartphone,
  Shield,
  Globe,
  Sprout
} from "lucide-react";
import { useAuth } from "@/App";

import agtechIcon from "@/assets/agtech-icon.png";

interface AuthFlowProps {
  onBack: () => void;
  onSuccess: () => void;
}

export const AuthFlow = ({ onBack, onSuccess }: AuthFlowProps) => {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Registration form states
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const languages = ['English', 'Hindi', 'Bengali', 'Tamil', 'Telugu', 'Marathi'];

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };


  const handleEmailLogin = async () => {
    setLoading(true);
    setError('');
    
    // Validation
    if (!email) {
      setError('Please enter your email address');
      setLoading(false);
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }
    if (!password) {
      setError('Please enter your password');
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Login failed.');
        return;
      }
      const authUser = {
        name: data.user.displayName || email.split('@')[0],
        email: data.user.email,
        language: selectedLanguage,
        id: data.user.email
      };
      login(authUser);
      const params = new URLSearchParams(window.location.search);
      const redirect = params.get('redirect') || '/dashboard';
      window.location.href = redirect;
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = () => {
    if (phoneNumber) {
      setOtpSent(true);
    }
  };

  const handleVerifyOTP = () => {
    if (otp.length === 6) {
      // For demo purposes, accept any 6-digit OTP
      const phoneUser = {
        name: 'Amit Singh',
        phone: phoneNumber,
        language: selectedLanguage,
        id: `phone_${Date.now()}`
      };
      login(phoneUser);
      const params = new URLSearchParams(window.location.search);
      const redirect = params.get('redirect') || '/dashboard';
      window.location.href = redirect;
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    setError('');
    
    // Validation
    if (!regName.trim()) {
      setError('Please enter your full name');
      setLoading(false);
      return;
    }
    if (!regEmail) {
      setError('Please enter your email address');
      setLoading(false);
      return;
    }
    if (!validateEmail(regEmail)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }
    if (!regPassword) {
      setError('Please enter a password');
      setLoading(false);
      return;
    }
    if (regPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }
    if (regPassword !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: regEmail, password: regPassword, displayName: regName })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Registration failed.');
        return;
      }
      // Require explicit login after registration
      setError('Registration successful. Please sign in.');
      // Switch to email tab for login
      const tabs = document.querySelector('[data-state="active"][role="tab"]') as HTMLElement | null;
      // No-op UI hint; user can click Email tab manually if needed
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <img src={agtechIcon} alt="AgTech" className="w-8 h-8" />
            <span className="font-bold text-xl text-foreground">FarmTech</span>
          </div>
          <Badge variant="secondary" className="text-primary">
            Secure Login
          </Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          {/* Welcome Card */}
          <Card className="mb-8 border-primary/20 shadow-strong">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Sprout className="w-8 h-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl text-foreground">Welcome to FarmTech</CardTitle>
              <CardDescription className="text-base">
                Join thousands of farmers using AI technology to grow smarter
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Language Selection */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                Select Your Language
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {languages.map(lang => (
                  <Button
                    key={lang}
                    variant={selectedLanguage === lang ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedLanguage(lang)}
                    className="justify-start"
                  >
                    {lang}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Auth Tabs */}
          <Card className="shadow-strong">
            <CardHeader>
              <CardTitle className="text-xl text-center">Join the Community</CardTitle>
              <CardDescription className="text-center">
                Choose your preferred login method
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="email" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="email">Email</TabsTrigger>
                  <TabsTrigger value="phone">Phone</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>

                {/* Email Auth */}
                <TabsContent value="email" className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="farmer@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input 
                          id="password" 
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                    {error && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-sm text-red-600">{error}</p>
                      </div>
                    )}
                    <Button 
                      variant="earth" 
                      size="lg" 
                      className="w-full"
                      onClick={handleEmailLogin}
                      disabled={loading}
                    >
                      {loading ? 'Signing In...' : 'Sign In with Email'}
                    </Button>
                    <div className="text-center">
                      <Button variant="link" size="sm">
                        Forgot your password?
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                {/* Phone Auth */}
                <TabsContent value="phone" className="space-y-4">
                  {!otpSent ? (
                    <div className="space-y-4">
                      <div className="text-center space-y-2">
                        <Smartphone className="w-12 h-12 text-primary mx-auto" />
                        <p className="text-muted-foreground">
                          We'll send you a verification code
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input 
                          id="phone" 
                          type="tel" 
                          placeholder="+1 (555) 123-4567"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="w-full"
                        />
                      </div>
                      <Button 
                        variant="nature" 
                        size="lg" 
                        className="w-full"
                        onClick={handleSendOTP}
                        disabled={!phoneNumber}
                      >
                        Send Verification Code
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="text-center space-y-2">
                        <Shield className="w-12 h-12 text-primary mx-auto" />
                        <p className="text-muted-foreground">
                          Enter the 6-digit code sent to {phoneNumber}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="otp">Verification Code</Label>
                        <Input 
                          id="otp" 
                          type="text" 
                          placeholder="123456"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          maxLength={6}
                          className="w-full text-center text-lg"
                        />
                      </div>
                      <Button 
                        variant="hero" 
                        size="lg" 
                        className="w-full"
                        onClick={handleVerifyOTP}
                        disabled={otp.length !== 6}
                      >
                        Verify & Continue
                      </Button>
                      <div className="text-center">
                        <Button 
                          variant="link" 
                          size="sm"
                          onClick={() => setOtpSent(false)}
                        >
                          Change phone number
                        </Button>
                      </div>
                    </div>
                  )}
                </TabsContent>

                {/* Registration */}
                <TabsContent value="register" className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="regName">Full Name</Label>
                      <Input 
                        id="regName" 
                        type="text" 
                        placeholder="Enter your full name"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="regEmail">Email Address</Label>
                      <Input 
                        id="regEmail" 
                        type="email" 
                        placeholder="farmer@example.com"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="regPassword">Password</Label>
                      <div className="relative">
                        <Input 
                          id="regPassword" 
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          className="w-full pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input 
                        id="confirmPassword" 
                        type="password"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    {error && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-sm text-red-600">{error}</p>
                      </div>
                    )}
                    <Button 
                      variant="hero" 
                      size="lg" 
                      className="w-full"
                      onClick={handleRegister}
                      disabled={loading}
                    >
                      {loading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">
                        Already have an account? 
                        <Button variant="link" size="sm" className="p-1 h-auto">
                          Sign in here
                        </Button>
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Footer */}
              <div className="mt-6 pt-6 border-t text-center space-y-2">
                <p className="text-xs text-muted-foreground">
                  By continuing, you agree to our Terms of Service and Privacy Policy
                </p>
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <Shield className="w-3 h-3" />
                  Your data is protected with enterprise-grade security
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AuthFlow;