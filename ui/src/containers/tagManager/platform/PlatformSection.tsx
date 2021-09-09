import { FC } from 'react';
import { useQuery } from '@apollo/client';
import { NavPlatform } from '../../../gql/generated/NavPlatform';
import NavPlatformQuery from '../../../gql/queries/NavPlatformQuery';
import {
    buildCustomPlatformButtonProps,
    buildOrgButtonProps,
    buildTagManagerButtonProps,
    buildTemplatedPlatformButtonProps,
} from '../../../utils/BreadcrumbButtonsUtils';
import { Section, SectionProps } from '../../abstractions/Section';
import { PlatformType } from '../../../gql/generated/globalTypes';
import { SectionKey } from '../../SectionsDetails';
import { useLoggedInState } from '../../../context/AppContext';
import { useRouter } from 'next/router';
import { ChildrenAndIdProps } from '../../../types/props/ChildrenAndIdProps';

type PlatformSectionProps = ChildrenAndIdProps & {
    type: PlatformType;
};

const PlatformSection: FC<PlatformSectionProps> = (props: PlatformSectionProps) => {
    const router = useRouter();

    const { id, children, type } = props;

    const { orgUserState } = useLoggedInState();

    const sectionProps: SectionProps<NavPlatform> = {
        children,
        sectionKey: SectionKey.platform,
        queryResult: useQuery<NavPlatform>(NavPlatformQuery, {
            variables: { id },
        }),
        buildButtonsProps: (data) => [
            buildOrgButtonProps(
                router,
                data.me.orgs,
                data.getPlatform.tag_manager_account.org.id,
                data.getPlatform.tag_manager_account.org.name,
            ),
            buildTagManagerButtonProps(
                router,
                data.getPlatform.tag_manager_account.id,
                data.getPlatform.tag_manager_account.org.data_manager_account?.id ?? '',
            ),
            ...(type === PlatformType.CUSTOM
                ? [
                      buildCustomPlatformButtonProps(
                          router,
                          data.getPlatform.tag_manager_account.platforms.filter(
                              (_) => _.type === PlatformType.CUSTOM,
                          ),
                          id,
                          data.getPlatform.name,
                          true,
                      ),
                  ]
                : [
                      buildTemplatedPlatformButtonProps(
                          router,
                          data.getPlatform.tag_manager_account.platforms.filter(
                              (_) => _.type === PlatformType.TEMPLATED,
                          ),
                          id,
                          data.getPlatform.name,
                          true,
                      ),
                  ]),
        ],
        buildMenuItemsProps: () => [],
        extractOrgUserDetails: (data) => data.getPlatform.tag_manager_account.org,
        accountExpireIn: orgUserState?.tagManagerAccount?.trialExpiration ?? undefined,
        accountIsTrial: orgUserState?.tagManagerAccount?.isTrial ?? undefined,
    };

    return <Section<NavPlatform> {...sectionProps} />;
};

export default PlatformSection;
