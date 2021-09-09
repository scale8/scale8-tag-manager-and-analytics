import Repo from '../../abstractions/Repo';
import { injectable } from 'inversify';
import Platform from '../../models/tag/Platform';

@injectable()
export default class PlatformRepo extends Repo<Platform> {
    protected readonly auditEnabled = true;
}
