import { FC, useEffect } from 'react';
import { openSignInWindow } from '../../utils/SignInUtils';
import { getApiUrl } from '../../utils/ConfigUtils';
import { useLoggedInState } from '../../context/AppContext';
import { ApolloError } from '@apollo/client/errors';

type GithubCheckProps = {
    githubConnected: boolean;
};

const GithubCheck: FC<GithubCheckProps> = (props: GithubCheckProps) => {
    const { githubConnected } = props;
    const { loggedInUserState, templateInteractions } = useLoggedInState();
    const userId = loggedInUserState.loggedUserId;

    const { setSnackbarError } = templateInteractions;

    useEffect(() => {
        if (!githubConnected) {
            const githubUser = localStorage.getItem('gitHubSignUp');
            if (githubUser) {
                (async () => {
                    localStorage.removeItem('gitHubSignUp');
                    try {
                        const ssoResult: {
                            uid: string;
                            token: string;
                        } = await openSignInWindow(
                            `${getApiUrl()}/auth/github?login=${githubUser}&user_id=${userId}`,
                        );

                        if (ssoResult !== null) {
                            localStorage.setItem('uid', ssoResult.uid);
                            localStorage.setItem('token', ssoResult.token);
                        }
                    } catch (e: any) {
                        setSnackbarError({
                            message: `GitHub login failed: ${e.message}`,
                        } as ApolloError);
                    }
                })();
            }
        }
    }, [githubConnected]);

    return null;
};

export default GithubCheck;
