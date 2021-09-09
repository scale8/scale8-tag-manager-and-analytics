import express from 'express';
import container from '../../container/IOC.config';
import BaseConfig from '../../backends/configuration/abstractions/BaseConfig';
import TYPES from '../../container/IOC.types';
import GenericError from '../../errors/GenericError';
import userMessages from '../../errors/UserMessages';
import { LogPriority } from '../../enums/LogPriority';

export default async (req: express.Request, res: express.Response) => {
    const config = container.get<BaseConfig>(TYPES.BackendConfig);
    if (!(await config.gitHubSsoEnabled())) {
        throw new GenericError(userMessages.gitHubSsoDisabled, LogPriority.ERROR, true);
    }

    const login = req.query.login;
    res.redirect(
        `https://github.com/login/oauth/authorize?client_id=${await config.getGitHubClientId()}&scope=${await config.getGitHubLoginScope()}${
            login ? `&login=${login}` : ''
        }`,
    );
};
