import express from 'express';
import { injectable } from 'inversify';
import Handler from './abstractions/Handler';
import GenericError from '../../errors/GenericError';
import { LogPriority } from '../../enums/LogPriority';
import got from 'got';

@injectable()
export default class FetchRemoteFileAsText extends Handler {
    public getHandler() {
        return async (req: express.Request, res: express.Response) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header(
                'Access-Control-Allow-Headers',
                'Content-Type, Authorization, Content-Length, X-Requested-With, X-S8-AccountId, X-S8-ImageType, uid, token',
            );
            const url = typeof req.query.url === 'string' ? req.query.url : '';
            if (url.match(/^http/) === null) {
                throw new GenericError(
                    'Please provide a valid url to be fetched',
                    LogPriority.ERROR,
                    true,
                );
            } else {
                res.json({ contents: (await got.get(url)).body });
            }
        };
    }
}
