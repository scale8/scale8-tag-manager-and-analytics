import Collection from '../config/Collection';
import { PlatformAction, PlatformDataContainer, PlatformEvent } from '../config/ModelTypes';
import PlatformActionRegister from './PlatformActionRegister';
import PlatformDataContainerRegister from './PlatformDataContainerRegister';
import Scheduler from './Scheduler';
import PlatformEventRegister from './PlatformEventRegister';
import { PlatformSpec } from '../../../../../../common/interfaces/PlatformSpec';
import { getTopWindow } from '../../../../../common/lib/util/WindowElement';

export default class PlatformRegister {
    public static isReady(): boolean {
        const areAllActionsRegistered = Collection.find<PlatformAction>('PlatformAction').every(
            (_) => PlatformActionRegister.isActionRegistered(_._platform_id.id, _.___persisting_id),
        );
        const areAllDataContainersRegistered = Collection.find<PlatformDataContainer>(
            'PlatformDataContainer',
        ).every((_) =>
            PlatformDataContainerRegister.isDataContainerRegistered(
                _._platform_id.id,
                _.___persisting_id,
            ),
        );
        const areAllEventsRegistered = Collection.find<PlatformEvent>('PlatformEvent').every((_) =>
            PlatformEventRegister.isEventRegistered(_._platform_id.id, _.___persisting_id),
        );
        return areAllActionsRegistered && areAllDataContainersRegistered && areAllEventsRegistered;
    }

    public static ready(): Promise<void> {
        return new Promise((resolve) => {
            const checkReadyState = () => {
                if (this.isReady()) {
                    Scheduler.cancel('monitor-platforms');
                    resolve();
                } else {
                    setTimeout(() => checkReadyState(), 100);
                }
            };
            checkReadyState();
        });
    }

    public static monitor(): void {
        const topWindow = getTopWindow();

        const check = () => {
            if (Array.isArray((topWindow as any).___S8_API)) {
                while ((topWindow as any).___S8_API.length > 0) {
                    const apiRequest = (topWindow as any).___S8_API.pop();
                    if (apiRequest.hasOwnProperty('register')) {
                        //this is a platform registration request...
                        const platformId = apiRequest.register.platformId as string;
                        const spec = apiRequest.register.platformSpec as PlatformSpec;
                        //register all events...
                        (spec.events || []).forEach((event) => {
                            PlatformEventRegister.registerEvent(
                                platformId,
                                event.persistence_id,
                                event.create,
                                event.test,
                                event.reset,
                            );
                        });
                        //register all data layers...
                        (spec.data_containers || []).forEach((layer) => {
                            PlatformDataContainerRegister.registerDataContainer(
                                platformId,
                                layer.persistence_id,
                                layer.dump,
                                layer.get,
                                layer.change,
                            );
                        });
                        //register all action...
                        (spec.actions || []).forEach((action) => {
                            PlatformActionRegister.registerAction(
                                platformId,
                                action.persistence_id,
                                action.run,
                            );
                        });
                    }
                }
            }
        };
        Scheduler.add('monitor-platforms', check, 100, true);
    }
}
