import React, { useState, useEffect } from 'react';
import { 
  Package, 
  AlertCircle, 
  DollarSign, 
  TrendingUp,
  ShoppingCart 
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Layout from '../components/layout/Layout';
import StatsCard from '../components/dashboard/StatsCard';
import RecentProducts from '../components/dashboard/RecentProducts';
import LoadingSpinner from '../components/common/LoadingSpinner';
import productService from '../services/productService';
import toast from 'react-hot-toast';
import { formatCurrency } from '../utils/formatters';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [recentProducts, setRecentProducts] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch stats
      const statsResponse = await productService.getDashboardStats();
      setStats(statsResponse.data);

      // Fetch recent products
      const productsResponse = await productService.getProducts({
        limit: 5,
        sort: '-createdAt',
      });
      setRecentProducts(productsResponse.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <LoadingSpinner fullScreen />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here's your inventory overview.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Products"
            value={stats?.totalProducts || 0}
            icon={Package}
            color="blue"
            subtext={`${stats?.recentProducts || 0} added this week`}
          />
          <StatsCard
            title="Low Stock Items"
            value={stats?.lowStockCount || 0}
            icon={AlertCircle}
            color="red"
            subtext="Need attention"
          />
          <StatsCard
            title="Total Stock Value"
            value={formatCurrency(stats?.totalStockValue || 0)}
            icon={DollarSign}
            color="green"
            subtext="Inventory value"
          />
          <StatsCard
            title="Categories"
            value={stats?.productsByCategory?.length || 0}
            icon={ShoppingCart}
            color="purple"
            subtext="Product categories"
          />
        </div>

        {/* Charts and Recent Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Products by Category Chart */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Products by Category
            </h3>
            {stats?.productsByCategory && stats.productsByCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.productsByCategory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="_id" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#3b82f6" name="Products" />
                  <Bar dataKey="totalStock" fill="#10b981" name="Total Stock" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-500 py-8">
                No data available
              </p>
            )}
          </div>

          {/* Recent Products */}
          <RecentProducts products={recentProducts} />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;