import { injectable } from 'inversify';
import OrgRole from '../models/OrgRole';
import Repo from '../abstractions/Repo';
import { IndexDescription } from 'mongodb';

@injectable()
export default class OrgRoleRepo extends Repo<OrgRole> {
    protected readonly indexes: IndexDescription[] = [
        {
            key: {
                _user_id: 1,
            },
        },
        {
            key: {
                _org_id: 1,
            },
        },
    ];
}
