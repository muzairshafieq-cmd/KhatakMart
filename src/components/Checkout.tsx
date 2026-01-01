import { useState } from 'react';
import { ArrowLeft, Upload, CheckCircle } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { supabase } from '../lib/supabase';

interface CheckoutProps {
  onBack: () => void;
  onSuccess: (orderNumber: string) => void;
}

type PaymentMethod = 'COD' | 'EASYPAISA';

export function Checkout({ onBack, onSuccess }: CheckoutProps) {
  const { cart, getCartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    deliveryAddress: '',
    notes: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPaymentProof(e.target.files[0]);
    }
  };

  const uploadPaymentProof = async (orderId: string): Promise<string | null> => {
    if (!paymentProof) return null;

    const fileExt = paymentProof.name.split('.').pop();
    const fileName = `${orderId}-${Date.now()}.${fileExt}`;
    const filePath = `payment-proofs/${fileName}`;

    const { error } = await supabase.storage
      .from('payment-proofs')
      .upload(filePath, paymentProof);

    if (error) {
      console.error('Error uploading payment proof:', error);
      return null;
    }

    const { data } = supabase.storage
      .from('payment-proofs')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const sendWhatsAppNotification = (orderNumber: string, orderId: string) => {
    const message = `*New Order - Khattak MART*\n\n` +
      `Order Number: *${orderNumber}*\n\n` +
      `*Customer Details:*\n` +
      `Name: ${formData.customerName}\n` +
      `Phone: ${formData.customerPhone}\n` +
      `Email: ${formData.customerEmail || 'N/A'}\n\n` +
      `*Delivery Address:*\n${formData.deliveryAddress}\n\n` +
      `*Order Items:*\n` +
      cart.map((item, index) =>
        `${index + 1}. ${item.product.name}\n` +
        `   Qty: ${item.quantity} x Rs. ${item.product.price.toLocaleString()}\n` +
        `   Subtotal: Rs. ${(item.product.price * item.quantity).toLocaleString()}`
      ).join('\n\n') +
      `\n\n*Payment Details:*\n` +
      `Method: ${paymentMethod === 'COD' ? 'Cash on Delivery' : 'Easypaisa'}\n` +
      `Status: ${paymentMethod === 'COD' ? 'Pending - COD' : paymentProof ? 'Verification Pending' : 'Pending'}\n\n` +
      `*Total Amount: Rs. ${getCartTotal().toLocaleString()}*\n` +
      `Delivery Charges: FREE\n\n` +
      (formData.notes ? `*Notes:* ${formData.notes}\n\n` : '') +
      `Order ID: ${orderId}`;

    const whatsappUrl = `https://wa.me/923155770026?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.customerName || !formData.customerPhone || !formData.deliveryAddress) {
      alert('Please fill in all required fields');
      return;
    }

    if (paymentMethod === 'EASYPAISA' && !paymentProof) {
      alert('Please upload payment proof for Easypaisa payment');
      return;
    }

    setLoading(true);

    try {
      const orderNumberResult = await supabase.rpc('generate_order_number');
      const orderNumber = orderNumberResult.data || `KM-${Date.now()}`;

      let paymentProofUrl: string | null = null;
      if (paymentMethod === 'EASYPAISA' && paymentProof) {
        paymentProofUrl = await uploadPaymentProof(orderNumber);
      }

      const paymentStatus =
        paymentMethod === 'COD'
          ? 'PENDING'
          : paymentProof
            ? 'VERIFICATION_PENDING'
            : 'PENDING';

      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          customer_name: formData.customerName,
          customer_phone: formData.customerPhone,
          customer_email: formData.customerEmail || null,
          delivery_address: formData.deliveryAddress,
          payment_method: paymentMethod,
          payment_status: paymentStatus,
          payment_proof_url: paymentProofUrl,
          order_status: 'PENDING',
          subtotal: getCartTotal(),
          delivery_charges: 0,
          total_amount: getCartTotal(),
          notes: formData.notes || null,
          whatsapp_sent: true,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = cart.map((item) => ({
        order_id: orderData.id,
        product_id: item.product.id,
        product_name: item.product.name,
        product_price: item.product.price,
        quantity: item.quantity,
        subtotal: item.product.price * item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      sendWhatsAppNotification(orderNumber, orderData.id);

      clearCart();
      onSuccess(orderNumber);
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-green-600 hover:text-green-700 mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Cart</span>
        </button>

        <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Customer Information
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="customerPhone"
                      value={formData.customerPhone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="+92 XXX XXXXXXX"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Email (Optional)
                    </label>
                    <input
                      type="email"
                      name="customerEmail"
                      value={formData.customerEmail}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Delivery Address *
                    </label>
                    <textarea
                      name="deliveryAddress"
                      value={formData.deliveryAddress}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Complete delivery address with landmarks"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Order Notes (Optional)
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Any special instructions for delivery"
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Payment Method
                </h2>

                <div className="space-y-4">
                  <label className="flex items-start space-x-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === 'COD'}
                      onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                      className="mt-1"
                    />
                    <div>
                      <div className="font-semibold text-gray-800">
                        Cash on Delivery (COD)
                      </div>
                      <div className="text-sm text-gray-600">
                        Pay with cash when your order is delivered
                      </div>
                    </div>
                  </label>

                  <label className="flex items-start space-x-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="EASYPAISA"
                      checked={paymentMethod === 'EASYPAISA'}
                      onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">Easypaisa</div>
                      <div className="text-sm text-gray-600 mb-2">
                        Send payment to Easypaisa and upload proof
                      </div>
                      {paymentMethod === 'EASYPAISA' && (
                        <div className="bg-green-50 border border-green-200 rounded p-3 mt-2">
                          <p className="text-sm font-medium text-gray-800 mb-1">
                            Easypaisa Number:
                          </p>
                          <p className="text-lg font-bold text-green-600">
                            +92 315 5770026
                          </p>
                          <p className="text-xs text-gray-600 mt-2">
                            Please send Rs. {getCartTotal().toLocaleString()} to this number
                          </p>

                          <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Upload Payment Screenshot *
                            </label>
                            <div className="relative">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                                id="payment-proof"
                              />
                              <label
                                htmlFor="payment-proof"
                                className="flex items-center justify-center space-x-2 w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500 transition"
                              >
                                <Upload className="h-5 w-5 text-gray-400" />
                                <span className="text-sm text-gray-600">
                                  {paymentProof ? paymentProof.name : 'Choose file'}
                                </span>
                              </label>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 mb-4">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.product.name} x {item.quantity}
                    </span>
                    <span className="font-medium text-gray-800">
                      Rs. {(item.product.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span>Rs. {getCartTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Charges:</span>
                  <span className="text-green-600 font-semibold">FREE</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-800 pt-2 border-t">
                  <span>Total:</span>
                  <span>Rs. {getCartTotal().toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function OrderConfirmation({ orderNumber, onBackHome }: { orderNumber: string; onBackHome: () => void }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
        <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Order Placed Successfully!
        </h1>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600 mb-2">Your Order Number</p>
          <p className="text-2xl font-bold text-green-600">{orderNumber}</p>
        </div>

        <p className="text-gray-600 mb-6">
          Thank you for your order! We've sent the order details to our WhatsApp.
          We'll contact you shortly to confirm your order.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-700">
            <strong>Note:</strong> Please keep your phone available. We'll call you to confirm your order and delivery details.
          </p>
        </div>

        <button
          onClick={onBackHome}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
