import express from 'express';
import { injectable } from 'inversify';

@injectable()
export default abstract class Handler {
    public abstract getHandler(): (req: express.Request, res: express.Response) => Promise<void>;
}
