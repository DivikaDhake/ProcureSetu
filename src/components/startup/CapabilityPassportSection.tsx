import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EvidenceItem, EvidenceType, VerificationStatus } from '../../types';
import { 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileCheck, 
  FileText, 
  Plus, 
  Download, 
  ExternalLink, 
  Layers, 
  MapPin, 
  Cpu, 
  Calendar, 
  Award, 
  Sparkles, 
  Lock, 
  Users, 
  Factory, 
  Globe2, 
  Briefcase, 
  Compass, 
  Info, 
  Check, 
  X, 
  Hash, 
  FileCode,
  Eye,
  ChevronRight,
  TrendingUp,
  History,
  FileCheck2
} from 'lucide-react';

interface Props {
  standalone?: boolean;
}

export const CapabilityPassportSection: React.FC<Props> = ({ standalone = false }) => {
  const { 
    currentStartupProfile, 
    currentUser, 
    evidence, 
    addEvidence, 
    addToast 
  } = useApp();

  // Active perspective toggle: allows demonstrating the core philosophy of a startup with No Govt Experience vs Active Pilot
  const [profileViewMode, setProfileViewMode] = useState<'standard' | 'first_time_startup'>('standard');

  // Selected Evidence for Modal Detail View
  const [selectedEvidenceDetail, setSelectedEvidenceDetail] = useState<EvidenceItem | null>(null);

  // Evidence Filter States
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('All Evidence');
  const [activeStatusFilter, setActiveStatusFilter] = useState<string>('all');

  // Add Evidence Modal State
  const [isAddEvidenceModalOpen, setIsAddEvidenceModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<EvidenceType>('Technical Benchmark');
  const [newAuthority, setNewAuthority] = useState('');
  const [newSource, setNewSource] = useState('');
  const [newDocRef, setNewDocRef] = useState('');
  const [newStatus, setNewStatus] = useState<VerificationStatus>('pending_verification');
  const [newSector, setNewSector] = useState('Water');
  const [newSummary, setNewSummary] = useState('');

  // Current startup evidence
  const startupId = currentStartupProfile?.id || 'startup_1';
  const myEvidence = evidence.filter(e => 
    e.startupId === startupId ||
    e.startupName.toLowerCase().includes(currentUser?.organizationName.toLowerCase() || '')
  );

  // Category list per User Request:
  // Prototype, Technical benchmark, Certifications, Deployments, Customer references, Security documentation
  const REQUIRED_CATEGORIES: { label: string; type: EvidenceType; icon: React.ComponentType<{ className?: string }> }[] = [
    { label: 'Prototype', type: 'Prototype', icon: Sparkles },
    { label: 'Technical Benchmark', type: 'Technical Benchmark', icon: Award },
    { label: 'Certifications', type: 'Certifications', icon: FileCheck },
    { label: 'Deployments', type: 'Deployments', icon: CheckCircle2 },
    { label: 'Customer References', type: 'Customer References', icon: Briefcase },
    { label: 'Security Documentation', type: 'Security Documentation', icon: Lock }
  ];

  // Helper to map category/type
  const getCanonicalCategory = (item: EvidenceItem): string => {
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

  // Status mapping
  const getStatusBadge = (status: VerificationStatus) => {
    switch (status) {
      case 'verified':
        return {
          label: 'Verified',
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
          badgeBg: 'bg-emerald-600 text-white',
          dot: 'bg-emerald-500',
          icon: CheckCircle2
        };
      case 'pending_verification':
      case 'needs_clarification':
        return {
          label: 'Pending Verification',
          bg: 'bg-amber-50 text-amber-800 border-amber-300',
          badgeBg: 'bg-amber-500 text-white',
          dot: 'bg-amber-500',
          icon: Clock
        };
      case 'self_declared':
        return {
          label: 'Self-Declared',
          bg: 'bg-indigo-50 text-indigo-800 border-indigo-300',
          badgeBg: 'bg-indigo-600 text-white',
          dot: 'bg-indigo-500',
          icon: FileText
        };
      case 'expired':
      case 'rejected':
        return {
          label: 'Expired',
          bg: 'bg-rose-50 text-rose-800 border-rose-300',
          badgeBg: 'bg-rose-600 text-white',
          dot: 'bg-rose-500',
          icon: AlertCircle
        };
      default:
        return {
          label: 'Self-Declared',
          bg: 'bg-slate-50 text-slate-800 border-slate-300',
          badgeBg: 'bg-slate-600 text-white',
          dot: 'bg-slate-500',
          icon: FileText
        };
    }
  };

  // Filter evidence
  const filteredEvidence = myEvidence.filter(item => {
    const canonical = getCanonicalCategory(item);
    const matchesCategory = activeCategoryFilter === 'All Evidence' || canonical === activeCategoryFilter;
    
    let matchesStatus = true;
    if (activeStatusFilter === 'verified') matchesStatus = item.verificationStatus === 'verified';
    else if (activeStatusFilter === 'pending') matchesStatus = item.verificationStatus === 'pending_verification';
    else if (activeStatusFilter === 'self_declared') matchesStatus = item.verificationStatus === 'self_declared';
    else if (activeStatusFilter === 'expired') matchesStatus = item.verificationStatus === 'expired';

    return matchesCategory && matchesStatus;
  });

  // Handle Add Evidence Submit
  const handleAddEvidenceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      addToast('Please enter an evidence title.', 'warning');
      return;
    }
    if (!newAuthority.trim()) {
      addToast('Please specify the issuing authority.', 'warning');
      return;
    }
    if (!newDocRef.trim()) {
      addToast('Please provide a document reference or certificate ID.', 'warning');
      return;
    }

    // Map evidenceType to category
    let catKey = 'technical_benchmark';
    if (newType === 'Prototype') catKey = 'prototype';
    else if (newType === 'Certifications') catKey = 'certificate';
    else if (newType === 'Deployments') catKey = 'deployment_evidence';
    else if (newType === 'Customer References') catKey = 'customer_reference';
    else if (newType === 'Security Documentation') catKey = 'security_document';

    const created = addEvidence({
      startupId: currentStartupProfile?.id || 'startup_1',
      startupName: currentStartupProfile?.companyName || currentUser?.organizationName || 'Agastya AquaSens Technologies',
      title: newTitle.trim(),
      category: catKey as any,
      evidenceType: newType,
      issuingAuthority: newAuthority.trim(),
      evidenceSource: newSource.trim() || `${newAuthority.trim()} Official Issuance Register`,
      issueDate: new Date().toISOString().split('T')[0],
      uploadedDate: new Date().toISOString().split('T')[0],
      docStatus: newStatus === 'self_declared' ? 'Self-Declared' : 'Active / Valid',
      documentRef: newDocRef.trim(),
      verificationStatus: newStatus,
      verifierRole: newStatus === 'self_declared' 
        ? 'Self-Declared by Startup Founder (Corporate Seal Uploaded)' 
        : 'Pending Nodal Technical Officer Review',
      summary: newSummary.trim() || 'Verifiable capability artifact submitted to ProcureSetu repository.',
      sector: newSector
    });

    setIsAddEvidenceModalOpen(false);
    setNewTitle('');
    setNewAuthority('');
    setNewSource('');
    setNewDocRef('');
    setNewSummary('');
    addToast(`"${created.title}" added to Capability Passport and Evidence Vault.`, 'success');
  };

  // Profile data snapshot
  const isFirstTimeDemo = profileViewMode === 'first_time_startup';

  const identityData = {
    company: isFirstTimeDemo 
      ? 'Agastya DeepTech Solutions Pvt Ltd' 
      : (currentStartupProfile?.companyName || 'Agastya AquaSens Technologies Pvt Ltd'),
    registration: isFirstTimeDemo 
      ? 'U72900KA2024PTC192801' 
      : (currentStartupProfile?.registrationNumber || 'U74999KA2022PTC158902'),
    dpiit: isFirstTimeDemo 
      ? 'DIPP-104892-IN (Recognized DPIIT Startup)' 
      : (currentStartupProfile?.dpiitNumber || 'DIPP-89421-IN'),
    founded: isFirstTimeDemo ? 2024 : (currentStartupProfile?.foundedYear || 2022),
    location: isFirstTimeDemo ? 'Bengaluru, Karnataka' : (currentStartupProfile?.headquarters || 'Bengaluru, Karnataka')
  };

  const capabilitiesData = {
    technicalDomains: currentStartupProfile?.technicalDomains || [
      'Optoelectronics & Micro-Spectrophotometry',
      'Edge Computing & Embedded Firmware',
      'Environmental IoT Telemetry',
      'Reagentless Microfluidics',
      'Low-Power LoRaWAN & Cellular Radios'
    ],
    industryDomains: currentStartupProfile?.industryDomains || [
      'Water & Sanitation (Jal Jeevan Mission)',
      'Public Health Engineering',
      'Smart Municipal Water Grids',
      'Industrial Effluent Compliance'
    ],
    products: currentStartupProfile?.productsList || [
      {
        name: 'JalRakshak-200',
        description: 'Autonomous Inline Arsenic (As III / V) Continuous Optical Analyzer with Solar MPPT & Cellular Gateway',
        trlLevel: 7,
        status: 'Field Proven / Pilot Ready'
      },
      {
        name: 'AquaSense-Node Mini',
        description: 'Multi-parameter In-situ Potable Water Sensor (pH, Fluoride, Turbidity, Residual Free Chlorine)',
        trlLevel: 6,
        status: 'Lab Bench Validated'
      }
    ],
    technologies: currentStartupProfile?.technologiesList || [
      'Direct UV-VIS Spectrophotometry',
      'LoRaWAN 865-867 MHz (Indian ISM Band)',
      '4G Cat-M1 / NB-IoT with e-SIM Fallback',
      'Micro-Cavity Fluidic Cells',
      'Ultra Low Power ARM Cortex-M4 Microcontroller',
      'AES-256 / SHA-256 Hardware Secure Element'
    ]
  };

  const executionData = {
    teamSize: currentStartupProfile?.teamSize || '18 Engineers & Scientists (11 R&D Specialists, 4 Field Engineers, 3 Regulatory Leads)',
    relevantExpertise: currentStartupProfile?.relevantExpertise || [
      'Optoelectronics & Sensor Physics (PhD, IISc Bangalore)',
      'High-Reliability Embedded Firmware Architecture (10+ yrs Aerospace/Defence)',
      'Public Water Grid Operations & NABL Chemical Testing Protocols',
      'GFR Rule 173(i) & GeM Startup Procurement Governance'
    ],
    manufacturingCapability: currentStartupProfile?.manufacturingDeploymentCapability || 
      'In-house precision assembly facility in Peenya Industrial Area, Bengaluru (Capacity: 80 units/month) with ESD-safe cleanroom environment, partnered with ISO 9001 certified electronics EMS for multi-layer PCB production.',
    geographicCapability: currentStartupProfile?.geographicCapability || 
      'Pan-India field deployment capability with active regional service hubs in Bengaluru (South), New Delhi (North), Kolkata (East), and Mumbai (West).'
  };

  const experienceData = {
    governmentDeployments: isFirstTimeDemo ? [] : (currentStartupProfile?.governmentDeploymentsList || [
      {
        client: 'Department of Drinking Water & Sanitation (Jal Jeevan Mission)',
        project: 'Chengalpattu District 12-Gram Panchayat Arsenic Telemetry Pilot',
        year: '2025',
        value: '₹37 Lakhs',
        verified: true
      }
    ]),
    privateDeployments: currentStartupProfile?.privateDeploymentsList || [
      {
        client: 'Tata Steel Utilities & Infrastructure Services Ltd',
        project: 'Industrial Effluent Heavy Metal Discharge Monitoring (Jamshedpur)',
        year: '2024',
        value: '₹24 Lakhs',
        verified: true
      },
      {
        client: 'Dr. Reddy’s Laboratories Bio-Environment Cell',
        project: 'Continuous Rinse Water Trace Contaminant Assay',
        year: '2024',
        value: '₹19 Lakhs',
        verified: true
      }
    ],
    domainExperience: currentStartupProfile?.domainExperienceSummary || 
      '4+ continuous years in trace spectroscopic contaminant detection; over 18,000 operational hours of field telemetry streaming across rural water infrastructure without optical baseline drift.'
  };

  return (
    <div className="space-y-6">
      {/* ================= PAGE HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#0f2b48] text-white rounded-xl shadow-xs">
              <Compass className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-[#0f2b48] tracking-tight">
                Capability Passport
              </h1>
              <p className="text-sm font-medium text-slate-600 mt-0.5">
                An evidence-backed profile of what your organization can demonstrate.
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* View Perspective Switcher */}
          <div className="inline-flex p-1 bg-slate-200/80 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setProfileViewMode('standard')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                profileViewMode === 'standard' 
                  ? 'bg-white text-[#0f2b48] shadow-xs font-bold' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Standard Profile
            </button>
            <button
              onClick={() => setProfileViewMode('first_time_startup')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                profileViewMode === 'first_time_startup' 
                  ? 'bg-white text-[#ea580c] shadow-xs font-bold' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Demonstrate ProcureSetu philosophy for a first-time startup without prior government tenders"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#ea580c]" />
              <span>Zero-Govt-Exp Startup View</span>
            </button>
          </div>

          {/* Add Evidence Primary Button */}
          <button
            onClick={() => setIsAddEvidenceModalOpen(true)}
            className="px-4 py-2 text-xs font-bold text-white bg-[#ea580c] hover:bg-[#c2410c] rounded-xl shadow-xs flex items-center gap-1.5 transition-all hover:shadow-md cursor-pointer active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Add Evidence</span>
          </button>

          <button
            onClick={() => addToast('Official ProcureSetu Capability Passport Dossier exported as signed PDF.', 'success')}
            className="px-3.5 py-2 text-xs font-bold text-[#0f2b48] bg-white border border-slate-300 rounded-xl hover:bg-slate-50 flex items-center gap-1.5 shadow-2xs transition-all"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Dossier</span>
          </button>
        </div>
      </div>

      {/* ================= CORE PHILOSOPHY CALLOUT ================= */}
      {/* IMPORTANT: A new startup should NOT be visually punished for having no government experience. */}
      {/* Display: "Government Experience: No previous verified deployment" alongside "Technical Capability: Demonstrated" */}
      <div className="p-5 bg-gradient-to-br from-slate-900 via-[#0f2b48] to-[#163a5f] text-white rounded-2xl shadow-md border border-slate-800 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-orange-500/20 text-orange-300 border border-orange-400/30 rounded-md text-[10px] font-black uppercase tracking-wider">
                ProcureSetu Statutory Principle
              </span>
              <span className="text-xs text-slate-300 font-medium">
                GFR Rule 173(i) & Public Procurement (Preference to Make in India)
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white">
              Evidence-First Technical Merit over Prior Bureaucratic History
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              ProcureSetu rejects arbitrary turnover hurdles and generic scores. Startups are evaluated solely through verifiable technical evidence, testbed benchmarks, and operational demonstration.
            </p>
          </div>

          {/* DUAL DISPLAY OF THE SPECIFIED PHILOSOPHY */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0 bg-white/10 p-2 rounded-xl border border-white/15 backdrop-blur-xs">
            {/* Government Experience badge */}
            <div className="px-3.5 py-2 rounded-lg bg-slate-800/80 border border-slate-600/70 text-left">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Experience Record
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-200 mt-0.5 flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>
                  {isFirstTimeDemo || experienceData.governmentDeployments.length === 0
                    ? 'Government Experience: No previous verified deployment'
                    : 'Government Experience: 1 Verified Deployment (JJM Pilot)'}
                </span>
              </div>
            </div>

            {/* Technical Capability badge (Solid, Prominent, Demonstrated) */}
            <div className="px-3.5 py-2 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-left">
              <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                Technical Benchmark
              </div>
              <div className="text-xs sm:text-sm font-black text-emerald-300 mt-0.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Technical Capability: Demonstrated</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footnote on non-punitive evaluation */}
        <div className="pt-3 border-t border-white/10 flex items-center gap-2 text-[11px] text-slate-300">
          <Info className="w-3.5 h-3.5 text-orange-400 shrink-0" />
          <span>
            {isFirstTimeDemo 
              ? 'This startup has 0 previous government billing. Under ProcureSetu, this profile receives 100% eligibility for GFR Rule 194 challenges and GeM custom startup tenders with zero penalty.' 
              : 'Evaluation committees view verified testbed benchmarks and peer endorsements. Lack of legacy vendor incumbency is not an evaluation penalty.'}
          </span>
        </div>
      </div>

      {/* ================= SECTION 1: IDENTITY ================= */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-2 h-5 bg-[#0f2b48] rounded-full"></span>
            <h2 className="text-base font-black text-[#0f2b48] uppercase tracking-wider">
              1. Identity
            </h2>
          </div>
          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>DPIIT & MCA Verified</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Company */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Company</span>
            </div>
            <div className="font-bold text-slate-900 text-sm">
              {identityData.company}
            </div>
            <div className="text-[11px] text-slate-500">
              Private Limited Entity
            </div>
          </div>

          {/* Registration */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <FileCode className="w-3.5 h-3.5 text-slate-400" />
              <span>Registration</span>
            </div>
            <div className="font-mono font-bold text-slate-900 text-xs sm:text-sm">
              {identityData.registration}
            </div>
            <div className="text-[11px] text-slate-500">
              CIN / RoC Registrar of Companies
            </div>
          </div>

          {/* DPIIT Recognition */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-[#ea580c]" />
              <span>DPIIT Recognition</span>
            </div>
            <div className="font-bold text-[#ea580c] text-sm">
              {identityData.dpiit}
            </div>
            <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
              <Check className="w-3 h-3" />
              GFR 173(i) Turnover-Exempt
            </div>
          </div>

          {/* Founded */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Founded</span>
            </div>
            <div className="font-bold text-slate-900 text-sm">
              Year {identityData.founded}
            </div>
            <div className="text-[11px] text-slate-500">
              Active Startup Age: {new Date().getFullYear() - identityData.founded} yrs
            </div>
          </div>

          {/* Location */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>Location</span>
            </div>
            <div className="font-bold text-slate-900 text-sm">
              {identityData.location}
            </div>
            <div className="text-[11px] text-slate-500">
              State: Karnataka, India
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 2: CAPABILITIES ================= */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-2 h-5 bg-[#0f2b48] rounded-full"></span>
            <h2 className="text-base font-black text-[#0f2b48] uppercase tracking-wider">
              2. Capabilities
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Core domains, functional products, and proprietary technologies
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Technical Domains */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
            <div className="text-xs font-black text-[#0f2b48] uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#ea580c]" />
              <span>Technical Domains</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {capabilitiesData.technicalDomains.map((domain, idx) => (
                <span 
                  key={idx}
                  className="px-3 py-1 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 shadow-2xs"
                >
                  {domain}
                </span>
              ))}
            </div>
          </div>

          {/* Industry Domains */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
            <div className="text-xs font-black text-[#0f2b48] uppercase tracking-wider flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-[#0f2b48]" />
              <span>Industry Domains</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {capabilitiesData.industryDomains.map((ind, idx) => (
                <span 
                  key={idx}
                  className="px-3 py-1 bg-blue-50 border border-blue-200 rounded-lg text-xs font-semibold text-blue-900"
                >
                  {ind}
                </span>
              ))}
            </div>
          </div>

          {/* Products */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 md:col-span-2">
            <div className="text-xs font-black text-[#0f2b48] uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#ea580c]" />
              <span>Products</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {capabilitiesData.products.map((prod, idx) => (
                <div key={idx} className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-900 text-sm">{prod.name}</span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md">
                      TRL {prod.trlLevel || 7} · {prod.status || 'Active'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {prod.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Technologies */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5 md:col-span-2">
            <div className="text-xs font-black text-[#0f2b48] uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-slate-600" />
              <span>Technologies</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {capabilitiesData.technologies.map((tech, idx) => (
                <span 
                  key={idx}
                  className="px-2.5 py-1 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-700 font-mono"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 3: EVIDENCE & VERIFICATION ================= */}
      {/* Covers: Prototype, Technical benchmark, Certifications, Deployments, Customer references, Security documentation */}
      {/* Verification: Verified, Pending Verification, Self-Declared, Expired */}
      {/* Each item clickable with: evidence source, uploaded date, verification date, verifier role, status */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-5 bg-[#0f2b48] rounded-full"></span>
              <h2 className="text-base font-black text-[#0f2b48] uppercase tracking-wider">
                3. Evidence & Verification
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Click any evidence artifact to inspect institutional source, audit verification date, and verifier credentials.
            </p>
          </div>

          <button
            onClick={() => setIsAddEvidenceModalOpen(true)}
            className="px-3 py-1.5 text-xs font-bold text-white bg-[#ea580c] hover:bg-[#c2410c] rounded-lg shadow-2xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Evidence</span>
          </button>
        </div>

        {/* Category Filter Pills (6 Categories per prompt) */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <button
            onClick={() => setActiveCategoryFilter('All Evidence')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeCategoryFilter === 'All Evidence'
                ? 'bg-[#0f2b48] text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            All Categories ({myEvidence.length})
          </button>
          {REQUIRED_CATEGORIES.map(cat => {
            const count = myEvidence.filter(e => getCanonicalCategory(e) === cat.label).length;
            const Icon = cat.icon;
            return (
              <button
                key={cat.label}
                onClick={() => setActiveCategoryFilter(cat.label)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                  activeCategoryFilter === cat.label
                    ? 'bg-[#0f2b48] text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5 text-slate-400" />
                <span>{cat.label}</span>
                <span className="text-[10px] px-1.5 py-0.2 bg-white/20 rounded-full font-mono">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Verification Status Sub-Filter */}
        <div className="flex items-center gap-2 text-xs pt-1 border-t border-slate-100">
          <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
            Verification Status:
          </span>
          <div className="flex flex-wrap gap-1">
            {[
              { id: 'all', label: 'All Statuses' },
              { id: 'verified', label: 'Verified' },
              { id: 'pending', label: 'Pending Verification' },
              { id: 'self_declared', label: 'Self-Declared' },
              { id: 'expired', label: 'Expired' }
            ].map(st => (
              <button
                key={st.id}
                onClick={() => setActiveStatusFilter(st.id)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                  activeStatusFilter === st.id
                    ? 'bg-slate-800 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Evidence Grid: CLICKABLE CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
          {filteredEvidence.map(item => {
            const canonicalCat = getCanonicalCategory(item);
            const statusConfig = getStatusBadge(item.verificationStatus);
            const StatusIcon = statusConfig.icon;

            return (
              <div
                key={item.id}
                onClick={() => setSelectedEvidenceDetail(item)}
                className="group relative p-4 bg-slate-50 hover:bg-white border border-slate-200 hover:border-[#ea580c]/50 rounded-xl transition-all shadow-2xs hover:shadow-md cursor-pointer flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2.5">
                  {/* Category & Status Header */}
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2 py-0.5 bg-blue-100/80 text-blue-900 text-[10px] font-extrabold uppercase rounded tracking-wider">
                      {canonicalCat}
                    </span>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border flex items-center gap-1 ${statusConfig.bg}`}>
                      <StatusIcon className="w-3 h-3 shrink-0" />
                      <span>{statusConfig.label}</span>
                    </span>
                  </div>

                  {/* Title */}
                  <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm line-clamp-2 group-hover:text-[#0f2b48]">
                    {item.title}
                  </h4>

                  {/* Issuing Authority & Source */}
                  <div className="space-y-1 text-[11px] text-slate-600">
                    <div>
                      <span className="text-slate-400 font-semibold">Authority:</span>{' '}
                      <span className="font-bold text-slate-800">{item.issuingAuthority}</span>
                    </div>
                    {item.evidenceSource && (
                      <div className="truncate">
                        <span className="text-slate-400 font-semibold">Source:</span>{' '}
                        <span className="text-slate-700">{item.evidenceSource}</span>
                      </div>
                    )}
                  </div>

                  {/* Brief summary */}
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                {/* Metadata Footer: Uploaded, Verification date, Click to View */}
                <div className="pt-2.5 border-t border-slate-200/80 flex items-center justify-between text-[10px] text-slate-500">
                  <div className="flex items-center gap-2">
                    <span>Uploaded: <strong className="text-slate-700">{item.uploadedDate || item.issueDate}</strong></span>
                    {item.verifiedAt && (
                      <span className="text-emerald-700 font-semibold">
                        · Verified: {item.verifiedAt}
                      </span>
                    )}
                  </div>
                  <span className="font-bold text-[#ea580c] flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                    <span>Inspect</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {filteredEvidence.length === 0 && (
          <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-xl space-y-2">
            <Info className="w-8 h-8 text-slate-400 mx-auto" />
            <div className="font-bold text-slate-700 text-sm">No evidence items matching this filter</div>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You can upload new prototype testbeds, NABL certifications, or customer references anytime.
            </p>
            <button
              onClick={() => setIsAddEvidenceModalOpen(true)}
              className="mt-2 px-3 py-1.5 text-xs font-bold text-white bg-[#0f2b48] rounded-lg"
            >
              Add New Evidence
            </button>
          </div>
        )}
      </section>

      {/* ================= SECTION 4: EXECUTION ================= */}
      {/* Team size, Relevant expertise, Manufacturing/deployment capability, Geographic capability */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-2 h-5 bg-[#0f2b48] rounded-full"></span>
            <h2 className="text-base font-black text-[#0f2b48] uppercase tracking-wider">
              4. Execution
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Operational and manufacturing readiness for mission-scale delivery
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Team Size */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
            <div className="text-[11px] font-black text-[#0f2b48] uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#ea580c]" />
              <span>Team Size</span>
            </div>
            <div className="font-bold text-slate-900 text-sm">
              {executionData.teamSize}
            </div>
            <p className="text-slate-600 text-[11px]">
              Core team consists of optical physicists, embedded engineers, and field deployment specialists.
            </p>
          </div>

          {/* Geographic Capability */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
            <div className="text-[11px] font-black text-[#0f2b48] uppercase tracking-wider flex items-center gap-1.5">
              <Globe2 className="w-4 h-4 text-[#0f2b48]" />
              <span>Geographic Capability</span>
            </div>
            <div className="font-bold text-slate-900 text-sm">
              Pan-India Regional Operations
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              {executionData.geographicCapability}
            </p>
          </div>

          {/* Relevant Expertise */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 md:col-span-2">
            <div className="text-[11px] font-black text-[#0f2b48] uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-slate-700" />
              <span>Relevant Expertise</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {executionData.relevantExpertise.map((exp, idx) => (
                <div key={idx} className="flex items-start gap-2 p-2 bg-white rounded-lg border border-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-slate-800 font-medium">{exp}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Manufacturing / Deployment Capability */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 md:col-span-2">
            <div className="text-[11px] font-black text-[#0f2b48] uppercase tracking-wider flex items-center gap-1.5">
              <Factory className="w-4 h-4 text-[#ea580c]" />
              <span>Manufacturing / Deployment Capability</span>
            </div>
            <p className="text-slate-800 font-semibold text-xs leading-relaxed">
              {executionData.manufacturingCapability}
            </p>
          </div>
        </div>
      </section>

      {/* ================= SECTION 5: EXPERIENCE ================= */}
      {/* Government deployments, Private deployments, Domain experience */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-2 h-5 bg-[#0f2b48] rounded-full"></span>
            <h2 className="text-base font-black text-[#0f2b48] uppercase tracking-wider">
              5. Experience
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Field deployment track record and verified reference deployments
          </span>
        </div>

        <div className="space-y-4">
          {/* Government Deployments */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-black text-[#0f2b48] uppercase tracking-wider flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#0f2b48]" />
                <span>Government Deployments</span>
              </div>
              <span className="text-[11px] font-bold text-slate-500">
                {experienceData.governmentDeployments.length} on file
              </span>
            </div>

            {experienceData.governmentDeployments.length === 0 ? (
              <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded">
                    First-Time Innovator
                  </span>
                  <span className="text-xs font-bold text-slate-800">
                    Government Experience: No previous verified deployment
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Under ProcureSetu policy and GFR Rule 173(i), this does not penalize technical scoring. Innovative startups can qualify based on bench test evidence and pilot challenge performance.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {experienceData.governmentDeployments.map((gov, idx) => (
                  <div key={idx} className="p-3 bg-white border border-slate-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div>
                      <div className="font-bold text-slate-900">{gov.project}</div>
                      <div className="text-[11px] text-slate-600 mt-0.5">
                        Client: <strong className="text-slate-800">{gov.client}</strong> · Year {gov.year}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {gov.value && (
                        <span className="px-2.5 py-1 bg-slate-100 rounded text-slate-700 font-bold text-[11px]">
                          {gov.value}
                        </span>
                      )}
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px] flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified Pilot
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Private Deployments */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-black text-[#0f2b48] uppercase tracking-wider flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#ea580c]" />
                <span>Private Deployments</span>
              </div>
              <span className="text-[11px] font-bold text-slate-500">
                {experienceData.privateDeployments.length} on file
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {experienceData.privateDeployments.map((pvt, idx) => (
                <div key={idx} className="p-3 bg-white border border-slate-200 rounded-lg space-y-1 text-xs">
                  <div className="font-bold text-slate-900">{pvt.client}</div>
                  <div className="text-slate-600 text-[11px]">{pvt.project}</div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px] text-slate-500 font-medium">
                    <span>Year: {pvt.year}</span>
                    <span className="font-bold text-slate-700">{pvt.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Domain Experience */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs">
            <div className="text-[11px] font-black text-[#0f2b48] uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>Domain Experience</span>
            </div>
            <p className="font-semibold text-slate-800 leading-relaxed">
              {experienceData.domainExperience}
            </p>
          </div>
        </div>
      </section>

      {/* ================= MODAL: CLICKABLE EVIDENCE DETAIL ================= */}
      {/* Show: evidence source, uploaded date, verification date, verifier role, status */}
      {selectedEvidenceDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#0f2b48] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-orange-400" />
                <span className="text-sm font-black uppercase tracking-wider">
                  Verifiable Evidence Audit Card
                </span>
              </div>
              <button 
                onClick={() => setSelectedEvidenceDetail(null)}
                className="p-1 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
              {/* Title & Status */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 bg-blue-100 text-blue-900 text-xs font-bold rounded">
                    {getCanonicalCategory(selectedEvidenceDetail)}
                  </span>

                  {(() => {
                    const st = getStatusBadge(selectedEvidenceDetail.verificationStatus);
                    const StIcon = st.icon;
                    return (
                      <span className={`px-2.5 py-0.5 rounded text-xs font-bold border flex items-center gap-1.5 ${st.bg}`}>
                        <StIcon className="w-3.5 h-3.5" />
                        <span>Status: {st.label}</span>
                      </span>
                    );
                  })()}
                </div>

                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  {selectedEvidenceDetail.title}
                </h3>
              </div>

              {/* 5 SPECIFIED FIELDS TABLE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                {/* 1. Evidence Source */}
                <div className="space-y-0.5 sm:col-span-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Evidence Source
                  </div>
                  <div className="font-bold text-slate-900 text-sm">
                    {selectedEvidenceDetail.evidenceSource || selectedEvidenceDetail.issuingAuthority}
                  </div>
                </div>

                {/* 2. Uploaded Date */}
                <div className="space-y-0.5">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Uploaded Date
                  </div>
                  <div className="font-bold text-slate-800 text-xs">
                    {selectedEvidenceDetail.uploadedDate || selectedEvidenceDetail.issueDate || '2025-06-20'}
                  </div>
                </div>

                {/* 3. Verification Date */}
                <div className="space-y-0.5">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Verification Date
                  </div>
                  <div className="font-bold text-emerald-800 text-xs">
                    {selectedEvidenceDetail.verifiedAt || selectedEvidenceDetail.verificationDate || (
                      selectedEvidenceDetail.verificationStatus === 'verified' ? '2025-07-02' : 'Pending Verification Review'
                    )}
                  </div>
                </div>

                {/* 4. Verifier Role */}
                <div className="space-y-0.5 sm:col-span-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Verifier Role & Department
                  </div>
                  <div className="font-semibold text-slate-900 text-xs">
                    {selectedEvidenceDetail.verifierRole || 
                      (selectedEvidenceDetail.verifiedByGovtDept 
                        ? `Official Nodal Assessor, ${selectedEvidenceDetail.verifiedByGovtDept}` 
                        : 'Self-Declared / Pending Third-Party Screening Committee Review')}
                  </div>
                </div>

                {/* 5. Status Details */}
                <div className="space-y-0.5 sm:col-span-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Verification Note / Audit Protocol
                  </div>
                  <div className="text-slate-700 text-xs leading-relaxed">
                    {selectedEvidenceDetail.verificationNotes || 
                      'Standard procedural ingest completed. Cryptographic checksum logged on tamper-proof audit trail.'}
                  </div>
                </div>
              </div>

              {/* Document Reference & Hash */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-3 bg-slate-100 rounded-lg font-mono">
                  <span className="text-slate-500 text-[11px]">Document Ref / Cert No:</span>
                  <span className="font-bold text-slate-900">{selectedEvidenceDetail.documentRef}</span>
                </div>

                <div className="p-3 bg-slate-900 text-emerald-400 rounded-lg font-mono text-[10px] break-all space-y-1">
                  <div className="text-slate-400 uppercase font-bold text-[9px] flex items-center gap-1">
                    <Hash className="w-3 h-3 text-slate-400" />
                    <span>SHA-256 Cryptographic Audit Hash:</span>
                  </div>
                  <div>{selectedEvidenceDetail.cryptographicHash}</div>
                </div>
              </div>

              {/* Technical Summary */}
              <div className="space-y-1 text-xs">
                <div className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                  Technical Claim & Scope
                </div>
                <p className="text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed">
                  {selectedEvidenceDetail.summary}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">
                ProcureSetu Audit Vault Item #{selectedEvidenceDetail.id}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    addToast(`Downloaded certificate dossier for ${selectedEvidenceDetail.title}`, 'success');
                  }}
                  className="px-3.5 py-1.5 text-xs font-bold text-[#0f2b48] bg-white border border-slate-300 rounded-lg hover:bg-slate-100 flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Artifact</span>
                </button>
                <button
                  onClick={() => setSelectedEvidenceDetail(null)}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-[#0f2b48] rounded-lg hover:bg-slate-800"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD EVIDENCE ================= */}
      {/* Functional modal adding evidence which appears in both Capability Passport and Evidence Vault */}
      {isAddEvidenceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="px-6 py-4 bg-[#0f2b48] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-orange-400" />
                <h3 className="text-sm font-black uppercase tracking-wider">
                  Add Evidence to Capability Passport
                </h3>
              </div>
              <button 
                onClick={() => setIsAddEvidenceModalOpen(false)}
                className="p-1 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAddEvidenceSubmit} className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  Artifacts added here immediately synchronize with your <strong>Capability Passport</strong> and <strong>Evidence Vault</strong>. Cryptographic hash signatures are generated on submit.
                </p>
              </div>

              {/* Evidence Category / Type */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                  Evidence Category *
                </label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as EvidenceType)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-semibold focus:ring-2 focus:ring-[#ea580c] focus:outline-hidden"
                >
                  <option value="Prototype">Prototype (Bench trial, physical mock, telemetry demo)</option>
                  <option value="Technical Benchmark">Technical Benchmark (NABL test report, lab validation)</option>
                  <option value="Certifications">Certifications (Patents, ISO, BIS compliance)</option>
                  <option value="Deployments">Deployments (Field pilot logs, site handover sign-offs)</option>
                  <option value="Customer References">Customer References (Institutional endorsement letter)</option>
                  <option value="Security Documentation">Security Documentation (CERT-In audit, VAPT report)</option>
                </select>
              </div>

              {/* Title */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                  Artifact Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NABL Test Report for Water Arsenic Detection Accuracy"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-[#ea580c] focus:outline-hidden"
                />
              </div>

              {/* Two columns: Authority & Source */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                    Issuing Authority *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CSIR-NEERI / IIT Madras / IPO"
                    value={newAuthority}
                    onChange={(e) => setNewAuthority(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-[#ea580c] focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                    Evidence Source
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Direct Lab Portal / Official Gazette"
                    value={newSource}
                    onChange={(e) => setNewSource(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-[#ea580c] focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Two columns: Doc Ref & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                    Document Reference Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. NABL/WAT-2026/0921"
                    value={newDocRef}
                    onChange={(e) => setNewDocRef(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium font-mono focus:ring-2 focus:ring-[#ea580c] focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                    Initial Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as VerificationStatus)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-semibold focus:ring-2 focus:ring-[#ea580c] focus:outline-hidden"
                  >
                    <option value="pending_verification">Pending Verification (Awaiting Govt Review)</option>
                    <option value="self_declared">Self-Declared (Founders Declaration)</option>
                  </select>
                </div>
              </div>

              {/* Technical Summary */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                  Technical Scope & Verification Claim
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the test protocol, measurement resolution, environment conditions, and accuracy results..."
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-[#ea580c] focus:outline-hidden"
                />
              </div>

              {/* Form Buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddEvidenceModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold shadow-xs cursor-pointer"
                >
                  Add Evidence
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
