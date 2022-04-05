export enum AdvisorProduct {
  ocp = 'ocp',
  rhel = 'rhel',
}

export type TotalRisk = 1 | 2 | 3 | 4;
export type RiskOfChange = 1 | 2 | 3 | 4;
export type Impact = 1 | 2 | 3 | 4;
export type Rating = -1 | 0 | 1;
export type Likelihood = 1 | 2 | 3 | 4;

export interface RuleContent {
  rule_id: string;
  generic: string;
  summary: string;
  total_risk: TotalRisk;
  likelihood: number;
  description: string;
  publish_date: string;
  more_info: string;
  hosts_acked_count: number;
  rating: Rating;
}

export interface RhelResolution {
  system_type: number;
  resolution: string;
  resolution_risk: {
    name: string;
    risk: number;
  };
  has_playbook: boolean;
}

export interface RuleContentRhel extends RuleContent {
  impacted_systems_count: number;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  active: boolean;
  category: {
    id: number;
    name: string;
  };
  impact: {
    impact: Impact;
    name: string;
  };
  playbook_count: number;
  reboot_required: boolean;
  reports_shown: boolean;
  rule_status: string;
  resolution_set: RhelResolution[];
  node_id: string;
  tags: string;
}

export interface RuleContentOcp extends RuleContent {
  reason: string;
  resolution: string;
  risk_of_change: RiskOfChange;
  impacted_clusters_count: number;
  impact: Impact;
  disabled: boolean;
  tags: string[];
}

export interface TopicRhel {
  name: string;
  slug: string;
  tag: string;
  featured: boolean;
  enabled: boolean;
  impacted_systems_count: number;
}
