import { ModelType, CT, GQLScalar, ConfigType } from '../types/Types';
import Model from '../abstractions/Model';
import { RCT } from '../../container/ChainDependenciesBinder';
import Repo from '../abstractions/Repo';

export default interface FieldProps<T extends ModelType> {
    repository?: RCT<Repo<Model>>; //when creating a new instance, use this...
    required?: boolean; //is the field required on insert?
    defaultValue?: () => T; //if the field is required, but undefined, use this default.
    validation?: (value: T) => boolean; //is the field valid?
    onInsert?: (value: T) => T; //perform this action on value on insert
    onUpdate?: (value: T) => T; //perform this action on value on update
    exposeToGQLAs?: string; //name as seen by GQL - if exposed, it will be visible in GQL resolvers when converting to model to GQL.
    platformInstance?: (value: T) => CT<Model> | null; //if this ObjectID or ObjectID[] will hydrate to a new platform instance
    platformAutoMerge?: boolean; //can we accept a value change here without worrying about a conflict in our system, if true, just accept new with no conflict
    exposeToConfigUsing?: (value: T) => ConfigType | ConfigType[] | GQLScalar | GQLScalar[]; //when exposing to config, we may need to alter the values
    exposeToConfig?: boolean;
}
