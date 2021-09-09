import Repo from '../../mongo/abstractions/Repo';
import Model from '../../mongo/abstractions/Model';
import { CT } from '../../mongo/types/Types';

export default interface RepoFromManagerFactory {
    <T extends Model = Model>(managerName: string | CT<T>): Repo<T>;
}
