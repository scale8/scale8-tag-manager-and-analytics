import Model from '../abstractions/Model';
import { ObjectId } from 'mongodb';
import AuditAction from '../../enums/AuditAction';
import Field from '../decorators/Field';
import { OperationActor } from '../types/Types';
import DatabaseError from '../../errors/DatabaseError';
import OperationOwner from '../../enums/OperationOwner';
import GQLMethod from '../../enums/GQLMethod';
import ScalarContainer from '../custom/ScalarContainer';
import userMessages from '../../errors/UserMessages';

export default class Audit extends Model {
    @Field<ObjectId>({
        required: false,
        exposeToGQLAs: 'actor_id',
    })
    private readonly _actor_id?: ObjectId;

    @Field<OperationOwner>({
        required: true,
        exposeToGQLAs: 'owner',
    })
    private readonly _owner: OperationOwner;

    @Field<ObjectId>({
        required: true,
        exposeToGQLAs: 'model_id',
    })
    private readonly _model_id!: ObjectId;

    @Field<string>({
        required: true,
        exposeToGQLAs: 'model_persisting_id',
    })
    private readonly _model_persisting_id!: string;

    @Field<string>({
        required: true,
        exposeToGQLAs: 'model',
    })
    private readonly _model!: string;

    @Field<ObjectId>({
        required: true,
        exposeToGQLAs: 'parent_model_ids',
    })
    private readonly _parent_model_ids!: ObjectId[];

    @Field<ObjectId>({
        required: true,
    })
    private readonly _org_id!: ObjectId;

    @Field<AuditAction>({
        required: true,
        exposeToGQLAs: 'action',
    })
    private readonly _action: AuditAction;

    @Field<GQLMethod>({
        required: true,
        exposeToGQLAs: 'method',
    })
    private readonly _method: GQLMethod;

    @Field<string>({
        required: false,
        exposeToGQLAs: 'comments',
    })
    private readonly _comments?: string;

    @Field<ScalarContainer<string>>({
        required: true,
        exposeToGQLAs: 'op_connected_models',
    })
    private readonly _op_connected_models!: ScalarContainer<string>;

    constructor(
        actor: OperationActor,
        owner: OperationOwner,
        model: Model,
        action: AuditAction,
        method: GQLMethod = GQLMethod.INDIRECT_METHOD,
        comments?: string,
        opConnectedModels?: Model[],
    ) {
        super();
        if (owner === 'USER' && typeof actor === 'string') {
            throw new DatabaseError(
                'If operation owner is a user, operation actor must also be a user',
                userMessages.genericDataFailure,
            );
        }
        if (actor !== undefined && typeof actor !== 'string') {
            this._actor_id = actor.id;
        }
        this._owner = owner;
        this._action = action;
        if (model !== undefined) {
            if (model.cloneMaps !== undefined && action === AuditAction.Create) {
                //this action is actually a clone...
                this._action = AuditAction.Clone;
            }
            this._model_id = model.id;
            this._model_persisting_id = model._persisting_id;
            this._model = model.constructor.name;
            this._parent_model_ids = (model.cloneMaps || new ScalarContainer<string>()).arr.map(
                (_) => new ObjectId(_.split('/')[0]),
            );
            this._org_id = model.getOrgEntityId();
            this._op_connected_models = new ScalarContainer<string>(
                ...(opConnectedModels || []).map((_) => `${_.id.toString()}/${_.constructor.name}`),
            );
        }
        this._method = method;
        this._comments = comments;
    }

    get actor(): ObjectId | 'SYSTEM' {
        return this._actor_id ?? 'SYSTEM';
    }

    get owner(): OperationOwner {
        return this._owner;
    }

    get orgId(): ObjectId {
        return this._org_id;
    }

    get modelId(): ObjectId {
        return this._model_id;
    }

    get model(): string {
        return this._model;
    }

    get parentModelIds(): ObjectId[] {
        return this._parent_model_ids;
    }

    get action(): AuditAction {
        return this._action;
    }

    get method(): GQLMethod {
        return this._method;
    }

    get comments(): string | undefined {
        return this._comments;
    }

    get opConnectedModels(): ScalarContainer<string> {
        return this._op_connected_models;
    }
}
