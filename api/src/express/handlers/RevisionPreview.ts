import express from 'express';
import { inject, injectable } from 'inversify';
import Handler from './abstractions/Handler';
import TYPES from '../../container/IOC.types';
import { ObjectId } from 'mongodb';
import RepoFromModelFactory from '../../container/factoryTypes/RepoFromModelFactory';
import Revision from '../../mongo/models/tag/Revision';
import userMessages from '../../errors/UserMessages';
import { buildRevisionConfig } from '../../utils/EnvironmentUtils';

@injectable()
export default class RevisionPreview extends Handler {
    @inject(TYPES.RepoFromModelFactory) private repoFactory!: RepoFromModelFactory;

    public getHandler() {
        return async (req: express.Request, res: express.Response) => {
            res.header('Content-Type', 'application/json');
            const revision = await this.repoFactory(Revision).findByIdThrows(
                new ObjectId(req.params.revisionId as string),
                userMessages.revisionFailed,
            );
            const config = await buildRevisionConfig(revision);
            res.send(JSON.stringify(config));
        };
    }
}
