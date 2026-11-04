import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
  BookOpen,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Badge from '../common/Badge';

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = currentUser
    ? currentUser.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  const adminNavItems = [
    { to: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  ];

  const studentNavItems = [
    { to: '/student', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { to: '/student', label: 'My Assignments', icon: <ClipboardList size={20} /> },
  ];

  const navItems = currentUser?.role === 'admin' ? adminNavItems : studentNavItems;

  const sidebarContent = (
    <div
      className={[
        'flex flex-col h-full bg-white border-r border-gray-100 transition-all duration-300',
        collapsed ? 'w-16' : 'w-64',
      ].join(' ')}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-gray-100 shrink-0">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-600 rounded-lg">
              <BookOpen size={18} className="text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg">AssignFlow</span>
          </div>
        )}
        {collapsed && (
          <div className="p-1.5 bg-indigo-600 rounded-lg mx-auto">
            <BookOpen size={18} className="text-white" />
          </div>
        )}
        {/* Mobile close */}
        <button
          onClick={onMobileClose}
          className="lg:hidden p-1 text-gray-400 hover:text-gray-600"
        >
          <X size={18} />
        </button>
        {/* Desktop collapse */}
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="hidden lg:block p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {collapsed && (
        <div className="hidden lg:flex justify-center py-2 border-b border-gray-100 shrink-0">
          <button
            onClick={() => setCollapsed(false)}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 overflow-y-auto">
        {!collapsed && (
          <p className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Menu
          </p>
        )}
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.label}>
              <NavLink
                to={item.to}
                end
                onClick={onMobileClose}
                className={({ isActive }) =>
                  [
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                    collapsed ? 'justify-center' : '',
                  ].join(' ')
                }
                title={collapsed ? item.label : undefined}
              >
                {item.icon}
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User info */}
      <div className="border-t border-gray-100 p-3 shrink-0">
        {!collapsed ? (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 truncate">{currentUser?.name}</p>
              <p className="text-xs text-gray-400 truncate">{currentUser?.email}</p>
            </div>
            <Badge variant={currentUser?.role === 'admin' ? 'info' : 'success'} className="shrink-0">
              {currentUser?.role}
            </Badge>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {initials}
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={[
            'mt-3 flex items-center gap-2 text-sm text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl px-3 py-2 w-full transition-colors',
            collapsed ? 'justify-center' : '',
          ].join(' ')}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut size={16} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:block h-screen sticky top-0 shrink-0">{sidebarContent}</div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={onMobileClose}
          />
          <div className="relative z-50 h-full">{sidebarContent}</div>
        </div>
      )}
    </>
  );
}
