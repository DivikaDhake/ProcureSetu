import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { SECTOR_OPTIONS } from '../data/mockData';
import { 
  X, 
  Rocket, 
  Building2, 
  ShieldCheck, 
  Lock, 
  Mail, 
  User as UserIcon, 
  Phone, 
  Briefcase, 
  KeyRound, 
  Check, 
  AlertCircle,
  Sparkles
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: UserRole;
  initialIsSignup?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialRole = 'startup',
  initialIsSignup = false,
}) => {
  const { login, navigateTo } = useApp();

  const [role, setRole] = useState<UserRole>(initialRole);
  const [error, setError] = useState<string | null>(null);

  // Login form state
  const [loginEmail, setLoginEmail] = useState(
    initialRole === 'startup' ? 'startup@procuresetu.demo' : 'govt@procuresetu.demo'
  );
  const [loginPassword, setLoginPassword] = useState(
    initialRole === 'startup' ? 'Startup@123' : 'Govt@123'
  );

  if (!isOpen) return null;

  // Fill demo credentials
  const fillDemoCredentials = (targetRole: UserRole) => {
    setRole(targetRole);
    setError(null);
    if (targetRole === 'startup') {
      setLoginEmail('startup@procuresetu.demo');
      setLoginPassword('Startup@123');
    } else {
      setLoginEmail('govt@procuresetu.demo');
      setLoginPassword('Govt@123');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const result = login(loginEmail, loginPassword, role);
    if (result.success) {
      onClose();
    } else {
      setError(result.message || 'Authentication failed. Please verify credentials.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#0f2b48] to-[#16385c] px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <ShieldCheck className="w-6 h-6 text-[#f97316]" />
            </div>
            <div>
              <h3 className="text-lg font-bold">ProcureSetu Access Gateway</h3>
              <p className="text-xs text-slate-300">
                {role === 'startup' ? 'Startup Innovation & Evidence Portal' : 'Government Department Procurement Portal'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Selector Tabs */}
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-200/70 rounded-xl">
            <button
              type="button"
              onClick={() => { setRole('startup'); setError(null); }}
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
              onClick={() => { setRole('govt'); setError(null); }}
              className={`flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold rounded-lg transition-all ${
                role === 'govt'
                  ? 'bg-white text-[#0f2b48] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-4 h-4 text-[#0f2b48]" />
              <span>Government Department</span>
            </button>
          </div>

          {/* Quick Demo Credentials Autofill Banner */}
          <div className="mt-3 flex items-center justify-between p-2.5 bg-orange-50/80 border border-orange-200/80 rounded-xl text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <Sparkles className="w-4 h-4 text-[#ea580c] shrink-0" />
              <span className="font-medium">
                Demo Account: <strong className="text-slate-900 font-bold">{role === 'startup' ? 'Agastya WaterTech' : 'Ministry of Jal Shakti'}</strong>
              </span>
            </div>
            <button
              type="button"
              onClick={() => fillDemoCredentials(role)}
              className="px-2.5 py-1 text-xs font-bold text-white bg-[#ea580c] hover:bg-[#c2410c] rounded-md transition-colors shadow-2xs"
            >
              Autofill Demo
            </button>
          </div>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-xs text-red-700 font-medium">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Modal Form Body */}
        <div className="p-6">
          {/* LOGIN FORM */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Official Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  placeholder={role === 'startup' ? 'startup@procuresetu.demo' : 'govt@procuresetu.demo'}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0f2b48] focus:border-transparent outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0f2b48] focus:border-transparent outline-hidden"
                />
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-600 border border-slate-100 flex items-start gap-2">
              <KeyRound className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-800">Quick Demo Credentials:</span>
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

            <div className="text-center pt-2 space-y-2">
              <p className="text-xs text-slate-500">
                New to ProcureSetu? Create a dedicated account:
              </p>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigateTo('/signup/startup');
                  }}
                  className="py-2 px-3 text-xs font-bold text-[#ea580c] bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <Rocket className="w-3.5 h-3.5" />
                  <span>Create Startup Account</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigateTo('/signup/government');
                  }}
                  className="py-2 px-3 text-xs font-bold text-[#0f2b48] bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Create Govt Account</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
