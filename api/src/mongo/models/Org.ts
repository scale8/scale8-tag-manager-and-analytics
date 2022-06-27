import Model from '../abstractions/Model';
import Field from '../decorators/Field';
import TimeZones from '../../core/TimeZones';
import { ObjectId } from 'mongodb';
import User from './User';
import DatabaseError from '../../errors/DatabaseError';

export default class Org extends Model {
    protected readonly RESERVED_ORG_NAME = 'Scale8';

    public getOrgEntityId(): ObjectId {
        return this.id;
    }

    @Field<string>({
        required: true,
        exposeToGQLAs: 'name',
    })
    private _name: string;

    @Field<string>({
        required: true,
        exposeToGQLAs: 'tz',
        validation: (_) => TimeZones.isValidTimeZone(_),
    })
    private _tz!: string;

    @Field<ObjectId>({
        required: true,
        exposeToGQLAs: 'org_owner_user_id',
    })
    private _org_owner_user_id!: ObjectId;

    @Field<boolean>({
        required: false,
        exposeToGQLAs: 'stripe_customer_id',
    })
    private _stripe_customer_id: string | undefined;

    @Field<boolean>({
        required: false,
        exposeToGQLAs: 'stripe_subscription_id',
    })
    private _stripe_subscription_id: string | undefined;

    @Field<boolean>({
        required: true,
        exposeToGQLAs: 'manual_invoicing',
    })
    private _manual_invoicing: boolean;

    @Field<boolean>({
        required: false,
        exposeToGQLAs: 'billing_start',
    })
    private _billing_start?: Date;

    @Field<boolean>({
        required: false,
        exposeToGQLAs: 'billing_end',
    })
    private _billing_end?: Date;

    constructor(orgOwnerUser: User, name: string, tz = 'UTC', manualInvoicing = false) {
        super();
        if (orgOwnerUser !== undefined) {
            this._org_owner_user_id = orgOwnerUser.id;
        }
        if (name === this.RESERVED_ORG_NAME && !orgOwnerUser.isAdmin) {
            throw new DatabaseError('Protected org name used');
        }
        this._name = name;
        this._tz = tz;
        this._manual_invoicing = manualInvoicing;
    }

    get billingStart(): Date | undefined {
        return this._billing_start;
    }

    set billingStart(value: Date | undefined) {
        this._billing_start = value;
    }

    get billingEnd(): Date | undefined {
        return this._billing_end;
    }

    set billingEnd(value: Date | undefined) {
        this._billing_end = value;
    }

    get manualInvoicing(): boolean {
        return this._manual_invoicing;
    }

    set manualInvoicing(value: boolean) {
        this._manual_invoicing = value;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        if (value === this.RESERVED_ORG_NAME) {
            throw new DatabaseError('Protected org name used');
        } else {
            this._name = value;
        }
    }

    get tz(): string {
        return this._tz;
    }

    set tz(value: string) {
        this._tz = value;
    }

    set orgOwnerUser(value: ObjectId) {
        this._org_owner_user_id = value;
    }

    get orgOwnerUser(): ObjectId {
        return this._org_owner_user_id;
    }

    set stripeCustomerId(value: string | undefined) {
        this._stripe_customer_id = value;
    }

    get stripeCustomerId(): string | undefined {
        return this._stripe_customer_id;
    }

    set stripeSubscriptionId(value: string | undefined) {
        this._stripe_subscription_id = value;
    }

    get stripeSubscriptionId(): string | undefined {
        return this._stripe_subscription_id;
    }
}
