import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Application, EvidenceItem, EvaluationCriteriaScores } from '../../types';
import { 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileCheck2, 
  FileText, 
  ArrowLeft, 
  Sparkles, 
  Lock, 
  Users, 
  Factory, 
  Globe2, 
  Briefcase, 
  ExternalLink, 
  ChevronRight, 
  ChevronLeft,
  Download, 
  Send, 
  XCircle, 
  Award, 
  Cpu, 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  History, 
  Hash, 
  Layers, 
  Check, 
  HelpCircle,
  Eye,
  Info,
  X
} from 'lucide-react';

interface Props {
  application: Application;
  onBack: () => void;
  onSelectApplication?: (app: Application) => void;
}

export const GovernmentEvaluationWorkspace: React.FC<Props> = ({ 
  application, 
  onBack,
  onSelectApplication 
}) => {
  const { 
    startups, 
    evidence, 
    opportunities, 
    currentUser, 
    applications,
    requestMoreInformation, 
    shortlistApplication, 
    rejectApplication, 
    moveApplicationToProcurementReady, 
    addToast 
  } = useApp();

  // Find associated startup profile
  const matchedStartup = startups.find(s => s.id === application.startupId) || 
    startups.find(s => s.companyName.toLowerCase() === application.startupName.toLowerCase()) || 
    startups[0];

  // Find associated opportunity
  const matchedOpp = opportunities.find(o => o.id === application.opportunityId) || opportunities[0];

  // Find attached and startup evidence items
  const attachedEvidenceItems = evidence.filter(e => 
    application.attachedEvidenceIds?.includes(e.id) ||
    e.startupId === application.startupId ||
    e.startupName.toLowerCase().includes(application.startupName.toLowerCase())
  );

  // Evaluation criteria scores state (6 canonical criteria: 0-20 each, total out of 100/120)
  const existingScores = application.evaluationScores;
  const [technicalCapabilityScore, setTechnicalCapabilityScore] = useState<number>(
    existingScores?.technicalCapability ?? (existingScores?.evidenceRigor ? Math.min(20, existingScores.evidenceRigor) : 18)
  );
  const [problemSolutionFitScore, setProblemSolutionFitScore] = useState<number>(
    existingScores?.problemSolutionFit ?? (existingScores?.problemAlignment ? Math.min(20, existingScores.problemAlignment) : 19)
  );
  const [innovationScore, setInnovationScore] = useState<number>(
    existingScores?.innovation ?? (existingScores?.technicalFeasibility ? Math.min(20, existingScores.technicalFeasibility) : 18)
  );
  const [scalabilityScore, setScalabilityScore] = useState<number>(
    existingScores?.scalability ?? (existingScores?.scalingCapacity ? Math.min(20, existingScores.scalingCapacity) : 17)
  );
  const [securityScore, setSecurityScore] = useState<number>(
    existingScores?.security ?? 19
  );
  const [executionCapabilityScore, setExecutionCapabilityScore] = useState<number>(
    existingScores?.executionCapability ?? 17
  );

  // Criterion individual comments
  const [criterionComments, setCriterionComments] = useState<Record<string, string>>({
    technicalCapability: existingScores?.comments?.technicalCapability || 'Verified NABL laboratory test results and hardware telemetry accuracy validated.',
    problemSolutionFit: existingScores?.comments?.problemSolutionFit || 'Directly addresses real-time arsenic detection threshold (<10 ppb) per JJM guidelines.',
    innovation: existingScores?.comments?.innovation || 'Reagentless optical microcavity reduces maintenance cycles to zero chemicals.',
    scalability: existingScores?.comments?.scalability || 'Compatible with rural LoRaWAN gateways and pan-India solar MPPT field units.',
    security: existingScores?.comments?.security || 'Hardware root-of-trust complies with Indian Smart Meter security guidelines IS 16444.',
    executionCapability: existingScores?.comments?.executionCapability || 'Team includes IISc/IIT alumni with dedicated assembly facility.'
  });

  const [activeCriterionCommentKey, setActiveCriterionCommentKey] = useState<string | null>(null);

  // Officer overall notes
  const [officerNotes, setOfficerNotes] = useState<string>(
    application.evaluatorNotes || 'Joint technical screening committee verified prototype benchmarks and GFR 173(i) DPIIT exemption status. Proposal demonstrates strong in-situ telemetry capabilities.'
  );

  // Modal actions
  const [actionModalType, setActionModalType] = useState<'clarify' | 'reject' | null>(null);
  const [clarificationInput, setClarificationInput] = useState<string>('');
  const [rejectionReason, setRejectionReason] = useState<string>('Insufficient technical benchmark evidence');
  const [rejectionCustomNotes, setRejectionCustomNotes] = useState<string>('');

  // Selected evidence item modal
  const [selectedEvidenceForInspect, setSelectedEvidenceForInspect] = useState<EvidenceItem | null>(null);

  // Calculate live composite score (scaled to 100%)
  const rawTotal = technicalCapabilityScore + problemSolutionFitScore + innovationScore + scalabilityScore + securityScore + executionCapabilityScore; // max 120
  const normalizedScore = Math.round((rawTotal / 120) * 100);

  const getScoreObject = (): EvaluationCriteriaScores => ({
    technicalCapability: technicalCapabilityScore,
    problemSolutionFit: problemSolutionFitScore,
    innovation: innovationScore,
    scalability: scalabilityScore,
    security: securityScore,
    executionCapability: executionCapabilityScore,
    comments: criterionComments,
    problemAlignment: Math.round((problemSolutionFitScore / 20) * 25),
    evidenceRigor: Math.round((technicalCapabilityScore / 20) * 25),
    technicalFeasibility: Math.round((innovationScore / 20) * 25),
    scalingCapacity: Math.round((scalabilityScore / 20) * 25),
    totalScore: normalizedScore
  });

  // Action handlers
  const handleRequestClarification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clarificationInput.trim()) {
      addToast('Please enter the information required from the startup.', 'warning');
      return;
    }
    requestMoreInformation(application.id, clarificationInput.trim());
    setActionModalType(null);
    setClarificationInput('');
  };

  const handleShortlist = () => {
    shortlistApplication(application.id, officerNotes, getScoreObject());
  };

  const handleReject = (e: React.FormEvent) => {
    e.preventDefault();
    rejectApplication(application.id, rejectionReason, rejectionCustomNotes || officerNotes);
    setActionModalType(null);
  };

  const handleMoveToProcurementReady = () => {
    moveApplicationToProcurementReady(application.id, officerNotes, getScoreObject());
  };

  // Navigation between applications
  const currentIndex = applications.findIndex(a => a.id === application.id);
  const prevApp = currentIndex > 0 ? applications[currentIndex - 1] : null;
  const nextApp = currentIndex < applications.length - 1 ? applications[currentIndex + 1] : null;

  // AI-assisted insights generation (descriptive, not prescriptive)
  const aiInsights = [
    {
      title: 'Capability Alignment',
      text: 'Relevant capability found in startup profile: Sub-ppb Spectrophotometry & Solar LoRaWAN Telemetry directly mapped to opportunity requirements.',
      tone: 'positive'
    },
    {
      title: 'Evidence Coverage',
      text: `${attachedEvidenceItems.length} evidence documents relate directly to the requirement, including third-party laboratory test reports.`,
      tone: 'positive'
    },
    {
      title: 'Deployment Track Record',
      text: matchedStartup?.governmentExperience?.includes('Pilot') || application.confirmedProfileSnapshot?.companyName?.includes('AquaSens')
        ? 'Startup has completed 1 previous verified pilot stage deployment with Jal Jeevan Mission.'
        : 'Startup has no previous government deployment. Fully eligible under GFR Rule 173(i) turnover & experience waiver.',
      tone: 'neutral'
    },
    {
      title: 'Technical Benchmarks',
      text: 'Technical benchmark evidence available: CSIR-NEERI ICP-MS concordance protocol report on file with 99.4% precision.',
      tone: 'positive'
    }
  ];

  return (
    <div className="space-y-6">
      {/* ================= TOP WORKSPACE HEADER ================= */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all flex items-center gap-1.5 font-bold text-xs cursor-pointer border border-slate-200"
            >
              <ArrowLeft className="w-4 h-4 text-[#ea580c]" />
              <span>Back to Queue</span>
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-[#0f2b48] text-white text-[10px] font-black uppercase rounded-md tracking-wider">
                  Government Evaluation Workspace
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  App #{application.id}
                </span>
              </div>
              <h1 className="text-lg font-black text-[#0f2b48] mt-0.5">
                {application.startupName}
              </h1>
            </div>
          </div>

          {/* Status pill & cycle buttons */}
          <div className="flex items-center gap-2">
            {/* Status indicator */}
            <span className={`px-3 py-1 text-xs font-black uppercase rounded-xl border flex items-center gap-1.5 ${
              application.status === 'procurement_ready' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
              application.status === 'shortlisted' ? 'bg-purple-50 text-purple-800 border-purple-300' :
              application.status === 'needs_clarification' ? 'bg-amber-50 text-amber-800 border-amber-300' :
              application.status === 'rejected' ? 'bg-rose-50 text-rose-800 border-rose-300' :
              'bg-blue-50 text-blue-800 border-blue-300'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                application.status === 'procurement_ready' ? 'bg-emerald-500' :
                application.status === 'shortlisted' ? 'bg-purple-500' :
                application.status === 'needs_clarification' ? 'bg-amber-500' :
                application.status === 'rejected' ? 'bg-rose-500' : 'bg-blue-500'
              }`}></span>
              <span>{application.status.replace('_', ' ')}</span>
            </span>

            {/* Quick app switcher */}
            {onSelectApplication && (
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
                <button
                  disabled={!prevApp}
                  onClick={() => prevApp && onSelectApplication(prevApp)}
                  className={`p-1.5 rounded-lg ${prevApp ? 'hover:bg-white text-slate-700 cursor-pointer' : 'text-slate-300 cursor-not-allowed'}`}
                  title={prevApp ? `Previous: ${prevApp.startupName}` : 'No previous application'}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-[11px] font-bold text-slate-500 px-1">
                  {currentIndex + 1} of {applications.length}
                </span>
                <button
                  disabled={!nextApp}
                  onClick={() => nextApp && onSelectApplication(nextApp)}
                  className={`p-1.5 rounded-lg ${nextApp ? 'hover:bg-white text-slate-700 cursor-pointer' : 'text-slate-300 cursor-not-allowed'}`}
                  title={nextApp ? `Next: ${nextApp.startupName}` : 'No next application'}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Opportunity Context Bar */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs">
          <div>
            <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider block">Target Opportunity:</span>
            <span className="font-bold text-[#0f2b48]">{application.opportunityTitle}</span>
            <span className="text-slate-500 ml-2">({application.departmentName})</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-slate-600">
            <div>Submitted: <strong className="text-slate-800">{application.submittedAt}</strong></div>
            <div>Proposed TRL: <strong className="text-emerald-700">TRL {application.trlProposed}</strong></div>
            <div>Attached Evidence: <strong className="text-blue-700">{attachedEvidenceItems.length} files</strong></div>
          </div>
        </div>
      </div>

      {/* ================= 3-COLUMN WORKSPACE GRID ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* ======================================================== */}
        {/* LEFT COLUMN (3.5 cols): STARTUP INFORMATION & AI INSIGHTS */}
        {/* ======================================================== */}
        <div className="lg:col-span-3 space-y-5">
          {/* SECTION 1: STARTUP OVERVIEW */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-4 bg-[#0f2b48] rounded-full"></span>
                <h3 className="text-xs font-black text-[#0f2b48] uppercase tracking-wider">
                  1. Startup Overview
                </h3>
              </div>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                DPIIT Recognized
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Entity Name</span>
                <span className="font-bold text-slate-900 text-sm">{matchedStartup.companyName}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Registration</span>
                  <span className="font-mono text-slate-800 font-semibold text-[11px]">{matchedStartup.registrationNumber || 'U74999KA2022PTC158902'}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">DPIIT Number</span>
                  <span className="font-bold text-[#ea580c] text-[11px]">{matchedStartup.dpiitNumber || 'DIPP-89421-IN'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Founded</span>
                  <span className="font-semibold text-slate-800">{matchedStartup.foundedYear || 2022} ({new Date().getFullYear() - (matchedStartup.foundedYear || 2022)} yrs)</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Stage</span>
                  <span className="font-bold text-blue-800">{matchedStartup.stage || 'Growth'}</span>
                </div>
              </div>

              <div className="pt-1 border-t border-slate-100">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Location</span>
                <span className="font-medium text-slate-800">{matchedStartup.headquarters || 'Bengaluru, Karnataka'}</span>
              </div>

              <div className="pt-1 border-t border-slate-100">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Founder / Lead</span>
                <span className="font-bold text-slate-900">{matchedStartup.founderName || 'Vikramaditya Roy'}</span>
              </div>

              <div className="pt-1 border-t border-slate-100">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Team Size</span>
                <span className="font-semibold text-slate-800 text-[11px] leading-tight block">{matchedStartup.teamSize || '18 Engineers & Scientists'}</span>
              </div>

              <div className="pt-1 border-t border-slate-100 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Core Capabilities</span>
                <div className="flex flex-wrap gap-1">
                  {(matchedStartup.coreCapabilities || [
                    'Optoelectronics & Spectrophotometry',
                    'Edge Computing Firmware',
                    'Zero-Reagent Microfluidics'
                  ]).slice(0, 4).map((cap, i) => (
                    <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-medium">
                      {cap}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 5: RELEVANT EXPERIENCE */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-4 bg-[#0f2b48] rounded-full"></span>
                <h3 className="text-xs font-black text-[#0f2b48] uppercase tracking-wider">
                  5. Relevant Experience
                </h3>
              </div>
              <span className="text-[10px] font-bold text-slate-500">Track Record</span>
            </div>

            <div className="space-y-3 text-xs">
              {/* Government deployments */}
              <div className="space-y-1.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                  <span>Government Deployments</span>
                  <span className="text-emerald-700 font-bold">1 Verified Record</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80 space-y-1">
                  <div className="font-bold text-slate-900 text-[11px]">
                    Chengalpattu District Jal Jeevan Telemetry Pilot (12 Units)
                  </div>
                  <div className="text-[10px] text-slate-600">
                    Dept: Department of Drinking Water & Sanitation (JJM) · Year: 2025
                  </div>
                  <div className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Audited by IIT Madras & DWSM
                  </div>
                </div>
              </div>

              {/* Private deployments */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Private / Industry Deployments
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80 space-y-1">
                  <div className="font-bold text-slate-900 text-[11px]">
                    Tata Steel Utilities Heavy Metal Effluent Monitoring
                  </div>
                  <div className="text-[10px] text-slate-500">
                    6 Months Continuous In-Situ Industrial Operation (Jamshedpur)
                  </div>
                </div>
              </div>

              {/* Domain Experience */}
              <div className="p-2.5 bg-blue-50/70 border border-blue-200 rounded-lg text-blue-950 space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider block">Domain Experience</span>
                <p className="text-[11px] leading-relaxed">
                  4+ years dedicated spectrometry R&D with 18,000+ operational hours logged across rural pipe networks.
                </p>
              </div>

              {/* Statutory Exemption Note */}
              <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-950 text-[10px] flex items-start gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>GFR 173(i) Turnover & Prior Exp Exempt:</strong> First-time innovators qualify with equal score weight.
                </span>
              </div>
            </div>
          </div>

          {/* AI-ASSISTED INSIGHTS PANEL (Non-prescriptive observations per user request) */}
          <div className="p-4 bg-gradient-to-br from-indigo-900 to-[#0f2b48] text-white rounded-2xl shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-orange-400" />
                <h3 className="text-xs font-black uppercase tracking-wider text-white">
                  AI-assisted insights
                </h3>
              </div>
              <span className="text-[9px] px-2 py-0.5 bg-white/15 rounded text-slate-300 font-bold uppercase">
                Advisory Only
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              {aiInsights.map((insight, idx) => (
                <div key={idx} className="p-2.5 bg-white/10 rounded-xl border border-white/10 space-y-0.5">
                  <div className="font-bold text-orange-300 text-[11px] flex items-center gap-1.5">
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>{insight.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-200 leading-relaxed">
                    "{insight.text}"
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-white/10 text-[10px] text-slate-300 leading-tight">
              <strong>Human-in-the-Loop Mandate:</strong> The government evaluator makes the decision. AI provides pattern matching and factual verification summaries only.
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* CENTER COLUMN (5 cols): SOLUTION PROPOSAL & EXECUTION */}
        {/* ======================================================== */}
        <div className="lg:col-span-5 space-y-5">
          {/* SECTION 2: PROBLEM UNDERSTANDING */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-4 bg-[#ea580c] rounded-full"></span>
                <h3 className="text-xs font-black text-[#0f2b48] uppercase tracking-wider">
                  2. Problem Understanding
                </h3>
              </div>
              <span className="text-xs font-bold text-slate-600">Challenge Analysis</span>
            </div>

            <div className="space-y-2.5 text-xs text-slate-700">
              <div>
                <span className="text-slate-400 font-bold uppercase text-[10px] block">Solution Name</span>
                <h4 className="text-sm font-black text-slate-900">
                  {application.solutionName || 'JalRakshak-200 Autonomous Inline Arsenic Analyzer'}
                </h4>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                <span className="font-bold text-slate-900 block text-[11px]">Problem Understanding & Domain Bottlenecks:</span>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  {application.problemUnderstanding || 
                    'Groundwater across alluvial river basins suffers seasonal trace heavy metal and Arsenic III/V contamination. Conventional central laboratory testing incurs 14 to 30 day delays, exposing rural households to contaminated water before corrective action can be taken. The startup’s proposal addresses the need for automated continuous field telemetry without laboratory reagent replenishment.'}
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 3: PROPOSED SOLUTION */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-4 bg-[#ea580c] rounded-full"></span>
                <h3 className="text-xs font-black text-[#0f2b48] uppercase tracking-wider">
                  3. Proposed Solution
                </h3>
              </div>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-900 rounded font-bold text-[10px]">
                TRL {application.trlProposed} Proposed
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <span className="font-bold text-slate-900 text-[11px] block">Proposed Approach:</span>
                <p className="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                  {application.proposedApproach || application.solutionSummary || 
                    'Utilizes dual-wavelength optoelectronic micro-spectrophotometry within a reagentless flow-through optical cell. Real-time edge inference algorithm computes arsenic ion concentration and transmits encrypted telemetry via LoRaWAN/NB-IoT to the district Jal Jeevan Mission dashboard.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1">
                  <span className="font-bold text-emerald-950 text-[11px] block">Expected Impact:</span>
                  <p className="text-emerald-900 text-[11px] leading-relaxed">
                    {application.expectedImpact || 'Eliminates 30-day testing latency; issues automated SMS & SCADA shutoff triggers within 15 minutes of contamination threshold crossing.'}
                  </p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="font-bold text-slate-900 text-[11px] block">Deployment Requirements:</span>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    {application.deploymentRequirements || 'Requires standard 1.5-inch pipeline clamp-on tap, solar panel mounting clearance, and 4G or LoRaWAN gateway coverage.'}
                  </p>
                </div>
              </div>

              {/* Execution details */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                <span className="font-bold text-[#0f2b48] block text-[11px]">Execution Plan & Infrastructure:</span>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold">Team Allocation:</span>
                    <span className="text-slate-800">{application.executionTeam || '3 Systems Engineers, 2 Field Technicians'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold">Pilot Timeline:</span>
                    <span className="text-slate-800">{application.executionTimeline || '90 Calendar Days In-situ Trial'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold">Hardware Sourcing:</span>
                    <span className="text-slate-800">{application.executionInfrastructure || 'Indian SMT fabrication, Class 100 cleanroom'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold">Dependencies:</span>
                    <span className="text-slate-800">{application.executionDependencies || 'District water board pipeline access permission'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 6: SECURITY / COMPLIANCE */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-4 bg-emerald-600 rounded-full"></span>
                <h3 className="text-xs font-black text-[#0f2b48] uppercase tracking-wider">
                  6. Security / Compliance
                </h3>
              </div>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded font-bold text-[10px]">
                CERT-In Audited
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Hardware Cryptography</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Hardware Secure Element (AES-256 / SHA-256) embedded on board; tamper-evident casing triggers auto-wipe on physical breach.
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>Statutory Standards</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  BIS IS 10500:2012 water standards compliance; ISO 9001 certified electronics assembly; CE & RoHS compliant circuitry.
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Globe2 className="w-3.5 h-3.5 text-[#ea580c]" />
                  <span>Data Sovereignty</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  100% Indian data localization; telemetry ingestion routed to State Data Centre / National Informatics Centre (NIC) cloud.
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <FileCheck2 className="w-3.5 h-3.5 text-purple-600" />
                  <span>GFR 173(i) Eligibility</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  DPIIT Startup India Certificate DIPP-89421-IN exempts startup from prior turnover and experience tender prerequisites.
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 7: COMMERCIAL PROPOSAL */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-4 bg-emerald-600 rounded-full"></span>
                <h3 className="text-xs font-black text-[#0f2b48] uppercase tracking-wider">
                  7. Commercial Proposal
                </h3>
              </div>
              <span className="font-mono font-bold text-emerald-800 text-sm">
                {application.estimatedCost || '₹65,00,000 (Fixed Price Pilot)'}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">Pricing Model</span>
                  <span className="font-bold text-slate-900">{application.pricingModel || 'Milestone Deliverable-Based Pilot Escrow'}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">Budget Bracket</span>
                  <span className="font-semibold text-slate-700">{matchedOpp.budgetEstimate || '₹65L - ₹1.85 Cr'}</span>
                </div>
              </div>

              {/* Milestone Tranches */}
              <div className="space-y-1.5">
                <span className="font-bold text-slate-800 text-[11px] block">Proposed Milestone Payout Tranches:</span>
                <div className="space-y-1.5">
                  {(application.milestoneProposals && application.milestoneProposals.length > 0 ? application.milestoneProposals : [
                    { title: 'Milestone 1: Baseline Calibration & Pre-Installation Survey', amount: '₹18,50,000', dueDate: 'Month 1' },
                    { title: 'Milestone 2: Hardware Delivery & 60-Day In-situ Telemetry Feed', amount: '₹28,00,000', dueDate: 'Month 3' },
                    { title: 'Milestone 3: Third-Party NABL Performance Audit & Final Handover', amount: '₹18,50,000', dueDate: 'Month 4' }
                  ]).map((ms, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-[11px]">
                      <div>
                        <strong className="text-slate-900 block">{ms.title}</strong>
                        <span className="text-slate-500 text-[10px]">Due: {ms.dueDate}</span>
                      </div>
                      <span className="font-mono font-bold text-emerald-700 bg-white px-2 py-1 rounded border border-slate-200">
                        {ms.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN (3.5 cols): EVIDENCE, SCORING & DECISION */}
        {/* ======================================================== */}
        <div className="lg:col-span-4 space-y-5">
          {/* SECTION 4: CAPABILITY EVIDENCE */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-4 bg-[#0f2b48] rounded-full"></span>
                <h3 className="text-xs font-black text-[#0f2b48] uppercase tracking-wider">
                  4. Capability Evidence
                </h3>
              </div>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-900 font-bold text-[10px] rounded">
                {attachedEvidenceItems.length} Artifacts
              </span>
            </div>

            <p className="text-[11px] text-slate-500">
              Click any artifact to inspect cryptographic SHA-256 hash, issuing authority, and nodal verification notes.
            </p>

            <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
              {attachedEvidenceItems.map(item => {
                const isVerified = item.verificationStatus === 'verified';
                const isPending = item.verificationStatus === 'pending_verification';

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedEvidenceForInspect(item)}
                    className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all cursor-pointer space-y-1.5 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-white text-[#0f2b48] font-bold text-[9px] rounded border border-slate-200 uppercase">
                        {item.evidenceType || 'Benchmark'}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 ${
                        isVerified ? 'bg-emerald-100 text-emerald-800' :
                        isPending ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {isVerified ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Clock className="w-3 h-3 text-amber-600" />}
                        <span>{isVerified ? 'Verified' : 'Pending'}</span>
                      </span>
                    </div>

                    <h5 className="font-bold text-slate-900 text-xs line-clamp-1 group-hover:text-[#ea580c]">
                      {item.title}
                    </h5>

                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span>{item.issuingAuthority}</span>
                      <span className="font-bold text-[#ea580c] flex items-center">
                        Inspect <ChevronRight className="w-3 h-3 ml-0.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 8: EVALUATION CRITERIA (6 Canonical Criteria) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-4 bg-[#ea580c] rounded-full"></span>
                <h3 className="text-xs font-black text-[#0f2b48] uppercase tracking-wider">
                  8. Evaluation Criteria
                </h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Composite Score</span>
                <span className="text-base font-black text-emerald-700">
                  {normalizedScore} / 100
                </span>
              </div>
            </div>

            <div className="space-y-3.5 text-xs">
              {/* 1. Technical Capability */}
              <div className="space-y-1">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-slate-800">1. Technical Capability</span>
                  <span className="font-bold text-[#0f2b48]">{technicalCapabilityScore} / 20</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={20}
                  value={technicalCapabilityScore}
                  onChange={(e) => setTechnicalCapabilityScore(Number(e.target.value))}
                  className="w-full accent-[#ea580c]"
                />
                <input
                  type="text"
                  placeholder="Notes on technical capability..."
                  value={criterionComments.technicalCapability || ''}
                  onChange={(e) => setCriterionComments({ ...criterionComments, technicalCapability: e.target.value })}
                  className="w-full px-2.5 py-1 text-[11px] bg-slate-50 border border-slate-200 rounded-md outline-hidden text-slate-700"
                />
              </div>

              {/* 2. Problem-Solution Fit */}
              <div className="space-y-1">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-slate-800">2. Problem-Solution Fit</span>
                  <span className="font-bold text-[#0f2b48]">{problemSolutionFitScore} / 20</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={20}
                  value={problemSolutionFitScore}
                  onChange={(e) => setProblemSolutionFitScore(Number(e.target.value))}
                  className="w-full accent-[#ea580c]"
                />
                <input
                  type="text"
                  placeholder="Notes on problem-solution fit..."
                  value={criterionComments.problemSolutionFit || ''}
                  onChange={(e) => setCriterionComments({ ...criterionComments, problemSolutionFit: e.target.value })}
                  className="w-full px-2.5 py-1 text-[11px] bg-slate-50 border border-slate-200 rounded-md outline-hidden text-slate-700"
                />
              </div>

              {/* 3. Innovation */}
              <div className="space-y-1">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-slate-800">3. Innovation</span>
                  <span className="font-bold text-[#0f2b48]">{innovationScore} / 20</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={20}
                  value={innovationScore}
                  onChange={(e) => setInnovationScore(Number(e.target.value))}
                  className="w-full accent-[#ea580c]"
                />
                <input
                  type="text"
                  placeholder="Notes on technological innovation..."
                  value={criterionComments.innovation || ''}
                  onChange={(e) => setCriterionComments({ ...criterionComments, innovation: e.target.value })}
                  className="w-full px-2.5 py-1 text-[11px] bg-slate-50 border border-slate-200 rounded-md outline-hidden text-slate-700"
                />
              </div>

              {/* 4. Scalability */}
              <div className="space-y-1">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-slate-800">4. Scalability</span>
                  <span className="font-bold text-[#0f2b48]">{scalabilityScore} / 20</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={20}
                  value={scalabilityScore}
                  onChange={(e) => setScalabilityScore(Number(e.target.value))}
                  className="w-full accent-[#ea580c]"
                />
                <input
                  type="text"
                  placeholder="Notes on production/scaling readiness..."
                  value={criterionComments.scalability || ''}
                  onChange={(e) => setCriterionComments({ ...criterionComments, scalability: e.target.value })}
                  className="w-full px-2.5 py-1 text-[11px] bg-slate-50 border border-slate-200 rounded-md outline-hidden text-slate-700"
                />
              </div>

              {/* 5. Security */}
              <div className="space-y-1">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-slate-800">5. Security</span>
                  <span className="font-bold text-[#0f2b48]">{securityScore} / 20</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={20}
                  value={securityScore}
                  onChange={(e) => setSecurityScore(Number(e.target.value))}
                  className="w-full accent-[#ea580c]"
                />
                <input
                  type="text"
                  placeholder="Notes on cybersecurity & data protection..."
                  value={criterionComments.security || ''}
                  onChange={(e) => setCriterionComments({ ...criterionComments, security: e.target.value })}
                  className="w-full px-2.5 py-1 text-[11px] bg-slate-50 border border-slate-200 rounded-md outline-hidden text-slate-700"
                />
              </div>

              {/* 6. Execution Capability */}
              <div className="space-y-1">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-slate-800">6. Execution Capability</span>
                  <span className="font-bold text-[#0f2b48]">{executionCapabilityScore} / 20</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={20}
                  value={executionCapabilityScore}
                  onChange={(e) => setExecutionCapabilityScore(Number(e.target.value))}
                  className="w-full accent-[#ea580c]"
                />
                <input
                  type="text"
                  placeholder="Notes on team competence and manufacturing capacity..."
                  value={criterionComments.executionCapability || ''}
                  onChange={(e) => setCriterionComments({ ...criterionComments, executionCapability: e.target.value })}
                  className="w-full px-2.5 py-1 text-[11px] bg-slate-50 border border-slate-200 rounded-md outline-hidden text-slate-700"
                />
              </div>
            </div>
          </div>

          {/* SECTION 9: OFFICER NOTES */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-4 bg-[#0f2b48] rounded-full"></span>
                <h3 className="text-xs font-black text-[#0f2b48] uppercase tracking-wider">
                  9. Officer Notes
                </h3>
              </div>
              <span className="text-[10px] text-slate-400 font-semibold">Audit Record</span>
            </div>

            <textarea
              rows={3}
              value={officerNotes}
              onChange={(e) => setOfficerNotes(e.target.value)}
              placeholder="Enter comprehensive evaluator remarks, committee deliberation minutes, and feedback for the procurement file..."
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium leading-relaxed outline-hidden focus:ring-2 focus:ring-[#0f2b48]"
            />
          </div>

          {/* SECTION 10: DECISION (4 ACTIONS) */}
          <div className="bg-white rounded-2xl border-2 border-[#0f2b48] p-4 shadow-md space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-4 bg-[#ea580c] rounded-full"></span>
                <h3 className="text-xs font-black text-[#0f2b48] uppercase tracking-wider">
                  10. Official Decision
                </h3>
              </div>
              <span className="text-[10px] font-bold text-slate-500">
                Action Mandate
              </span>
            </div>

            <p className="text-[11px] text-slate-600">
              Record official committee decision. Selected action updates status, triggers statutory notification, records tamper-proof audit log, and persists to local storage.
            </p>

            {/* 4 ACTION BUTTONS */}
            <div className="space-y-2 pt-1">
              {/* Action 1: Request More Information */}
              <button
                onClick={() => setActionModalType('clarify')}
                className="w-full py-2.5 px-3 text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
              >
                <HelpCircle className="w-4 h-4 text-amber-600" />
                <span>Request More Information</span>
              </button>

              {/* Action 2: Shortlist */}
              <button
                onClick={handleShortlist}
                className="w-full py-2.5 px-3 text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
              >
                <Award className="w-4 h-4 text-purple-200" />
                <span>Shortlist for Pilot</span>
              </button>

              {/* Action 3: Reject */}
              <button
                onClick={() => setActionModalType('reject')}
                className="w-full py-2.5 px-3 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
              >
                <XCircle className="w-4 h-4 text-rose-600" />
                <span>Reject Application</span>
              </button>

              {/* Action 4: Move to Procurement Readiness */}
              <button
                onClick={handleMoveToProcurementReady}
                className="w-full py-2.5 px-3 text-xs font-black text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-200" />
                <span>Move to Procurement Readiness</span>
              </button>
            </div>

            {/* Audit Log Trail Summary */}
            {application.auditLog && application.auditLog.length > 0 && (
              <div className="pt-3 border-t border-slate-100 space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Audit History ({application.auditLog.length} actions)
                </span>
                <div className="space-y-1 max-h-[120px] overflow-y-auto text-[10px] text-slate-600">
                  {application.auditLog.map((log) => (
                    <div key={log.id} className="p-1.5 bg-slate-50 rounded border border-slate-200/80">
                      <div className="flex items-center justify-between font-bold text-slate-800">
                        <span>{log.action}</span>
                        <span className="text-slate-400 font-mono text-[9px]">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="text-slate-500">{log.performedBy} ({log.role})</div>
                      {log.notes && <div className="text-slate-700 italic truncate mt-0.5">"{log.notes}"</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= MODAL: REQUEST MORE INFORMATION ================= */}
      {actionModalType === 'clarify' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4 border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-black text-[#0f2b48]">
                  Request Clarification from Startup
                </h3>
              </div>
              <button 
                onClick={() => setActionModalType(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRequestClarification} className="space-y-3.5 text-xs">
              <p className="text-slate-600 leading-relaxed">
                Specify the additional data or technical evidence required from <strong>{application.startupName}</strong>. The application status will be updated to <em>Needs Clarification</em> and an immediate notification will be issued to the startup dashboard.
              </p>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Required Information / Clarification Note *
                </label>
                <textarea
                  rows={4}
                  required
                  value={clarificationInput}
                  onChange={(e) => setClarificationInput(e.target.value)}
                  placeholder="e.g. Please upload raw spectral CSV logs for sample batch #4, or clarify whether the battery subsystem can withstand ambient operating temperatures above 45°C..."
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-300 rounded-xl outline-hidden focus:ring-2 focus:ring-amber-500 font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActionModalType(null)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-2xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Clarification Request</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: REJECT APPLICATION ================= */}
      {actionModalType === 'reject' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4 border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-rose-600" />
                <h3 className="text-base font-black text-[#0f2b48]">
                  Reject Application
                </h3>
              </div>
              <button 
                onClick={() => setActionModalType(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReject} className="space-y-3.5 text-xs">
              <p className="text-slate-600 leading-relaxed">
                Provide the formal justification for not selecting <strong>{application.startupName}</strong> for this opportunity. This creates a statutory audit record in the procurement archive.
              </p>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Primary Rejection Reason *
                </label>
                <select
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-semibold text-slate-800"
                >
                  <option value="Insufficient technical benchmark evidence">Insufficient technical benchmark evidence</option>
                  <option value="Proposed approach does not meet BIS / JJM operational standards">Proposed approach does not meet BIS / JJM operational standards</option>
                  <option value="Cost estimate outside allocated budget envelope">Cost estimate outside allocated budget envelope</option>
                  <option value="Incompatible telemetry infrastructure requirements">Incompatible telemetry infrastructure requirements</option>
                  <option value="TRL level below required operational threshold">TRL level below required operational threshold</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Evaluator Observations & Feedback (Sent to Startup)
                </label>
                <textarea
                  rows={3}
                  value={rejectionCustomNotes}
                  onChange={(e) => setRejectionCustomNotes(e.target.value)}
                  placeholder="Detail the technical rationale or recommendations for future challenge opportunities..."
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl outline-hidden focus:ring-2 focus:ring-rose-500 font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActionModalType(null)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-2xs"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EVIDENCE INSPECTION ================= */}
      {selectedEvidenceForInspect && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4 border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-900 text-[10px] font-bold rounded uppercase">
                  {selectedEvidenceForInspect.evidenceType || 'Benchmark'}
                </span>
                <h3 className="text-sm font-black text-[#0f2b48] mt-1">
                  {selectedEvidenceForInspect.title}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedEvidenceForInspect(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5">
                <div>Source: <strong className="text-slate-900">{selectedEvidenceForInspect.evidenceSource || selectedEvidenceForInspect.issuingAuthority}</strong></div>
                <div>Authority: <span className="font-semibold text-slate-800">{selectedEvidenceForInspect.issuingAuthority}</span></div>
                <div>Ref / Cert: <span className="font-mono font-bold text-slate-900">{selectedEvidenceForInspect.documentRef}</span></div>
                <div>Uploaded: <span className="text-slate-700">{selectedEvidenceForInspect.uploadedDate || selectedEvidenceForInspect.issueDate}</span></div>
                <div>Verified: <span className="text-emerald-700 font-bold">{selectedEvidenceForInspect.verifiedAt || 'Verified on Record'}</span></div>
                <div>Verifier Role: <span className="text-slate-800 font-medium">{selectedEvidenceForInspect.verifierRole || selectedEvidenceForInspect.verifiedByGovtDept || 'Nodal Technical Assessor'}</span></div>
              </div>

              <div>
                <span className="text-slate-500 font-bold text-[10px] uppercase block">Cryptographic SHA-256 Hash</span>
                <p className="font-mono text-[9px] p-2 bg-slate-900 text-emerald-400 rounded-lg break-all select-all mt-0.5">
                  {selectedEvidenceForInspect.cryptographicHash}
                </p>
              </div>

              <div>
                <span className="text-slate-500 font-bold text-[10px] uppercase block">Technical Claim</span>
                <p className="text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200 mt-0.5 leading-relaxed text-[11px]">
                  {selectedEvidenceForInspect.summary}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  addToast(`Artifact ${selectedEvidenceForInspect.title} downloaded.`, 'success');
                  setSelectedEvidenceForInspect(null);
                }}
                className="px-3.5 py-1.5 text-xs font-bold text-[#0f2b48] bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Artifact</span>
              </button>
              <button
                onClick={() => setSelectedEvidenceForInspect(null)}
                className="px-4 py-1.5 text-xs font-bold text-white bg-[#0f2b48] rounded-lg"
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
