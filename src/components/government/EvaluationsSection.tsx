import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Application } from '../../types';
import { GovernmentEvaluationWorkspace } from './GovernmentEvaluationWorkspace';
import { 
  Award, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  Eye, 
  Search, 
  Filter, 
  ChevronRight, 
  FileText, 
  Building2, 
  Compass, 
  ArrowRight,
  HelpCircle,
  XCircle,
  Sparkles
} from 'lucide-react';

export const EvaluationsSection: React.FC = () => {
  const { applications, selectedApplicationId, setSelectedApplicationId } = useApp();

  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Sync if selectedApplicationId changes in context
  useEffect(() => {
    if (selectedApplicationId) {
      const found = applications.find(a => a.id === selectedApplicationId);
      if (found) {
        setSelectedApp(found);
      }
    }
  }, [selectedApplicationId, applications]);

  // If an application is selected, render the dedicated Government Evaluation Workspace
  if (selectedApp) {
    return (
      <GovernmentEvaluationWorkspace 
        application={selectedApp}
        onBack={() => {
          setSelectedApp(null);
          setSelectedApplicationId(null);
        }}
        onSelectApplication={(app) => {
          setSelectedApp(app);
          setSelectedApplicationId(app.id);
        }}
      />
    );
  }

  // Filter applications
  const filteredApps = applications.filter(app => {
    const matchesSearch = 
      app.startupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.opportunityTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.sector.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesStatus = true;
    if (statusFilter === 'under_review') {
      matchesStatus = app.status === 'under_review' || app.status === 'submitted' || app.status === 'applied';
    } else if (statusFilter === 'needs_clarification') {
      matchesStatus = app.status === 'needs_clarification';
    } else if (statusFilter === 'shortlisted') {
      matchesStatus = app.status === 'shortlisted';
    } else if (statusFilter === 'procurement_ready') {
      matchesStatus = app.status === 'procurement_ready';
    } else if (statusFilter === 'rejected') {
      matchesStatus = app.status === 'rejected';
    }

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'procurement_ready':
        return { label: 'Procurement Ready', bg: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
      case 'shortlisted':
        return { label: 'Shortlisted', bg: 'bg-purple-100 text-purple-800 border-purple-300' };
      case 'needs_clarification':
        return { label: 'Needs Clarification', bg: 'bg-amber-100 text-amber-800 border-amber-300' };
      case 'rejected':
        return { label: 'Rejected', bg: 'bg-rose-100 text-rose-800 border-rose-300' };
      default:
        return { label: 'Awaiting Scrutiny', bg: 'bg-blue-100 text-blue-800 border-blue-300' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-purple-100 text-purple-900 font-black text-[10px] uppercase rounded-md tracking-wider">
              Scrutiny & Decision Desk
            </span>
            <h2 className="text-xl font-black text-[#0f2b48]">
              Government Evaluation Workspace
            </h2>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Review startup technical dossiers across 6 canonical criteria. AI-assisted insights provide verification summaries; final decisions are made by the government officer.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs self-start sm:self-auto">
          <span>Total Proposals:</span>
          <strong className="text-[#0f2b48] font-black">{applications.length}</strong>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-1">
          <span className="text-slate-500 font-bold uppercase text-[10px]">Awaiting Evaluation</span>
          <div className="text-xl font-black text-blue-700">
            {applications.filter(a => ['submitted', 'applied', 'under_review'].includes(a.status)).length}
          </div>
          <span className="text-[10px] text-slate-400">Ready for review</span>
        </div>

        <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-1">
          <span className="text-slate-500 font-bold uppercase text-[10px]">Needs Clarification</span>
          <div className="text-xl font-black text-amber-600">
            {applications.filter(a => a.status === 'needs_clarification').length}
          </div>
          <span className="text-[10px] text-slate-400">Awaiting startup reply</span>
        </div>

        <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-1">
          <span className="text-slate-500 font-bold uppercase text-[10px]">Shortlisted for Pilot</span>
          <div className="text-xl font-black text-purple-700">
            {applications.filter(a => a.status === 'shortlisted').length}
          </div>
          <span className="text-[10px] text-slate-400">Pilot stage approved</span>
        </div>

        <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-1">
          <span className="text-slate-500 font-bold uppercase text-[10px]">Procurement Ready</span>
          <div className="text-xl font-black text-emerald-700">
            {applications.filter(a => a.status === 'procurement_ready').length}
          </div>
          <span className="text-[10px] text-slate-400">Dossier certified</span>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by startup, challenge title, or sector..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:ring-2 focus:ring-[#0f2b48]"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {[
            { id: 'all', label: 'All Submissions' },
            { id: 'under_review', label: 'Awaiting Scrutiny' },
            { id: 'needs_clarification', label: 'Needs Clarification' },
            { id: 'shortlisted', label: 'Shortlisted' },
            { id: 'procurement_ready', label: 'Procurement Ready' },
            { id: 'rejected', label: 'Rejected' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                statusFilter === f.id
                  ? 'bg-[#0f2b48] text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Startup & Sector</th>
                <th className="px-5 py-3.5">Target Opportunity</th>
                <th className="px-5 py-3.5">Evidence Docs</th>
                <th className="px-5 py-3.5">Composite Score</th>
                <th className="px-5 py-3.5">Current Status</th>
                <th className="px-5 py-3.5 text-right">Workspace Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-slate-400 text-xs">
                    No applications found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredApps.map(app => {
                  const statusInfo = getStatusBadge(app.status);
                  return (
                    <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-extrabold text-[#0f2b48] text-sm">{app.startupName}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                          <span className="font-semibold text-slate-700">{app.sector}</span>
                          <span>·</span>
                          <span className="font-bold text-emerald-700">TRL {app.trlProposed}</span>
                        </div>
                      </td>

                      <td className="px-5 py-4 max-w-[260px]">
                        <div className="font-bold text-slate-800 truncate" title={app.opportunityTitle}>
                          {app.opportunityTitle}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate mt-0.5">
                          {app.departmentName}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="px-2.5 py-1 bg-blue-50 text-blue-900 border border-blue-200 rounded-lg text-xs font-semibold flex items-center gap-1 w-fit">
                          <FileText className="w-3.5 h-3.5 text-blue-600" />
                          <span>{app.attachedEvidenceIds?.length || 3} Verified Docs</span>
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        {app.evaluationScores ? (
                          <div>
                            <div className="font-black text-sm text-emerald-700">
                              {app.evaluationScores.totalScore} / 100
                            </div>
                            <span className="text-[10px] text-slate-400">Scored by Nodal Board</span>
                          </div>
                        ) : (
                          <span className="text-amber-700 text-xs font-semibold flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>Awaiting Scoring</span>
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border ${statusInfo.bg}`}>
                          {statusInfo.label}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedApp(app);
                            setSelectedApplicationId(app.id);
                          }}
                          className="px-4 py-2 text-xs font-bold text-white bg-[#0f2b48] hover:bg-[#ea580c] rounded-xl transition-all shadow-2xs cursor-pointer inline-flex items-center gap-1.5 group"
                        >
                          <span>Open Workspace</span>
                          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
