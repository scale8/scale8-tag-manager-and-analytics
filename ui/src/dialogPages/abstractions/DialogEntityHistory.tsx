import { FC } from 'react';
import { useQuery } from '@apollo/client';
import { DialogPageProps } from '../../types/DialogTypes';
import { EntitiesHistory } from '../../gql/generated/EntitiesHistory';
import HistoryQuery from '../../gql/queries/HistoryQuery';
import HistoryDialog from '../../components/organisms/HistoryDialog';
import { queryLoaderAndError } from '../../abstractions/QueryLoaderAndError';
import { buildStandardFormInfo } from '../../utils/InfoLabelsUtils';

export type DialogEntityHistoryProps = DialogPageProps & {
    infoKeyBase: string;
};

const DialogEntityHistory: FC<DialogEntityHistoryProps> = (props: DialogEntityHistoryProps) => {
    return queryLoaderAndError<EntitiesHistory>(
        false,
        useQuery<EntitiesHistory>(HistoryQuery, {
            variables: {
                entities: [props.id, ...(props.contextId === '' ? [] : [props.contextId])],
            },
        }),
        (data) => {
            return (
                <HistoryDialog
                    historyData={data}
                    title={`${props.name} History`}
                    formInfoProps={buildStandardFormInfo(props.infoKeyBase, 'History')}
                    handleDialogClose={props.handleDialogClose}
                />
            );
        },
    );
};

export { DialogEntityHistory };
