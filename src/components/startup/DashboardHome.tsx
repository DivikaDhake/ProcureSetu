import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Opportunity } from '../../types';
import { 
  Compass, 
  FileCheck2, 
  FolderLock, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  Building2,
  X
} from 'lucide-react';
import { OpportunityRadarSection } from './OpportunityRadarSection';
import { RecommendedOpportunitiesSection } from './RecommendedOpportunitiesSection';
import { CapabilityPassportSection } from './CapabilityPassportSection';
import { EvidenceVaultSection } from './EvidenceVaultSection';
import { ApplicationTrackerSection } from './ApplicationTrackerSection';
import { NotificationsSection } from './NotificationsSection';
import { ApplyOpportunityModal } from './ApplyOpportunityModal';

export const DashboardHome: React.FC = () => {
  const { 
    currentUser, 
    currentStartupProfile, 
    opportunities, 
    applications, 
    evidence, 
    milestones, 
    setActiveTab, 
    submitApplication,
    addToast 
  } = useApp();

  const [selectedOppForDetail, setSelectedOppForDetail] = useState<Opportunity | null>(null);
  const [selectedOppForApply, setSelectedOppForApply] = useState<Opportunity | null>(null);

  // Startup data counts
  const myApplications = applications.filter(app => 
    app.startupId === (currentStartupProfile?.id || 'startup_1') || 
    app.startupName.toLowerCase().includes(currentUser?.organizationName.toLowerCase() || '')
  );

  const myEvidence = evidence.filter(ev => 
    ev.startupId === (currentStartupProfile?.id || 'startup_1') ||
    ev.startupName.toLowerCase().includes(currentUser?.organizationName.toLowerCase() || '')
  );

  const verifiedEvidenceCount = myEvidence.filter(e => e.verificationStatus === 'verified').length;
  
  // Relevant opportunities count
  const relevantOpportunitiesCount = opportunities.filter(o => 
    o.status === 'open' || o.status === 'evaluating'
  ).length;

  const handleOpenApplyModal = (opp: Opportunity) => {
    setSelectedOppForApply(opp);
    setSelectedOppForDetail(null);
  };

  const startupName = currentStartupProfile?.companyName || currentUser?.organizationName || 'Agastya AquaSens Technologies';

  return (
    <div className="space-y-10 pb-12">
      
      {/* ========================================================= */}
      {/* TOP WELCOME & SUBTITLE */}
      {/* ========================================================= */}
      <div className="neu-card p-6 bg-gradient-to-br from-white via-slate-50/50 to-orange-50/20 border-l-4 border-l-[#ea580c] space-y-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
              <span>DPIIT Recognition: <strong className="text-slate-800">{currentStartupProfile?.dpiitNumber || 'DIPP-89421-IN'}</strong></span>
              <span>·</span>
              <span className="text-emerald-700 font-bold">GFR 173(i) Turnover-Exempt</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black text-[#0f2b48] tracking-tight">
              Good morning, {startupName}
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
              Discover government opportunities that match your capabilities.
            </p>
          </div>

          <div 
            onClick={() => setActiveTab('capability-passport')}
            className="flex items-center gap-3 bg-white border border-slate-200/80 px-4 py-3 rounded-2xl shadow-xs shrink-0 cursor-pointer hover:border-slate-300 transition-all"
            title="View Structured Capability Passport"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#0f2b48] to-[#16385c] flex items-center justify-center text-emerald-400 font-black text-xl shadow-2xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-[#0f2b48] flex items-center gap-1">
                <span>Structured Capability Passport</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">
                <strong className="text-emerald-700 font-bold">{verifiedEvidenceCount} of {myEvidence.length} Verified</strong> · GFR 173(i) Exempt
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* FOUR KPI CARDS */}
      {/* Relevant Opportunities, Applications Submitted, Evidence Verified, Active Contracts */}
      {/* ========================================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Relevant Opportunities */}
        <div 
          onClick={() => setActiveTab('opportunity-radar')}
          className="neu-card p-4 sm:p-5 bg-white border border-slate-200 hover:border-orange-300 cursor-pointer transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Relevant Opportunities
            </span>
            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-[#ea580c] group-hover:scale-105 transition-transform">
              <Compass className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#0f2b48]">
            {relevantOpportunitiesCount}
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <span>Matching your tech stack</span>
            <ArrowRight className="w-3 h-3 text-[#ea580c]" />
          </div>
        </div>

        {/* Card 2: Applications Submitted */}
        <div 
          onClick={() => setActiveTab('my-applications')}
          className="neu-card p-4 sm:p-5 bg-white border border-slate-200 hover:border-blue-300 cursor-pointer transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Applications Submitted
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 group-hover:scale-105 transition-transform">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#0f2b48]">
            {myApplications.length}
          </div>
          <div className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
            <span>{myApplications.filter(a => a.status === 'shortlisted' || a.status === 'procurement_ready').length} Shortlisted / Ready</span>
          </div>
        </div>

        {/* Card 3: Evidence Verified */}
        <div 
          onClick={() => setActiveTab('evidence-vault')}
          className="neu-card p-4 sm:p-5 bg-white border border-slate-200 hover:border-emerald-300 cursor-pointer transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Evidence Verified
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 group-hover:scale-105 transition-transform">
              <FolderLock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#0f2b48]">
            {verifiedEvidenceCount} <span className="text-sm font-semibold text-slate-400">/ {myEvidence.length}</span>
          </div>
          <div className="text-[11px] text-slate-500">
            100% NABL / Agency Certified
          </div>
        </div>

        {/* Card 4: Active Contracts */}
        <div 
          onClick={() => setActiveTab('contracts-milestones')}
          className="neu-card p-4 sm:p-5 bg-white border border-slate-200 hover:border-amber-300 cursor-pointer transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Active Contracts
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 group-hover:scale-105 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#0f2b48]">
            1 <span className="text-xs font-semibold text-slate-400">(₹65 Lakhs)</span>
          </div>
          <div className="text-[11px] text-emerald-700 font-bold">
            ₹18.5L Approved by Nodal Officer
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SECTION 1 — OPPORTUNITY RADAR */}
      {/* ========================================================= */}
      <section id="section-opportunity-radar" className="pt-2">
        <OpportunityRadarSection onApplySuccess={() => setActiveTab('my-applications')} />
      </section>

      {/* ========================================================= */}
      {/* SECTION 2 — RECOMMENDED OPPORTUNITIES */}
      {/* ========================================================= */}
      <section id="section-recommended-opportunities" className="pt-2">
        <RecommendedOpportunitiesSection 
          onOpenApply={handleOpenApplyModal}
          onViewOpp={(opp) => setSelectedOppForDetail(opp)}
        />
      </section>

      {/* ========================================================= */}
      {/* SECTION 3 — CAPABILITY PASSPORT */}
      {/* ========================================================= */}
      <section id="section-capability-passport" className="pt-2">
        <CapabilityPassportSection />
      </section>

      {/* ========================================================= */}
      {/* SECTION 4 — EVIDENCE VAULT */}
      {/* ========================================================= */}
      <section id="section-evidence-vault" className="pt-2">
        <EvidenceVaultSection />
      </section>

      {/* ========================================================= */}
      {/* SECTION 5 — APPLICATION TRACKER */}
      {/* ========================================================= */}
      <section id="section-application-tracker" className="pt-2">
        <ApplicationTrackerSection />
      </section>

      {/* ========================================================= */}
      {/* SECTION 6 — NOTIFICATIONS */}
      {/* ========================================================= */}
      <section id="section-notifications" className="pt-2">
        <NotificationsSection />
      </section>

      {/* MODAL: View Specs */}
      {selectedOppForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="px-2 py-0.5 bg-orange-100 text-[#ea580c] font-black text-[10px] rounded-md">
                  {selectedOppForDetail.sector}
                </span>
                <h3 className="text-base font-black text-[#0f2b48] mt-1">
                  {selectedOppForDetail.title}
                </h3>
                <p className="text-xs text-slate-500">{selectedOppForDetail.departmentName}</p>
              </div>
              <button 
                onClick={() => setSelectedOppForDetail(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div>
                <span className="font-bold text-[#0f2b48]">Problem Statement:</span>
                <p className="mt-1 p-2.5 bg-slate-50 rounded-lg leading-relaxed">
                  {selectedOppForDetail.problemStatement}
                </p>
              </div>
              <div>
                <span className="font-bold text-[#0f2b48]">Desired Outcome:</span>
                <p className="mt-1 p-2.5 bg-emerald-50 text-emerald-950 rounded-lg leading-relaxed">
                  {selectedOppForDetail.desiredOutcome}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-50 rounded-lg">
                <div>Value: <strong className="text-slate-900">{selectedOppForDetail.budgetEstimate}</strong></div>
                <div>Deadline: <strong className="text-slate-900">{selectedOppForDetail.deadline}</strong></div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedOppForDetail(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Close
              </button>
              <button
                onClick={() => handleOpenApplyModal(selectedOppForDetail)}
                className="px-4 py-2 text-xs font-bold text-white bg-[#0f2b48] hover:bg-[#16385c] rounded-lg"
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MULTI-STEP MODAL: Apply Now */}
      {selectedOppForApply && (
        <ApplyOpportunityModal 
          opportunity={selectedOppForApply} 
          onClose={() => setSelectedOppForApply(null)} 
          onSuccess={() => setSelectedOppForApply(null)} 
        />
      )}

    </div>
  );
};
