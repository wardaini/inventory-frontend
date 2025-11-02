import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  AlertCircle,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const { user } = useAuth();

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      roles: ['admin', 'staff', 'viewer'],
    },
    {
      name: 'Products',
      path: '/products',
      icon: Package,
      roles: ['admin', 'staff', 'viewer'],
    },
    {
      name: 'Add Product',
      path: '/products/create',
      icon: PlusCircle,
      roles: ['admin', 'staff'],
    },
    {
      name: 'Low Stock',
      path: '/products/low-stock',
      icon: AlertCircle,
      roles: ['admin', 'staff', 'viewer'],
    },
  ];

  // Filter menu based on user role
  const filteredMenu = menuItems.filter((item) =>
    item.roles.includes(user?.role)
  );

  return (
    <>
      {/* Overlay untuk mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-30 w-64 h-screen pt-16 transition-transform bg-white border-r border-gray-200 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {/* Close button untuk mobile */}
        <button
          onClick={toggleSidebar}
          className="absolute top-4 right-4 p-2 rounded-md text-gray-600 hover:bg-gray-100 lg:hidden"
        >
          <X size={20} />
        </button>

        {/* Menu */}
        <div className="h-full px-3 pb-4 overflow-y-auto">
          <ul className="space-y-2 font-medium mt-4">
            {filteredMenu.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                    className={`flex items-center p-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="ml-3">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;