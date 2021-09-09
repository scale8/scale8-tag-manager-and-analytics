import User from '../../mongo/models/User';

export default interface CTX {
    uid: string | undefined;
    token: string | undefined;
    user: User | null;
}
