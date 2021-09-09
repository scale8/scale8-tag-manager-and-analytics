import express from 'express';
import { injectable } from 'inversify';
import Handler from './abstractions/Handler';

@injectable()
export default class Ping extends Handler {
    public getHandler() {
        return async (req: express.Request, res: express.Response) => {
            res.json({ o: 'k' });
        };
    }
}
