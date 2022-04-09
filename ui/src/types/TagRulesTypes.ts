import {
    ActionGroupDistributionType,
    RevisionEntityParentType,
    TypeIcon,
} from '../gql/generated/globalTypes';
import { DataContainer, PlatformDataMap } from './DataMapsTypes';

export type ConditionRule = {
    __typename: 'ConditionRule';
    id: string;
    name: string;
    platform_data_container: PlatformDataContainer;
};

export interface AppPlatformRevision {
    __typename: 'AppPlatformRevision';
    id: string;
    platform_revision: PlatformRevision;
}

export interface PlatformRevision {
    __typename: 'PlatformRevision';
    id: string;
    platform: Platform;
    platform_data_containers: DataContainer[];
}

export interface Platform {
    __typename: 'Platform';
    id: string;
    name: string;
}

export type RuleGroup = {
    __typename: 'RuleGroup';
    id: string;
    name: string;
    is_active: boolean;
    rules: Rule[];
};

export type Action = {
    __typename: 'Action';
    id: string;
    name: string;
    platform_action: PlatformAction;
};

export type ActionGroup = {
    __typename: 'ActionGroup';
    id: string;
    name: string;
    actions: Action[];
    distribution: number;
    is_locked: boolean;
};

export type ActionGroupDistribution = {
    __typename: 'ActionGroupDistribution';
    id: string;
    name: string;
    parent_type: RevisionEntityParentType;
    action_group_distribution_type: ActionGroupDistributionType;
    action_groups: ActionGroup[];
};

export type Rule = {
    __typename: 'Rule';
    id: string;
    name: string;
    trigger: Trigger;
    min_repeat_interval: number;
    action_groups_distributions: ActionGroupDistribution[];
    is_active: boolean;
};

export type Trigger = {
    __typename: 'Trigger';
    id: string;
    name: string;
    events: RuleEvent[];
    parent_type: string;
    condition_rules: ConditionRule[];
    exception_rules: ConditionRule[];
};

export type RuleEvent = {
    __typename: 'Event';
    id: string;
    name: string;
    event:
        | {
              __typename: 'CustomEvent';
              custom_name: string;
          }
        | PlatformEvent;
};

export type PlatformEvent = {
    __typename: 'PlatformEvent';
    id: string;
    name: string;
    icon?: string;
    description?: string;
    platform: Platform;
    platform_data_maps?: PlatformDataMap[] | any[];
};

export interface CustomBrowserEvent {
    __typename: 'CustomEvent';
    custom_name: string;
}

export type PlatformAction = {
    __typename: 'PlatformAction';
    id: string;
    name: string;
    icon?: string;
    description: string;
    platform: Platform;
    platform_data_maps: PlatformDataMap[];
};

export type PlatformDataContainer = {
    __typename: 'PlatformDataContainer';
    id: string;
    icon: TypeIcon | null;
    name: string;
    platform: Platform;
};

export type Condition = ConditionRule;
export type Exception = ConditionRule;
