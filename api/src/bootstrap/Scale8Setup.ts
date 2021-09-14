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

@injectable()
export default class Scale8Setup {
    @inject(TYPES.RepoFromModelFactory) protected readonly repoFactory!: RepoFromModelFactory;

    @inject(TYPES.PlatformRevisionManager)
    protected readonly platformRevisionManager!: PlatformRevisionManager;

    @inject(TYPES.BackendStorage) protected readonly backendStorage!: BaseStorage;

    @inject(TYPES.BackendConfig) protected readonly config!: BaseConfig;

    private readonly PRIMARY_ORG_NAME = 'Scale8';

    public async setup(): Promise<void> {
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
            Hash.randomHash(await this.config.getEncryptionSalt()),
            'support@scale8.com',
            Hash.randomHash(await this.config.getEncryptionSalt()),
            [],
            true,
            true,
        );
        const foundUser = await this.repoFactory(User).findOne({ _email: user.email });
        return foundUser === null
            ? await this.repoFactory(User).save(user, 'SYSTEM', OperationOwner.SYSTEM)
            : foundUser;
    }

    private async getOrg(owner: User): Promise<Org> {
        const foundOrg = await this.repoFactory(Org).findOne({ _name: this.PRIMARY_ORG_NAME });
        return foundOrg === null
            ? createOrg(
                  owner,
                  this.PRIMARY_ORG_NAME,
                  [owner],
                  undefined,
                  undefined,
                  false,
                  false,
                  true,
              )
            : foundOrg;
    }

    private async upsertPlatform(
        config: PlatformConfigOnly,
        tagManagerAccount: TagManagerAccount,
        owner: User,
    ): Promise<Platform> {
        const name = config.name;
        const description = config.name;
        const foundPlatform = await this.repoFactory(Platform).findOne({ _name: name });
        return foundPlatform === null
            ? this.repoFactory(Platform).save(
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
              )
            : foundPlatform;
    }

    private async upsertPlatforms(tagManagerAccount: TagManagerAccount, owner: User) {
        const buildsPath = path.resolve(__dirname, '../../platform-builds');
        const builds = FileSystem.listDirectoryNamesIn(buildsPath);
        builds.map(async (build) => {
            const config = JSON.parse(
                fs.readFileSync(`${buildsPath}/${build}/config.json`, 'utf8'),
            ) as PlatformConfigOnly;
            const platform = await this.upsertPlatform(config, tagManagerAccount, owner);
            const version = `${config.version.major}.${config.version.minor}.${config.version.patch}`;
            if (
                (await this.repoFactory(PlatformRevision).findOne({
                    _platform_id: platform.id,
                    _name: version,
                })) === null
            ) {
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
                        return this.backendStorage.put(
                            await this.config.getGCAssetBucket(),
                            `${revision.platformId.toString()}/${revision.id.toString()}-${fileName}`,
                            fs.readFileSync(`${buildsPath}/${build}/${fileName}`, 'utf8'),
                            {
                                contentType: 'application/javascript',
                            },
                        );
                    }),
                );
            }
        });
    }
}
