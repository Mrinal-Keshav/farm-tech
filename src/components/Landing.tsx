import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sprout, Smartphone, TrendingUp, Users, MessageCircle, Shield, Globe, Zap } from "lucide-react";
import heroImage from "@/assets/hero-farming.jpg";
import agtechIcon from "@/assets/agtech-icon.png";
import dashboardPreview from "@/assets/dashboard-preview.jpg";

const Landing = () => {
  const features = [
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "AI Chatbot Helper",
      description: "Get instant answers about crops, soil, weather, and farming techniques in your language"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Smart Suggestions",
      description: "Receive AI-powered recommendations for optimal crop care and resource management"
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Mobile-First",
      description: "Access your farming data anywhere with our responsive, farmer-friendly interface"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Multilingual",
      description: "Communicate in your preferred language with local farming knowledge"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure Authentication",
      description: "Safe login with Google account or phone OTP verification"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Real-time Updates",
      description: "Get live weather alerts and farming insights powered by space data"
    }
  ];

  const benefits = [
    "Increase crop yields with AI-driven insights",
    "Save time with instant farming guidance",
    "Connect with modern agricultural technology",
    "Access multilingual farming support",
    "Monitor your farm from anywhere"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={agtechIcon} alt="AgTech" className="w-8 h-8" />
            <span className="font-bold text-xl text-foreground">FarmTech</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-muted-foreground hover:text-primary transition-colors">Features</a>
            <a href="#benefits" className="text-muted-foreground hover:text-primary transition-colors">Benefits</a>
            <a href="#contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</a>
          </nav>
          {/* Removed top-right Join the Community button */}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-4">
                <Badge variant="secondary" className="text-primary font-semibold">
                  <Sprout className="w-4 h-4 mr-2" />
                  Future of Agriculture
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                  Empowering Farmers with
                  <span className="bg-gradient-primary bg-clip-text text-transparent"> AI Technology</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg">
                  Bridge the gap between traditional farming and modern technology. Get AI-powered insights, multilingual support, and space data to maximize your farm's potential.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="hero" size="xl" className="animate-float" asChild>
                  <a href="/auth?redirect=/community">
                    <Users className="w-5 h-5 mr-2" />
                    Join the Community
                  </a>
                </Button>
              </div>

              <div className="flex items-center gap-6 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">1000+</div>
                  <div className="text-sm text-muted-foreground">Farmers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">50+</div>
                  <div className="text-sm text-muted-foreground">Crops Supported</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">5</div>
                  <div className="text-sm text-muted-foreground">Languages</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary rounded-3xl blur-3xl opacity-20"></div>
              <img
                src={heroImage}
                alt="Modern farming with technology"
                className="relative rounded-3xl shadow-strong w-full h-auto animate-float"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-foreground">
              Everything You Need to
              <span className="text-primary"> Grow Smarter</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our comprehensive platform combines AI intelligence, satellite data, and local farming knowledge to support the modern farmer.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-soft transition-all duration-300 border-primary/10 hover:border-primary/30">
                <CardHeader>
                  <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl lg:text-5xl font-bold text-foreground">
                  Transform Your
                  <span className="text-primary"> Farming Journey</span>
                </h2>
                <p className="text-xl text-muted-foreground">
                  Join thousands of farmers who are already using technology to increase productivity, reduce costs, and make data-driven decisions.
                </p>
              </div>

              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-4">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-primary-foreground text-sm">✓</span>
                    </div>
                    <span className="text-lg text-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>

              {/* Removed secondary CTA button to avoid duplicate get started action */}
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-nature rounded-3xl blur-2xl opacity-30"></div>
              <img
                src={dashboardPreview}
                alt="Dashboard preview"
                className="relative rounded-3xl shadow-strong w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl lg:text-5xl font-bold text-primary-foreground">
              Ready to Revolutionize Your Farm?
            </h2>
            <p className="text-xl text-primary-foreground/90">
              Join the growing community of tech-savvy farmers who are increasing their yields and reducing their costs with AI-powered insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="xl" asChild>
                <a href="/auth">
                  <Users className="w-5 h-5 mr-2" />
                  Create Account
                </a>
              </Button>
              <Button variant="outline" size="xl" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <MessageCircle className="w-5 h-5 mr-2" />
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-secondary/50 border-t">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img src={agtechIcon} alt="AgTech" className="w-8 h-8" />
                <span className="font-bold text-xl text-foreground">FarmTech</span>
              </div>
              <p className="text-muted-foreground">
                Empowering farmers with AI technology and modern agricultural insights.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Platform</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">AI Chatbot</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Dashboard</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Mobile App</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 FarmTech. Empowering the future of agriculture.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;