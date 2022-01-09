import { FC } from 'react';
import { useQuery } from '@apollo/client';
import { DynamicPageProps } from '../../pageLoader/DynamicPageLoader';
import { TableRowBase } from '../../types/TableRow';
import { useConfigState, useLoggedInState } from '../../context/AppContext';
import { extractPermissionsFromOrgUser } from '../../context/OrgUserReducer';
import { TablePage, TablePageProps } from '../../abstractions/TablePage';
import { AppEnvironmentPageData } from '../../gql/generated/AppEnvironmentPageData';
import PageAppEnvironmentQuery from '../../gql/queries/PageAppEnvironmentQuery';
import { appGroupingCountToSparkData, buildSparkQueryOptions } from '../../utils/SparkDataUtils';
import { Mode } from '../../gql/generated/globalTypes';
import { buildStandardMainInfo, buildTableColumns } from '../../utils/InfoLabelsUtils';
import { extractBaseColumns } from '../../utils/TableRowUtils';
import {
    buildAddAction,
    buildDeleteAction,
    buildEditAction,
    buildEditCustomDomainAction,
    buildEditVariablesAction,
    buildFieldAction,
    buildHistoryAction,
    buildInstallInstructionsAction,
} from '../../utils/TableActionsUtils';
import { pageActions } from '../../actions/PageActions';

export type AppEnvironmentTableRow = TableRowBase & {
    name: string;
    url: string;
    pageViews: number[];
    revision: string;
    customDomain: string;
    installDomain: string;
};

const AppEnvironmentsPage: FC<DynamicPageProps> = (props: DynamicPageProps) => {
    const appId = props.params.id ?? '';

    const { orgUserState, templateInteractions } = useLoggedInState();
    const { mode, isAuditEnabled } = useConfigState();
    const { ask } = templateInteractions;
    const currentOrgPermissions = extractPermissionsFromOrgUser(orgUserState);

    const appEnvironmentsTablePageProps: TablePageProps<
        AppEnvironmentTableRow,
        AppEnvironmentPageData
    > = {
        title: 'Environments',
        mainInfoProps: buildStandardMainInfo('appEnvironments'),
        mainQuery: useQuery(PageAppEnvironmentQuery, {
            variables: { id: appId, appQueryOptions: buildSparkQueryOptions() },
        }),
        tableId: 'AppEnvironments',
        entityName: 'Environment',
        columns: buildTableColumns(
            'appEnvironments',
            mode === Mode.COMMERCIAL
                ? [
                      { field: 'name' },
                      { field: 'id' },
                      { title: 'Page views', field: 'pageViews', type: 'graph' },
                      { title: 'URL', field: 'url', hidden: true },
                      { field: 'customDomain' },
                      { field: 'installDomain' },
                      { field: 'revision' },
                      { field: 'updatedAt' },
                      { field: 'createdAt', hidden: true },
                  ]
                : [
                      { field: 'name' },
                      { field: 'id' },
                      { title: 'Page views', field: 'pageViews', type: 'graph' },
                      { title: 'URL', field: 'url', hidden: true },
                      { field: 'revision' },
                      { field: 'updatedAt' },
                      { field: 'createdAt', hidden: true },
                  ],
        ),
        mapTableData: (data) =>
            data.getApp.environments.map((appEnvironment): AppEnvironmentTableRow => {
                return {
                    ...extractBaseColumns(appEnvironment),
                    name: appEnvironment.name,
                    pageViews: appGroupingCountToSparkData(
                        appEnvironment.event_request_stats.from as number,
                        appEnvironment.event_request_stats.to as number,
                        appEnvironment.event_request_stats.result,
                    ),
                    url: appEnvironment.url ? appEnvironment.url : '-',
                    revision: appEnvironment.revision ? appEnvironment.revision.name : '-',
                    customDomain: appEnvironment.custom_domain
                        ? appEnvironment.custom_domain
                        : 'Create custom domain',
                    installDomain: appEnvironment.install_domain
                        ? appEnvironment.install_domain
                        : '-',
                };
            }),

        buildRowActions: (pageActionProps) => [
            buildHistoryAction(
                ({ id, name }) => pageActions.showAppEnvironmentHistory(pageActionProps, id, name),
                'Environment History',
                () => !currentOrgPermissions.canView,
                () => !isAuditEnabled,
            ),
            buildInstallInstructionsAction(
                ({ id }) => pageActions.installAppEnvironment(pageActionProps, id),
                'Install Environment',
                () => !currentOrgPermissions.canView,
            ),
            buildEditCustomDomainAction(
                ({ id }) => pageActions.editCustomDomainAppEnvironment(pageActionProps, id),
                'Custom Domain',
                () => !currentOrgPermissions.canEdit,
            ),
            buildEditVariablesAction(
                ({ id }) => pageActions.editVariablesAppEnvironment(pageActionProps, id),
                'Environment Variables',
                () => !currentOrgPermissions.canEdit,
            ),
            buildEditAction(
                ({ id }) => pageActions.updateAppEnvironment(pageActionProps, id, appId),
                'Edit Environment',
                () => !currentOrgPermissions.canEdit,
            ),
            buildDeleteAction(
                ({ name, id }) =>
                    ask(`Delete Environment: ${name}?`, () => {
                        pageActions.deleteAppEnvironment(pageActionProps, id);
                    }),
                `Delete Environment`,
                () => !currentOrgPermissions.canDelete,
            ),
        ],
        buildFieldActions: (pageActionProps) => [
            buildFieldAction(
                'name',
                ({ id }) => pageActions.updateAppEnvironment(pageActionProps, id, appId),
                'Edit Environment',
                () => !currentOrgPermissions.canEdit,
            ),
            buildFieldAction(
                'customDomain',
                ({ id }) => pageActions.editCustomDomainAppEnvironment(pageActionProps, id),
                '',
                () => !currentOrgPermissions.canEdit,
            ),
        ],
        buildFreeActions: (pageActionProps) => [
            buildAddAction(
                () =>
                    pageActions.createAppEnvironment(
                        pageActionProps,
                        appId,
                        (id: string, pageRefresh: () => void) => {
                            pageRefresh();
                            pageActions.installAppEnvironment(pageActionProps, id);
                        },
                    ),
                'Add Environment',
                () => !currentOrgPermissions.canCreate,
            ),
        ],
    };

    return (
        <TablePage<AppEnvironmentTableRow, AppEnvironmentPageData>
            {...appEnvironmentsTablePageProps}
        />
    );
};

export default AppEnvironmentsPage;
