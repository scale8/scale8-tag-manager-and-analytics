import { inject, injectable } from 'inversify';
import User from '../mongo/models/User';
import Hash from '../core/Hash';
import TYPES from '../container/IOC.types';
import RepoFromModelFactory from '../container/factoryTypes/RepoFromModelFactory';
import OperationOwner from '../enums/OperationOwner';
import Org from '../mongo/models/Org';
import { createOrg } from '../utils/OrgUtils';
import TagManagerAccountRepo from '../mongo/repos/tag/TagManagerAccountRepo';
import TagManagerAccount from '../mongo/models/tag/TagManagerAccount';
import Platform from '../mongo/models/tag/Platform';
import { PlatformType } from '../enums/PlatformType';
import PlatformRevision from '../mongo/models/tag/PlatformRevision';
import * as fs from 'fs';
import PlatformRevisionManager from '../managers/tag/PlatformRevisionManager';
import BaseStorage from '../backends/storage/abstractions/BaseStorage';
import BaseConfig from '../backends/configuration/abstractions/BaseConfig';
import FileSystem from '../core/FileSystem';
import path from 'path';
import { PlatformConfigOnly } from '../../../common/interfaces/PlatformSpec';
import BaseLogger from '../backends/logging/abstractions/BaseLogger';

@injectable()
export default class Scale8Setup {
    @inject(TYPES.RepoFromModelFactory) protected readonly repoFactory!: RepoFromModelFactory;

    @inject(TYPES.PlatformRevisionManager)
    protected readonly platformRevisionManager!: PlatformRevisionManager;

    @inject(TYPES.BackendStorage) protected readonly backendStorage!: BaseStorage;
    @inject(TYPES.BackendLogger) protected readonly logger!: BaseLogger;
    @inject(TYPES.BackendConfig) protected readonly config!: BaseConfig;

    private readonly PRIMARY_ORG_NAME = 'Scale8';

    public async setup(): Promise<void> {
        this.logger.info(`Setting up ${this.PRIMARY_ORG_NAME}`).then();
        const user = await this.getUser();
        const org = await this.getOrg(user);
        await this.upsertPlatforms(
            await this.repoFactory<TagManagerAccountRepo>(TagManagerAccount).getFromOrg(org),
            user,
        );
    }

    private async getUser(): Promise<User> {
        const user = new User(
            'Scale',
            '8',
            Hash.hashString(
                await this.config.getDefaultAdminPassword(),
                await this.config.getEncryptionSalt(),
            ),
            'admin@scale8.com',
            Hash.randomHash(await this.config.getEncryptionSalt()),
            [],
            true,
            true,
        );
        const foundUser = await this.repoFactory(User).findOne({ _email: user.email });
        if (foundUser === null) {
            this.logger.info(`Scale8 user '${user.email}' not found, creating new user...`).then();
            return this.repoFactory(User).save(user, 'SYSTEM', OperationOwner.SYSTEM);
        } else {
            this.logger.info(`Scale8 user '${user.email}' already exists...`).then();
            return foundUser;
        }
    }

    private async getOrg(owner: User): Promise<Org> {
        const foundOrg = await this.repoFactory(Org).findOne({ _name: this.PRIMARY_ORG_NAME });
        if (foundOrg === null) {
            this.logger
                .info(`Scale8 org not found, creating new org '${this.PRIMARY_ORG_NAME}'...`)
                .then();
            return createOrg(
                owner,
                this.PRIMARY_ORG_NAME,
                [owner],
                undefined,
                undefined,
                false,
                false,
                true,
            );
        } else {
            this.logger.info(`Scale8 org '${this.PRIMARY_ORG_NAME}' already exists...`).then();
            return foundOrg;
        }
    }

    private async upsertPlatform(
        config: PlatformConfigOnly,
        tagManagerAccount: TagManagerAccount,
        owner: User,
    ): Promise<Platform> {
        const name = config.name;
        const description = config.name;
        const foundPlatform = await this.repoFactory(Platform).findOne({ _name: name });
        if (foundPlatform === null) {
            this.logger
                .info(`Scale8 platform not found, creating new platform '${name}'...`)
                .then();
            return this.repoFactory(Platform).save(
                new Platform(
                    PlatformType.CUSTOM,
                    name,
                    description,
                    tagManagerAccount,
                    undefined,
                    name === 'Scale8 Core',
                    true,
                ),
                owner,
                OperationOwner.USER,
            );
        } else {
            this.logger.info(`Scale8 platform '${name}' already exists...`).then();
            return foundPlatform;
        }
    }

    private async upsertPlatforms(tagManagerAccount: TagManagerAccount, owner: User) {
        const buildsPath = path.resolve(__dirname, '../../platform-builds');
        const builds = FileSystem.listDirectoryNamesIn(buildsPath);
        await Promise.all(
            builds.map(async (build) => {
                this.logger.info(`Checking build '${build}'...`).then();
                const config = JSON.parse(
                    fs.readFileSync(`${buildsPath}/${build}/config.json`, 'utf8'),
                ) as PlatformConfigOnly;
                this.logger.info(`Fetched '${build}' config`).then();
                const platform = await this.upsertPlatform(config, tagManagerAccount, owner);
                const version = `${config.version.major}.${config.version.minor}.${config.version.patch}`;
                this.logger.info(`Using build version ${version} for '${build}'...`).then();
                if (
                    (await this.repoFactory(PlatformRevision).findOne({
                        _platform_id: platform.id,
                        _name: version,
                    })) === null
                ) {
                    this.logger
                        .info(
                            `Creating new platform revision for version '${build} @ ${version}'...`,
                        )
                        .then();
                    const assets = new Map(
                        FileSystem.listFileNamesIn(`${buildsPath}/${build}`)
                            .filter((_) => _.endsWith('.js'))
                            .map((file) => [file, file === 'main.js']),
                    );
                    const revision =
                        await this.platformRevisionManager.createRevisionFromPlatformConfig(
                            owner,
                            platform,
                            config,
                            version,
                            assets,
                            true,
                        );
                    await Promise.all(
                        Array.from(assets).map(async (value) => {
                            const [fileName] = value;
                            return this.backendStorage.setAsString(
                                await this.config.getAssetBucket(),
                                `${revision.platformId.toString()}/${revision.id.toString()}-${fileName}`,
                                fs.readFileSync(`${buildsPath}/${build}/${fileName}`, 'utf8'),
                                {
                                    contentType: 'application/javascript',
                                },
                            );
                        }),
                    );
                }
            }),
        );
    }
}
