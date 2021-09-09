import { FC, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import PageOrgQuery from '../gql/queries/PageOrgQuery';
import { OrgPageData } from '../gql/generated/OrgPageData';
import { buildStandardMainInfo, buildTableColumns } from '../utils/InfoLabelsUtils';
import {
    buildAddAction,
    buildEditAction,
    buildFieldAction,
    buildSelectAction,
} from '../utils/TableActionsUtils';
import { pageActions } from '../actions/PageActions';
import { TableRowBase } from '../types/TableRow';
import { extractBaseColumns } from '../utils/TableRowUtils';
import { SectionKey } from '../containers/SectionsDetails';
import { toOrg } from '../utils/NavigationPaths';
import { useLoggedInState } from '../context/AppContext';
import { useRouter } from 'next/router';
import { TablePage, TablePageProps } from '../abstractions/TablePage';
import { DynamicPageProps } from '../pageLoader/DynamicPageLoader';

export type OrgTableRow = TableRowBase & {
    name: string;
    users: number;
};

const OrgsPage: FC<DynamicPageProps> = () => {
    const { templateInteractions } = useLoggedInState();

    const { dispatchSectionAction } = templateInteractions;

    const router = useRouter();

    useEffect(() => {
        dispatchSectionAction({
            type: 'section',
            payload: SectionKey.orgSelect,
        });
    }, []);

    // There is no current org, the user can do all actions
    const currentOrgPermissions = {
        canView: true,
        canCreate: true,
        canEdit: true,
        canDelete: true,
        isAdmin: true,
    };

    const orgTablePageProps: TablePageProps<OrgTableRow, OrgPageData> = {
        title: 'Organizations',
        mainInfoProps: buildStandardMainInfo('organizations'),
        mainQuery: useQuery(PageOrgQuery, {
            fetchPolicy: 'no-cache',
        }),
        tableId: 'Orgs',
        entityName: 'Organization',
        columns: buildTableColumns('organizations', [
            { field: 'name', hidden: false },
            { field: 'id', hidden: false },
            { field: 'users', type: 'numeric', hidden: true },
            { field: 'updatedAt', hidden: true },
            { field: 'createdAt', hidden: false },
        ]),
        mapTableData: (data) =>
            data.me.orgs.map((org): OrgTableRow => {
                return {
                    ...extractBaseColumns(org),
                    name: org.name,
                    users: org.users.length,
                };
            }),
        buildRowActions: (pageActionProps) => [
            buildEditAction(
                ({ id }) => pageActions.updateOrganization(pageActionProps, id),
                'Edit Organization',
                () => !currentOrgPermissions.canEdit,
            ),
            buildSelectAction(
                ({ id }) => {
                    router.push(toOrg({ id })).then();
                },
                `Select Organization`,
                () => !currentOrgPermissions.canView,
            ),
        ],
        buildFreeActions: (pageActionProps) => [
            buildAddAction(
                () => pageActions.createOrganization(pageActionProps),
                'Add Organization',
                () => !currentOrgPermissions.canCreate,
            ),
        ],
        buildFieldActions: () => [
            buildFieldAction(
                'name',
                ({ id }) => {
                    router.push(toOrg({ id })).then();
                },
                `Select Organization`,
                () => !currentOrgPermissions.canView,
            ),
        ],
    };

    return <TablePage<OrgTableRow, OrgPageData> {...orgTablePageProps} />;
};

export default OrgsPage;
