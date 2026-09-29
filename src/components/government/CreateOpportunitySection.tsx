import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SECTOR_OPTIONS } from '../../data/mockData';
import { Opportunity, ProcurementPathway } from '../../types';
import { 
  Building2, 
  CheckCircle2, 
  ChevronRight, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  AlertCircle, 
  Sliders, 
  FileCheck2, 
  Eye, 
  ShieldCheck, 
  Compass, 
  Layers, 
  Info,
  Calendar,
  DollarSign,
  Users,
  Target,
  Cpu,
  Lock,
  RotateCcw
} from 'lucide-react';

const CAPABILITY_LIST = [
  'AI',
  'Computer Vision',
  'IoT',
  'Civil Engineering',
  'Electronics',
  'Manufacturing',
  'GIS',
  'Data Analytics',
  'Robotics',
  'Agriculture',
  'Healthcare',
  'Energy',
  'Water',
  'Waste Management',
  'Software',
  'Hardware',
  'Professional Services',
  'Other'
];

interface EvaluationWeights {
  technicalCapability: number;
  problemSolutionFit: number;
  innovation: number;
  scalability: number;
  security: number;
  executionCapability: number;
}

const DEFAULT_WEIGHTS: EvaluationWeights = {
  technicalCapability: 20,
  problemSolutionFit: 25,
  innovation: 15,
  scalability: 15,
  security: 10,
  executionCapability: 15
};

export const CreateOpportunitySection: React.FC = () => {
  const { 
    currentUser, 
    createOpportunity, 
    setActiveTab, 
    setSelectedOpportunityId,
    addToast,
    opportunities 
  } = useApp();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [publishedOpp, setPublishedOpp] = useState<Opportunity | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  // STEP 1 — PROBLEM
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState(currentUser?.departmentName || currentUser?.organizationName || 'Department of Drinking Water & Sanitation');
  const [ministry, setMinistry] = useState(currentUser?.ministry || 'Ministry of Jal Shakti, Government of India');
  const [sector, setSector] = useState('Water');
  const [problemDescription, setProblemDescription] = useState('');
  const [currentProcess, setCurrentProcess] = useState('');
  const [painPoints, setPainPoints] = useState('');
  const [targetBeneficiaries, setTargetBeneficiaries] = useState('');

  // STEP 2 — DESIRED OUTCOME
  const [expectedOutcome, setExpectedOutcome] = useState('');
  const [successMetrics, setSuccessMetrics] = useState('');
  const [geographicScope, setGeographicScope] = useState('Bengaluru Urban District (14 Sub-wards)');
  const [targetPopulation, setTargetPopulation] = useState('1,250,000 Citizens & Municipal Water Consumers');
  const [expectedTimeline, setExpectedTimeline] = useState('3 Months field trial + 12 Months phased rollout');
  const [deadline, setDeadline] = useState('2026-11-30');
  const [trlRequired, setTrlRequired] = useState<number>(6);

  // STEP 3 — CAPABILITIES (Multi-select)
  const [selectedCapabilities, setSelectedCapabilities] = useState<string[]>(['IoT', 'Data Analytics', 'Water']);
  const [otherCapabilityText, setOtherCapabilityText] = useState('');

  // STEP 4 — REQUIREMENTS
  const [budgetRange, setBudgetRange] = useState('₹50 Lakhs - ₹1.5 Crores');
  const [expectedTeamCapability, setExpectedTeamCapability] = useState('Multidisciplinary team with embedded systems engineering, hydro-modelling, and cloud telemetry specialists.');
  const [infrastructureAvailable, setInfrastructureAvailable] = useState('Access to 14 municipal feeder pump houses with uninterrupted grid power, 4G cellular coverage, and raw water pipe junctions.');
  const [dataAvailability, setDataAvailability] = useState('3 years historical pipeline burst records, GIS pipeline alignment maps (Shapefile format), and SCADA pressure logs.');
  const [securityRequirements, setSecurityRequirements] = useState('CERT-In empanelled security audit, local data residency within Indian data centers, AES-256 encrypted telemetry transmission.');
  const [complianceRequirements, setComplianceRequirements] = useState('DPIIT startup recognition certificate, GFR 173(i) turnover exemption eligibility, BIS/ISO compliance for field sensor hardware.');

  // STEP 5 — EVALUATION WEIGHTS
  const [weights, setWeights] = useState<EvaluationWeights>(DEFAULT_WEIGHTS);

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);

  const toggleCapability = (cap: string) => {
    if (selectedCapabilities.includes(cap)) {
      setSelectedCapabilities(selectedCapabilities.filter(c => c !== cap));
    } else {
      setSelectedCapabilities([...selectedCapabilities, cap]);
    }
  };

  const handleWeightChange = (key: keyof EvaluationWeights, val: number) => {
    const clamped = Math.max(0, Math.min(100, isNaN(val) ? 0 : val));
    setWeights(prev => ({
      ...prev,
      [key]: clamped
    }));
  };

  const resetWeights = () => {
    setWeights(DEFAULT_WEIGHTS);
  };

  // Step Validation
  const validateStep = (stepNumber: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (stepNumber === 1) {
      if (!title.trim()) newErrors.title = 'Opportunity Title is required.';
      if (!department.trim()) newErrors.department = 'Department name is required.';
      if (!problemDescription.trim()) newErrors.problemDescription = 'Problem Description is required.';
      if (!currentProcess.trim()) newErrors.currentProcess = 'Current Process description is required.';
      if (!painPoints.trim()) newErrors.painPoints = 'Pain points description is required.';
      if (!targetBeneficiaries.trim()) newErrors.targetBeneficiaries = 'Target beneficiaries is required.';
    }

    if (stepNumber === 2) {
      if (!expectedOutcome.trim()) newErrors.expectedOutcome = 'Expected Outcome is required.';
      if (!successMetrics.trim()) newErrors.successMetrics = 'Success Metrics are required.';
      if (!geographicScope.trim()) newErrors.geographicScope = 'Geographic Scope is required.';
      if (!targetPopulation.trim()) newErrors.targetPopulation = 'Target Population is required.';
      if (!expectedTimeline.trim()) newErrors.expectedTimeline = 'Expected Timeline is required.';
      if (!deadline.trim()) newErrors.deadline = 'Submission Deadline is required.';
    }

    if (stepNumber === 3) {
      if (selectedCapabilities.length === 0) {
        newErrors.capabilities = 'Please select at least one required capability.';
      }
      if (selectedCapabilities.includes('Other') && !otherCapabilityText.trim()) {
        newErrors.otherCapability = 'Please specify the other capability.';
      }
    }

    if (stepNumber === 4) {
      if (!budgetRange.trim()) newErrors.budgetRange = 'Budget Range is required.';
      if (!expectedTeamCapability.trim()) newErrors.expectedTeamCapability = 'Expected Team Capability is required.';
      if (!securityRequirements.trim()) newErrors.securityRequirements = 'Security Requirements are required.';
      if (!complianceRequirements.trim()) newErrors.complianceRequirements = 'Compliance Requirements are required.';
    }

    if (stepNumber === 5) {
      if (totalWeight !== 100) {
        newErrors.weights = `Total evaluation weights must equal exactly 100% (currently ${totalWeight}%).`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(6, prev + 1));
      window.scrollTo({ top: 150, behavior: 'smooth' });
    } else {
      addToast('Please complete all required fields before proceeding.', 'warning');
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
    window.scrollTo({ top: 150, behavior: 'smooth' });
  };

  // STEP 6 — PUBLISH OPPORTUNITY
  const handlePublish = () => {
    // Validate all steps
    for (let s = 1; s <= 5; s++) {
      if (!validateStep(s)) {
        setCurrentStep(s);
        addToast(`Validation failed in Step ${s}. Please fix errors before publishing.`, 'error');
        return;
      }
    }

    const finalCapabilities = [...selectedCapabilities];
    if (finalCapabilities.includes('Other') && otherCapabilityText.trim()) {
      const idx = finalCapabilities.indexOf('Other');
      finalCapabilities[idx] = `Other: ${otherCapabilityText.trim()}`;
    }

    // Call createOpportunity
    const newOpportunity = createOpportunity({
      title: title.trim(),
      departmentName: department.trim(),
      ministry: ministry.trim(),
      sector,
      state: currentUser?.state || 'Karnataka',
      location: geographicScope.trim(),
      deadline,
      budgetEstimate: budgetRange.trim(),
      budgetRange: budgetRange.trim(),
      trlRequired,
      problemStatement: problemDescription.trim(),
      desiredOutcome: expectedOutcome.trim(),
      technicalRequirements: [
        `Outcome: ${expectedOutcome.substring(0, 100)}...`,
        `Metrics: ${successMetrics.substring(0, 100)}...`,
        `Security: ${securityRequirements.substring(0, 80)}...`
      ],
      requiredCapabilities: finalCapabilities,
      pilotDuration: expectedTimeline.trim(),
      targetProcurementPathway: 'GFR Rule 194 Fast-Track Challenge' as ProcurementPathway,
      status: 'open',
      priorityLevel: 'High',
      // Multi-step custom fields
      currentProcess: currentProcess.trim(),
      painPoints: painPoints.trim(),
      targetBeneficiaries: targetBeneficiaries.trim(),
      successMetrics: successMetrics.trim(),
      geographicScope: geographicScope.trim(),
      targetPopulation: targetPopulation.trim(),
      expectedTimeline: expectedTimeline.trim(),
      expectedTeamCapability: expectedTeamCapability.trim(),
      infrastructureAvailable: infrastructureAvailable.trim(),
      dataAvailability: dataAvailability.trim(),
      securityRequirements: securityRequirements.trim(),
      complianceRequirements: complianceRequirements.trim(),
      evaluationWeights: weights
    });

    // Save explicitly to localStorage
    try {
      const currentStoredOpps = JSON.parse(localStorage.getItem('procuresetu_opportunities') || '[]');
      const updatedOpps = [newOpportunity, ...currentStoredOpps.filter((o: Opportunity) => o.id !== newOpportunity.id)];
      localStorage.setItem('procuresetu_opportunities', JSON.stringify(updatedOpps));

      // Broadcast targeted notification for demo startup
      const startupNotifs = JSON.parse(localStorage.getItem('procuresetu_notifications') || '[]');
      const targetedNotif = {
        id: `notif_match_${Date.now()}`,
        recipientUserId: 'user_startup_1',
        recipientRole: 'startup',
        title: 'New Opportunity Matches Your Capability Profile',
        message: `${department.trim()} published "${title.trim()}". Matched because your profile contains ${finalCapabilities.slice(0, 3).join(' + ')}.`,
        timestamp: 'Just now',
        read: false,
        linkTab: 'opportunity-radar',
        linkId: newOpportunity.id,
        type: 'success'
      };
      localStorage.setItem('procuresetu_notifications', JSON.stringify([targetedNotif, ...startupNotifs]));
    } catch {
      // Ignore if localStorage unavailable
    }

    setPublishedOpp(newOpportunity);
    setShowSuccessModal(true);
  };

  const steps = [
    { num: 1, label: 'Problem', desc: 'Define operational bottleneck' },
    { num: 2, label: 'Desired Outcome', desc: 'Success metrics & scope' },
    { num: 3, label: 'Capabilities', desc: 'Select technical skills' },
    { num: 4, label: 'Requirements', desc: 'Infrastructure & budget' },
    { num: 5, label: 'Evaluation', desc: 'Weighted scoring rubric' },
    { num: 6, label: 'Review', desc: 'Verify & publish challenge' }
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      
      {/* HEADER */}
      <div className="neu-card p-6 bg-gradient-to-br from-white via-slate-50/50 to-orange-50/20 border-l-4 border-l-[#ea580c] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <span className="px-2 py-0.5 bg-orange-100 text-[#ea580c] font-black text-[10px] uppercase rounded-md tracking-wider">
              Nodal Directorate Workflow
            </span>
            <span>·</span>
            <span className="text-slate-700 font-bold">GFR Rule 173(i) & 194 Compliant Challenge</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0f2b48] tracking-tight">
            Create Government Opportunity
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
            Formulate outcome-driven problem challenges to discover and evaluate verified startup innovation.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('opportunities')}
          className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 rounded-xl border border-slate-300 transition-colors flex items-center gap-1.5 self-start md:self-auto shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Opportunities</span>
        </button>
      </div>

      {/* HORIZONTAL STEPPER */}
      <div className="neu-card p-4 bg-white border border-slate-200 rounded-2xl shadow-xs overflow-x-auto">
        <div className="flex items-center justify-between min-w-[680px]">
          {steps.map((st, idx) => {
            const isCompleted = currentStep > st.num;
            const isCurrent = currentStep === st.num;
            return (
              <React.Fragment key={st.num}>
                <div 
                  onClick={() => {
                    // Allow navigating back or forward if current step passes validation
                    if (st.num < currentStep) {
                      setCurrentStep(st.num);
                    } else if (st.num === currentStep + 1 && validateStep(currentStep)) {
                      setCurrentStep(st.num);
                    }
                  }}
                  className={`flex items-center gap-2.5 cursor-pointer p-1.5 rounded-xl transition-all ${
                    isCurrent ? 'bg-orange-50' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs transition-all ${
                    isCompleted 
                      ? 'bg-emerald-600 text-white shadow-xs' 
                      : isCurrent 
                        ? 'bg-[#ea580c] text-white shadow-md ring-4 ring-orange-100' 
                        : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}>
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : st.num}
                  </div>
                  <div>
                    <div className={`text-xs font-bold ${isCurrent ? 'text-[#0f2b48]' : isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>
                      STEP {st.num}
                    </div>
                    <div className="text-[11px] font-semibold text-slate-600 whitespace-nowrap">
                      {st.label}
                    </div>
                  </div>
                </div>

                {idx < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 rounded-full transition-all ${
                    currentStep > st.num ? 'bg-emerald-500' : 'bg-slate-200'
                  }`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* FORM BODY CONTAINER */}
      <div className="neu-card p-6 sm:p-8 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-6">

        {/* ========================================================================= */}
        {/* STEP 1 — PROBLEM */}
        {/* ========================================================================= */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="border-b border-slate-100 pb-4">
              <span className="px-2.5 py-0.5 bg-blue-100 text-blue-900 font-extrabold text-[10px] uppercase rounded-md tracking-wider">
                Step 1 of 6
              </span>
              <h2 className="text-xl font-black text-[#0f2b48] mt-1.5">
                STEP 1 — Problem Definition
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Clearly describe the municipal or ministerial challenge, current operational mechanisms, and existing pain points.
              </p>
            </div>

            <div className="space-y-5 text-xs">
              {/* Opportunity Title */}
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  Opportunity Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g., Smart Water Leakage Detection & Automated Pressure Management"
                  className={`w-full px-3.5 py-2.5 text-xs border rounded-xl outline-hidden focus:ring-2 focus:ring-[#0f2b48] ${
                    errors.title ? 'border-red-400 bg-red-50/50' : 'border-slate-300 bg-white'
                  }`}
                />
                {errors.title && <p className="text-red-500 text-[11px] mt-1 font-semibold">{errors.title}</p>}
              </div>

              {/* Department & Ministry */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 mb-1.5">
                    Department / Nodal Agency <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    placeholder="e.g., Urban Development Department"
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl outline-hidden bg-white"
                  />
                  {errors.department && <p className="text-red-500 text-[11px] mt-1 font-semibold">{errors.department}</p>}
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1.5">
                    Ministry / Parent Body
                  </label>
                  <input
                    type="text"
                    value={ministry}
                    onChange={e => setMinistry(e.target.value)}
                    placeholder="e.g., Ministry of Housing and Urban Affairs"
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl outline-hidden bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1.5">
                    Sector / Domain <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={sector}
                    onChange={e => setSector(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl bg-white text-slate-800 outline-hidden font-medium"
                  >
                    {SECTOR_OPTIONS.filter(s => s !== 'All Sectors').map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Problem Description */}
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  Problem Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={problemDescription}
                  onChange={e => setProblemDescription(e.target.value)}
                  placeholder="Provide an in-depth operational description of the problem. What physical or systemic breakdown is occurring in the field?"
                  className={`w-full px-3.5 py-2.5 text-xs border rounded-xl outline-hidden focus:ring-2 focus:ring-[#0f2b48] ${
                    errors.problemDescription ? 'border-red-400 bg-red-50/50' : 'border-slate-300 bg-white'
                  }`}
                />
                {errors.problemDescription && <p className="text-red-500 text-[11px] mt-1 font-semibold">{errors.problemDescription}</p>}
              </div>

              {/* Current Process */}
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  Current Process <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={currentProcess}
                  onChange={e => setCurrentProcess(e.target.value)}
                  placeholder="How does your department or municipality currently manage or respond to this problem today? (e.g., manual valve patrols, citizen phone complaints, periodic visual inspections)"
                  className={`w-full px-3.5 py-2.5 text-xs border rounded-xl outline-hidden focus:ring-2 focus:ring-[#0f2b48] ${
                    errors.currentProcess ? 'border-red-400 bg-red-50/50' : 'border-slate-300 bg-white'
                  }`}
                />
                {errors.currentProcess && <p className="text-red-500 text-[11px] mt-1 font-semibold">{errors.currentProcess}</p>}
              </div>

              {/* Pain Points */}
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  Pain Points <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={painPoints}
                  onChange={e => setPainPoints(e.target.value)}
                  placeholder="What are the critical bottlenecks, high failure rates, delay windows, revenue losses, or public safety risks with the current process?"
                  className={`w-full px-3.5 py-2.5 text-xs border rounded-xl outline-hidden focus:ring-2 focus:ring-[#0f2b48] ${
                    errors.painPoints ? 'border-red-400 bg-red-50/50' : 'border-slate-300 bg-white'
                  }`}
                />
                {errors.painPoints && <p className="text-red-500 text-[11px] mt-1 font-semibold">{errors.painPoints}</p>}
              </div>

              {/* Target Beneficiaries */}
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  Target Beneficiaries <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={targetBeneficiaries}
                  onChange={e => setTargetBeneficiaries(e.target.value)}
                  placeholder="e.g., 1.2M municipal citizens, rural water utility workers, emergency maintenance squads"
                  className={`w-full px-3.5 py-2.5 text-xs border rounded-xl outline-hidden focus:ring-2 focus:ring-[#0f2b48] ${
                    errors.targetBeneficiaries ? 'border-red-400 bg-red-50/50' : 'border-slate-300 bg-white'
                  }`}
                />
                {errors.targetBeneficiaries && <p className="text-red-500 text-[11px] mt-1 font-semibold">{errors.targetBeneficiaries}</p>}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2 — DESIRED OUTCOME */}
        {/* ========================================================================= */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="border-b border-slate-100 pb-4">
              <span className="px-2.5 py-0.5 bg-orange-100 text-[#ea580c] font-extrabold text-[10px] uppercase rounded-md tracking-wider">
                Step 2 of 6
              </span>
              <h2 className="text-xl font-black text-[#0f2b48] mt-1.5">
                STEP 2 — Desired Outcome & Scope
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Specify what success looks like, measurable indicators, geographic deployment zone, and timeline.
              </p>
            </div>

            <div className="space-y-5 text-xs">
              {/* Expected Outcome */}
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  Expected Outcome <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={expectedOutcome}
                  onChange={e => setExpectedOutcome(e.target.value)}
                  placeholder="Describe the ultimate outcome needed (e.g., Automated acoustic telemetry network detecting subsurface leaks within 3 meters accuracy and alerting zonal engineers in real time)."
                  className={`w-full px-3.5 py-2.5 text-xs border rounded-xl outline-hidden focus:ring-2 focus:ring-[#0f2b48] ${
                    errors.expectedOutcome ? 'border-red-400 bg-red-50/50' : 'border-slate-300 bg-white'
                  }`}
                />
                {errors.expectedOutcome && <p className="text-red-500 text-[11px] mt-1 font-semibold">{errors.expectedOutcome}</p>}
              </div>

              {/* Success Metrics */}
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  Success Metrics <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={successMetrics}
                  onChange={e => setSuccessMetrics(e.target.value)}
                  placeholder="Define quantifiable KPIs (e.g., >95% leak localization accuracy; <30 minute automated triage time; minimum 40% reduction in non-revenue water losses)."
                  className={`w-full px-3.5 py-2.5 text-xs border rounded-xl outline-hidden focus:ring-2 focus:ring-[#0f2b48] ${
                    errors.successMetrics ? 'border-red-400 bg-red-50/50' : 'border-slate-300 bg-white'
                  }`}
                />
                {errors.successMetrics && <p className="text-red-500 text-[11px] mt-1 font-semibold">{errors.successMetrics}</p>}
              </div>

              {/* Geographic Scope & Target Population */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 mb-1.5">
                    Geographic Scope <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={geographicScope}
                    onChange={e => setGeographicScope(e.target.value)}
                    placeholder="e.g., Bengaluru Urban Grid (14 Sub-wards)"
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl outline-hidden bg-white"
                  />
                  {errors.geographicScope && <p className="text-red-500 text-[11px] mt-1 font-semibold">{errors.geographicScope}</p>}
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1.5">
                    Target Population <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={targetPopulation}
                    onChange={e => setTargetPopulation(e.target.value)}
                    placeholder="e.g., 1,250,000 citizens in North Zone"
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl outline-hidden bg-white"
                  />
                  {errors.targetPopulation && <p className="text-red-500 text-[11px] mt-1 font-semibold">{errors.targetPopulation}</p>}
                </div>
              </div>

              {/* Expected Timeline & Deadline & TRL */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 mb-1.5">
                    Expected Timeline <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={expectedTimeline}
                    onChange={e => setExpectedTimeline(e.target.value)}
                    placeholder="e.g., 3 Months pilot trial + 12 Months full rollout"
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl outline-hidden bg-white"
                  />
                  {errors.expectedTimeline && <p className="text-red-500 text-[11px] mt-1 font-semibold">{errors.expectedTimeline}</p>}
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1.5">
                    Application Deadline <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={e => setDeadline(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl outline-hidden bg-white font-medium text-slate-800"
                  />
                  {errors.deadline && <p className="text-red-500 text-[11px] mt-1 font-semibold">{errors.deadline}</p>}
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1.5">
                    Minimum TRL Level (Technology Readiness)
                  </label>
                  <select
                    value={trlRequired}
                    onChange={e => setTrlRequired(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl bg-white text-slate-800 outline-hidden font-medium"
                  >
                    <option value={4}>TRL 4 - Lab validated component</option>
                    <option value={5}>TRL 5 - Validated in relevant environment</option>
                    <option value={6}>TRL 6 - Prototype demonstrated in operational environment</option>
                    <option value={7}>TRL 7 - System prototype demonstrated in operational field</option>
                    <option value={8}>TRL 8 - Actual system completed and qualified</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3 — CAPABILITIES */}
        {/* ========================================================================= */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="border-b border-slate-100 pb-4">
              <span className="px-2.5 py-0.5 bg-purple-100 text-purple-900 font-extrabold text-[10px] uppercase rounded-md tracking-wider">
                Step 3 of 6
              </span>
              <h2 className="text-xl font-black text-[#0f2b48] mt-1.5">
                STEP 3 — Required Startup Capabilities
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Select the technical and operational competencies required. Startups possessing matching capability passports will be indexed on the radar.
              </p>
            </div>

            {errors.capabilities && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errors.capabilities}</span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">
                Select from standard capability domains ({selectedCapabilities.length} selected):
              </span>
              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedCapabilities(CAPABILITY_LIST.filter(c => c !== 'Other'))}
                  className="text-xs text-blue-600 hover:underline font-semibold"
                >
                  Select All
                </button>
                <span className="text-slate-300">·</span>
                <button
                  type="button"
                  onClick={() => setSelectedCapabilities([])}
                  className="text-xs text-slate-500 hover:underline font-semibold"
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* 18 Capabilities Multi-Select Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {CAPABILITY_LIST.map(cap => {
                const isSelected = selectedCapabilities.includes(cap);
                return (
                  <button
                    key={cap}
                    type="button"
                    onClick={() => toggleCapability(cap)}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                      isSelected 
                        ? 'bg-orange-50/90 border-[#ea580c] text-[#0f2b48] shadow-xs ring-1 ring-[#ea580c]' 
                        : 'bg-slate-50/60 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-xs font-bold">{cap}</span>
                    <div className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 ml-2 ${
                      isSelected ? 'bg-[#ea580c] text-white' : 'border border-slate-300'
                    }`}>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom Other text if selected */}
            {selectedCapabilities.includes('Other') && (
              <div className="p-4 bg-orange-50/60 border border-orange-200 rounded-xl space-y-1.5 animate-in fade-in">
                <label className="block text-xs font-bold text-slate-800">
                  Specify Custom Other Capability <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={otherCapabilityText}
                  onChange={e => setOtherCapabilityText(e.target.value)}
                  placeholder="e.g., Submersible Acoustic Hydrophones & Marine Metallurgy"
                  className="w-full px-3 py-2 text-xs border border-orange-300 rounded-lg outline-hidden bg-white"
                />
                {errors.otherCapability && <p className="text-red-500 text-[11px] font-semibold">{errors.otherCapability}</p>}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 4 — REQUIREMENTS */}
        {/* ========================================================================= */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="border-b border-slate-100 pb-4">
              <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-900 font-extrabold text-[10px] uppercase rounded-md tracking-wider">
                Step 4 of 6
              </span>
              <h2 className="text-xl font-black text-[#0f2b48] mt-1.5">
                STEP 4 — Requirements & Readiness Criteria
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Define pilot budget parameters, infrastructure support, telemetry data access, and regulatory compliance.
              </p>
            </div>

            <div className="space-y-5 text-xs">
              {/* Budget Range & Team Capability */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 mb-1.5">
                    Budget Range Scope <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={budgetRange}
                    onChange={e => setBudgetRange(e.target.value)}
                    placeholder="e.g., ₹50 Lakhs - ₹1.5 Crores"
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl outline-hidden bg-white"
                  />
                  {errors.budgetRange && <p className="text-red-500 text-[11px] mt-1 font-semibold">{errors.budgetRange}</p>}
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1.5">
                    Expected Team Capability <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={expectedTeamCapability}
                    onChange={e => setExpectedTeamCapability(e.target.value)}
                    placeholder="e.g., Multidisciplinary core team with embedded firmware and hydro-modelling experience"
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl outline-hidden bg-white"
                  />
                  {errors.expectedTeamCapability && <p className="text-red-500 text-[11px] mt-1 font-semibold">{errors.expectedTeamCapability}</p>}
                </div>
              </div>

              {/* Infrastructure Available */}
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  Infrastructure Available (Govt Provided)
                </label>
                <textarea
                  rows={2}
                  value={infrastructureAvailable}
                  onChange={e => setInfrastructureAvailable(e.target.value)}
                  placeholder="Detail testbed facilities, pumping stations, sensor mounting locations, and utility power/network available to the pilot."
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl outline-hidden bg-white"
                />
              </div>

              {/* Data Availability */}
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  Data Availability
                </label>
                <textarea
                  rows={2}
                  value={dataAvailability}
                  onChange={e => setDataAvailability(e.target.value)}
                  placeholder="What public datasets, GIS maps, historical operational logs, or sensor telemetries will be shared with shortlisted startups under NDA?"
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl outline-hidden bg-white"
                />
              </div>

              {/* Security & Compliance Requirements */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 mb-1.5">
                    Security Requirements <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={securityRequirements}
                    onChange={e => setSecurityRequirements(e.target.value)}
                    placeholder="e.g., CERT-In empanelled audit, data localization inside India, AES-256 telemetry encryption, role-based access controls."
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl outline-hidden bg-white"
                  />
                  {errors.securityRequirements && <p className="text-red-500 text-[11px] mt-1 font-semibold">{errors.securityRequirements}</p>}
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1.5">
                    Compliance Requirements <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={complianceRequirements}
                    onChange={e => setComplianceRequirements(e.target.value)}
                    placeholder="e.g., DPIIT startup recognition certificate, GFR 173(i) turnover exemption eligibility, BIS/ISO laboratory test certificates."
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl outline-hidden bg-white"
                  />
                  {errors.complianceRequirements && <p className="text-red-500 text-[11px] mt-1 font-semibold">{errors.complianceRequirements}</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 5 — EVALUATION */}
        {/* ========================================================================= */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="border-b border-slate-100 pb-4">
              <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 font-extrabold text-[10px] uppercase rounded-md tracking-wider">
                Step 5 of 6
              </span>
              <h2 className="text-xl font-black text-[#0f2b48] mt-1.5">
                STEP 5 — Define Evaluation Criteria & Weights
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Configure the 6 standard criteria weights used by the Technical Evaluation Committee. Weights must sum to 100%.
              </p>
            </div>

            {/* Total Weight Status Bar */}
            <div className={`p-4 rounded-xl border flex items-center justify-between ${
              totalWeight === 100 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                : 'bg-amber-50 border-amber-300 text-amber-900'
            }`}>
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4" />
                <span className="text-xs font-bold">
                  Total Weight Allocated: <strong>{totalWeight}%</strong>
                </span>
                {totalWeight === 100 ? (
                  <span className="text-[10px] bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded-full font-extrabold">
                    Valid (100%)
                  </span>
                ) : (
                  <span className="text-[10px] bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full font-extrabold">
                    {totalWeight > 100 ? `Over by ${totalWeight - 100}%` : `Under by ${100 - totalWeight}%`}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={resetWeights}
                className="text-xs font-bold text-slate-700 hover:text-[#0f2b48] flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-slate-300 shadow-2xs"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset to Standard</span>
              </button>
            </div>

            {errors.weights && (
              <p className="text-red-500 text-xs font-bold">{errors.weights}</p>
            )}

            {/* 6 Criteria Sliders & Number Inputs */}
            <div className="space-y-4">
              
              {/* 1. Technical Capability */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-extrabold text-[#0f2b48]">1. Technical Capability</span>
                    <p className="text-[11px] text-slate-500">Core engineering competence, hardware/software stack maturity, and TRL level.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={weights.technicalCapability}
                      onChange={e => handleWeightChange('technicalCapability', parseInt(e.target.value))}
                      className="w-16 px-2 py-1 text-center font-black text-sm border border-slate-300 rounded-lg bg-white"
                    />
                    <span className="font-bold text-slate-500">%</span>
                  </div>
                </div>
                <input
                  type="range"
                  min={0}
                  max={60}
                  value={weights.technicalCapability}
                  onChange={e => handleWeightChange('technicalCapability', parseInt(e.target.value))}
                  className="w-full accent-[#ea580c]"
                />
              </div>

              {/* 2. Problem-Solution Fit */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-extrabold text-[#0f2b48]">2. Problem-Solution Fit</span>
                    <p className="text-[11px] text-slate-500">Direct addressing of specified department pain points and target success metrics.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={weights.problemSolutionFit}
                      onChange={e => handleWeightChange('problemSolutionFit', parseInt(e.target.value))}
                      className="w-16 px-2 py-1 text-center font-black text-sm border border-slate-300 rounded-lg bg-white"
                    />
                    <span className="font-bold text-slate-500">%</span>
                  </div>
                </div>
                <input
                  type="range"
                  min={0}
                  max={60}
                  value={weights.problemSolutionFit}
                  onChange={e => handleWeightChange('problemSolutionFit', parseInt(e.target.value))}
                  className="w-full accent-[#ea580c]"
                />
              </div>

              {/* 3. Innovation */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-extrabold text-[#0f2b48]">3. Innovation</span>
                    <p className="text-[11px] text-slate-500">Novelty of technological approach, intellectual property/patents, and superiority over incumbent methods.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={weights.innovation}
                      onChange={e => handleWeightChange('innovation', parseInt(e.target.value))}
                      className="w-16 px-2 py-1 text-center font-black text-sm border border-slate-300 rounded-lg bg-white"
                    />
                    <span className="font-bold text-slate-500">%</span>
                  </div>
                </div>
                <input
                  type="range"
                  min={0}
                  max={60}
                  value={weights.innovation}
                  onChange={e => handleWeightChange('innovation', parseInt(e.target.value))}
                  className="w-full accent-[#ea580c]"
                />
              </div>

              {/* 4. Scalability */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-extrabold text-[#0f2b48]">4. Scalability</span>
                    <p className="text-[11px] text-slate-500">Unit economics, manufacturing reproducibility, and viability to expand from pilot to state-wide deployment.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={weights.scalability}
                      onChange={e => handleWeightChange('scalability', parseInt(e.target.value))}
                      className="w-16 px-2 py-1 text-center font-black text-sm border border-slate-300 rounded-lg bg-white"
                    />
                    <span className="font-bold text-slate-500">%</span>
                  </div>
                </div>
                <input
                  type="range"
                  min={0}
                  max={60}
                  value={weights.scalability}
                  onChange={e => handleWeightChange('scalability', parseInt(e.target.value))}
                  className="w-full accent-[#ea580c]"
                />
              </div>

              {/* 5. Security */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-extrabold text-[#0f2b48]">5. Security & Cyber-defense</span>
                    <p className="text-[11px] text-slate-500">End-to-end encryption, Indian data localization, vulnerability testing, and role isolation.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={weights.security}
                      onChange={e => handleWeightChange('security', parseInt(e.target.value))}
                      className="w-16 px-2 py-1 text-center font-black text-sm border border-slate-300 rounded-lg bg-white"
                    />
                    <span className="font-bold text-slate-500">%</span>
                  </div>
                </div>
                <input
                  type="range"
                  min={0}
                  max={60}
                  value={weights.security}
                  onChange={e => handleWeightChange('security', parseInt(e.target.value))}
                  className="w-full accent-[#ea580c]"
                />
              </div>

              {/* 6. Execution Capability */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-extrabold text-[#0f2b48]">6. Execution Capability</span>
                    <p className="text-[11px] text-slate-500">Previous trial track record, key personnel credentials, and realistic milestone schedules.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={weights.executionCapability}
                      onChange={e => handleWeightChange('executionCapability', parseInt(e.target.value))}
                      className="w-16 px-2 py-1 text-center font-black text-sm border border-slate-300 rounded-lg bg-white"
                    />
                    <span className="font-bold text-slate-500">%</span>
                  </div>
                </div>
                <input
                  type="range"
                  min={0}
                  max={60}
                  value={weights.executionCapability}
                  onChange={e => handleWeightChange('executionCapability', parseInt(e.target.value))}
                  className="w-full accent-[#ea580c]"
                />
              </div>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 6 — REVIEW */}
        {/* ========================================================================= */}
        {currentStep === 6 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-900 font-extrabold text-[10px] uppercase rounded-md tracking-wider">
                  Final Step 6 of 6
                </span>
                <h2 className="text-xl font-black text-[#0f2b48] mt-1.5">
                  STEP 6 — Review & Verification Summary
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Carefully review the opportunity specification prior to publishing to the live ProcureSetu Opportunity Radar.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Edit Details
                </button>
              </div>
            </div>

            {/* Official Summary Card */}
            <div className="neu-card p-6 bg-gradient-to-br from-slate-50 via-white to-orange-50/30 border border-slate-200 rounded-2xl space-y-6">
              
              {/* Header Box */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-200">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-orange-100 text-[#ea580c] font-black text-[10px] rounded-md">
                      {sector}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs font-bold text-slate-700">{department}</span>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs text-slate-500">{ministry}</span>
                  </div>

                  <h3 className="text-lg font-black text-[#0f2b48] leading-snug">
                    {title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
                    <div>Budget: <strong className="text-slate-900 font-bold">{budgetRange}</strong></div>
                    <div>Timeline: <strong className="text-slate-900 font-bold">{expectedTimeline}</strong></div>
                    <div>Deadline: <strong className="text-slate-900 font-bold">{deadline}</strong></div>
                    <div>Min Readiness: <strong className="text-emerald-700 font-bold">TRL {trlRequired}</strong></div>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200/80 text-center shrink-0 shadow-2xs">
                  <div className="text-[10px] font-extrabold uppercase text-slate-400">Target Pathway</div>
                  <div className="text-xs font-black text-[#0f2b48] mt-0.5">GFR Rule 194</div>
                  <div className="text-[10px] text-emerald-700 font-semibold">Fast-Track Challenge</div>
                </div>
              </div>

              {/* 2-Column Summary Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                
                {/* Col 1: Problem & Scope */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                      Problem Statement
                    </span>
                    <p className="text-slate-800 leading-relaxed font-medium bg-white p-3 rounded-xl border border-slate-200">
                      {problemDescription}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                      Current Process & Pain Points
                    </span>
                    <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2 text-slate-700">
                      <div>
                        <strong className="text-[#0f2b48] block text-[11px]">Current Process:</strong>
                        <p>{currentProcess}</p>
                      </div>
                      <div>
                        <strong className="text-red-700 block text-[11px]">Pain Points:</strong>
                        <p>{painPoints}</p>
                      </div>
                      <div>
                        <strong className="text-emerald-700 block text-[11px]">Beneficiaries:</strong>
                        <p>{targetBeneficiaries}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Col 2: Outcomes & Capabilities */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                      Expected Outcome & Success Metrics
                    </span>
                    <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2 text-slate-700">
                      <div>
                        <strong className="text-[#0f2b48] block text-[11px]">Desired Outcome:</strong>
                        <p>{expectedOutcome}</p>
                      </div>
                      <div>
                        <strong className="text-emerald-700 block text-[11px]">Target Success Metrics:</strong>
                        <p>{successMetrics}</p>
                      </div>
                      <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                        Scope: {geographicScope} · Pop: {targetPopulation}
                      </div>
                    </div>
                  </div>

                  {/* Capabilities Tags */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                      Required Capabilities ({selectedCapabilities.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5 bg-white p-3 rounded-xl border border-slate-200">
                      {selectedCapabilities.map(c => (
                        <span key={c} className="px-2.5 py-1 bg-orange-100 text-[#ea580c] font-black text-xs rounded-lg border border-orange-200">
                          {c === 'Other' && otherCapabilityText ? `Other: ${otherCapabilityText}` : c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              {/* Evaluation Weights Bar Breakdown */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                  Evaluation Criteria Weighting
                </span>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-center">
                    <div className="text-[10px] font-semibold text-slate-500">Tech Capability</div>
                    <div className="text-base font-black text-[#0f2b48]">{weights.technicalCapability}%</div>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-center">
                    <div className="text-[10px] font-semibold text-slate-500">Problem-Solution Fit</div>
                    <div className="text-base font-black text-[#0f2b48]">{weights.problemSolutionFit}%</div>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-center">
                    <div className="text-[10px] font-semibold text-slate-500">Innovation</div>
                    <div className="text-base font-black text-[#0f2b48]">{weights.innovation}%</div>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-center">
                    <div className="text-[10px] font-semibold text-slate-500">Scalability</div>
                    <div className="text-base font-black text-[#0f2b48]">{weights.scalability}%</div>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-center">
                    <div className="text-[10px] font-semibold text-slate-500">Security</div>
                    <div className="text-base font-black text-[#0f2b48]">{weights.security}%</div>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-center">
                    <div className="text-[10px] font-semibold text-slate-500">Execution</div>
                    <div className="text-base font-black text-[#0f2b48]">{weights.executionCapability}%</div>
                  </div>
                </div>
              </div>

            </div>

            {/* Final Action Callout */}
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#ea580c] text-white flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="text-xs">
                  <div className="font-bold text-[#0f2b48]">Ready to Publish to Live Radar</div>
                  <p className="text-slate-600">
                    Publishing will register this challenge, index it for startup discovery matching, and notify relevant innovators.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handlePublish}
                className="px-6 py-2.5 text-xs font-black text-white bg-gradient-to-r from-[#ea580c] to-[#f97316] hover:from-[#c2410c] hover:to-[#ea580c] rounded-xl shadow-md transition-all neu-button shrink-0"
              >
                Publish Opportunity
              </button>
            </div>
          </div>
        )}

        {/* BOTTOM NAVIGATION BUTTONS */}
        <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handlePrev}
              className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous Step</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 6 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2 text-xs font-black text-white bg-[#0f2b48] hover:bg-[#16385c] rounded-xl shadow-xs transition-colors flex items-center gap-1.5 neu-button"
            >
              <span>Next: {steps[currentStep].label}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePublish}
              className="px-6 py-2 text-xs font-black text-white bg-[#ea580c] hover:bg-[#c2410c] rounded-xl shadow-md transition-colors flex items-center gap-1.5 neu-button"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Publish Opportunity</span>
            </button>
          )}
        </div>

      </div>

      {/* ========================================================================= */}
      {/* SUCCESS MODAL (Exact wording per user prompt) */}
      {/* "Opportunity Published" */}
      {/* "Relevant startups can now discover and apply." */}
      {/* Buttons: "View Opportunity", "Go to Dashboard" */}
      {/* ========================================================================= */}
      {showSuccessModal && publishedOpp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-5 text-center border border-slate-200 animate-in zoom-in-95 duration-200">
            
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-black text-[#0f2b48]">
                Opportunity Published
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                Relevant startups can now discover and apply.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-left text-xs space-y-1">
              <div className="font-extrabold text-[#0f2b48] truncate">{publishedOpp.title}</div>
              <div className="text-[11px] text-slate-500">Department: {publishedOpp.departmentName}</div>
              <div className="flex items-center gap-1.5 pt-1">
                <span className="px-2 py-0.5 bg-orange-100 text-[#ea580c] font-black text-[10px] rounded-md">
                  {publishedOpp.sector}
                </span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-md">
                  Status: Open on Radar
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowSuccessModal(false);
                  setSelectedOpportunityId(publishedOpp.id);
                  setActiveTab('opportunities');
                }}
                className="w-full py-2.5 text-xs font-bold text-[#0f2b48] bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Opportunity</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowSuccessModal(false);
                  setActiveTab('overview');
                }}
                className="w-full py-2.5 text-xs font-bold text-white bg-[#0f2b48] hover:bg-[#16385c] rounded-xl transition-colors shadow-xs flex items-center justify-center gap-1.5 neu-button"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Go to Dashboard</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
