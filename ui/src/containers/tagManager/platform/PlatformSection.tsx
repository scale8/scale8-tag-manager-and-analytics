import { FC } from 'react';
import { useQuery } from '@apollo/client';
import { NavPlatform } from '../../../gql/generated/NavPlatform';
import NavPlatformQuery from '../../../gql/queries/NavPlatformQuery';
import {
    BreadcrumbButtonProps,
    buildCustomPlatformButtonProps,
    buildTemplatedPlatformButtonProps,
    ButtonAccount,
} from '../../../utils/BreadcrumbButtonsUtils';
import { Section, SectionItem, SectionProps } from '../../abstractions/Section';
import { PlatformType } from '../../../gql/generated/globalTypes';
import { SectionKey } from '../../SectionsDetails';
import { useConfigState, useLoggedInState } from '../../../context/AppContext';
import { NextRouter, useRouter } from 'next/router';
import { ChildrenAndIdProps } from '../../../types/props/ChildrenAndIdProps';
import { CurrentOrgPermissions } from '../../../context/OrgUserReducer';
import { buildTagManagerButtons } from '../TagManagerSection';

type PlatformSectionProps = ChildrenAndIdProps & {
    type: PlatformType;
};

export const buildPlatformButtons = (
    type: PlatformType,
    orgs: SectionItem[],
    currentOrg: SectionItem,
    tagManagerAccount: ButtonAccount,
    dataManagerAccount: ButtonAccount,
    platforms: SectionItem[],
    currentPlatform: SectionItem,
    router: NextRouter,
    orgPermissions: CurrentOrgPermissions,
    useSignup: boolean,
    isCurrentPage = false,
): BreadcrumbButtonProps[] => [
    ...buildTagManagerButtons(
        orgs,
        currentOrg,
        tagManagerAccount,
        dataManagerAccount,
        router,
        orgPermissions,
        useSignup,
        'Platforms',
    ),
    ...(type === PlatformType.CUSTOM
        ? [
              buildCustomPlatformButtonProps(
                  router,
                  platforms,
                  currentPlatform.id,
                  currentPlatform.name,
                  isCurrentPage,
              ),
          ]
        : [
              buildTemplatedPlatformButtonProps(
                  router,
                  platforms,
                  currentPlatform.id,
                  currentPlatform.name,
                  isCurrentPage,
              ),
          ]),
];

const PlatformSection: FC<PlatformSectionProps> = (props: PlatformSectionProps) => {
    const router = useRouter();

    const { id, children, type } = props;

    const { orgUserState } = useLoggedInState();
    const { useSignup } = useConfigState();

    const sectionProps: SectionProps<NavPlatform> = {
        children,
        sectionKey: SectionKey.platform,
        queryResult: useQuery<NavPlatform>(NavPlatformQuery, {
            variables: { id },
        }),
        buildButtonsProps: (data, orgPermissions) => {
            return buildPlatformButtons(
                type,
                data.me.orgs,
                data.getPlatform.tag_manager_account.org,
                data.getPlatform.tag_manager_account,
                data.getPlatform.tag_manager_account.org.data_manager_account,
                data.getPlatform.tag_manager_account.platforms.filter((_) => _.type === type),
                data.getPlatform,
                router,
                orgPermissions,
                useSignup,
                true,
            );
        },
        buildMenuItemsProps: () => [],
        extractOrgUserDetails: (data) => data.getPlatform.tag_manager_account.org,
        accountExpireIn: orgUserState?.tagManagerAccount?.trialExpiration ?? undefined,
        accountIsTrial: orgUserState?.tagManagerAccount?.isTrial ?? undefined,
    };

    return <Section<NavPlatform> {...sectionProps} />;
};

export default PlatformSection;
