import registerPlatformSpec from '../../../common/RegisterPlatform';
import { S8Config } from './core/types/Types';
import Context from './core/lib/Context';
import Logger from '../../../common/lib/util/Logger';
import Loader from '../../../common/lib/util/Loader';
import DebugLoader from './core/debug/DebugLoader';
import UserDebugMode from './core/lib/UserDebugMode';
import AppState from './core/lib/AppState';
import ActionRunner from './core/lib/ActionRunner';
import ActionInterpreterLoader from './core/interpreter/ActionInterpreterLoader';
import EventTracking from './core/lib/EventTracking';
import DOM from '../../../common/lib/util/DOM';
import DOMObserver from './core/lib/DOMObserver';
import DB from './core/config/DB';
import Collection from './core/config/Collection';
import {
    Platform,
    PlatformAction,
    PlatformActionPermission,
    PlatformDataContainer,
    PlatformRevision,
} from './core/config/ModelTypes';
import PlatformEventRegister from './core/lib/PlatformEventRegister';
import PlatformDataContainerRegister from './core/lib/PlatformDataContainerRegister';
import PlatformActionRegister from './core/lib/PlatformActionRegister';
import PlatformRegister from './core/lib/PlatformRegister';
import TagManager from './core/lib/TagManager';
import RevisionStatusManager from './core/debug/RevisionStatusManager';
import { getTopWindow } from '../../../common/lib/util/WindowElement';
import { PlatformType } from '../../../common/enums/Enums';
import scale8Spec from './platform/Scale8Spec';

declare const S8_CONFIG_REPLACE: S8Config;

export class S8 {
    public constructor(conf: S8Config) {
        DB.load(conf);
        DOM.initReadyChecks();
        DOM.isReady(() => DOMObserver.init());

        Context.setContext(
            conf.envId,
            conf.envVars,
            conf.appId,
            conf.revisionId,
            conf.corePlatformId,
            conf.countryCode,
            conf.subdivisionCodes,
            conf.server,
            conf.serverMode,
            conf.distributionValue,
            conf.uiServer,
            conf.ingestEndpointEnvironments,
            conf.preview,
        );

        //listen for errors...
        getTopWindow().addEventListener('error', (event) => EventTracking.trackError(event), false);

        const pageUpdateListener = (track = true) => {
            AppState.refreshData();
            if (track) {
                EventTracking.track('page-view').then(() => Logger.debug('Tracked page-view'));
            }
        };

        const oldPushState = history.pushState;
        history.pushState = function () {
            // eslint-disable-next-line prefer-rest-params,@typescript-eslint/ban-ts-comment
            // @ts-ignore
            // eslint-disable-next-line prefer-rest-params
            const applied = oldPushState.apply(this, arguments);
            pageUpdateListener(Context.trackUrlChange());
            return applied;
        };
        const oldReplaceState = history.replaceState;
        history.replaceState = function () {
            // eslint-disable-next-line prefer-rest-params,@typescript-eslint/ban-ts-comment
            // @ts-ignore
            // eslint-disable-next-line prefer-rest-params
            const applied = oldReplaceState.apply(this, arguments);
            pageUpdateListener(Context.trackUrlChange());
            return applied;
        };
        getTopWindow().addEventListener(
            'popstate',
            () => pageUpdateListener(Context.trackUrlChange()),
            false,
        );
        getTopWindow().addEventListener(
            'hashchange',
            () => pageUpdateListener(Context.trackHashChange()),
            false,
        );

        //register all events...
        (scale8Spec.events || []).forEach((event) => {
            PlatformEventRegister.registerEvent(
                Context.getPlatformId(),
                event.persistence_id,
                event.create,
                event.test,
                event.reset,
            );
        });

        //register all data layers...
        (scale8Spec.data_containers || []).forEach((layer) => {
            PlatformDataContainerRegister.registerDataContainer(
                Context.getPlatformId(),
                layer.persistence_id,
                layer.dump,
                layer.get,
                layer.change,
            );
        });

        //register all action...
        (scale8Spec.actions || []).forEach((action) => {
            PlatformActionRegister.registerAction(
                Context.getPlatformId(),
                action.persistence_id,
                action.run,
            );
        });

        //before we start monitoring tags, lets make sure we have all the library deps down...
        const customPlatforms = Collection.find<PlatformRevision>('PlatformRevision')
            .filter((_) => {
                const platform = Collection.findByIdThrows<Platform>('Platform', _._platform_id);
                return platform._type === PlatformType.CUSTOM && !platform._is_core;
            })
            .map((_) =>
                typeof Context.getPreview() === 'string'
                    ? `${Context.getServer()}/p/${_._platform_id}/${Context.getPreview()}`
                    : `${Context.getServer()}/d/${_._platform_id}`,
            );

        if (customPlatforms.length > 0) {
            customPlatforms.forEach((_) => Loader.loadJS(_, window));
            //we need to make sure everything that has been promised has been loaded...
            PlatformRegister.monitor();
        }

        //for templated platforms, we need to register the actions dynamically...
        Collection.find<PlatformRevision>('PlatformRevision')
            .filter((_) => {
                const platform = Collection.findByIdThrows<Platform>('Platform', _._platform_id);
                return platform._type === PlatformType.TEMPLATED;
            })
            .forEach((_) => {
                //get actions
                Collection.findByIds<PlatformAction>(
                    'PlatformAction',
                    _._platform_action_ids,
                ).forEach((platformAction) => {
                    //we need to register this action...

                    PlatformActionRegister.registerAction(
                        platformAction._platform_id.id,
                        platformAction.___persisting_id,
                        (data, log, err) => {
                            return new Promise((resolve, reject) => {
                                if (platformAction._exec_raw_in_iframe) {
                                    ActionRunner.create(
                                        platformAction._code || '',
                                        data.props,
                                        () => resolve(),
                                        () => reject(),
                                        (msg) => log(msg),
                                        (msg) => err(msg),
                                    );
                                } else {
                                    ActionInterpreterLoader.load().then((actionInterpreter) => {
                                        actionInterpreter
                                            .create(
                                                platformAction._code || '',
                                                Collection.findByIds<PlatformActionPermission>(
                                                    'PlatformActionPermission',
                                                    platformAction._platform_action_permission_ids,
                                                ),
                                                data.props,
                                                () => resolve(),
                                                () => reject(),
                                                (msg) => log(msg),
                                                (msg) => err(msg),
                                            )
                                            .runAll(
                                                (e: any) => {
                                                    if (e instanceof Error) {
                                                        err(e.message);
                                                        reject(e.message);
                                                    } else if (typeof e === 'string') {
                                                        err(e);
                                                        reject(e);
                                                    } else {
                                                        const errorMessage =
                                                            'Something has gone wrong';
                                                        err(errorMessage);
                                                        reject(errorMessage);
                                                    }
                                                },
                                                () =>
                                                    log(
                                                        `${platformAction._id.id} completed execution, waiting for success() to be called`,
                                                    ),
                                            );
                                    });
                                }
                            });
                        },
                    );
                });
            });

        PlatformRegister.ready().then(() => {
            Logger.debug('Monitoring Page');
            TagManager.autoLoadTags();
            TagManager.monitorPage();
        });

        if (UserDebugMode.isEnabled()) {
            Logger.debug('Debug Is Enabled');

            setInterval(() => {
                Array.from(
                    PlatformDataContainerRegister.getPlatformDataContainers().entries(),
                ).forEach((registeredPlatform) => {
                    const [, layers] = registeredPlatform;
                    Array.from(layers.entries()).forEach((registeredPlatformLayer) => {
                        const [id, layer] = registeredPlatformLayer;
                        const platformDataContainer =
                            Collection.findOneThrows<PlatformDataContainer>(
                                'PlatformDataContainer',
                                {
                                    ___persisting_id: id,
                                },
                            );
                        const data = layer.dump({});
                        if (typeof data === 'object') {
                            RevisionStatusManager.updateVarStatus(
                                platformDataContainer._id.id,
                                id,
                                data,
                            );
                        }
                    });
                });
            }, 100);

            DebugLoader.load().then(() => {
                Logger.debug('Entering User Debug Mode');
            });
        }
    }
}

registerPlatformSpec(scale8Spec);
new S8(S8_CONFIG_REPLACE);
