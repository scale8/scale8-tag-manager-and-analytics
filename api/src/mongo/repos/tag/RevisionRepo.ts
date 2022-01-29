import Repo from '../../abstractions/Repo';
import { injectable } from 'inversify';
import Revision from '../../models/tag/Revision';
import { IndexDescription } from 'mongodb';
import PlatformRevision from '../../models/tag/PlatformRevision';
import AppPlatformRevision from '../../models/tag/AppPlatformRevision';

@injectable()
export default class RevisionRepo extends Repo<Revision> {
    protected readonly auditEnabled = true;

    protected readonly indexes: IndexDescription[] = [
        {
            background: false,
            key: {
                _app_id: 1,
            },
        },
    ];

    public async getValidPlatformRevisions(revision: Revision): Promise<PlatformRevision[]> {
        const appPlatformRevisions = await this.repoFactory(AppPlatformRevision).findByIds(
            revision.appPlatformRevisionIds,
        );
        return this.repoFactory(PlatformRevision).findByIds(
            appPlatformRevisions.map((_) => _.platformRevisionId),
        );
    }
}
