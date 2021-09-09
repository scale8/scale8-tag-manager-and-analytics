import { FC, useState } from 'react';
import { useQuery } from '@apollo/client';
import LoggedUserQuery from '../../gql/queries/LoggedUserQuery';
import { LoggedUser, LoggedUser_me_invites } from '../../gql/generated/LoggedUser';
import { InvitesList } from '../../components/organisms/InvitesList';
import { DialogPageProps } from '../../types/DialogTypes';
import { queryLoaderAndError } from '../../abstractions/QueryLoaderAndError';
import DeclineUserInviteQuery from '../../gql/mutations/DeclineUserInviteQuery';
import AcceptUserInviteQuery from '../../gql/mutations/AcceptUserInviteQuery';
import { InDialogMutation } from '../abstractions/InDialogMutation';
import { DialogMutationFunction } from '../abstractions/DialogDirectMutation';
import { useRouter } from 'next/router';
import { toOrg } from '../../utils/NavigationPaths';

export type InvitesListProps = DialogPageProps & {
    invites: LoggedUser_me_invites[];
    acceptInviteAction: (invite: LoggedUser_me_invites) => void;
    declineInviteAction: (invite: LoggedUser_me_invites) => void;
};

const NotificationsInvites: FC<DialogPageProps> = (props: DialogPageProps) => {
    const [accepting, setAccepting] = useState(false);
    const [declining, setDeclining] = useState(false);
    const [mutationId, setMutationId] = useState('');
    const [orgId, setOrgId] = useState('');
    const router = useRouter();

    return queryLoaderAndError<LoggedUser>(
        false,
        useQuery(LoggedUserQuery, { notifyOnNetworkStatusChange: true }),
        (data: LoggedUser, valuesRefresh: (mustResetCache: boolean) => void) => {
            const acceptInviteAction = (invite: LoggedUser_me_invites) => {
                setMutationId(invite.id);
                setOrgId(invite.org.id);
                setAccepting(true);
            };

            const declineInviteAction = (invite: LoggedUser_me_invites) => {
                setMutationId(invite.id);
                setDeclining(true);
            };

            if (declining) {
                return (
                    <InDialogMutation
                        executeMutationCallback={async (
                            mutationFunction: DialogMutationFunction,
                            id: string,
                        ) => {
                            await mutationFunction({
                                variables: {
                                    orgDeclineInviteInput: {
                                        invite_id: id,
                                    },
                                },
                            });
                        }}
                        mutation={DeclineUserInviteQuery}
                        id={mutationId}
                        onMutationComplete={() => {
                            valuesRefresh(true);
                            setDeclining(false);
                        }}
                    />
                );
            }

            if (accepting) {
                return (
                    <InDialogMutation
                        executeMutationCallback={async (
                            mutationFunction: DialogMutationFunction,
                            id: string,
                        ) => {
                            await mutationFunction({
                                variables: {
                                    orgAcceptInviteInput: {
                                        invite_id: id,
                                    },
                                },
                            });
                        }}
                        mutation={AcceptUserInviteQuery}
                        id={mutationId}
                        onMutationComplete={() => {
                            valuesRefresh(true);
                            setAccepting(false);
                            router.push(toOrg({ id: orgId })).then();
                            props.handleDialogClose(false);
                        }}
                    />
                );
            }

            return (
                <InvitesList
                    acceptInviteAction={acceptInviteAction}
                    declineInviteAction={declineInviteAction}
                    invites={data.me.invites}
                    {...props}
                />
            );
        },
    );
};

export { NotificationsInvites };
