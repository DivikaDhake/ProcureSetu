import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Opportunity } from '../../types';
import { SECTOR_OPTIONS } from '../../data/mockData';
import { Search, Eye, PlusCircle, Building2, Calendar, CheckCircle2, MapPin, X, ArrowRight } from 'lucide-react';

export const OpportunityManagementSection: React.FC = () => {
  const { 
    opportunities, 
    applications, 
    setActiveTab, 
    selectedOpportunityId, 
    setSelectedOpportunityId 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [sectorFilter, setSectorFilter] = useState('All Sectors');
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);

  React.useEffect(() => {
    if (selectedOpportunityId) {
      const match = opportunities.find(o => o.id === selectedOpportunityId);
      if (match) {
        setSelectedOpp(match);
      }
    }
  }, [selectedOpportunityId, opportunities]);

  const filteredOpps = opportunities.filter(opp => {
    const matchesSector = sectorFilter === 'All Sectors' || opp.sector.toLowerCase() === sectorFilter.toLowerCase();
    const matchesSearch = searchQuery === '' || 
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.departmentName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSector && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-blue-100 text-blue-900 font-black text-[10px] uppercase rounded-md tracking-wider">
              Demand Management
            </span>
            <h2 className="text-base sm:text-lg font-black text-[#0f2b48]">
              Manage Government Opportunities
            </h2>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Track published demand challenges, monitor incoming submissions, and manage evaluation progress.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('create-opportunity')}
          className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#0f2b48] hover:bg-[#16385c] rounded-lg shadow-2xs flex items-center gap-1.5 self-start sm:self-auto neu-button"
        >
          <PlusCircle className="w-3.5 h-3.5 text-[#ea580c]" />
          <span>New Opportunity</span>
        </button>
      </div>

      {/* Filter toolbar */}
      <div className="neu-card p-4 bg-white border border-slate-200 rounded-xl space-y-3 sm:space-y-0 sm:flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search opportunities by title or department..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg outline-hidden focus:ring-1 focus:ring-[#0f2b48]"
          />
        </div>

        <div className="w-full sm:w-56">
          <select
            value={sectorFilter}
            onChange={e => setSectorFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white text-slate-700 outline-hidden"
          >
            {SECTOR_OPTIONS.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Opportunities Grid */}
      <div className="space-y-4">
        {filteredOpps.map(opp => {
          const oppApps = applications.filter(a => a.opportunityId === opp.id);
          const shortlistedCount = oppApps.filter(a => a.status === 'shortlisted' || a.status === 'procurement_ready').length;

          return (
            <div 
              key={opp.id}
              className="neu-card p-5 sm:p-6 bg-white border border-slate-200 hover:border-slate-300 transition-all space-y-3 border-l-4 border-l-[#0f2b48]"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2 py-0.5 bg-orange-100 text-[#ea580c] font-black text-[10px] rounded-md">
                      {opp.sector}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-slate-600 font-semibold">{opp.departmentName}</span>
                    <span className="text-slate-300">·</span>
                    <span className="text-slate-400 text-[11px]">Min TRL {opp.trlRequired}</span>
                  </div>

                  <h3 className="text-base font-black text-[#0f2b48]">
                    {opp.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                    {opp.problemStatement}
                  </p>
                </div>

                <span className={`px-2.5 py-1 text-[11px] font-bold rounded-lg shrink-0 border ${
                  opp.status === 'open' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                  opp.status === 'evaluating' ? 'bg-purple-50 text-purple-800 border-purple-200' :
                  'bg-orange-50 text-orange-800 border-orange-200'
                }`}>
                  {opp.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              {/* Metrics & Actions */}
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
                <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
                  <div>Scope: <strong className="text-slate-900 font-bold">{opp.budgetEstimate}</strong></div>
                  <div>Deadline: <strong className="text-slate-900">{opp.deadline}</strong></div>
                  <div>Applications: <strong className="text-[#ea580c] font-black">{opp.applicantCount} proposals</strong></div>
                  {shortlistedCount > 0 && (
                    <div className="text-emerald-700 font-bold">({shortlistedCount} Shortlisted)</div>
                  )}
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <button
                    onClick={() => setSelectedOpp(opp)}
                    className="px-3 py-1.5 text-xs font-bold text-[#0f2b48] bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-600" />
                    <span>View Specifications</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('evaluations')}
                    className="px-3 py-1.5 text-xs font-bold text-white bg-[#0f2b48] hover:bg-[#16385c] rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
                  >
                    <span>View Applications</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* DETAIL MODAL */}
      {selectedOpp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="px-2 py-0.5 bg-orange-100 text-[#ea580c] font-black text-[10px] rounded-md">
                  {selectedOpp.sector}
                </span>
                <h3 className="text-base font-black text-[#0f2b48] mt-1">
                  {selectedOpp.title}
                </h3>
                <p className="text-xs text-slate-500">{selectedOpp.departmentName}</p>
              </div>
              <button onClick={() => setSelectedOpp(null)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-700">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-800">
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Budget Scope</div>
                  <div className="font-extrabold text-[#0f2b48]">{selectedOpp.budgetEstimate}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Deadline</div>
                  <div className="font-extrabold text-slate-800">{selectedOpp.deadline}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Readiness</div>
                  <div className="font-extrabold text-emerald-700">Min TRL {selectedOpp.trlRequired}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Location</div>
                  <div className="font-extrabold text-slate-800 truncate">{selectedOpp.location || selectedOpp.state || 'National'}</div>
                </div>
              </div>

              <div>
                <span className="font-bold text-[#0f2b48] block mb-1">Problem Statement:</span>
                <p className="p-3 bg-slate-50 rounded-xl leading-relaxed border border-slate-200">{selectedOpp.problemStatement}</p>
              </div>

              {selectedOpp.currentProcess && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-bold text-[#0f2b48] block text-[11px] mb-1">Current Process:</span>
                    <p className="text-slate-700 leading-relaxed">{selectedOpp.currentProcess}</p>
                  </div>
                  <div className="p-3 bg-red-50/60 rounded-xl border border-red-200">
                    <span className="font-bold text-red-800 block text-[11px] mb-1">Pain Points:</span>
                    <p className="text-red-900 leading-relaxed">{selectedOpp.painPoints}</p>
                  </div>
                </div>
              )}

              <div>
                <span className="font-bold text-[#0f2b48] block mb-1">Desired Outcome & Success Metrics:</span>
                <div className="p-3 bg-emerald-50/70 text-emerald-950 rounded-xl leading-relaxed border border-emerald-200 space-y-1.5">
                  <p className="font-medium">{selectedOpp.desiredOutcome}</p>
                  {selectedOpp.successMetrics && (
                    <div className="text-[11px] text-emerald-900 font-semibold pt-1 border-t border-emerald-200/60">
                      <strong>Metrics:</strong> {selectedOpp.successMetrics}
                    </div>
                  )}
                </div>
              </div>

              {selectedOpp.requiredCapabilities && selectedOpp.requiredCapabilities.length > 0 && (
                <div>
                  <span className="font-bold text-[#0f2b48] block mb-1.5">Required Capabilities:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedOpp.requiredCapabilities.map((c, i) => (
                      <span key={i} className="px-2.5 py-1 bg-orange-100 text-[#ea580c] font-black text-xs rounded-lg border border-orange-200">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedOpp.evaluationWeights && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <span className="font-bold text-[#0f2b48] block text-[11px]">Evaluation Scoring Matrix (100% Total):</span>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-[10px]">
                    <div className="p-1.5 bg-white rounded-lg border border-slate-200">
                      <div className="text-slate-400">Tech Cap</div>
                      <div className="font-bold text-[#0f2b48]">{selectedOpp.evaluationWeights.technicalCapability}%</div>
                    </div>
                    <div className="p-1.5 bg-white rounded-lg border border-slate-200">
                      <div className="text-slate-400">Fit</div>
                      <div className="font-bold text-[#0f2b48]">{selectedOpp.evaluationWeights.problemSolutionFit}%</div>
                    </div>
                    <div className="p-1.5 bg-white rounded-lg border border-slate-200">
                      <div className="text-slate-400">Innovation</div>
                      <div className="font-bold text-[#0f2b48]">{selectedOpp.evaluationWeights.innovation}%</div>
                    </div>
                    <div className="p-1.5 bg-white rounded-lg border border-slate-200">
                      <div className="text-slate-400">Scaling</div>
                      <div className="font-bold text-[#0f2b48]">{selectedOpp.evaluationWeights.scalability}%</div>
                    </div>
                    <div className="p-1.5 bg-white rounded-lg border border-slate-200">
                      <div className="text-slate-400">Security</div>
                      <div className="font-bold text-[#0f2b48]">{selectedOpp.evaluationWeights.security}%</div>
                    </div>
                    <div className="p-1.5 bg-white rounded-lg border border-slate-200">
                      <div className="text-slate-400">Execution</div>
                      <div className="font-bold text-[#0f2b48]">{selectedOpp.evaluationWeights.executionCapability}%</div>
                    </div>
                  </div>
                </div>
              )}

              {selectedOpp.securityRequirements && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <strong className="text-slate-800 block mb-0.5">Security Requirements:</strong>
                    <p className="text-slate-600">{selectedOpp.securityRequirements}</p>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <strong className="text-slate-800 block mb-0.5">Compliance Standards:</strong>
                    <p className="text-slate-600">{selectedOpp.complianceRequirements}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button onClick={() => setSelectedOpp(null)} className="px-4 py-2 text-xs font-bold text-white bg-[#0f2b48] rounded-lg">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
