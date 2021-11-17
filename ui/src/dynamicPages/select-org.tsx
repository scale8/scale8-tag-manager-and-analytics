import { FC, useEffect } from 'react';
import { useLoggedInState } from '../context/AppContext';
import { QueryResult } from '@apollo/client/react/types/types';
import { PageSelectOrgData, PageSelectOrgData_me_orgs } from '../gql/generated/PageSelectOrgData';
import PageSelectOrgQuery from '../gql/queries/PageSelectOrgQuery';
import { useQuery } from '@apollo/client';
import { pageActions } from '../actions/PageActions';
import { QueryLoaderAndError } from '../abstractions/QueryLoaderAndError';
import Navigate from '../components/atoms/Next/Navigate';
import { SelectOrg } from '../components/organisms/SelectOrg';
import { toApp, toOrg, toOrgList, toTagManager } from '../utils/NavigationPaths';
import { useRouter } from 'next/router';
import { DynamicPageProps } from '../pageLoader/DynamicPageLoader';

type OrgEntry = {
    id: string;
    org: string;
    action: () => void;
};

export type SelectOrgProps = {
    orgs: OrgEntry[];
};

const SelectOrgPage: FC<DynamicPageProps> = (props: DynamicPageProps) => {
    const { action } = props.params;

    const { templateInteractions } = useLoggedInState();
    const { dispatchDialogAction } = templateInteractions;

    // GQL
    const queryResult: QueryResult<PageSelectOrgData> =
        useQuery<PageSelectOrgData>(PageSelectOrgQuery);

    const { data } = queryResult;

    const invites = data ? data.me.invites.length : 0;

    const router = useRouter();

    useEffect(() => {
        if (invites > 0) {
            pageActions.showNotification({ dispatchDialogAction });
        }
    }, [invites]);

    return QueryLoaderAndError<PageSelectOrgData>(true, queryResult, (data: PageSelectOrgData) => {
        if (data.me.orgs.length === 0 || invites > 0) {
            return <Navigate to={toOrgList} />;
        }

        let org: PageSelectOrgData_me_orgs | null = null;

        if (data.me.orgs.length === 1) {
            org = data.me.orgs[0];
        } else {
            const currentOrgId = localStorage.getItem('orgid');

            if (currentOrgId !== null) {
                const currentOrg = data.me.orgs.find((_) => _.id === currentOrgId);
                org = currentOrg ?? null;
            }
        }

        if (org !== null) {
            if (org.tag_manager_account !== null) {
                const tagManager = org.tag_manager_account;
                if (action === 'go-to-tm') {
                    return <Navigate to={toTagManager({ id: tagManager.id })} />;
                }
                // go-to-app is only used in commercial so the analytics are always enabled
                if (action === 'go-to-app' && tagManager.apps.length === 1) {
                    return (
                        <Navigate
                            to={toApp(
                                { id: tagManager.apps[0].id, period: 'realtime' },
                                'analytics',
                            )}
                        />
                    );
                }
            }
            return <Navigate to={toOrg({ id: org.id })} />;
        }

        const selectOrgProps: SelectOrgProps = {
            orgs: data.me.orgs.map((_) => {
                return {
                    id: _.id,
                    org: _.name,
                    action: () => {
                        router.push(toOrg({ id: _.id })).then();
                    },
                };
            }),
        };

        return <SelectOrg {...selectOrgProps} />;
    });
};

export default SelectOrgPage;
