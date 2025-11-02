import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Package,
  DollarSign,
  Calendar,
  User,
  Truck,
  AlertCircle,
} from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { useAuth } from '../context/AuthContext';
import productService from '../services/productService';
import toast from 'react-hot-toast';
import { formatCurrency, formatDateTime } from '../utils/formatters';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    loading: false,
  });

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productService.getProduct(id);
      setProduct(response.data);
    } catch (error) {
      toast.error('Failed to load product');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleteModal({ ...deleteModal, loading: true });
      await productService.deleteProduct(id);
      toast.success('Product deleted successfully');
      navigate('/products');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete product');
      setDeleteModal({ isOpen: false, loading: false });
    }
  };

  if (loading) {
    return (
      <Layout>
        <LoadingSpinner fullScreen />
      </Layout>
    );
  }

  if (!product) {
    return null;
  }

  const isLowStock = product.stock <= product.minStock;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate('/products')}
            className="mb-4 flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            Back to Products
          </Button>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {product.name}
              </h1>
              <p className="text-gray-600 mt-1">Product Details</p>
            </div>

            {(user?.role === 'admin' || user?.role === 'staff') && (
              <div className="flex gap-2">
                <Link to={`/products/edit/${product._id}`}>
                  <Button variant="secondary" className="flex items-center gap-2">
                    <Edit size={18} />
                    Edit
                  </Button>
                </Link>

                {user?.role === 'admin' && (
                  <Button
                    variant="danger"
                    onClick={() => setDeleteModal({ isOpen: true, loading: false })}
                    className="flex items-center gap-2"
                  >
                    <Trash2 size={18} />
                    Delete
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Low Stock Alert */}
          {isLowStock && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
              <AlertCircle className="text-red-600" size={24} />
              <div>
                <h3 className="font-semibold text-red-900">Low Stock Alert</h3>
                <p className="text-red-700 text-sm">
                  Current stock ({product.stock}) is at or below minimum stock level ({product.minStock})
                </p>
              </div>
            </div>
          )}

          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Package size={24} className="text-blue-600" />
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-600">Product Name</label>
                <p className="text-lg font-semibold text-gray-900 mt-1">{product.name}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">SKU</label>
                <p className="text-lg font-semibold text-gray-900 mt-1">{product.sku}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Category</label>
                <p className="text-lg text-gray-900 mt-1">{product.category}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Unit</label>
                <p className="text-lg text-gray-900 mt-1 capitalize">{product.unit}</p>
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-600">Description</label>
                <p className="text-gray-900 mt-1">
                  {product.description || 'No description available'}
                </p>
              </div>
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign size={24} className="text-green-600" />
              Pricing & Stock
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-600">Cost Price</label>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {formatCurrency(product.cost)}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Selling Price</label>
                <p className="text-lg font-semibold text-green-600 mt-1">
                  {formatCurrency(product.price)}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Current Stock</label>
                <p className={`text-lg font-semibold mt-1 ${
                  isLowStock ? 'text-red-600' : 'text-blue-600'
                }`}>
                  {product.stock} {product.unit}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Minimum Stock</label>
                <p className="text-lg text-gray-900 mt-1">
                  {product.minStock} {product.unit}
                </p>
              </div>

              <div className="md:col-span-2 p-4 bg-blue-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Profit Margin</label>
                    <p className="text-xl font-bold text-blue-600 mt-1">
                      {product.profitMargin?.toFixed(2)}%
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Profit per Unit</label>
                    <p className="text-xl font-bold text-green-600 mt-1">
                      {formatCurrency(product.price - product.cost)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Supplier Information */}
          {(product.supplier?.name || product.supplier?.contact) && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Truck size={24} className="text-purple-600" />
                Supplier Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {product.supplier.name && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Supplier Name</label>
                    <p className="text-lg text-gray-900 mt-1">{product.supplier.name}</p>
                  </div>
                )}

                {product.supplier.contact && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Contact</label>
                    <p className="text-lg text-gray-900 mt-1">{product.supplier.contact}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* System Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar size={24} className="text-gray-600" />
              System Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-600">Created At</label>
                <p className="text-gray-900 mt-1">{formatDateTime(product.createdAt)}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Last Updated</label>
                <p className="text-gray-900 mt-1">{formatDateTime(product.updatedAt)}</p>
              </div>

              {product.createdBy && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Created By</label>
                  <p className="text-gray-900 mt-1">
                    {product.createdBy.name} ({product.createdBy.email})
                  </p>
                </div>
              )}

              {product.updatedBy && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Last Updated By</label>
                  <p className="text-gray-900 mt-1">
                    {product.updatedBy.name} ({product.updatedBy.email})
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, loading: false })}
        onConfirm={handleDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${product.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        loading={deleteModal.loading}
      />
    </Layout>
  );
};

export default ProductDetail;