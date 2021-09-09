import { FC } from 'react';
import { useQuery } from '@apollo/client';
import { DynamicPageProps } from '../../pageLoader/DynamicPageLoader';
import { useLoggedInState } from '../../context/AppContext';
import { TableRowBase } from '../../types/TableRow';
import { extractPermissionsFromOrgUser } from '../../context/OrgUserReducer';
import { TablePage, TablePageProps } from '../../abstractions/TablePage';
import { AppPlatformPageData } from '../../gql/generated/AppPlatformPageData';
import { buildStandardMainInfo, buildTableColumns } from '../../utils/InfoLabelsUtils';
import PageAppPlatformQuery from '../../gql/queries/PageAppPlatformQuery';
import { extractBaseColumns } from '../../utils/TableRowUtils';
import { buildAddAction } from '../../utils/TableActionsUtils';
import { pageActions } from '../../actions/PageActions';

export type AppPlatformTableRow = TableRowBase & {
    name: string;
};

const AppPlatformsPage: FC<DynamicPageProps> = (props: DynamicPageProps) => {
    const appId = props.params.id ?? '';

    const { orgUserState } = useLoggedInState();
    const currentOrgPermissions = extractPermissionsFromOrgUser(orgUserState);

    const appPlatformsTablePageProps: TablePageProps<AppPlatformTableRow, AppPlatformPageData> = {
        title: 'Platforms',
        mainInfoProps: buildStandardMainInfo('appPlatforms'),
        mainQuery: useQuery(PageAppPlatformQuery, {
            variables: { id: appId },
        }),
        tableId: 'AppPlatforms',
        entityName: 'Platform',
        columns: buildTableColumns('appPlatforms', [
            { field: 'name' },
            { field: 'id' },
            { field: 'updatedAt' },
            { field: 'createdAt' },
        ]),
        mapTableData: (data) =>
            data.getApp.app_platforms.map((appPlatform): AppPlatformTableRow => {
                const platform = appPlatform.platform;
                return {
                    ...extractBaseColumns(platform),
                    name: platform.name,
                };
            }),
        buildFreeActions: (pageActionProps) => [
            buildAddAction(
                () => pageActions.installAppPlatform(pageActionProps, appId),
                'Install Platform',
                () => !currentOrgPermissions.canCreate,
            ),
        ],
    };

    return <TablePage<AppPlatformTableRow, AppPlatformPageData> {...appPlatformsTablePageProps} />;
};

export default AppPlatformsPage;
