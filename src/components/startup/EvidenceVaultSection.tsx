import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EvidenceItem, EvidenceType } from '../../types';
import { 
  FolderLock, 
  Plus, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Eye, 
  FileCheck2, 
  X, 
  FileText, 
  Award, 
  Sparkles,
  Lock,
  Upload,
  AlertCircle
} from 'lucide-react';

interface Props {
  standalone?: boolean;
}

export const EvidenceVaultSection: React.FC<Props> = ({ standalone = false }) => {
  const { currentStartupProfile, currentUser, evidence, addEvidence, addToast } = useApp();

  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All Evidence');
  const [detailEvidence, setDetailEvidence] = useState<EvidenceItem | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  // New Evidence Form State
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<EvidenceType>('Technical Benchmark');
  const [newAuthority, setNewAuthority] = useState('');
  const [newDocRef, setNewDocRef] = useState('');
  const [newSummary, setNewSummary] = useState('');
  const [newSector, setNewSector] = useState('Water');

  const myEvidence = evidence.filter(e => 
    e.startupId === (currentStartupProfile?.id || 'startup_1') ||
    e.startupName.toLowerCase().includes(currentUser?.organizationName.toLowerCase() || '')
  );

  // Map each of the 6 canonical types to items
  const evidenceCategories: { type: EvidenceType; icon: React.ComponentType<{ className?: string }> }[] = [
    { type: 'Prototype', icon: Sparkles },
    { type: 'Technical Benchmark', icon: Award },
    { type: 'Certifications', icon: FileCheck2 },
    { type: 'Deployments', icon: CheckCircle2 },
    { type: 'Customer References', icon: FileText },
    { type: 'Security Documentation', icon: Lock },
  ];

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAuthority.trim() || !newDocRef.trim()) {
      addToast('Please complete title, authority, and document reference.', 'warning');
      return;
    }

    addEvidence({
      startupId: currentStartupProfile?.id || 'startup_1',
      startupName: currentStartupProfile?.companyName || currentUser?.organizationName || 'Agastya AquaSens Technologies',
      title: newTitle.trim(),
      category: 'technical_benchmark',
      evidenceType: newType,
      issuingAuthority: newAuthority.trim(),
      issueDate: new Date().toISOString().split('T')[0],
      uploadedDate: new Date().toISOString().split('T')[0],
      docStatus: 'Active / Valid',
      documentRef: newDocRef.trim(),
      summary: newSummary.trim() || 'Verifiable test artifact submitted for technical evaluation.',
      sector: newSector
    });

    setUploadModalOpen(false);
    setNewTitle('');
    setNewAuthority('');
    setNewDocRef('');
    setNewSummary('');
  };

  const getCanonicalType = (item: EvidenceItem): string => {
    if (item.evidenceType) {
      if (item.evidenceType === 'Product Demo') return 'Prototype';
      if (item.evidenceType === 'Certificate') return 'Certifications';
      if (item.evidenceType === 'Deployment Evidence') return 'Deployments';
      if (item.evidenceType === 'Security Document') return 'Security Documentation';
      return item.evidenceType;
    }
    if (item.category === 'lab_test' || item.category === 'technical_benchmark') return 'Technical Benchmark';
    if (item.category === 'product_demo' || item.category === 'prototype') return 'Prototype';
    if (item.category === 'patent' || item.category === 'certificate' || item.category === 'quality_cert') return 'Certifications';
    if (item.category === 'field_trial' || item.category === 'deployment_evidence') return 'Deployments';
    if (item.category === 'customer_reference') return 'Customer References';
    return 'Security Documentation';
  };

  const filteredEvidence = selectedCategoryFilter === 'All Evidence'
    ? myEvidence
    : myEvidence.filter(e => getCanonicalType(e) === selectedCategoryFilter);

  return (
    <div className="space-y-4">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-amber-100 text-amber-900 font-black text-[10px] uppercase rounded-md tracking-wider">
              Audit-Ready Repository
            </span>
            <h2 className="text-base sm:text-lg font-black text-[#0f2b48]">
              SECTION 4 — Evidence Vault
            </h2>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Tamper-proof evidence files verifying capability, performance benchmarks, and security.
          </p>
        </div>

        <button
          onClick={() => setUploadModalOpen(true)}
          className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#ea580c] hover:bg-[#c2410c] rounded-lg shadow-2xs flex items-center gap-1.5 self-start sm:self-auto neu-button"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Evidence</span>
        </button>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setSelectedCategoryFilter('All Evidence')}
          className={`px-3 py-1 rounded-lg font-bold transition-all shrink-0 ${
            selectedCategoryFilter === 'All Evidence' 
              ? 'bg-[#0f2b48] text-white shadow-2xs' 
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          All Evidence ({myEvidence.length})
        </button>
        {evidenceCategories.map(cat => (
          <button
            key={cat.type}
            onClick={() => setSelectedCategoryFilter(cat.type)}
            className={`px-3 py-1 rounded-lg font-bold transition-all shrink-0 ${
              selectedCategoryFilter === cat.type 
                ? 'bg-[#0f2b48] text-white shadow-2xs' 
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat.type}
          </button>
        ))}
      </div>

      {/* Evidence Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEvidence.map(item => {
          const typeName = getCanonicalType(item);

          const isVerified = item.verificationStatus === 'verified';
          const isPending = item.verificationStatus === 'pending_verification' || item.verificationStatus === 'needs_clarification';
          const isSelfDeclared = item.verificationStatus === 'self_declared';
          const isExpired = item.verificationStatus === 'expired' || item.verificationStatus === 'rejected';

          return (
            <div 
              key={item.id}
              className="neu-card p-5 bg-white border border-slate-200 hover:border-slate-300 transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                {/* Category Type Badge + Status */}
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-900 border border-blue-200 font-bold text-[10px] rounded-md uppercase tracking-wider">
                    {typeName}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500">
                    Status: <strong className="text-slate-800">{item.docStatus || 'Active / Valid'}</strong>
                  </span>
                </div>

                {/* Evidence Title */}
                <h3 
                  onClick={() => setDetailEvidence(item)}
                  className="text-xs sm:text-sm font-bold text-[#0f2b48] hover:text-[#ea580c] cursor-pointer transition-colors line-clamp-2 leading-snug"
                >
                  {item.title}
                </h3>

                <p className="text-[11px] text-slate-500 line-clamp-2">
                  {item.summary}
                </p>

                {/* Authority & Ref */}
                <div className="p-2.5 bg-slate-50 rounded-lg text-[11px] space-y-1 text-slate-600">
                  <div className="truncate">
                    <span className="text-slate-400">Authority: </span>
                    <strong className="text-slate-800">{item.issuingAuthority}</strong>
                  </div>
                  {item.evidenceSource && (
                    <div className="truncate text-[10px] text-slate-500">
                      <span className="text-slate-400">Source: </span>
                      <span>{item.evidenceSource}</span>
                    </div>
                  )}
                  <div className="truncate font-mono text-[10px] text-slate-500">
                    Ref: {item.documentRef}
                  </div>
                </div>
              </div>

              {/* Card Footer: Uploaded Date + Verification state + View button */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="text-[10px] text-slate-400">
                    Uploaded: <span className="font-semibold text-slate-600">{item.uploadedDate || item.issueDate}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-bold">
                    {isVerified ? (
                      <span className="text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Verified
                      </span>
                    ) : isPending ? (
                      <span className="text-amber-700 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        Pending Verification
                      </span>
                    ) : isSelfDeclared ? (
                      <span className="text-indigo-700 flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-indigo-600" />
                        Self-Declared
                      </span>
                    ) : (
                      <span className="text-rose-700 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                        Expired
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setDetailEvidence(item)}
                    className="px-3 py-1.5 text-xs font-bold text-[#0f2b48] bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-600" />
                    <span>View</span>
                  </button>
                  <button
                    onClick={() => setUploadModalOpen(true)}
                    className="px-2.5 py-1.5 text-xs font-bold text-[#ea580c] hover:bg-orange-50 rounded-lg transition-colors"
                    title="Add another evidence"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* VIEW EVIDENCE MODAL */}
      {detailEvidence && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-900 font-bold text-[10px] rounded-md uppercase">
                  {detailEvidence.evidenceType || 'Technical Benchmark'}
                </span>
                <h3 className="text-base font-black text-[#0f2b48] mt-1">
                  {detailEvidence.title}
                </h3>
              </div>
              <button 
                onClick={() => setDetailEvidence(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5">
                <div>Evidence Source: <strong className="text-slate-900">{detailEvidence.evidenceSource || detailEvidence.issuingAuthority}</strong></div>
                <div>Issuing Authority: <span className="font-semibold text-slate-800">{detailEvidence.issuingAuthority}</span></div>
                <div>Document Reference: <span className="font-mono font-bold text-slate-800">{detailEvidence.documentRef}</span></div>
                <div>Uploaded Date: <span className="text-slate-700 font-medium">{detailEvidence.uploadedDate || detailEvidence.issueDate}</span></div>
                <div>Verification Date: <span className="text-slate-700 font-medium">{detailEvidence.verifiedAt || detailEvidence.verificationDate || (detailEvidence.verificationStatus === 'verified' ? '2025-07-02' : 'Pending Nodal Sign-off')}</span></div>
                <div>Verifier Role: <span className="text-slate-800 font-semibold">{detailEvidence.verifierRole || (detailEvidence.verifiedByGovtDept ? `Official Nodal Assessor, ${detailEvidence.verifiedByGovtDept}` : 'Pending Screening Committee')}</span></div>
                <div>
                  Verification Status: 
                  <span className={`ml-1.5 px-2 py-0.5 font-bold rounded-sm text-[11px] ${
                    detailEvidence.verificationStatus === 'verified' ? 'bg-emerald-100 text-emerald-800' :
                    detailEvidence.verificationStatus === 'self_declared' ? 'bg-indigo-100 text-indigo-800' :
                    detailEvidence.verificationStatus === 'expired' ? 'bg-rose-100 text-rose-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {detailEvidence.verificationStatus === 'verified' ? 'Verified' :
                     detailEvidence.verificationStatus === 'self_declared' ? 'Self-Declared' :
                     detailEvidence.verificationStatus === 'expired' ? 'Expired' : 'Pending Verification'}
                  </span>
                </div>
              </div>

              {detailEvidence.verificationNotes && (
                <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-emerald-950">
                  <div className="font-bold mb-0.5 flex items-center gap-1 text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Nodal Verification Remark:</span>
                  </div>
                  <p className="leading-relaxed">{detailEvidence.verificationNotes}</p>
                  {detailEvidence.verifiedByGovtDept && (
                    <div className="text-[10px] text-emerald-700 mt-1 font-semibold">
                      Verified by: {detailEvidence.verifiedByGovtDept} ({detailEvidence.verifiedAt})
                    </div>
                  )}
                </div>
              )}

              <div>
                <span className="font-bold text-slate-700">Cryptographic SHA-256 Fingerprint:</span>
                <p className="font-mono text-[10px] p-2 bg-slate-100 rounded-lg text-slate-600 break-all select-all mt-1">
                  {detailEvidence.cryptographicHash}
                </p>
              </div>

              <div>
                <span className="font-bold text-slate-700">Technical Scope Summary:</span>
                <p className="mt-1 text-slate-600 leading-relaxed p-2.5 bg-slate-50 rounded-lg">
                  {detailEvidence.summary}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setDetailEvidence(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Close
              </button>
              <button
                onClick={() => {
                  addToast('Verifiable credential receipt downloaded.', 'success');
                  setDetailEvidence(null);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-[#0f2b48] hover:bg-[#16385c] rounded-lg shadow-2xs"
              >
                Download Credential
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD EVIDENCE MODAL */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-[#0f2b48]">
                  Add Evidence to Vault
                </h3>
                <p className="text-xs text-slate-500">Submit third-party test reports, pilot demos, or patents.</p>
              </div>
              <button 
                onClick={() => setUploadModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Evidence Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g., NABL Lab Benchmark on Sub-surface Acoustic Radar"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-hidden focus:ring-1 focus:ring-[#0f2b48]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Evidence Category *
                  </label>
                  <select
                    value={newType}
                    onChange={e => setNewType(e.target.value as EvidenceType)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-hidden bg-white text-slate-700"
                  >
                    <option value="Prototype">Prototype</option>
                    <option value="Technical Benchmark">Technical Benchmark</option>
                    <option value="Certifications">Certifications</option>
                    <option value="Deployments">Deployments</option>
                    <option value="Customer References">Customer References</option>
                    <option value="Security Documentation">Security Documentation</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Sector *
                  </label>
                  <input
                    type="text"
                    required
                    value={newSector}
                    onChange={e => setNewSector(e.target.value)}
                    placeholder="e.g., Water, Civil, AI"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Issuing Authority / Testing Lab *
                </label>
                <input
                  type="text"
                  required
                  value={newAuthority}
                  onChange={e => setNewAuthority(e.target.value)}
                  placeholder="e.g., CSIR-NEERI, IIT Madras, NABL Accredited Lab"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Document Reference / Certificate Number *
                </label>
                <input
                  type="text"
                  required
                  value={newDocRef}
                  onChange={e => setNewDocRef(e.target.value)}
                  placeholder="e.g., NABL/WAT/2026/0129"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Technical Summary
                </label>
                <textarea
                  rows={2}
                  value={newSummary}
                  onChange={e => setNewSummary(e.target.value)}
                  placeholder="Briefly describe what was tested, methodology, and key results..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#ea580c] hover:bg-[#c2410c] rounded-lg shadow-2xs"
                >
                  Save to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
