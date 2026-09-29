import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  Rocket, 
  ShieldCheck, 
  Bell, 
  LogOut, 
  Layers, 
  Compass, 
  FileCheck2, 
  Award, 
  FolderLock, 
  CheckCircle2, 
  PlusCircle, 
  Search, 
  BarChart3, 
  FileText, 
  UserCircle2, 
  Repeat,
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  ArrowRightLeft,
  Sparkles
} from 'lucide-react';

interface HeaderProps {
  onOpenAuthModal: (role?: 'startup' | 'govt', isSignup?: boolean) => void;
  onNavigateSection?: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAuthModal, onNavigateSection }) => {
  const { 
    currentUser, 
    logout, 
    activeTab, 
    setActiveTab, 
    switchDemoAccount, 
    notifications,
    navigateTo 
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [signInDropdownOpen, setSignInDropdownOpen] = useState(false);
  const [getStartedDropdownOpen, setGetStartedDropdownOpen] = useState(false);

  const signInRef = useRef<HTMLDivElement>(null);
  const getStartedRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (signInRef.current && !signInRef.current.contains(e.target as Node)) {
        setSignInDropdownOpen(false);
      }
      if (getStartedRef.current && !getStartedRef.current.contains(e.target as Node)) {
        setGetStartedDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => 
    !n.read && (currentUser ? n.recipientUserId === currentUser.id || n.recipientRole === currentUser.role : false)
  ).length;

  interface NavTab {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }

  // Startup dashboard navigation tabs (Exact names per specification)
  const startupTabs: NavTab[] = [
    { id: 'overview', label: 'Dashboard', icon: Layers },
    { id: 'opportunity-radar', label: 'Opportunity Radar', icon: Compass },
    { id: 'my-applications', label: 'Applications', icon: FileCheck2 },
    { id: 'capability-passport', label: 'Capability Passport', icon: Award },
    { id: 'evidence-vault', label: 'Evidence Vault', icon: FolderLock },
    { id: 'contracts-milestones', label: 'Contracts', icon: CheckCircle2 },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadCount > 0 ? unreadCount : undefined },
    { id: 'profile', label: 'Profile', icon: UserCircle2 },
  ];

  // Government dashboard navigation tabs (Exact names per specification)
  const govtTabs: NavTab[] = [
    { id: 'overview', label: 'Overview', icon: Layers },
    { id: 'create-opportunity', label: 'Create Opportunity', icon: PlusCircle },
    { id: 'opportunities', label: 'Opportunities', icon: FileText },
    { id: 'startup-discovery', label: 'Startup Discovery', icon: Search },
    { id: 'evaluations', label: 'Evaluations', icon: Award },
    { id: 'procurement', label: 'Procurement', icon: CheckCircle2 },
    { id: 'milestones', label: 'Milestones', icon: CheckCircle2 },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'profile', label: 'Profile', icon: UserCircle2 },
  ];

  const currentTabs = currentUser?.role === 'startup' ? startupTabs : govtTabs;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#f8fafc]/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Left: Brand Logo + small icon representing government-to-startup connection */}
          <div 
            className="flex items-center gap-3 cursor-pointer shrink-0" 
            onClick={() => {
              if (currentUser) {
                setActiveTab('overview');
              } else {
                onNavigateSection?.('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          >
            <div className="relative flex items-center">
              {/* Main Brand Symbol with Government-to-Startup Connection Icon */}
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0f2b48] to-[#16385c] flex items-center justify-center shadow-md border border-slate-700/30 text-white">
                <ShieldCheck className="w-6 h-6 text-[#f97316]" />
              </div>

              {/* Small connection badge: Building ↔ Rocket icon */}
              <div 
                className="hidden sm:flex items-center gap-0.5 ml-2 px-2 py-0.5 rounded-full bg-slate-100 border border-slate-300 text-[10px] font-bold text-slate-700 shadow-2xs"
                title="Connecting Government Problems to Startup Innovation"
              >
                <Building2 className="w-3 h-3 text-[#0f2b48]" />
                <ArrowRightLeft className="w-2.5 h-2.5 text-[#ea580c]" />
                <Rocket className="w-3 h-3 text-[#ea580c]" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-[#0f2b48]">PROCURE<span className="text-[#ea580c]">SETU</span></span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium tracking-wide uppercase hidden md:block">
                Connecting Govt Problems with Startup Capabilities
              </p>
            </div>
          </div>

          {/* Conditional Middle Section */}
          {!currentUser ? (
            /* LANDING PAGE NAV: ONE HEADER ONLY (Home, How It Works, For Startups, For Government, About) */
            <nav className="hidden lg:flex items-center gap-7">
              <button 
                onClick={() => { onNavigateSection?.('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                className="text-xs font-bold text-slate-700 hover:text-[#ea580c] transition-colors"
              >
                Home
              </button>
              <button 
                onClick={() => onNavigateSection?.('how-it-works')} 
                className="text-xs font-bold text-slate-700 hover:text-[#ea580c] transition-colors"
              >
                How It Works
              </button>
              <button 
                onClick={() => onNavigateSection?.('for-startups')} 
                className="text-xs font-bold text-slate-700 hover:text-[#ea580c] transition-colors"
              >
                For Startups
              </button>
              <button 
                onClick={() => onNavigateSection?.('for-government')} 
                className="text-xs font-bold text-slate-700 hover:text-[#ea580c] transition-colors"
              >
                For Government
              </button>
              <button 
                onClick={() => onNavigateSection?.('about')} 
                className="text-xs font-bold text-slate-700 hover:text-[#ea580c] transition-colors"
              >
                About
              </button>
            </nav>
          ) : (
            /* LOGGED-IN DASHBOARD NAV: ONE HEADER ONLY */
            <nav className="hidden md:flex items-center gap-1 overflow-x-auto py-1">
              {currentTabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 xl:px-3 xl:py-2 text-xs font-semibold rounded-lg transition-all relative shrink-0 ${
                      isActive 
                        ? 'bg-[#0f2b48] text-white shadow-xs' 
                        : 'text-slate-600 hover:text-[#0f2b48] hover:bg-slate-200/60'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#f97316]' : 'text-slate-500'}`} />
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <span className="ml-1 px-1.5 py-0.2 bg-[#ea580c] text-white text-[10px] font-bold rounded-full">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          )}

          {/* Right Action Controls */}
          <div className="flex items-center gap-2.5">
            {!currentUser ? (
              <div className="flex items-center gap-2">
                
                {/* Sign In Dropdown Button */}
                <div className="relative" ref={signInRef}>
                  <button
                    onClick={() => {
                      setSignInDropdownOpen(!signInDropdownOpen);
                      setGetStartedDropdownOpen(false);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#0f2b48] bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-all neu-button"
                  >
                    <span>Sign In</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${signInDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {signInDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                        Select Portal to Sign In
                      </div>
                      <button
                        onClick={() => {
                          setSignInDropdownOpen(false);
                          navigateTo('/login');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-[#0f2b48] hover:bg-orange-50 hover:text-[#ea580c] rounded-lg transition-colors text-left"
                      >
                        <div className="w-6 h-6 rounded-md bg-orange-100 flex items-center justify-center text-[#ea580c]">
                          <Rocket className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div>Startup Login</div>
                          <div className="text-[10px] text-slate-400 font-normal">Innovators & Founders</div>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          setSignInDropdownOpen(false);
                          navigateTo('/login');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-[#0f2b48] hover:bg-blue-50 hover:text-[#0f2b48] rounded-lg transition-colors text-left"
                      >
                        <div className="w-6 h-6 rounded-md bg-blue-100 flex items-center justify-center text-[#0f2b48]">
                          <Building2 className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div>Government Login</div>
                          <div className="text-[10px] text-slate-400 font-normal">Nodal Officers & Ministry</div>
                        </div>
                      </button>
                    </div>
                  )}
                </div>

                {/* Get Started Dropdown Button */}
                <div className="relative" ref={getStartedRef}>
                  <button
                    onClick={() => {
                      setGetStartedDropdownOpen(!getStartedDropdownOpen);
                      setSignInDropdownOpen(false);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-extrabold text-white bg-gradient-to-r from-[#ea580c] to-[#f97316] hover:from-[#c2410c] hover:to-[#ea580c] rounded-xl shadow-md transition-all neu-button"
                  >
                    <span>Get Started</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-orange-200 transition-transform ${getStartedDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {getStartedDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                        Choose Your Account Type
                      </div>

                      <button
                        onClick={() => {
                          setGetStartedDropdownOpen(false);
                          navigateTo('/signup/startup');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-[#0f2b48] hover:bg-orange-50 hover:text-[#ea580c] rounded-lg transition-colors text-left"
                      >
                        <div className="w-7 h-7 rounded-md bg-orange-100 flex items-center justify-center text-[#ea580c] shrink-0">
                          <Rocket className="w-4 h-4" />
                        </div>
                        <div>
                          <div>I'm a Startup</div>
                          <div className="text-[10px] text-slate-400 font-normal">Showcase capabilities & evidence</div>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          setGetStartedDropdownOpen(false);
                          navigateTo('/signup/government');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-[#0f2b48] hover:bg-blue-50 hover:text-[#0f2b48] rounded-lg transition-colors text-left"
                      >
                        <div className="w-7 h-7 rounded-md bg-blue-100 flex items-center justify-center text-[#0f2b48] shrink-0">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div>
                          <div>I'm a Government Dept</div>
                          <div className="text-[10px] text-slate-400 font-normal">Post operational challenges & audit</div>
                        </div>
                      </button>
                    </div>
                  )}
                </div>

              </div>
            ) : (
              /* LOGGED-IN RIGHT ACTION: ONLY SIGN OUT PER INSTRUCTION */
              <div className="flex items-center gap-2">
                <button
                  onClick={logout}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-red-700 hover:bg-red-50/90 rounded-lg border border-slate-300 transition-colors shadow-2xs"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5 text-slate-500 hover:text-red-600" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-200 bg-white/95 rounded-b-xl shadow-lg px-2">
            {currentUser ? (
              <div className="space-y-1">
                <div className="px-3 py-2 bg-slate-50 rounded-lg mb-2">
                  <p className="text-xs font-bold text-[#0f2b48]">{currentUser.name}</p>
                  <p className="text-[11px] text-slate-500">{currentUser.organizationName} ({currentUser.role === 'startup' ? 'Startup' : 'Government'})</p>
                </div>
                {currentTabs.map(tab => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg ${
                        isActive ? 'bg-[#0f2b48] text-white' : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        <span>{tab.label}</span>
                      </div>
                      {tab.badge && (
                        <span className="px-1.5 py-0.5 bg-[#ea580c] text-white text-[10px] font-bold rounded-full">
                          {tab.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
                <div className="pt-2 border-t border-slate-200 mt-2 flex flex-col gap-1">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2 px-2 py-1">
                <button
                  onClick={() => {
                    onNavigateSection?.('home');
                    setMobileMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-lg"
                >
                  Home
                </button>
                <button
                  onClick={() => {
                    onNavigateSection?.('how-it-works');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-lg"
                >
                  How It Works
                </button>
                <button
                  onClick={() => {
                    onNavigateSection?.('for-startups');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-lg"
                >
                  For Startups
                </button>
                <button
                  onClick={() => {
                    onNavigateSection?.('for-government');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-lg"
                >
                  For Government
                </button>
                <button
                  onClick={() => {
                    onNavigateSection?.('about');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-lg"
                >
                  About
                </button>
                
                <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      navigateTo('/login');
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-[#0f2b48] bg-slate-100 rounded-lg"
                  >
                    <Rocket className="w-3.5 h-3.5 text-[#ea580c]" />
                    Startup Login
                  </button>
                  <button
                    onClick={() => {
                      navigateTo('/login');
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-[#0f2b48] bg-slate-100 rounded-lg"
                  >
                    <Building2 className="w-3.5 h-3.5 text-[#0f2b48]" />
                    Govt Login
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => {
                      navigateTo('/signup/startup');
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-white bg-[#ea580c] rounded-lg"
                  >
                    I'm a Startup
                  </button>
                  <button
                    onClick={() => {
                      navigateTo('/signup/government');
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-white bg-[#0f2b48] rounded-lg"
                  >
                    I'm a Govt Dept
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
