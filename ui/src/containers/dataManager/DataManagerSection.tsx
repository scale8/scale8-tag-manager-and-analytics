import { FC } from 'react';
import { useQuery } from '@apollo/client';
import {
    BreadcrumbButtonProps,
    buildDataManagerButtonPropsAndCheckAccounts,
    ButtonAccount,
} from '../../utils/BreadcrumbButtonsUtils';
import NavDataManagerQuery from '../../gql/queries/NavDataManagerQuery';
import { NavDataManager } from '../../gql/generated/NavDataManager';
import { Section, SectionItem, SectionProps } from '../abstractions/Section';
import { SectionKey } from '../SectionsDetails';
import { useConfigState, useLoggedInState } from '../../context/AppContext';
import { NextRouter, useRouter } from 'next/router';
import { ChildrenAndIdProps } from '../../types/props/ChildrenAndIdProps';
import { CurrentOrgPermissions } from '../../context/OrgUserReducer';
import { buildOrgButtons } from '../global/OrgSection';

export const buildDataManagerButtons = (
    orgs: SectionItem[],
    currentOrg: SectionItem,
    dataManagerAccount: ButtonAccount,
    tagManagerAccount: ButtonAccount,
    router: NextRouter,
    orgPermissions: CurrentOrgPermissions,
    useSignup: boolean,
    isCurrentPage = false,
): BreadcrumbButtonProps[] => [
    ...buildOrgButtons(orgs, currentOrg, router, orgPermissions, useSignup, 'Services'),
    buildDataManagerButtonPropsAndCheckAccounts(
        router,
        dataManagerAccount,
        tagManagerAccount,
        isCurrentPage,
    ),
];

const DataManagerSection: FC<ChildrenAndIdProps> = (props: ChildrenAndIdProps) => {
    const router = useRouter();
    const { id, children } = props;

    const { orgUserState } = useLoggedInState();
    const { useSignup } = useConfigState();

    const sectionProps: SectionProps<NavDataManager> = {
        children,
        sectionKey: SectionKey.dataManager,
        queryResult: useQuery<NavDataManager>(NavDataManagerQuery, {
            variables: { id },
        }),
        buildButtonsProps: (data, orgPermissions) => {
            return buildDataManagerButtons(
                data.me.orgs,
                data.getDataManagerAccount.org,
                data.getDataManagerAccount,
                data.getDataManagerAccount.org.tag_manager_account,
                router,
                orgPermissions,
                useSignup,
                true,
            );
        },
        buildMenuItemsProps: () => [],
        extractOrgUserDetails: (data) => data.getDataManagerAccount.org,
        accountExpireIn: orgUserState?.dataManagerAccount.trialExpiration ?? undefined,
        accountExpired: orgUserState?.dataManagerAccount.trialExpired ?? undefined,
        accountIsTrial: orgUserState?.dataManagerAccount.isTrial ?? undefined,
    };

    return <Section<NavDataManager> {...sectionProps} />;
};

export default DataManagerSection;
