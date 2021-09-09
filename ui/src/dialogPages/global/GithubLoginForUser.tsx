import { FC, useState } from 'react';
import { DialogPageProps } from '../../types/DialogTypes';
import { queryLoaderAndError } from '../../abstractions/QueryLoaderAndError';
import { useQuery } from '@apollo/client';
import LoggedUserQuery from '../../gql/queries/LoggedUserQuery';
import GenericError from '../../components/atoms/GenericError';
import { openSignInWindow } from '../../utils/SignInUtils';
import SimpleMessage from '../../components/molecules/SimpleMessage';
import { LoggedUser } from '../../gql/generated/LoggedUser';
import { getApiUrl } from '../../utils/ConfigUtils';

const GithubLoginForUser: FC<DialogPageProps> = (props: DialogPageProps) => {
    const [ssoError, setSsoError] = useState('');

    return queryLoaderAndError<LoggedUser>(
        false,
        useQuery<LoggedUser>(LoggedUserQuery),
        (data: LoggedUser) => {
            if (ssoError) {
                return <GenericError error={ssoError} />;
            }
            const gitHubUser = data.me.github_user;

            if (data.me.github_user !== undefined) {
                (async () => {
                    try {
                        const ssoResult: {
                            uid: string;
                            token: string;
                        } = await openSignInWindow(
                            `${getApiUrl()}/auth/github?login=${gitHubUser}`,
                        );

                        if (ssoResult !== null) {
                            localStorage.setItem('uid', ssoResult.uid);
                            localStorage.setItem('token', ssoResult.token);
                        }

                        props.handleDialogClose(false);
                        props.pageRefresh();
                    } catch (e) {
                        props.handleDialogClose(false);
                        setSsoError(`GitHub login failed: ${e.message}`);
                    }
                })();
            }

            return (
                <SimpleMessage handleDialogClose={props.handleDialogClose}>
                    Please continue the registration using the GitHub window.
                </SimpleMessage>
            );
        },
    );
};

export default GithubLoginForUser;
