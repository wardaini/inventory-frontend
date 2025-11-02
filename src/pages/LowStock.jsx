import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Package, PlusCircle } from 'lucide-react';
import Layout from '../components/layout/Layout';
import ProductCard from '../components/products/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import productService from '../services/productService';
import toast from 'react-hot-toast';

const LowStock = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    product: null,
    loading: false,
  });

  useEffect(() => {
    fetchLowStockProducts();
  }, []);

  const fetchLowStockProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getLowStock();
      setProducts(response.data);
    } catch (error) {
      toast.error('Failed to load low stock products');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (product) => {
    setDeleteModal({
      isOpen: true,
      product,
      loading: false,
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      setDeleteModal({ ...deleteModal, loading: true });
      await productService.deleteProduct(deleteModal.product._id);
      toast.success('Product deleted successfully');
      setDeleteModal({ isOpen: false, product: null, loading: false });
      fetchLowStockProducts(); // Refresh list
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete product');
      setDeleteModal({ ...deleteModal, loading: false });
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="text-red-600" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Low Stock Alert</h1>
              <p className="text-gray-600 mt-1">
                Products that need immediate attention
              </p>
            </div>
          </div>
        </div>

        {/* Alert Banner */}
        {!loading && products.length > 0 && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0" size={24} />
              <div>
                <h3 className="font-semibold text-red-900">
                  {products.length} Product{products.length > 1 ? 's' : ''} Need Restocking
                </h3>
                <p className="text-red-700 text-sm mt-1">
                  These products have reached or fallen below their minimum stock levels.
                  Consider restocking soon to avoid running out.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <LoadingSpinner />
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onDelete={handleDeleteClick}
                userRole={user?.role}
              />
            ))}
          </div>
        ) : (
          // Empty State
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
              <Package size={48} className="text-green-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              All Stock Levels are Good! 🎉
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              No products are currently running low on stock. All inventory levels are
              above their minimum thresholds.
            </p>
            
            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products">
                <Button variant="outline">View All Products</Button>
              </Link>
              {(user?.role === 'admin' || user?.role === 'staff') && (
                <Link to="/products/create">
                  <Button className="flex items-center gap-2">
                    <PlusCircle size={20} />
                    Add New Product
                  </Button>
                </Link>
              )}
            </div>

            {/* Tips Card */}
            <div className="mt-12 max-w-2xl mx-auto bg-blue-50 border border-blue-200 rounded-lg p-6 text-left">
              <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <AlertCircle size={20} />
                Tips for Managing Stock Levels
              </h4>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Products appear here when their current stock ≤ minimum stock level</span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Set appropriate minimum stock levels when creating products</span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Check this page regularly to avoid running out of stock</span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Update stock quantities after receiving new inventory</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({ isOpen: false, product: null, loading: false })
        }
        onConfirm={handleDeleteConfirm}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteModal.product?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        loading={deleteModal.loading}
      />
    </Layout>
  );
};

export default LowStock;