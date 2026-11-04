import React from 'react';
import { Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Badge from '../common/Badge';

interface HeaderProps {
  pageTitle: string;
  onMenuClick: () => void;
}

export default function Header({ pageTitle, onMenuClick }: HeaderProps) {
  const { currentUser } = useAuth();

  const initials = currentUser
    ? currentUser.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-gray-100 px-4 md:px-6 py-3 flex items-center gap-4">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
      >
        <Menu size={20} />
      </button>

      {/* Title */}
      <h1 className="text-lg font-semibold text-gray-900 flex-1">{pageTitle}</h1>

      {/* User info */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:block text-right">
          <p className="text-sm font-medium text-gray-900">{currentUser?.name}</p>
          <div className="flex justify-end">
            <Badge variant={currentUser?.role === 'admin' ? 'info' : 'success'}>
              {currentUser?.role === 'admin' ? 'Admin' : 'Student'}
            </Badge>
          </div>
        </div>
        <div className="w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0">
          {initials}
        </div>
      </div>
    </header>
  );
}
