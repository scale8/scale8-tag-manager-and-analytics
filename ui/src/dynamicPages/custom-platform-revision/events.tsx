import { FC } from 'react';
import { useQuery } from '@apollo/client';
import { TablePage, TablePageProps } from '../../abstractions/TablePage';
import { DynamicPageProps } from '../../pageLoader/DynamicPageLoader';
import { useRouter } from 'next/router';
import { PlatformEventPageData } from '../../gql/generated/PlatformEventPageData';
import { buildStandardMainInfo, buildTableColumns } from '../../utils/InfoLabelsUtils';
import PagePlatformEventQuery from '../../gql/queries/PagePlatformEventQuery';
import { buildFieldAction, buildSelectAction } from '../../utils/TableActionsUtils';
import { toPlatformRevisionEvent } from '../../utils/NavigationPaths';

export type PlatformEventTableRow = {
    id: string;
    name: string;
    description: string;
    event: string;
    dataMaps: number;
};

const PlatformEventsPage: FC<DynamicPageProps> = (props: DynamicPageProps) => {
    const revisionId = props.params.id ?? '';

    const router = useRouter();

    const platformEventsPageProps: TablePageProps<PlatformEventTableRow, PlatformEventPageData> = {
        title: 'Events',
        mainInfoProps: buildStandardMainInfo('platformEvents'),
        mainQuery: useQuery<PlatformEventPageData>(PagePlatformEventQuery, {
            variables: { id: revisionId },
        }),
        tableId: 'PlatformEvents',
        entityName: 'Event',
        columns: buildTableColumns('platformEvents', [
            { field: 'name' },
            { field: 'id' },
            { field: 'description' },
            { field: 'event' },
            { field: 'dataMaps', type: 'numeric' },
        ]),
        defaultOrderBy: 'id',
        defaultOrder: 'desc',
        mapTableData: (data) =>
            data.getPlatformRevision.platform_events.map((platformEvent): PlatformEventTableRow => {
                return {
                    id: platformEvent.id,
                    name: platformEvent.name,
                    description: platformEvent.description,
                    event: platformEvent.event,
                    dataMaps: platformEvent.platform_data_maps.length,
                };
            }),
        buildRowActions: () => [
            buildSelectAction(
                ({ id }) => router.push(toPlatformRevisionEvent({ id })).then(),
                `Select Event`,
                ({ dataMaps }) => dataMaps === 0,
            ),
        ],
        buildFieldActions: () => [
            buildFieldAction(
                'name',
                ({ id }) => router.push(toPlatformRevisionEvent({ id })).then(),
                `Select Event`,
                ({ dataMaps }) => dataMaps === 0,
            ),
        ],
    };

    return <TablePage<PlatformEventTableRow, PlatformEventPageData> {...platformEventsPageProps} />;
};

export default PlatformEventsPage;
