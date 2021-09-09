import Model from '../abstractions/Model';
import { ObjectID } from 'mongodb';
import Field from '../decorators/Field';

export default class Dependency extends Model {
    @Field<ObjectID>({
        required: true,
    })
    private readonly _model_id!: ObjectID;

    @Field<string>({
        required: true,
    })
    private readonly _model_name: string;

    @Field<ObjectID>({
        required: true,
    })
    private readonly _depends_on_model_id: ObjectID;

    @Field<string>({
        required: true,
    })
    private readonly _depends_on_model_name: string;

    constructor(
        modelId: ObjectID,
        modelName: string,
        dependsOnModelId: ObjectID,
        dependsOnModelName: string,
    ) {
        super();
        this._model_id = modelId;
        this._model_name = modelName;
        this._depends_on_model_id = dependsOnModelId;
        this._depends_on_model_name = dependsOnModelName;
    }

    get modelId(): ObjectID {
        return this._model_id;
    }

    get modelName(): string {
        return this._model_name;
    }

    get dependsOnModelId(): ObjectID {
        return this._depends_on_model_id;
    }

    get dependsOnModelName(): string {
        return this._depends_on_model_name;
    }
}
