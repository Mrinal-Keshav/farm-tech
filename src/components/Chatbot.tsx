import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  MessageCircle, 
  Send, 
  Mic, 
  Globe, 
  ArrowLeft,
  Bot,
  Sprout,
  Cloud,
  Droplets,
  Lightbulb
} from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  category?: string;
}

const Chatbot = ({ onBack }: { onBack: () => void }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI farming assistant. I can help you with crop management, soil health, weather insights, and much more. What would you like to know about your farm today?",
      sender: 'bot',
      timestamp: new Date(),
      category: 'welcome'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  const languages = ['English', 'Spanish', 'Hindi', 'Portuguese', 'French'];

  const quickQuestions = [
    { text: "What's the best time to water my crops?", category: "irrigation", icon: <Droplets className="w-4 h-4" /> },
    { text: "How can I improve my soil quality?", category: "soil", icon: <Sprout className="w-4 h-4" /> },
    { text: "What's the weather forecast for farming?", category: "weather", icon: <Cloud className="w-4 h-4" /> },
    { text: "Which fertilizer should I use?", category: "fertilizer", icon: <Lightbulb className="w-4 h-4" /> }
  ];

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // Simulate AI response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date(),
        category: 'advice'
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const generateAIResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('water') || lowerInput.includes('irrigation') || lowerInput.includes('watering')) {
      return "💧 **Irrigation Best Practices:**\n\n• **Timing:** Water early morning (6-8 AM) to minimize evaporation\n• **Frequency:** Check soil moisture 2-3 inches deep before watering\n• **Amount:** Most crops need 1-1.5 inches of water per week\n• **Method:** Use drip irrigation for water efficiency\n• **Signs:** Wilting leaves indicate need for water\n\n**Pro Tip:** Water deeply but less frequently to encourage strong root growth!";
    } else if (lowerInput.includes('soil') || lowerInput.includes('dirt')) {
      return "🌱 **Soil Health Improvement:**\n\n1. **Add Organic Matter:** Compost, manure, or leaf mulch\n2. **Test pH:** Most crops prefer 6.0-7.0 pH range\n3. **Crop Rotation:** Prevent nutrient depletion\n4. **Avoid Over-tilling:** Preserve soil structure\n5. **Cover Crops:** Protect soil during off-season\n6. **Mulching:** Retain moisture and suppress weeds\n\n**Soil Test Kit:** Get your soil tested every 2-3 years for optimal results!";
    } else if (lowerInput.includes('weather') || lowerInput.includes('forecast') || lowerInput.includes('rain')) {
      return "🌤️ **Weather Update:**\n\n**Current:** Partly cloudy, 24°C, humidity 65%\n**Tomorrow:** Light rain expected (2.3mm) - Perfect timing! 🌧️\n**Week:** Stable conditions with optimal growing weather\n\n**Farming Recommendations:**\n• Check drainage systems before rain\n• Harvest ripe crops before heavy weather\n• Protect seedlings from strong winds\n• Monitor for pest activity after rain\n\n**No extreme weather alerts** - Great conditions for farming!";
    } else if (lowerInput.includes('fertilizer') || lowerInput.includes('nutrient') || lowerInput.includes('feed')) {
      return "🌿 **Fertilizer Guide:**\n\n**NPK Basics:**\n• **N (Nitrogen):** Leaf growth, use during vegetative stage\n• **P (Phosphorus):** Root development, apply at planting\n• **K (Potassium):** Fruit/flower production, use before fruiting\n\n**Application Tips:**\n• Test soil before fertilizing\n• Use organic options when possible\n• Apply in morning, water after application\n• Follow package instructions carefully\n• Avoid over-fertilization (can burn plants)\n\n**Quick Fix:** 10-10-10 NPK works well for most crops!";
    } else if (lowerInput.includes('pest') || lowerInput.includes('bug') || lowerInput.includes('insect')) {
      return "🐛 **Pest Management:**\n\n**Prevention:**\n• Keep garden clean and weed-free\n• Use companion planting (marigolds repel pests)\n• Rotate crops regularly\n• Check plants weekly for early signs\n\n**Natural Solutions:**\n• Neem oil spray for most insects\n• Diatomaceous earth for crawling pests\n• Beneficial insects (ladybugs, lacewings)\n• Hand-pick larger pests\n\n**Chemical Options:** Use only as last resort and follow safety guidelines!";
    } else if (lowerInput.includes('harvest') || lowerInput.includes('pick') || lowerInput.includes('ready')) {
      return "🌾 **Harvest Timing:**\n\n**Signs of Readiness:**\n• **Vegetables:** Firm texture, proper color\n• **Fruits:** Easy to pick, sweet aroma\n• **Root crops:** Top growth starts dying back\n• **Leafy greens:** Before bolting/flowering\n\n**Harvest Tips:**\n• Pick in early morning for best quality\n• Use sharp, clean tools\n• Handle produce gently\n• Store properly immediately after harvest\n• Leave some for seed saving if desired\n\n**Pro Tip:** Regular harvesting encourages more production!";
    } else if (lowerInput.includes('plant') || lowerInput.includes('seed') || lowerInput.includes('grow')) {
      return "🌱 **Planting Guide:**\n\n**Soil Preparation:**\n• Test and amend soil pH\n• Add compost for nutrients\n• Ensure good drainage\n• Remove weeds and debris\n\n**Planting Tips:**\n• Follow seed packet instructions\n• Plant at correct depth\n• Space plants properly\n• Water immediately after planting\n• Label your plants!\n\n**Timing:** Check your local frost dates and plant accordingly for best results!";
    } else {
      return "🤖 **How can I help you today?**\n\nI'm your AI farming assistant! I can help with:\n\n🌱 **Crop Management** - Planting, growing, harvesting\n💧 **Water & Irrigation** - Timing, methods, conservation\n🌿 **Soil Health** - Testing, improvement, nutrients\n🐛 **Pest Control** - Prevention, natural solutions\n🌤️ **Weather Planning** - Forecasts, seasonal advice\n💰 **Market Tips** - Pricing, timing, storage\n\n**Just ask me anything about farming!** I'm here to help you grow successfully! 🌾";
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Bot className="w-8 h-8 text-primary" />
            <div>
              <span className="font-bold text-xl text-foreground">AI Farm Assistant</span>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <select 
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="text-sm text-muted-foreground bg-transparent border-none focus:outline-none"
                >
                  {languages.map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <Badge variant="secondary" className="text-primary">
            Online
          </Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Quick Questions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Quick Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-3">
              {quickQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="justify-start h-auto p-4 text-left"
                  onClick={() => handleQuickQuestion(question.text)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-primary">
                      {question.icon}
                    </div>
                    <span className="text-sm">{question.text}</span>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Messages */}
        <Card className="h-[500px] flex flex-col">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              Chat with AI Assistant
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 max-h-[350px]">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.sender === 'bot' && (
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-2' : ''}`}>
                    <div
                      className={`rounded-lg p-3 ${
                        message.sender === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-accent text-accent-foreground'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {formatTime(message.timestamp)}
                      </span>
                      {message.category && (
                        <Badge variant="outline" className="text-xs">
                          {message.category}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {message.sender === 'user' && (
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-secondary text-secondary-foreground">
                        U
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="flex gap-2">
              <div className="flex-1 flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask me anything about farming..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button variant="ghost" size="icon">
                  <Mic className="w-4 h-4" />
                </Button>
              </div>
              <Button 
                onClick={handleSendMessage}
                variant="hero"
                size="icon"
                disabled={!inputMessage.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* AI Capabilities */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">What I Can Help You With</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4">
                <Sprout className="w-8 h-8 text-primary mx-auto mb-2" />
                <h4 className="font-semibold text-foreground">Crop Management</h4>
                <p className="text-sm text-muted-foreground">Planting schedules, harvest timing, yield optimization</p>
              </div>
              <div className="text-center p-4">
                <Droplets className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <h4 className="font-semibold text-foreground">Water & Irrigation</h4>
                <p className="text-sm text-muted-foreground">Irrigation timing, water conservation, drainage</p>
              </div>
              <div className="text-center p-4">
                <Cloud className="w-8 h-8 text-earth-gold mx-auto mb-2" />
                <h4 className="font-semibold text-foreground">Weather Insights</h4>
                <p className="text-sm text-muted-foreground">Weather planning, climate adaptation, alerts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Chatbot;