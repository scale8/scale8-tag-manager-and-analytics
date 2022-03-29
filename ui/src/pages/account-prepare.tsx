import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import Head from 'next/head';
import SignUpContainer from '../components/molecules/SignUpContainer';
import Loader from '../components/organisms/Loader';
import { Box } from '@mui/material';
import { useMutation } from '@apollo/client';
import { CompleteSignUp, CompleteSignUp_completeSignUp } from '../gql/generated/CompleteSignUp';
import CompleteSignUpQuery from '../gql/mutations/CompleteSignUpQuery';
import Link from '../components/atoms/Next/Link';
import LoggedOutSection from '../containers/global/LoggedOutSection';
import {
    toApp,
    toDataManager,
    toInstallTags,
    toLoginDuplicate,
    toOrgSelect,
    toSignUp,
} from '../utils/NavigationPaths';
import { CompleteSignUpInput } from '../gql/generated/globalTypes';
import { buildSignUpType } from '../utils/SignUpUtils';
import { logError } from '../utils/logUtils';
import { ApolloError } from '@apollo/client/errors';
import { ComponentWithParams, ParamsLoader } from '../components/atoms/ParamsLoader';
import { clearAuthSession } from '../utils/authUtils';
import Navigate from '../components/atoms/Next/Navigate';
import { SignUpUrlType } from '../types/props/SignUpTypes';

type AccountPrepareContentProps = {
    type: SignUpUrlType;
    token: string;
    signupStatus: SignupStatus;
    setSignupStatus: Dispatch<SetStateAction<SignupStatus>>;
};

type SignupStatus = {
    completed: boolean;
    completeSignUp?: CompleteSignUp_completeSignUp;
    error?: ApolloError;
    type: SignUpUrlType;
    token: string;
};

const AccountPrepareInProgress: FC<AccountPrepareContentProps> = (
    props: AccountPrepareContentProps,
) => {
    const { type, token, setSignupStatus, signupStatus } = props;

    const [complete, { data, error: gqlError }] = useMutation<CompleteSignUp>(CompleteSignUpQuery);

    useEffect(() => {
        if (!signupStatus.completed) {
            clearAuthSession();

            const completeSignUpInput: CompleteSignUpInput = {
                sign_up_type: buildSignUpType(type),
                token,
            };

            (async () => {
                try {
                    await new Promise((f) => setTimeout(f, 1000));
                    await complete({
                        variables: { completeSignUpInput },
                    });
                } catch (error) {
                    logError(error);
                }
            })();
        }
    }, [signupStatus.completed]);

    useEffect(() => {
        if (gqlError) {
            setSignupStatus({
                completed: true,
                error: gqlError,
                type,
                token,
            });
        }
    }, [gqlError]);

    useEffect(() => {
        const completeSignUp = data?.completeSignUp;
        if (completeSignUp !== undefined) {
            setSignupStatus({
                completed: true,
                completeSignUp,
                type,
                token,
            });
        }
    }, [data]);

    return (
        <>
            <Box fontSize={18} width="100%" textAlign="center">
                We are just setting up your new account
                {type === 'tag-manager' && (
                    <>
                        <br />
                        and configuring your first application
                    </>
                )}
                .<br />
                This should just take a few seconds.
            </Box>
            <Loader />
        </>
    );
};

const AccountPrepareRedirect: FC<{ signupStatus: SignupStatus }> = ({ signupStatus }) => {
    const completeSignUp = signupStatus.completeSignUp;
    const type = signupStatus.type;

    if (completeSignUp) {
        if (type === 'invite') {
            return <Navigate to={toOrgSelect} />;
        }

        if (type === 'tag-manager') {
            return (
                <Navigate
                    to={toInstallTags({
                        env: completeSignUp.tag_manager?.environment_id ?? '',
                        target: encodeURIComponent(
                            toApp(
                                {
                                    id: completeSignUp.tag_manager?.app_id ?? '',
                                    period: 'realtime',
                                },
                                'analytics',
                            ),
                        ),
                    })}
                />
            );
        }

        if (type === 'data-manager') {
            return (
                <Navigate
                    to={toDataManager({
                        id: completeSignUp.data_manager?.data_manager_account_id ?? '',
                    })}
                />
            );
        }
    }

    return null;
};

const AccountPrepareCompleted: FC<{ signupStatus: SignupStatus }> = ({ signupStatus }) => {
    const completeSignUp = signupStatus.completeSignUp;
    const type = signupStatus.type;

    if (completeSignUp === undefined || signupStatus.error) {
        return (
            <Box mb={2} width="100%">
                <Box py={10}>
                    <Box fontSize={18} width="100%" textAlign="center">
                        Your sign up request was unsuccessful, please{' '}
                        <Link
                            href={toSignUp({ type: type === 'invite' ? 'tag-manager' : type })}
                            sx={{ color: '#1b1b1b' }}
                        >
                            sign up again
                        </Link>
                        .
                    </Box>
                </Box>
            </Box>
        );
    }

    if (completeSignUp.is_duplicate) {
        return <Navigate to={toLoginDuplicate} />;
    }

    localStorage.setItem('uid', completeSignUp.uid);
    localStorage.setItem('token', completeSignUp.token);

    return <AccountPrepareRedirect signupStatus={signupStatus} />;
};

const AccountPrepare: ComponentWithParams = ({ params }) => {
    const { type: initialType, target, token: initialToken } = params;
    const type = (initialType ?? 'tag-manager') as SignUpUrlType;
    const token = initialToken ?? '';

    const [signupStatus, setSignupStatus] = useState<SignupStatus>({
        completed: false,
        type,
        token,
    });

    return (
        <>
            <Head>
                <title>Scale8 - Sign Up</title>
                <meta name="description" content="Scale8 - Sign Up page." />
            </Head>
            <LoggedOutSection>
                <SignUpContainer type={type} target={target} isCompleted={false} isPrepare={true}>
                    {!signupStatus.completed ? (
                        <AccountPrepareInProgress
                            type={type}
                            token={token}
                            signupStatus={signupStatus}
                            setSignupStatus={setSignupStatus}
                        />
                    ) : (
                        <AccountPrepareCompleted signupStatus={signupStatus} />
                    )}
                </SignUpContainer>
            </LoggedOutSection>
        </>
    );
};

const AccountPrepareLoader = () => <ParamsLoader Child={AccountPrepare} />;
export default AccountPrepareLoader;
