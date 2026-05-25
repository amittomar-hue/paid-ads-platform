export type Platform = "google" | "linkedin";
export type CampaignStatus = "Active" | "Paused" | "Draft" | "Ended";
export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type ApprovalStatus = "pending" | "approved" | "rejected";

export interface Campaign {
  id: string;
  platform: Platform;
  name: string;
  status: CampaignStatus;
  budget_daily: number;
  budget_total: number;
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  conversions: number;
  cpa: number;
  roas: number;
  quality_score: number;
  start_date: string;
  end_date?: string;
  objective: string;
  type: string;
}

export interface OptimizationAction {
  id: string;
  campaign_id: string;
  campaign_name: string;
  platform: Platform;
  type: string;
  description: string;
  impact: "High" | "Medium" | "Low" | "Critical";
  estimated_improvement: string;
  risk: RiskLevel;
  approval_status: ApprovalStatus;
  created_at: string;
  auto_apply: boolean;
}

export interface AnomalyAlert {
  id: string;
  campaign_id: string;
  campaign_name: string;
  platform: Platform;
  type: "spike" | "drop" | "budget" | "quality";
  metric: string;
  description: string;
  severity: "critical" | "warning" | "info";
  detected_at: string;
  resolved: boolean;
}

export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger: string;
  action: string;
  platform: Platform | "both";
  category: string;
  enabled: boolean;
  last_triggered?: string;
  executions: number;
}

export interface AdVariant {
  id: string;
  label: string;
  headline_1: string;
  headline_2: string;
  headline_3?: string;
  description_1: string;
  description_2?: string;
  cta: string;
  score: number;
  why_it_works: string;
}

export interface BudgetAllocation {
  platform: Platform;
  budget: number;
  percentage: number;
  rationale: string;
  expected_roas: number;
  expected_conversions: number;
}

export interface WorkflowStep {
  label: string;
  description: string;
  done: boolean;
}
