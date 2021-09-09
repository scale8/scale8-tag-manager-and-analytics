import Field from '../../decorators/Field';
import Model from '../../abstractions/Model';
import Org from '../Org';
import { ObjectID } from 'mongodb';
import { add, isBefore } from 'date-fns';
import { AccountType } from '../../../enums/AccountType';

export default class DataManagerAccount extends Model {
    public getOrgEntityId(): ObjectID {
        return this.orgId;
    }

    @Field<ObjectID>({
        required: true,
        exposeToGQLAs: 'org_id',
    })
    private readonly _org_id!: ObjectID;

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

    get orgId(): ObjectID {
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

    public startTrial(): void {
        this._trial_started_on = new Date();
        this._trial_expires_on = add(new Date(), {
            days: 30,
        });
    }

    public cancelTrial(): void {
        this._trial_expires_on = undefined;
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
}
