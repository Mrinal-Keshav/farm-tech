const API_URL = "http://localhost:5000/api/cart";

export async function addToCart(userId: string, productId: string, quantity: number = 1) {
  const res = await fetch(`${API_URL}/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, productId, quantity })
  });
  return res.json();
}

export async function getCart(userId: string) {
  const res = await fetch(`${API_URL}/${userId}`);
  return res.json();
}

export async function removeFromCart(userId: string, productId: string) {
  const res = await fetch(`${API_URL}/remove`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, productId })
  });
  return res.json();
}

export async function clearCart(userId: string) {
  const res = await fetch(`${API_URL}/clear`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId })
  });
  return res.json();
}


