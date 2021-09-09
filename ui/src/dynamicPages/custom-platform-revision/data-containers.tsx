import { FC } from 'react';
import { useQuery } from '@apollo/client';
import { TablePage, TablePageProps } from '../../abstractions/TablePage';
import { DynamicPageProps } from '../../pageLoader/DynamicPageLoader';
import { useRouter } from 'next/router';
import { PlatformDataContainerPageData } from '../../gql/generated/PlatformDataContainerPageData';
import { buildStandardMainInfo, buildTableColumns } from '../../utils/InfoLabelsUtils';
import PagePlatformDataContainerQuery from '../../gql/queries/PagePlatformDataContainerQuery';
import { buildFieldAction, buildSelectAction } from '../../utils/TableActionsUtils';
import { toPlatformRevisionDataContainer } from '../../utils/NavigationPaths';

export type PlatformDataContainerTableRow = {
    id: string;
    name: string;
    description: string;
    allowCustom: boolean;
    dataMaps: number;
};

const PlatformDataContainersPage: FC<DynamicPageProps> = (props: DynamicPageProps) => {
    const revisionId = props.params.id ?? '';

    const router = useRouter();

    const platformDataContainersPageProps: TablePageProps<
        PlatformDataContainerTableRow,
        PlatformDataContainerPageData
    > = {
        title: 'Data Containers',
        mainInfoProps: buildStandardMainInfo('platformDataContainers'),
        mainQuery: useQuery<PlatformDataContainerPageData>(PagePlatformDataContainerQuery, {
            variables: { id: revisionId },
        }),
        tableId: 'PlatformDataContainers',
        entityName: 'Data Container',
        columns: buildTableColumns('platformDataContainers', [
            { field: 'name' },
            { field: 'id' },
            { field: 'description' },
            { field: 'allowCustom', type: 'boolean' },
            { field: 'dataMaps', type: 'numeric' },
        ]),
        defaultOrderBy: 'id',
        defaultOrder: 'desc',
        mapTableData: (data) =>
            data.getPlatformRevision.platform_data_containers.map(
                (platformDataContainer): PlatformDataContainerTableRow => {
                    return {
                        id: platformDataContainer.id,
                        name: platformDataContainer.name,
                        description: platformDataContainer.description,
                        allowCustom: platformDataContainer.allow_custom,
                        dataMaps: platformDataContainer.platform_data_maps.length,
                    };
                },
            ),
        buildRowActions: () => [
            buildSelectAction(
                ({ id }) => router.push(toPlatformRevisionDataContainer({ id })).then(),
                `Select Data Container`,
                ({ dataMaps }) => dataMaps === 0,
            ),
        ],
        buildFieldActions: () => [
            buildFieldAction(
                'name',
                ({ id }) => router.push(toPlatformRevisionDataContainer({ id })).then(),
                `Select Data Container`,
                ({ dataMaps }) => dataMaps === 0,
            ),
        ],
    };

    return (
        <TablePage<PlatformDataContainerTableRow, PlatformDataContainerPageData>
            {...platformDataContainersPageProps}
        />
    );
};

export default PlatformDataContainersPage;
