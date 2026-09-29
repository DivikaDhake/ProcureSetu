import React from 'react';
import { useApp } from '../../context/AppContext';
import { BarChart3, TrendingUp, ShieldCheck, Download, Award, CheckCircle2, Clock } from 'lucide-react';

export const GovtReportsSection: React.FC = () => {
  const { addToast } = useApp();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-blue-100 text-blue-900 font-black text-[10px] uppercase rounded-md tracking-wider">
              Procurement Intelligence
            </span>
            <h2 className="text-base sm:text-lg font-black text-[#0f2b48]">
              Government Innovation Intelligence & Audit Reports
            </h2>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Real-time analytics measuring procurement cycle-time acceleration and audit-query protection under GFR 173(i).
          </p>
        </div>

        <button
          onClick={() => addToast('Comprehensive Procurement Intelligence Report exported (PDF).', 'success')}
          className="px-3.5 py-1.5 text-xs font-bold text-[#0f2b48] bg-white border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center gap-1.5 shadow-2xs self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-[#ea580c]" />
          <span>Export Analytics Report (PDF)</span>
        </button>
      </div>

      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="neu-card p-5 bg-white border border-slate-200 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Cycle-Time Reduction</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-emerald-700">
            -68%
          </div>
          <p className="text-xs text-slate-500">
            Reduced from 18 months standard tendering to 5.4 months evidence-grounded pilot readiness.
          </p>
        </div>

        <div className="neu-card p-5 bg-white border border-slate-200 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Audit Queries Protected</span>
            <ShieldCheck className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-black text-[#0f2b48]">
            100%
          </div>
          <p className="text-xs text-slate-500">
            Every selection justified by third-party NABL testbed evidence and GFR 173(i) exemption documentation.
          </p>
        </div>

        <div className="neu-card p-5 bg-white border border-slate-200 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">DPIIT Startups Engaged</span>
            <Award className="w-4 h-4 text-[#ea580c]" />
          </div>
          <div className="text-3xl font-black text-[#ea580c]">
            48 Startups
          </div>
          <p className="text-xs text-slate-500">
            Evaluated across Water, Civil, CleanTech, AI, and Electronics domains.
          </p>
        </div>
      </div>

      {/* Sectoral Breakdown */}
      <div className="neu-card p-6 bg-white border border-slate-200 rounded-2xl space-y-4">
        <h3 className="text-sm font-black text-[#0f2b48] uppercase tracking-wide">
          Innovation Discovery Across Public Sectors
        </h3>

        <div className="space-y-3">
          {[
            { sector: 'Water & Environment', percent: 85, challenges: 4, value: '₹3.2 Cr' },
            { sector: 'Civil Infrastructure', percent: 72, challenges: 3, value: '₹4.7 Cr' },
            { sector: 'CleanTech & Waste', percent: 64, challenges: 3, value: '₹2.3 Cr' },
            { sector: 'Artificial Intelligence', percent: 58, challenges: 2, value: '₹1.9 Cr' },
            { sector: 'Electronics & Energy', percent: 45, challenges: 2, value: '₹2.8 Cr' },
          ].map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-800">{item.sector}</span>
                <span className="text-slate-500">{item.challenges} Challenges · {item.value}</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-[#0f2b48] to-[#ea580c] h-full rounded-full"
                  style={{ width: `${item.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
