import {
    buildDeployAction,
    buildDuplicateAction,
    buildFinalizeAndDeployAction,
    buildPreviewAction,
} from './TableActionsUtils';
import { PageActionProps, pageActions } from '../actions/PageActions';
import { RowAction } from '../components/molecules/S8Table/S8TableTypes';
import { Dispatch, SetStateAction } from 'react';
import { DialogAction } from '../context/DialogReducer';
import { CurrentOrgPermissions } from '../context/OrgUserReducer';
import { SectionKey } from '../containers/SectionsDetails';
import { SectionHistory } from '../context/SectionHistoryReducer';
import { appRevisionFromPath, toAppRevision } from './NavigationPaths';
import { NextRouter } from 'next/router';

export const buildAppRevisionBreadcrumbActions = (
    revisionId: string,
    revisionName: string,
    router: NextRouter,
    currentOrgPermissions: CurrentOrgPermissions,
    dispatchDialogAction: Dispatch<DialogAction>,
    setRefreshCurrentPage: Dispatch<SetStateAction<boolean>>,
    ask: (text: string, confirmHandler: () => void) => void,
    revisionLocked: boolean,
    sectionHistory: SectionHistory,
): RowAction<any>[] => {
    const pageActionProps: PageActionProps = {
        dispatchDialogAction,
        refresh: () => {
            // no need to refresh
        },
    };

    const pageActionPropsRefresh: PageActionProps = {
        dispatchDialogAction,
        refresh: () => {
            setRefreshCurrentPage(true);
        },
    };

    const revisionPath =
        sectionHistory.current?.section === SectionKey.appRevision
            ? sectionHistory.current?.page
            : undefined;

    return [
        buildPreviewAction(
            () => pageActions.previewAppRevision(pageActionProps, revisionId),
            'Revision Preview',
            () => !currentOrgPermissions.canView,
        ),
        buildDuplicateAction(
            () =>
                pageActions.duplicateAppRevision(
                    pageActionProps,
                    revisionId,
                    (
                        id: string,
                        pageRefresh: () => void,
                        handleDialogClose: (checkChanges: boolean) => void,
                    ) => {
                        handleDialogClose(false);
                        router
                            .push(toAppRevision({ id }, appRevisionFromPath(revisionPath)))
                            .then();
                    },
                ),
            `Duplicate Revision`,
            () => !currentOrgPermissions.canCreate,
        ),
        revisionLocked
            ? buildDeployAction(
                  () => pageActions.deployRevision(pageActionProps, revisionId),
                  `Deploy Revision`,
                  () => !currentOrgPermissions.canEdit,
              )
            : buildFinalizeAndDeployAction(
                  () =>
                      ask(`Finalise and Deploy Revision: ${revisionName}?`, () => {
                          pageActions.finaliseAndDeployAppRevision(
                              pageActionPropsRefresh,
                              revisionId,
                              (id: string, pageRefresh: () => void) => {
                                  pageRefresh();
                                  pageActions.deployRevision(pageActionProps, id);
                              },
                          );
                      }),

                  `Finalize and Deploy Revision`,
                  () => !currentOrgPermissions.canEdit,
              ),
    ];
};
