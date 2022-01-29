import { FC, FormEvent } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { LoggedUser } from '../../gql/generated/LoggedUser';
import APITokenForm from '../../components/organisms/Forms/APITokenForm';
import LoggedUserQuery from '../../gql/queries/LoggedUserQuery';
import ResetAPITokenQuery from '../../gql/mutations/ResetAPITokenQuery';
import { ResetAPITokenValues } from '../../gql/generated/ResetAPITokenValues';
import { DialogPageProps } from '../../types/DialogTypes';
import { QueryLoaderAndError } from '../../abstractions/QueryLoaderAndError';
import { logError } from '../../utils/logUtils';

type APITokenAfterLoadProps = DialogPageProps & {
    token: string;
    uid: string;
    refetchToken: () => void;
};

export type APITokenFormProps = {
    token: string;
    uid: string;
    handleSubmit: (event?: FormEvent<HTMLFormElement>) => void;
    handleDialogClose: (checkChanges: boolean) => void;
};

const APITokenAfterLoad: FC<APITokenAfterLoadProps> = (props: APITokenAfterLoadProps) => {
    const [resetAPIToken] = useMutation<ResetAPITokenValues>(ResetAPITokenQuery);

    const submitForm = async () => {
        try {
            await resetAPIToken({
                variables: {},
            });
            props.refetchToken();
        } catch (error) {
            logError(error);
        }
    };

    const handleSubmit = (event?: FormEvent<HTMLFormElement>) => {
        if (event) {
            event.preventDefault();
        }

        (async () => {
            await submitForm();
        })();
    };

    return (
        <APITokenForm
            handleSubmit={handleSubmit}
            handleDialogClose={props.handleDialogClose}
            token={props.token}
            uid={props.uid}
        />
    );
};

const APIToken: FC<DialogPageProps> = (props: DialogPageProps) => {
    return QueryLoaderAndError<LoggedUser>(
        false,
        useQuery<LoggedUser>(LoggedUserQuery),
        (data: LoggedUser, valuesRefresh: (mustResetCache: boolean) => void) => {
            return (
                <APITokenAfterLoad
                    token={data.me.api_token}
                    uid={data.me.id}
                    refetchToken={() => valuesRefresh(false)}
                    {...props}
                />
            );
        },
    );
};

export { APIToken };
