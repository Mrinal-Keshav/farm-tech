import React from 'react';
import { ShoppingCart, Package, MapPin } from 'lucide-react';
import { Product, Language } from '../../types/marketplace';
import { calculatePricing } from '../../utils/projectPricing';
import { getTranslation } from '../../utils/projectTranslations';

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  language: Language;
}

export default function ProductGrid({ products, onAddToCart, onBuyNow, language }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <Package className="h-20 w-20 text-gray-300 mx-auto mb-6" />
          <h3 className="text-2xl font-medium text-gray-900 mb-4">No products found</h3>
          <p className="text-gray-500 text-lg">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {products.map((product) => {
        const pricing = calculatePricing(product.basePrice);

        return (
          <div
            key={product.id}
            className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group hover:scale-105"
          >
            <div className="relative overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute top-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                Stock: {product.quantity}
              </div>
              {product.quantity === 0 && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium">
                    {getTranslation('outOfStock', language)}
                  </span>
                </div>
              )}
            </div>

            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                {product.name}
              </h3>

              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {product.description}
              </p>

              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <Package className="h-4 w-4" />
                <span>{product.sellerName}</span>
              </div>

              {product.location && (
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <MapPin className="h-4 w-4" />
                  <span>{product.location}</span>
                </div>
              )}

              <div className="border-t pt-4">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Base Price:</span>
                    <span>₹{product.basePrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{getTranslation('platformFee', language)}:</span>
                    <span>₹{pricing.platformFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span className="text-green-600">₹{pricing.finalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => onAddToCart(product)}
                    disabled={product.quantity === 0}
                    className="flex-1 bg-green-100 text-green-700 py-3 rounded-lg hover:bg-green-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2 font-medium"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    {getTranslation('addToCart', language)}
                  </button>
                  <button
                    onClick={() => onBuyNow(product)}
                    disabled={product.quantity === 0}
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
                  >
                    {getTranslation('buyNow', language)}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}


