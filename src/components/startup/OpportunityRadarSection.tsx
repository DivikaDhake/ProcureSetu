import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Opportunity } from '../../types';
import { SECTOR_OPTIONS } from '../../data/mockData';
import { ApplyOpportunityModal } from './ApplyOpportunityModal';
import { 
  Search, 
  Eye, 
  Sparkles, 
  CheckCircle2, 
  MapPin, 
  Calendar, 
  Building2, 
  X, 
  FileCheck2, 
  Award,
  Clock,
  ShieldCheck
} from 'lucide-react';

interface Props {
  onApplySuccess?: () => void;
  standalone?: boolean;
}

export const OpportunityRadarSection: React.FC<Props> = ({ onApplySuccess, standalone = false }) => {
  const { 
    currentUser, 
    currentStartupProfile, 
    opportunities, 
    applications, 
    evidence, 
    submitApplication, 
    addToast 
  } = useApp();

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('All Sectors');
  const [selectedState, setSelectedState] = useState('All States');
  const [selectedTech, setSelectedTech] = useState('All Technologies');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [selectedDeadline, setSelectedDeadline] = useState('All Deadlines');

  // Modals
  const [detailOpp, setDetailOpp] = useState<Opportunity | null>(null);
  const [applyOpp, setApplyOpp] = useState<Opportunity | null>(null);

  // Application form fields
  const [solutionSummary, setSolutionSummary] = useState('');
  const [trlProposed, setTrlProposed] = useState<number>(7);
  const [capabilityHighlights, setCapabilityHighlights] = useState('');
  const [attachedEvidenceIds, setAttachedEvidenceIds] = useState<string[]>([]);

  // Startup evidence
  const myEvidence = evidence.filter(e => 
    e.startupId === (currentStartupProfile?.id || 'startup_1') ||
    e.startupName.toLowerCase().includes(currentUser?.organizationName.toLowerCase() || '')
  );

  const myApplications = applications.filter(app => 
    app.startupId === (currentStartupProfile?.id || 'startup_1') || 
    app.startupName.toLowerCase().includes(currentUser?.organizationName.toLowerCase() || '')
  );

  // State options derived from opportunities
  const stateOptions = ['All States', ...Array.from(new Set(opportunities.map(o => o.state).filter(Boolean))) as string[]];
  const techOptions = ['All Technologies', 'IoT', 'Acoustic Sensors', 'LoRaWAN', 'Predictive Analytics', 'Spectrophotometry', 'LiDAR', 'GPR', 'Computer Vision', 'Microfluidics', 'NIR Spectroscopy', 'Hardware Security'];

  // Filter logic
  const filteredOpportunities = opportunities.filter(opp => {
    // Sector filter
    const matchesSector = selectedSector === 'All Sectors' || opp.sector.toLowerCase() === selectedSector.toLowerCase();
    
    // State filter
    const matchesState = selectedState === 'All States' || (opp.state && opp.state.toLowerCase() === selectedState.toLowerCase());

    // Technology filter
    const matchesTech = selectedTech === 'All Technologies' || 
      (opp.technologies && opp.technologies.some(t => t.toLowerCase() === selectedTech.toLowerCase())) ||
      (opp.requiredCapabilities && opp.requiredCapabilities.some(c => c.toLowerCase().includes(selectedTech.toLowerCase())));

    // Status filter
    const matchesStatus = selectedStatus === 'All Statuses' || 
      (selectedStatus === 'Applications Open' && opp.status === 'open') ||
      (selectedStatus === 'Under Evaluation' && opp.status === 'evaluating') ||
      (selectedStatus === 'Procurement Ready' && opp.status === 'procurement_ready') ||
      (selectedStatus === 'Closed' && opp.status === 'closed');

    // Deadline filter
    let matchesDeadline = true;
    if (selectedDeadline !== 'All Deadlines') {
      const today = new Date().getTime();
      const oppDate = new Date(opp.deadline).getTime();
      const diffDays = Math.ceil((oppDate - today) / (1000 * 3600 * 24));
      if (selectedDeadline === 'Within 30 Days') matchesDeadline = diffDays <= 30 && diffDays >= 0;
      if (selectedDeadline === 'Within 60 Days') matchesDeadline = diffDays <= 60 && diffDays >= 0;
      if (selectedDeadline === 'Within 90 Days') matchesDeadline = diffDays <= 90 && diffDays >= 0;
    }

    // Search query
    const matchesSearch = searchQuery === '' || 
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.departmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.problemStatement.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (opp.technologies && opp.technologies.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));

    return matchesSector && matchesState && matchesTech && matchesStatus && matchesDeadline && matchesSearch;
  });

  const handleOpenApply = (opp: Opportunity) => {
    setApplyOpp(opp);
    setDetailOpp(null);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedSector('All Sectors');
    setSelectedState('All States');
    setSelectedTech('All Technologies');
    setSelectedStatus('All Statuses');
    setSelectedDeadline('All Deadlines');
  };

  return (
    <div className="space-y-5">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-[#ea580c]/10 text-[#ea580c] font-black text-[10px] uppercase rounded-md tracking-wider">
              Live Demand Registry
            </span>
            <h2 className="text-base sm:text-lg font-black text-[#0f2b48]">
              SECTION 1 — Opportunity Radar
            </h2>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Discover verified government challenges matching your capabilities without turnover barriers.
          </p>
        </div>
        <div className="text-xs text-slate-500 font-semibold self-start sm:self-auto">
          Showing <strong className="text-[#0f2b48]">{filteredOpportunities.length}</strong> matching challenges
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="neu-card p-4 space-y-3 bg-white">
        {/* Search bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by challenge title, department, problem, or technology (e.g., IoT, Leakage, Water)..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-[#0f2b48]/20 focus:border-[#0f2b48]"
          />
        </div>

        {/* 5 Filters Grid: Sector, State, Technology, Opportunity status, Deadline */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-1">
          {/* 1. Sector */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Sector
            </label>
            <select
              value={selectedSector}
              onChange={e => setSelectedSector(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white text-slate-700 outline-hidden"
            >
              {SECTOR_OPTIONS.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* 2. State */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              State
            </label>
            <select
              value={selectedState}
              onChange={e => setSelectedState(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white text-slate-700 outline-hidden"
            >
              {stateOptions.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* 3. Technology */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Technology
            </label>
            <select
              value={selectedTech}
              onChange={e => setSelectedTech(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white text-slate-700 outline-hidden"
            >
              {techOptions.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* 4. Opportunity Status */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white text-slate-700 outline-hidden"
            >
              <option value="All Statuses">All Statuses</option>
              <option value="Applications Open">Applications Open</option>
              <option value="Under Evaluation">Under Evaluation</option>
              <option value="Procurement Ready">Procurement Ready</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          {/* 5. Deadline */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Deadline
            </label>
            <select
              value={selectedDeadline}
              onChange={e => setSelectedDeadline(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white text-slate-700 outline-hidden"
            >
              <option value="All Deadlines">All Deadlines</option>
              <option value="Within 30 Days">Within 30 Days</option>
              <option value="Within 60 Days">Within 60 Days</option>
              <option value="Within 90 Days">Within 90 Days</option>
            </select>
          </div>
        </div>

        {/* Clear filter shortcut if any selected */}
        {(selectedSector !== 'All Sectors' || selectedState !== 'All States' || selectedTech !== 'All Technologies' || selectedStatus !== 'All Statuses' || selectedDeadline !== 'All Deadlines' || searchQuery !== '') && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
            <span>Filtered results active</span>
            <button
              onClick={resetFilters}
              className="font-bold text-[#ea580c] hover:underline"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      {/* Opportunity Cards List */}
      <div className="space-y-4">
        {filteredOpportunities.length === 0 ? (
          <div className="neu-card p-10 text-center text-slate-500 bg-white">
            <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-semibold">No opportunities match the selected filters.</p>
            <button
              onClick={resetFilters}
              className="mt-3 px-3 py-1.5 text-xs font-bold text-[#0f2b48] bg-slate-100 rounded-lg hover:bg-slate-200"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredOpportunities.map(opp => {
            const alreadyApplied = myApplications.some(a => a.opportunityId === opp.id);
            const statusLabel = opp.status === 'open' 
              ? 'Applications Open' 
              : opp.status === 'evaluating' 
                ? 'Under Evaluation' 
                : opp.status === 'procurement_ready' 
                  ? 'Procurement Ready' 
                  : 'Closed';

            return (
              <div 
                key={opp.id}
                className="neu-card p-5 sm:p-6 bg-white border-l-4 border-l-[#0f2b48] hover:border-slate-300 transition-all space-y-4"
              >
                {/* Header row: Dept + Sector + Match percentage + Status */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="px-2 py-0.5 bg-orange-100 text-[#ea580c] font-black rounded-md text-[10px]">
                        {opp.sector}
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="font-bold text-[#0f2b48] flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-500" />
                        {opp.departmentName}
                      </span>
                      {opp.location && (
                        <>
                          <span className="text-slate-300">·</span>
                          <span className="text-slate-500 flex items-center gap-1 text-[11px]">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {opp.location}
                          </span>
                        </>
                      )}
                    </div>

                    <h3 
                      onClick={() => setDetailOpp(opp)}
                      className="text-base sm:text-lg font-black text-[#0f2b48] hover:text-[#ea580c] cursor-pointer transition-colors"
                    >
                      {opp.title}
                    </h3>
                  </div>

                  {/* Match Percentage & Status Badges */}
                  <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                    {opp.matchPercentage && (
                      <div className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-black shadow-2xs">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{opp.matchPercentage}% Match</span>
                      </div>
                    )}
                    <span className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border ${
                      opp.status === 'open' 
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}>
                      {statusLabel}
                    </span>
                  </div>
                </div>

                {/* Problem Statement snippet */}
                <p className="text-xs text-slate-600 leading-relaxed">
                  {opp.problemStatement}
                </p>

                {/* Required Capabilities Tags */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Required Capabilities:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(opp.requiredCapabilities || ['IoT', 'Water Infrastructure', 'Predictive Analytics']).map((cap, i) => (
                      <span 
                        key={i} 
                        className="px-2.5 py-0.5 bg-blue-50 text-blue-900 border border-blue-200/60 rounded-md text-[11px] font-semibold"
                      >
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Eligibility Indicators */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Eligibility Indicators:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(opp.eligibilityIndicators || ['DPIIT GFR 173(i) Exempt', 'TRL 6+ Satisfied', 'Zero Turnover Requirement']).map((elig, idx) => (
                      <span 
                        key={idx} 
                        className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold rounded-md flex items-center gap-1"
                      >
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        <span>{elig}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Metadata details row + Buttons */}
                <div className="pt-3 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs text-slate-600">
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
                    <div>
                      <span className="text-slate-400">Estimated Value: </span>
                      <strong className="text-slate-900 font-bold">{opp.budgetEstimate}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Deadline: </span>
                      <strong className="text-[#0f2b48] font-bold">{opp.deadline}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Pilot Scope: </span>
                      <span className="text-slate-700">{opp.pilotDuration}</span>
                    </div>
                  </div>

                  {/* Actions: View Opportunity & Apply Now */}
                  <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                    <button
                      onClick={() => setDetailOpp(opp)}
                      className="px-3 py-1.5 text-xs font-bold text-[#0f2b48] bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-600" />
                      <span>View Opportunity</span>
                    </button>

                    {alreadyApplied ? (
                      <button
                        disabled
                        className="px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 rounded-lg flex items-center gap-1.5 cursor-default"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Applied</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleOpenApply(opp)}
                        className="px-4 py-1.5 text-xs font-bold text-white bg-[#0f2b48] hover:bg-[#16385c] rounded-lg shadow-xs flex items-center gap-1.5 neu-button"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#f97316]" />
                        <span>Apply Now</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* DETAIL MODAL: View Opportunity */}
      {detailOpp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="px-2 py-0.5 bg-orange-100 text-[#ea580c] font-black text-[10px] rounded-md">
                  {detailOpp.sector}
                </span>
                <h3 className="text-lg font-black text-[#0f2b48] mt-1">
                  {detailOpp.title}
                </h3>
                <p className="text-xs text-slate-500 font-semibold">{detailOpp.departmentName}</p>
              </div>
              <button 
                onClick={() => setDetailOpp(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <span className="font-bold text-[#0f2b48] uppercase tracking-wider text-[11px]">Problem Statement:</span>
                <p className="mt-1 text-slate-700 leading-relaxed p-3 bg-slate-50 rounded-xl border border-slate-200">
                  {detailOpp.problemStatement}
                </p>
              </div>

              <div>
                <span className="font-bold text-[#0f2b48] uppercase tracking-wider text-[11px]">Desired Outcome:</span>
                <p className="mt-1 text-slate-700 leading-relaxed p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 text-emerald-900">
                  {detailOpp.desiredOutcome}
                </p>
              </div>

              <div>
                <span className="font-bold text-[#0f2b48] uppercase tracking-wider text-[11px]">Technical Requirements:</span>
                <ul className="mt-1 space-y-1.5">
                  {detailOpp.technicalRequirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2 p-2 bg-slate-50 rounded-lg text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl">
                <div>
                  <span className="text-slate-400">Estimated Value:</span>
                  <p className="font-bold text-slate-800">{detailOpp.budgetEstimate}</p>
                </div>
                <div>
                  <span className="text-slate-400">Application Deadline:</span>
                  <p className="font-bold text-slate-800">{detailOpp.deadline}</p>
                </div>
                <div>
                  <span className="text-slate-400">Pilot Duration:</span>
                  <p className="font-bold text-slate-800">{detailOpp.pilotDuration}</p>
                </div>
                <div>
                  <span className="text-slate-400">Procurement Pathway:</span>
                  <p className="font-bold text-[#0f2b48]">{detailOpp.targetProcurementPathway}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setDetailOpp(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Close
              </button>
              <button
                onClick={() => handleOpenApply(detailOpp)}
                className="px-5 py-2 text-xs font-bold text-white bg-[#0f2b48] hover:bg-[#16385c] rounded-lg shadow-sm"
              >
                Proceed to Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MULTI-STEP APPLY MODAL */}
      {applyOpp && (
        <ApplyOpportunityModal
          opportunity={applyOpp}
          onClose={() => setApplyOpp(null)}
          onSuccess={() => {
            setApplyOpp(null);
            onApplySuccess?.();
          }}
        />
      )}
    </div>
  );
};
