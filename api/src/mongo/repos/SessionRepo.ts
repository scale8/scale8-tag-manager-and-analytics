import Repo from '../abstractions/Repo';
import { injectable } from 'inversify';
import Session from '../models/Session';

@injectable()
export default class SessionRepo extends Repo<Session> {}
