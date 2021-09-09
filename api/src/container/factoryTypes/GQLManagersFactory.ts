import Manager from '../../abstractions/Manager';
import Model from '../../mongo/abstractions/Model';

export default interface GQLManagersFactory {
    (): Manager<Model>[];
}
