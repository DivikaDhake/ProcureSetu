import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Opportunity, EvidenceItem, EvidenceType } from '../../types';
import { 
  Building2, 
  CheckCircle2, 
  ChevronRight, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  AlertCircle, 
  FileCheck2, 
  Eye, 
  ShieldCheck, 
  Plus, 
  X, 
  Calendar, 
  DollarSign, 
  Users, 
  Target, 
  Lock, 
  FileText, 
  Check, 
  Clock, 
  Layers, 
  Award,
  Trash2,
  HelpCircle,
  Briefcase,
  Zap,
  Info
} from 'lucide-react';

interface Props {
  opportunity: Opportunity;
  onClose: () => void;
  onSuccess?: () => void;
}

interface MilestoneProposalItem {
  id: string;
  title: string;
  description: string;
  amount: string;
  dueDate: string;
}

export const ApplyOpportunityModal: React.FC<Props> = ({ opportunity, onClose, onSuccess }) => {
  const { 
    currentUser, 
    currentStartupProfile, 
    evidence, 
    addEvidence, 
    submitApplication, 
    setActiveTab, 
    addToast 
  } = useApp();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState<boolean>(false);
  const [createdAppId, setCreatedAppId] = useState<string>('');

  // ---------------------------------------------------------------------------
  // STEP 1: CONFIRM STARTUP PROFILE
  // ---------------------------------------------------------------------------
  const [companyName, setCompanyName] = useState(
    currentStartupProfile?.companyName || currentUser?.organizationName || 'Agastya AquaSens Technologies Private Limited'
  );
  const [founderName, setFounderName] = useState(
    currentStartupProfile?.founderName || currentUser?.name || 'Dr. Vikramaditya Sen'
  );
  const [officialEmail, setOfficialEmail] = useState(
    currentUser?.email || 'contact@aquasens.tech'
  );
  const [mobileNumber, setMobileNumber] = useState(
    currentUser?.phone || '+91 98450 12345'
  );
  const [dpiitNumber, setDpiitNumber] = useState(
    currentStartupProfile?.dpiitNumber || 'DIPP-89421-IN'
  );
  const [stage, setStage] = useState(
    currentStartupProfile?.stage || 'Commercialization & Field Pilots'
  );
  const [primarySector, setPrimarySector] = useState(
    currentStartupProfile?.primarySector || opportunity.sector || 'Water Infrastructure'
  );
  const [headquartersCity, setHeadquartersCity] = useState(
    currentStartupProfile?.headquartersCity || 'Bengaluru'
  );
  const [state, setState] = useState(
    currentStartupProfile?.state || 'Karnataka'
  );
  const [teamSize, setTeamSize] = useState(
    currentStartupProfile?.teamSize || '18 Engineers & Scientists'
  );
  const [profileConfirmed, setProfileConfirmed] = useState<boolean>(true);

  // ---------------------------------------------------------------------------
  // STEP 2: SOLUTION OVERVIEW
  // ---------------------------------------------------------------------------
  const [solutionName, setSolutionName] = useState(
    `AquaSens Edge: Real-Time Acoustic Subsurface Leak Pinpointing & Micro-Pressure Management System`
  );
  const [problemUnderstanding, setProblemUnderstanding] = useState(
    `Our engineering analysis of ${opportunity.departmentName}'s mandate indicates that legacy manual acoustic listening sticks and post-facto billing audits suffer from a 48-72 hour reporting lag, leading to severe Non-Revenue Water (NRW) loss and sinkhole hazards. The primary operational pain point is pinpointing micro-fissures in subsurface cast-iron and HDPE pipelines before catastrophic pipe blowouts occur.`
  );
  const [proposedApproach, setProposedApproach] = useState(
    `We deploy high-frequency non-intrusive piezoelectric acoustic transducers and hydrostatic pressure sensors clamped at 300-meter intervals along municipal trunk and feeder lines. Sensor nodes perform edge Fourier signal transform to isolate cavitation frequencies and stream encrypted alerts via LoRaWAN/NB-IoT to a geospatial GIS dashboard.`
  );
  const [expectedImpact, setExpectedImpact] = useState(
    `1. Detect and localize subsurface pipeline leaks within 2.5 meters radial accuracy within 20 minutes of occurrence.\n2. Reduce physical municipal distribution water loss by 38% to 45% across the designated ward zone.\n3. Eliminate manual leak inspection patrols, generating an estimated ₹1.8 Cr annual utility savings.`
  );
  const [deploymentRequirements, setDeploymentRequirements] = useState(
    `1. Right-of-Way (RoW) access to 14 municipal pump stations and valve chambers for sensor bracket mounting.\n2. Shapefile/GIS vector layout of the north distribution water pipeline network.\n3. Liaison officer from ${opportunity.departmentName} for telemetry bridge authorization and weekly pilot review.`
  );
  const [trlProposed, setTrlProposed] = useState<number>(Math.max(6, opportunity.trlRequired || 6));

  // ---------------------------------------------------------------------------
  // STEP 3: CAPABILITY EVIDENCE
  // ---------------------------------------------------------------------------
  const startupEvidenceList = evidence.filter(e => 
    e.startupId === (currentStartupProfile?.id || 'startup_1') ||
    e.startupName.toLowerCase().includes((currentStartupProfile?.companyName || currentUser?.organizationName || 'Agastya').toLowerCase())
  );

  // Select first 2-3 evidence items by default
  const [selectedEvidenceIds, setSelectedEvidenceIds] = useState<string[]>(
    startupEvidenceList.slice(0, 3).map(e => e.id)
  );

  // Add New Evidence Form Drawer
  const [showAddEvidenceForm, setShowAddEvidenceForm] = useState<boolean>(false);
  const [newEvidenceTitle, setNewEvidenceTitle] = useState('');
  const [newEvidenceType, setNewEvidenceType] = useState<EvidenceType>('Technical Benchmark');
  const [newEvidenceAuthority, setNewEvidenceAuthority] = useState('IIT Madras Hydrodynamics Test Laboratory');
  const [newEvidenceDocRef, setNewEvidenceDocRef] = useState(`NABL/HYD/2026-${Math.floor(100 + Math.random() * 900)}`);
  const [newEvidenceSummary, setNewEvidenceSummary] = useState('Certified bench test demonstrating 99.2% acoustic precision in locating micro-fractures under pressurized flow.');

  // ---------------------------------------------------------------------------
  // STEP 4: EXECUTION
  // ---------------------------------------------------------------------------
  const [executionTeam, setExecutionTeam] = useState(
    `Project Lead: Dr. V. Sen (PhD Fluid Dynamics, 14 yrs experience)\nEmbedded Hardware Lead: R. Kulkarni (MTech Embedded Systems, ex-ISRO)\nFirmware & Cloud Telemetry: P. Menon (8 yrs IoT Cloud Security)\nField Deployment Technicians: 4 certified pipeline hydro-technicians.`
  );
  const [executionTimeline, setExecutionTimeline] = useState(
    `Phase 1 (Weeks 1-3): Site survey, GIS mapping, and non-intrusive sensor installation at 14 valve stations.\nPhase 2 (Weeks 4-8): Telemetry calibration, noise threshold tuning, and baseline SCADA integration.\nPhase 3 (Weeks 9-12): Live operational pilot, simulated burst injection tests, and municipal handover report.`
  );
  const [executionInfrastructure, setExecutionInfrastructure] = useState(
    `Dedicated lab staging facility at Bengaluru, portable ultrasonic flow-rate calibrators, 28 ruggedized IP68 acoustic clamp nodes, local sovereign cloud hosting on MeitY-empanelled data center with AES-256 telemetry encryption.`
  );
  const [executionDependencies, setExecutionDependencies] = useState(
    `1. Department authorization for valve chamber entry.\n2. 4G/cellular SIM card clearance or municipal LoRa gateway sharing.\n3. Historical pressure log sample for algorithmic baseline training.`
  );

  // ---------------------------------------------------------------------------
  // STEP 5: COMMERCIAL
  // ---------------------------------------------------------------------------
  const [estimatedCost, setEstimatedCost] = useState('₹45,00,000');
  const [pricingModel, setPricingModel] = useState('Milestone-Based Fixed Price (GFR Rule 194 Pilot)');
  const [milestonesProposal, setMilestonesProposal] = useState<MilestoneProposalItem[]>([
    {
      id: 'm1',
      title: 'Milestone 1: Hardware Benchmarking, Security Audit & Site Survey',
      description: 'Pre-deployment sensor calibration, CERT-In cybersecurity clearance, and field mounting survey across 14 stations.',
      amount: '₹12,00,000',
      dueDate: '2026-10-31'
    },
    {
      id: 'm2',
      title: 'Milestone 2: Field Sensor Array Deployment & Telemetry Commissioning',
      description: 'Physical installation of 28 sensor nodes, LoRaWAN gateway activation, and live telemetry data pipeline verification.',
      amount: '₹18,00,000',
      dueDate: '2026-11-30'
    },
    {
      id: 'm3',
      title: 'Milestone 3: 60-Day Field Validation Trial, KPI Audit & Handover Dossier',
      description: 'End-to-end autonomous leak detection demonstration, joint engineering inspection with department, and final pilot report.',
      amount: '₹15,00,000',
      dueDate: '2026-12-31'
    }
  ]);

  // Milestone edit/add state
  const [newMsTitle, setNewMsTitle] = useState('');
  const [newMsAmount, setNewMsAmount] = useState('');
  const [newMsDate, setNewMsDate] = useState('2027-01-31');
  const [newMsDesc, setNewMsDesc] = useState('');
  const [showAddMsForm, setShowAddMsForm] = useState(false);

  // Errors state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ---------------------------------------------------------------------------
  // VALIDATION PER STEP
  // ---------------------------------------------------------------------------
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!companyName.trim()) newErrors.companyName = 'Company name is required.';
      if (!founderName.trim()) newErrors.founderName = 'Authorized signatory name is required.';
      if (!officialEmail.trim()) newErrors.officialEmail = 'Official email is required.';
      if (!mobileNumber.trim()) newErrors.mobileNumber = 'Mobile number is required.';
      if (!profileConfirmed) newErrors.profileConfirmed = 'Please confirm that your startup profile is up to date.';
    }

    if (step === 2) {
      if (!solutionName.trim()) newErrors.solutionName = 'Solution name is required.';
      if (!problemUnderstanding.trim()) newErrors.problemUnderstanding = 'Problem understanding statement is required.';
      if (!proposedApproach.trim()) newErrors.proposedApproach = 'Proposed technical approach is required.';
      if (!expectedImpact.trim()) newErrors.expectedImpact = 'Expected impact and metrics are required.';
      if (!deploymentRequirements.trim()) newErrors.deploymentRequirements = 'Deployment requirements are required.';
    }

    if (step === 3) {
      if (selectedEvidenceIds.length === 0) {
        newErrors.evidence = 'Please attach at least one verified evidence document to substantiate your technical capability.';
      }
    }

    if (step === 4) {
      if (!executionTeam.trim()) newErrors.executionTeam = 'Team and key personnel details are required.';
      if (!executionTimeline.trim()) newErrors.executionTimeline = 'Project timeline and milestones schedule are required.';
      if (!executionInfrastructure.trim()) newErrors.executionInfrastructure = 'Infrastructure and equipment details are required.';
      if (!executionDependencies.trim()) newErrors.executionDependencies = 'Key dependencies and department inputs are required.';
    }

    if (step === 5) {
      if (!estimatedCost.trim()) newErrors.estimatedCost = 'Estimated cost is required.';
      if (!pricingModel.trim()) newErrors.pricingModel = 'Pricing model is required.';
      if (milestonesProposal.length === 0) {
        newErrors.milestones = 'Please define at least one pilot milestone.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(6, prev + 1));
      const modalScroll = document.getElementById('apply-modal-content');
      if (modalScroll) modalScroll.scrollTop = 0;
    } else {
      addToast('Please complete all required fields before proceeding.', 'warning');
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
    const modalScroll = document.getElementById('apply-modal-content');
    if (modalScroll) modalScroll.scrollTop = 0;
  };

  // ---------------------------------------------------------------------------
  // TOGGLE & ADD EVIDENCE
  // ---------------------------------------------------------------------------
  const toggleEvidence = (id: string) => {
    if (selectedEvidenceIds.includes(id)) {
      setSelectedEvidenceIds(selectedEvidenceIds.filter(x => x !== id));
    } else {
      setSelectedEvidenceIds([...selectedEvidenceIds, id]);
    }
  };

  const handleCreateNewEvidence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvidenceTitle.trim() || !newEvidenceAuthority.trim() || !newEvidenceDocRef.trim()) {
      addToast('Please fill in title, issuing authority, and document reference.', 'warning');
      return;
    }

    const created = addEvidence({
      startupId: currentStartupProfile?.id || 'startup_1',
      startupName: companyName.trim(),
      title: newEvidenceTitle.trim(),
      category: 'technical_benchmark',
      evidenceType: newEvidenceType,
      issuingAuthority: newEvidenceAuthority.trim(),
      issueDate: new Date().toISOString().split('T')[0],
      uploadedDate: new Date().toISOString().split('T')[0],
      docStatus: 'Active / Valid',
      documentRef: newEvidenceDocRef.trim(),
      summary: newEvidenceSummary.trim() || 'Verifiable test benchmark submitted for evaluation.',
      sector: opportunity.sector
    });

    // Auto-select this newly created evidence
    setSelectedEvidenceIds(prev => [...prev, created.id]);
    setShowAddEvidenceForm(false);
    setNewEvidenceTitle('');
    addToast('New evidence document added to Evidence Vault and attached to this proposal!', 'success');
  };

  // ---------------------------------------------------------------------------
  // ADD / REMOVE MILESTONE
  // ---------------------------------------------------------------------------
  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsTitle.trim() || !newMsAmount.trim()) {
      addToast('Please provide milestone title and amount.', 'warning');
      return;
    }

    const newMs: MilestoneProposalItem = {
      id: `ms_${Date.now()}`,
      title: newMsTitle.trim(),
      description: newMsDesc.trim() || 'Milestone verification deliverable.',
      amount: newMsAmount.trim().startsWith('₹') ? newMsAmount.trim() : `₹${newMsAmount.trim()}`,
      dueDate: newMsDate
    };

    setMilestonesProposal(prev => [...prev, newMs]);
    setNewMsTitle('');
    setNewMsAmount('');
    setNewMsDesc('');
    setShowAddMsForm(false);
  };

  const handleRemoveMilestone = (id: string) => {
    if (milestonesProposal.length <= 1) {
      addToast('Application must include at least one milestone.', 'warning');
      return;
    }
    setMilestonesProposal(prev => prev.filter(m => m.id !== id));
  };

  // ---------------------------------------------------------------------------
  // SUBMIT APPLICATION (STEP 6)
  // ---------------------------------------------------------------------------
  const handleFinalSubmit = () => {
    // Validate all steps 1 through 5
    for (let s = 1; s <= 5; s++) {
      if (!validateStep(s)) {
        setCurrentStep(s);
        addToast(`Validation failed in Step ${s}. Please review the required fields.`, 'error');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const highlights = [
        `Solution: ${solutionName.trim()}`,
        `Approach: ${proposedApproach.substring(0, 100)}...`,
        `Impact: ${expectedImpact.substring(0, 100)}...`,
        `Evidence: ${selectedEvidenceIds.length} verified artifacts attached.`
      ];

      const newApp = submitApplication({
        opportunityId: opportunity.id,
        opportunityTitle: opportunity.title,
        departmentName: opportunity.departmentName,
        startupId: currentStartupProfile?.id || 'startup_1',
        startupName: companyName.trim(),
        sector: opportunity.sector,
        trlProposed,
        solutionSummary: problemUnderstanding.trim(),
        capabilityHighlights: highlights,
        attachedEvidenceIds: selectedEvidenceIds,
        // Multi-step custom details
        confirmedProfileSnapshot: {
          companyName: companyName.trim(),
          founderName: founderName.trim(),
          officialEmail: officialEmail.trim(),
          mobileNumber: mobileNumber.trim(),
          dpiitNumber: dpiitNumber.trim(),
          stage,
          primarySector,
          headquartersCity,
          state,
          teamSize,
          trustIndex: currentStartupProfile?.trustIndex || 94,
          dpiitVerified: true
        },
        solutionName: solutionName.trim(),
        problemUnderstanding: problemUnderstanding.trim(),
        proposedApproach: proposedApproach.trim(),
        expectedImpact: expectedImpact.trim(),
        deploymentRequirements: deploymentRequirements.trim(),
        executionTeam: executionTeam.trim(),
        executionTimeline: executionTimeline.trim(),
        executionInfrastructure: executionInfrastructure.trim(),
        executionDependencies: executionDependencies.trim(),
        estimatedCost: estimatedCost.trim(),
        pricingModel: pricingModel.trim(),
        milestoneProposals: milestonesProposal.map(m => ({
          title: m.title,
          description: m.description,
          amount: m.amount,
          dueDate: m.dueDate
        }))
      });

      setCreatedAppId(newApp.id);
      setIsSubmittedSuccess(true);
      onSuccess?.();
    } catch (err) {
      console.error(err);
      addToast('An unexpected error occurred while submitting your application.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepsList = [
    { num: 1, title: 'Profile', desc: 'Confirm credentials' },
    { num: 2, title: 'Solution', desc: 'Overview & approach' },
    { num: 3, title: 'Evidence', desc: 'Attach vault tests' },
    { num: 4, title: 'Execution', desc: 'Team & timeline' },
    { num: 5, title: 'Commercial', desc: 'Cost & milestones' },
    { num: 6, title: 'Review', desc: 'Verify & submit' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* ================================================================= */}
        {/* MODAL HEADER */}
        {/* ================================================================= */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#0f2b48] via-[#16385c] to-[#0f2b48] text-white shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-2.5 py-0.5 bg-orange-500/90 text-white font-black text-[10px] uppercase rounded-md tracking-wider">
                  GFR 173(i) Challenge Application
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-slate-200 font-semibold">{opportunity.departmentName}</span>
                <span className="text-slate-300">·</span>
                <span className="px-2 py-0.5 bg-white/10 text-orange-200 font-bold text-[10px] rounded-md border border-white/15">
                  Est. Budget: {opportunity.budgetEstimate}
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight leading-snug">
                Apply for: {opportunity.title}
              </h2>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors shrink-0"
              title="Close Application"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* HORIZONTAL STEPPER BAR */}
          <div className="mt-5 pt-4 border-t border-white/15 overflow-x-auto">
            <div className="flex items-center justify-between min-w-[580px] gap-2">
              {stepsList.map((st, idx) => {
                const isCompleted = currentStep > st.num;
                const isCurrent = currentStep === st.num;
                return (
                  <React.Fragment key={st.num}>
                    <button
                      type="button"
                      onClick={() => {
                        if (st.num < currentStep || (st.num === currentStep + 1 && validateStep(currentStep))) {
                          setCurrentStep(st.num);
                        }
                      }}
                      className={`flex items-center gap-2 text-left p-1 rounded-xl transition-all ${
                        isCurrent ? 'bg-white/15' : 'hover:bg-white/5 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs transition-all ${
                        isCompleted
                          ? 'bg-emerald-500 text-white'
                          : isCurrent
                            ? 'bg-[#ea580c] text-white ring-2 ring-orange-300'
                            : 'bg-white/15 text-slate-300'
                      }`}>
                        {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : st.num}
                      </div>
                      <div>
                        <div className={`text-[10px] font-extrabold uppercase tracking-wider ${
                          isCurrent ? 'text-orange-300' : isCompleted ? 'text-emerald-300' : 'text-slate-400'
                        }`}>
                          Step {st.num}
                        </div>
                        <div className="text-xs font-bold text-white whitespace-nowrap">
                          {st.title}
                        </div>
                      </div>
                    </button>

                    {idx < stepsList.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-1 rounded-full transition-all ${
                        currentStep > st.num ? 'bg-emerald-400' : 'bg-white/20'
                      }`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* MODAL BODY (SCROLLABLE) */}
        {/* ================================================================= */}
        <div id="apply-modal-content" className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6 bg-slate-50/50">

          {/* SUCCESS MODAL AFTER SUBMISSION */}
          {isSubmittedSuccess ? (
            <div className="py-10 text-center space-y-5 animate-in fade-in zoom-in-95 max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-md ring-8 ring-emerald-50">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-2">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-black text-xs rounded-full uppercase tracking-wider">
                  Status: Submitted
                </span>
                <h3 className="text-2xl font-black text-[#0f2b48]">
                  Application Submitted Successfully
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Your formal capability dossier and milestone commercial proposal for <strong>"{opportunity.title}"</strong> have been securely registered on the government procurement ledger.
                </p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-slate-200 text-left text-xs space-y-2 shadow-xs">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <span className="text-slate-500">Application Reference ID:</span>
                  <span className="font-mono font-bold text-[#0f2b48]">{createdAppId}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <span className="text-slate-500">Nodal Department:</span>
                  <span className="font-bold text-slate-800">{opportunity.departmentName}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <span className="text-slate-500">Evidence Documents:</span>
                  <span className="font-bold text-emerald-700">{selectedEvidenceIds.length} Verified Artifacts</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Audit Qualification:</span>
                  <span className="font-bold text-slate-800">GFR 173(i) Turnover-Exempt ✓</span>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    setActiveTab('my-applications');
                  }}
                  className="w-full sm:w-auto px-6 py-3 text-xs font-black text-white bg-[#0f2b48] hover:bg-[#16385c] rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Briefcase className="w-4 h-4 text-orange-400" />
                  <span>View in My Applications</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    setActiveTab('overview');
                  }}
                  className="w-full sm:w-auto px-5 py-3 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* ============================================================= */}
              {/* STEP 1: CONFIRM STARTUP PROFILE */}
              {/* ============================================================= */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="border-b border-slate-200 pb-3">
                    <span className="px-2.5 py-0.5 bg-blue-100 text-blue-900 font-extrabold text-[10px] uppercase rounded-md tracking-wider">
                      Step 1 of 6
                    </span>
                    <h3 className="text-lg font-black text-[#0f2b48] mt-1">
                      STEP 1 — Confirm Startup Profile
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Verify your statutory DPIIT credentials, company details, and authorized officer contact for this procurement proposal.
                    </p>
                  </div>

                  {/* Profile Summary Card with Seals */}
                  <div className="p-4 sm:p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-extrabold text-[#0f2b48]">{companyName}</span>
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 font-black text-[10px] rounded-md flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            <span>DPIIT Recognized</span>
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Certificate: <strong className="text-slate-800">{dpiitNumber}</strong> · Stage: <strong className="text-slate-800">{stage}</strong>
                        </p>
                      </div>

                      <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl self-start sm:self-auto">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <div className="text-[10px] font-bold text-emerald-950">
                          Technical Capability: <strong className="text-xs font-black text-emerald-700">Demonstrated</strong>
                        </div>
                      </div>
                    </div>

                    {/* Exemption Banner per GFR 173(i) */}
                    <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl flex items-start gap-2.5 text-xs text-blue-950">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block font-bold">GFR Rule 173(i) & 194 Exemption Qualified</strong>
                        <p className="text-[11px] text-blue-900/90 mt-0.5">
                          As a verified DPIIT-recognized startup, your entity is exempt from prior turnover and prior experience criteria for innovative pilot evaluation.
                        </p>
                      </div>
                    </div>

                    {/* Editable Fields Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Company Legal Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={companyName}
                          onChange={e => setCompanyName(e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white outline-hidden focus:ring-2 focus:ring-[#0f2b48]"
                        />
                        {errors.companyName && <p className="text-red-500 text-[11px] mt-1">{errors.companyName}</p>}
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Authorized Signatory / Founder <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={founderName}
                          onChange={e => setFounderName(e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white outline-hidden focus:ring-2 focus:ring-[#0f2b48]"
                        />
                        {errors.founderName && <p className="text-red-500 text-[11px] mt-1">{errors.founderName}</p>}
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Official Communication Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          value={officialEmail}
                          onChange={e => setOfficialEmail(e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white outline-hidden focus:ring-2 focus:ring-[#0f2b48]"
                        />
                        {errors.officialEmail && <p className="text-red-500 text-[11px] mt-1">{errors.officialEmail}</p>}
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Official Contact Phone <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          value={mobileNumber}
                          onChange={e => setMobileNumber(e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white outline-hidden focus:ring-2 focus:ring-[#0f2b48]"
                        />
                        {errors.mobileNumber && <p className="text-red-500 text-[11px] mt-1">{errors.mobileNumber}</p>}
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Headquarters City & State
                        </label>
                        <input
                          type="text"
                          value={`${headquartersCity}, ${state}`}
                          onChange={e => {
                            const parts = e.target.value.split(',');
                            setHeadquartersCity(parts[0]?.trim() || '');
                            if (parts[1]) setState(parts[1]?.trim() || '');
                          }}
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Core Technical Team Size
                        </label>
                        <input
                          type="text"
                          value={teamSize}
                          onChange={e => setTeamSize(e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white outline-hidden"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Confirmation Checkbox */}
                  <div className={`p-4 rounded-2xl border transition-all ${
                    profileConfirmed ? 'bg-emerald-50/70 border-emerald-300' : 'bg-amber-50/70 border-amber-300'
                  }`}>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profileConfirmed}
                        onChange={e => setProfileConfirmed(e.target.checked)}
                        className="w-4 h-4 mt-0.5 rounded text-[#ea580c] focus:ring-[#0f2b48]"
                      />
                      <div className="text-xs text-slate-800">
                        <strong className="block font-extrabold text-[#0f2b48]">
                          Statutory Profile Confirmation
                        </strong>
                        <span className="text-[11px] text-slate-600">
                          I confirm that our startup profile, DPIIT registration details, and authorized officer contact information are accurate and authorized for this public procurement proposal under General Financial Rules (GFR).
                        </span>
                      </div>
                    </label>
                    {errors.profileConfirmed && <p className="text-red-500 text-xs mt-2 font-bold">{errors.profileConfirmed}</p>}
                  </div>
                </div>
              )}

              {/* ============================================================= */}
              {/* STEP 2: SOLUTION OVERVIEW */}
              {/* ============================================================= */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="border-b border-slate-200 pb-3">
                    <span className="px-2.5 py-0.5 bg-orange-100 text-[#ea580c] font-extrabold text-[10px] uppercase rounded-md tracking-wider">
                      Step 2 of 6
                    </span>
                    <h3 className="text-lg font-black text-[#0f2b48] mt-1">
                      STEP 2 — Solution Overview
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Articulate your proposed technology solution, technical approach, measurable outcomes, and deployment requirements.
                    </p>
                  </div>

                  {/* Opportunity Challenge Context Box */}
                  <div className="p-3.5 bg-slate-100/90 rounded-2xl border border-slate-200/90 text-xs text-slate-700 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-[#0f2b48] text-[11px] uppercase tracking-wide">
                      <Target className="w-3.5 h-3.5 text-[#ea580c]" />
                      <span>Department Challenge Context:</span>
                    </div>
                    <p className="text-slate-600 italic">
                      "{opportunity.problemStatement}"
                    </p>
                  </div>

                  <div className="space-y-4 text-xs">
                    {/* Solution Name */}
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">
                        Solution Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={solutionName}
                        onChange={e => setSolutionName(e.target.value)}
                        placeholder="e.g., AquaSens Edge: Subsurface Acoustic Telemetry System"
                        className={`w-full px-3.5 py-2.5 text-xs border rounded-xl bg-white outline-hidden focus:ring-2 focus:ring-[#0f2b48] ${
                          errors.solutionName ? 'border-red-400 bg-red-50/50' : 'border-slate-300'
                        }`}
                      />
                      {errors.solutionName && <p className="text-red-500 text-[11px] mt-1 font-semibold">{errors.solutionName}</p>}
                    </div>

                    {/* Proposed TRL */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-slate-800 mb-1">
                          Proposed Technology Readiness Level (TRL)
                        </label>
                        <select
                          value={trlProposed}
                          onChange={e => setTrlProposed(Number(e.target.value))}
                          className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl bg-white outline-hidden font-medium"
                        >
                          <option value={5}>TRL 5 - Validated in relevant industrial setting</option>
                          <option value={6}>TRL 6 - Prototype demonstrated in operational environment</option>
                          <option value={7}>TRL 7 - System prototype demonstration in operational field</option>
                          <option value={8}>TRL 8 - Actual system completed and qualified</option>
                          <option value={9}>TRL 9 - Actual system proven in operational mission</option>
                        </select>
                      </div>

                      <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-2 text-[11px] text-emerald-900">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Meets or exceeds department minimum requirement (TRL {opportunity.trlRequired}).</span>
                      </div>
                    </div>

                    {/* Problem Understanding */}
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">
                        Problem Understanding <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={3}
                        value={problemUnderstanding}
                        onChange={e => setProblemUnderstanding(e.target.value)}
                        placeholder="Demonstrate clear operational understanding of the department's bottleneck and legacy challenges..."
                        className={`w-full px-3.5 py-2.5 text-xs border rounded-xl bg-white outline-hidden focus:ring-2 focus:ring-[#0f2b48] ${
                          errors.problemUnderstanding ? 'border-red-400 bg-red-50/50' : 'border-slate-300'
                        }`}
                      />
                      {errors.problemUnderstanding && <p className="text-red-500 text-[11px] mt-1 font-semibold">{errors.problemUnderstanding}</p>}
                    </div>

                    {/* Proposed Approach */}
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">
                        Proposed Approach & Technical Architecture <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={4}
                        value={proposedApproach}
                        onChange={e => setProposedApproach(e.target.value)}
                        placeholder="Detail your engineering approach, hardware sensors, edge computing algorithms, communication telemetry, and data pipeline..."
                        className={`w-full px-3.5 py-2.5 text-xs border rounded-xl bg-white outline-hidden focus:ring-2 focus:ring-[#0f2b48] ${
                          errors.proposedApproach ? 'border-red-400 bg-red-50/50' : 'border-slate-300'
                        }`}
                      />
                      {errors.proposedApproach && <p className="text-red-500 text-[11px] mt-1 font-semibold">{errors.proposedApproach}</p>}
                    </div>

                    {/* Expected Impact */}
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">
                        Expected Impact & Quantified Outcomes <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={3}
                        value={expectedImpact}
                        onChange={e => setExpectedImpact(e.target.value)}
                        placeholder="Specify quantifiable KPIs, accuracy figures, latency reductions, and financial or resource savings for the government..."
                        className={`w-full px-3.5 py-2.5 text-xs border rounded-xl bg-white outline-hidden focus:ring-2 focus:ring-[#0f2b48] ${
                          errors.expectedImpact ? 'border-red-400 bg-red-50/50' : 'border-slate-300'
                        }`}
                      />
                      {errors.expectedImpact && <p className="text-red-500 text-[11px] mt-1 font-semibold">{errors.expectedImpact}</p>}
                    </div>

                    {/* Deployment Requirements */}
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">
                        Deployment Requirements (Govt Facilities / Support Needed) <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={3}
                        value={deploymentRequirements}
                        onChange={e => setDeploymentRequirements(e.target.value)}
                        placeholder="What specific physical access, sensor mount locations, network access, or departmental data will be required during the pilot?"
                        className={`w-full px-3.5 py-2.5 text-xs border rounded-xl bg-white outline-hidden focus:ring-2 focus:ring-[#0f2b48] ${
                          errors.deploymentRequirements ? 'border-red-400 bg-red-50/50' : 'border-slate-300'
                        }`}
                      />
                      {errors.deploymentRequirements && <p className="text-red-500 text-[11px] mt-1 font-semibold">{errors.deploymentRequirements}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================= */}
              {/* STEP 3: CAPABILITY EVIDENCE */}
              {/* ============================================================= */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                    <div>
                      <span className="px-2.5 py-0.5 bg-purple-100 text-purple-900 font-extrabold text-[10px] uppercase rounded-md tracking-wider">
                        Step 3 of 6
                      </span>
                      <h3 className="text-lg font-black text-[#0f2b48] mt-1">
                        STEP 3 — Capability Evidence
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Select verified artifacts from your Evidence Vault to prove technical claims to the evaluation committee.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowAddEvidenceForm(!showAddEvidenceForm)}
                      className="px-3.5 py-2 text-xs font-bold text-white bg-[#ea580c] hover:bg-[#c2410c] rounded-xl shadow-xs flex items-center gap-1.5 self-start sm:self-auto transition-colors"
                    >
                      {showAddEvidenceForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                      <span>{showAddEvidenceForm ? 'Cancel New Evidence' : 'Add New Evidence'}</span>
                    </button>
                  </div>

                  {errors.evidence && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errors.evidence}</span>
                    </div>
                  )}

                  {/* INLINE DRAWER: ADD NEW EVIDENCE FORM */}
                  {showAddEvidenceForm && (
                    <div className="p-5 bg-orange-50/80 border border-orange-200 rounded-2xl space-y-4 animate-in fade-in">
                      <div className="flex items-center justify-between pb-2 border-b border-orange-200/80">
                        <div className="flex items-center gap-2">
                          <Plus className="w-4 h-4 text-[#ea580c]" />
                          <span className="font-extrabold text-[#0f2b48] text-xs uppercase tracking-wide">
                            Add New Evidence Artifact to Vault
                          </span>
                        </div>
                        <span className="text-[11px] text-orange-800 font-semibold">Immediate Tamper-Proof Audit</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="sm:col-span-2">
                          <label className="block font-bold text-slate-800 mb-1">
                            Evidence Document Title <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={newEvidenceTitle}
                            onChange={e => setNewEvidenceTitle(e.target.value)}
                            placeholder="e.g., NABL Flow Rig Test Certificate & 99.2% Accuracy Calibration Report"
                            className="w-full px-3 py-2 text-xs border border-orange-300 rounded-xl bg-white outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-800 mb-1">
                            Evidence Category
                          </label>
                          <select
                            value={newEvidenceType}
                            onChange={e => setNewEvidenceType(e.target.value as EvidenceType)}
                            className="w-full px-3 py-2 text-xs border border-orange-300 rounded-xl bg-white outline-hidden font-medium"
                          >
                            <option value="Technical Benchmark">Technical Benchmark</option>
                            <option value="Product Demo">Product Demo</option>
                            <option value="Certificate">Certificate</option>
                            <option value="Deployment Evidence">Deployment Evidence</option>
                            <option value="Security Document">Security Document</option>
                          </select>
                        </div>

                        <div>
                          <label className="block font-bold text-slate-800 mb-1">
                            Issuing Authority / Testing Lab <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={newEvidenceAuthority}
                            onChange={e => setNewEvidenceAuthority(e.target.value)}
                            placeholder="e.g., IIT Madras, NABL Lab, CERT-In, CSIR"
                            className="w-full px-3 py-2 text-xs border border-orange-300 rounded-xl bg-white outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-800 mb-1">
                            Document / Test Reference Code <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={newEvidenceDocRef}
                            onChange={e => setNewEvidenceDocRef(e.target.value)}
                            placeholder="e.g., CERT-IN/AUDIT/2026-881"
                            className="w-full px-3 py-2 text-xs border border-orange-300 rounded-xl bg-white outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-800 mb-1">
                            Test Summary / Benchmark Value
                          </label>
                          <input
                            type="text"
                            value={newEvidenceSummary}
                            onChange={e => setNewEvidenceSummary(e.target.value)}
                            placeholder="Summary of quantitative test results..."
                            className="w-full px-3 py-2 text-xs border border-orange-300 rounded-xl bg-white outline-hidden"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowAddEvidenceForm(false)}
                          className="px-3.5 py-1.5 text-xs font-bold text-slate-600 bg-white rounded-lg border border-slate-200"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleCreateNewEvidence}
                          className="px-4 py-1.5 text-xs font-bold text-white bg-[#ea580c] hover:bg-[#c2410c] rounded-lg shadow-2xs"
                        >
                          Save & Attach to Application
                        </button>
                      </div>
                    </div>
                  )}

                  {/* SELECT EXISTING EVIDENCE LIST */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span>Available Artifacts from Evidence Vault ({selectedEvidenceIds.length} of {startupEvidenceList.length} selected):</span>
                      <button
                        type="button"
                        onClick={() => setSelectedEvidenceIds(startupEvidenceList.map(e => e.id))}
                        className="text-blue-600 hover:underline"
                      >
                        Select All
                      </button>
                    </div>

                    <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                      {startupEvidenceList.map(ev => {
                        const isSelected = selectedEvidenceIds.includes(ev.id);
                        return (
                          <div
                            key={ev.id}
                            onClick={() => toggleEvidence(ev.id)}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                              isSelected
                                ? 'bg-orange-50/70 border-[#ea580c] shadow-xs ring-1 ring-[#ea580c]'
                                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/70'
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
                              isSelected ? 'bg-[#ea580c] text-white' : 'border border-slate-300 bg-white'
                            }`}>
                              {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>

                            <div className="flex-1 space-y-1 text-xs">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <span className="font-extrabold text-[#0f2b48]">{ev.title}</span>
                                  <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-semibold rounded-md border border-slate-200">
                                    {ev.evidenceType || ev.category}
                                  </span>
                                </div>
                                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold rounded-md flex items-center gap-1">
                                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                  <span>Verified & Tamper-Proof</span>
                                </span>
                              </div>

                              <p className="text-[11px] text-slate-600 leading-relaxed">
                                {ev.summary}
                              </p>

                              <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-400 font-medium pt-1">
                                <span>Authority: <strong className="text-slate-700">{ev.issuingAuthority}</strong></span>
                                <span>·</span>
                                <span>Ref: <strong className="text-slate-700">{ev.documentRef}</strong></span>
                                <span>·</span>
                                <span className="font-mono text-slate-400 truncate max-w-[160px]">
                                  SHA-256: {ev.cryptographicHash?.substring(0, 14)}...
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================= */}
              {/* STEP 4: EXECUTION */}
              {/* ============================================================= */}
              {currentStep === 4 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="border-b border-slate-200 pb-3">
                    <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-900 font-extrabold text-[10px] uppercase rounded-md tracking-wider">
                      Step 4 of 6
                    </span>
                    <h3 className="text-lg font-black text-[#0f2b48] mt-1">
                      STEP 4 — Execution & Project Governance
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Define your core engineering team, phased pilot timeline, lab/field infrastructure, and departmental dependencies.
                    </p>
                  </div>

                  <div className="space-y-4 text-xs">
                    {/* Team */}
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">
                        Core Team & Key Technical Personnel <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={3}
                        value={executionTeam}
                        onChange={e => setExecutionTeam(e.target.value)}
                        placeholder="List principal investigators, lead embedded engineers, hydro-specialists, and deployment technicians assigned..."
                        className={`w-full px-3.5 py-2.5 text-xs border rounded-xl bg-white outline-hidden focus:ring-2 focus:ring-[#0f2b48] ${
                          errors.executionTeam ? 'border-red-400 bg-red-50/50' : 'border-slate-300'
                        }`}
                      />
                      {errors.executionTeam && <p className="text-red-500 text-[11px] mt-1 font-semibold">{errors.executionTeam}</p>}
                    </div>

                    {/* Timeline */}
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">
                        Phased Pilot Timeline & Key Milestones <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={3}
                        value={executionTimeline}
                        onChange={e => setExecutionTimeline(e.target.value)}
                        placeholder="Detail week-by-week or month-by-month stages: site survey, hardware installation, telemetry tuning, operational trial..."
                        className={`w-full px-3.5 py-2.5 text-xs border rounded-xl bg-white outline-hidden focus:ring-2 focus:ring-[#0f2b48] ${
                          errors.executionTimeline ? 'border-red-400 bg-red-50/50' : 'border-slate-300'
                        }`}
                      />
                      {errors.executionTimeline && <p className="text-red-500 text-[11px] mt-1 font-semibold">{errors.executionTimeline}</p>}
                    </div>

                    {/* Infrastructure */}
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">
                        Infrastructure, Tooling & Lab Testbeds <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={3}
                        value={executionInfrastructure}
                        onChange={e => setExecutionInfrastructure(e.target.value)}
                        placeholder="Specify hardware units available, testing benches, sovereign cloud compute, calibration tools, and security controls..."
                        className={`w-full px-3.5 py-2.5 text-xs border rounded-xl bg-white outline-hidden focus:ring-2 focus:ring-[#0f2b48] ${
                          errors.executionInfrastructure ? 'border-red-400 bg-red-50/50' : 'border-slate-300'
                        }`}
                      />
                      {errors.executionInfrastructure && <p className="text-red-500 text-[11px] mt-1 font-semibold">{errors.executionInfrastructure}</p>}
                    </div>

                    {/* Dependencies */}
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">
                        Government & Departmental Dependencies <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={3}
                        value={executionDependencies}
                        onChange={e => setExecutionDependencies(e.target.value)}
                        placeholder="List critical government clearances, physical site access, historical datasets, or staff liaisons needed for seamless execution..."
                        className={`w-full px-3.5 py-2.5 text-xs border rounded-xl bg-white outline-hidden focus:ring-2 focus:ring-[#0f2b48] ${
                          errors.executionDependencies ? 'border-red-400 bg-red-50/50' : 'border-slate-300'
                        }`}
                      />
                      {errors.executionDependencies && <p className="text-red-500 text-[11px] mt-1 font-semibold">{errors.executionDependencies}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================= */}
              {/* STEP 5: COMMERCIAL */}
              {/* ============================================================= */}
              {currentStep === 5 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="border-b border-slate-200 pb-3">
                    <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 font-extrabold text-[10px] uppercase rounded-md tracking-wider">
                      Step 5 of 6
                    </span>
                    <h3 className="text-lg font-black text-[#0f2b48] mt-1">
                      STEP 5 — Commercial Proposal & Milestone Schedule
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Define the pilot commercial structure, pricing model, and verified milestone tranches.
                    </p>
                  </div>

                  {/* Target Opportunity Budget Reference */}
                  <div className="p-3.5 bg-slate-100 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div>
                      <span className="text-slate-500 text-[11px] block">Department Budget Scope:</span>
                      <strong className="text-sm font-black text-[#0f2b48]">{opportunity.budgetEstimate}</strong>
                    </div>
                    <div className="text-[11px] text-slate-600 font-medium">
                      Pathway: <strong className="text-slate-800">{opportunity.targetProcurementPathway}</strong>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">
                        Estimated Pilot Cost <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          value={estimatedCost}
                          onChange={e => setEstimatedCost(e.target.value)}
                          placeholder="e.g., ₹45,00,000"
                          className={`w-full pl-9 pr-3.5 py-2.5 text-xs border rounded-xl bg-white outline-hidden focus:ring-2 focus:ring-[#0f2b48] ${
                            errors.estimatedCost ? 'border-red-400 bg-red-50/50' : 'border-slate-300'
                          }`}
                        />
                      </div>
                      {errors.estimatedCost && <p className="text-red-500 text-[11px] mt-1 font-semibold">{errors.estimatedCost}</p>}
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1">
                        Proposed Pricing Model <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={pricingModel}
                        onChange={e => setPricingModel(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl bg-white outline-hidden font-medium"
                      >
                        <option value="Milestone-Based Fixed Price (GFR Rule 194 Pilot)">
                          Milestone-Based Fixed Price (GFR Rule 194 Pilot)
                        </option>
                        <option value="Fixed Price with Performance Guarantee">
                          Fixed Price with Performance Guarantee
                        </option>
                        <option value="Hybrid CapEx Pilot + Annual O&M Subscription">
                          Hybrid CapEx Pilot + Annual O&M Subscription
                        </option>
                        <option value="Outcome-Based Pay-for-Performance">
                          Outcome-Based Pay-for-Performance
                        </option>
                      </select>
                    </div>
                  </div>

                  {/* MILESTONE BUILDER */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-black text-[#0f2b48] uppercase tracking-wide">
                          Milestone Proposal Tranches ({milestonesProposal.length})
                        </span>
                        <p className="text-[11px] text-slate-500">
                          Payments are disbursed exclusively upon verifiable committee milestone verification.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowAddMsForm(!showAddMsForm)}
                        className="px-3 py-1.5 text-xs font-bold text-white bg-[#0f2b48] hover:bg-[#16385c] rounded-lg shadow-2xs flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Milestone</span>
                      </button>
                    </div>

                    {errors.milestones && (
                      <p className="text-red-500 text-xs font-bold">{errors.milestones}</p>
                    )}

                    {/* Add Milestone Form */}
                    {showAddMsForm && (
                      <div className="p-4 bg-slate-50 border border-slate-300 rounded-2xl space-y-3 text-xs animate-in fade-in">
                        <div className="font-bold text-[#0f2b48]">Add Custom Milestone</div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="sm:col-span-2">
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">Milestone Title</label>
                            <input
                              type="text"
                              value={newMsTitle}
                              onChange={e => setNewMsTitle(e.target.value)}
                              placeholder="e.g., Milestone 4: Multi-Ward Scaled Rollout"
                              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">Amount</label>
                            <input
                              type="text"
                              value={newMsAmount}
                              onChange={e => setNewMsAmount(e.target.value)}
                              placeholder="₹10,00,000"
                              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">Deliverable Description</label>
                          <textarea
                            rows={2}
                            value={newMsDesc}
                            onChange={e => setNewMsDesc(e.target.value)}
                            placeholder="What verifiable deliverables will be submitted for committee verification?"
                            className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                          />
                        </div>

                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setShowAddMsForm(false)}
                            className="px-3 py-1 text-xs font-bold text-slate-600 bg-white rounded-lg border border-slate-200"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleAddMilestone}
                            className="px-3 py-1 text-xs font-bold text-white bg-[#0f2b48] rounded-lg"
                          >
                            Save Milestone
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Milestone List */}
                    <div className="space-y-2.5">
                      {milestonesProposal.map((ms, idx) => (
                        <div
                          key={ms.id || idx}
                          className="p-4 bg-white border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-start justify-between gap-3 shadow-2xs"
                        >
                          <div className="space-y-1 text-xs flex-1">
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-md bg-orange-100 text-[#ea580c] font-black text-[11px] flex items-center justify-center shrink-0">
                                {idx + 1}
                              </span>
                              <strong className="text-[#0f2b48] text-xs">{ms.title}</strong>
                            </div>
                            <p className="text-[11px] text-slate-600 pl-7 leading-relaxed">
                              {ms.description}
                            </p>
                            <div className="pl-7 text-[10px] text-slate-400">
                              Target Completion: <strong className="text-slate-700">{ms.dueDate}</strong>
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 self-end sm:self-center pl-7 sm:pl-0">
                            <span className="text-sm font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                              {ms.amount}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveMilestone(ms.id)}
                              className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                              title="Remove Milestone"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================= */}
              {/* STEP 6: REVIEW & SUBMIT */}
              {/* ============================================================= */}
              {currentStep === 6 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="border-b border-slate-200 pb-3">
                    <span className="px-2.5 py-0.5 bg-blue-100 text-blue-900 font-extrabold text-[10px] uppercase rounded-md tracking-wider">
                      Step 6 of 6
                    </span>
                    <h3 className="text-lg font-black text-[#0f2b48] mt-1">
                      STEP 6 — Review & Submit Application
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Review your full capability application before official submission to the technical committee.
                    </p>
                  </div>

                  {/* Complete Summary Dossier Card */}
                  <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-xs space-y-6 text-xs text-slate-700">
                    
                    {/* Header Banner */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Target Opportunity</div>
                        <h4 className="text-base font-black text-[#0f2b48]">{opportunity.title}</h4>
                        <div className="text-xs text-slate-600 mt-0.5">
                          {opportunity.departmentName} · {opportunity.sector} · Budget: <strong className="text-slate-800">{opportunity.budgetEstimate}</strong>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="px-3 py-1 bg-orange-100 text-[#ea580c] font-black text-xs rounded-xl border border-orange-200">
                          TRL {trlProposed} Proposed
                        </span>
                      </div>
                    </div>

                    {/* Section 1: Confirmed Startup Profile */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                        <span className="font-extrabold text-[#0f2b48] text-xs uppercase tracking-wide">
                          1. Confirmed Startup Profile
                        </span>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(1)}
                          className="text-[11px] text-blue-600 hover:underline font-semibold"
                        >
                          Edit
                        </button>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px]">
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Company</span>
                          <strong className="text-slate-800">{companyName}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Signatory</span>
                          <strong className="text-slate-800">{founderName}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">DPIIT Reg</span>
                          <strong className="text-emerald-700">{dpiitNumber} ✓</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Exemption</span>
                          <strong className="text-blue-800">GFR 173(i) Active</strong>
                        </div>
                      </div>
                    </div>

                    {/* Section 2: Solution Overview */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                        <span className="font-extrabold text-[#0f2b48] text-xs uppercase tracking-wide">
                          2. Solution Overview
                        </span>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(2)}
                          className="text-[11px] text-blue-600 hover:underline font-semibold"
                        >
                          Edit
                        </button>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 leading-relaxed">
                        <div>
                          <strong className="text-slate-900 block font-bold text-xs">Solution:</strong>
                          <p className="text-slate-700 font-semibold">{solutionName}</p>
                        </div>
                        <div>
                          <strong className="text-slate-900 block font-bold text-xs">Problem Understanding:</strong>
                          <p className="text-slate-600 text-[11px]">{problemUnderstanding}</p>
                        </div>
                        <div>
                          <strong className="text-slate-900 block font-bold text-xs">Proposed Approach:</strong>
                          <p className="text-slate-600 text-[11px]">{proposedApproach}</p>
                        </div>
                        <div>
                          <strong className="text-slate-900 block font-bold text-xs">Expected Impact:</strong>
                          <p className="text-slate-600 text-[11px] whitespace-pre-line">{expectedImpact}</p>
                        </div>
                      </div>
                    </div>

                    {/* Section 3: Capability Evidence */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                        <span className="font-extrabold text-[#0f2b48] text-xs uppercase tracking-wide">
                          3. Attached Capability Evidence ({selectedEvidenceIds.length} Artifacts)
                        </span>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(3)}
                          className="text-[11px] text-blue-600 hover:underline font-semibold"
                        >
                          Edit
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {startupEvidenceList
                          .filter(e => selectedEvidenceIds.includes(e.id))
                          .map(ev => (
                            <div key={ev.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] flex items-start gap-2">
                              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                              <div className="truncate">
                                <strong className="text-slate-800 block truncate">{ev.title}</strong>
                                <span className="text-slate-500 text-[10px]">{ev.issuingAuthority} · {ev.documentRef}</span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Section 4: Execution */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                        <span className="font-extrabold text-[#0f2b48] text-xs uppercase tracking-wide">
                          4. Execution & Project Governance
                        </span>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(4)}
                          className="text-[11px] text-blue-600 hover:underline font-semibold"
                        >
                          Edit
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px]">
                        <div>
                          <strong className="block text-slate-800 font-bold mb-0.5">Core Team:</strong>
                          <p className="text-slate-600 whitespace-pre-line">{executionTeam}</p>
                        </div>
                        <div>
                          <strong className="block text-slate-800 font-bold mb-0.5">Timeline:</strong>
                          <p className="text-slate-600 whitespace-pre-line">{executionTimeline}</p>
                        </div>
                      </div>
                    </div>

                    {/* Section 5: Commercial Proposal */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                        <span className="font-extrabold text-[#0f2b48] text-xs uppercase tracking-wide">
                          5. Commercial & Milestone Schedule
                        </span>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(5)}
                          className="text-[11px] text-blue-600 hover:underline font-semibold"
                        >
                          Edit
                        </button>
                      </div>
                      <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2 text-[11px]">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-slate-500 text-[10px] uppercase font-bold block">Proposed Pricing Model</span>
                            <strong className="text-slate-800">{pricingModel}</strong>
                          </div>
                          <div className="text-right">
                            <span className="text-slate-500 text-[10px] uppercase font-bold block">Total Proposed Cost</span>
                            <span className="text-base font-black text-emerald-800">{estimatedCost}</span>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-emerald-200/60 space-y-1">
                          <strong className="text-[#0f2b48] text-[10px] uppercase tracking-wider block">Tranches:</strong>
                          {milestonesProposal.map((m, i) => (
                            <div key={i} className="flex justify-between items-center text-[10px] py-0.5">
                              <span className="text-slate-700 truncate max-w-xs">{i + 1}. {m.title}</span>
                              <strong className="text-emerald-900 font-mono">{m.amount}</strong>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Statutory Declaration */}
                    <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-200/80 text-[11px] text-blue-950 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0" />
                      <span>
                        Application is sealed under GFR Rule 194 innovation challenge guidelines. Evidence hashes will be validated by the technical evaluation desk.
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

        </div>

        {/* ================================================================= */}
        {/* MODAL FOOTER ACTIONS */}
        {/* ================================================================= */}
        {!isSubmittedSuccess && (
          <div className="p-4 sm:p-5 bg-white border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
            <div>
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-4 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 rounded-xl border border-slate-300 transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous Step</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>

              {currentStep < 6 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2.5 text-xs font-black text-white bg-[#0f2b48] hover:bg-[#16385c] rounded-xl shadow-md transition-all flex items-center gap-2 neu-button"
                >
                  <span>Continue to Step {currentStep + 1}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleFinalSubmit}
                  className="px-8 py-3 text-xs font-black text-white bg-gradient-to-r from-[#ea580c] to-[#c2410c] hover:from-[#c2410c] hover:to-[#9a3412] rounded-xl shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting Proposal...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Submit Application</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
