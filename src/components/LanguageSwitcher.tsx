import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";

// Indian languages only
const INDIAN_LANGUAGES = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिंदी' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ' },
  { code: 'as', name: 'Assamese', native: 'অসমীয়া' }
];

interface LanguageSwitcherProps {
  currentLanguage?: string;
  onLanguageChange?: (languageCode: string) => void;
}

export const LanguageSwitcher = ({ 
  currentLanguage = 'en', 
  onLanguageChange 
}: LanguageSwitcherProps) => {
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);

  const handleLanguageChange = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    onLanguageChange?.(languageCode);
    
    // Store in localStorage for persistence
    localStorage.setItem('preferred_language', languageCode);
    
    // In a real app with Supabase, this would update the user's profile
    console.log(`Language changed to: ${languageCode}`);
  };

  const currentLang = INDIAN_LANGUAGES.find(lang => lang.code === selectedLanguage) || INDIAN_LANGUAGES[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <Globe className="w-4 h-4" />
          <span className="hidden sm:inline">{currentLang.native}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {INDIAN_LANGUAGES.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`flex items-center justify-between cursor-pointer ${
              selectedLanguage === language.code ? 'bg-accent' : ''
            }`}
          >
            <span>{language.native}</span>
            <span className="text-xs text-muted-foreground">{language.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;