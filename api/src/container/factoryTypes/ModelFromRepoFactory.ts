import { CT } from '../../mongo/types/Types';
import Model from '../../mongo/abstractions/Model';

export default interface ModelFromRepoFactory {
    <T extends Model>(repoName: string): CT<T>;
}
