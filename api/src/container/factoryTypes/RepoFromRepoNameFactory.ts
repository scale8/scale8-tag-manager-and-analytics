import Model from '../../mongo/abstractions/Model';
import Repo from '../../mongo/abstractions/Repo';

export default interface RepoFromRepoNameFactory {
    <T extends Model>(repoName: string): Repo<T>;
}
