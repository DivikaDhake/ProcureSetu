import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Application } from '../../types';
import { 
  FileCheck2, 
  CheckCircle2, 
  Clock, 
  Award, 
  ChevronRight, 
  ArrowRight, 
  ShieldCheck, 
  Check, 
  Layers,
  Sparkles,
  X
} from 'lucide-react';

interface Props {
  standalone?: boolean;
}

export const ApplicationTrackerSection: React.FC<Props> = ({ standalone = false }) => {
  const { currentStartupProfile, currentUser, applications, evidence, setActiveTab } = useApp();

  const [selectedAppForDetail, setSelectedAppForDetail] = useState<Application | null>(null);

  const myApplications = applications.filter(app => 
    app.startupId === (currentStartupProfile?.id || 'startup_1') || 
    app.startupName.toLowerCase().includes(currentUser?.organizationName.toLowerCase() || '')
  );

  // 7 Stages per prompt specification
  const stages = [
    { key: 'submitted', label: 'Submitted', stepNum: 1 },
    { key: 'under_review', label: 'Under Review', stepNum: 2 },
    { key: 'evidence_verification', label: 'Evidence Verification', stepNum: 3 },
    { key: 'technical_evaluation', label: 'Technical Evaluation', stepNum: 4 },
    { key: 'shortlisted', label: 'Shortlisted', stepNum: 5 },
    { key: 'procurement_ready', label: 'Procurement Ready', stepNum: 6 },
    { key: 'closed', label: 'Closed', stepNum: 7 },
  ];

  // Helper to determine active step index (0 to 6)
  const getStageIndex = (status: string): number => {
    switch (status) {
      case 'applied':
      case 'submitted':
        return 0;
      case 'under_review':
        return 1;
      case 'evidence_verification':
      case 'evidence_verified':
        return 2;
      case 'technical_evaluation':
        return 3;
      case 'shortlisted':
        return 4;
      case 'procurement_ready':
      case 'contract_awarded':
        return 5;
      case 'closed':
      case 'rejected':
        return 6;
      default:
        return 0;
    }
  };

  return (
    <div className="space-y-4">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-blue-100 text-blue-900 font-black text-[10px] uppercase rounded-md tracking-wider">
              Transparent Evaluation Pipeline
            </span>
            <h2 className="text-base sm:text-lg font-black text-[#0f2b48]">
              SECTION 5 — Application Tracker
            </h2>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Real-time stage progression across 7 milestones from submission to procurement readiness.
          </p>
        </div>

        <div className="text-xs font-semibold text-slate-500 self-start sm:self-auto">
          {myApplications.length} Active Application{myApplications.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Applications List */}
      {myApplications.length === 0 ? (
        <div className="neu-card p-10 bg-white text-center text-slate-500 space-y-3">
          <FileCheck2 className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-xs font-semibold">No applications submitted yet.</p>
          <button
            onClick={() => setActiveTab('opportunity-radar')}
            className="px-4 py-2 text-xs font-bold text-white bg-[#0f2b48] hover:bg-[#16385c] rounded-lg shadow-2xs"
          >
            Explore Opportunities on Radar
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {myApplications.map(app => {
            const currentStageIndex = getStageIndex(app.status);

            return (
              <div 
                key={app.id} 
                className="neu-card p-5 sm:p-6 bg-white border border-slate-200/90 rounded-2xl space-y-5 hover:border-slate-300 transition-all"
              >
                {/* Header: Dept + Sector + App ID + Current Stage Badge */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="px-2 py-0.5 bg-orange-100 text-[#ea580c] font-black rounded-md text-[10px]">
                        {app.sector}
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="font-bold text-slate-600">{app.departmentName}</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-[11px] font-mono text-slate-400">ID: {app.id}</span>
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-[#0f2b48]">
                      {app.opportunityTitle}
                    </h3>
                  </div>

                  <span className={`px-3 py-1 text-xs font-black rounded-lg border shrink-0 ${
                    app.status === 'procurement_ready' 
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                      : app.status === 'shortlisted' 
                        ? 'bg-orange-50 text-orange-800 border-orange-300' 
                        : app.status === 'submitted'
                          ? 'bg-blue-50 text-blue-900 border-blue-200'
                          : 'bg-slate-50 text-slate-800 border-slate-200'
                  }`}>
                    {app.status === 'procurement_ready' ? '★ Procurement Ready' :
                     app.status === 'shortlisted' ? '✓ Shortlisted for Pilot' :
                     app.status === 'submitted' ? '✓ Submitted' :
                     stages[currentStageIndex].label}
                  </span>
                </div>

                {/* HORIZONTAL STEPPER: 7 SPECIFIED STAGES */}
                <div className="pt-2 pb-1 overflow-x-auto">
                  <div className="min-w-[620px]">
                    <div className="grid grid-cols-7 gap-1 text-center relative">
                      {stages.map((stage, idx) => {
                        const isCompleted = idx < currentStageIndex;
                        const isCurrent = idx === currentStageIndex;
                        const isUpcoming = idx > currentStageIndex;

                        return (
                          <div key={stage.key} className="flex flex-col items-center relative">
                            {/* Step Indicator Dot */}
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-2xs ${
                              isCompleted
                                ? 'bg-emerald-600 text-white'
                                : isCurrent
                                  ? 'bg-[#0f2b48] text-[#f97316] ring-4 ring-orange-100 font-black'
                                  : 'bg-slate-100 text-slate-400 border border-slate-200'
                            }`}>
                              {isCompleted ? (
                                <Check className="w-4 h-4 stroke-[3]" />
                              ) : (
                                <span>{stage.stepNum}</span>
                              )}
                            </div>

                            {/* Label */}
                            <span className={`mt-2 text-[11px] leading-tight font-bold ${
                              isCurrent 
                                ? 'text-[#0f2b48] font-black' 
                                : isCompleted 
                                  ? 'text-emerald-800 font-semibold' 
                                  : 'text-slate-400'
                            }`}>
                              {stage.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Evaluation Criteria Scorecard if evaluated */}
                {app.evaluationScores ? (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-bold text-[#0f2b48]">
                        <Award className="w-4 h-4 text-emerald-600" />
                        <span>Nodal Committee Evaluation Scores:</span>
                      </div>
                      <span className="text-base font-black text-emerald-700">
                        {app.evaluationScores.totalScore} / 100
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      <div className="p-2.5 bg-white rounded-lg border border-slate-200/80 text-center">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Problem Alignment</span>
                        <div className="text-sm font-black text-slate-800 mt-0.5">{app.evaluationScores.problemAlignment} / 25</div>
                      </div>
                      <div className="p-2.5 bg-white rounded-lg border border-slate-200/80 text-center">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Evidence Rigor</span>
                        <div className="text-sm font-black text-slate-800 mt-0.5">{app.evaluationScores.evidenceRigor} / 25</div>
                      </div>
                      <div className="p-2.5 bg-white rounded-lg border border-slate-200/80 text-center">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Tech Feasibility</span>
                        <div className="text-sm font-black text-slate-800 mt-0.5">{app.evaluationScores.technicalFeasibility} / 25</div>
                      </div>
                      <div className="p-2.5 bg-white rounded-lg border border-slate-200/80 text-center">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Scaling Capacity</span>
                        <div className="text-sm font-black text-slate-800 mt-0.5">{app.evaluationScores.scalingCapacity} / 25</div>
                      </div>
                    </div>

                    {app.evaluatorNotes && (
                      <div className="pt-2 border-t border-slate-200 text-slate-700 italic">
                        "{app.evaluatorNotes}"
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Currently under technical scrutiny by department engineers. Evaluation scores will populate automatically upon verification.</span>
                  </div>
                )}

                {/* Footer details row */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
                  <div>
                    Submitted on: <strong className="text-slate-700">{app.submittedAt}</strong> · Proposed TRL: <strong className="text-[#0f2b48]">TRL {app.trlProposed}</strong>
                  </div>

                  <button
                    onClick={() => setSelectedAppForDetail(app)}
                    className="font-bold text-[#0f2b48] hover:text-[#ea580c] flex items-center gap-1 self-start sm:self-auto"
                  >
                    <span>View Submitted Capability Dossier</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DETAIL MODAL: View Submitted Dossier */}
      {selectedAppForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="px-2 py-0.5 bg-orange-100 text-[#ea580c] font-black text-[10px] rounded-md">
                  Submitted Capability Dossier
                </span>
                <h3 className="text-base font-black text-[#0f2b48] mt-1">
                  {selectedAppForDetail.opportunityTitle}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedAppForDetail(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-700">
              {/* Header metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Status</span>
                  <strong className="text-emerald-700 font-black">{selectedAppForDetail.status === 'submitted' ? 'Submitted' : selectedAppForDetail.status}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Proposed TRL</span>
                  <strong className="text-[#0f2b48] font-black">TRL {selectedAppForDetail.trlProposed}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Proposed Cost</span>
                  <strong className="text-slate-800 font-black">{selectedAppForDetail.estimatedCost || 'As per bid'}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Submission</span>
                  <strong className="text-slate-700 font-semibold">{selectedAppForDetail.submittedAt}</strong>
                </div>
              </div>

              {/* Solution Overview */}
              <div>
                <span className="font-bold text-[#0f2b48] block mb-1">
                  {selectedAppForDetail.solutionName ? selectedAppForDetail.solutionName : 'Proposed Technology Solution'}
                </span>
                <p className="p-3 bg-slate-50 rounded-xl leading-relaxed text-slate-800 border border-slate-200">
                  {selectedAppForDetail.proposedApproach || selectedAppForDetail.solutionSummary}
                </p>
              </div>

              {selectedAppForDetail.problemUnderstanding && (
                <div>
                  <span className="font-bold text-[#0f2b48] block mb-1">Operational Problem Understanding:</span>
                  <p className="p-3 bg-slate-50 rounded-xl leading-relaxed text-slate-700 border border-slate-200">
                    {selectedAppForDetail.problemUnderstanding}
                  </p>
                </div>
              )}

              {selectedAppForDetail.expectedImpact && (
                <div>
                  <span className="font-bold text-[#0f2b48] block mb-1">Expected Impact & Quantified Outcomes:</span>
                  <p className="p-3 bg-emerald-50/60 rounded-xl leading-relaxed text-emerald-950 border border-emerald-200 whitespace-pre-line">
                    {selectedAppForDetail.expectedImpact}
                  </p>
                </div>
              )}

              {/* Attached Evidence Items */}
              <div>
                <span className="font-bold text-[#0f2b48] block mb-1.5">
                  Attached Capability Evidence ({selectedAppForDetail.attachedEvidenceIds?.length || 0} Artifacts):
                </span>
                <div className="grid grid-cols-1 gap-2">
                  {selectedAppForDetail.attachedEvidenceIds?.map(evId => {
                    const match = evidence.find(e => e.id === evId);
                    return match ? (
                      <div key={match.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 truncate">
                          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="font-bold text-slate-800 truncate">{match.title}</span>
                          <span className="text-[10px] text-slate-400 shrink-0">({match.issuingAuthority})</span>
                        </div>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-md shrink-0">
                          {match.verificationStatus}
                        </span>
                      </div>
                    ) : (
                      <div key={evId} className="p-2 bg-slate-50 rounded-lg text-[11px] text-slate-600">
                        Evidence Doc Ref: {evId}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Execution Details */}
              {selectedAppForDetail.executionTeam && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <strong className="text-slate-800 block mb-1">Execution Team:</strong>
                    <p className="text-slate-600 whitespace-pre-line">{selectedAppForDetail.executionTeam}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <strong className="text-slate-800 block mb-1">Timeline & Sprints:</strong>
                    <p className="text-slate-600 whitespace-pre-line">{selectedAppForDetail.executionTimeline}</p>
                  </div>
                </div>
              )}

              {/* Commercial Milestone Proposals */}
              {selectedAppForDetail.milestoneProposals && selectedAppForDetail.milestoneProposals.length > 0 && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <strong className="text-[#0f2b48] block">Commercial Milestone Schedule:</strong>
                    <span className="text-[11px] text-slate-500 font-medium">Model: {selectedAppForDetail.pricingModel || 'Milestone Fixed Price'}</span>
                  </div>
                  <div className="space-y-1.5 pt-1">
                    {selectedAppForDetail.milestoneProposals.map((mp, idx) => (
                      <div key={idx} className="p-2 bg-white rounded-lg border border-slate-200 flex justify-between items-center text-[11px]">
                        <div>
                          <strong className="text-slate-800">{mp.title}</strong>
                          <div className="text-[10px] text-slate-400">Due: {mp.dueDate}</div>
                        </div>
                        <span className="font-black text-emerald-800 font-mono">{mp.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Statutory Exemption Status */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1 text-emerald-950">
                <div className="font-bold flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Statutory GFR 173(i) & DPIIT Status:</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <div>Technical Fit: <strong className="text-emerald-800">Verified ✓</strong></div>
                  <div>Evidence Audit: <strong className="text-emerald-800">Tamper-Proof ✓</strong></div>
                  <div>DPIIT Exemption: <strong className="text-emerald-800">Active (Turnover Exempt) ✓</strong></div>
                  <div>Readiness Signed: <strong className="text-emerald-800">Compliant ✓</strong></div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedAppForDetail(null)}
                className="px-4 py-2 text-xs font-bold text-white bg-[#0f2b48] rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
