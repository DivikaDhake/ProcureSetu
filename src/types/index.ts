export type UserRole = 'startup' | 'govt';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  organizationName: string;
  designation?: string;
  phone: string;
  sector?: string;
  dpiitNumber?: string;
  departmentName?: string;
  ministry?: string;
  state?: string;
  city?: string;
  createdAt: string;
}

export type StartupStage = 'Idea' | 'Prototype' | 'Early Revenue' | 'Growth';

export interface StartupProfile {
  id: string;
  userId: string;
  companyName: string;
  founderName: string;
  registrationNumber?: string;
  dpiitNumber: string;
  foundedYear: number;
  stage: StartupStage;
  primarySector: string;
  secondarySectors: string[];
  sectors: string[];
  headquartersCity: string;
  state: string;
  headquarters: string;
  website: string;
  shortDescription: string;
  bio: string;
  keyCapabilities: string[];
  coreCapabilities: string[];
  existingProduct: string;
  previousDeployments?: string;
  governmentExperience?: string;
  teamSize: string;
  trlLevel: number; // 1 - 9
  mrlLevel: number; // 1 - 9
  trustIndex: number; // 0 - 100
  verifiedBadges: string[];
  // Structured Capability Passport Fields
  technicalDomains?: string[];
  industryDomains?: string[];
  productsList?: { name: string; description: string; trlLevel?: number; status?: string }[];
  technologiesList?: string[];
  relevantExpertise?: string[];
  manufacturingDeploymentCapability?: string;
  geographicCapability?: string;
  governmentDeploymentsList?: { client: string; project: string; year: string; value?: string; verified: boolean }[];
  privateDeploymentsList?: { client: string; project: string; year: string; value?: string; verified: boolean }[];
  domainExperienceSummary?: string;
  customerReferencesList?: { organization: string; contactPerson?: string; verified: boolean; summary: string }[];
}

export interface GovtProfile {
  id: string;
  userId: string;
  departmentName: string;
  authorizedOfficerName: string;
  officialEmail: string;
  mobileNumber: string;
  ministry: string;
  directorateDivision?: string;
  state: string;
  district?: string;
  designation: string;
  departmentCategory: string;
  areasOfResponsibility: string;
  officeAddress: string;
  officialWebsite?: string;
  officerId?: string;
  problemDomains: string[];
}

export interface StartupSignupData {
  companyName: string;
  founderName: string;
  officialEmail: string;
  mobileNumber: string;
  password: string;
  confirmPassword: string;
  registrationNumber?: string;
  dpiitNumber?: string;
  foundedYear: number;
  stage: StartupStage;
  primarySector: string;
  secondarySectors: string[];
  headquartersCity: string;
  state: string;
  website?: string;
  shortDescription: string;
  keyCapabilities: string;
  existingProduct: string;
  previousDeployments?: string;
  governmentExperience?: string;
  teamSize: string;
}

export interface GovtSignupData {
  departmentName: string;
  authorizedOfficerName: string;
  officialEmail: string;
  mobileNumber: string;
  password: string;
  confirmPassword: string;
  ministry: string;
  directorateDivision?: string;
  state: string;
  district?: string;
  designation: string;
  departmentCategory: string;
  areasOfResponsibility: string;
  officeAddress: string;
  officialWebsite?: string;
  officerId?: string;
  problemDomains: string[];
}

export type EvidenceType = 
  | 'Prototype'
  | 'Technical Benchmark'
  | 'Certifications'
  | 'Deployments'
  | 'Customer References'
  | 'Security Documentation'
  | 'Product Demo'
  | 'Certificate'
  | 'Deployment Evidence'
  | 'Security Document';

export type EvidenceCategory = 
  | 'prototype'
  | 'lab_test'
  | 'pilot_certificate'
  | 'patent'
  | 'field_trial'
  | 'third_party_audit'
  | 'quality_cert'
  | 'technical_benchmark'
  | 'product_demo'
  | 'certificate'
  | 'deployment_evidence'
  | 'security_document'
  | 'customer_reference';

export type VerificationStatus = 
  | 'verified'
  | 'pending_verification'
  | 'self_declared'
  | 'expired'
  | 'needs_clarification'
  | 'rejected';

export interface EvidenceItem {
  id: string;
  startupId: string;
  startupName: string;
  title: string;
  category: EvidenceCategory;
  evidenceType?: EvidenceType;
  issuingAuthority: string; // e.g. IIT Madras, CSIR-NEERI, NABL, Indian Patent Office
  evidenceSource?: string; // Source or institutional origin
  issueDate: string;
  uploadedDate?: string;
  docStatus?: string; // e.g. "Active / Valid", "Certified"
  documentRef: string;
  verificationStatus: VerificationStatus;
  verificationNotes?: string;
  verifiedByGovtDept?: string;
  verifiedAt?: string;
  verificationDate?: string;
  verifierRole?: string;
  cryptographicHash: string; // SHA-256 simulation for tamper proofing
  fileUrl?: string;
  summary: string;
  sector: string;
}

export type ProcurementPathway = 
  | 'GeM Custom Bid (Startup Clause)'
  | 'GFR Rule 194 Fast-Track Challenge'
  | 'Special Innovation Pilot Stage'
  | 'Defence/iDEX Dual-Use Framework'
  | 'State e-Procurement Pilot Window';

export type OpportunityStatus = 'open' | 'evaluating' | 'procurement_ready' | 'closed';

export interface Opportunity {
  id: string;
  title: string;
  departmentName: string;
  ministry: string;
  sector: string;
  state?: string;
  location?: string;
  deadline: string;
  budgetEstimate: string; // e.g., "₹45 Lakhs - ₹1.2 Crores"
  trlRequired: number; // minimum TRL (e.g. 5 or 6)
  problemStatement: string;
  desiredOutcome: string;
  technicalRequirements: string[];
  requiredCapabilities?: string[];
  eligibilityIndicators?: string[];
  matchPercentage?: number;
  matchReason?: string;
  technologies?: string[];
  pilotDuration: string;
  targetProcurementPathway: ProcurementPathway;
  status: OpportunityStatus;
  createdByGovtId: string;
  createdAt: string;
  applicantCount: number;
  priorityLevel: 'High' | 'Strategic' | 'Mission Mode';
  // Step 1 - Problem
  currentProcess?: string;
  painPoints?: string;
  targetBeneficiaries?: string;
  // Step 2 - Desired Outcome
  successMetrics?: string;
  geographicScope?: string;
  targetPopulation?: string;
  expectedTimeline?: string;
  // Step 4 - Requirements
  budgetRange?: string;
  expectedTeamCapability?: string;
  infrastructureAvailable?: string;
  dataAvailability?: string;
  securityRequirements?: string;
  complianceRequirements?: string;
  // Step 5 - Evaluation Criteria weights
  evaluationWeights?: {
    technicalCapability: number;
    problemSolutionFit: number;
    innovation: number;
    scalability: number;
    security: number;
    executionCapability: number;
  };
}

export type ApplicationStatus = 
  | 'applied'
  | 'submitted'
  | 'under_review'
  | 'needs_clarification'
  | 'evidence_verification'
  | 'evidence_verified'
  | 'technical_evaluation'
  | 'shortlisted'
  | 'procurement_ready'
  | 'contract_awarded'
  | 'closed'
  | 'rejected';

export interface EvaluationCriteriaScores {
  // 6 canonical criteria
  technicalCapability?: number;
  problemSolutionFit?: number;
  innovation?: number;
  scalability?: number;
  security?: number;
  executionCapability?: number;
  comments?: {
    technicalCapability?: string;
    problemSolutionFit?: string;
    innovation?: string;
    scalability?: string;
    security?: string;
    executionCapability?: string;
  };
  // Previous criteria for backward compatibility
  problemAlignment?: number;
  evidenceRigor?: number;
  technicalFeasibility?: number;
  scalingCapacity?: number;
  totalScore: number;
}

export interface Application {
  id: string;
  opportunityId: string;
  opportunityTitle: string;
  departmentName: string;
  startupId: string;
  startupName: string;
  sector: string;
  trlProposed: number;
  solutionSummary: string;
  capabilityHighlights: string[];
  attachedEvidenceIds: string[];
  submittedAt: string;
  status: ApplicationStatus;
  evaluationScores?: EvaluationCriteriaScores;
  evaluatorNotes?: string;
  evaluatedAt?: string;
  evaluatedBy?: string;
  readinessChecklist: {
    technicalFit: boolean;
    evidenceVerified: boolean;
    dpiitExemptionEligible: boolean; // Exempt from prior turnover/experience per GFR rules
    procurementDossierApproved: boolean;
  };
  // Step 1 - Startup Profile Snapshot
  confirmedProfileSnapshot?: {
    companyName: string;
    founderName: string;
    officialEmail: string;
    mobileNumber: string;
    dpiitNumber?: string;
    stage: string;
    primarySector: string;
    headquartersCity: string;
    state: string;
    teamSize: string;
    trustIndex?: number;
    dpiitVerified?: boolean;
  };
  // Step 2 - Solution Overview
  solutionName?: string;
  problemUnderstanding?: string;
  proposedApproach?: string;
  expectedImpact?: string;
  deploymentRequirements?: string;
  // Step 4 - Execution
  executionTeam?: string;
  executionTimeline?: string;
  executionInfrastructure?: string;
  executionDependencies?: string;
  // Step 5 - Commercial
  estimatedCost?: string;
  pricingModel?: string;
  milestoneProposals?: {
    id?: string;
    title: string;
    description: string;
    amount: string;
    dueDate: string;
  }[];
  // Evaluation Audit & Actions
  auditLog?: {
    id: string;
    action: string;
    performedBy: string;
    role: string;
    timestamp: string;
    notes?: string;
  }[];
  clarificationRequest?: string;
  rejectionReason?: string;
}

export type MilestoneStatus = 
  | 'pending'
  | 'in_progress'
  | 'submitted_for_approval'
  | 'revision_requested'
  | 'approved'
  | 'completed'
  | 'verified_and_approved'
  | 'payment_disbursed';

export interface Milestone {
  id: string;
  applicationId: string;
  opportunityId: string;
  opportunityTitle: string;
  startupId: string;
  startupName: string;
  departmentName: string;
  title: string;
  description: string;
  amount: string; // e.g. "₹4,00,000"
  dueDate: string;
  targetDate?: string;
  deliverable?: string;
  acceptanceCriteria?: string;
  status: MilestoneStatus;
  paymentStatus?: 'pending' | 'escrow_locked' | 'approved' | 'disbursed';
  proofDeliverables: string[];
  submissionNotes?: string;
  approvalNotes?: string;
  revisionNotes?: string;
  approvedAt?: string;
  completedAt?: string;
  disbursedAt?: string;
  activityLog?: {
    id: string;
    action: string;
    performedBy: string;
    timestamp: string;
    notes?: string;
  }[];
}

export interface NotificationItem {
  id: string;
  recipientUserId: string;
  recipientRole: UserRole;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  linkTab: string;
  linkId?: string;
  type: 'info' | 'success' | 'warning' | 'error';
}
