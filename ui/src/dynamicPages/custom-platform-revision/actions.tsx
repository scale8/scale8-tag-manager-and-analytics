import { FC } from 'react';
import { useQuery } from '@apollo/client';
import { DynamicPageProps } from '../../pageLoader/DynamicPageLoader';
import { useRouter } from 'next/router';
import { TablePage, TablePageProps } from '../../abstractions/TablePage';
import { PlatformActionPageData } from '../../gql/generated/PlatformActionPageData';
import { buildStandardMainInfo, buildTableColumns } from '../../utils/InfoLabelsUtils';
import PagePlatformActionQuery from '../../gql/queries/PagePlatformActionQuery';
import { buildFieldAction, buildSelectAction } from '../../utils/TableActionsUtils';
import { toPlatformRevisionAction } from '../../utils/NavigationPaths';

export type PlatformActionTableRow = {
    id: string;
    name: string;
    description: string;
    s2sEndpoint: string;
    dataMaps: number;
};

const PlatformActionsPage: FC<DynamicPageProps> = (props: DynamicPageProps) => {
    const revisionId = props.params.id ?? '';

    const router = useRouter();

    const platformActionsPageProps: TablePageProps<PlatformActionTableRow, PlatformActionPageData> =
        {
            title: 'Actions',
            mainInfoProps: buildStandardMainInfo('platformActions'),
            mainQuery: useQuery<PlatformActionPageData>(PagePlatformActionQuery, {
                variables: { id: revisionId },
            }),
            tableId: 'PlatformActions',
            entityName: 'Action',
            columns: buildTableColumns('platformActions', [
                { field: 'name' },
                { field: 'id' },
                { field: 'description' },
                { title: 'S2S Endpoint', field: 's2sEndpoint' },
                { field: 'dataMaps', type: 'numeric' },
            ]),
            defaultOrderBy: 'id',
            defaultOrder: 'desc',
            mapTableData: (data) =>
                data.getPlatformRevision.platform_actions.map(
                    (platformAction): PlatformActionTableRow => {
                        return {
                            id: platformAction.id,
                            name: platformAction.name,
                            description: platformAction.description,
                            s2sEndpoint: platformAction.s2s_endpoint ?? '-',
                            dataMaps: platformAction.platform_data_maps.length,
                        };
                    },
                ),
            buildRowActions: () => [
                buildSelectAction(
                    ({ id }) => router.push(toPlatformRevisionAction({ id })).then(),
                    `Select Action`,
                    ({ dataMaps }) => dataMaps === 0,
                ),
            ],
            buildFieldActions: () => [
                buildFieldAction(
                    'name',
                    ({ id }) => router.push(toPlatformRevisionAction({ id })).then(),
                    `Select Action`,
                    ({ dataMaps }) => dataMaps === 0,
                ),
            ],
        };

    return (
        <TablePage<PlatformActionTableRow, PlatformActionPageData> {...platformActionsPageProps} />
    );
};

export default PlatformActionsPage;
