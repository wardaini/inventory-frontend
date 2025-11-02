import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';

const ProductForm = ({ initialData = {}, onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    sku: initialData.sku || '',
    description: initialData.description || '',
    category: initialData.category || 'Electronics',
    price: initialData.price || '',
    cost: initialData.cost || '',
    stock: initialData.stock || '',
    minStock: initialData.minStock || 10,
    unit: initialData.unit || 'pcs',
    supplier: {
      name: initialData.supplier?.name || '',
      contact: initialData.supplier?.contact || '',
    },
  });

  const [errors, setErrors] = useState({});

  const categories = [
    'Electronics',
    'Clothing',
    'Food & Beverage',
    'Furniture',
    'Stationery',
    'Hardware',
    'Other',
  ];

  const units = ['pcs', 'box', 'kg', 'liter', 'meter', 'set'];

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle nested supplier fields
    if (name.startsWith('supplier.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        supplier: {
          ...formData.supplier,
          [field]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name || formData.name.trim().length < 3) {
      newErrors.name = 'Product name must be at least 3 characters';
    }

    if (!formData.sku || formData.sku.trim().length < 3) {
      newErrors.sku = 'SKU must be at least 3 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.price || parseFloat(formData.price) < 0) {
      newErrors.price = 'Price must be a positive number';
    }

    if (!formData.cost || parseFloat(formData.cost) < 0) {
      newErrors.cost = 'Cost must be a positive number';
    }

    if (!formData.stock || parseInt(formData.stock) < 0) {
      newErrors.stock = 'Stock must be a non-negative number';
    }

    if (!formData.minStock || parseInt(formData.minStock) < 0) {
      newErrors.minStock = 'Minimum stock must be a non-negative number';
    }

    if (!formData.unit) {
      newErrors.unit = 'Unit is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      // Convert string numbers to actual numbers
      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        cost: parseFloat(formData.cost),
        stock: parseInt(formData.stock),
        minStock: parseInt(formData.minStock),
      };

      onSubmit(submitData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Basic Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Product Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter product name"
            error={errors.name}
            required
          />

          <Input
            label="SKU"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            placeholder="Enter SKU"
            error={errors.sku}
            required
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter product description"
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.category ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unit <span className="text-red-500">*</span>
            </label>
            <select
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.unit ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              {units.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
            {errors.unit && (
              <p className="mt-1 text-sm text-red-600">{errors.unit}</p>
            )}
          </div>
        </div>
      </div>

      {/* Pricing & Stock */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Pricing & Stock
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Cost Price"
            type="number"
            name="cost"
            value={formData.cost}
            onChange={handleChange}
            placeholder="0"
            error={errors.cost}
            required
            min="0"
            step="0.01"
          />

          <Input
            label="Selling Price"
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="0"
            error={errors.price}
            required
            min="0"
            step="0.01"
          />

          <Input
            label="Stock Quantity"
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            placeholder="0"
            error={errors.stock}
            required
            min="0"
          />

          <Input
            label="Minimum Stock"
            type="number"
            name="minStock"
            value={formData.minStock}
            onChange={handleChange}
            placeholder="10"
            error={errors.minStock}
            required
            min="0"
          />
        </div>

        {/* Profit Margin Preview */}
        {formData.cost && formData.price && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Profit Margin:</span>{' '}
              <span className="text-blue-600 font-semibold">
                {(
                  ((parseFloat(formData.price) - parseFloat(formData.cost)) /
                    parseFloat(formData.cost)) *
                  100
                ).toFixed(2)}
                %
              </span>
            </p>
            <p className="text-sm text-gray-700 mt-1">
              <span className="font-medium">Profit per Unit:</span>{' '}
              <span className="text-green-600 font-semibold">
                Rp{' '}
                {(
                  parseFloat(formData.price) - parseFloat(formData.cost)
                ).toLocaleString('id-ID')}
              </span>
            </p>
          </div>
        )}
      </div>

      {/* Supplier Information */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Supplier Information (Optional)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Supplier Name"
            name="supplier.name"
            value={formData.supplier.name}
            onChange={handleChange}
            placeholder="Enter supplier name"
          />

          <Input
            label="Supplier Contact"
            name="supplier.contact"
            value={formData.supplier.contact}
            onChange={handleChange}
            placeholder="Phone or email"
          />
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-4 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
        >
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {initialData._id ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;