import { BaseModel, Model } from './ModelTypes';
import { S8Config } from '../types/Types';
import { RefId } from '../../../../../common/models/RefId';

export default class DB {
    private static readonly models: Map<string, BaseModel[]> = new Map();

    public static getCollection(model: Model): BaseModel[] {
        return DB.models.get(model) || [];
    }

    public static dump(): void {
        console.log(this.models);
    }

    public static load(config: S8Config): void {
        const models = config.models;
        const transform = (model: { [k: string]: any }) =>
            Object.keys(model).reduce((m, k) => {
                const v = model[k];
                if (v === null) {
                    m[k] = v;
                } else if (
                    Array.isArray(v) &&
                    v.every((_) => typeof _ === 'object' && _.ref !== undefined)
                ) {
                    m[k] = v.map((_) => new RefId(_.ref));
                } else if (typeof v === 'object' && v.ref !== undefined) {
                    m[k] = new RefId(v.ref);
                } else if (typeof v === 'object' && v.___type !== undefined) {
                    if (v.___type === 'Date') {
                        m[k] = new Date(v.value);
                    } else {
                        throw Error(`Unsupported value type '${v.___type}'`);
                    }
                } else if (v !== undefined) {
                    m[k] = v;
                }
                return m;
            }, {} as { [k: string]: any });
        Object.keys(models).forEach((id) => {
            const type = models[id].___type;
            this.models.set(type, [
                ...(this.models.get(type) || []),
                transform({ ...{ _id: new RefId(id), ___type: type }, ...models[id] }) as any,
            ]);
        });
    }
}
