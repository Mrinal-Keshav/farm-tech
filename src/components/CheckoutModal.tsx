import React, { useState } from 'react';
import { X, CreditCard, Truck, MapPin, User, Mail, Phone, Check } from 'lucide-react';
import { CartItem } from '../types/marketplace';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onOrderComplete: () => void;
}

export default function CheckoutModal({ isOpen, onClose, cartItems, onOrderComplete }: CheckoutModalProps) {
  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    paymentMethod: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: ''
  });

  const totalAmount = cartItems.reduce((total, item) => total + (item.product.basePrice * item.quantity), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 'details') {
      setStep('payment');
    } else if (step === 'payment') {
      setTimeout(() => {
        setStep('success');
        setTimeout(() => {
          onOrderComplete();
          onClose();
          setStep('details');
        }, 2000);
      }, 1200);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Checkout</h2>
          <button onClick={onClose} className="p-2 rounded hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-6">
            <div className={`flex items-center gap-2 ${step !== 'details' ? 'text-green-600' : ''}`}>
              <User className="w-4 h-4" /> Details
            </div>
            <div className={`flex items-center gap-2 ${step === 'payment' ? 'text-green-600' : ''}`}>
              <CreditCard className="w-4 h-4" /> Payment
            </div>
            <div className={`flex items-center gap-2 ${step === 'success' ? 'text-green-600' : ''}`}>
              <Check className="w-4 h-4" /> Success
            </div>
          </div>

          {step === 'success' ? (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Order Placed!</h3>
              <p className="text-gray-600">Thank you for your purchase. We are processing your order.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600">Full Name</label>
                  <div className="mt-1 flex items-center gap-2 border rounded-lg px-3 py-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <input className="flex-1 outline-none" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Email</label>
                  <div className="mt-1 flex items-center gap-2 border rounded-lg px-3 py-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <input type="email" className="flex-1 outline-none" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Phone</label>
                  <div className="mt-1 flex items-center gap-2 border rounded-lg px-3 py-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <input className="flex-1 outline-none" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600">Address</label>
                  <div className="mt-1 flex items-center gap-2 border rounded-lg px-3 py-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <input className="flex-1 outline-none" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">City</label>
                    <input className="mt-1 w-full border rounded-lg px-3 py-2 outline-none" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} required />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">ZIP Code</label>
                    <input className="mt-1 w-full border rounded-lg px-3 py-2 outline-none" value={formData.zipCode} onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })} required />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Truck className="w-4 h-4" /> Free shipping over ₹750
                </div>
              </div>

              {step === 'payment' && (
                <div className="md:col-span-2 grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-600">Card Number</label>
                      <input className="mt-1 w-full border rounded-lg px-3 py-2 outline-none" value={formData.cardNumber} onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-600">Expiry Date</label>
                        <input className="mt-1 w-full border rounded-lg px-3 py-2 outline-none" placeholder="MM/YY" value={formData.expiryDate} onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })} required />
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">CVV</label>
                        <input className="mt-1 w-full border rounded-lg px-3 py-2 outline-none" value={formData.cvv} onChange={(e) => setFormData({ ...formData, cvv: e.target.value })} required />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Name on Card</label>
                      <input className="mt-1 w-full border rounded-lg px-3 py-2 outline-none" value={formData.nameOnCard} onChange={(e) => setFormData({ ...formData, nameOnCard: e.target.value })} required />
                    </div>
                  </div>
                  <div>
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Order Summary</h4>
                      <div className="space-y-2 max-h-48 overflow-auto">
                        {cartItems.map((item) => (
                          <div key={item.product.id} className="flex justify-between text-sm">
                            <span>{item.product.name} × {item.quantity}</span>
                            <span>₹{(item.product.basePrice * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between font-semibold border-t pt-2 mt-2">
                        <span>Total</span>
                        <span>₹{totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="md:col-span-2 flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={step === 'payment' ? () => setStep('details') : onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {step === 'payment' ? 'Back' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  {step === 'details' ? 'Continue to Payment' : 'Place Order'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}


