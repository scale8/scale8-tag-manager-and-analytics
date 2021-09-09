import Repo from '../abstractions/Repo';
import { injectable } from 'inversify';
import GitHub from '../models/GitHub';

@injectable()
export default class GitHubRepo extends Repo<GitHub> {}
