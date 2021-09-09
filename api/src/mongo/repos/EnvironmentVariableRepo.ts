import Repo from '../abstractions/Repo';
import { injectable } from 'inversify';
import EnvironmentVariable from '../models/EnvironmentVariable';

@injectable()
export default class EnvironmentVariableRepo extends Repo<EnvironmentVariable> {}
