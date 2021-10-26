import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import ResolverRegister from './gql/ResolverRegister';
import TypeDefRegister from './gql/TypeDefRegister';
import TYPES from './container/IOC.types';
import { ApolloError, ApolloServer } from 'apollo-server-express';
import AuthDirective from './gql/directives/AuthDirective';
import CTX from './gql/ctx/CTX';
import fs from 'fs';
import container from './container/IOC.config';
import Shell from './mongo/database/Shell';
import express, { Express } from 'express';
import https from 'https';
import http from 'http';
import Routing from './express/Routing';
import Hash from './core/Hash';
import GenericError from './errors/GenericError';
import bodyParser from 'body-parser';
import { GraphQLError } from 'graphql';
import { getSessionUser } from './utils/SessionUtils';
import BaseLogger from './backends/logging/abstractions/BaseLogger';
import Scale8Setup from './bootstrap/Scale8Setup';
import BaseConfig from './backends/configuration/abstractions/BaseConfig';
import { Mode } from './enums/Mode';
import BaseStorage from './backends/storage/abstractions/BaseStorage';

// noinspection JSUnusedLocalSymbols
@injectable()
export default class APIServer {
    protected readonly resolverRegister: ResolverRegister;
    protected readonly typeDefRegister: TypeDefRegister;
    protected readonly logger: BaseLogger;
    protected readonly shell: Shell;
    protected readonly app: Express;
    protected readonly gqlServer: ApolloServer;
    protected readonly routing: Routing;
    protected readonly config: BaseConfig;
    protected readonly storage: BaseStorage;

    protected httpsServer?: https.Server;
    protected httpServer?: http.Server;

    public constructor(
        @inject(TYPES.ResolverRegister) resolverRegister: ResolverRegister,
        @inject(TYPES.TypeDefRegister) typeDefRegister: TypeDefRegister,
        @inject(TYPES.BackendLogger) logger: BaseLogger,
        @inject(TYPES.Shell) shell: Shell,
        @inject(TYPES.Routing) routing: Routing,
        @inject(TYPES.BackendConfig) config: BaseConfig,
        @inject(TYPES.BackendStorage) storage: BaseStorage,
    ) {
        this.resolverRegister = resolverRegister;
        this.typeDefRegister = typeDefRegister;
        this.logger = logger;
        this.shell = shell;
        this.routing = routing;
        this.config = config;
        this.storage = storage;
        this.gqlServer = this.getGQLServer();
        this.app = this.getApp();
    }

    private getApp(): Express {
        const app = express();
        app.use(
            bodyParser.json({
                verify(req: http.IncomingMessage, res: http.ServerResponse, buf: Buffer) {
                    (req as any).rawBody = buf;
                },
            }),
        );
        app.options('/rest/*', function (req, res) {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header(
                'Access-Control-Allow-Headers',
                'Content-Type, Authorization, Content-Length, X-Requested-With, X-S8-AccountId, X-S8-ImageType, uid, token',
            );
            res.sendStatus(200);
        });

        if (this.config.isDevelopment()) {
            app.use(async (req: express.Request, res: express.Response, next: any) => {
                if (req.path === '/graphql') {
                    this.logger
                        .info(
                            `[${new Date().toString()}] Request: ${req.path} | Operation: ${
                                req.body.operationName || '--'
                            }`,
                        )
                        .then();
                }
                //slowing things down a little..
                await new Promise((resolve) => setTimeout(resolve, 500));
                next();
            });
        }
        this.routing.fetchGetHandlers().forEach((route) => {
            app.get(route.path, route.handling);
        });
        this.routing.fetchPostHandlers().forEach((route) => {
            app.post(route.path, route.handling);
        });
        this.gqlServer.applyMiddleware({ app });

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        app.use((err: any, req: express.Request, res: express.Response, next: any) => {
            const context = {
                method: req.method,
                path: req.path,
                protocol: req.protocol,
                query: req.query,
                routePath: req.route,
            };

            const extractErrorMessage = (): string => {
                if ((err as GenericError).getDebugMessage !== undefined) {
                    return err.getDebugMessage();
                } else {
                    return err.message;
                }
            };

            this.logger
                .logError(
                    err,
                    `Server @${req.path} threw an unhandled exception: -> ${extractErrorMessage()}`,
                )
                .then();

            res.status(500).json({
                errorId: Hash.randomHash('E440R5'),
                userMessage:
                    (err as GenericError).getUserMessage !== undefined
                        ? err.getUserMessage()
                        : 'An error occurred, we have been notified, please try again later.',
                debug: this.config.isDevelopment()
                    ? {
                          message: err.message,
                          context: context,
                          trace: err.stack,
                      }
                    : null,
            });
        });
        return app;
    }

    private getGQLServer(): ApolloServer {
        const settings: () => Record<string, unknown> = () => {
            if (this.config.isDevelopment()) {
                return {
                    engine: false,
                    tracing: true,
                    introspection: true,
                    playground: {
                        settings: {
                            'editor.theme': 'light',
                        },
                        tabs: [],
                    },
                };
            } else {
                return {
                    playground: false,
                    tracing: false,
                    introspection: false,
                    uploads: false,
                    subscriptions: false,
                    engine: false,
                };
            }
        };

        const typeDefs = this.typeDefRegister.getTypeDefs();
        const resolvers = this.resolverRegister.getResolvers();

        return new ApolloServer({
            typeDefs,
            schemaDirectives: {
                auth: AuthDirective,
            },
            resolvers,
            formatError: (err: GraphQLError) => {
                const path =
                    err.path === undefined ? '' : err.path.map((_) => _.toString()).join(',');
                if ((err as GenericError).getDebugMessage !== undefined) {
                    this.logger.logError(err, `GQL @${path} threw an exception`).then();
                } else {
                    this.logger.logError(err, `GQL @${path} threw an unhandled exception`).then();
                }

                return this.config.isProduction()
                    ? new ApolloError(
                          err.message,
                          (err as GenericError).code !== undefined
                              ? (err as GenericError).code
                              : 'UNCLASSIFIED',
                      )
                    : new ApolloError(
                          err.message,
                          (err as GenericError).code !== undefined
                              ? (err as GenericError).code
                              : 'UNCLASSIFIED',
                          err.extensions,
                      );
            },
            context: async ({ req }): Promise<CTX> => {
                const uid = req.headers?.uid;
                const token = req.headers?.token;
                return {
                    uid: typeof uid === 'string' ? uid : undefined,
                    token: typeof token === 'string' ? token : undefined,
                    user:
                        typeof uid === 'string' && typeof token === 'string'
                            ? await getSessionUser(uid, token)
                            : null,
                };
            },
            ...settings(),
        });
    }

    public async startServer(): Promise<void> {
        await this.config.dump();

        await this.storage.configure(); //we need to make sure our storage backend is properly configured
        this.logger.info(`Connecting to MongoDB...`).then();
        await this.shell.connect();
        await container.resolve(Scale8Setup).setup();

        if (this.config.getMode() === Mode.COMMERCIAL) {
            const port = await this.config.getApiHttpsPort();
            const certKeyPath = await this.config.getCertKeyPath();
            const certPath = await this.config.getCertPath();
            if (certKeyPath !== '' && certPath !== '') {
                const startHttpsServer = (): Promise<https.Server> =>
                    new Promise((resolve) => {
                        const svr = https
                            .createServer(
                                {
                                    key: fs.readFileSync(certKeyPath),
                                    cert: fs.readFileSync(certPath),
                                },
                                this.app,
                            )
                            .listen(port, () => {
                                this.logger.info(`🚀 Server ready on :${port}`);
                                this.logger.info(`Environment => ${this.config.getEnvironment()}`);
                                this.logger.info(`Logs available at: file://${process.cwd()}/logs`);
                                resolve(svr);
                            });
                    });
                this.httpsServer = await startHttpsServer();
            }
        }

        const httpPort = await this.config.getApiHttpPort();

        const startHttpServer = (): Promise<http.Server> =>
            new Promise((resolve) => {
                if (this.config.isProduction() && this.config.getMode() === Mode.COMMERCIAL) {
                    const svr = http
                        .createServer((req, res) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.end('{"o":"k"}');
                        })
                        .listen(httpPort, () => {
                            this.logger.info(`Probe server ready on :${httpPort}`);
                            resolve(svr);
                        });
                } else {
                    const svr = http.createServer(this.app).listen(httpPort, () => {
                        this.logger.info(`HTTP server ready on :${httpPort}`);
                        resolve(svr);
                    });
                }
            });

        this.httpServer = await startHttpServer();
    }

    public async stopServer(): Promise<void> {
        const stop = (server: http.Server | https.Server | undefined): Promise<void> =>
            new Promise((resolve) => {
                if (server === undefined) {
                    resolve();
                } else {
                    server.close(() => resolve());
                }
            });
        await Promise.all([stop(this.httpsServer), stop(this.httpServer)]);
        await this.shell.disconnect();
    }
}
