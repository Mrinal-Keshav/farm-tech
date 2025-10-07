import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface Crop {
  id: number;
  name: string;
  icon: string;
  basePrice: number;
}

interface MarketPanelProps {
  marketPrices: Record<string, number>;
  inventory: Record<string, number>;
  cropData: Crop[];
  onSell: (cropName: string, amount: number) => void;
}

const MarketPanel: React.FC<MarketPanelProps> = ({
  marketPrices,
  inventory,
  cropData,
  onSell
}) => {
  const [sellAmounts, setSellAmounts] = useState<Record<string, number>>({});

  const handleSellAmountChange = (cropName: string, amount: string) => {
    const numAmount = parseInt(amount) || 0;
    setSellAmounts(prev => ({
      ...prev,
      [cropName]: Math.min(numAmount, inventory[cropName] || 0)
    }));
  };

  const handleSell = (cropName: string) => {
    const amount = sellAmounts[cropName] || 0;
    if (amount > 0 && amount <= (inventory[cropName] || 0)) {
      onSell(cropName, amount);
      setSellAmounts(prev => ({
        ...prev,
        [cropName]: 0
      }));
    }
  };

  const getPriceChange = (cropName: string) => {
    const crop = cropData.find(c => c.name.toLowerCase() === cropName);
    if (!crop) return 0;
    
    const currentPrice = marketPrices[cropName];
    const basePrice = crop.basePrice;
    const change = ((currentPrice - basePrice) / basePrice) * 100;
    return Math.round(change);
  };

  const getPriceChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-3 w-3 text-green-600" />;
    if (change < 0) return <TrendingDown className="h-3 w-3 text-red-600" />;
    return null;
  };

  const getPriceChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <ShoppingCart className="h-5 w-5 text-green-600" />
        <h2 className="font-semibold text-lg">Market</h2>
      </div>

      <div className="space-y-3">
        {cropData.map((crop) => {
          const cropName = crop.name.toLowerCase();
          const currentPrice = marketPrices[cropName];
          const availableAmount = inventory[cropName] || 0;
          const priceChange = getPriceChange(cropName);
          const sellAmount = sellAmounts[cropName] || 0;

          return (
            <Card key={crop.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{crop.icon}</span>
                    <CardTitle className="text-sm">{crop.name}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="font-bold text-sm">{currentPrice}</span>
                    {priceChange !== 0 && (
                      <div className={`flex items-center gap-1 text-xs ${getPriceChangeColor(priceChange)}`}>
                        {getPriceChangeIcon(priceChange)}
                        <span>{Math.abs(priceChange)}%</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span>Available:</span>
                  <Badge variant="outline">{availableAmount} units</Badge>
                </div>

                {availableAmount > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="1"
                        max={availableAmount}
                        value={sellAmount}
                        onChange={(e) => handleSellAmountChange(cropName, e.target.value)}
                        className="flex-1 h-8 text-sm"
                        placeholder="Amount to sell"
                      />
                      <Button
                        size="sm"
                        onClick={() => handleSell(cropName)}
                        disabled={sellAmount <= 0}
                        className="h-8"
                      >
                        Sell
                      </Button>
                    </div>
                    
                    {sellAmount > 0 && (
                      <div className="text-xs text-gray-600 text-center">
                        Total: ${(sellAmount * currentPrice).toLocaleString()}
                      </div>
                    )}
                  </div>
                )}

                {availableAmount === 0 && (
                  <p className="text-xs text-gray-500 text-center">
                    No {cropName} available to sell
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="bg-green-50 p-3 rounded-lg">
        <h3 className="font-medium text-sm mb-2">Market Tips</h3>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Prices fluctuate based on market conditions</li>
          <li>• Watch for market events that affect prices</li>
          <li>• Sell when prices are high for maximum profit</li>
        </ul>
      </div>
    </div>
  );
};

export default MarketPanel;

