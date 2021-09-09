declare const S8_UI_SERVER_REPLACE: string | undefined;

export default class Context {
    private static _environmentId?: string;
    private static _environmentVars?: { [k: string]: string };
    private static _appId?: string;
    private static _revisionId?: string;
    private static _platformId?: string;
    private static _countryCode?: string;
    private static _subdivisionCodes: string[] = [];
    private static _server?: string;
    private static _serverMode?: string;
    private static _distributionValue?: number;
    private static _uiServer?: string;
    private static _ingestEndpointEnvironments?: { [k: string]: string };
    private static _preview?: string;

    public static setContext(
        environmentId: string,
        environmentVars: { [k: string]: string },
        appId: string,
        revisionId: string,
        platformId: string,
        countryCode: string,
        subdivisionCodes: string[],
        server: string,
        serverMode: string,
        distributionValue: number,
        uiServer: string,
        ingestEndpointEnvironments: { [k: string]: string },
        preview?: string,
    ) {
        this._environmentId = environmentId;
        this._environmentVars = environmentVars;
        this._appId = appId;
        this._revisionId = revisionId;
        this._platformId = platformId;
        this._countryCode = countryCode;
        this._subdivisionCodes = subdivisionCodes;
        this._server = server;
        this._serverMode = serverMode;
        this._distributionValue = distributionValue;
        this._uiServer = uiServer;
        this._ingestEndpointEnvironments = ingestEndpointEnvironments;
        this._preview = preview;
    }

    public static getPreview(): string | undefined {
        return this._preview;
    }

    public static getServerEnvironment(): string {
        return this._serverMode || 'development';
    }

    public static isServerEnvironmentDevelopment(): boolean {
        return this.getServerEnvironment() === 'development';
    }

    public static isServerEnvironmentProduction(): boolean {
        return this.getServerEnvironment() === 'production';
    }

    public static getUIEndpoint(): string {
        return this._uiServer || 'https://scale8.com';
    }

    public static getInstallDomainForIngestEndpointEnvironment(
        ingestEndpointEnvironmentId: string,
    ): string {
        if (this._ingestEndpointEnvironments === undefined) {
            throw new Error('Ingest endpoint environments has not been defined');
        } else if (this._ingestEndpointEnvironments.hasOwnProperty(ingestEndpointEnvironmentId)) {
            return this._ingestEndpointEnvironments[ingestEndpointEnvironmentId];
        } else {
            throw new Error('Ingest endpoint environment install domain has not been mapped');
        }
    }

    public static getEnvironmentId(): string {
        if (this._environmentId === undefined) {
            throw new Error('Environment id has not been defined');
        }
        return this._environmentId;
    }

    public static getEnvironmentVars(): { [k: string]: string } {
        if (this._environmentVars === undefined) {
            throw new Error('Environment vars has not been defined');
        }
        return this._environmentVars;
    }

    public static getAppId(): string {
        if (this._appId === undefined) {
            throw new Error('App id has not been defined');
        }
        return this._appId;
    }

    public static getRevisionId(): string {
        if (this._revisionId === undefined) {
            throw new Error('Revision id has not been defined');
        }
        return this._revisionId;
    }

    public static getPlatformId(): string {
        if (this._platformId === undefined) {
            throw new Error('Platform id has not been defined');
        }
        return this._platformId;
    }

    public static getCountryCode(): string {
        if (this._countryCode === undefined) {
            throw new Error('Country code has not been defined');
        }
        return this._countryCode;
    }

    public static getSubdivisionCodes(): string[] {
        return this._subdivisionCodes || [];
    }

    public static getServer(): string {
        if (this._server === undefined) {
            throw new Error('Server has not been defined');
        }
        return this._server;
    }

    public static getDistV(): number {
        if (this._distributionValue === undefined) {
            throw new Error('Server has not been defined');
        }
        return this._distributionValue;
    }

    public static trackUrlChange(): boolean {
        return true;
    }

    public static trackHashChange(): boolean {
        return true;
    }
}
