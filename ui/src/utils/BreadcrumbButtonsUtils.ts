import {
    toApp,
    toAppRevision,
    toCustomPlatform,
    toCustomPlatformRevision,
    toDataManager,
    toGlobalAction,
    toGlobalTrigger,
    toIngestEndpoint,
    toIngestEndpointRevision,
    toOrg,
    toPlatformRevisionAction,
    toPlatformRevisionDataContainer,
    toPlatformRevisionEvent,
    toTag,
    toTagManager,
    toTemplatedPlatform,
    toTemplatedPlatformRevision,
} from './NavigationPaths';
import OrgIcon from '../components/atoms/Icons/OrgIcon';
import { FC } from 'react';
import { SvgIconProps } from '@mui/material';
import PlatformIcon from '../components/atoms/Icons/PlatformIcon';
import RevisionIcon from '../components/atoms/Icons/RevisionIcon';
import IngestEndpointIcon from '../components/atoms/Icons/IngestEndpointIcon';
import AppIcon from '../components/atoms/Icons/AppIcon';
import TagIcon from '../components/atoms/Icons/TagIcon';
import ActionIcon from '../components/atoms/Icons/ActionIcon';
import DataContainerIcon from '../components/atoms/Icons/DataContainerIcon';
import EventIcon from '../components/atoms/Icons/EventIcon';
import ServiceIcon from '../components/atoms/Icons/ServiceIcon';
import AdminIcon from '../components/atoms/Icons/AdminIcon';
import TriggerIcon from '../components/atoms/Icons/TriggerIcon';
import { NextRouter } from 'next/router';
import { PageMenuButtonProps } from '../components/molecules/SideMenuButton';

export type BreadcrumbAction = {
    text: string;
    icon?: FC<SvgIconProps>;
    action: () => void;
};

export type BreadcrumbButtonProps = {
    elementIcon?: FC<SvgIconProps>;
    elementText: string;
    icon?: FC<SvgIconProps>;
    text: string;
    changeText: string;
    list: BreadcrumbAction[];
    jump: BreadcrumbAction;
    isCurrentPage: boolean;
};

export const buildJumpToAction = (navigateToThere: () => void, name: string): BreadcrumbAction => ({
    text: `Manage ${name}`,
    action: navigateToThere,
});

const buildButtonPropsFromActions = (
    actions: BreadcrumbAction[],
    id: string,
    name: string,
    isCurrentPage: boolean,
    navigateTo: (id: string) => void,
    elementText: string,
    changeText: string,
    elementIcon?: FC<SvgIconProps>,
    icon?: FC<SvgIconProps>,
): BreadcrumbButtonProps => {
    return {
        text: name,
        list: actions,
        jump: buildJumpToAction(() => navigateTo(id), name),
        isCurrentPage,
        elementText,
        changeText,
        elementIcon,
        icon,
    };
};

const buildButtonProps = (
    all: {
        id: string;
        name: string;
    }[],
    id: string,
    name: string,
    isCurrentPage: boolean,
    navigateTo: (id: string) => void,
    elementText: string,
    changeText: string,
    elementIcon?: FC<SvgIconProps>,
    icon?: FC<SvgIconProps>,
): BreadcrumbButtonProps => {
    const other = all.filter((_) => _.id !== id);
    const actions = other.map((_) => ({
        text: _.name,
        action: () => navigateTo(_.id),
    }));

    return buildButtonPropsFromActions(
        actions,
        id,
        name,
        isCurrentPage,
        navigateTo,
        elementText,
        changeText,
        elementIcon,
        icon,
    );
};

export const buildAdminButtonProps = (
    router: NextRouter,
    allOrgs: {
        id: string;
        name: string;
    }[],
): BreadcrumbButtonProps => {
    const actions: BreadcrumbAction[] = allOrgs.map((_) => ({
        text: _.name,
        action: () => router.push(toOrg({ id: _.id })).then(),
    }));

    return buildButtonPropsFromActions(
        actions,
        '',
        'Scale8 Admin Area',
        true,
        () => {
            // Idle
        },
        'Admin',
        'Jump to Org',
        AdminIcon,
    );
};

export const buildOrgButtonProps = (
    router: NextRouter,
    allOrgs: {
        id: string;
        name: string;
    }[],
    id: string,
    name: string,
    isCurrentPage = false,
): BreadcrumbButtonProps => {
    return buildButtonProps(
        allOrgs,
        id,
        name,
        isCurrentPage,
        (_) => {
            router.push(toOrg({ id: _ })).then();
        },
        'Organization',
        'Change Organization',
        OrgIcon,
    );
};

export const buildTagManagerButtonProps = (
    router: NextRouter,
    id: string,
    dataManagerId: string,
    isCurrentPage = false,
): BreadcrumbButtonProps => {
    return buildButtonPropsFromActions(
        dataManagerId === ''
            ? []
            : [
                  {
                      text: 'Data Manager',
                      action: () => {
                          router.push(toDataManager({ id: dataManagerId })).then();
                      },
                  },
              ],
        id,
        'Tag Manager',
        isCurrentPage,
        (_) => router.push(toTagManager({ id: _ })).then(),
        'Service',
        'Change Service',
        ServiceIcon,
    );
};

export const buildAppButtonProps = (
    router: NextRouter,
    allApps: {
        id: string;
        name: string;
    }[],
    id: string,
    name: string,
    isCurrentPage = false,
): BreadcrumbButtonProps => {
    return buildButtonProps(
        allApps,
        id,
        name,
        isCurrentPage,
        (_) => router.push(toApp({ id: _ })).then(),
        'App',
        'Change App',
        AppIcon,
    );
};

export const buildAppRevisionButtonProps = (
    router: NextRouter,
    allAppsRevisions: {
        id: string;
        name: string;
    }[],
    id: string,
    name: string,
    isCurrentPage = false,
): BreadcrumbButtonProps => {
    return buildButtonProps(
        allAppsRevisions,
        id,
        name,
        isCurrentPage,
        (_) => router.push(toAppRevision({ id: _ })).then(),
        'Revision',
        'Change Revision',
        RevisionIcon,
    );
};

export const buildTagButtonProps = (
    router: NextRouter,
    allTags: {
        id: string;
        name: string;
    }[],
    id: string,
    name: string,
    isCurrentPage = false,
): BreadcrumbButtonProps => {
    return buildButtonProps(
        allTags,
        id,
        name,
        isCurrentPage,
        (_) => router.push(toTag({ id: _ })).then(),
        'Tag',
        'Change Tag',
        TagIcon,
    );
};

export const buildGlobalTriggerButtonProps = (
    router: NextRouter,
    allTriggers: {
        id: string;
        name: string;
    }[],
    id: string,
    name: string,
    isCurrentPage = false,
): BreadcrumbButtonProps => {
    return buildButtonProps(
        allTriggers,
        id,
        name,
        isCurrentPage,
        (_) => router.push(toGlobalTrigger({ id: _ })).then(),
        'Trigger',
        'Change Trigger',
        TriggerIcon,
    );
};

export const buildGlobalActionButtonProps = (
    router: NextRouter,
    allActions: {
        id: string;
        name: string;
    }[],
    id: string,
    name: string,
    isCurrentPage = false,
): BreadcrumbButtonProps => {
    return buildButtonProps(
        allActions,
        id,
        name,
        isCurrentPage,
        (_) => router.push(toGlobalAction({ id: _ })).then(),
        'Global Action',
        'Change Global Action',
        ActionIcon,
    );
};

export const buildCustomPlatformButtonProps = (
    router: NextRouter,
    allCustomPlatforms: {
        id: string;
        name: string;
    }[],
    id: string,
    name: string,
    isCurrentPage = false,
): BreadcrumbButtonProps => {
    return buildButtonProps(
        allCustomPlatforms,
        id,
        name,
        isCurrentPage,
        (_) => router.push(toCustomPlatform({ id: _ })).then(),
        'Custom Platform',
        'Change Custom Platform',
        PlatformIcon,
    );
};

export const buildTemplatedPlatformButtonProps = (
    router: NextRouter,
    allTemplatedPlatforms: {
        id: string;
        name: string;
    }[],
    id: string,
    name: string,
    isCurrentPage = false,
): BreadcrumbButtonProps => {
    return buildButtonProps(
        allTemplatedPlatforms,
        id,
        name,
        isCurrentPage,
        (_) => router.push(toTemplatedPlatform({ id: _ })).then(),
        'Templated Platform',
        'Change Templated Platform',
        PlatformIcon,
    );
};

export const buildPlatformRevisionButtonProps = (
    router: NextRouter,
    allPlatformsRevisions: {
        id: string;
        name: string;
    }[],
    id: string,
    name: string,
    isCurrentPage = false,
    templated?: boolean,
): BreadcrumbButtonProps => {
    return buildButtonProps(
        allPlatformsRevisions,
        id,
        name,
        isCurrentPage,
        (_) =>
            templated
                ? router.push(toTemplatedPlatformRevision({ id: _ })).then()
                : router.push(toCustomPlatformRevision({ id: _ })).then(),
        'Revision',
        'Change Revision',
        RevisionIcon,
    );
};

export const buildPlatformRevisionActionButtonProps = (
    router: NextRouter,
    allPlatformsRevisionActions: {
        id: string;
        name: string;
    }[],
    id: string,
    name: string,
    isCurrentPage = false,
): BreadcrumbButtonProps => {
    return buildButtonProps(
        allPlatformsRevisionActions,
        id,
        name,
        isCurrentPage,
        (_) => router.push(toPlatformRevisionAction({ id: _ })).then(),
        'Action',
        'Change Action',
        ActionIcon,
    );
};

export const buildPlatformRevisionDataContainerButtonProps = (
    router: NextRouter,
    allPlatformsRevisionDataContainers: {
        id: string;
        name: string;
    }[],
    id: string,
    name: string,
    isCurrentPage = false,
): BreadcrumbButtonProps => {
    return buildButtonProps(
        allPlatformsRevisionDataContainers,
        id,
        name,
        isCurrentPage,
        (_) => router.push(toPlatformRevisionDataContainer({ id: _ })).then(),
        'Data Container',
        'Change Data Container',
        DataContainerIcon,
    );
};

export const buildPlatformRevisionEventButtonProps = (
    router: NextRouter,
    allPlatformsRevisionEvents: {
        id: string;
        name: string;
    }[],
    id: string,
    name: string,
    isCurrentPage = false,
): BreadcrumbButtonProps => {
    return buildButtonProps(
        allPlatformsRevisionEvents,
        id,
        name,
        isCurrentPage,
        (_) => router.push(toPlatformRevisionEvent({ id: _ })).then(),
        'Event',
        'Change Event',
        EventIcon,
    );
};

export const buildDataManagerButtonProps = (
    router: NextRouter,
    id: string,
    tagManagerId: string,
    isCurrentPage = false,
): BreadcrumbButtonProps => {
    return buildButtonPropsFromActions(
        tagManagerId === ''
            ? []
            : [
                  {
                      text: 'Tag Manager',
                      action: () => {
                          router.push(toTagManager({ id: tagManagerId })).then();
                      },
                  },
              ],
        id,
        'Data Manager',
        isCurrentPage,
        (_) => router.push(toDataManager({ id: _ })).then(),
        'Service',
        'Change Service',
        ServiceIcon,
    );
};

export const buildIngestEndpointButtonProps = (
    router: NextRouter,
    allIngestEndpoints: {
        id: string;
        name: string;
    }[],
    id: string,
    name: string,
    isCurrentPage = false,
): BreadcrumbButtonProps => {
    return buildButtonProps(
        allIngestEndpoints,
        id,
        name,
        isCurrentPage,
        (_) => router.push(toIngestEndpoint({ id: _ })).then(),
        'Ingest Endpoint',
        'Change Ingest Endpoint',
        IngestEndpointIcon,
    );
};

export const buildIngestEndpointRevisionButtonProps = (
    router: NextRouter,
    allIngestEndpointRevisions: {
        id: string;
        name: string;
    }[],
    id: string,
    name: string,
    isCurrentPage = false,
): BreadcrumbButtonProps => {
    return buildButtonProps(
        allIngestEndpointRevisions,
        id,
        name,
        isCurrentPage,
        (_) => router.push(toIngestEndpointRevision({ id: _ })).then(),
        'Revision',
        'Change Revision',
        RevisionIcon,
    );
};

export const buildTabButtonProps = (
    router: NextRouter,
    menuEntries: PageMenuButtonProps[],
    forceCurrentEntry?: string,
): BreadcrumbButtonProps => {
    const actions: BreadcrumbAction[] = menuEntries
        .filter((_) => !_.disabled)
        .map((_) => ({
            text: _.label,
            action: () => router.push(_.link).then(),
            icon: _.icon,
        }));

    const routerEntry = menuEntries.find((_) => router.asPath === _.link);

    const forcedCurrentEntry = menuEntries.find((_) => {
        return (forceCurrentEntry ?? '') === _.label;
    });

    return buildButtonPropsFromActions(
        actions,
        '',
        forcedCurrentEntry?.label ?? routerEntry?.label ?? '...',
        forceCurrentEntry === undefined,
        () => {
            if (forcedCurrentEntry !== undefined) router.push(forcedCurrentEntry.link).then();
        },
        'Tab',
        'Change Tab',
        undefined,
        forcedCurrentEntry?.icon ?? routerEntry?.icon,
    );
};
