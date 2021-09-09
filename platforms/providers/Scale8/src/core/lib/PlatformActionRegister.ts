import Logger from '../../../../../common/lib/util/Logger';
import Collection from '../config/Collection';
import { PlatformActionData } from '../../../../../common/types/Types';

type ActionFunction = (
    data: PlatformActionData,
    log: (msg: string) => void,
    err: (msg: string) => void,
) => Promise<void> | void;

export default class PlatformActionRegister {
    public static readonly platformActions: Map<string, Map<string, ActionFunction>> = new Map();

    public static registerAction(
        platformId: string,
        persistingId: string,
        action: ActionFunction,
    ): void {
        const platformAction = Collection.findOne('PlatformAction', {
            _platform_id: platformId,
            ___persisting_id: persistingId,
        });
        if (platformAction === undefined) {
            Logger.info(
                `Unable to find PlatformAction and register ${persistingId} against platform ${platformId}. This suggests the action is not in use`,
            );
        } else {
            const actions =
                this.platformActions.get(platformId) || new Map<string, ActionFunction>();
            actions.set(persistingId, action);
            this.platformActions.set(platformId, actions);
        }
    }

    public static isActionRegistered(platformId: string, persistingId: string): boolean {
        const platformActions = this.platformActions.get(platformId);
        return platformActions === undefined
            ? false
            : platformActions.get(persistingId) !== undefined;
    }

    public static getAction(platformId: string, persistingId: string): ActionFunction {
        const platformActions = this.platformActions.get(platformId);
        if (platformActions === undefined) {
            throw new Error('Failed to find platform...');
        } else {
            const action = platformActions.get(persistingId);
            if (action === undefined) {
                throw new Error('Failed to find platform action...');
            } else {
                return action;
            }
        }
    }
}
