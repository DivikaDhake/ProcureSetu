import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Milestone } from '../../types';
import { CheckCircle2, Clock, ShieldCheck, FileCheck, ArrowRight, X, AlertCircle } from 'lucide-react';

export const GovtMilestonesSection: React.FC = () => {
  const { milestones, approveMilestone, addToast } = useApp();

  const [activeApprovalMilestone, setActiveApprovalMilestone] = useState<Milestone | null>(null);
  const [approvalNotes, setApprovalNotes] = useState('');

  const handleApprove = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeApprovalMilestone) return;

    approveMilestone(
      activeApprovalMilestone.id,
      approvalNotes.trim() || 'Deliverables verified on site by Executive Engineer. Treasury release recommended.'
    );

    addToast(`Milestone approved for ${activeApprovalMilestone.startupName}. Treasury escrow recommendation note issued.`, 'success');
    setActiveApprovalMilestone(null);
    setApprovalNotes('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-amber-100 text-amber-900 font-black text-[10px] uppercase rounded-md tracking-wider">
              Deliverables & Escrow
            </span>
            <h2 className="text-base sm:text-lg font-black text-[#0f2b48]">
              Milestone Deliverable Sign-off Desk
            </h2>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Audit proof-of-work submitted by startups and authorize milestone tranche payouts.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {milestones.map(ms => {
          const isApproved = ms.status === 'verified_and_approved';
          const isPending = ms.status === 'in_progress' || ms.status === 'submitted_for_approval';

          return (
            <div 
              key={ms.id}
              className="neu-card p-5 sm:p-6 bg-white border border-slate-200 rounded-2xl space-y-3.5"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <span className="text-[#ea580c]">{ms.startupName}</span>
                    <span>·</span>
                    <span className="text-slate-500">{ms.departmentName}</span>
                    <span>·</span>
                    <span className="text-slate-800">{ms.amount}</span>
                  </div>

                  <h3 className="text-base font-black text-[#0f2b48] mt-1">
                    {ms.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                    {ms.description}
                  </p>
                </div>

                <span className={`px-2.5 py-1 text-xs font-bold rounded-lg shrink-0 ${
                  isApproved ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                  'bg-amber-100 text-amber-800 border border-amber-200'
                }`}>
                  {isApproved ? '✓ Approved by Nodal Officer' : 'Verification In Progress'}
                </span>
              </div>

              {/* Proof deliverables list */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Submitted Proof Deliverables:</span>
                <div className="flex flex-wrap gap-1.5">
                  {ms.proofDeliverables.map((d, i) => (
                    <span key={i} className="px-2.5 py-1 bg-slate-50 border border-slate-200 text-slate-700 text-[11px] font-medium rounded-md flex items-center gap-1.5">
                      <FileCheck className="w-3 h-3 text-emerald-600" />
                      <span>{d}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Approval notes or Action */}
              {isApproved ? (
                <div className="p-3 bg-emerald-50 text-emerald-950 border border-emerald-200 rounded-xl text-xs flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Approval Record:</strong> {ms.approvalNotes}
                    <div className="text-[10px] text-emerald-700 mt-0.5 font-bold">
                      Treasury Disbursement Clearance Date: {ms.approvedAt}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setActiveApprovalMilestone(ms)}
                    className="px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-2xs flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Authorize Tranche Sign-off ({ms.amount})</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* APPROVAL MODAL */}
      {activeApprovalMilestone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-md">
                  Authorize Release
                </span>
                <h3 className="text-base font-black text-[#0f2b48] mt-1">
                  {activeApprovalMilestone.title}
                </h3>
                <p className="text-xs text-slate-500">{activeApprovalMilestone.startupName} · {activeApprovalMilestone.amount}</p>
              </div>
              <button onClick={() => setActiveApprovalMilestone(null)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApprove} className="space-y-3.5 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="font-bold text-slate-700">Deliverable Verification Confirmation:</span>
                <p className="text-slate-600">You are certifying that the field deliverables have been physically inspected and meet the technical requirements under the signed pilot contract.</p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nodal Officer Sign-off Remarks *
                </label>
                <textarea
                  rows={3}
                  required
                  value={approvalNotes}
                  onChange={e => setApprovalNotes(e.target.value)}
                  placeholder="e.g., Deliverables verified on site by Executive Engineer (Nadia Circle). Inspection report matches ICP-MS benchmark. Escrow payment release advised."
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-lg outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveApprovalMilestone(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm"
                >
                  Confirm & Authorize Release
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
