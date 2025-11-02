import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Layout from '../components/layout/Layout';
import ProductForm from '../components/products/ProductForm';
import Button from '../components/common/Button';
import productService from '../services/productService';
import toast from 'react-hot-toast';

const CreateProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      await productService.createProduct(formData);
      toast.success('Product created successfully!');
      navigate('/products');
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to create product';
      toast.error(message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
          <p className="text-gray-600 mt-1">
            Fill in the information below to add a new product to your inventory
          </p>
        </div>

        {/* Form */}
        <ProductForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </Layout>
  );
};

export default CreateProduct;