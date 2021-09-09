import { FC } from 'react';
import { useQuery } from '@apollo/client';
import { TablePage, TablePageProps } from '../../abstractions/TablePage';
import { DynamicPageProps } from '../../pageLoader/DynamicPageLoader';
import { PlatformAssetPageData } from '../../gql/generated/PlatformAssetPageData';
import { buildStandardMainInfo, buildTableColumns } from '../../utils/InfoLabelsUtils';
import PagePlatformAssetQuery from '../../gql/queries/PagePlatformAssetQuery';

export type PlatformAssetTableRow = {
    id: string;
    name: string;
    mimeType: string;
    size: string;
};

const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const PlatformAssetsPage: FC<DynamicPageProps> = (props: DynamicPageProps) => {
    const revisionId = props.params.id ?? '';

    const platformAssetsPageProps: TablePageProps<PlatformAssetTableRow, PlatformAssetPageData> = {
        title: 'Assets',
        mainInfoProps: buildStandardMainInfo('platformAssets'),
        mainQuery: useQuery<PlatformAssetPageData>(PagePlatformAssetQuery, {
            variables: { id: revisionId },
        }),
        tableId: 'PlatformAssets',
        entityName: 'Asset',
        columns: buildTableColumns('platformAssets', [
            { field: 'name' },
            { field: 'id' },
            { field: 'mimeType' },
            { field: 'size' },
        ]),
        defaultOrderBy: 'id',
        defaultOrder: 'desc',
        mapTableData: (data) =>
            data.getPlatformRevision.platform_assets.map((platformAsset): PlatformAssetTableRow => {
                return {
                    id: platformAsset.id,
                    name: platformAsset.name,
                    mimeType: platformAsset.mime_type,
                    size: formatBytes(platformAsset.size),
                };
            }),
    };

    return <TablePage<PlatformAssetTableRow, PlatformAssetPageData> {...platformAssetsPageProps} />;
};

export default PlatformAssetsPage;
