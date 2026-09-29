import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  UserCircle2, 
  MapPin, 
  Globe, 
  Users, 
  ShieldCheck, 
  Save, 
  Award,
  CheckCircle2
} from 'lucide-react';

export const ProfileSection: React.FC = () => {
  const { currentStartupProfile, currentUser, updateStartupProfile, addToast } = useApp();

  const [companyName, setCompanyName] = useState(currentStartupProfile?.companyName || currentUser?.organizationName || '');
  const [bio, setBio] = useState(currentStartupProfile?.bio || '');
  const [headquarters, setHeadquarters] = useState(currentStartupProfile?.headquarters || '');
  const [teamSize, setTeamSize] = useState(currentStartupProfile?.teamSize || '');
  const [website, setWebsite] = useState(currentStartupProfile?.website || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateStartupProfile({
      companyName,
      bio,
      headquarters,
      teamSize,
      website
    });
    addToast('Startup profile updated successfully.', 'success');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-blue-100 text-blue-900 font-black text-[10px] uppercase rounded-md tracking-wider">
            Organization Settings
          </span>
          <h2 className="text-base sm:text-lg font-black text-[#0f2b48]">
            Startup Organization Profile
          </h2>
        </div>
        <p className="text-xs text-slate-600 mt-0.5">
          Manage your verified entity credentials, DPIIT linkages, and organizational details.
        </p>
      </div>

      <div className="neu-card p-6 bg-white border border-slate-200 rounded-2xl space-y-6">
        {/* Verification Status Banner */}
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-emerald-950">DPIIT Verified Startup</h4>
              <p className="text-[11px] text-emerald-700">Recognition ID: {currentStartupProfile?.dpiitNumber || 'DIPP-89421-IN'} · GFR 173(i) Active</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-white text-emerald-800 font-black text-xs rounded-lg border border-emerald-300 shadow-2xs">
            Turnover-Exempt
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Company / Startup Legal Name
            </label>
            <input
              type="text"
              required
              value={companyName}
              onChange={e => setCompanyName(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-hidden focus:ring-1 focus:ring-[#0f2b48]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Founder / Authorized Representative
              </label>
              <input
                type="text"
                disabled
                value={currentStartupProfile?.founderName || currentUser?.name || ''}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Official Email
              </label>
              <input
                type="text"
                disabled
                value={currentUser?.email || ''}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Company Bio & Technical Focus
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={e => setBio(e.target.value)}
              className="w-full p-2.5 text-xs border border-slate-300 rounded-lg outline-hidden focus:ring-1 focus:ring-[#0f2b48]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Headquarters
              </label>
              <input
                type="text"
                value={headquarters}
                onChange={e => setHeadquarters(e.target.value)}
                placeholder="e.g., Bengaluru, Karnataka"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-hidden"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Team Size
              </label>
              <input
                type="text"
                value={teamSize}
                onChange={e => setTeamSize(e.target.value)}
                placeholder="e.g., 18 Engineers & Scientists"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-hidden"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Official Website
              </label>
              <input
                type="text"
                value={website}
                onChange={e => setWebsite(e.target.value)}
                placeholder="https://..."
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
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
