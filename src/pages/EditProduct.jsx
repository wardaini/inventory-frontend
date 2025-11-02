import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Layout from '../components/layout/Layout';
import ProductForm from '../components/products/ProductForm';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import productService from '../services/productService';
import toast from 'react-hot-toast';

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [product, setProduct] = useState(null);

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

  const handleSubmit = async (formData) => {
    try {
      setSubmitting(true);
      await productService.updateProduct(id, formData);
      toast.success('Product updated successfully!');
      navigate('/products');
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to update product';
      toast.error(message);
      console.error(error);
    } finally {
      setSubmitting(false);
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
          <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
          <p className="text-gray-600 mt-1">
            Update product information
          </p>
        </div>

        {/* Form */}
        {product && (
          <ProductForm
            initialData={product}
            onSubmit={handleSubmit}
            loading={submitting}
          />
        )}
      </div>
    </Layout>
  );
};

export default EditProduct;