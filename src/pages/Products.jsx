import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Package } from 'lucide-react';
import Layout from '../components/layout/Layout';
import ProductCard from '../components/products/ProductCard';
import ProductFilter from '../components/products/ProductFilter';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import productService from '../services/productService';
import toast from 'react-hot-toast';

const Products = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    sort: '-createdAt',
    page: 1,
    limit: 12,
  });
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    product: null,
    loading: false,
  });

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getProducts(filters);
      setProducts(response.data);
      setStats(response.stats);
    } catch (error) {
      toast.error('Failed to load products');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters({ ...newFilters, page: 1 });
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      category: '',
      sort: '-createdAt',
      page: 1,
      limit: 12,
    });
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
      fetchProducts(); // Refresh list
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete product');
      setDeleteModal({ ...deleteModal, loading: false });
    }
  };

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-600 mt-1">
              Manage your inventory products
            </p>
          </div>
          
          {(user?.role === 'admin' || user?.role === 'staff') && (
            <Link to="/products/create">
              <Button className="flex items-center gap-2">
                <PlusCircle size={20} />
                Add New Product
              </Button>
            </Link>
          )}
        </div>

        {/* Filters */}
        <ProductFilter
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
        />

        {/* Products Grid */}
        {loading ? (
          <LoadingSpinner />
        ) : products.length > 0 ? (
          <>
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

            {/* Pagination */}
            {stats && stats.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <Button
                  variant="outline"
                  disabled={stats.currentPage === 1}
                  onClick={() => handlePageChange(stats.currentPage - 1)}
                >
                  Previous
                </Button>
                
                <div className="flex gap-2">
                  {[...Array(stats.totalPages)].map((_, index) => {
                    const page = index + 1;
                    // Show first, last, current, and adjacent pages
                    if (
                      page === 1 ||
                      page === stats.totalPages ||
                      (page >= stats.currentPage - 1 && page <= stats.currentPage + 1)
                    ) {
                      return (
                        <Button
                          key={page}
                          variant={stats.currentPage === page ? 'primary' : 'outline'}
                          onClick={() => handlePageChange(page)}
                          className="w-10 h-10"
                        >
                          {page}
                        </Button>
                      );
                    } else if (
                      page === stats.currentPage - 2 ||
                      page === stats.currentPage + 2
                    ) {
                      return <span key={page} className="px-2">...</span>;
                    }
                    return null;
                  })}
                </div>

                <Button
                  variant="outline"
                  disabled={stats.currentPage === stats.totalPages}
                  onClick={() => handlePageChange(stats.currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <Package size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Products Found
            </h3>
            <p className="text-gray-600 mb-6">
              {filters.search || filters.category
                ? 'Try adjusting your filters'
                : 'Get started by adding your first product'}
            </p>
            {(user?.role === 'admin' || user?.role === 'staff') && (
              <Link to="/products/create">
                <Button>Add Your First Product</Button>
              </Link>
            )}
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

export default Products;