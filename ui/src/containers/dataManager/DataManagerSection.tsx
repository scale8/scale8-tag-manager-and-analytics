import { FC } from 'react';
import { useQuery } from '@apollo/client';
import {
    buildDataManagerButtonProps,
    buildOrgButtonProps,
} from '../../utils/BreadcrumbButtonsUtils';
import NavDataManagerQuery from '../../gql/queries/NavDataManagerQuery';
import { NavDataManager } from '../../gql/generated/NavDataManager';
import { Section, SectionProps } from '../abstractions/Section';
import { SectionKey } from '../SectionsDetails';
import { useLoggedInState } from '../../context/AppContext';
import { useRouter } from 'next/router';
import { ChildrenAndIdProps } from '../../types/props/ChildrenAndIdProps';

const DataManagerSection: FC<ChildrenAndIdProps> = (props: ChildrenAndIdProps) => {
    const router = useRouter();
    const { id, children } = props;

    const { orgUserState } = useLoggedInState();

    const sectionProps: SectionProps<NavDataManager> = {
        children,
        sectionKey: SectionKey.dataManager,
        queryResult: useQuery<NavDataManager>(NavDataManagerQuery, {
            variables: { id },
        }),
        buildButtonsProps: (data) => [
            buildOrgButtonProps(
                router,
                data.me.orgs,
                data.getDataManagerAccount.org.id,
                data.getDataManagerAccount.org.name,
            ),
            buildDataManagerButtonProps(
                router,
                id,
                data.getDataManagerAccount.org.tag_manager_account?.id ?? '',
                true,
            ),
        ],
        buildMenuItemsProps: () => [],
        extractOrgUserDetails: (data) => data.getDataManagerAccount.org,
        accountExpireIn: orgUserState?.dataManagerAccount?.trialExpiration ?? undefined,
        accountIsTrial: orgUserState?.dataManagerAccount?.isTrial ?? undefined,
    };

    return <Section<NavDataManager> {...sectionProps} />;
};

export default DataManagerSection;
