import { FC, useEffect } from 'react';
import { ApolloError, useMutation } from '@apollo/client';
import { openSignInWindow } from '../../utils/SignInUtils';
import GithubAccountRemoveQuery from '../../gql/mutations/GithubAccountRemoveQuery';
import { GithubAccountRemoveValues } from '../../gql/generated/GithubAccountRemoveValues';
import { getApiUrl } from '../../utils/ConfigUtils';
import { useLoggedInState } from '../../context/AppContext';
import { logError } from '../../utils/logUtils';

type GithubCheckProps = {
    githubUser: string | null;
    githubConnected: boolean;
};

const GithubCheck: FC<GithubCheckProps> = (props: GithubCheckProps) => {
    const { templateInteractions } = useLoggedInState();
    const { setSnackbarError } = templateInteractions;
    const { githubUser, githubConnected } = props;

    const [GithubAccountRemove, { data, error: gqlError }] =
        useMutation<GithubAccountRemoveValues>(GithubAccountRemoveQuery);

    if (gqlError) {
        setSnackbarError(gqlError);
    }

    useEffect(() => {
        if (data?.removeGitHubLink) {
            setSnackbarError({
                message: `GitHub login failed`,
            } as ApolloError);
        }
    }, [data]);

    useEffect(() => {
        if (githubUser !== null && !githubConnected) {
            (async () => {
                try {
                    const ssoResult: {
                        uid: string;
                        token: string;
                    } = await openSignInWindow(`${getApiUrl()}/auth/github?login=${githubUser}`);

                    if (ssoResult !== null) {
                        localStorage.setItem('uid', ssoResult.uid);
                        localStorage.setItem('token', ssoResult.token);
                    }
                } catch (e) {
                    try {
                        await GithubAccountRemove();
                    } catch (error) {
                        logError(error);
                    }
                }
            })();
        }
    }, [githubUser, githubConnected]);

    return null;
};

export default GithubCheck;
