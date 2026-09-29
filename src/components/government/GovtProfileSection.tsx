import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Building2, UserCircle2, MapPin, Mail, Phone, ShieldCheck, Save, CheckCircle2 } from 'lucide-react';

export const GovtProfileSection: React.FC = () => {
  const { currentUser, addToast } = useApp();

  const [officerName, setOfficerName] = useState(currentUser?.name || 'Dr. Rajeshwari Sharma, IAS');
  const [departmentName, setDepartmentName] = useState(currentUser?.organizationName || 'Department of Drinking Water & Sanitation');
  const [ministry, setMinistry] = useState(currentUser?.ministry || 'Ministry of Jal Shakti, Government of India');
  const [designation, setDesignation] = useState(currentUser?.designation || 'Joint Secretary & Nodal Director (Procurement Innovation)');
  const [phone, setPhone] = useState(currentUser?.phone || '+91 11 2436 4501');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('Government officer profile credentials updated.', 'success');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-blue-100 text-blue-900 font-black text-[10px] uppercase rounded-md tracking-wider">
            Nodal Credentials
          </span>
          <h2 className="text-base sm:text-lg font-black text-[#0f2b48]">
            Government Officer Profile
          </h2>
        </div>
        <p className="text-xs text-slate-600 mt-0.5">
          Authorized procurement evaluator credentials and ministerial jurisdiction.
        </p>
      </div>

      <div className="neu-card p-6 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-6">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0f2b48] text-white flex items-center justify-center font-bold">
              <Building2 className="w-6 h-6 text-[#ea580c]" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#0f2b48]">Government Nodal Officer Verified</h4>
              <p className="text-[11px] text-slate-600">Officer ID: GOV-IAS-2025-998 · Authorized Evaluator</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-white text-[#0f2b48] font-black text-xs rounded-lg border border-blue-200 shadow-2xs">
            NIC Verified
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Officer Name & Cadre</label>
              <input
                type="text"
                required
                value={officerName}
                onChange={e => setOfficerName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-hidden focus:ring-1 focus:ring-[#0f2b48]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Official Designation</label>
              <input
                type="text"
                required
                value={designation}
                onChange={e => setDesignation(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Ministry / Central Dept</label>
              <input
                type="text"
                required
                value={ministry}
                onChange={e => setMinistry(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Department / Directorate</label>
              <input
                type="text"
                required
                value={departmentName}
                onChange={e => setDepartmentName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Official Government Email</label>
              <input
                type="text"
                disabled
                value={currentUser?.email || 'govt@procuresetu.demo'}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Contact Phone</label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-hidden"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-slate-100">
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-[#0f2b48] hover:bg-[#16385c] rounded-lg shadow-2xs flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Profile</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
