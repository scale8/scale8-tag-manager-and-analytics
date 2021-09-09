import { PageActionProps } from './PageActions';
import { launchHidden, openWideDrawer, openWideDrawerContextOnly } from '../utils/PageActionUtils';
import { TemplatedActionCreate } from '../dialogPages/tagManager/platform/TemplatedActionCreate';
import { TemplatedActionUpdate } from '../dialogPages/tagManager/platform/TemplatedActionUpdate';
import { TemplatedActionDelete } from '../dialogPages/tagManager/platform/TemplatedActionDelete';

const templatedActionActions = {
    createTemplatedAction: (pageActionProps: PageActionProps, revisionId: string): void => {
        openWideDrawerContextOnly(pageActionProps, TemplatedActionCreate, revisionId);
    },
    updateTemplatedAction: (pageActionProps: PageActionProps, id: string): void => {
        openWideDrawer(pageActionProps, TemplatedActionUpdate, id);
    },
    inspectTemplatedAction: (pageActionProps: PageActionProps, id: string): void => {
        openWideDrawer(
            pageActionProps,
            TemplatedActionUpdate,
            id,
            true,
            false,
            undefined,
            undefined,
            undefined,
            true,
        );
    },
    deleteTemplatedAction: (pageActionProps: PageActionProps, id: string): void => {
        launchHidden(pageActionProps, TemplatedActionDelete, id);
    },
};

export { templatedActionActions };
