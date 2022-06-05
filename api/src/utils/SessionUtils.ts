import User from '../mongo/models/User';
import Session from '../mongo/models/Session';
import Hash from '../core/Hash';
import OperationOwner from '../enums/OperationOwner';
import container from '../container/IOC.config';
import RepoFromModelFactory from '../container/factoryTypes/RepoFromModelFactory';
import TYPES from '../container/IOC.types';
import AuthenticationError from '../errors/AuthenticationError';
import userMessages from '../errors/UserMessages';
import { ObjectId } from 'mongodb';
import BaseConfig from '../backends/configuration/abstractions/BaseConfig';

export type SessionData = {
    uid: string;
    token: string;
    isTemp: boolean;
};

export const generateSessionToken = async (): Promise<string> => {
    const config = container.get<BaseConfig>(TYPES.BackendConfig);
    return Hash.randomHash(await config.getEncryptionSalt());
};

export const generateNewSession = async (user: User, isTemp = false): Promise<SessionData> => {
    const repoFactory = container.get<RepoFromModelFactory>(TYPES.RepoFromModelFactory);

    const session = new Session(await generateSessionToken());
    if (isTemp) {
        user.tempSessions === undefined
            ? (user.tempSessions = [session])
            : (user.tempSessions = [session, ...user.tempSessions]);
    } else {
        user.sessions === undefined
            ? (user.sessions = [session])
            : (user.sessions = [session, ...user.sessions]);
    }
    await repoFactory(User).save(user, 'SYSTEM');
    return {
        uid: user.id.toHexString(),
        token: session.token,
        isTemp,
    };
};

export const createSession = async (email: string, password: string): Promise<SessionData> => {
    const repoFactory = container.get<RepoFromModelFactory>(TYPES.RepoFromModelFactory);
    const config = container.get<BaseConfig>(TYPES.BackendConfig);

    const user = await repoFactory(User).findOneThrows(
        {
            _email: email,
            _password: Hash.hashString(password, await config.getEncryptionSalt()),
        },
        undefined,
        undefined,
        undefined,
        new AuthenticationError('Failed to find user', userMessages.invalidCredentials),
    );
    return await generateNewSession(user, user.twoFactorAuth);
};

export const createSessionFromUser = async (user: User): Promise<SessionData> => {
    return generateNewSession(user, user.twoFactorAuth);
};

export const getSessionUser = async (uid: string, token: string): Promise<User> => {
    const repoFactory = container.get<RepoFromModelFactory>(TYPES.RepoFromModelFactory);

    return await repoFactory(User).findOneThrows(
        {
            _id: new ObjectId(uid),
            $or: [{ '_sessions._token': token }, { _api_token: token }],
        },
        undefined,
        undefined,
        undefined,
        new AuthenticationError('Failed to find session...', userMessages.invalidSession),
    );
};

export const getTempSessionUser = async (uid: string, token: string): Promise<User> => {
    const repoFactory = container.get<RepoFromModelFactory>(TYPES.RepoFromModelFactory);

    return await repoFactory(User).findOneThrows(
        {
            _id: new ObjectId(uid),
            $or: [{ '_temp_sessions._token': token }],
        },
        undefined,
        undefined,
        undefined,
        new AuthenticationError(
            'Failed to find temporary session...',
            userMessages.invalidTempSession,
        ),
    );
};
