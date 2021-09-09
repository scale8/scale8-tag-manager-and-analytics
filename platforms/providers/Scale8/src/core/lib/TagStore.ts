import { RuleStatus } from '../types/Types';
import { TagCode } from '../../../../../common/types/Types';

export type TagEventLoadStore = { [k: string]: any };

export default class TagStore {
    public static nextIndex = 0;
    public static readonly registeredTags: Map<string, TagCode> = new Map();
    public static readonly tagEventsLoadStore: Map<string, TagEventLoadStore> = new Map();
    public static readonly tagRuleGroupExecutions: Map<string, RuleStatus[]> = new Map();
}
