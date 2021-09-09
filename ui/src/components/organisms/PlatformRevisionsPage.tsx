import { FC } from 'react';
import { useQuery } from '@apollo/client';
import { TablePage, TablePageProps } from '../../abstractions/TablePage';
import { TableRowBase } from '../../types/TableRow';
import { PlatformType } from '../../gql/generated/globalTypes';
import { DynamicPageProps } from '../../pageLoader/DynamicPageLoader';
import { useRouter } from 'next/router';
import { useLoggedInState } from '../../context/AppContext';
import { extractPermissionsFromOrgUser } from '../../context/OrgUserReducer';
import { PlatformRevisionPageData } from '../../gql/generated/PlatformRevisionPageData';
import { buildStandardMainInfo, buildTableColumns } from '../../utils/InfoLabelsUtils';
import PagePlatformRevisionQuery from '../../gql/queries/PagePlatformRevisionQuery';
import { extractBaseColumns } from '../../utils/TableRowUtils';
import {
    buildCompareAction,
    buildDuplicateAction,
    buildEditAction,
    buildFieldAction,
    buildPublishAction,
    buildSelectAction,
} from '../../utils/TableActionsUtils';
import { pageActions } from '../../actions/PageActions';
import { toCustomPlatformRevision, toTemplatedPlatformRevision } from '../../utils/NavigationPaths';

export type PlatformRevisionTableRow = TableRowBase & {
    name: string;
    locked: boolean;
    isPublished: boolean;
};

type PlatformRevisionsPageProps = DynamicPageProps & {
    type: PlatformType;
};

const PlatformRevisionsPage: FC<PlatformRevisionsPageProps> = (
    props: PlatformRevisionsPageProps,
) => {
    const platformId = props.params.id ?? '';

    const { type } = props;

    const router = useRouter();
    const { orgUserState, templateInteractions } = useLoggedInState();
    const { ask } = templateInteractions;
    const currentOrgPermissions = extractPermissionsFromOrgUser(orgUserState);

    const platformRevisionPageProps: TablePageProps<
        PlatformRevisionTableRow,
        PlatformRevisionPageData
    > = {
        title: 'Platform Revisions',
        mainInfoProps: buildStandardMainInfo('platformRevisions'),
        mainQuery: useQuery<PlatformRevisionPageData>(PagePlatformRevisionQuery, {
            variables: { id: platformId },
        }),
        tableId: 'PlatformRevisions',
        entityName: 'Revision',
        columns: buildTableColumns('platformRevisions', [
            { field: 'name' },
            { field: 'id' },
            { field: 'locked', type: 'boolean' },
            { field: 'isPublished', type: 'boolean' },
            { field: 'updatedAt' },
            { field: 'createdAt' },
        ]),
        mapTableData: (data) =>
            data.getPlatform.platform_revisions.map(
                (platformRevision): PlatformRevisionTableRow => {
                    return {
                        ...extractBaseColumns(platformRevision),
                        name: platformRevision.name,
                        locked: platformRevision.locked,
                        isPublished: platformRevision.is_published,
                    };
                },
            ),

        buildRowActions: (pageActionProps) => [
            ...(type === PlatformType.CUSTOM
                ? []
                : [
                      buildEditAction(
                          ({ id }) => pageActions.updatePlatformRevision(pageActionProps, id),
                          'Edit Revision',
                          () => !currentOrgPermissions.canEdit,
                      ),
                      buildDuplicateAction(
                          ({ id }) =>
                              pageActions.duplicatePlatformRevision(
                                  pageActionProps,
                                  id,
                                  (
                                      id: string,
                                      pageRefresh: () => void,
                                      handleDialogClose: (checkChanges: boolean) => void,
                                  ) => {
                                      handleDialogClose(false);
                                      pageRefresh();
                                  },
                              ),
                          `Duplicate Revision`,
                          () => !currentOrgPermissions.canCreate,
                      ),
                  ]),
            buildPublishAction(
                ({ name, id }) =>
                    ask(`Publish Revision: ${name}?`, () => {
                        pageActions.publishPlatformRevision(pageActionProps, id);
                    }),
                `Publish Revision`,
                ({ isPublished }) => !currentOrgPermissions.canEdit || isPublished,
            ),
            buildSelectAction(
                ({ id }) =>
                    type === PlatformType.CUSTOM
                        ? router.push(toCustomPlatformRevision({ id })).then()
                        : router.push(toTemplatedPlatformRevision({ id })).then(),
                `Select Revision`,
                () => !currentOrgPermissions.canView,
            ),
        ],
        buildFieldActions: () => [
            buildFieldAction(
                'name',
                ({ id }) =>
                    type === PlatformType.CUSTOM
                        ? router.push(toCustomPlatformRevision({ id })).then()
                        : router.push(toTemplatedPlatformRevision({ id })).then(),
                `Select Revision`,
                () => !currentOrgPermissions.canView,
            ),
        ],
        buildCoupleActions: (pageActionProps) => [
            buildCompareAction((leftId: string, rightId: string) => {
                pageActions.comparePlatformRevisions(pageActionProps, leftId, rightId);
            }, `Compare Revisions`),
        ],
    };

    return (
        <TablePage<PlatformRevisionTableRow, PlatformRevisionPageData>
            {...platformRevisionPageProps}
        />
    );
};

export default PlatformRevisionsPage;
