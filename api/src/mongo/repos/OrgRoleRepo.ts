import { injectable } from 'inversify';
import OrgRole from '../models/OrgRole';
import Repo from '../abstractions/Repo';

@injectable()
export default class OrgRoleRepo extends Repo<OrgRole> {}
