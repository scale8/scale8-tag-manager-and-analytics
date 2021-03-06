import Field from '../../decorators/Field';
import Model from '../../abstractions/Model';
import Org from '../Org';
import { ObjectId } from 'mongodb';
import { add, differenceInCalendarDays, isBefore } from 'date-fns';
import { AccountType } from '../../../enums/AccountType';

export default class DataManagerAccount extends Model {
    private readonly TRIAL_LENGTH = 30;

    public getOrgEntityId(): ObjectId {
        return this.orgId;
    }

    @Field<ObjectId>({
        required: true,
        exposeToGQLAs: 'org_id',
    })
    private readonly _org_id!: ObjectId;

    @Field<AccountType>({
        required: true,
        exposeToGQLAs: 'account_type',
    })
    private readonly _account_type: AccountType;

    @Field<boolean>({
        required: true,
        exposeToGQLAs: 'enabled',
    })
    private _enabled: boolean;

    @Field<Date>({
        required: false,
        exposeToGQLAs: 'trial_started_on',
    })
    private _trial_started_on?: Date;

    @Field<Date>({
        required: false,
        exposeToGQLAs: 'trial_expires_on',
    })
    private _trial_expires_on?: Date;

    @Field<string>({
        required: false,
        exposeToGQLAs: 'stripe_product_id',
    })
    private _stripe_product_id?: string;

    @Field<boolean>({
        required: false,
        exposeToGQLAs: 'ten_day_remaining_prompt',
    })
    private _ten_day_remaining_prompt?: boolean;

    @Field<boolean>({
        required: false,
        exposeToGQLAs: 'three_day_remaining_prompt',
    })
    private _three_day_remaining_prompt?: boolean;

    @Field<boolean>({
        required: false,
        exposeToGQLAs: 'two_day_remaining_prompt',
    })
    private _two_day_remaining_prompt?: boolean;

    @Field<boolean>({
        required: false,
        exposeToGQLAs: 'one_day_remaining_prompt',
    })
    private _one_day_remaining_prompt?: boolean;

    @Field<boolean>({
        required: false,
        exposeToGQLAs: 'zero_day_remaining_prompt',
    })
    private _zero_day_remaining_prompt?: boolean;

    @Field<boolean>({
        required: false,
        exposeToGQLAs: 'negative_day_remaining_prompt',
    })
    private _negative_day_remaining_prompt?: boolean;

    @Field<boolean>({
        required: false,
        exposeToGQLAs: '_negative_final_day_remaining_prompt',
    })
    private _negative_final_day_remaining_prompt?: boolean;

    constructor(org: Org, accountType: AccountType, enabled: boolean, freeTrial = false) {
        super();
        if (org !== undefined) {
            this._org_id = org.id;
        }
        this._account_type = accountType;
        this._enabled = enabled;
        if (freeTrial) {
            this.startTrial();
        }
    }

    get tenDayRemainingPrompt(): boolean {
        return this._ten_day_remaining_prompt || false;
    }

    set tenDayRemainingPrompt(value: boolean) {
        this._ten_day_remaining_prompt = value;
    }

    get threeDayRemainingPrompt(): boolean {
        return this._three_day_remaining_prompt || false;
    }

    set threeDayRemainingPrompt(value: boolean) {
        this._three_day_remaining_prompt = value;
    }

    get twoDayRemainingPrompt(): boolean {
        return this._two_day_remaining_prompt || false;
    }

    set twoDayRemainingPrompt(value: boolean) {
        this._two_day_remaining_prompt = value;
    }

    get oneDayRemainingPrompt(): boolean {
        return this._one_day_remaining_prompt || false;
    }

    set oneDayRemainingPrompt(value: boolean) {
        this._one_day_remaining_prompt = value;
    }

    get zeroDayRemainingPrompt(): boolean {
        return this._zero_day_remaining_prompt || false;
    }

    set zeroDayRemainingPrompt(value: boolean) {
        this._zero_day_remaining_prompt = value;
    }

    get negativeDayRemainingPrompt(): boolean {
        return this._negative_day_remaining_prompt || false;
    }

    set negativeDayRemainingPrompt(value: boolean) {
        this._negative_day_remaining_prompt = value;
    }

    get negativeFinalDayRemainingPrompt(): boolean {
        return this._negative_final_day_remaining_prompt || false;
    }

    set negativeFinalDayRemainingPrompt(value: boolean) {
        this._negative_final_day_remaining_prompt = value;
    }

    get orgId(): ObjectId {
        return this._org_id;
    }

    get accountType(): AccountType {
        return this._account_type;
    }

    get enabled(): boolean {
        return this._enabled;
    }

    set enabled(value: boolean) {
        this._enabled = value;
    }

    get trialStartedOn(): Date | undefined {
        return this._trial_started_on;
    }

    get trialExpiresOn(): Date | undefined {
        return this._trial_expires_on;
    }

    get stripe_product_id(): string | undefined {
        return this._stripe_product_id;
    }

    set stripe_product_id(value: string | undefined) {
        this._stripe_product_id = value;
    }

    public startTrial(): void {
        this._trial_started_on = new Date();
        this._trial_expires_on = add(new Date(), {
            days: this.TRIAL_LENGTH,
        });
    }

    public cancelTrial(): void {
        this._trial_expires_on = undefined;
    }

    public isOnFreeTrialIncludingExpired(): boolean {
        return this._trial_expires_on !== undefined;
    }

    public isOnFreeTrial(): boolean {
        if (this._trial_expires_on === undefined) {
            return false; //no free trial applied...
        }
        return isBefore(new Date(), this._trial_expires_on);
    }

    public trialExpired(): boolean {
        if (this._trial_expires_on === undefined) {
            return false; //no free trial applied...
        }
        return !isBefore(new Date(), this._trial_expires_on);
    }

    public trialDaysRemaining(): number {
        if (this._trial_expires_on === undefined || this._trial_started_on === undefined) {
            return 0;
        } else {
            return this.TRIAL_LENGTH - differenceInCalendarDays(new Date(), this._trial_started_on);
        }
    }
}
