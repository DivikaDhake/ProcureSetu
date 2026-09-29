import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Opportunity, Application } from '../../types';
import { 
  CheckCircle2, 
  Download, 
  FileText, 
  ExternalLink, 
  Award, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  Layers
} from 'lucide-react';

export const ProcurementSection: React.FC = () => {
  const { opportunities, applications, addToast } = useApp();

  const [activeFilterPhase, setActiveFilterPhase] = useState<string>('All');

  const phases = [
    { key: 'Evaluation', label: 'Evaluation' },
    { key: 'Shortlisted', label: 'Shortlisted' },
    { key: 'Procurement Preparation', label: 'Procurement Preparation' },
    { key: 'Procurement Ready', label: 'Procurement Ready' },
    { key: 'Transferred to Procurement', label: 'Transferred to Procurement' },
    { key: 'Completed', label: 'Completed' },
  ];

  const readyApplications = applications.filter(a => a.status === 'procurement_ready');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-black text-[10px] uppercase rounded-md tracking-wider">
              Procurement Gateway
            </span>
            <h2 className="text-base sm:text-lg font-black text-[#0f2b48]">
              Procurement Readiness Desk
            </h2>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            DPIIT GFR 173(i) verified solutions prepared for GeM Custom Bids and State e-Tendering.
          </p>
        </div>

        <button
          onClick={() => addToast('Procurement readiness dossier and GeM bid schedule exported as ZIP.', 'success')}
          className="px-4 py-2 text-xs font-bold text-white bg-[#0f2b48] hover:bg-[#16385c] rounded-lg shadow-2xs flex items-center gap-1.5 self-start sm:self-auto neu-button"
        >
          <Download className="w-3.5 h-3.5 text-[#ea580c]" />
          <span>Export All Ready Dossiers (ZIP)</span>
        </button>
      </div>

      {/* 6 Phases Filter Buttons */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setActiveFilterPhase('All')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all shrink-0 ${
            activeFilterPhase === 'All'
              ? 'bg-[#0f2b48] text-white shadow-2xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          All Stages ({opportunities.length})
        </button>
        {phases.map(p => (
          <button
            key={p.key}
            onClick={() => setActiveFilterPhase(p.key)}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all shrink-0 ${
              activeFilterPhase === p.key
                ? 'bg-[#0f2b48] text-white shadow-2xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Certified Procurement-Ready Solutions Banner */}
      <div className="neu-card p-6 bg-gradient-to-br from-emerald-500/10 via-white to-white border-2 border-emerald-300/80 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              ✓
            </div>
            <div>
              <h3 className="text-base font-black text-[#0f2b48]">
                Certified Procurement-Ready Dossiers
              </h3>
              <p className="text-xs text-slate-600">
                These innovations have passed technical committee evaluation with 100% verified NABL evidence and DPIIT turnover exemptions.
              </p>
            </div>
          </div>
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-black text-xs rounded-lg border border-emerald-200 self-start sm:self-auto">
            {readyApplications.length} Certified Solutions
          </span>
        </div>

        <div className="space-y-3 pt-2">
          {readyApplications.map(app => (
            <div key={app.id} className="p-4 bg-white border border-slate-200 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[11px] font-bold">
                  <span className="text-[#ea580c]">{app.startupName}</span>
                  <span>·</span>
                  <span className="text-slate-500">{app.opportunityTitle}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-700">
                  <span className="text-emerald-700 font-bold">Composite Score: {app.evaluationScores?.totalScore || 94}/100</span>
                  <span>·</span>
                  <span>TRL {app.trlProposed} Field Validated</span>
                  <span>·</span>
                  <span className="text-blue-700">GFR 173(i) Turnover-Exempt Certified</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => addToast(`GeM Custom Bid technical schedule generated for ${app.startupName}.`, 'success')}
                  className="px-3 py-1.5 text-xs font-bold text-[#0f2b48] bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Generate GeM Bid Schedule</span>
                </button>

                <button
                  onClick={() => addToast(`Nodal Readiness Dossier PDF downloaded for ${app.startupName}.`, 'success')}
                  className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors shadow-2xs flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Dossier</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pipeline Progression Table */}
      <div className="neu-card bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h4 className="text-xs font-extrabold uppercase text-slate-500 tracking-wider">
            All Opportunities Progression Matrix
          </h4>
          <span className="text-xs text-slate-400 font-medium">Stage alignment</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
              <tr>
                <th className="px-4 py-3">Opportunity</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Sector</th>
                <th className="px-4 py-3">Budget</th>
                <th className="px-4 py-3">Pathway</th>
                <th className="px-4 py-3">Current Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {opportunities.map(opp => (
                <tr key={opp.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3.5 font-bold text-[#0f2b48] max-w-[240px] truncate" title={opp.title}>
                    {opp.title}
                  </td>
                  <td className="px-4 py-3.5 text-slate-600">{opp.departmentName}</td>
                  <td className="px-4 py-3.5">
                    <span className="px-2 py-0.5 bg-orange-100 text-[#ea580c] font-bold rounded text-[10px]">
                      {opp.sector}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-slate-800">{opp.budgetEstimate}</td>
                  <td className="px-4 py-3.5 text-slate-600">{opp.targetProcurementPathway}</td>
                  <td className="px-4 py-3.5">
                    <span className="px-2.5 py-0.5 bg-slate-100 text-slate-800 font-bold rounded-md text-[10px]">
                      {opp.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
