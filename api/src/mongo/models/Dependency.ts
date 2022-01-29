import Model from '../abstractions/Model';
import { ObjectId } from 'mongodb';
import Field from '../decorators/Field';

export default class Dependency extends Model {
    @Field<ObjectId>({
        required: true,
    })
    private readonly _model_id!: ObjectId;

    @Field<string>({
        required: true,
    })
    private readonly _model_name: string;

    @Field<ObjectId>({
        required: true,
    })
    private readonly _depends_on_model_id: ObjectId;

    @Field<string>({
        required: true,
    })
    private readonly _depends_on_model_name: string;

    constructor(
        modelId: ObjectId,
        modelName: string,
        dependsOnModelId: ObjectId,
        dependsOnModelName: string,
    ) {
        super();
        this._model_id = modelId;
        this._model_name = modelName;
        this._depends_on_model_id = dependsOnModelId;
        this._depends_on_model_name = dependsOnModelName;
    }

    get modelId(): ObjectId {
        return this._model_id;
    }

    get modelName(): string {
        return this._model_name;
    }

    get dependsOnModelId(): ObjectId {
        return this._depends_on_model_id;
    }

    get dependsOnModelName(): string {
        return this._depends_on_model_name;
    }
}
