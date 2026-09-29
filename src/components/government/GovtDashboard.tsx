import React from 'react';
import { useApp } from '../../context/AppContext';
import { GovtHome } from './GovtHome';
import { CreateOpportunitySection } from './CreateOpportunitySection';
import { OpportunityManagementSection } from './OpportunityManagementSection';
import { GovtStartupDiscoverySection } from './GovtStartupDiscoverySection';
import { EvaluationsSection } from './EvaluationsSection';
import { ProcurementSection } from './ProcurementSection';
import { GovtMilestonesSection } from './GovtMilestonesSection';
import { GovtReportsSection } from './GovtReportsSection';
import { GovtProfileSection } from './GovtProfileSection';

export const GovtDashboard: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <div className="min-h-[calc(100vh-4.5rem)] bg-[#f0f4f8] py-6 px-4 sm:px-6 lg:px-8 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="max-w-7xl mx-auto">
        {activeTab === 'overview' && <GovtHome />}
        {activeTab === 'create-opportunity' && <CreateOpportunitySection />}
        {activeTab === 'opportunities' && <OpportunityManagementSection />}
        {activeTab === 'startup-discovery' && <GovtStartupDiscoverySection />}
        {activeTab === 'evaluations' && <EvaluationsSection />}
        {activeTab === 'procurement' && <ProcurementSection />}
        {activeTab === 'milestones' && <GovtMilestonesSection />}
        {activeTab === 'reports' && <GovtReportsSection />}
        {activeTab === 'profile' && <GovtProfileSection />}
        
        {/* Fallback to Home if unknown tab */}
        {!['overview', 'create-opportunity', 'opportunities', 'startup-discovery', 'evaluations', 'procurement', 'milestones', 'reports', 'profile'].includes(activeTab) && (
          <GovtHome />
        )}
      </div>
    </div>
  );
};
