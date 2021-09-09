import { FC } from 'react';
import { useQuery } from '@apollo/client';
import { TablePage, TablePageProps } from '../../abstractions/TablePage';
import { TableRowBase } from '../../types/TableRow';
import { DynamicPageProps } from '../../pageLoader/DynamicPageLoader';
import { useRouter } from 'next/router';
import { useLoggedInState } from '../../context/AppContext';
import { extractPermissionsFromOrgUser } from '../../context/OrgUserReducer';
import { PlatformPageData } from '../../gql/generated/PlatformPageData';
import { buildStandardMainInfo, buildTableColumns } from '../../utils/InfoLabelsUtils';
import PagePlatformQuery from '../../gql/queries/PagePlatformQuery';
import { extractBaseColumns } from '../../utils/TableRowUtils';
import { snakeToTitleCase } from '../../utils/TextUtils';
import { pageActions } from '../../actions/PageActions';
import {
    buildAddAction,
    buildEditAction,
    buildFieldAction,
    buildPublishAction,
    buildSelectAction,
} from '../../utils/TableActionsUtils';
import { PlatformType } from '../../gql/generated/globalTypes';
import { toCustomPlatform, toTemplatedPlatform } from '../../utils/NavigationPaths';

export type PlatformTableRow = TableRowBase & {
    name: string;
    type: string;
    isPublic: boolean;
    revisions: number;
};

const PlatformsPage: FC<DynamicPageProps> = (props: DynamicPageProps) => {
    const accountId = props.params.id ?? '';

    const router = useRouter();

    const { orgUserState, loggedInUserState, templateInteractions } = useLoggedInState();
    const { userIsAdmin } = loggedInUserState;
    const { ask } = templateInteractions;
    const currentOrgPermissions = extractPermissionsFromOrgUser(orgUserState);

    const platformPageProps: TablePageProps<PlatformTableRow, PlatformPageData> = {
        title: 'Platforms',
        mainInfoProps: buildStandardMainInfo('platforms'),
        mainQuery: useQuery(PagePlatformQuery, {
            variables: { id: accountId },
        }),
        tableId: 'Platforms',
        entityName: 'Platform',
        columns: buildTableColumns('platforms', [
            { field: 'name' },
            { field: 'id' },
            { field: 'type' },
            { field: 'isPublic', type: 'boolean' },
            { field: 'revisions', type: 'numeric', hidden: true },
            { field: 'updatedAt' },
            { field: 'createdAt' },
        ]),
        mapTableData: (data) =>
            data.getTagManagerAccount.platforms.map((platform): PlatformTableRow => {
                return {
                    ...extractBaseColumns(platform),
                    name: platform.name,
                    type: snakeToTitleCase(platform.type),
                    isPublic: platform.is_public,
                    revisions: platform.platform_revisions.length,
                };
            }),

        buildRowActions: (pageActionProps) => [
            buildEditAction(
                ({ id }) => pageActions.updatePlatform(pageActionProps, id, accountId),
                'Edit Platform',
                () => !currentOrgPermissions.canEdit,
            ),
            buildPublishAction(
                ({ name, id }) =>
                    ask(`Publish Platform: ${name}?`, () => {
                        pageActions.publishPlatform(pageActionProps, id);
                    }),
                `Publish Platform`,
                ({ isPublic }) => !currentOrgPermissions.canEdit || isPublic,
            ),
            buildSelectAction(
                ({ id, type }) =>
                    type === snakeToTitleCase(PlatformType.CUSTOM)
                        ? router.push(toCustomPlatform({ id })).then()
                        : router.push(toTemplatedPlatform({ id })).then(),
                `Select Platform`,
                () => !currentOrgPermissions.canView,
            ),
        ],
        buildFreeActions: (pageActionProps) => [
            buildAddAction(
                () =>
                    userIsAdmin
                        ? pageActions.createPlatform(pageActionProps, accountId)
                        : pageActions.createPlatformNonAdmin(pageActionProps, accountId),
                'Add Platform',
                () => !currentOrgPermissions.canCreate,
            ),
        ],
        buildFieldActions: () => [
            buildFieldAction(
                'name',
                ({ id, type }) =>
                    type === snakeToTitleCase(PlatformType.CUSTOM)
                        ? router.push(toCustomPlatform({ id })).then()
                        : router.push(toTemplatedPlatform({ id })).then(),
                `Select Platform`,
                () => !currentOrgPermissions.canView,
            ),
        ],
    };

    return <TablePage<PlatformTableRow, PlatformPageData> {...platformPageProps} />;
};

export default PlatformsPage;
