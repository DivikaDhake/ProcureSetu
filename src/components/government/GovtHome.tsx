import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Opportunity, StartupProfile, Application } from '../../types';
import { GovernmentEvaluationWorkspace } from './GovernmentEvaluationWorkspace';
import { 
  Building2, 
  FileText, 
  Users, 
  Award, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Search, 
  ArrowRight, 
  Sparkles, 
  ExternalLink, 
  Calendar,
  AlertCircle,
  Eye,
  X,
  FileCheck2,
  ChevronRight,
  TrendingUp,
  Cpu
} from 'lucide-react';

export const GovtHome: React.FC = () => {
  const { 
    currentUser, 
    opportunities, 
    applications, 
    startups, 
    evidence, 
    milestones, 
    setActiveTab, 
    evaluateApplication,
    markProcurementReady,
    verifyEvidence,
    approveMilestone,
    addToast 
  } = useApp();

  // Modals state
  const [selectedStartupForModal, setSelectedStartupForModal] = useState<StartupProfile | null>(null);
  const [evaluatingApp, setEvaluatingApp] = useState<Application | null>(null);
  const [scoreAlignment, setScoreAlignment] = useState(24);
  const [scoreEvidence, setScoreEvidence] = useState(25);
  const [scoreFeasibility, setScoreFeasibility] = useState(23);
  const [scoreScaling, setScoreScaling] = useState(22);
  const [evaluatorNotes, setEvaluatorNotes] = useState('');

  // KPIs
  const activeOpportunitiesCount = opportunities.filter(o => o.status === 'open').length;
  const applicationsReceivedCount = applications.length;
  const startupsUnderEvaluationCount = applications.filter(a => a.status === 'under_review' || a.status === 'evidence_verified' || a.status === 'technical_evaluation' || a.status === 'submitted').length;
  const procurementReadyCount = applications.filter(a => a.status === 'procurement_ready').length;
  const activeMilestonesCount = milestones.filter(m => m.status === 'in_progress' || m.status === 'submitted_for_approval').length;

  // The 5 specified opportunities
  const targetOpportunityTitles = [
    'Smart Water Leakage Detection',
    'AI Road Damage Detection',
    'Waste Segregation Optimization',
    'Digital Citizen Grievance Intelligence',
    'Solar Asset Monitoring'
  ];

  const problemOverviewOpps = targetOpportunityTitles.map(title => {
    return opportunities.find(o => o.title.toLowerCase().includes(title.toLowerCase())) || {
      id: `opp_gen_${title.replace(/\s+/g, '_').toLowerCase()}`,
      title: title,
      departmentName: 'State Technology Innovation Mission',
      ministry: 'Government of India',
      sector: title.includes('Water') ? 'Water' : title.includes('Road') ? 'Civil' : title.includes('Waste') ? 'CleanTech' : title.includes('Grievance') ? 'AI' : 'CleanTech',
      deadline: '2026-11-30',
      budgetEstimate: '₹60 Lakhs - ₹1.8 Crores',
      trlRequired: 6,
      problemStatement: `Operational challenge for ${title} under mission-mode deployment.`,
      desiredOutcome: 'High-reliability, automated real-time solution with audited testbed validation.',
      technicalRequirements: ['Edge inference', 'Standardized open telemetry', 'IP67 durability'],
      requiredCapabilities: title.includes('Water') ? ['IoT', 'Water Infrastructure', 'Predictive Analytics'] :
        title.includes('Road') ? ['Computer Vision AI', 'Mobile LiDAR', 'Edge Computing'] :
        title.includes('Waste') ? ['Optical Sorting AI', 'Robotics', 'Material Classification'] :
        title.includes('Grievance') ? ['NLP / Indic Languages', 'Automated Triage', 'Sentiment Analysis'] :
        ['IoT Telemetry', 'Drone Thermal Imaging', 'Predictive Maintenance'],
      status: title.includes('Road') || title.includes('Grievance') ? 'evaluating' as const : title.includes('Solar') ? 'procurement_ready' as const : 'open' as const,
      applicantCount: title.includes('Road') ? 6 : title.includes('Grievance') ? 5 : 4,
      priorityLevel: 'High' as const,
      pilotDuration: '3 Months field pilot',
      targetProcurementPathway: 'GFR Rule 194 Fast-Track Challenge' as const,
      createdByGovtId: 'user_govt_1',
      createdAt: '2026-02-01'
    };
  });

  // Recommended Startups (SECTION 2)
  const recommendedStartups = startups.slice(0, 3);

  // Evaluation Queue (SECTION 3)
  const evaluationQueue = applications.filter(a => 
    a.status === 'under_review' || 
    a.status === 'evidence_verified' || 
    a.status === 'technical_evaluation' ||
    a.status === 'submitted'
  );

  // Handle Review action
  const handleOpenReview = (app: Application) => {
    setEvaluatingApp(app);
    setScoreAlignment(app.evaluationScores?.problemAlignment || 24);
    setScoreEvidence(app.evaluationScores?.evidenceRigor || 25);
    setScoreFeasibility(app.evaluationScores?.technicalFeasibility || 23);
    setScoreScaling(app.evaluationScores?.scalingCapacity || 22);
    setEvaluatorNotes(app.evaluatorNotes || 'Meets sub-ppb precision standards with verified NABL laboratory benchmarks.');
  };

  const handleSaveEvaluation = (actionType: 'shortlist' | 'procurement_ready' | 'save_score') => {
    if (!evaluatingApp) return;

    evaluateApplication(evaluatingApp.id, {
      problemAlignment: scoreAlignment,
      evidenceRigor: scoreEvidence,
      technicalFeasibility: scoreFeasibility,
      scalingCapacity: scoreScaling,
      totalScore: scoreAlignment + scoreEvidence + scoreFeasibility + scoreScaling
    }, evaluatorNotes);

    if (actionType === 'shortlist') {
      addToast(`Startup ${evaluatingApp.startupName} shortlisted for pilot deployment.`, 'success');
    } else if (actionType === 'procurement_ready') {
      markProcurementReady(evaluatingApp.id);
      addToast(`Procurement readiness certificate unlocked for ${evaluatingApp.startupName}.`, 'success');
    } else {
      addToast('Evaluation scores saved to official audit trail.', 'info');
    }

    setEvaluatingApp(null);
  };

  // Procurement Readiness categories (SECTION 4)
  const procurementPhases = [
    { label: 'Evaluation', count: opportunities.filter(o => o.status === 'open' || o.status === 'evaluating').length, color: 'text-blue-700 bg-blue-50 border-blue-200' },
    { label: 'Shortlisted', count: applications.filter(a => a.status === 'shortlisted').length, color: 'text-purple-700 bg-purple-50 border-purple-200' },
    { label: 'Procurement Preparation', count: 2, color: 'text-amber-700 bg-amber-50 border-amber-200' },
    { label: 'Procurement Ready', count: applications.filter(a => a.status === 'procurement_ready').length, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
    { label: 'Transferred to Procurement', count: 1, color: 'text-teal-700 bg-teal-50 border-teal-200' },
    { label: 'Completed', count: 1, color: 'text-slate-700 bg-slate-100 border-slate-200' }
  ];

  // SECTION 5 — Audit-style Recent Activity items
  const auditActivities = [
    {
      action: 'Technical evidence verified',
      entity: 'CSIR-NEERI NABL Lab Test Report (Agastya AquaSens)',
      officer: currentUser?.name || 'Dr. Rajeshwari Sharma, IAS',
      timestamp: '2 hours ago',
      badge: 'Verified',
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      action: 'Startup shortlisted',
      entity: 'Agastya AquaSens Technologies for Real-time Water Monitoring',
      officer: 'Joint Technical Evaluation Board',
      timestamp: '4 hours ago',
      badge: 'Score: 94/100',
      badgeColor: 'bg-purple-100 text-purple-800'
    },
    {
      action: 'Opportunity updated',
      entity: 'Smart Water Leakage Detection (Applicant window refreshed)',
      officer: 'Urban Development Department',
      timestamp: '1 day ago',
      badge: 'Updated',
      badgeColor: 'bg-blue-100 text-blue-800'
    },
    {
      action: 'Milestone approved',
      entity: 'Milestone 1: Baseline Survey & Sensor Calibration (₹18.5L recommended)',
      officer: 'Executive Engineer & Nodal Directorate',
      timestamp: '2 days ago',
      badge: 'Approved',
      badgeColor: 'bg-emerald-100 text-emerald-800'
    }
  ];

  const officerName = currentUser?.name || 'Dr. Rajeshwari Sharma, IAS';

  return (
    <div className="space-y-10 pb-12">
      
      {/* ========================================================= */}
      {/* TOP GREETING & SUBTITLE */}
      {/* ========================================================= */}
      <div className="neu-card p-6 bg-gradient-to-br from-white via-slate-50/50 to-blue-50/20 border-l-4 border-l-[#0f2b48] space-y-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
              <span>Nodal Directorate: <strong className="text-slate-800">{currentUser?.organizationName || 'Department of Drinking Water & Sanitation'}</strong></span>
              <span>·</span>
              <span className="text-emerald-700 font-bold">GFR 173(i) & 194 Compliant</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black text-[#0f2b48] tracking-tight">
              Good morning, {officerName}
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
              Discover, evaluate and connect with innovation for public problems.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white border border-slate-200/80 px-4 py-3 rounded-2xl shadow-xs shrink-0 neu-inset">
            <div className="w-10 h-10 rounded-xl bg-[#0f2b48] flex items-center justify-center text-white font-black">
              <ShieldCheck className="w-6 h-6 text-[#ea580c]" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-[#0f2b48]">ProcureSetu Nodal Desk</div>
              <p className="text-[10px] text-slate-500">Evidence Audit Authority</p>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 5 KPI CARDS */}
      {/* Active Opportunities, Applications Received, Startups Under Evaluation, Procurement Ready, Active Milestones */}
      {/* ========================================================= */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        
        {/* Card 1: Active Opportunities */}
        <div 
          onClick={() => setActiveTab('opportunities')}
          className="neu-card p-4 bg-white border border-slate-200 hover:border-blue-300 cursor-pointer transition-all space-y-1.5"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
              Active Opportunities
            </span>
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-[#0f2b48]">
            {activeOpportunitiesCount}
          </div>
          <div className="text-[10px] text-slate-400">
            Across 5 Core Sectors
          </div>
        </div>

        {/* Card 2: Applications Received */}
        <div 
          onClick={() => setActiveTab('evaluations')}
          className="neu-card p-4 bg-white border border-slate-200 hover:border-orange-300 cursor-pointer transition-all space-y-1.5"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
              Applications Received
            </span>
            <Users className="w-4 h-4 text-[#ea580c]" />
          </div>
          <div className="text-2xl font-black text-[#0f2b48]">
            {applicationsReceivedCount}
          </div>
          <div className="text-[10px] text-emerald-700 font-semibold">
            100% GFR 173(i) Eligible
          </div>
        </div>

        {/* Card 3: Startups Under Evaluation */}
        <div 
          onClick={() => setActiveTab('evaluations')}
          className="neu-card p-4 bg-white border border-slate-200 hover:border-purple-300 cursor-pointer transition-all space-y-1.5"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
              Under Evaluation
            </span>
            <Award className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-[#0f2b48]">
            {startupsUnderEvaluationCount}
          </div>
          <div className="text-[10px] text-purple-700 font-semibold">
            Technical Audit Pending
          </div>
        </div>

        {/* Card 4: Procurement Ready */}
        <div 
          onClick={() => setActiveTab('procurement')}
          className="neu-card p-4 bg-white border border-slate-200 hover:border-emerald-300 cursor-pointer transition-all space-y-1.5"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
              Procurement Ready
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700">
            {procurementReadyCount}
          </div>
          <div className="text-[10px] text-emerald-600 font-semibold">
            Dossiers Certified
          </div>
        </div>

        {/* Card 5: Active Milestones */}
        <div 
          onClick={() => setActiveTab('milestones')}
          className="neu-card p-4 bg-white border border-slate-200 hover:border-amber-300 cursor-pointer transition-all space-y-1.5 col-span-2 md:col-span-1"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
              Active Milestones
            </span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-[#0f2b48]">
            {activeMilestonesCount}
          </div>
          <div className="text-[10px] text-amber-700 font-semibold">
            Escrow Sign-off Desk
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SECTION 1 — PROBLEM / OPPORTUNITY OVERVIEW */}
      {/* Existing Opportunities: Smart Water Leakage Detection, AI Road Damage Detection, Waste Segregation Optimization, Digital Citizen Grievance Intelligence, Solar Asset Monitoring */}
      {/* ========================================================= */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-[#0f2b48]/10 text-[#0f2b48] font-black text-[10px] uppercase rounded-md tracking-wider">
                Government Challenge Register
              </span>
              <h2 className="text-base sm:text-lg font-black text-[#0f2b48]">
                SECTION 1 — Problem / Opportunity Overview
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Active municipal and ministerial problem statements open for innovation discovery.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('create-opportunity')}
            className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#0f2b48] hover:bg-[#16385c] rounded-lg shadow-2xs flex items-center gap-1.5 self-start sm:self-auto neu-button"
          >
            <span>+ Create Opportunity</span>
          </button>
        </div>

        {/* 5 Opportunity Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {problemOverviewOpps.map(opp => {
            const statusBadge = opp.status === 'open' 
              ? { text: 'Applications Open', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' }
              : opp.status === 'evaluating'
                ? { text: 'Under Evaluation', color: 'bg-purple-50 text-purple-800 border-purple-200' }
                : { text: 'Procurement Ready', color: 'bg-orange-50 text-orange-800 border-orange-200' };

            return (
              <div 
                key={opp.id}
                className="neu-card p-5 bg-white border border-slate-200 hover:border-slate-300 transition-all space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 bg-orange-100 text-[#ea580c] font-black text-[10px] rounded-md">
                      {opp.sector}
                    </span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${statusBadge.color}`}>
                      {statusBadge.text}
                    </span>
                  </div>

                  <h3 className="text-sm font-black text-[#0f2b48] leading-snug">
                    {opp.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2">
                    {opp.problemStatement}
                  </p>

                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Required Capabilities:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {(opp.requiredCapabilities || ['IoT', 'Analytics']).map((rc, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-semibold rounded-md border border-slate-200">
                          {rc}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <div className="space-y-0.5">
                    <div>Applications: <strong className="text-slate-900">{opp.applicantCount} proposals</strong></div>
                    <div className="text-[10px] text-slate-400">Deadline: <span className="font-semibold text-slate-600">{opp.deadline}</span></div>
                  </div>

                  <button
                    onClick={() => setActiveTab('opportunities')}
                    className="px-3 py-1.5 text-xs font-bold text-[#0f2b48] bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <span>Manage</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 2 — STARTUP DISCOVERY */}
      {/* Recommended Startups: Startup name, Sector, Relevant capabilities, Evidence available, Relevant deployments, Verification status, Button: 'View Capability Profile' */}
      {/* ========================================================= */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-black text-[10px] uppercase rounded-md tracking-wider">
                Evidence-Grounded Startups
              </span>
              <h2 className="text-base sm:text-lg font-black text-[#0f2b48]">
                SECTION 2 — Startup Discovery
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Verified innovation providers matching public problem domains without turnover restrictions.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('startup-discovery')}
            className="text-xs font-bold text-[#ea580c] hover:underline self-start sm:self-auto flex items-center gap-1"
          >
            <span>Explore All Startups ({startups.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Startups Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendedStartups.map(st => {
            const stEvidenceCount = evidence.filter(e => e.startupId === st.id).length;
            const verifiedCount = evidence.filter(e => e.startupId === st.id && e.verificationStatus === 'verified').length;

            return (
              <div 
                key={st.id}
                className="neu-card p-5 bg-white border border-slate-200 hover:border-orange-300 transition-all space-y-3.5 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 bg-orange-100 text-[#ea580c] font-black text-[10px] rounded-md">
                      {st.primarySector}
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Verified
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-black text-[#0f2b48]">
                    {st.companyName}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2">
                    {st.shortDescription || st.bio}
                  </p>

                  {/* Relevant Capabilities */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Relevant Capabilities:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {(st.keyCapabilities || []).slice(0, 3).map((cap, i) => (
                        <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-900 border border-blue-100 text-[10px] font-semibold rounded-md">
                          {cap}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Deployments & Evidence status */}
                  <div className="p-2.5 bg-slate-50 rounded-xl space-y-1 text-[11px] text-slate-600">
                    <div>
                      <span className="text-slate-400 font-semibold">Evidence Available: </span>
                      <strong className="text-slate-900 font-bold">{stEvidenceCount} Artifacts ({verifiedCount} Verified)</strong>
                    </div>
                    <div className="truncate">
                      <span className="text-slate-400 font-semibold">Deployments: </span>
                      <span className="text-slate-800 font-medium">{st.previousDeployments || '12 field units operating with 99.8% uptime'}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setSelectedStartupForModal(st)}
                    className="w-full py-2 text-xs font-bold text-[#0f2b48] bg-slate-100 hover:bg-[#0f2b48] hover:text-white rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Capability Profile</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 3 — EVALUATION QUEUE */}
      {/* Show startups awaiting review. Columns: Startup, Opportunity, Evidence, Technical Evaluation, Status, Action: Review */}
      {/* ========================================================= */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-purple-100 text-purple-900 font-black text-[10px] uppercase rounded-md tracking-wider">
                Technical Scrutiny Desk
              </span>
              <h2 className="text-base sm:text-lg font-black text-[#0f2b48]">
                SECTION 3 — Evaluation Queue
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Review submitted evidence dossiers and assign technical committee ratings.
            </p>
          </div>

          <div className="text-xs text-slate-500 font-semibold self-start sm:self-auto">
            {evaluationQueue.length} Proposals Awaiting Review
          </div>
        </div>

        {/* Table representation */}
        <div className="neu-card bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200/80 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                <tr>
                  <th className="px-4 py-3">Startup</th>
                  <th className="px-4 py-3">Opportunity</th>
                  <th className="px-4 py-3">Evidence</th>
                  <th className="px-4 py-3">Technical Evaluation</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {evaluationQueue.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                      No applications currently awaiting review.
                    </td>
                  </tr>
                ) : (
                  evaluationQueue.map(app => (
                    <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* 1. Startup */}
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-[#0f2b48]">{app.startupName}</div>
                        <div className="text-[10px] text-slate-400">{app.sector} · TRL {app.trlProposed}</div>
                      </td>

                      {/* 2. Opportunity */}
                      <td className="px-4 py-3.5 max-w-[220px]">
                        <div className="font-semibold text-slate-800 truncate" title={app.opportunityTitle}>
                          {app.opportunityTitle}
                        </div>
                        <div className="text-[10px] text-slate-400">{app.departmentName}</div>
                      </td>

                      {/* 3. Evidence */}
                      <td className="px-4 py-3.5">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-900 border border-blue-200 rounded-md text-[11px] font-semibold">
                          {app.attachedEvidenceIds.length} Verified Docs
                        </span>
                      </td>

                      {/* 4. Technical Evaluation */}
                      <td className="px-4 py-3.5">
                        {app.evaluationScores ? (
                          <div className="flex items-center gap-1 font-black text-emerald-700">
                            <span>{app.evaluationScores.totalScore} / 100</span>
                            <span className="text-[10px] text-slate-400 font-normal">Scored</span>
                          </div>
                        ) : (
                          <span className="text-amber-700 font-semibold text-[11px] flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-600" />
                            Pending Scoring
                          </span>
                        )}
                      </td>

                      {/* 5. Status */}
                      <td className="px-4 py-3.5">
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-slate-100 text-slate-700">
                          {app.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>

                      {/* 6. Action: Review */}
                      <td className="px-4 py-3.5 text-right">
                        <button
                          onClick={() => handleOpenReview(app)}
                          className="px-3 py-1.5 text-xs font-bold text-white bg-[#0f2b48] hover:bg-[#16385c] rounded-lg transition-colors shadow-2xs"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 4 — PROCUREMENT READINESS */}
      {/* Show opportunities with statuses: Evaluation, Shortlisted, Procurement Preparation, Procurement Ready, Transferred to Procurement, Completed */}
      {/* ========================================================= */}
      <section className="space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-black text-[10px] uppercase rounded-md tracking-wider">
              Procurement Readiness Pipeline
            </span>
            <h2 className="text-base sm:text-lg font-black text-[#0f2b48]">
              SECTION 4 — Procurement Readiness
            </h2>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Progression tracker preparing verified startup solutions for GeM and GFR procurement channels.
          </p>
        </div>

        {/* 6 Status Stages Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {procurementPhases.map((phase, idx) => (
            <div 
              key={idx} 
              onClick={() => setActiveTab('procurement')}
              className={`neu-card p-4 rounded-xl border text-center space-y-1.5 cursor-pointer hover:shadow-xs transition-all ${phase.color}`}
            >
              <div className="text-[10px] font-extrabold uppercase tracking-wider">
                {phase.label}
              </div>
              <div className="text-2xl font-black">
                {phase.count}
              </div>
              <div className="text-[10px] opacity-80">
                Opportunities
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 5 — RECENT ACTIVITY */}
      {/* Show audit-style activity: "Technical evidence verified", "Startup shortlisted", "Opportunity updated", "Milestone approved" */}
      {/* ========================================================= */}
      <section className="space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-200 text-slate-800 font-black text-[10px] uppercase rounded-md tracking-wider">
              Immutable Audit Log
            </span>
            <h2 className="text-base sm:text-lg font-black text-[#0f2b48]">
              SECTION 5 — Recent Activity
            </h2>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Audit-grade record of nodal decisions, milestone approvals, and technical verifications.
          </p>
        </div>

        <div className="neu-card p-5 bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100 space-y-3">
          {auditActivities.map((act, idx) => (
            <div key={idx} className="pt-3 first:pt-0 flex items-start justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-black text-[#0f2b48]">{act.action}</span>
                  <span className={`px-2 py-0.2 text-[9px] font-bold rounded-sm ${act.badgeColor}`}>
                    {act.badge}
                  </span>
                </div>
                <p className="text-slate-600">{act.entity}</p>
                <div className="text-[10px] text-slate-400">
                  Officer: <span className="font-semibold text-slate-600">{act.officer}</span>
                </div>
              </div>

              <span className="text-[10px] text-slate-400 font-medium shrink-0">
                {act.timestamp}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* REVIEW EVALUATION WORKSPACE MODAL */}
      {/* ========================================================= */}
      {evaluatingApp && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs p-3 sm:p-6 lg:p-8 animate-in fade-in duration-150">
          <div className="max-w-7xl mx-auto">
            <GovernmentEvaluationWorkspace 
              application={evaluatingApp} 
              onBack={() => setEvaluatingApp(null)} 
              onSelectApplication={(app) => setEvaluatingApp(app)}
            />
          </div>
        </div>
      )}

      {/* VIEW STARTUP CAPABILITY PROFILE MODAL */}
      {selectedStartupForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="px-2 py-0.5 bg-orange-100 text-[#ea580c] font-black text-[10px] rounded-md">
                  {selectedStartupForModal.primarySector}
                </span>
                <h3 className="text-base font-black text-[#0f2b48] mt-1">
                  {selectedStartupForModal.companyName}
                </h3>
                <p className="text-xs text-slate-500">DPIIT: {selectedStartupForModal.dpiitNumber} · GFR 173(i) Turnover-Exempt</p>
              </div>
              <button 
                onClick={() => setSelectedStartupForModal(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div>
                <span className="font-bold text-slate-900">Technical Overview:</span>
                <p className="mt-1 p-2.5 bg-slate-50 rounded-lg leading-relaxed">
                  {selectedStartupForModal.bio || selectedStartupForModal.shortDescription}
                </p>
              </div>

              <div>
                <span className="font-bold text-slate-900">Demonstrated Capabilities:</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {(selectedStartupForModal.keyCapabilities || []).map((c, i) => (
                    <span key={i} className="px-2.5 py-1 bg-blue-50 text-blue-900 border border-blue-200 rounded-md font-semibold text-[11px]">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <div>Field Deployments: <strong className="text-slate-900">{selectedStartupForModal.previousDeployments || '12 operational pilot units'}</strong></div>
                <div>Government Experience: <span className="font-semibold text-emerald-700">{selectedStartupForModal.governmentExperience || 'Pilot stage with JJM'}</span></div>
                <div>Team Size: <span className="text-slate-800">{selectedStartupForModal.teamSize}</span></div>
                <div>Location: <span className="text-slate-800">{selectedStartupForModal.headquarters}</span></div>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-emerald-950">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span className="font-bold">Trust Index: {selectedStartupForModal.trustIndex || 94}/100</span>
                </div>
                <span className="text-[11px] font-bold text-emerald-800">
                  NABL & Patent Verified
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedStartupForModal(null)}
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
