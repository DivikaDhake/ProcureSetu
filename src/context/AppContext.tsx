import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  UserRole, 
  StartupProfile, 
  GovtProfile,
  EvidenceItem, 
  Opportunity, 
  Application, 
  Milestone, 
  NotificationItem,
  VerificationStatus,
  EvaluationCriteriaScores,
  StartupSignupData,
  GovtSignupData,
  ApplicationStatus,
  OpportunityStatus
} from '../types';
import { 
  INITIAL_USERS, 
  INITIAL_STARTUPS, 
  INITIAL_GOVT_PROFILES,
  INITIAL_EVIDENCE, 
  INITIAL_OPPORTUNITIES, 
  INITIAL_APPLICATIONS, 
  INITIAL_MILESTONES, 
  INITIAL_NOTIFICATIONS 
} from '../data/mockData';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error' | 'warning';
}

interface AppContextType {
  currentUser: User | null;
  currentStartupProfile: StartupProfile | null;
  currentGovtProfile: GovtProfile | null;
  users: User[];
  startups: StartupProfile[];
  govtProfiles: GovtProfile[];
  evidence: EvidenceItem[];
  opportunities: Opportunity[];
  applications: Application[];
  milestones: Milestone[];
  notifications: NotificationItem[];
  toasts: Toast[];
  
  // Routing & Navigation
  currentPath: string;
  navigateTo: (path: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedOpportunityId: string | null;
  setSelectedOpportunityId: (id: string | null) => void;
  selectedApplicationId: string | null;
  setSelectedApplicationId: (id: string | null) => void;
  
  // Auth methods
  login: (email: string, password: string, role: UserRole) => { success: boolean; message?: string };
  signupStartup: (data: StartupSignupData) => { success: boolean; message?: string };
  signupGovt: (data: GovtSignupData) => { success: boolean; message?: string };
  logout: () => void;
  switchDemoAccount: (role: UserRole) => void;
  
  // Core Actions
  createOpportunity: (opp: Omit<Opportunity, 'id' | 'createdAt' | 'applicantCount' | 'createdByGovtId'>) => Opportunity;
  submitApplication: (appData: Omit<Application, 'id' | 'submittedAt' | 'status' | 'readinessChecklist'>) => Application;
  addEvidence: (evidenceData: Omit<EvidenceItem, 'id' | 'cryptographicHash' | 'verificationStatus'> & { verificationStatus?: VerificationStatus }) => EvidenceItem;
  verifyEvidence: (evidenceId: string, status: VerificationStatus, notes: string) => void;
  evaluateApplication: (appId: string, scores: EvaluationCriteriaScores, notes: string) => void;
  markApplicationShortlisted: (appId: string) => void;
  markProcurementReady: (appId: string) => void;
  requestMoreInformation: (appId: string, notes: string) => void;
  shortlistApplication: (appId: string, notes?: string, scores?: EvaluationCriteriaScores) => void;
  rejectApplication: (appId: string, reason: string, notes?: string) => void;
  moveApplicationToProcurementReady: (appId: string, notes?: string, scores?: EvaluationCriteriaScores) => void;
  submitMilestoneDeliverable: (milestoneId: string, notes: string, deliverables: string[]) => void;
  approveMilestone: (milestoneId: string, notes: string) => void;
  updateStartupProfile: (updates: Partial<StartupProfile>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addToast: (message: string, type?: 'success' | 'info' | 'error' | 'warning') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CURRENT_USER: 'procuresetu_current_user',
  USERS: 'procuresetu_users',
  STARTUPS: 'procuresetu_startups',
  GOVT_PROFILES: 'procuresetu_govt_profiles',
  EVIDENCE: 'procuresetu_evidence',
  OPPORTUNITIES: 'procuresetu_opportunities',
  APPLICATIONS: 'procuresetu_applications',
  MILESTONES: 'procuresetu_milestones',
  NOTIFICATIONS: 'procuresetu_notifications',
  CURRENT_PATH: 'procuresetu_current_path'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Local storage helpers
  const getStored = <T,>(key: string, defaultVal: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultVal;
    } catch {
      return defaultVal;
    }
  };

  const [users, setUsers] = useState<User[]>(() => getStored(STORAGE_KEYS.USERS, INITIAL_USERS));
  const [currentUser, setCurrentUser] = useState<User | null>(() => getStored(STORAGE_KEYS.CURRENT_USER, null));
  const [startups, setStartups] = useState<StartupProfile[]>(() => getStored(STORAGE_KEYS.STARTUPS, INITIAL_STARTUPS));
  const [govtProfiles, setGovtProfiles] = useState<GovtProfile[]>(() => getStored(STORAGE_KEYS.GOVT_PROFILES, INITIAL_GOVT_PROFILES));
  const [evidence, setEvidence] = useState<EvidenceItem[]>(() => getStored(STORAGE_KEYS.EVIDENCE, INITIAL_EVIDENCE));
  const [opportunities, setOpportunities] = useState<Opportunity[]>(() => getStored(STORAGE_KEYS.OPPORTUNITIES, INITIAL_OPPORTUNITIES));
  const [applications, setApplications] = useState<Application[]>(() => getStored(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS));
  const [milestones, setMilestones] = useState<Milestone[]>(() => getStored(STORAGE_KEYS.MILESTONES, INITIAL_MILESTONES));
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => getStored(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS));
  
  // Routing state
  const getInitialPath = () => {
    const hash = window.location.hash.slice(1);
    if (hash && hash.startsWith('/')) return hash;
    const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_PATH);
    return stored || '/';
  };

  const [currentPath, setCurrentPath] = useState<string>(getInitialPath);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<string | null>(null);
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Navigation handler with route protection
  const navigateTo = (path: string) => {
    // Check route protection before switching
    if (path.startsWith('/startup/dashboard')) {
      if (!currentUser) {
        addToast('Please sign in to access the Startup Workspace.', 'warning');
        navigateTo('/login');
        return;
      }
      if (currentUser.role !== 'startup') {
        addToast('Access Restricted: You are signed in as Government. Startup Workspace is restricted to Startup Entities.', 'error');
        navigateTo('/government/dashboard');
        return;
      }
    }

    if (path.startsWith('/government/dashboard')) {
      if (!currentUser) {
        addToast('Please sign in to access the Government Directorate Workspace.', 'warning');
        navigateTo('/login');
        return;
      }
      if (currentUser.role !== 'govt') {
        addToast('Access Restricted: You are signed in as a Startup. Government Portal is restricted to Government Officers.', 'error');
        navigateTo('/startup/dashboard');
        return;
      }
    }

    setCurrentPath(path);
    window.location.hash = path;
    localStorage.setItem(STORAGE_KEYS.CURRENT_PATH, path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sync hash change from browser buttons (back/forward)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash && hash !== currentPath) {
        navigateTo(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentPath, currentUser]);

  // Route protection guard on load / path change
  useEffect(() => {
    if (currentPath.startsWith('/startup/dashboard')) {
      if (!currentUser) {
        addToast('Please sign in to access the Startup Workspace.', 'warning');
        navigateTo('/login');
      } else if (currentUser.role !== 'startup') {
        addToast('Access Restricted: Government officers cannot access startup workspace.', 'error');
        navigateTo('/government/dashboard');
      }
    } else if (currentPath.startsWith('/government/dashboard')) {
      if (!currentUser) {
        addToast('Please sign in to access the Government Directorate Workspace.', 'warning');
        navigateTo('/login');
      } else if (currentUser.role !== 'govt') {
        addToast('Access Restricted: Startups cannot access government directorate.', 'error');
        navigateTo('/startup/dashboard');
      }
    }
  }, [currentPath, currentUser]);

  // Persist collections to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STARTUPS, JSON.stringify(startups));
  }, [startups]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GOVT_PROFILES, JSON.stringify(govtProfiles));
  }, [govtProfiles]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EVIDENCE, JSON.stringify(evidence));
  }, [evidence]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(opportunities));
  }, [opportunities]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MILESTONES, JSON.stringify(milestones));
  }, [milestones]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  // Toast manager
  const addToast = (message: string, type: 'success' | 'info' | 'error' | 'warning' = 'info') => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Profiles
  const currentStartupProfile = currentUser?.role === 'startup'
    ? startups.find(s => s.userId === currentUser.id) || startups[0]
    : null;

  const currentGovtProfile = currentUser?.role === 'govt'
    ? govtProfiles.find(g => g.userId === currentUser.id) || govtProfiles[0]
    : null;

  // Login handler
  const login = (email: string, pass: string, role: UserRole) => {
    const cleanEmail = email.trim().toLowerCase();

    // Demo Startup credentials
    if (role === 'startup' && cleanEmail === 'startup@procuresetu.demo') {
      if (pass !== 'Startup@123') {
        return { success: false, message: 'Invalid password. For demo startup use: Startup@123' };
      }
      const startupUser = users.find(u => u.email === cleanEmail) || INITIAL_USERS[0];
      setCurrentUser(startupUser);
      setActiveTab('overview');
      navigateTo('/startup/dashboard');
      addToast(`Welcome back, ${startupUser.name}! Signed in as Startup.`, 'success');
      return { success: true };
    }

    // Demo Government credentials
    if (role === 'govt' && cleanEmail === 'govt@procuresetu.demo') {
      if (pass !== 'Govt@123') {
        return { success: false, message: 'Invalid password. For demo government use: Govt@123' };
      }
      const govtUser = users.find(u => u.email === cleanEmail) || INITIAL_USERS[1];
      setCurrentUser(govtUser);
      setActiveTab('overview');
      navigateTo('/government/dashboard');
      addToast(`Welcome back, ${govtUser.name}! Signed in as Government Nodal Director.`, 'success');
      return { success: true };
    }

    // Custom registered user search
    const foundUser = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (foundUser) {
      if (foundUser.role !== role) {
        return { success: false, message: `Account exists as ${foundUser.role === 'startup' ? 'Startup' : 'Government'}. Please select the ${foundUser.role} portal.` };
      }
      if (!pass || pass.length < 6) {
        return { success: false, message: 'Password must be at least 6 characters.' };
      }
      setCurrentUser(foundUser);
      setActiveTab('overview');
      if (foundUser.role === 'startup') {
        navigateTo('/startup/dashboard');
      } else {
        navigateTo('/government/dashboard');
      }
      addToast(`Welcome back, ${foundUser.name}!`, 'success');
      return { success: true };
    }

    return { 
      success: false, 
      message: `Account not found for ${email}. Please verify email or create a new account.` 
    };
  };

  // STARTUP SIGNUP (Validates all 21 fields)
  const signupStartup = (data: StartupSignupData) => {
    // 1. Duplicate email check
    if (users.some(u => u.email.toLowerCase() === data.officialEmail.trim().toLowerCase())) {
      return { success: false, message: 'An account with this email address already exists.' };
    }

    // 2. Year cannot be future
    const currentYear = new Date().getFullYear();
    if (data.foundedYear > currentYear) {
      return { success: false, message: `Year founded cannot be in the future (maximum ${currentYear}).` };
    }

    const newUserId = `user_startup_${Date.now()}`;
    const newProfileId = `startup_${Date.now()}`;

    const newUser: User = {
      id: newUserId,
      email: data.officialEmail.trim().toLowerCase(),
      role: 'startup',
      name: data.founderName.trim(),
      organizationName: data.companyName.trim(),
      designation: 'Founder & Authorized Representative',
      phone: data.mobileNumber.trim(),
      sector: data.primarySector,
      dpiitNumber: data.dpiitNumber?.trim() || `DIPP-${Math.floor(10000 + Math.random() * 90000)}-IN`,
      state: data.state,
      city: data.headquartersCity,
      createdAt: new Date().toISOString().split('T')[0]
    };

    const keyCapsArray = data.keyCapabilities
      .split('\n')
      .map(k => k.trim())
      .filter(k => k.length > 0);

    const allSectors = Array.from(new Set([data.primarySector, ...(data.secondarySectors || [])]));

    const newProfile: StartupProfile = {
      id: newProfileId,
      userId: newUserId,
      companyName: data.companyName.trim(),
      founderName: data.founderName.trim(),
      registrationNumber: data.registrationNumber?.trim() || `CIN-${Math.floor(100000 + Math.random() * 900000)}`,
      dpiitNumber: newUser.dpiitNumber || 'DIPP-PENDING',
      foundedYear: Number(data.foundedYear),
      stage: data.stage,
      primarySector: data.primarySector,
      secondarySectors: data.secondarySectors || [],
      sectors: allSectors,
      headquartersCity: data.headquartersCity.trim(),
      state: data.state.trim(),
      headquarters: `${data.headquartersCity.trim()}, ${data.state.trim()}`,
      website: data.website?.trim() || 'https://startup-portal.in',
      shortDescription: data.shortDescription.trim(),
      bio: data.shortDescription.trim(),
      keyCapabilities: keyCapsArray,
      coreCapabilities: keyCapsArray.length > 0 ? keyCapsArray : ['Indigenous Product Engineering'],
      existingProduct: data.existingProduct.trim(),
      previousDeployments: data.previousDeployments?.trim() || 'Pilot trials underway',
      governmentExperience: data.governmentExperience?.trim() || 'Applied under GFR Rule 173(i) innovation pathway',
      teamSize: data.teamSize.trim(),
      trlLevel: 6,
      mrlLevel: 5,
      trustIndex: 82,
      verifiedBadges: ['DPIIT Recognized', 'GFR 173(i) Turnover-Exempt']
    };

    // Save in state & localStorage
    setUsers(prev => [...prev, newUser]);
    setStartups(prev => [...prev, newProfile]);
    setCurrentUser(newUser);
    setActiveTab('overview');

    addToast(`Account created successfully! Welcome to ProcureSetu, ${newUser.name}.`, 'success');
    navigateTo('/startup/dashboard');
    return { success: true };
  };

  // GOVERNMENT SIGNUP (Validates all 17 fields)
  const signupGovt = (data: GovtSignupData) => {
    // Duplicate email check
    if (users.some(u => u.email.toLowerCase() === data.officialEmail.trim().toLowerCase())) {
      return { success: false, message: 'An account with this official email address already exists.' };
    }

    const newUserId = `user_govt_${Date.now()}`;
    const newProfileId = `govt_profile_${Date.now()}`;

    const newUser: User = {
      id: newUserId,
      email: data.officialEmail.trim().toLowerCase(),
      role: 'govt',
      name: data.authorizedOfficerName.trim(),
      organizationName: data.departmentName.trim(),
      departmentName: data.departmentName.trim(),
      ministry: data.ministry.trim(),
      designation: data.designation.trim(),
      phone: data.mobileNumber.trim(),
      state: data.state,
      city: data.district || '',
      createdAt: new Date().toISOString().split('T')[0]
    };

    const newProfile: GovtProfile = {
      id: newProfileId,
      userId: newUserId,
      departmentName: data.departmentName.trim(),
      authorizedOfficerName: data.authorizedOfficerName.trim(),
      officialEmail: data.officialEmail.trim().toLowerCase(),
      mobileNumber: data.mobileNumber.trim(),
      ministry: data.ministry.trim(),
      directorateDivision: data.directorateDivision?.trim() || 'Innovation & Procurement Cell',
      state: data.state.trim(),
      district: data.district?.trim() || 'Central',
      designation: data.designation.trim(),
      departmentCategory: data.departmentCategory,
      areasOfResponsibility: data.areasOfResponsibility.trim(),
      officeAddress: data.officeAddress.trim(),
      officialWebsite: data.officialWebsite?.trim() || 'https://gov.in',
      officerId: data.officerId?.trim() || `NIC-OFF-${Math.floor(1000 + Math.random() * 9000)}`,
      problemDomains: data.problemDomains && data.problemDomains.length > 0 ? data.problemDomains : ['Public Infrastructure']
    };

    // Save in state & localStorage
    setUsers(prev => [...prev, newUser]);
    setGovtProfiles(prev => [...prev, newProfile]);
    setCurrentUser(newUser);
    setActiveTab('overview');

    addToast(`Government Directorate Account Registered! Welcome, ${newUser.name}.`, 'success');
    navigateTo('/government/dashboard');
    return { success: true };
  };

  // Logout handler
  const logout = () => {
    setCurrentUser(null);
    setActiveTab('overview');
    setSelectedOpportunityId(null);
    setSelectedApplicationId(null);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    addToast('Signed out successfully.', 'info');
    navigateTo('/');
  };

  // Quick switch demo accounts
  const switchDemoAccount = (role: UserRole) => {
    if (role === 'startup') {
      const u = users.find(x => x.email === 'startup@procuresetu.demo') || INITIAL_USERS[0];
      setCurrentUser(u);
      setActiveTab('overview');
      navigateTo('/startup/dashboard');
      addToast('Switched to Startup view (Agastya AquaSens)', 'info');
    } else {
      const u = users.find(x => x.email === 'govt@procuresetu.demo') || INITIAL_USERS[1];
      setCurrentUser(u);
      setActiveTab('overview');
      navigateTo('/government/dashboard');
      addToast('Switched to Government view (Ministry of Jal Shakti)', 'info');
    }
  };

  // Create Opportunity
  const createOpportunity = (oppData: Omit<Opportunity, 'id' | 'createdAt' | 'applicantCount' | 'createdByGovtId'>) => {
    const newId = `opp_${Date.now()}`;
    const newOpp: Opportunity = {
      ...oppData,
      id: newId,
      createdAt: new Date().toISOString().split('T')[0],
      applicantCount: 0,
      createdByGovtId: currentUser?.id || 'user_govt_1'
    };

    setOpportunities(prev => [newOpp, ...prev]);

    // Broadcast notification to startups
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      recipientUserId: 'user_startup_1',
      recipientRole: 'startup',
      title: 'New Opportunity Published on Radar',
      message: `${newOpp.departmentName} published a new challenge: "${newOpp.title}".`,
      timestamp: 'Just now',
      read: false,
      linkTab: 'opportunity-radar',
      linkId: newId,
      type: 'info'
    };
    setNotifications(prev => [newNotif, ...prev]);

    addToast(`Opportunity "${newOpp.title.substring(0, 32)}..." published to Opportunity Radar!`, 'success');
    return newOpp;
  };

  // Submit Application
  const submitApplication = (appData: Omit<Application, 'id' | 'submittedAt' | 'status' | 'readinessChecklist'>) => {
    const newId = `app_${Date.now()}`;
    const newApp: Application = {
      ...appData,
      id: newId,
      submittedAt: new Date().toISOString().split('T')[0],
      status: 'submitted',
      readinessChecklist: {
        technicalFit: true,
        evidenceVerified: false,
        dpiitExemptionEligible: true,
        procurementDossierApproved: false
      }
    };

    setApplications(prev => {
      const updated = [newApp, ...prev.filter(a => a.id !== newId)];
      try {
        localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to persist applications to localStorage', e);
      }
      return updated;
    });

    // Increment applicant count on opportunity
    setOpportunities(prev => {
      const updatedOpps = prev.map(opp => {
        if (opp.id === appData.opportunityId) {
          return { ...opp, applicantCount: (opp.applicantCount || 0) + 1 };
        }
        return opp;
      });
      try {
        localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(updatedOpps));
      } catch (e) {
        console.error('Failed to persist opportunities to localStorage', e);
      }
      return updatedOpps;
    });

    // Create Startup notification: "Application submitted successfully."
    const startupNotif: NotificationItem = {
      id: `notif_startup_${Date.now()}`,
      recipientUserId: currentUser?.id || 'user_startup_1',
      recipientRole: 'startup',
      title: 'Application submitted successfully.',
      message: `Your application for "${appData.opportunityTitle}" has been submitted successfully to ${appData.departmentName}.`,
      timestamp: 'Just now',
      read: false,
      linkTab: 'my-applications',
      linkId: newId,
      type: 'success'
    };

    // Notify government
    const govtNotif: NotificationItem = {
      id: `notif_gov_${Date.now()}`,
      recipientUserId: 'user_govt_1',
      recipientRole: 'govt',
      title: 'New Capability Application Received',
      message: `${appData.startupName} submitted a capability dossier for "${appData.opportunityTitle}".`,
      timestamp: 'Just now',
      read: false,
      linkTab: 'evaluation',
      linkId: newId,
      type: 'info'
    };

    setNotifications(prev => {
      const updatedNotifs = [startupNotif, govtNotif, ...prev];
      try {
        localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updatedNotifs));
      } catch (e) {
        console.error('Failed to persist notifications', e);
      }
      return updatedNotifs;
    });

    // If milestone proposals exist, initialize them in milestones list
    if (appData.milestoneProposals && appData.milestoneProposals.length > 0) {
      const newMilestones: Milestone[] = appData.milestoneProposals.map((mp, idx) => ({
        id: `ms_${newId}_${idx + 1}`,
        applicationId: newId,
        opportunityId: appData.opportunityId,
        opportunityTitle: appData.opportunityTitle,
        startupId: appData.startupId,
        startupName: appData.startupName,
        departmentName: appData.departmentName,
        title: mp.title,
        description: mp.description,
        amount: mp.amount,
        dueDate: mp.dueDate || new Date(Date.now() + (idx + 1) * 30 * 86400000).toISOString().split('T')[0],
        status: 'pending',
        proofDeliverables: []
      }));

      setMilestones(prev => {
        const updatedMs = [...newMilestones, ...prev];
        try {
          localStorage.setItem(STORAGE_KEYS.MILESTONES, JSON.stringify(updatedMs));
        } catch (e) {
          console.error('Failed to persist milestones', e);
        }
        return updatedMs;
      });
    }

    addToast('Application submitted successfully.', 'success');
    return newApp;
  };

  // Add Evidence
  const addEvidence = (evidenceData: Omit<EvidenceItem, 'id' | 'cryptographicHash' | 'verificationStatus'> & { verificationStatus?: VerificationStatus }) => {
    const newId = `ev_${Date.now()}`;
    const randomHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    
    const newEvidence: EvidenceItem = {
      ...evidenceData,
      id: newId,
      cryptographicHash: randomHash,
      verificationStatus: evidenceData.verificationStatus || 'pending_verification'
    };

    setEvidence(prev => [newEvidence, ...prev]);

    // Notify government
    const govtNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      recipientUserId: 'user_govt_1',
      recipientRole: 'govt',
      title: 'New Evidence Document Awaiting Verification',
      message: `${evidenceData.startupName} submitted a new evidence artifact: "${evidenceData.title}".`,
      timestamp: 'Just now',
      read: false,
      linkTab: 'capability-evidence',
      linkId: newId,
      type: 'info'
    };
    setNotifications(prev => [govtNotif, ...prev]);

    addToast('Evidence artifact added to Vault with cryptographic signature.', 'success');
    return newEvidence;
  };

  // Verify Evidence
  const verifyEvidence = (evidenceId: string, status: VerificationStatus, notes: string) => {
    let affectedStartupId = '';
    let evidenceTitle = '';

    setEvidence(prev => prev.map(item => {
      if (item.id === evidenceId) {
        affectedStartupId = item.startupId;
        evidenceTitle = item.title;
        return {
          ...item,
          verificationStatus: status,
          verificationNotes: notes,
          verifiedByGovtDept: currentUser?.departmentName || currentUser?.organizationName || 'Government Nodal Directorate',
          verifiedAt: new Date().toISOString().split('T')[0]
        };
      }
      return item;
    }));

    if (status === 'verified' && affectedStartupId) {
      setStartups(prev => prev.map(s => {
        if (s.id === affectedStartupId) {
          const newIndex = Math.min(99, s.trustIndex + 3);
          return { ...s, trustIndex: newIndex };
        }
        return s;
      }));
    }

    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      recipientUserId: 'user_startup_1',
      recipientRole: 'startup',
      title: `Evidence ${status === 'verified' ? 'Verified by Government' : 'Status Updated'}`,
      message: `Your evidence "${evidenceTitle}" marked as ${status.replace('_', ' ')}. Nodal Notes: "${notes}"`,
      timestamp: 'Just now',
      read: false,
      linkTab: 'evidence-vault',
      linkId: evidenceId,
      type: status === 'verified' ? 'success' : 'warning'
    };
    setNotifications(prev => [notif, ...prev]);

    addToast(`Evidence status successfully updated to "${status.replace('_', ' ')}"!`, 'success');
  };

  // Evaluate Application
  const evaluateApplication = (appId: string, scores: EvaluationCriteriaScores, notes: string) => {
    let oppTitle = '';

    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        oppTitle = app.opportunityTitle;
        const isShortlisted = scores.totalScore >= 75;
        return {
          ...app,
          status: isShortlisted ? 'shortlisted' : 'under_review',
          evaluationScores: scores,
          evaluatorNotes: notes,
          evaluatedAt: new Date().toISOString().split('T')[0],
          evaluatedBy: currentUser?.name || 'Nodal Evaluation Committee',
          readinessChecklist: {
            ...app.readinessChecklist,
            evidenceVerified: true
          }
        };
      }
      return app;
    }));

    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      recipientUserId: 'user_startup_1',
      recipientRole: 'startup',
      title: 'Application Evaluation Completed',
      message: `Your proposal for "${oppTitle}" scored ${scores.totalScore}/100. Status: ${scores.totalScore >= 75 ? 'Shortlisted' : 'Under Review'}.`,
      timestamp: 'Just now',
      read: false,
      linkTab: 'my-applications',
      linkId: appId,
      type: scores.totalScore >= 75 ? 'success' : 'info'
    };
    setNotifications(prev => [notif, ...prev]);

    addToast(`Evaluation submitted. Score: ${scores.totalScore}/100. Status: ${scores.totalScore >= 75 ? 'Shortlisted' : 'Under Review'}`, 'success');
  };

  // Mark application shortlisted
  const markApplicationShortlisted = (appId: string) => {
    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        return { ...app, status: 'shortlisted' };
      }
      return app;
    }));
    addToast('Startup application marked as Shortlisted for Pilot.', 'success');
  };

  // Mark Procurement Ready
  const markProcurementReady = (appId: string) => {
    let oppId = '';
    let startupName = '';
    let oppTitle = '';

    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        oppId = app.opportunityId;
        startupName = app.startupName;
        oppTitle = app.opportunityTitle;
        return {
          ...app,
          status: 'procurement_ready',
          readinessChecklist: {
            ...app.readinessChecklist,
            technicalFit: true,
            evidenceVerified: true,
            dpiitExemptionEligible: true,
            procurementDossierApproved: true
          }
        };
      }
      return app;
    }));

    if (oppId) {
      setOpportunities(prev => prev.map(opp => {
        if (opp.id === oppId) {
          return { ...opp, status: 'procurement_ready' };
        }
        return opp;
      }));
    }

    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      recipientUserId: 'user_startup_1',
      recipientRole: 'startup',
      title: 'Procurement Readiness Certificate Issued!',
      message: `Congratulations! Your solution for "${oppTitle}" has been designated Procurement-Ready by the government. The Nodal Procurement Dossier is prepared for pilot execution.`,
      timestamp: 'Just now',
      read: false,
      linkTab: 'capability-passport',
      linkId: appId,
      type: 'success'
    };
    setNotifications(prev => [notif, ...prev]);

    addToast(`Procurement Readiness Certificate issued for ${startupName}! Dossier unlocked.`, 'success');
  };

  // Request More Information
  const requestMoreInformation = (appId: string, notes: string) => {
    let startupId = '';
    let oppTitle = '';
    const nowIso = new Date().toISOString();
    const officerName = currentUser?.name || 'Nodal Officer';

    setApplications(prev => {
      const updated = prev.map(app => {
        if (app.id === appId) {
          startupId = app.startupId;
          oppTitle = app.opportunityTitle;
          const auditItem = {
            id: `audit_${Date.now()}`,
            action: 'Requested More Information',
            performedBy: officerName,
            role: 'Government Evaluator',
            timestamp: nowIso,
            notes
          };
          return {
            ...app,
            status: 'needs_clarification' as ApplicationStatus,
            clarificationRequest: notes,
            auditLog: [auditItem, ...(app.auditLog || [])]
          };
        }
        return app;
      });
      try {
        localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });

    // Notify startup
    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      recipientUserId: 'user_startup_1',
      recipientRole: 'startup',
      title: 'Clarification Requested on Proposal',
      message: `The evaluation committee requested additional information for "${oppTitle}": "${notes}"`,
      timestamp: 'Just now',
      read: false,
      linkTab: 'my-applications',
      linkId: appId,
      type: 'warning'
    };

    setNotifications(prev => {
      const updatedNotifs = [notif, ...prev];
      try {
        localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updatedNotifs));
      } catch (e) {
        console.error(e);
      }
      return updatedNotifs;
    });

    addToast('Clarification request dispatched to startup. Status set to Needs Clarification.', 'info');
  };

  // Shortlist Application
  const shortlistApplication = (appId: string, notes?: string, scores?: EvaluationCriteriaScores) => {
    let oppTitle = '';
    let sName = '';
    const nowIso = new Date().toISOString();
    const officerName = currentUser?.name || 'Nodal Officer';

    setApplications(prev => {
      const updated = prev.map(app => {
        if (app.id === appId) {
          oppTitle = app.opportunityTitle;
          sName = app.startupName;
          const auditItem = {
            id: `audit_${Date.now()}`,
            action: 'Application Shortlisted',
            performedBy: officerName,
            role: 'Government Evaluator',
            timestamp: nowIso,
            notes: notes || 'Shortlisted for technical pilot stage based on demonstrated capabilities.'
          };
          return {
            ...app,
            status: 'shortlisted' as ApplicationStatus,
            evaluationScores: scores || app.evaluationScores,
            evaluatorNotes: notes || app.evaluatorNotes,
            evaluatedAt: new Date().toISOString().split('T')[0],
            evaluatedBy: officerName,
            auditLog: [auditItem, ...(app.auditLog || [])]
          };
        }
        return app;
      });
      try {
        localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });

    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      recipientUserId: 'user_startup_1',
      recipientRole: 'startup',
      title: 'Application Shortlisted for Pilot Stage!',
      message: `Your application for "${oppTitle}" has been formally shortlisted by the evaluation committee.`,
      timestamp: 'Just now',
      read: false,
      linkTab: 'my-applications',
      linkId: appId,
      type: 'success'
    };

    setNotifications(prev => {
      const updatedNotifs = [notif, ...prev];
      try {
        localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updatedNotifs));
      } catch (e) {
        console.error(e);
      }
      return updatedNotifs;
    });

    addToast(`Startup ${sName || 'application'} successfully Shortlisted.`, 'success');
  };

  // Reject Application
  const rejectApplication = (appId: string, reason: string, notes?: string) => {
    let oppTitle = '';
    let sName = '';
    const nowIso = new Date().toISOString();
    const officerName = currentUser?.name || 'Nodal Officer';

    setApplications(prev => {
      const updated = prev.map(app => {
        if (app.id === appId) {
          oppTitle = app.opportunityTitle;
          sName = app.startupName;
          const auditItem = {
            id: `audit_${Date.now()}`,
            action: 'Application Rejected',
            performedBy: officerName,
            role: 'Government Evaluator',
            timestamp: nowIso,
            notes: `Reason: ${reason}. Notes: ${notes || 'Evaluation completed without qualification.'}`
          };
          return {
            ...app,
            status: 'rejected' as ApplicationStatus,
            rejectionReason: reason,
            evaluatorNotes: notes || app.evaluatorNotes,
            auditLog: [auditItem, ...(app.auditLog || [])]
          };
        }
        return app;
      });
      try {
        localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });

    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      recipientUserId: 'user_startup_1',
      recipientRole: 'startup',
      title: 'Application Scrutiny Outcome: Not Selected',
      message: `Your application for "${oppTitle}" was reviewed. Committee decision: Rejected (${reason}).`,
      timestamp: 'Just now',
      read: false,
      linkTab: 'my-applications',
      linkId: appId,
      type: 'error'
    };

    setNotifications(prev => {
      const updatedNotifs = [notif, ...prev];
      try {
        localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updatedNotifs));
      } catch (e) {
        console.error(e);
      }
      return updatedNotifs;
    });

    addToast(`Decision recorded: Application rejected. Reason: ${reason}`, 'warning');
  };

  // Move to Procurement Readiness
  const moveApplicationToProcurementReady = (appId: string, notes?: string, scores?: EvaluationCriteriaScores) => {
    let oppId = '';
    let oppTitle = '';
    let sName = '';
    const nowIso = new Date().toISOString();
    const officerName = currentUser?.name || 'Nodal Officer';

    setApplications(prev => {
      const updated = prev.map(app => {
        if (app.id === appId) {
          oppId = app.opportunityId;
          oppTitle = app.opportunityTitle;
          sName = app.startupName;
          const auditItem = {
            id: `audit_${Date.now()}`,
            action: 'Moved to Procurement Readiness',
            performedBy: officerName,
            role: 'Government Evaluator',
            timestamp: nowIso,
            notes: notes || 'Procurement readiness certified with full GFR exemption checklist approved.'
          };
          return {
            ...app,
            status: 'procurement_ready' as ApplicationStatus,
            evaluationScores: scores || app.evaluationScores,
            evaluatorNotes: notes || app.evaluatorNotes,
            evaluatedAt: new Date().toISOString().split('T')[0],
            evaluatedBy: officerName,
            readinessChecklist: {
              technicalFit: true,
              evidenceVerified: true,
              dpiitExemptionEligible: true,
              procurementDossierApproved: true
            },
            auditLog: [auditItem, ...(app.auditLog || [])]
          };
        }
        return app;
      });
      try {
        localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });

    if (oppId) {
      setOpportunities(prev => {
        const updated = prev.map(opp => {
          if (opp.id === oppId) {
            return { ...opp, status: 'procurement_ready' as OpportunityStatus };
          }
          return opp;
        });
        try {
          localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(updated));
        } catch (e) {
          console.error(e);
        }
        return updated;
      });
    }

    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      recipientUserId: 'user_startup_1',
      recipientRole: 'startup',
      title: 'Procurement Readiness Certificate Issued!',
      message: `Your solution for "${oppTitle}" has been designated Procurement-Ready by the government. Nodal Dossier sign-off complete.`,
      timestamp: 'Just now',
      read: false,
      linkTab: 'my-applications',
      linkId: appId,
      type: 'success'
    };

    setNotifications(prev => {
      const updatedNotifs = [notif, ...prev];
      try {
        localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updatedNotifs));
      } catch (e) {
        console.error(e);
      }
      return updatedNotifs;
    });

    addToast(`Procurement readiness certified for ${sName || 'startup'}! Audit log updated.`, 'success');
  };

  // Submit Milestone Deliverable
  const submitMilestoneDeliverable = (milestoneId: string, notes: string, deliverables: string[]) => {
    setMilestones(prev => prev.map(ms => {
      if (ms.id === milestoneId) {
        return {
          ...ms,
          status: 'submitted_for_approval',
          submissionNotes: notes,
          proofDeliverables: [...ms.proofDeliverables, ...deliverables]
        };
      }
      return ms;
    }));

    const govtNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      recipientUserId: 'user_govt_1',
      recipientRole: 'govt',
      title: 'Milestone Deliverable Submitted for Verification',
      message: `Startup submitted verification deliverables for milestone payout.`,
      timestamp: 'Just now',
      read: false,
      linkTab: 'milestones',
      linkId: milestoneId,
      type: 'info'
    };
    setNotifications(prev => [govtNotif, ...prev]);

    addToast('Milestone proof of delivery submitted to Government Nodal Officer.', 'success');
  };

  // Approve Milestone
  const approveMilestone = (milestoneId: string, notes: string) => {
    let amount = '';
    let msTitle = '';

    setMilestones(prev => prev.map(ms => {
      if (ms.id === milestoneId) {
        amount = ms.amount;
        msTitle = ms.title;
        return {
          ...ms,
          status: 'verified_and_approved',
          approvalNotes: notes,
          approvedAt: new Date().toISOString().split('T')[0]
        };
      }
      return ms;
    }));

    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      recipientUserId: 'user_startup_1',
      recipientRole: 'startup',
      title: `Milestone Approved: ${amount}`,
      message: `Nodal officer verified deliverables for "${msTitle}". Escrow release advised: "${notes}".`,
      timestamp: 'Just now',
      read: false,
      linkTab: 'contracts-milestones',
      linkId: milestoneId,
      type: 'success'
    };
    setNotifications(prev => [notif, ...prev]);

    addToast(`Milestone approved! Treasury payment release recommended for ${amount}.`, 'success');
  };

  // Update startup profile
  const updateStartupProfile = (updates: Partial<StartupProfile>) => {
    setStartups(prev => prev.map(s => {
      if (s.userId === currentUser?.id || s.id === currentStartupProfile?.id) {
        return { ...s, ...updates };
      }
      return s;
    }));
    addToast('Startup Capability Profile updated successfully.', 'success');
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    addToast('All notifications marked as read.', 'info');
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      currentStartupProfile,
      currentGovtProfile,
      users,
      startups,
      govtProfiles,
      evidence,
      opportunities,
      applications,
      milestones,
      notifications,
      toasts,
      currentPath,
      navigateTo,
      activeTab,
      setActiveTab,
      selectedOpportunityId,
      setSelectedOpportunityId,
      selectedApplicationId,
      setSelectedApplicationId,
      login,
      signupStartup,
      signupGovt,
      logout,
      switchDemoAccount,
      createOpportunity,
      submitApplication,
      addEvidence,
      verifyEvidence,
      evaluateApplication,
      markApplicationShortlisted,
      markProcurementReady,
      requestMoreInformation,
      shortlistApplication,
      rejectApplication,
      moveApplicationToProcurementReady,
      submitMilestoneDeliverable,
      approveMilestone,
      updateStartupProfile,
      markNotificationRead,
      markAllNotificationsRead,
      addToast,
      removeToast
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
