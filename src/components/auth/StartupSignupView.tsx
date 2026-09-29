import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { StartupStage } from '../../types';
import { SECTOR_OPTIONS } from '../../data/mockData';
import { INDIAN_STATES } from '../../data/indianStates';
import { 
  Rocket, 
  ShieldCheck, 
  ArrowLeft, 
  Check, 
  AlertCircle, 
  Building2, 
  Info,
  CheckCircle2
} from 'lucide-react';

export const StartupSignupView: React.FC = () => {
  const { signupStartup, users, navigateTo } = useApp();

  const currentYear = new Date().getFullYear();

  // 21 Fields State
  const [companyName, setCompanyName] = useState('');
  const [founderName, setFounderName] = useState('');
  const [officialEmail, setOfficialEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [dpiitNumber, setDpiitNumber] = useState('');
  const [foundedYear, setFoundedYear] = useState<number>(currentYear - 2);
  const [stage, setStage] = useState<StartupStage>('Early Revenue');
  const [primarySector, setPrimarySector] = useState('Water');
  const [secondarySectors, setSecondarySectors] = useState<string[]>(['Electronics', 'Hardware']);
  const [headquartersCity, setHeadquartersCity] = useState('');
  const [state, setState] = useState('Karnataka');
  const [website, setWebsite] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [keyCapabilities, setKeyCapabilities] = useState('');
  const [existingProduct, setExistingProduct] = useState('');
  const [previousDeployments, setPreviousDeployments] = useState('');
  const [governmentExperience, setGovernmentExperience] = useState('');
  const [teamSize, setTeamSize] = useState('11-25 Members');

  // Touched state for inline validation messages
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  // Validation Checks
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Indian mobile: 10 digits starting with 6,7,8,9 (or stripping +91)
  const cleanMobile = mobileNumber.replace(/[\s\-+]/g, '').replace(/^91/, '');
  const isMobileValid = /^[6-9]\d{9}$/.test(cleanMobile);
  const isEmailValid = emailRegex.test(officialEmail.trim());
  const isDuplicateEmail = users.some(u => u.email.toLowerCase() === officialEmail.trim().toLowerCase());
  const isPasswordStrong = password.length >= 6 && /[A-Za-z]/.test(password) && /\d/.test(password);
  const doPasswordsMatch = password === confirmPassword && confirmPassword.length > 0;
  const isYearValid = foundedYear >= 1990 && foundedYear <= currentYear;

  // Global validity check for required fields
  const isFormValid = useMemo(() => {
    return (
      companyName.trim().length > 0 &&
      founderName.trim().length > 0 &&
      isEmailValid &&
      !isDuplicateEmail &&
      isMobileValid &&
      isPasswordStrong &&
      doPasswordsMatch &&
      isYearValid &&
      headquartersCity.trim().length > 0 &&
      state.trim().length > 0 &&
      shortDescription.trim().length > 0 &&
      keyCapabilities.trim().length > 0 &&
      existingProduct.trim().length > 0 &&
      teamSize.trim().length > 0
    );
  }, [
    companyName,
    founderName,
    isEmailValid,
    isDuplicateEmail,
    isMobileValid,
    isPasswordStrong,
    doPasswordsMatch,
    isYearValid,
    headquartersCity,
    state,
    shortDescription,
    keyCapabilities,
    existingProduct,
    teamSize
  ]);

  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!isFormValid) {
      setSubmitError('Please address the highlighted errors before submitting.');
      return;
    }

    const res = signupStartup({
      companyName,
      founderName,
      officialEmail,
      mobileNumber: cleanMobile,
      password,
      confirmPassword,
      registrationNumber,
      dpiitNumber,
      foundedYear,
      stage,
      primarySector,
      secondarySectors,
      headquartersCity,
      state,
      website,
      shortDescription,
      keyCapabilities,
      existingProduct,
      previousDeployments,
      governmentExperience,
      teamSize
    });

    if (!res.success) {
      setSubmitError(res.message || 'Failed to register startup account.');
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
            <span className="text-xs text-slate-500">Government department instead?</span>
            <button
              onClick={() => navigateTo('/signup/government')}
              className="text-xs font-bold text-[#0f2b48] hover:underline"
            >
              Government Signup
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden neu-card">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-[#0f2b48] to-[#16385c] px-6 sm:px-8 py-6 text-white">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-orange-500/20 text-[#f97316] flex items-center justify-center border border-orange-500/40 shrink-0">
                <Rocket className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-orange-300">
                  STARTUP INNOVATION ONBOARDING
                </span>
                <h1 className="text-xl sm:text-2xl font-black">Register Startup Capability Entity</h1>
                <p className="text-xs text-slate-300 mt-0.5">
                  Qualify for GFR Rule 173(i) prior-turnover exemption and connect with government problem statements.
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

            {/* SECTION 1: ENTITY & CONTACT INFORMATION */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200 text-xs font-bold text-[#0f2b48] uppercase tracking-wide">
                <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[11px] font-black text-[#ea580c]">1</span>
                <span>Entity & Representative Credentials</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Company Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    1. Company / Startup Legal Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    onBlur={() => handleBlur('companyName')}
                    placeholder="e.g. Agastya AquaSens Technologies Pvt Ltd"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-hidden focus:ring-1 focus:ring-[#0f2b48]"
                  />
                  {touched.companyName && !companyName.trim() && (
                    <p className="text-[10px] text-red-600 mt-1">Company name is required.</p>
                  )}
                </div>

                {/* 2. Founder Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    2. Founder / Authorized Representative Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={founderName}
                    onChange={e => setFounderName(e.target.value)}
                    onBlur={() => handleBlur('founderName')}
                    placeholder="e.g. Vikramaditya Roy"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-hidden focus:ring-1 focus:ring-[#0f2b48]"
                  />
                  {touched.founderName && !founderName.trim() && (
                    <p className="text-[10px] text-red-600 mt-1">Founder / Representative name is required.</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 3. Official Email */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    3. Official Corporate Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={officialEmail}
                    onChange={e => setOfficialEmail(e.target.value)}
                    onBlur={() => handleBlur('officialEmail')}
                    placeholder="e.g. founder@aquasens.in"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-hidden focus:ring-1 focus:ring-[#0f2b48]"
                  />
                  {touched.officialEmail && !isEmailValid && (
                    <p className="text-[10px] text-red-600 mt-1">Please enter a valid email format.</p>
                  )}
                  {isDuplicateEmail && (
                    <p className="text-[10px] text-red-600 mt-1">An account with this email already exists.</p>
                  )}
                </div>

                {/* 4. Mobile Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    4. Indian Mobile Number (10 digits) <span className="text-red-500">*</span>
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
                      placeholder="9845012890"
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

            {/* SECTION 2: REGISTRATION & STAGE */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200 text-xs font-bold text-[#0f2b48] uppercase tracking-wide">
                <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[11px] font-black text-[#ea580c]">2</span>
                <span>Statutory Registration & Maturity Stage</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 7. Startup Registration Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    7. Startup Registration No. (CIN / LLPIN / Udyam)
                  </label>
                  <input
                    type="text"
                    value={registrationNumber}
                    onChange={e => setRegistrationNumber(e.target.value)}
                    placeholder="e.g. U74999KA2022PTC158902"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-hidden font-mono"
                  />
                </div>

                {/* 8. DPIIT Recognition Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    8. DPIIT Recognition Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={dpiitNumber}
                    onChange={e => setDpiitNumber(e.target.value)}
                    placeholder="e.g. DIPP-89421-IN"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-hidden font-mono"
                  />
                  <span className="text-[10px] text-slate-400 block mt-0.5">Enables immediate prior turnover waiver</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* 9. Year Founded */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    9. Year Founded <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={1990}
                    max={currentYear}
                    value={foundedYear}
                    onChange={e => setFoundedYear(Number(e.target.value))}
                    onBlur={() => handleBlur('foundedYear')}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-hidden"
                  />
                  {touched.foundedYear && !isYearValid && (
                    <p className="text-[10px] text-red-600 mt-1">Year must be between 1990 and {currentYear}.</p>
                  )}
                </div>

                {/* 10. Startup Stage */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    10. Startup Stage <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={stage}
                    onChange={e => setStage(e.target.value as StartupStage)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-hidden bg-white text-slate-700"
                  >
                    <option value="Idea">Idea Stage</option>
                    <option value="Prototype">Prototype Stage</option>
                    <option value="Early Revenue">Early Revenue</option>
                    <option value="Growth">Growth & Scaling</option>
                  </select>
                </div>

                {/* 21. Team Size */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    21. Team Size <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={teamSize}
                    onChange={e => setTeamSize(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-hidden bg-white text-slate-700"
                  >
                    <option value="1-5 Members">1-5 Members</option>
                    <option value="6-10 Members">6-10 Members</option>
                    <option value="11-25 Members">11-25 Members</option>
                    <option value="26-50 Members">26-50 Members</option>
                    <option value="50+ Members">50+ Members</option>
                  </select>
                </div>
              </div>
            </div>

            {/* SECTION 3: SECTOR & LOCATION */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200 text-xs font-bold text-[#0f2b48] uppercase tracking-wide">
                <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[11px] font-black text-[#ea580c]">3</span>
                <span>Sector Specialization & Headquarters</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 11. Primary Sector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    11. Primary Sector <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={primarySector}
                    onChange={e => setPrimarySector(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-hidden bg-white text-slate-700"
                  >
                    {SECTOR_OPTIONS.filter(s => s !== 'All Sectors').map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* 12. Secondary Sectors */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    12. Secondary Sectors (Hold Ctrl/Cmd to select multiple)
                  </label>
                  <select
                    multiple
                    size={2}
                    value={secondarySectors}
                    onChange={e => {
                      const selected = Array.from(e.target.selectedOptions, option => option.value);
                      setSecondarySectors(selected);
                    }}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg outline-hidden bg-white text-slate-700"
                  >
                    {SECTOR_OPTIONS.filter(s => s !== 'All Sectors' && s !== primarySector).map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Selected: {secondarySectors.join(', ') || 'None'}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* 13. Headquarters City */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    13. Headquarters City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={headquartersCity}
                    onChange={e => setHeadquartersCity(e.target.value)}
                    onBlur={() => handleBlur('headquartersCity')}
                    placeholder="e.g. Bengaluru"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-hidden"
                  />
                  {touched.headquartersCity && !headquartersCity.trim() && (
                    <p className="text-[10px] text-red-600 mt-1">City is required.</p>
                  )}
                </div>

                {/* 14. State */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    14. State / UT <span className="text-red-500">*</span>
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

                {/* 15. Website */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    15. Official Website
                  </label>
                  <input
                    type="url"
                    value={website}
                    onChange={e => setWebsite(e.target.value)}
                    placeholder="https://example.in"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 4: CAPABILITY & TRACK RECORD */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200 text-xs font-bold text-[#0f2b48] uppercase tracking-wide">
                <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[11px] font-black text-[#ea580c]">4</span>
                <span>Product Architecture & Field Track Record</span>
              </div>

              {/* 16. Short Company Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  16. Short Company Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={shortDescription}
                  onChange={e => setShortDescription(e.target.value)}
                  onBlur={() => handleBlur('shortDescription')}
                  placeholder="Summary of mission, core technical innovation, and target applications..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-hidden"
                />
                {touched.shortDescription && !shortDescription.trim() && (
                  <p className="text-[10px] text-red-600 mt-0.5">Description is required.</p>
                )}
              </div>

              {/* 17. Key Capabilities */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  17. Key Capabilities (1 per line) <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={keyCapabilities}
                  onChange={e => setKeyCapabilities(e.target.value)}
                  onBlur={() => handleBlur('keyCapabilities')}
                  placeholder="e.g. Sub-ppb Heavy Metal Spectrophotometry&#10;Solar LoRaWAN Telemetry Hub&#10;Zero-Reagent Microfluidics"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-hidden font-mono text-[11px]"
                />
                {touched.keyCapabilities && !keyCapabilities.trim() && (
                  <p className="text-[10px] text-red-600 mt-0.5">Key capabilities are required.</p>
                )}
              </div>

              {/* 18. Existing Product / Solution */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  18. Existing Product / Solution Name & Specs <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={existingProduct}
                  onChange={e => setExistingProduct(e.target.value)}
                  onBlur={() => handleBlur('existingProduct')}
                  placeholder="e.g. JalRakshak-200 Inline Optoelectronic Arsenic Analyzer"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-hidden"
                />
                {touched.existingProduct && !existingProduct.trim() && (
                  <p className="text-[10px] text-red-600 mt-0.5">Existing product name/specs required.</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 19. Previous Deployments */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    19. Previous Deployments / Testbeds
                  </label>
                  <input
                    type="text"
                    value={previousDeployments}
                    onChange={e => setPreviousDeployments(e.target.value)}
                    placeholder="e.g. 12 pilot units deployed across Chengalpattu"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-hidden"
                  />
                </div>

                {/* 20. Government Experience */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    20. Prior Government Experience (if any)
                  </label>
                  <input
                    type="text"
                    value={governmentExperience}
                    onChange={e => setGovernmentExperience(e.target.value)}
                    placeholder="e.g. Pilot trial with Jal Jeevan Mission"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Validation Notice & Submit Button */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                {isFormValid ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    All required fields verified. Ready to register.
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
                    ? 'text-white bg-gradient-to-r from-[#ea580c] to-[#f97316] hover:from-[#c2410c] hover:to-[#ea580c] cursor-pointer'
                    : 'text-slate-400 bg-slate-200 cursor-not-allowed shadow-none'
                }`}
              >
                <span>Complete Registration & Open Dashboard</span>
                <Check className="w-4 h-4" />
              </button>
            </div>

          </form>

        </div>

      </div>
    </div>
  );
};
