import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  LogOut,
  DollarSign,
  TrendingUp,
  Users,
  Clock,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase, Order } from '../../lib/supabase';
import { ProductManagement } from './ProductManagement';
import { OrderManagement } from './OrderManagement';

type Tab = 'dashboard' | 'products' | 'orders';

export function AdminDashboard() {
  const { admin, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    codOrders: 0,
    easypaisaOrders: 0,
    totalRevenue: 0,
    todayOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activeTab === 'dashboard') {
      loadDashboardData();
    }
  }, [activeTab]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (orders) {
        const today = new Date().toDateString();

        setStats({
          totalOrders: orders.length,
          pendingOrders: orders.filter((o) => o.order_status === 'PENDING').length,
          codOrders: orders.filter((o) => o.payment_method === 'COD').length,
          easypaisaOrders: orders.filter((o) => o.payment_method === 'EASYPAISA').length,
          totalRevenue: orders.reduce((sum, o) => sum + Number(o.total_amount), 0),
          todayOrders: orders.filter(
            (o) => new Date(o.created_at).toDateString() === today
          ).length,
        });

        setRecentOrders(orders.slice(0, 5));
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({
    icon: Icon,
    label,
    value,
    color,
  }: {
    icon: typeof Package;
    label: string;
    value: string | number;
    color: string;
  }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-green-600 text-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Package className="h-8 w-8" />
              <div>
                <h1 className="text-xl font-bold">Khattak MART Admin</h1>
                <p className="text-xs text-green-100">Management Panel</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm">Welcome, {admin?.full_name}</span>
              <button
                onClick={logout}
                className="flex items-center space-x-2 bg-green-700 hover:bg-green-800 px-4 py-2 rounded-lg transition"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          <aside className="md:w-64">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center space-x-3 px-6 py-4 transition ${
                  activeTab === 'dashboard'
                    ? 'bg-green-50 text-green-600 border-l-4 border-green-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <LayoutDashboard className="h-5 w-5" />
                <span className="font-medium">Dashboard</span>
              </button>

              <button
                onClick={() => setActiveTab('products')}
                className={`w-full flex items-center space-x-3 px-6 py-4 transition ${
                  activeTab === 'products'
                    ? 'bg-green-50 text-green-600 border-l-4 border-green-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Package className="h-5 w-5" />
                <span className="font-medium">Products</span>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center space-x-3 px-6 py-4 transition ${
                  activeTab === 'orders'
                    ? 'bg-green-50 text-green-600 border-l-4 border-green-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <ShoppingBag className="h-5 w-5" />
                <span className="font-medium">Orders</span>
              </button>
            </div>
          </aside>

          <main className="flex-1">
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>

                {loading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent"></div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <StatCard
                        icon={ShoppingBag}
                        label="Total Orders"
                        value={stats.totalOrders}
                        color="bg-blue-500"
                      />
                      <StatCard
                        icon={Clock}
                        label="Pending Orders"
                        value={stats.pendingOrders}
                        color="bg-orange-500"
                      />
                      <StatCard
                        icon={TrendingUp}
                        label="Today's Orders"
                        value={stats.todayOrders}
                        color="bg-green-500"
                      />
                      <StatCard
                        icon={DollarSign}
                        label="Total Revenue"
                        value={`Rs. ${stats.totalRevenue.toLocaleString()}`}
                        color="bg-purple-500"
                      />
                      <StatCard
                        icon={Users}
                        label="COD Orders"
                        value={stats.codOrders}
                        color="bg-indigo-500"
                      />
                      <StatCard
                        icon={Package}
                        label="Easypaisa Orders"
                        value={stats.easypaisaOrders}
                        color="bg-pink-500"
                      />
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">
                        Recent Orders
                      </h3>
                      {recentOrders.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No orders yet</p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left py-3 px-4 text-gray-700 font-semibold">
                                  Order #
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
                              </tr>
                            </thead>
                            <tbody>
                              {recentOrders.map((order) => (
                                <tr key={order.id} className="border-b hover:bg-gray-50">
                                  <td className="py-3 px-4 font-medium text-gray-800">
                                    {order.order_number}
                                  </td>
                                  <td className="py-3 px-4 text-gray-700">
                                    {order.customer_name}
                                  </td>
                                  <td className="py-3 px-4">
                                    <span
                                      className={`px-2 py-1 rounded text-xs font-medium ${
                                        order.payment_method === 'COD'
                                          ? 'bg-blue-100 text-blue-700'
                                          : 'bg-pink-100 text-pink-700'
                                      }`}
                                    >
                                      {order.payment_method}
                                    </span>
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
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTab === 'products' && <ProductManagement />}
            {activeTab === 'orders' && <OrderManagement />}
          </main>
        </div>
      </div>
    </div>
  );
}
