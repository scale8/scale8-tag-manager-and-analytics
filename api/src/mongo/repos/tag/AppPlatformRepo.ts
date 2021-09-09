import Repo from '../../abstractions/Repo';
import { injectable } from 'inversify';
import AppPlatform from '../../models/tag/AppPlatform';

@injectable()
export default class AppPlatformRepo extends Repo<AppPlatform> {
    protected readonly auditEnabled = true;
}
