import React from "react";
import { addToCart } from "@/lib/cartApi";

interface ProductLike {
  _id?: string;
  id?: string;
  name: string;
  price?: number;
  basePrice?: number;
}

interface ProductCardProps {
  userId: string;
  product: ProductLike;
}

export default function ProductCard({ userId, product }: ProductCardProps) {
  const handleAdd = async () => {
    const productId = product._id || product.id;
    if (!productId) return;
    await addToCart(userId, productId, 1);
    alert("Added to cart!");
  };

  const displayPrice = product.price ?? product.basePrice ?? 0;

  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <p>{displayPrice} ₹</p>
      <button onClick={handleAdd}>Add to Cart</button>
    </div>
  );
}


