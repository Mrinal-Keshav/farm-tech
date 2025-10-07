import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  Sprout,
  Menu,
  Gamepad2,
  BarChart3,
  Users,
  ShoppingCart,
  User,
  MessageCircle,
  LogOut,
  Settings,
  Globe
} from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import { useAuth } from "@/App";
import agtechIcon from "@/assets/agtech-icon.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const navigationItems = [
    { name: 'Analysis', href: '/analysis', icon: BarChart3 },
    { name: 'Community', href: '/community', icon: Users },
    { name: 'Shop', href: '/shop', icon: ShoppingCart },
    { name: 'Game', href: '/farming-game', icon: Gamepad2 },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleAuthAction = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <img src={agtechIcon} alt="FarmTech" className="w-8 h-8" />
          <span className="font-bold text-xl text-foreground">FarmTech</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                  isActive(item.href) 
                    ? 'text-primary' 
                    : 'text-muted-foreground'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Auth Section */}
        <div className="hidden md:flex items-center gap-4">
          <LanguageSwitcher 
            currentLanguage={user?.language || 'en'}
            onLanguageChange={(lang) => console.log('Language changed to:', lang)}
          />
          {isAuthenticated ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/chatbot')}
                className="flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                AI Helper
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 h-auto p-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        {user?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{user?.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                    <User className="w-4 h-4 mr-2" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Globe className="w-4 h-4 mr-2" />
                    Language: {user?.language}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={handleAuthAction}>
                Login
              </Button>
              <Button variant="hero" onClick={handleAuthAction}>
                Register
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <div className="flex flex-col gap-6 mt-6">
              {/* Mobile User Section */}
              {isAuthenticated && (
                <div className="flex items-center gap-3 p-4 bg-accent rounded-lg">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{user?.name}</p>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
              )}

              {/* Mobile Navigation Links */}
              <nav className="flex flex-col gap-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                        isActive(item.href)
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-accent'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Mobile Actions */}
              {isAuthenticated ? (
                <div className="flex flex-col gap-2 pt-4 border-t">
                  <Button
                    variant="hero"
                    className="justify-start"
                    onClick={() => {
                      navigate('/chatbot');
                      setIsOpen(false);
                    }}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    AI Helper
                  </Button>
                  <Button
                    variant="nature"
                    className="justify-start"
                    onClick={() => {
                      navigate('/dashboard');
                      setIsOpen(false);
                    }}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => {
                      navigate('/settings');
                      setIsOpen(false);
                    }}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 pt-4 border-t">
                  <Button
                    variant="hero"
                    className="justify-start"
                    onClick={() => {
                      handleAuthAction();
                      setIsOpen(false);
                    }}
                  >
                    Register
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => {
                      handleAuthAction();
                      setIsOpen(false);
                    }}
                  >
                    Login
                  </Button>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Navbar;