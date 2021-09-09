import { TagCode } from '../../types/Types';
import { getTopWindow } from './WindowElement';

export const getByTagCode = (tagCode: TagCode): HTMLElement => {
    const tagElement: HTMLElement | null = getTopWindow().document.querySelector(
        `[data-s8][data-code="${tagCode.code}"][data-index="${tagCode.index}"]`,
    );
    if (tagElement === null) {
        throw new Error(`Failed to find tag ${tagCode.code}@${tagCode.index}`);
    } else {
        return tagElement;
    }
};
