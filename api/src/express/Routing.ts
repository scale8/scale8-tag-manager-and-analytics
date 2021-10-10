import { injectable } from 'inversify';
import express from 'express';
import GitHubAuth from './handlers/GitHubAuth';
import GitHubRedirect from './handlers/GitHubRedirect';
import RevisionPreview from './handlers/RevisionPreview';
import Ping from './handlers/Ping';
import StripeWebhook from './handlers/StripeWebhook';
import container from '../container/IOC.config';
import FetchRemoteFileAsText from './handlers/FetchRemoteFileAsText';

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
                handling: this.wrapHandler(container.resolve(Ping).getHandler()),
            },
            {
                path: '/preview-revision/:revisionId',
                handling: this.wrapHandler(container.resolve(RevisionPreview).getHandler()),
            },
            {
                path: '/auth/github',
                handling: this.wrapHandler(GitHubRedirect),
            },
            {
                path: '/auth/rtn/github',
                handling: this.wrapHandler(container.resolve(GitHubAuth).getHandler()),
            },
            {
                path: '/api/fetch-as-text',
                handling: this.wrapHandler(container.resolve(FetchRemoteFileAsText).getHandler()),
            },
        ];
    }

    public fetchPostHandlers(): Route[] {
        return [
            {
                path: '/stripe/webhook/v1',
                handling: this.wrapHandler(container.resolve(StripeWebhook).getHandler()),
            },
        ];
    }
}
