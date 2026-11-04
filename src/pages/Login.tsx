import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SEED_USERS } from '../data/seedData';
import { BookOpen, Mail, ArrowRight, Zap, Shield, GraduationCap } from 'lucide-react';
import Button from '../components/common/Button';

export default function Login() {
  const { login, currentUser } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  React.useEffect(() => {
    if (currentUser) {
      navigate(currentUser.role === 'admin' ? '/admin' : '/student', { replace: true });
    }
  }, [currentUser, navigate]);

  const handleLogin = (emailToUse?: string) => {
    const target = (emailToUse ?? email).trim();
    if (!target) {
      setError('Please enter your email address.');
      return;
    }
    setLoading(true);
    const success = login(target);
    setLoading(false);
    if (!success) {
      setError('No account found with that email. Please try again.');
      return;
    }
    setError('');
  };

  const handleQuickLogin = (emailToUse: string) => {
    setEmail(emailToUse);
    setError('');
    const success = login(emailToUse);
    if (!success) {
      setError('Login failed. Please try again.');
    }
  };

  const admins = SEED_USERS.filter((u) => u.role === 'admin');
  const students = SEED_USERS.filter((u) => u.role === 'student');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-3xl">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-600/20 text-white">
              <BookOpen size={26} />
            </div>
            <span className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              AssignFlow
            </span>
          </div>
          <p className="text-sm text-gray-500">
            Professional Academic Assignment & Review Dashboard
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl border border-gray-200/80 shadow-sm overflow-hidden">
          <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
            {/* Left Column: Email login */}
            <div className="p-6 sm:p-8 flex flex-col">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-1">Welcome back</h2>
                <p className="text-sm text-gray-500">Sign in to your dashboard</p>
              </div>

              <div className="flex flex-col gap-4 flex-1">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError('');
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleLogin();
                      }}
                      placeholder="e.g. admin1@joineazy.com"
                      className={[
                        'w-full pl-9 pr-4 py-2.5 border rounded-xl text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white',
                        error ? 'border-red-400' : 'border-gray-200',
                      ].join(' ')}
                    />
                  </div>
                  {error && <p className="mt-1.5 text-xs text-red-500 font-medium">{error}</p>}
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={loading}
                  onClick={() => handleLogin()}
                  className="mt-auto shadow-sm"
                >
                  Sign In
                  <ArrowRight size={16} />
                </Button>

                <p className="text-xs text-center text-gray-400">
                  Passwordless mock login — pick a seeded email or demo user
                </p>
              </div>
            </div>

            {/* Right Column: Demo Accounts */}
            <div className="p-6 sm:p-8 bg-gray-50/70 flex flex-col">
              <div className="mb-5 flex items-center gap-2">
                <div className="p-1.5 bg-indigo-100 rounded-lg text-indigo-600">
                  <Zap size={14} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900">Demo Accounts</h2>
                  <p className="text-xs text-gray-500">One-click instant login</p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {/* Admins */}
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Shield size={12} className="text-indigo-600" />
                    <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                      Admins (Professors)
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {admins.map((u) => (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => handleQuickLogin(u.email)}
                        className="flex items-center gap-3 p-2.5 rounded-xl border border-gray-200/80 bg-white hover:border-indigo-300 hover:bg-indigo-50/50 hover:shadow-xs transition-all text-left group cursor-pointer"
                      >
                        <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {u.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-gray-800 truncate">{u.name}</p>
                          <p className="text-xs text-gray-400 truncate">{u.email}</p>
                        </div>
                        <ArrowRight size={14} className="text-gray-300 group-hover:text-indigo-600 transition-colors shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Students */}
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <GraduationCap size={13} className="text-emerald-600" />
                    <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                      Students
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {students.map((u) => (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => handleQuickLogin(u.email)}
                        className="flex items-center gap-3 p-2.5 rounded-xl border border-gray-200/80 bg-white hover:border-emerald-300 hover:bg-emerald-50/50 hover:shadow-xs transition-all text-left group cursor-pointer"
                      >
                        <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {u.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-gray-800 truncate">{u.name}</p>
                          <p className="text-xs text-gray-400 truncate">{u.email}</p>
                        </div>
                        <ArrowRight size={14} className="text-gray-300 group-hover:text-emerald-600 transition-colors shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-400 text-xs mt-6">
          AssignFlow · Fast, role-based assignment tracking with localStorage persistence
        </p>
      </div>
    </div>
  );
}
