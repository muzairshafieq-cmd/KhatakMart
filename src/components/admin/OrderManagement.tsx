import { useState, useEffect } from 'react';
import { Search, Eye, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { supabase, Order, OrderItem } from '../../lib/supabase';

interface OrderWithItems extends Order {
  items?: OrderItem[];
}

export function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadOrderDetails = async (order: Order) => {
    try {
      const { data, error } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', order.id);

      if (error) throw error;

      setSelectedOrder({ ...order, items: data || [] });
      setShowDetails(true);
    } catch (error) {
      console.error('Error loading order details:', error);
      alert('Failed to load order details');
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ order_status: status })
        .eq('id', orderId);

      if (error) throw error;

      alert('Order status updated successfully!');
      loadOrders();
      if (selectedOrder?.id === orderId) {
        setShowDetails(false);
        setSelectedOrder(null);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  };

  const updatePaymentStatus = async (orderId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ payment_status: status })
        .eq('id', orderId);

      if (error) throw error;

      alert('Payment status updated successfully!');
      loadOrders();
      if (selectedOrder?.id === orderId) {
        const updatedOrder = { ...selectedOrder, payment_status: status as any };
        setSelectedOrder(updatedOrder);
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
      alert('Failed to update payment status');
    }
  };

  const sendToWhatsApp = (order: Order) => {
    const message = `*Order Update - Khattak MART*\n\n` +
      `Order Number: *${order.order_number}*\n` +
      `Customer: ${order.customer_name}\n` +
      `Phone: ${order.customer_phone}\n` +
      `Status: ${order.order_status}\n` +
      `Payment: ${order.payment_method} - ${order.payment_status}`;

    const whatsappUrl = `https://wa.me/923155770026?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_phone.includes(searchTerm);

    const matchesFilter = filterStatus === 'ALL' || order.order_status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Order Management</h2>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order number, customer name, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          >
            <option value="ALL">All Orders</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent"></div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <p className="text-center text-gray-500 py-12">No orders found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold">
                    Order #
                  </th>
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold">
                    Customer
                  </th>
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold">
                    Payment
                  </th>
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold">
                    Status
                  </th>
                  <th className="text-right py-3 px-4 text-gray-700 font-semibold">
                    Amount
                  </th>
                  <th className="text-right py-3 px-4 text-gray-700 font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-800">
                      {order.order_number}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-800">
                          {order.customer_name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {order.customer_phone}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium block text-center ${
                            order.payment_method === 'COD'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-pink-100 text-pink-700'
                          }`}
                        >
                          {order.payment_method}
                        </span>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium block text-center ${
                            order.payment_status === 'PAID'
                              ? 'bg-green-100 text-green-700'
                              : order.payment_status === 'VERIFICATION_PENDING'
                                ? 'bg-orange-100 text-orange-700'
                                : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {order.payment_status}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          order.order_status === 'PENDING'
                            ? 'bg-orange-100 text-orange-700'
                            : order.order_status === 'CONFIRMED'
                              ? 'bg-blue-100 text-blue-700'
                              : order.order_status === 'DELIVERED'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {order.order_status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-gray-800">
                      Rs. {Number(order.total_amount).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => loadOrderDetails(order)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                          title="View Details"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => sendToWhatsApp(order)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded transition"
                          title="Send to WhatsApp"
                        >
                          <ExternalLink className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-800">
                  Order Details: {selectedOrder.order_number}
                </h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3">
                    Customer Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-gray-600">Name:</span>{' '}
                      <span className="font-medium">{selectedOrder.customer_name}</span>
                    </p>
                    <p>
                      <span className="text-gray-600">Phone:</span>{' '}
                      <span className="font-medium">{selectedOrder.customer_phone}</span>
                    </p>
                    {selectedOrder.customer_email && (
                      <p>
                        <span className="text-gray-600">Email:</span>{' '}
                        <span className="font-medium">{selectedOrder.customer_email}</span>
                      </p>
                    )}
                    <p>
                      <span className="text-gray-600">Address:</span>{' '}
                      <span className="font-medium">{selectedOrder.delivery_address}</span>
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3">
                    Order Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-gray-600">Date:</span>{' '}
                      <span className="font-medium">{formatDate(selectedOrder.created_at)}</span>
                    </p>
                    <p>
                      <span className="text-gray-600">Payment Method:</span>{' '}
                      <span className="font-medium">{selectedOrder.payment_method}</span>
                    </p>
                    <p>
                      <span className="text-gray-600">Payment Status:</span>{' '}
                      <span className="font-medium">{selectedOrder.payment_status}</span>
                    </p>
                    <p>
                      <span className="text-gray-600">Order Status:</span>{' '}
                      <span className="font-medium">{selectedOrder.order_status}</span>
                    </p>
                  </div>
                </div>
              </div>

              {selectedOrder.payment_method === 'EASYPAISA' && selectedOrder.payment_proof_url && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                    <ImageIcon className="h-5 w-5" />
                    <span>Payment Proof</span>
                  </h4>
                  <a
                    href={selectedOrder.payment_proof_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                  >
                    <span>View Screenshot</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              )}

              {selectedOrder.notes && (
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Notes</h4>
                  <p className="text-gray-700">{selectedOrder.notes}</p>
                </div>
              )}

              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Order Items</h4>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-3 px-4 text-gray-700 font-semibold">
                          Product
                        </th>
                        <th className="text-center py-3 px-4 text-gray-700 font-semibold">
                          Quantity
                        </th>
                        <th className="text-right py-3 px-4 text-gray-700 font-semibold">
                          Price
                        </th>
                        <th className="text-right py-3 px-4 text-gray-700 font-semibold">
                          Subtotal
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items?.map((item) => (
                        <tr key={item.id} className="border-t">
                          <td className="py-3 px-4 text-gray-800">
                            {item.product_name}
                          </td>
                          <td className="py-3 px-4 text-center text-gray-700">
                            {item.quantity}
                          </td>
                          <td className="py-3 px-4 text-right text-gray-700">
                            Rs. {Number(item.product_price).toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-right font-semibold text-gray-800">
                            Rs. {Number(item.subtotal).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td colSpan={3} className="py-3 px-4 text-right font-semibold">
                          Subtotal:
                        </td>
                        <td className="py-3 px-4 text-right font-semibold">
                          Rs. {Number(selectedOrder.subtotal).toLocaleString()}
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={3} className="py-3 px-4 text-right font-semibold">
                          Delivery:
                        </td>
                        <td className="py-3 px-4 text-right font-semibold text-green-600">
                          FREE
                        </td>
                      </tr>
                      <tr className="border-t-2">
                        <td colSpan={3} className="py-3 px-4 text-right font-bold text-lg">
                          Total:
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-lg">
                          Rs. {Number(selectedOrder.total_amount).toLocaleString()}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-semibold text-gray-800 mb-4">Update Status</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Order Status
                    </label>
                    <select
                      value={selectedOrder.order_status}
                      onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="CONFIRMED">Confirmed</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Payment Status
                    </label>
                    <select
                      value={selectedOrder.payment_status}
                      onChange={(e) => updatePaymentStatus(selectedOrder.id, e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="VERIFICATION_PENDING">Verification Pending</option>
                      <option value="PAID">Paid</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4 border-t">
                <button
                  onClick={() => sendToWhatsApp(selectedOrder)}
                  className="flex items-center space-x-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  <ExternalLink className="h-5 w-5" />
                  <span>Send to WhatsApp</span>
                </button>
                <button
                  onClick={() => setShowDetails(false)}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
