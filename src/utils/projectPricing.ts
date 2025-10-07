import { PriceBreakdown } from '../types/marketplace';

export function calculatePricing(basePrice: number): PriceBreakdown {
  const platformFeeRate = 0.05; // 5% fee similar to project utils
  const platformFee = basePrice * platformFeeRate;
  const finalPrice = basePrice + platformFee;
  const sellerEarnings = basePrice;
  return { basePrice, platformFee, finalPrice, sellerEarnings };
}


