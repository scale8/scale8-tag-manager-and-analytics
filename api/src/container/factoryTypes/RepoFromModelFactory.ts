import Model from '../../mongo/abstractions/Model';
import Repo from '../../mongo/abstractions/Repo';
import { CT } from '../../mongo/types/Types';

export default interface RepoFromModelFactory {
    // eslint-disable-next-line no-use-before-define
    <U extends Repo<T>, T extends Model = Model>(model: string | CT<T>): U;
}
