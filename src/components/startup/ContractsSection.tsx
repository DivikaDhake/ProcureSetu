import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CheckCircle2, 
  Clock, 
  Upload, 
  FileText, 
  AlertCircle, 
  ShieldCheck, 
  ArrowRight,
  ExternalLink,
  X
} from 'lucide-react';

export const ContractsSection: React.FC = () => {
  const { 
    currentUser, 
    currentStartupProfile, 
    milestones, 
    submitMilestoneDeliverable, 
    addToast 
  } = useApp();

  const [activeMilestoneId, setActiveMilestoneId] = useState<string | null>(null);
  const [deliverableNotes, setDeliverableNotes] = useState('');
  const [deliverableLinks, setDeliverableLinks] = useState('');

  const myMilestones = milestones.filter(m => 
    m.startupId === (currentStartupProfile?.id || 'startup_1') ||
    m.startupName.toLowerCase().includes(currentUser?.organizationName.toLowerCase() || '')
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMilestoneId) return;

    if (!deliverableNotes.trim()) {
      addToast('Please provide deliverable notes.', 'warning');
      return;
    }

    const items = deliverableLinks
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0);

    submitMilestoneDeliverable(
      activeMilestoneId,
      deliverableNotes.trim(),
      items.length > 0 ? items : ['Field inspection trial report', 'Operational telemetry log']
    );

    setActiveMilestoneId(null);
    setDeliverableNotes('');
    setDeliverableLinks('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-black text-[10px] uppercase rounded-md tracking-wider">
              Procurement & Payout Desk
            </span>
            <h2 className="text-base sm:text-lg font-black text-[#0f2b48]">
              Contracts & Milestone Escrow Management
            </h2>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Transparent milestone deliverables with nodal sign-offs and automatic treasury escrow recommendations.
          </p>
        </div>
      </div>

      {/* Contract Summary Card */}
      <div className="neu-card p-6 bg-white border border-slate-200 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400">Contract Reference: JJM-INNOV-2025-09</span>
            <h3 className="text-base font-black text-[#0f2b48]">
              Real-time In-line Arsenic & Heavy Metal Detection Pilot Contract
            </h3>
            <p className="text-xs text-slate-500 font-semibold">Department of Drinking Water & Sanitation (Jal Jeevan Mission)</p>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-xs text-slate-400 block font-semibold">Total Contract Value</span>
            <span className="text-xl font-black text-[#0f2b48]">₹65,00,000</span>
          </div>
        </div>

        {/* Milestone Cards List */}
        <div className="space-y-4">
          {myMilestones.map(ms => {
            const isApproved = ms.status === 'verified_and_approved';
            const isInProgress = ms.status === 'in_progress';
            const isSubmitted = ms.status === 'submitted_for_approval';

            return (
              <div 
                key={ms.id}
                className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold">
                      <span className="text-slate-500">{ms.dueDate}</span>
                      <span>·</span>
                      <span className="text-[#ea580c] font-black">{ms.amount}</span>
                    </div>
                    <h4 className="text-sm font-black text-[#0f2b48] mt-1">
                      {ms.title}
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">{ms.description}</p>
                  </div>

                  <span className={`px-2.5 py-1 text-xs font-bold rounded-lg shrink-0 ${
                    isApproved ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                    isSubmitted ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                    'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}>
                    {isApproved ? '✓ Verified & Approved' :
                     isSubmitted ? 'Deliverables Under Review' :
                     'In Progress'}
                  </span>
                </div>

                {/* Proof Deliverables */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Required Deliverables:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {ms.proofDeliverables.map((d, i) => (
                      <span key={i} className="px-2 py-0.5 bg-white border border-slate-200 text-slate-700 text-[10px] font-medium rounded-md">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>

                {isApproved && ms.approvalNotes && (
                  <div className="p-3 bg-emerald-50 text-emerald-950 border border-emerald-200 rounded-lg text-xs">
                    <strong>Nodal Officer Sign-off:</strong> {ms.approvalNotes}
                    <div className="text-[10px] text-emerald-700 mt-0.5 font-bold">
                      Payment Release Recommended: {ms.approvedAt}
                    </div>
                  </div>
                )}

                {isInProgress && (
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => setActiveMilestoneId(ms.id)}
                      className="px-4 py-1.5 text-xs font-bold text-white bg-[#0f2b48] hover:bg-[#16385c] rounded-lg shadow-2xs flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Submit Deliverables</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Deliverable submission modal */}
      {activeMilestoneId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-[#0f2b48]">
                  Submit Milestone Deliverables
                </h3>
                <p className="text-xs text-slate-500">Provide verifiable documentation and field reports.</p>
              </div>
              <button 
                onClick={() => setActiveMilestoneId(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Deliverable Summary & Execution Notes *
                </label>
                <textarea
                  rows={3}
                  required
                  value={deliverableNotes}
                  onChange={e => setDeliverableNotes(e.target.value)}
                  placeholder="Detail the work completed, inspection dates, and operational status..."
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-lg outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Artifact Titles & Verification References (1 per line)
                </label>
                <textarea
                  rows={2}
                  value={deliverableLinks}
                  onChange={e => setDeliverableLinks(e.target.value)}
                  placeholder="e.g., Geo-tagged telemetry log, Executive Engineer sign-off receipt"
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-lg outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveMilestoneId(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#0f2b48] hover:bg-[#16385c] rounded-lg shadow-2xs"
                >
                  Submit for Nodal Verification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
