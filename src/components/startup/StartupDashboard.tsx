import React from 'react';
import { useApp } from '../../context/AppContext';
import { DashboardHome } from './DashboardHome';
import { OpportunityRadarSection } from './OpportunityRadarSection';
import { ApplicationTrackerSection } from './ApplicationTrackerSection';
import { CapabilityPassportSection } from './CapabilityPassportSection';
import { EvidenceVaultSection } from './EvidenceVaultSection';
import { NotificationsSection } from './NotificationsSection';
import { ContractsSection } from './ContractsSection';
import { ProfileSection } from './ProfileSection';

export const StartupDashboard: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  return (
    <div className="min-h-[calc(100vh-4.5rem)] bg-[#f0f4f8] py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Render View based on active header tab */}
        {activeTab === 'overview' && <DashboardHome />}
        {activeTab === 'opportunity-radar' && (
          <div className="space-y-6">
            <OpportunityRadarSection standalone onApplySuccess={() => setActiveTab('my-applications')} />
          </div>
        )}
        {activeTab === 'my-applications' && (
          <div className="space-y-6">
            <ApplicationTrackerSection standalone />
          </div>
        )}
        {activeTab === 'capability-passport' && (
          <div className="space-y-6">
            <CapabilityPassportSection standalone />
          </div>
        )}
        {activeTab === 'evidence-vault' && (
          <div className="space-y-6">
            <EvidenceVaultSection standalone />
          </div>
        )}
        {activeTab === 'contracts-milestones' && (
          <div className="space-y-6">
            <ContractsSection />
          </div>
        )}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <NotificationsSection standalone />
          </div>
        )}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <ProfileSection />
          </div>
        )}
        {!['overview', 'opportunity-radar', 'my-applications', 'capability-passport', 'evidence-vault', 'contracts-milestones', 'notifications', 'profile'].includes(activeTab) && (
          <DashboardHome />
        )}
      </div>
    </div>
  );
};
