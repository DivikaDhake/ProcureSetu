import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { 
  Building2, 
  Rocket, 
  ShieldCheck, 
  Mail, 
  Lock, 
  Check, 
  AlertCircle, 
  Sparkles, 
  ArrowLeft,
  X,
  KeyRound,
  Info
} from 'lucide-react';

interface LoginViewProps {
  initialRole?: UserRole;
}

export const LoginView: React.FC<LoginViewProps> = ({ initialRole = 'startup' }) => {
  const { login, navigateTo } = useApp();

  const [role, setRole] = useState<UserRole>(initialRole);
  const [email, setEmail] = useState(
    initialRole === 'startup' ? 'startup@procuresetu.demo' : 'govt@procuresetu.demo'
  );
  const [password, setPassword] = useState(
    initialRole === 'startup' ? 'Startup@123' : 'Govt@123'
  );
  const [error, setError] = useState<string | null>(null);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    setError(null);
    if (newRole === 'startup') {
      setEmail('startup@procuresetu.demo');
      setPassword('Startup@123');
    } else {
      setEmail('govt@procuresetu.demo');
      setPassword('Govt@123');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please provide both official email and password.');
      return;
    }

    const res = login(email, password, role);
    if (!res.success) {
      setError(res.message || 'Authentication failed. Please verify credentials.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4.5rem)] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center bg-[#f0f4f8]">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden neu-card">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-[#0f2b48] to-[#16385c] px-6 py-6 text-white text-center relative">
          <button
            onClick={() => navigateTo('/')}
            className="absolute left-4 top-4 text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-1 text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Home</span>
          </button>

          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-3 border border-white/20">
            <ShieldCheck className="w-7 h-7 text-[#f97316]" />
          </div>
          <h2 className="text-xl font-black tracking-tight">Sign In to ProcureSetu</h2>
          <p className="text-xs text-slate-300 mt-1">
            Innovation Procurement Intelligence & Trust Gateway
          </p>
        </div>

        {/* Role Selection Tabs */}
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center mb-2">
            Select Your Role to Proceed
          </div>
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-200/80 rounded-xl">
            <button
              type="button"
              onClick={() => handleRoleChange('startup')}
              className={`flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold rounded-lg transition-all ${
                role === 'startup'
                  ? 'bg-white text-[#0f2b48] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Rocket className="w-4 h-4 text-[#ea580c]" />
              <span>Startup Entity</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange('govt')}
              className={`flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold rounded-lg transition-all ${
                role === 'govt'
                  ? 'bg-white text-[#0f2b48] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-4 h-4 text-[#0f2b48]" />
              <span>Government Dept</span>
            </button>
          </div>

          {/* Quick Demo Credentials Autofill Banner */}
          <div className="mt-3 flex items-center justify-between p-2.5 bg-orange-50/90 border border-orange-200 rounded-xl text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <Sparkles className="w-4 h-4 text-[#ea580c] shrink-0" />
              <span className="font-medium text-[11px]">
                Demo: <strong className="text-slate-900 font-bold">{role === 'startup' ? 'Agastya WaterTech' : 'Ministry of Jal Shakti'}</strong>
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleRoleChange(role)}
              className="px-2.5 py-1 text-xs font-bold text-white bg-[#ea580c] hover:bg-[#c2410c] rounded-md transition-colors shadow-2xs"
            >
              Autofill Demo
            </button>
          </div>
        </div>

        {/* Inline Error */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-xs text-red-700 font-medium">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Official Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={role === 'startup' ? 'startup@procuresetu.demo' : 'govt@procuresetu.demo'}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-[#0f2b48]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">
                Password <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-[11px] font-semibold text-[#ea580c] hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-[#0f2b48]"
              />
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-600 border border-slate-100 flex items-start gap-2">
            <KeyRound className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-800">Pre-configured Demo Credentials:</span>
              <div className="mt-0.5 font-mono text-[10px] text-slate-600">
                {role === 'startup' ? 'startup@procuresetu.demo / Startup@123' : 'govt@procuresetu.demo / Govt@123'}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 text-xs font-bold text-white bg-[#0f2b48] hover:bg-[#16385c] rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>Sign In to {role === 'startup' ? 'Startup Portal' : 'Government Portal'}</span>
            <Check className="w-4 h-4 text-[#f97316]" />
          </button>

          {/* Account Creation Options */}
          <div className="pt-4 border-t border-slate-200 text-center space-y-2">
            <p className="text-xs text-slate-500 font-medium">New to ProcureSetu? Register below:</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => navigateTo('/signup/startup')}
                className="py-2 px-3 text-xs font-bold text-[#ea580c] bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <Rocket className="w-3.5 h-3.5" />
                <span>Create Startup Account</span>
              </button>

              <button
                type="button"
                onClick={() => navigateTo('/signup/government')}
                className="py-2 px-3 text-xs font-bold text-[#0f2b48] bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Create Govt Account</span>
              </button>
            </div>
          </div>
        </form>

      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0f2b48]">
                <Info className="w-4 h-4 text-[#ea580c]" />
                <span>Password Recovery Notice</span>
              </div>
              <button 
                onClick={() => setShowForgotModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Password recovery request submitted. In this demonstration environment, contact your administrator.
            </p>

            <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500 border border-slate-200">
              Demo passwords:
              <br />
              Startup: <span className="font-mono font-bold text-slate-700">Startup@123</span>
              <br />
              Government: <span className="font-mono font-bold text-slate-700">Govt@123</span>
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={() => setShowForgotModal(false)}
                className="px-4 py-1.5 text-xs font-bold text-white bg-[#0f2b48] rounded-lg"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
