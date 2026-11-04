import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SEED_USERS } from '../data/seedData';
import { BookOpen, Mail, ArrowRight, Zap } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-violet-600 to-indigo-800 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/5 rounded-full" />
      </div>

      <div className="relative w-full max-w-3xl">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur">
            <BookOpen size={28} className="text-white" />
          </div>
          <span className="text-3xl font-bold text-white tracking-tight">AssignFlow</span>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
            {/* Left: Email login */}
            <div className="p-8 flex flex-col">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-1">Sign in</h2>
                <p className="text-sm text-gray-500">Enter your email to continue</p>
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
                      placeholder="you@example.com"
                      className={[
                        'w-full pl-9 pr-4 py-2.5 border rounded-xl text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow',
                        error ? 'border-red-400' : 'border-gray-200',
                      ].join(' ')}
                    />
                  </div>
                  {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={loading}
                  onClick={() => handleLogin()}
                  className="mt-auto"
                >
                  Sign In
                  <ArrowRight size={16} />
                </Button>

                <p className="text-xs text-center text-gray-400">
                  No password required — demo authentication
                </p>
              </div>
            </div>

            {/* Right: Demo accounts */}
            <div className="p-8 bg-gray-50/50 flex flex-col">
              <div className="mb-5 flex items-center gap-2">
                <div className="p-1.5 bg-indigo-100 rounded-lg">
                  <Zap size={14} className="text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900">Demo Accounts</h2>
                  <p className="text-xs text-gray-500">Click to sign in instantly</p>
                </div>
              </div>

              <div className="flex flex-col gap-5">
                {/* Admins */}
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Admins
                  </p>
                  <div className="flex flex-col gap-2">
                    {admins.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => handleQuickLogin(u.email)}
                        className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-white hover:border-indigo-200 hover:bg-indigo-50 transition-colors text-left group"
                      >
                        <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {u.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{u.name}</p>
                          <p className="text-xs text-gray-400 truncate">{u.email}</p>
                        </div>
                        <ArrowRight size={14} className="text-gray-300 group-hover:text-indigo-500 ml-auto shrink-0 transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Students */}
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Students
                  </p>
                  <div className="flex flex-col gap-2">
                    {students.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => handleQuickLogin(u.email)}
                        className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-white hover:border-emerald-200 hover:bg-emerald-50 transition-colors text-left group"
                      >
                        <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {u.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{u.name}</p>
                          <p className="text-xs text-gray-400 truncate">{u.email}</p>
                        </div>
                        <ArrowRight size={14} className="text-gray-300 group-hover:text-emerald-500 ml-auto shrink-0 transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-white/50 text-xs mt-6">
          AssignFlow — Assignment & Review Dashboard
        </p>
      </div>
    </div>
  );
}
