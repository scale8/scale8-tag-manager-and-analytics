import { PlatformEventCreateData } from '../../../../../common/types/Types';
import { find } from '../../../../../common/lib/util/ObjectSearch';

export const inViewChecker = (data: PlatformEventCreateData, elm: HTMLElement): void => {
    const minimumTimeInView = find(data.props, 'minimum_time_in_view') || 0;
    const threshold = parseInt(find(data.props, 'in_view_percentage')) / 100;
    if (elm !== null && typeof IntersectionObserver !== undefined) {
        //we can use the interaction observer to speed things up :)
        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries.every((entry) => entry.intersectionRatio >= threshold);
                if (visible) {
                    if (minimumTimeInView > 0) {
                        if (data.state.timeoutId === undefined) {
                            data.state.held = false;
                            data.state.timeoutId = setTimeout(() => {
                                delete data.state.timeoutId;
                                data.state.held = true;
                                data.trigger();
                            }, minimumTimeInView);
                        }
                    } else {
                        data.state.held = true; //nothing to hold for...
                    }
                } else {
                    //cancel any previous timeouts
                    if (data.state.timeoutId !== undefined) {
                        clearTimeout(data.state.timeoutId);
                    }
                    delete data.state.timeoutId;
                }
                data.state.visible = visible;
                data.trigger();
            },
            {
                root: null,
                threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
            },
        );
        observer.observe(elm);
    }
};
