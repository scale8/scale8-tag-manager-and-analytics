import { PageActionProps } from './PageActions';
import {
    openDrawer,
    openDrawerContextOnly,
    openInfo,
    openLightbox,
    openLightboxNoRefresh,
} from '../utils/PageActionUtils';
import dynamic from 'next/dynamic';
import { FC } from 'react';
import { DialogPageProps } from '../types/DialogTypes';

const TagCreate = dynamic(
    () => import('../dialogPages/tagManager/app/tag/TagCreate'),
) as FC<DialogPageProps>;

const TagInstallInstructions = dynamic(
    () => import('../dialogPages/tagManager/app/tag/TagInstallInstructions'),
) as FC<DialogPageProps>;

const TagUpdate = dynamic(
    () => import('../dialogPages/tagManager/app/tag/TagUpdate'),
) as FC<DialogPageProps>;

const TagDuplicate = dynamic(
    () => import('../dialogPages/tagManager/app/tag/TagDuplicate'),
) as FC<DialogPageProps>;

const TagDelete = dynamic(
    () => import('../dialogPages/tagManager/app/tag/TagDelete'),
) as FC<DialogPageProps>;

const TagHistory = dynamic(
    () => import('../dialogPages/tagManager/app/tag/TagHistory'),
) as FC<DialogPageProps>;

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
