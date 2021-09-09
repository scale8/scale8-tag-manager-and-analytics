import { PageActionProps } from './PageActions';
import {
    openDrawer,
    openDrawerContextOnly,
    openInfo,
    openLightbox,
    openLightboxNoRefresh,
} from '../utils/PageActionUtils';
import { TagCreate } from '../dialogPages/tagManager/app/tag/TagCreate';
import { TagInstallInstructions } from '../dialogPages/tagManager/app/tag/TagInstallInstructions';
import { TagUpdate } from '../dialogPages/tagManager/app/tag/TagUpdate';
import { TagDuplicate } from '../dialogPages/tagManager/app/tag/TagDuplicate';
import { TagDelete } from '../dialogPages/tagManager/app/tag/TagDelete';
import { TagHistory } from '../dialogPages/tagManager/app/tag/TagHistory';

const tagActions = {
    createTag: (
        pageActionProps: PageActionProps,
        revisionId: string,
        followUp: (
            id: string,
            pageRefresh: () => void,
            handleDialogClose: (checkChanges: boolean) => void,
        ) => void,
    ): void => {
        openDrawerContextOnly(
            pageActionProps,
            TagCreate,
            revisionId,
            true,
            false,
            undefined,
            followUp,
        );
    },
    installTag: (pageActionProps: PageActionProps, id: string): void => {
        openLightboxNoRefresh(pageActionProps, TagInstallInstructions, id);
    },
    updateTag: (pageActionProps: PageActionProps, id: string): void => {
        openDrawer(pageActionProps, TagUpdate, id);
    },
    duplicateTag: (pageActionProps: PageActionProps, id: string): void => {
        openLightbox(pageActionProps, TagDuplicate, id);
    },
    deleteTag: (pageActionProps: PageActionProps, id: string): void => {
        openLightbox(pageActionProps, TagDelete, id, true, true);
    },
    showTagHistory: (pageActionProps: PageActionProps, id: string, name: string): void => {
        openInfo(pageActionProps, TagHistory, id, name);
    },
};

export { tagActions };
