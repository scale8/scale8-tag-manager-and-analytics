import { FC } from 'react';
import { useQuery } from '@apollo/client';
import { TableRowBase } from '../../types/TableRow';
import { TagPageData } from '../../gql/generated/TagPageData';
import { TablePage, TablePageProps } from '../../abstractions/TablePage';
import { toAppRevision, toTag } from '../../utils/NavigationPaths';
import { PageActionProps, pageActions } from '../../actions/PageActions';
import { DynamicPageProps } from '../../pageLoader/DynamicPageLoader';
import {
    buildAddAction,
    buildDeleteAction,
    buildDuplicateAction,
    buildEditAction,
    buildFieldAction,
    buildHistoryAction,
    buildInstallInstructionsAction,
    buildSelectAction,
} from '../../utils/TableActionsUtils';
import { useRouter } from 'next/router';
import { useConfigState, useLoggedInState } from '../../context/AppContext';
import { extractPermissionsFromOrgUser } from '../../context/OrgUserReducer';
import PageTagQuery from '../../gql/queries/PageTagQuery';
import { buildStandardMainInfo, buildTableColumns } from '../../utils/InfoLabelsUtils';
import { extractBaseColumns } from '../../utils/TableRowUtils';
import { TagType } from '../../gql/generated/globalTypes';

export type TagTableRow = TableRowBase & {
    tagCode: string;
    name: string;
    type: string;
    autoLoad: boolean;
    ruleGroups: number;
    height: string;
    width: string;
};

const TagsPage: FC<DynamicPageProps> = (props: DynamicPageProps) => {
    const revisionId = props.params.id ?? '';

    const router = useRouter();
    const { isAuditEnabled } = useConfigState();
    const { templateInteractions, orgUserState } = useLoggedInState();
    const { dispatchDialogAction } = templateInteractions;
    const currentOrgPermissions = extractPermissionsFromOrgUser(orgUserState);

    const pageActionProps: PageActionProps = {
        dispatchDialogAction,
    };

    const orgTablePageProps: TablePageProps<TagTableRow, TagPageData> = {
        title: 'Tags',
        mainQuery: useQuery(PageTagQuery, {
            variables: { id: revisionId },
            notifyOnNetworkStatusChange: true,
        }),
        tableId: 'Tags',
        entityName: 'Tag',
        mainInfoProps: buildStandardMainInfo('tags'),
        columns: buildTableColumns('tags', [
            { field: 'name' },
            { field: 'id' },
            { title: 'Code', field: 'tagCode' },
            { field: 'type' },
            { field: 'width' },
            { field: 'height' },
            { field: 'autoLoad', type: 'boolean' },
            { field: 'ruleGroups', type: 'numeric', hidden: true },
            { field: 'updatedAt' },
            { field: 'createdAt' },
        ]),
        mapTableData: (data) =>
            data.getRevision.tags.map((tag): TagTableRow => {
                return {
                    ...extractBaseColumns(tag),
                    name: tag.name,
                    tagCode: tag.tag_code,
                    type: tag.type.charAt(0).toUpperCase() + tag.type.slice(1).toLowerCase(),
                    ruleGroups: tag.rule_groups.length,
                    height:
                        tag.type === TagType.HEAD || tag.height === null
                            ? '-'
                            : tag.height.toString(),
                    width:
                        tag.type === TagType.HEAD || tag.width === null
                            ? '-'
                            : tag.width.toString(),
                    autoLoad: tag.auto_load,
                };
            }),

        buildRowActions: (pageActionProps) => [
            buildInstallInstructionsAction(
                ({ id }) => pageActions.installTag(pageActionProps, id),
                'Install Tag',
                () => !currentOrgPermissions.canView,
            ),
            buildHistoryAction(
                ({ id, name }) => pageActions.showTagHistory(pageActionProps, id, name),
                'Tag History',
                () => !currentOrgPermissions.canView,
                () => !isAuditEnabled,
            ),
            buildEditAction(
                ({ id }) => pageActions.updateTag(pageActionProps, id),
                'Edit Tag',
                () => !currentOrgPermissions.canEdit,
            ),
            buildDuplicateAction(
                ({ id }) => pageActions.duplicateTag(pageActionProps, id),
                `Duplicate Tag`,
                () => !currentOrgPermissions.canCreate,
            ),
            buildDeleteAction(
                ({ id }) => pageActions.deleteTag(pageActionProps, id),
                `Delete Tag`,
                () => !currentOrgPermissions.canDelete,
            ),
            buildSelectAction(
                ({ id }) => router.push(toTag({ id })).then(),
                `Select Tag`,
                () => !currentOrgPermissions.canView,
            ),
        ],

        buildFreeActions: (pageActionProps) => [
            buildAddAction(
                () =>
                    pageActions.createTag(
                        pageActionProps,
                        revisionId,
                        (id: string, pageRefresh: () => void) => {
                            pageRefresh();
                            pageActions.installTag(pageActionProps, id);
                        },
                    ),
                'Add Tag',
                () => !currentOrgPermissions.canCreate,
            ),
        ],
        buildFieldActions: () => [
            buildFieldAction(
                'name',
                ({ id }) => router.push(toTag({ id })).then(),
                `Select Tag`,
                () => !currentOrgPermissions.canView,
            ),
        ],

        tableLockOnRevision: (data) => data.getRevision.locked,
        buildTableRevisionCloneAction: (data) => () =>
            pageActions.duplicateAppRevision(
                pageActionProps,
                data.getRevision.id,
                (
                    id: string,
                    pageRefresh: () => void,
                    handleDialogClose: (checkChanges: boolean) => void,
                ) => {
                    handleDialogClose(false);
                    router.push(toAppRevision({ id })).then();
                },
            ),
    };

    return <TablePage<TagTableRow, TagPageData> {...orgTablePageProps} />;
};

export default TagsPage;
