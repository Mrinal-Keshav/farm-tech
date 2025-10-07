import React, { useEffect, useState } from "react";
import { getCart, removeFromCart, clearCart } from "@/lib/cartApi";
import { CartItem } from "@/types/marketplace";

interface CartProps {
  userId: string;
}

export default function Cart({ userId }: CartProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      try {
        const data = await getCart(userId);
        setCart(Array.isArray(data) ? data : data.cart || []);
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchCart();
  }, [userId]);

  const handleRemove = async (productId: string) => {
    const updated = await removeFromCart(userId, productId);
    setCart(updated.cart || []);
  };

  const handleClear = async () => {
    await clearCart(userId);
    setCart([]);
  };

  return (
    <div className="cart-container">
      <h2>Your Shopping Cart</h2>
      {loading ? (
        <p>Loading...</p>
      ) : cart.length === 0 ? (
        <p>No items in your cart yet.</p>
      ) : (
        cart.map((item) => (
          <div key={(item as any).productId?._id || item.product.id} className="cart-item">
            <p>{(item as any).productId?.name || item.product.name}</p>
            <p>Qty: {item.quantity}</p>
            <button onClick={() => handleRemove(((item as any).productId?._id || item.product.id))}>Remove</button>
          </div>
        ))
      )}
      {cart.length > 0 && <button onClick={handleClear}>Clear Cart</button>}
    </div>
  );
}


