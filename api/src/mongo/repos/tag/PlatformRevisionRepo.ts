import Repo from '../../abstractions/Repo';
import { injectable } from 'inversify';
import PlatformRevision from '../../models/tag/PlatformRevision';

@injectable()
export default class PlatformRevisionRepo extends Repo<PlatformRevision> {
    protected readonly auditEnabled = true;
}
