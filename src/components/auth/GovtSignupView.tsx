import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { SECTOR_OPTIONS } from '../../data/mockData';
import { INDIAN_STATES } from '../../data/indianStates';
import { 
  Building2, 
  ShieldCheck, 
  ArrowLeft, 
  Check, 
  AlertCircle, 
  Info,
  CheckCircle2
} from 'lucide-react';

export const GovtSignupView: React.FC = () => {
  const { signupGovt, users, navigateTo } = useApp();

  // 17 Fields State
  const [departmentName, setDepartmentName] = useState('');
  const [authorizedOfficerName, setAuthorizedOfficerName] = useState('');
  const [officialEmail, setOfficialEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [ministry, setMinistry] = useState('');
  const [directorateDivision, setDirectorateDivision] = useState('');
  const [state, setState] = useState('Delhi');
  const [district, setDistrict] = useState('');
  const [designation, setDesignation] = useState('');
  const [departmentCategory, setDepartmentCategory] = useState('Central Ministry');
  const [areasOfResponsibility, setAreasOfResponsibility] = useState('');
  const [officeAddress, setOfficeAddress] = useState('');
  const [officialWebsite, setOfficialWebsite] = useState('');
  const [officerId, setOfficerId] = useState('');
  const [problemDomains, setProblemDomains] = useState<string[]>(['Water', 'Civil', 'CleanTech']);

  // Touched state for inline validation messages
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  // Validation Checks
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const cleanMobile = mobileNumber.replace(/[\s\-+]/g, '').replace(/^91/, '');
  const isMobileValid = /^[6-9]\d{9}$/.test(cleanMobile);
  const isEmailValid = emailRegex.test(officialEmail.trim());
  const isDuplicateEmail = users.some(u => u.email.toLowerCase() === officialEmail.trim().toLowerCase());
  const isPasswordStrong = password.length >= 6 && /[A-Za-z]/.test(password) && /\d/.test(password);
  const doPasswordsMatch = password === confirmPassword && confirmPassword.length > 0;

  // Global validity check for required fields
  const isFormValid = useMemo(() => {
    return (
      departmentName.trim().length > 0 &&
      authorizedOfficerName.trim().length > 0 &&
      isEmailValid &&
      !isDuplicateEmail &&
      isMobileValid &&
      isPasswordStrong &&
      doPasswordsMatch &&
      ministry.trim().length > 0 &&
      state.trim().length > 0 &&
      designation.trim().length > 0 &&
      departmentCategory.trim().length > 0 &&
      areasOfResponsibility.trim().length > 0 &&
      officeAddress.trim().length > 0
    );
  }, [
    departmentName,
    authorizedOfficerName,
    isEmailValid,
    isDuplicateEmail,
    isMobileValid,
    isPasswordStrong,
    doPasswordsMatch,
    ministry,
    state,
    designation,
    departmentCategory,
    areasOfResponsibility,
    officeAddress
  ]);

  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!isFormValid) {
      setSubmitError('Please complete all mandatory fields with valid values.');
      return;
    }

    const res = signupGovt({
      departmentName,
      authorizedOfficerName,
      officialEmail,
      mobileNumber: cleanMobile,
      password,
      confirmPassword,
      ministry,
      directorateDivision,
      state,
      district,
      designation,
      departmentCategory,
      areasOfResponsibility,
      officeAddress,
      officialWebsite,
      officerId,
      problemDomains
    });

    if (!res.success) {
      setSubmitError(res.message || 'Failed to register government department account.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4.5rem)] py-10 px-4 sm:px-6 lg:px-8 bg-[#f0f4f8]">
      <div className="max-w-4xl mx-auto">
        
        {/* Navigation & Header */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigateTo('/login')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#0f2b48] bg-white px-3 py-1.5 rounded-lg border border-slate-200 transition-colors shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Login</span>
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Startup entity instead?</span>
            <button
              onClick={() => navigateTo('/signup/startup')}
              className="text-xs font-bold text-[#ea580c] hover:underline"
            >
              Startup Signup
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden neu-card">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-[#0f2b48] to-[#16385c] px-6 sm:px-8 py-6 text-white">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-sky-400 flex items-center justify-center border border-blue-500/40 shrink-0">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-sky-300">
                  GOVERNMENT NODAL ONBOARDING
                </span>
                <h1 className="text-xl sm:text-2xl font-black">Register Government Directorate Account</h1>
                <p className="text-xs text-slate-300 mt-0.5">
                  Authorized under GFR 173(i) and Rule 194 to post operational challenges and audit startup evidence dossiers.
                </p>
              </div>
            </div>
          </div>

          {submitError && (
            <div className="mx-6 sm:mx-8 mt-6 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-xs text-red-700 font-medium">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">

            {/* SECTION 1: DEPARTMENT & OFFICER INFORMATION */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200 text-xs font-bold text-[#0f2b48] uppercase tracking-wide">
                <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[11px] font-black text-[#0f2b48]">1</span>
                <span>Department Identification & Officer Credentials</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Department Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    1. Department / Directorate Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={departmentName}
                    onChange={e => setDepartmentName(e.target.value)}
                    onBlur={() => handleBlur('departmentName')}
                    placeholder="e.g. Department of Drinking Water & Sanitation"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-hidden focus:ring-1 focus:ring-[#0f2b48]"
                  />
                  {touched.departmentName && !departmentName.trim() && (
                    <p className="text-[10px] text-red-600 mt-1">Department name is required.</p>
                  )}
                </div>

                {/* 2. Authorized Officer Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    2. Authorized Officer Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={authorizedOfficerName}
                    onChange={e => setAuthorizedOfficerName(e.target.value)}
                    onBlur={() => handleBlur('authorizedOfficerName')}
                    placeholder="e.g. Dr. Rajeshwari Sharma, IAS"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-hidden focus:ring-1 focus:ring-[#0f2b48]"
                  />
                  {touched.authorizedOfficerName && !authorizedOfficerName.trim() && (
                    <p className="text-[10px] text-red-600 mt-1">Officer name is required.</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 3. Official Email */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    3. Official Government Email (@nic.in / @gov.in / demo) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={officialEmail}
                    onChange={e => setOfficialEmail(e.target.value)}
                    onBlur={() => handleBlur('officialEmail')}
                    placeholder="e.g. director.procure@nic.in"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-hidden focus:ring-1 focus:ring-[#0f2b48]"
                  />
                  {touched.officialEmail && !isEmailValid && (
                    <p className="text-[10px] text-red-600 mt-1">Please enter a valid official email format.</p>
                  )}
                  {isDuplicateEmail && (
                    <p className="text-[10px] text-red-600 mt-1">An account with this email already exists.</p>
                  )}
                </div>

                {/* 4. Mobile Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    4. Official Mobile Number (10 digits) <span className="text-red-500">*</span>
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-2.5 rounded-l-lg border border-r-0 border-slate-300 bg-slate-100 text-slate-600 text-xs font-medium">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      value={mobileNumber}
                      onChange={e => setMobileNumber(e.target.value)}
                      onBlur={() => handleBlur('mobileNumber')}
                      placeholder="9811234567"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-r-lg outline-hidden focus:ring-1 focus:ring-[#0f2b48]"
                    />
                  </div>
                  {touched.mobileNumber && !isMobileValid && (
                    <p className="text-[10px] text-red-600 mt-1">Must be a valid 10-digit Indian mobile number.</p>
                  )}
                </div>
              </div>

              {/* Password & Confirm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 5. Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    5. Password (Min 6 chars with letters & numbers) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onBlur={() => handleBlur('password')}
                    placeholder="Enter secure password"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-hidden focus:ring-1 focus:ring-[#0f2b48]"
                  />
                  {touched.password && !isPasswordStrong && (
                    <p className="text-[10px] text-red-600 mt-1">Password must have &ge;6 characters with letters and numbers.</p>
                  )}
                </div>

                {/* 6. Confirm Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    6. Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    onBlur={() => handleBlur('confirmPassword')}
                    placeholder="Re-type password"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-hidden focus:ring-1 focus:ring-[#0f2b48]"
                  />
                  {touched.confirmPassword && !doPasswordsMatch && (
                    <p className="text-[10px] text-red-600 mt-1">Passwords do not match.</p>
                  )}
                </div>
              </div>
            </div>

            {/* SECTION 2: MINISTRY & JURISDICTION */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200 text-xs font-bold text-[#0f2b48] uppercase tracking-wide">
                <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[11px] font-black text-[#0f2b48]">2</span>
                <span>Ministry, Directorate & Administrative Level</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 7. Department / Ministry */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    7. Department / Ministry <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={ministry}
                    onChange={e => setMinistry(e.target.value)}
                    onBlur={() => handleBlur('ministry')}
                    placeholder="e.g. Ministry of Jal Shakti, Government of India"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-hidden"
                  />
                  {touched.ministry && !ministry.trim() && (
                    <p className="text-[10px] text-red-600 mt-1">Ministry is required.</p>
                  )}
                </div>

                {/* 8. Directorate / Division */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    8. Directorate / Division
                  </label>
                  <input
                    type="text"
                    value={directorateDivision}
                    onChange={e => setDirectorateDivision(e.target.value)}
                    placeholder="e.g. National Water Mission / Innovation Wing"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* 9. State */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    9. State / UT <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={state}
                    onChange={e => setState(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-hidden bg-white text-slate-700"
                  >
                    {INDIAN_STATES.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                {/* 10. District */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    10. District
                  </label>
                  <input
                    type="text"
                    value={district}
                    onChange={e => setDistrict(e.target.value)}
                    placeholder="e.g. New Delhi"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-hidden"
                  />
                </div>

                {/* 11. Designation */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    11. Nodal Designation <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={designation}
                    onChange={e => setDesignation(e.target.value)}
                    onBlur={() => handleBlur('designation')}
                    placeholder="e.g. Joint Secretary / Director (Tech)"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-hidden"
                  />
                  {touched.designation && !designation.trim() && (
                    <p className="text-[10px] text-red-600 mt-1">Designation is required.</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 12. Department Category */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    12. Department Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={departmentCategory}
                    onChange={e => setDepartmentCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-hidden bg-white text-slate-700"
                  >
                    <option value="Central Ministry">Central Ministry / Department</option>
                    <option value="State Department">State Government Department</option>
                    <option value="Autonomous Institute / PSU">Autonomous Research Institute / PSU</option>
                    <option value="Municipal Corporation">Municipal Corporation / Smart City SPV</option>
                    <option value="Special Purpose Vehicle">Special Purpose Vehicle (SPV)</option>
                  </select>
                </div>

                {/* 16. Government Employee / Officer ID */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    16. Government Employee / Officer ID
                  </label>
                  <input
                    type="text"
                    value={officerId}
                    onChange={e => setOfficerId(e.target.value)}
                    placeholder="e.g. NIC-JS-78291"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-hidden font-mono"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 3: RESPONSIBILITY & OFFICE ADDRESS */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200 text-xs font-bold text-[#0f2b48] uppercase tracking-wide">
                <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[11px] font-black text-[#0f2b48]">3</span>
                <span>Scope of Responsibility & Problem Domains</span>
              </div>

              {/* 13. Areas of Responsibility */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  13. Areas of Responsibility / Procurement Scope <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={areasOfResponsibility}
                  onChange={e => setAreasOfResponsibility(e.target.value)}
                  onBlur={() => handleBlur('areasOfResponsibility')}
                  placeholder="e.g. Rural drinking water safety, in-line water quality monitoring, innovation challenge procurement under GFR 194..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-hidden"
                />
                {touched.areasOfResponsibility && !areasOfResponsibility.trim() && (
                  <p className="text-[10px] text-red-600 mt-0.5">Areas of responsibility is required.</p>
                )}
              </div>

              {/* 14. Office Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  14. Official Office Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={officeAddress}
                  onChange={e => setOfficeAddress(e.target.value)}
                  onBlur={() => handleBlur('officeAddress')}
                  placeholder="e.g. Paryavaran Bhawan, CGO Complex, Lodhi Road, New Delhi 110003"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-hidden"
                />
                {touched.officeAddress && !officeAddress.trim() && (
                  <p className="text-[10px] text-red-600 mt-0.5">Office address is required.</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 15. Official Website */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    15. Official Department Website
                  </label>
                  <input
                    type="url"
                    value={officialWebsite}
                    onChange={e => setOfficialWebsite(e.target.value)}
                    placeholder="https://jalshakti.gov.in"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-hidden"
                  />
                </div>

                {/* 17. Problem Domains */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    17. Problem Domains of Interest
                  </label>
                  <select
                    multiple
                    size={2}
                    value={problemDomains}
                    onChange={e => {
                      const selected = Array.from(e.target.selectedOptions, option => option.value);
                      setProblemDomains(selected);
                    }}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg outline-hidden bg-white text-slate-700"
                  >
                    {SECTOR_OPTIONS.filter(s => s !== 'All Sectors').map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Selected: {problemDomains.join(', ') || 'None'}</span>
                </div>
              </div>
            </div>

            {/* Validation Notice & Submit Button */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                {isFormValid ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    All required official fields verified.
                  </span>
                ) : (
                  <span className="text-amber-700 flex items-center gap-1 font-medium">
                    <Info className="w-4 h-4 text-amber-600" />
                    Please complete all mandatory (*) fields to enable registration.
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={!isFormValid}
                className={`px-8 py-3 text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 ${
                  isFormValid 
                    ? 'text-white bg-[#0f2b48] hover:bg-[#16385c] cursor-pointer'
                    : 'text-slate-400 bg-slate-200 cursor-not-allowed shadow-none'
                }`}
              >
                <span>Authorize & Open Directorate Dashboard</span>
                <Check className="w-4 h-4 text-[#f97316]" />
              </button>
            </div>

          </form>

        </div>

      </div>
    </div>
  );
};
