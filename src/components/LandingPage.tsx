import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  Rocket, 
  ShieldCheck, 
  ArrowRight, 
  ArrowDown, 
  CheckCircle2, 
  FileCheck2, 
  Award, 
  Sparkles, 
  Cpu, 
  Droplet, 
  Trees, 
  HeartPulse, 
  Hammer, 
  Layers, 
  TrendingUp, 
  Lock, 
  ExternalLink, 
  ChevronRight, 
  Zap, 
  Clock, 
  Briefcase, 
  Check, 
  FileText, 
  Search, 
  Flame, 
  AlertTriangle, 
  FileCode, 
  FileSpreadsheet, 
  Scale, 
  BadgeCheck, 
  X,
  Truck,
  RotateCcw,
  Network,
  HelpCircle,
  Mail,
  Phone
} from 'lucide-react';

interface LandingPageProps {
  onOpenAuth: (role?: 'startup' | 'govt', isSignup?: boolean) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenAuth }) => {
  const { switchDemoAccount } = useApp();

  // Modal dialog states for footer functional links
  const [modalType, setModalType] = useState<'privacy' | 'terms' | 'contact' | null>(null);

  // Sector list matching exact prompt requirements
  const sectors = [
    { name: 'Civil', desc: 'Structural & geotechnical systems', icon: Hammer },
    { name: 'Infrastructure', desc: 'Highways, ports & urban assets', icon: Building2 },
    { name: 'AI', desc: 'Computer vision & edge intelligence', icon: Sparkles },
    { name: 'IT', desc: 'Cloud governance & secure middleware', icon: FileCode },
    { name: 'Electronics', desc: 'Micro-sensors & embedded systems', icon: Cpu },
    { name: 'Manufacturing', desc: 'Precision indigenous fabrication', icon: Briefcase },
    { name: 'Agritech', desc: 'Soil diagnostics & precision farming', icon: Trees },
    { name: 'HealthTech', desc: 'Point-of-care rapid molecular kits', icon: HeartPulse },
    { name: 'CleanTech', desc: 'Emissions & renewable tech', icon: Flame },
    { name: 'Mobility', desc: 'EV powertrains & traffic telematics', icon: Truck },
    { name: 'Energy', desc: 'Smart grid concentrators & storage', icon: Zap },
    { name: 'Water', desc: 'Trace contaminant & arsenic sensors', icon: Droplet },
    { name: 'Waste', desc: 'Circular processing & treatment', icon: RotateCcw },
    { name: 'Biotech', desc: 'Assays, enzymes & biocatalysts', icon: Award },
    { name: 'Services', desc: 'Testing, verification & spatial GIS', icon: Layers }
  ];

  return (
    <div id="home" className="min-h-screen bg-[#f0f4f8] text-slate-800 selection:bg-[#ea580c]/20 selection:text-[#0f2b48]">
      
      {/* Principle Banner */}
      <div className="bg-[#0f2b48] text-white border-b border-sky-950 py-2.5 px-4 text-center text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 flex-wrap">
          <span className="px-2 py-0.5 rounded-sm bg-[#ea580c] font-black text-[10px] tracking-wider uppercase">
            Product Principle
          </span>
          <span className="text-slate-200">
            ProcureSetu operates as an <strong>intelligence, discovery, evidence, evaluation and procurement-readiness layer</strong> BEFORE GeM and state e-tendering platforms.
          </span>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 2. HERO SECTION */}
      {/* ===================================================================== */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center max-w-4xl mx-auto">
            {/* Pill tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-300/80 text-xs font-bold text-[#0f2b48] mb-6 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#ea580c] animate-pulse"></span>
              <span>National Innovation Procurement Intelligence Platform</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#0f2b48] tracking-tight leading-[1.12]">
              From Government Problems <br className="hidden sm:inline" />
              <span className="text-[#ea580c] relative inline-block">
                to Innovation.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
              ProcureSetu connects government departments with innovative startups through capability discovery, 
              evidence, evaluation and transparent procurement readiness.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => onOpenAuth('startup', false)}
                className="w-full sm:w-auto px-7 py-3.5 text-sm font-bold text-white bg-gradient-to-r from-[#ea580c] to-[#f97316] hover:from-[#c2410c] hover:to-[#ea580c] rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group neu-button"
              >
                <span>Explore Opportunities</span>
                <ArrowRight className="w-4 h-4 text-orange-200 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onOpenAuth('govt', false)}
                className="w-full sm:w-auto px-7 py-3.5 text-sm font-bold text-[#0f2b48] bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group neu-button"
              >
                <Building2 className="w-4 h-4 text-[#0f2b48]" />
                <span>Create Government Opportunity</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform ml-0.5" />
              </button>
            </div>

            {/* 1-Click Demo Evaluation Pills for instant trial */}
            <div className="mt-4 flex items-center justify-center gap-2 text-xs">
              <span className="text-slate-500 font-medium">Quick Evaluator Demo:</span>
              <button
                onClick={() => switchDemoAccount('startup')}
                className="px-2.5 py-1 font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-md border border-amber-300 shadow-2xs"
              >
                Launch Startup View
              </button>
              <button
                onClick={() => switchDemoAccount('govt')}
                className="px-2.5 py-1 font-bold text-blue-900 bg-blue-100 hover:bg-blue-200 rounded-md border border-blue-300 shadow-2xs"
              >
                Launch Govt View
              </button>
            </div>
          </div>

          {/* Visual Ecosystem Diagram: Neumorphic flow */}
          <div className="mt-14 max-w-4xl mx-auto">
            <div className="text-center mb-4">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                ProcureSetu Innovation Architecture Flow
              </span>
            </div>

            <div className="neu-card p-6 sm:p-8 bg-gradient-to-b from-white to-slate-50/60 border border-slate-200">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
                
                {/* Step 1: Government Problem */}
                <div className="neu-card p-4 text-center border-t-4 border-t-[#0f2b48] relative group hover:-translate-y-1 transition-all">
                  <div className="w-10 h-10 mx-auto rounded-xl bg-slate-100 text-[#0f2b48] flex items-center justify-center mb-2 shadow-2xs font-bold text-sm">
                    <Building2 className="w-5 h-5 text-[#0f2b48]" />
                  </div>
                  <h4 className="text-xs font-black text-[#0f2b48]">Government Problem</h4>
                  <p className="text-[11px] text-slate-500 mt-1">Operational bottleneck & measurable outcome KPIs</p>
                </div>

                {/* Step 2: Innovation Discovery */}
                <div className="neu-card p-4 text-center border-t-4 border-t-[#ea580c] relative group hover:-translate-y-1 transition-all">
                  <div className="w-10 h-10 mx-auto rounded-xl bg-orange-50 text-[#ea580c] flex items-center justify-center mb-2 shadow-2xs font-bold text-sm">
                    <Search className="w-5 h-5 text-[#ea580c]" />
                  </div>
                  <h4 className="text-xs font-black text-[#0f2b48]">Innovation Discovery</h4>
                  <p className="text-[11px] text-slate-500 mt-1">Multi-sector matching across 18 specialized domains</p>
                </div>

                {/* Step 3: Evidence & Trust */}
                <div className="neu-card p-4 text-center border-t-4 border-t-blue-700 relative group hover:-translate-y-1 transition-all">
                  <div className="w-10 h-10 mx-auto rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-2 shadow-2xs font-bold text-sm">
                    <ShieldCheck className="w-5 h-5 text-blue-700" />
                  </div>
                  <h4 className="text-xs font-black text-[#0f2b48]">Evidence & Trust</h4>
                  <p className="text-[11px] text-slate-500 mt-1">NABL testbeds, IIT pilot logs & tamper-evident audit</p>
                </div>

                {/* Step 4: Procurement Readiness */}
                <div className="neu-card p-4 text-center border-t-4 border-t-emerald-600 relative group hover:-translate-y-1 transition-all">
                  <div className="w-10 h-10 mx-auto rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-2 shadow-2xs font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h4 className="text-xs font-black text-[#0f2b48]">Procurement Readiness</h4>
                  <p className="text-[11px] text-slate-500 mt-1">GFR 173(i) dossier ready for GeM Custom Bidding</p>
                </div>

              </div>

              {/* Connecting Legend */}
              <div className="mt-6 pt-4 border-t border-slate-200/80 flex items-center justify-center gap-2 text-[11px] text-slate-500">
                <span className="font-semibold text-slate-700">Structured Path:</span>
                <span>Government Problem</span>
                <span className="text-[#ea580c]">↓</span>
                <span>Innovation Discovery</span>
                <span className="text-[#ea580c]">↓</span>
                <span>Evidence & Trust</span>
                <span className="text-[#ea580c]">↓</span>
                <span>Procurement Readiness</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ===================================================================== */}
      {/* 3. PROBLEM SECTION */}
      {/* ===================================================================== */}
      <section id="mission" className="py-18 px-4 sm:px-6 lg:px-8 bg-white border-y border-slate-200">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#ea580c]">The Core Systemic Challenge</h2>
            <p className="mt-2 text-3xl font-extrabold text-[#0f2b48] tracking-tight">
              Why Innovation Struggles to Reach Government
            </p>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              Traditional procurement rules were designed for standardized commodities, creating systemic friction 
              when public bodies attempt to procure innovative solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1: Prior Experience Barriers */}
            <div className="neu-card p-6 border-l-4 border-l-rose-500 hover:-translate-y-1.5 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-2xs">
                <AlertTriangle className="w-6 h-6 text-rose-600" />
              </div>
              <h3 className="text-sm font-bold text-[#0f2b48] group-hover:text-rose-700 transition-colors">
                Prior Experience Barriers
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Tender criteria mandate 3 years of audited financials or ₹50L+ prior turnover, disqualifying deeptech 
                startups despite superior technical capability.
              </p>
            </div>

            {/* Card 2: Long Procurement Cycles */}
            <div className="neu-card p-6 border-l-4 border-l-amber-500 hover:-translate-y-1.5 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-2xs">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-sm font-bold text-[#0f2b48] group-hover:text-amber-700 transition-colors">
                Long Procurement Cycles
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Open tender cycles routinely exceed 14 to 22 months from drafting to award, exhausting early-stage startup 
                runways through unpaid demonstrations.
              </p>
            </div>

            {/* Card 3: Unclear Payment Milestones */}
            <div className="neu-card p-6 border-l-4 border-l-orange-500 hover:-translate-y-1.5 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-2xs">
                <FileSpreadsheet className="w-6 h-6 text-[#ea580c]" />
              </div>
              <h3 className="text-sm font-bold text-[#0f2b48] group-hover:text-[#ea580c] transition-colors">
                Unclear Payment Milestones
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Startups face unpredictable cash flows because physical delivery milestones lack digital deliverable 
                audit trails and transparent escrow release mechanisms.
              </p>
            </div>

            {/* Card 4: Limited Visibility of Government Demand */}
            <div className="neu-card p-6 border-l-4 border-l-indigo-500 hover:-translate-y-1.5 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-2xs">
                <Search className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-sm font-bold text-[#0f2b48] group-hover:text-indigo-700 transition-colors">
                Limited Visibility of Demand
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Government operational requirements stay buried in internal departmental files until a rigid, predetermined 
                RFP is formally published.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 4. SOLUTION SECTION: ONE CONNECTED INNOVATION JOURNEY */}
      {/* ===================================================================== */}
      <section className="py-18 px-4 sm:px-6 lg:px-8 bg-[#f0f4f8]">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#ea580c]">The Unified Pathway</h2>
            <p className="mt-2 text-3xl font-extrabold text-[#0f2b48] tracking-tight">
              One Connected Innovation Journey
            </p>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              ProcureSetu weaves an unbroken continuum from ground problem discovery to verified performance.
            </p>
          </div>

          {/* 8-Stage Sequential Horizontal & Vertical Flow */}
          <div className="relative">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {[
                { step: '01', title: 'Govt Problem', desc: 'Field bottleneck definition', color: 'border-[#0f2b48]' },
                { step: '02', title: 'Opportunity', desc: 'KPI-structured challenge', color: 'border-slate-400' },
                { step: '03', title: 'Startup Discovery', desc: 'Multi-sector matching', color: 'border-[#ea580c]' },
                { step: '04', title: 'Capability Evidence', desc: 'NABL & testbed reports', color: 'border-blue-600' },
                { step: '05', title: 'Evaluation', desc: 'Objective rubric scoring', color: 'border-amber-600' },
                { step: '06', title: 'Procurement Ready', desc: 'GFR 173(i) Dossier', color: 'border-emerald-600' },
                { step: '07', title: 'Delivery', desc: 'Milestone escrow tracking', color: 'border-teal-600' },
                { step: '08', title: 'Verified Performance', desc: 'Credential passport record', color: 'border-emerald-700' }
              ].map((item, index) => (
                <div 
                  key={index}
                  className={`neu-card p-3 text-center border-t-3 ${item.color} hover:-translate-y-1 transition-all flex flex-col justify-between`}
                >
                  <div>
                    <span className="text-[10px] font-black font-mono text-[#ea580c]">{item.step}</span>
                    <h4 className="text-xs font-bold text-[#0f2b48] mt-1 leading-snug">{item.title}</h4>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-2 leading-tight">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Subtext Journey Line Indicator */}
            <div className="mt-8 text-center text-xs font-semibold text-slate-600 flex items-center justify-center flex-wrap gap-2">
              <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200">Government Problem</span>
              <span className="text-[#ea580c]">→</span>
              <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200">Opportunity</span>
              <span className="text-[#ea580c]">→</span>
              <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200">Startup Discovery</span>
              <span className="text-[#ea580c]">→</span>
              <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200">Capability Evidence</span>
              <span className="text-[#ea580c]">→</span>
              <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200">Evaluation</span>
              <span className="text-[#ea580c]">→</span>
              <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200">Procurement Readiness</span>
              <span className="text-[#ea580c]">→</span>
              <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200">Delivery</span>
              <span className="text-[#ea580c]">→</span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold">Verified Performance</span>
            </div>
          </div>

        </div>
      </section>

      {/* ===================================================================== */}
      {/* 5. TRUST ENGINE SECTION: SAMPLE CAPABILITY PROFILE */}
      {/* ===================================================================== */}
      <section id="about" className="py-18 px-4 sm:px-6 lg:px-8 bg-white border-y border-slate-200">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#ea580c]">Evidence & Explainability</h2>
            <p className="mt-2 text-3xl font-extrabold text-[#0f2b48] tracking-tight">
              Trust Built on Evidence
            </p>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              No arbitrary black-box scores. Every claim in ProcureSetu is grounded in audited laboratory reports, 
              field testbed telemetry, patent registrations, and regulatory compliance certificates.
            </p>
          </div>

          {/* Sample Startup Capability Profile Showcase */}
          <div className="max-w-4xl mx-auto neu-card p-6 sm:p-8 border-2 border-slate-200 bg-gradient-to-br from-white via-slate-50/50 to-blue-50/20">
            
            {/* Sample Profile Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#0f2b48] text-white flex items-center justify-center font-black shadow-md border border-slate-700">
                  <ShieldCheck className="w-8 h-8 text-[#ea580c]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-[#ea580c] uppercase tracking-wider">SAMPLE CAPABILITY PROFILE</span>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs font-mono font-bold text-slate-600">DIPP-89421-IN</span>
                  </div>
                  <h3 className="text-xl font-black text-[#0f2b48]">Agastya AquaSens Technologies</h3>
                  <p className="text-xs text-slate-500">Domain: Water & Inline Trace Contaminant Sensing · HQ: Bengaluru</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-300">
                  ✓ GFR 173(i) Exemption Certified
                </span>
              </div>
            </div>

            {/* 6 Core Verifiable Pillars Required By Prompt */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              
              {/* 1. Identity Verified */}
              <div className="neu-card p-4 space-y-2 border-l-4 border-l-emerald-600 bg-white">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#0f2b48]">Identity Verified</h4>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-[11px] text-slate-600">
                  DPIIT recognition number confirmed via API. Corporate registration (MCA CIN), GSTN status, and MSME Class checked.
                </p>
                <div className="text-[10px] text-emerald-700 font-mono font-bold">
                  Status: Active & Validated
                </div>
              </div>

              {/* 2. Capability Demonstrated */}
              <div className="neu-card p-4 space-y-2 border-l-4 border-l-emerald-600 bg-white">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#0f2b48]">Capability Demonstrated</h4>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-[11px] text-slate-600">
                  TRL 7 demonstrated in operational field. Detection limit &le; 0.5 ppb Arsenic III/V verified against ICP-MS standards.
                </p>
                <div className="text-[10px] text-emerald-700 font-mono font-bold">
                  Status: TRL 7 (Field Demonstration)
                </div>
              </div>

              {/* 3. Evidence Submitted */}
              <div className="neu-card p-4 space-y-2 border-l-4 border-l-emerald-600 bg-white">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#0f2b48]">Evidence Submitted</h4>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-[11px] text-slate-600">
                  CSIR-NEERI NABL accredited test report deposited with cryptographic SHA-256 hash. Non-fouling optical cell patent grant on file.
                </p>
                <div className="text-[10px] text-emerald-700 font-mono font-bold">
                  Status: 3 Audited Artifacts Verified
                </div>
              </div>

              {/* 4. Relevant Deployment */}
              <div className="neu-card p-4 space-y-2 border-l-4 border-l-emerald-600 bg-white">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#0f2b48]">Relevant Deployment</h4>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-[11px] text-slate-600">
                  90-day continuous in-situ pilot certification from IIT Madras Centre for Water Resources across 12 rural distribution points.
                </p>
                <div className="text-[10px] text-emerald-700 font-mono font-bold">
                  Status: 99.8% Telemetry Uptime
                </div>
              </div>

              {/* 5. Security Documentation */}
              <div className="neu-card p-4 space-y-2 border-l-4 border-l-emerald-600 bg-white">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#0f2b48]">Security Documentation</h4>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-[11px] text-slate-600">
                  Hardware cryptographic root-of-trust, ISO 27001:2022 cert, and CERT-In empaneled vulnerability penetration assessment report.
                </p>
                <div className="text-[10px] text-emerald-700 font-mono font-bold">
                  Status: Zero Critical Vulnerabilities
                </div>
              </div>

              {/* 6. Government Experience */}
              <div className="neu-card p-4 space-y-2 border-l-4 border-l-emerald-600 bg-white">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#0f2b48]">Government Experience</h4>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-[11px] text-slate-600">
                  Successful milestone execution in Nadia district under Jal Jeevan Mission, signed off by Executive Engineer.
                </p>
                <div className="text-[10px] text-emerald-700 font-mono font-bold">
                  Status: 1 Work Order Verified
                </div>
              </div>

            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
              <span>Public Procurement Intelligence Layer · Evidence-Anchored Trust Model</span>
              <span className="font-bold text-[#0f2b48]">Explainable Verification for Nodal Officers</span>
            </div>

          </div>

        </div>
      </section>

      {/* ===================================================================== */}
      {/* 6. FOR GOVERNMENT & 7. FOR STARTUPS (PARALLEL DUAL PANELS) */}
      {/* ===================================================================== */}
      <section className="py-18 px-4 sm:px-6 lg:px-8 bg-[#f0f4f8]">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* FOR GOVERNMENT PANEL */}
            <div id="for-government" className="neu-card p-8 border-t-4 border-t-[#0f2b48] flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 text-[#0f2b48] text-xs font-bold rounded-md">
                  <Building2 className="w-4 h-4 text-[#0f2b48]" />
                  <span>Public Sector & Nodal Officers</span>
                </div>

                <h3 className="text-2xl font-black text-[#0f2b48]">For Government</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Mitigate procurement risk, satisfy audit requirements, and access high-impact innovations across all 18 domains without procedural friction.
                </p>

                <ul className="space-y-3 pt-2">
                  {[
                    'Discover innovation before drafting restrictive specifications',
                    'Define outcome-based opportunities centered on field KPIs',
                    'Compare capabilities across verified startup Passports',
                    'Review evidence directly from accredited NABL testbeds',
                    'Track evaluation with transparent 4-pillar rubrics',
                    'Prepare procurement readiness dossiers for GeM Custom Bids'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                      <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <button
                  onClick={() => onOpenAuth('govt', false)}
                  className="w-full py-3 text-xs font-bold text-white bg-[#0f2b48] hover:bg-[#16385c] rounded-xl shadow-md transition-all flex items-center justify-center gap-2 neu-button"
                >
                  <Building2 className="w-4 h-4 text-[#f97316]" />
                  <span>Government Login</span>
                </button>
              </div>
            </div>

            {/* FOR STARTUPS PANEL */}
            <div id="for-startups" className="neu-card p-8 border-t-4 border-t-[#ea580c] flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 text-[#ea580c] text-xs font-bold rounded-md">
                  <Rocket className="w-4 h-4 text-[#ea580c]" />
                  <span>Innovators, R&D Wings & Startups</span>
                </div>

                <h3 className="text-2xl font-black text-[#0f2b48]">For Startups</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Break past the prior-turnover barrier, protect intellectual property, and access transparent public sector procurement milestones.
                </p>

                <ul className="space-y-3 pt-2">
                  {[
                    'Discover government demand across 18 diverse technical sectors',
                    'Build capability profile highlighting TRL & indigenous technology',
                    'Submit evidence: NABL reports, patents, and testbed pilot logs',
                    'Apply for opportunities with streamlined digital capability dossiers',
                    'Track evaluation scores and committee feedback in real time',
                    'Build verified track record with milestone-anchored escrow'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                      <Check className="w-4 h-4 text-[#ea580c] mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <button
                  onClick={() => onOpenAuth('startup', true)}
                  className="w-full py-3 text-xs font-bold text-white bg-gradient-to-r from-[#ea580c] to-[#f97316] hover:from-[#c2410c] hover:to-[#ea580c] rounded-xl shadow-md transition-all flex items-center justify-center gap-2 neu-button"
                >
                  <Rocket className="w-4 h-4 text-orange-100" />
                  <span>Startup Signup</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ===================================================================== */}
      {/* 8. SECTOR COVERAGE */}
      {/* ===================================================================== */}
      <section className="py-18 px-4 sm:px-6 lg:px-8 bg-white border-y border-slate-200">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#ea580c]">Multi-Sector Architecture</h2>
            <p className="mt-2 text-3xl font-extrabold text-[#0f2b48] tracking-tight">
              Sector Coverage: Beyond Just IT
            </p>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              ProcureSetu is built to support hard sciences, heavy infrastructure, environmental monitoring, 
              indigenous hardware, and advanced manufacturing alongside software.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {sectors.map(sec => {
              const Icon = sec.icon;
              return (
                <div 
                  key={sec.name}
                  onClick={() => onOpenAuth('startup', false)}
                  className="neu-card p-4 hover:border-orange-300 hover:shadow-md cursor-pointer transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-[#0f2b48] mb-2 group-hover:bg-orange-50 transition-colors">
                      <Icon className="w-4 h-4 text-[#ea580c]" />
                    </div>
                    <h4 className="text-xs font-bold text-[#0f2b48] group-hover:text-[#ea580c] transition-colors">{sec.name}</h4>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1 leading-tight">{sec.desc}</p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ===================================================================== */}
      {/* 9. HOW IT WORKS: 6-STEP VISUAL */}
      {/* ===================================================================== */}
      <section id="how-it-works" className="py-18 px-4 sm:px-6 lg:px-8 bg-[#f0f4f8]">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#ea580c]">Operational Protocol</h2>
            <p className="mt-2 text-3xl font-extrabold text-[#0f2b48] tracking-tight">
              How It Works
            </p>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              A transparent six-stage cycle that accelerates procurement from 18 months down to weeks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Step 1 */}
            <div className="neu-card p-6 space-y-3 border-t-4 border-t-[#0f2b48]">
              <div className="text-2xl font-black text-[#0f2b48] font-mono">01</div>
              <h4 className="text-sm font-bold text-[#0f2b48]">Government defines problem</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Nodal officers articulate operational challenges with measurable targets, minimum TRL, and budget envelope rather than locked specs.
              </p>
            </div>

            {/* Step 2 */}
            <div className="neu-card p-6 space-y-3 border-t-4 border-t-[#ea580c]">
              <div className="text-2xl font-black text-[#ea580c] font-mono">02</div>
              <h4 className="text-sm font-bold text-[#0f2b48]">ProcureSetu structures opportunity</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                The platform formats the demand under GFR 173(i) or Rule 194 innovation challenge pathways with objective evaluation rubrics.
              </p>
            </div>

            {/* Step 3 */}
            <div className="neu-card p-6 space-y-3 border-t-4 border-t-blue-700">
              <div className="text-2xl font-black text-blue-700 font-mono">03</div>
              <h4 className="text-sm font-bold text-[#0f2b48]">Relevant startups are discovered</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Startups discover challenges on the Opportunity Radar and submit their capability dossiers and technical methodologies.
              </p>
            </div>

            {/* Step 4 */}
            <div className="neu-card p-6 space-y-3 border-t-4 border-t-amber-600">
              <div className="text-2xl font-black text-amber-600 font-mono">04</div>
              <h4 className="text-sm font-bold text-[#0f2b48]">Evidence is submitted and evaluated</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Technical committees inspect deposited NABL lab tests, IIT pilot logs, and patents using transparent weighted scoring matrices.
              </p>
            </div>

            {/* Step 5 */}
            <div className="neu-card p-6 space-y-3 border-t-4 border-t-emerald-600">
              <div className="text-2xl font-black text-emerald-600 font-mono">05</div>
              <h4 className="text-sm font-bold text-[#0f2b48]">Procurement readiness is established</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Nodal officers issue signed Procurement Readiness Dossiers and GFR 173(i) turnover exemption certificates ready for GeM execution.
              </p>
            </div>

            {/* Step 6 */}
            <div className="neu-card p-6 space-y-3 border-t-4 border-t-teal-700">
              <div className="text-2xl font-black text-teal-700 font-mono">06</div>
              <h4 className="text-sm font-bold text-[#0f2b48]">Performance builds future credibility</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Verified pilot milestone completions feed directly back into the startup's Capability Passport, unlocking larger national tenders.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ===================================================================== */}
      {/* 10. FINAL CTA */}
      {/* ===================================================================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#0f2b48] to-[#16385c] text-white">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-orange-300 text-xs font-bold border border-white/20">
            <ShieldCheck className="w-4 h-4 text-[#f97316]" />
            <span>Public Sector Transformation</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Build the bridge between public problems and private innovation.
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Join the national trust platform connecting departmental challenges with verified startup capabilities 
            under compliant innovation frameworks.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onOpenAuth('startup', true)}
              className="w-full sm:w-auto px-8 py-3.5 text-xs font-extrabold text-white bg-gradient-to-r from-[#ea580c] to-[#f97316] hover:from-[#c2410c] hover:to-[#ea580c] rounded-xl shadow-lg transition-all neu-button"
            >
              Join as Startup
            </button>
            <button
              onClick={() => onOpenAuth('govt', true)}
              className="w-full sm:w-auto px-8 py-3.5 text-xs font-extrabold text-[#0f2b48] bg-white hover:bg-slate-100 rounded-xl shadow-lg transition-all neu-button"
            >
              Join as Government
            </button>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 11. FOOTER */}
      {/* ===================================================================== */}
      <footer className="bg-[#0a1d31] text-white py-14 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#0f2b48] flex items-center justify-center border border-slate-700">
                <ShieldCheck className="w-5 h-5 text-[#f97316]" />
              </div>
              <span className="text-lg font-black tracking-tight">PROCURE<span className="text-[#ea580c]">SETU</span></span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Connecting Government Problems with Startup Capabilities through Evidence, Trust and Transparent Procurement.
            </p>
            <p className="text-[10px] text-slate-500">
              Operates as an intelligence layer BEFORE GeM & e-tendering.
            </p>
          </div>

          {/* Product links */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">Product</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button 
                  onClick={() => {
                    const el = document.getElementById('home');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Opportunity Radar
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    const el = document.getElementById('about');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Evidence Vault & Audit
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    const el = document.getElementById('how-it-works');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Capability Passports
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    const el = document.getElementById('for-government');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Procurement Readiness Dossier
                </button>
              </li>
            </ul>
          </div>

          {/* User Portals */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">User Gateways</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => onOpenAuth('startup', false)} className="hover:text-white transition-colors">
                  Startup Portal Login
                </button>
              </li>
              <li>
                <button onClick={() => onOpenAuth('startup', true)} className="hover:text-white transition-colors">
                  Startup Organization Signup
                </button>
              </li>
              <li>
                <button onClick={() => onOpenAuth('govt', false)} className="hover:text-white transition-colors">
                  Government Department Login
                </button>
              </li>
              <li>
                <button onClick={() => onOpenAuth('govt', true)} className="hover:text-white transition-colors">
                  Department Nodal Registration
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Contact */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">Compliance & Contact</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => setModalType('contact')} className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Mail className="w-3 h-3 text-[#ea580c]" />
                  <span>Contact Directorate</span>
                </button>
              </li>
              <li>
                <button onClick={() => setModalType('privacy')} className="hover:text-white transition-colors">
                  Privacy Policy & Data Security
                </button>
              </li>
              <li>
                <button onClick={() => setModalType('terms')} className="hover:text-white transition-colors">
                  Terms of Service (GFR 173i / 194)
                </button>
              </li>
              <li className="pt-1 text-[11px] text-slate-500 font-mono">
                Ministry Innovation Hub · New Delhi
              </li>
            </ul>
          </div>

        </div>

        <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-slate-800 text-center sm:flex sm:justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} ProcureSetu. Innovation Procurement Intelligence Platform.</p>
          <p className="mt-2 sm:mt-0">General Financial Rules (GFR) 2017 Compliant Architecture.</p>
        </div>
      </footer>

      {/* ===================================================================== */}
      {/* FUNCTIONAL FOOTER MODALS (Contact, Privacy, Terms) */}
      {/* ===================================================================== */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-[#0f2b48] px-6 py-4 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold">
                {modalType === 'contact' ? 'Contact ProcureSetu Directorate' :
                 modalType === 'privacy' ? 'Privacy Policy & Data Security' : 'Terms of Service'}
              </h3>
              <button onClick={() => setModalType(null)} className="p-1 rounded-lg text-slate-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 text-xs text-slate-600 space-y-3 leading-relaxed max-h-[60vh] overflow-y-auto">
              {modalType === 'contact' && (
                <div className="space-y-3">
                  <p>For nodal officer queries, startup onboarding, or testbed integrations, please reach our helpdesk:</p>
                  <div className="p-3 bg-slate-50 rounded-xl space-y-2 border border-slate-200">
                    <div className="flex items-center gap-2 font-bold text-slate-800">
                      <Mail className="w-4 h-4 text-[#ea580c]" />
                      <span>nodal-desk@procuresetu.gov.in</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <Phone className="w-4 h-4 text-[#ea580c]" />
                      <span>Toll Free: 1800-11-7388 (9:00 AM - 6:00 PM IST)</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500">Government Innovation Procurement Support Cell, New Delhi, India.</p>
                </div>
              )}

              {modalType === 'privacy' && (
                <div className="space-y-2">
                  <p className="font-bold text-slate-800">Data Protection & Evidence Integrity:</p>
                  <p>1. <strong>Cryptographic SHA-256 Hashing:</strong> All technical test reports deposited in the Evidence Vault are cryptographically fingerprinted to prevent unauthorized post-submission modification.</p>
                  <p>2. <strong>Intellectual Property Safeguards:</strong> Startup source code, proprietary formulas, and unpatented CAD drawings are stored under encrypted access controls and are only accessible by designated Nodal Technical Committee members.</p>
                  <p>3. <strong>Zero Commercial Data Selling:</strong> ProcureSetu operates purely as public interest procurement intelligence infrastructure.</p>
                </div>
              )}

              {modalType === 'terms' && (
                <div className="space-y-2">
                  <p className="font-bold text-slate-800">Statutory Framework & Terms:</p>
                  <p>1. <strong>GFR Rule 173(i) Compliance:</strong> Startups recognized by DPIIT are eligible for waiver of prior turnover and experience conditions, provided technical capability is verified through accredited testbeds or pilot logs.</p>
                  <p>2. <strong>Role of ProcureSetu:</strong> ProcureSetu generates pre-procurement intelligence and readiness dossiers. Formal contractual purchase orders and tender awards are concluded through official portals (such as GeM or state e-procurement).</p>
                  <p>3. <strong>Milestone Verification:</strong> Milestones approved in the system constitute technical delivery recommendations for treasury release.</p>
                </div>
              )}
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setModalType(null)}
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
