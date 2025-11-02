import React from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Package, AlertCircle } from 'lucide-react';
import Button from '../common/Button';

const ProductCard = ({ product, onDelete, userRole }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const isLowStock = product.stock <= product.minStock;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <Package size={20} />
            <span className="font-semibold">{product.category}</span>
          </div>
          {isLowStock && (
            <div className="flex items-center gap-1 bg-red-500 px-2 py-1 rounded text-xs">
              <AlertCircle size={14} />
              Low Stock
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description || 'No description'}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">SKU:</span>
            <span className="font-medium">{product.sku}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Price:</span>
            <span className="font-semibold text-green-600">
              {formatCurrency(product.price)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Stock:</span>
            <span
              className={`font-medium ${
                isLowStock ? 'text-red-600' : 'text-blue-600'
              }`}
            >
              {product.stock} {product.unit}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-3 border-t">
          <Link to={`/products/${product._id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              View Details
            </Button>
          </Link>

          {(userRole === 'admin' || userRole === 'staff') && (
            <>
              <Link to={`/products/edit/${product._id}`}>
                <Button variant="secondary" size="sm">
                  <Edit size={16} />
                </Button>
              </Link>

              {userRole === 'admin' && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onDelete(product)}
                >
                  <Trash2 size={16} />
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;