import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { StartupDashboard } from './components/startup/StartupDashboard';
import { GovtDashboard } from './components/government/GovtDashboard';
import { LoginView } from './components/auth/LoginView';
import { StartupSignupView } from './components/auth/StartupSignupView';
import { GovtSignupView } from './components/auth/GovtSignupView';
import { AuthModal } from './components/AuthModal';
import { ToastContainer } from './components/ToastContainer';
import { UserRole } from './types';

const MainAppContent: React.FC = () => {
  const { currentUser, currentPath, navigateTo } = useApp();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalRole, setAuthModalRole] = useState<UserRole>('startup');
  const [authModalIsSignup, setAuthModalIsSignup] = useState(false);

  const handleOpenAuth = (role: UserRole = 'startup', isSignup = false) => {
    if (isSignup) {
      if (role === 'startup') {
        navigateTo('/signup/startup');
      } else {
        navigateTo('/signup/government');
      }
    } else {
      navigateTo('/login');
    }
  };

  const handleScrollToSection = (sectionId: string) => {
    if (currentPath !== '/') {
      navigateTo('/');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Render view based on route and protection
  const renderCurrentView = () => {
    // 1. Dedicated Login Route
    if (currentPath === '/login') {
      return <LoginView />;
    }

    // 2. Dedicated Startup Signup Route
    if (currentPath === '/signup/startup') {
      return <StartupSignupView />;
    }

    // 3. Dedicated Government Signup Route
    if (currentPath === '/signup/government') {
      return <GovtSignupView />;
    }

    // 4. Protected Startup Dashboard Route
    if (currentPath.startsWith('/startup/dashboard')) {
      if (!currentUser || currentUser.role !== 'startup') {
        return null; // Route guard in AppContext will redirect with notification
      }
      return <StartupDashboard />;
    }

    // 5. Protected Government Dashboard Route
    if (currentPath.startsWith('/government/dashboard')) {
      if (!currentUser || currentUser.role !== 'govt') {
        return null; // Route guard in AppContext will redirect with notification
      }
      return <GovtDashboard />;
    }

    // 6. Default Root Route ('/')
    if (currentUser?.role === 'startup') {
      return <StartupDashboard />;
    }
    if (currentUser?.role === 'govt') {
      return <GovtDashboard />;
    }

    return <LandingPage onOpenAuth={handleOpenAuth} />;
  };

  return (
    <div className="min-h-screen bg-[#f0f4f8] flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* 
        IMPORTANT HEADER RULE:
        Landing page: One header only.
        After login: One header only containing ProcureSetu logo, Dashboard navigation, and Sign Out button.
      */}
      <Header 
        onOpenAuthModal={handleOpenAuth} 
        onNavigateSection={handleScrollToSection} 
      />

      <main className="flex-1">
        {renderCurrentView()}
      </main>

      {/* Global Auth Modal for quick modal access */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialRole={authModalRole}
        initialIsSignup={authModalIsSignup}
      />

      {/* Global Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
