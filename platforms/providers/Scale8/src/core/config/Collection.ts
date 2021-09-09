import { BaseModel, Model } from './ModelTypes';
import DB from './DB';
import { Query } from '../types/Types';
import { RefId } from '../../../../../common/models/RefId';

export default class Collection {
    public static findByIdThrows<M extends BaseModel>(model: Model, id?: RefId | string): M {
        if (id === undefined) {
            throw new Error(`No id provided for ${model}`);
        }
        const v = this.findById(model, id);
        if (v === undefined) {
            throw new Error(`Unable to find id -> ${id.toString()} on ${model}`);
        }
        return v as M;
    }

    public static findById<M extends BaseModel>(model: Model, id: RefId | string): M | undefined {
        return DB.getCollection(model).find(
            (_) => _._id.id === (typeof id === 'string' ? id : id.id),
        ) as M | undefined;
    }

    public static findByIds<M extends BaseModel>(model: Model, ids: (RefId | string)[]): M[] {
        return ids.map((_) => this.findByIdThrows(model, _));
    }

    public static findOneThrows<M extends BaseModel>(model: Model, query: Query = {}): M {
        const res = this.findOne(model, query);
        if (res === undefined) {
            throw new Error(`Unable to find using ${JSON.stringify(query)} on ${model}`);
        }
        return res as M;
    }

    public static findOne<M extends BaseModel>(model: Model, query: Query = {}): M | undefined {
        const res = this.find(model, query);
        return res.length > 0 ? (res[0] as M) : undefined;
    }

    public static find<M extends BaseModel>(model: Model, query: Query = {}): M[] {
        return DB.getCollection(model).filter((model) =>
            Object.entries(query).every(
                ([qk, qV]) => (model as any)[qk] && (model as any)[qk] == qV,
            ),
        ) as M[];
    }
}
