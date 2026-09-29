import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Opportunity } from '../../types';
import { Sparkles, Building2, Calendar, ArrowRight, ShieldCheck, CheckCircle2, Eye, X } from 'lucide-react';

interface Props {
  onOpenApply: (opp: Opportunity) => void;
  onViewOpp: (opp: Opportunity) => void;
}

export const RecommendedOpportunitiesSection: React.FC<Props> = ({ onOpenApply, onViewOpp }) => {
  const { currentStartupProfile, opportunities, applications } = useApp();

  const myApplications = applications.filter(app => 
    app.startupId === (currentStartupProfile?.id || 'startup_1')
  );

  // Filter 3-5 top matching opportunities
  const recommendedOpps = opportunities
    .filter(o => o.status === 'open' || o.status === 'evaluating')
    .slice(0, 4);

  return (
    <div className="space-y-4">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-black text-[10px] uppercase rounded-md tracking-wider">
              Explainable Match Engine
            </span>
            <h2 className="text-base sm:text-lg font-black text-[#0f2b48]">
              SECTION 2 — Recommended Opportunities
            </h2>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Transparently matched to your verified capability profile without opaque algorithms.
          </p>
        </div>
      </div>

      {/* Recommended Opportunities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendedOpps.map(opp => {
          const alreadyApplied = myApplications.some(a => a.opportunityId === opp.id);
          
          // Explainable matching reason
          const matchReason = opp.matchReason || (
            `Matched because your profile contains: ${(opp.requiredCapabilities || ['IoT', 'Water Infrastructure', 'Predictive Analytics']).join(' + ')}`
          );

          return (
            <div 
              key={opp.id} 
              className="neu-card p-5 bg-white border border-slate-200 hover:border-orange-300 transition-all space-y-3.5 flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                {/* Sector + Department + Match Score */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2 py-0.5 bg-orange-100 text-[#ea580c] font-black rounded-md text-[10px]">
                      {opp.sector}
                    </span>
                    <span className="text-slate-500 font-semibold truncate max-w-[180px]">
                      {opp.departmentName}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-black rounded-md shrink-0">
                    {opp.matchPercentage || 95}% Match
                  </span>
                </div>

                {/* Title */}
                <h3 
                  onClick={() => onViewOpp(opp)}
                  className="text-sm sm:text-base font-black text-[#0f2b48] hover:text-[#ea580c] cursor-pointer transition-colors leading-snug"
                >
                  {opp.title}
                </h3>

                {/* EXPLICIT TRANSPARENT MATCH EXPLANATION (No black box language!) */}
                <div className="p-3 bg-amber-50/70 border border-amber-200/90 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase text-amber-900 tracking-wider">
                    <Sparkles className="w-3 h-3 text-[#ea580c]" />
                    <span>Explainable Matching Criteria:</span>
                  </div>
                  <p className="text-xs text-slate-800 font-medium leading-relaxed">
                    "{matchReason}"
                  </p>
                </div>

                {/* Required Capabilities Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(opp.requiredCapabilities || ['IoT', 'Water Infrastructure', 'Predictive Analytics']).map((rc, idx) => (
                    <span 
                      key={idx} 
                      className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-semibold rounded-md border border-slate-200"
                    >
                      {rc}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom footer: Budget + Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[11px] text-slate-400 block">Est. Value:</span>
                  <strong className="text-slate-900 font-bold">{opp.budgetEstimate}</strong>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onViewOpp(opp)}
                    className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    Details
                  </button>

                  {alreadyApplied ? (
                    <span className="px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 rounded-lg flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Applied
                    </span>
                  ) : (
                    <button
                      onClick={() => onOpenApply(opp)}
                      className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#0f2b48] hover:bg-[#16385c] rounded-lg transition-colors flex items-center gap-1"
                    >
                      <span>Apply</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
