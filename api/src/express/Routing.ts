import { inject, injectable } from 'inversify';
import express from 'express';
import GitHubAuth from './handlers/GitHubAuth';
import GitHubRedirect from './handlers/GitHubRedirect';
import TYPES from '../container/IOC.types';
import RevisionPreview from './handlers/RevisionPreview';
import Ping from './handlers/Ping';
import StripeWebhook from './handlers/StripeWebhook';

type WrappedHandler = (
    req: express.Request,
    res: express.Response,
    next: (e: Error) => any,
) => void;

type Route = {
    path: string;
    handling: WrappedHandler;
};

@injectable()
export default class Routing {
    @inject(TYPES.StripeWebhook) private readonly stripeWebhook!: StripeWebhook;
    @inject(TYPES.GitHubAuth) private readonly gitHubAuth!: GitHubAuth;
    @inject(TYPES.RevisionPreview) private readonly revisionPreview!: RevisionPreview;
    @inject(TYPES.Ping) private ping!: Ping;

    private wrapHandler(
        handler: (req: express.Request, res: express.Response) => Promise<void>,
    ): WrappedHandler {
        return (req: express.Request, res: express.Response, next) => {
            handler(req, res).catch((e) => next(e));
        };
    }

    public fetchGetHandlers(): Route[] {
        return [
            {
                path: '/ping',
                handling: this.wrapHandler(this.ping.getHandler()),
            },
            {
                path: '/preview-revision/:revisionId',
                handling: this.wrapHandler(this.revisionPreview.getHandler()),
            },
            {
                path: '/auth/github',
                handling: this.wrapHandler(GitHubRedirect),
            },
            {
                path: '/auth/rtn/github',
                handling: this.wrapHandler(this.gitHubAuth.getHandler()),
            },
        ];
    }

    public fetchPostHandlers(): Route[] {
        return [
            {
                path: '/stripe/webhook/v1',
                handling: this.wrapHandler(this.stripeWebhook.getHandler()),
            },
        ];
    }
}
