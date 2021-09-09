import { FC } from 'react';
import { useQuery } from '@apollo/client';
import NavOrgQuery from '../../gql/queries/NavOrgQuery';
import { NavOrg } from '../../gql/generated/NavOrg';
import { buildOrgButtonProps } from '../../utils/BreadcrumbButtonsUtils';
import { Section, SectionProps } from '../abstractions/Section';
import { SectionKey } from '../SectionsDetails';
import { useRouter } from 'next/router';
import { ChildrenAndIdProps } from '../../types/props/ChildrenAndIdProps';

const ThankYouSection: FC<ChildrenAndIdProps> = (props: ChildrenAndIdProps) => {
    const router = useRouter();

    const { id, children } = props;

    const sectionProps: SectionProps<NavOrg> = {
        children: children,
        sectionKey: SectionKey.org,
        extractOrgUserDetails: (data) => data.getOrg,
        queryResult: useQuery<NavOrg>(NavOrgQuery, {
            variables: { id },
        }),
        buildButtonsProps: (data) => [
            buildOrgButtonProps(router, data.me.orgs, id ?? '', data.getOrg.name, true),
        ],
        buildMenuItemsProps: () => [],
    };

    return <Section<NavOrg> {...sectionProps} />;
};

export default ThankYouSection;
