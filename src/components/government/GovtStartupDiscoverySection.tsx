import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StartupProfile } from '../../types';
import { SECTOR_OPTIONS } from '../../data/mockData';
import { Search, Eye, ShieldCheck, CheckCircle2, Award, Building2, MapPin, X, ArrowRight } from 'lucide-react';

export const GovtStartupDiscoverySection: React.FC = () => {
  const { startups, evidence, addToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [sectorFilter, setSectorFilter] = useState('All Sectors');
  const [selectedStartup, setSelectedStartup] = useState<StartupProfile | null>(null);

  const filteredStartups = startups.filter(st => {
    const matchesSector = sectorFilter === 'All Sectors' || 
      st.primarySector.toLowerCase() === sectorFilter.toLowerCase() ||
      (st.secondarySectors && st.secondarySectors.some(s => s.toLowerCase() === sectorFilter.toLowerCase()));
    
    const matchesSearch = searchQuery === '' || 
      st.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (st.keyCapabilities && st.keyCapabilities.some(c => c.toLowerCase().includes(searchQuery.toLowerCase())));

    return matchesSector && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-black text-[10px] uppercase rounded-md tracking-wider">
              Innovation Scout
            </span>
            <h2 className="text-base sm:text-lg font-black text-[#0f2b48]">
              Startup Capability Discovery
            </h2>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Discover verified startups across all 18 industrial and deeptech sectors without prior turnover restrictions.
          </p>
        </div>

        <div className="text-xs font-semibold text-slate-500 self-start sm:self-auto">
          Showing <strong className="text-[#0f2b48]">{filteredStartups.length}</strong> Verified Startups
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="neu-card p-4 bg-white border border-slate-200 rounded-xl space-y-3 sm:space-y-0 sm:flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by company name, technology, or capability..."
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

      {/* Startups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStartups.map(st => {
          const stEvidence = evidence.filter(e => e.startupId === st.id);
          const verifiedEvidence = stEvidence.filter(e => e.verificationStatus === 'verified');

          return (
            <div 
              key={st.id}
              className="neu-card p-5 bg-white border border-slate-200 hover:border-orange-300 transition-all space-y-3.5 flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2 py-0.5 bg-orange-100 text-[#ea580c] font-black text-[10px] rounded-md">
                    {st.primarySector}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Trust Index: {st.trustIndex || 94}</span>
                  </div>
                </div>

                <h3 className="text-base font-black text-[#0f2b48]">
                  {st.companyName}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-2">
                  {st.bio || st.shortDescription}
                </p>

                {/* Capabilities */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Key Capabilities:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {(st.keyCapabilities || []).slice(0, 3).map((cap, i) => (
                      <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-900 border border-blue-100 text-[10px] font-semibold rounded-md">
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Verified Indicators */}
                <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-[11px] text-slate-600">
                  <div className="flex justify-between">
                    <span>Evidence Vault:</span>
                    <strong className="text-slate-900">{stEvidence.length} items ({verifiedEvidence.length} verified)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Deployments:</span>
                    <span className="font-semibold text-emerald-700">1 Verified Trial</span>
                  </div>
                  <div className="flex justify-between">
                    <span>DPIIT Exemption:</span>
                    <span className="font-bold text-emerald-800">GFR 173(i) Active ✓</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setSelectedStartup(st)}
                  className="w-full py-2 text-xs font-bold text-[#0f2b48] bg-slate-100 hover:bg-[#0f2b48] hover:text-white rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Capability Profile</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* DETAIL MODAL */}
      {selectedStartup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="px-2 py-0.5 bg-orange-100 text-[#ea580c] font-black text-[10px] rounded-md">
                  {selectedStartup.primarySector}
                </span>
                <h3 className="text-base font-black text-[#0f2b48] mt-1">
                  {selectedStartup.companyName}
                </h3>
                <p className="text-xs text-slate-500">DPIIT: {selectedStartup.dpiitNumber} · GFR 173(i) Turnover-Exempt</p>
              </div>
              <button onClick={() => setSelectedStartup(null)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div>
                <span className="font-bold text-slate-900">Technical Overview:</span>
                <p className="mt-1 p-2.5 bg-slate-50 rounded-lg leading-relaxed">{selectedStartup.bio}</p>
              </div>

              <div>
                <span className="font-bold text-slate-900">Demonstrated Capabilities:</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {selectedStartup.keyCapabilities.map((c, i) => (
                    <span key={i} className="px-2.5 py-1 bg-blue-50 text-blue-900 border border-blue-200 rounded-md font-semibold text-[11px]">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <div>Previous Deployments: <strong className="text-slate-900">{selectedStartup.previousDeployments || '12 field units operating'}</strong></div>
                <div>Government Experience: <span className="font-semibold text-emerald-700">{selectedStartup.governmentExperience || 'Pilot stage with JJM'}</span></div>
                <div>Headquarters: <span className="text-slate-800">{selectedStartup.headquarters}</span></div>
                <div>Team Size: <span className="text-slate-800">{selectedStartup.teamSize}</span></div>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-emerald-950">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span className="font-bold">Trust Index: {selectedStartup.trustIndex || 94}/100</span>
                </div>
                <button
                  onClick={() => {
                    addToast(`Contact request sent to ${selectedStartup.companyName}.`, 'success');
                    setSelectedStartup(null);
                  }}
                  className="px-3 py-1.5 bg-[#0f2b48] text-white text-xs font-bold rounded-lg shadow-2xs"
                >
                  Initiate Engagement
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button onClick={() => setSelectedStartup(null)} className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
