import Repo from '../abstractions/Repo';
import { injectable } from 'inversify';
import PermissionGroup from '../models/PermissionGroup';

@injectable()
export default class PermissionGroupRepo extends Repo<PermissionGroup> {}
