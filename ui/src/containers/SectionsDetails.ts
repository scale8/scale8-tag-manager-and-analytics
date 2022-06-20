import { FC } from 'react';
import DmLogo from '../components/atoms/DmLogo';
import Logo, { LogoProps } from '../components/atoms/Logo';
import TmLogo from '../components/atoms/TmLogo';

export type ProductSection = {
    product: string;
    color: string;
};

export const ProductSectionKey = {
    global: Symbol.for('global'),
    tagManager: Symbol.for('tagManager'),
    dataManager: Symbol.for('dataManager'),
    admin: Symbol.for('admin'),
};

export const productSectionMap = new Map<symbol, ProductSection>([
    [
        ProductSectionKey.global,
        {
            product: 'Scale 8 Global',
            color: '#9042e7',
        },
    ],
    [
        ProductSectionKey.tagManager,
        {
            product: 'Tag Manager',
            color: '#39cce0',
        },
    ],
    [
        ProductSectionKey.dataManager,
        {
            product: 'Data Manager',
            color: '#ff0084',
        },
    ],
    [
        ProductSectionKey.admin,
        {
            product: 'Scale 8 Admin',
            color: '#fab300',
        },
    ],
]);

export const getProductSection = (key: symbol): ProductSection => {
    const section = productSectionMap.get(key);
    if (section === undefined) {
        throw new Error('Invalid Section');
    }

    return section;
};

export const SectionKey = {
    loggedOut: Symbol.for('loggedOut'),
    admin: Symbol.for('admin'),
    orgSelect: Symbol.for('orgSelect'),
    org: Symbol.for('org'),
    tagManager: Symbol.for('tagManager'),
    app: Symbol.for('app'),
    appRevision: Symbol.for('appRevision'),
    tag: Symbol.for('tag'),
    globalAction: Symbol.for('globalAction'),
    globalTrigger: Symbol.for('globalTrigger'),
    platform: Symbol.for('platform'),
    platformEvent: Symbol.for('platformEvent'),
    platformAction: Symbol.for('platformAction'),
    platformDataContainer: Symbol.for('platformDataContainer'),
    customPlatformRevision: Symbol.for('customPlatformRevision'),
    templatedPlatformRevision: Symbol.for('templatedPlatformRevision'),
    dataManager: Symbol.for('dataManager'),
    ingestEndpoint: Symbol.for('ingestEndpoint'),
    ingestEndpointRevision: Symbol.for('ingestEndpointRevision'),
};

export type SectionDetails = {
    entityName: string;
    productSectionKey: symbol;
};

export const sectionDetailsMap = new Map<symbol, SectionDetails>([
    [
        SectionKey.loggedOut,
        {
            entityName: 'None',
            productSectionKey: ProductSectionKey.global,
        },
    ],
    [
        SectionKey.admin,
        {
            entityName: 'Admin',
            productSectionKey: ProductSectionKey.admin,
        },
    ],
    [
        SectionKey.orgSelect,
        {
            entityName: 'Organization',
            productSectionKey: ProductSectionKey.global,
        },
    ],
    [
        SectionKey.org,
        {
            entityName: 'Organization',
            productSectionKey: ProductSectionKey.global,
        },
    ],
    [
        SectionKey.tagManager,
        {
            entityName: 'Tag Manager',
            productSectionKey: ProductSectionKey.tagManager,
        },
    ],
    // App
    [
        SectionKey.app,
        {
            entityName: 'App',
            productSectionKey: ProductSectionKey.tagManager,
        },
    ],
    [
        SectionKey.appRevision,
        {
            entityName: 'Revision',
            productSectionKey: ProductSectionKey.tagManager,
        },
    ],
    [
        SectionKey.tag,
        {
            entityName: 'Tag',
            productSectionKey: ProductSectionKey.tagManager,
        },
    ],
    [
        SectionKey.globalAction,
        {
            entityName: 'Global Action',
            productSectionKey: ProductSectionKey.tagManager,
        },
    ],
    [
        SectionKey.globalTrigger,
        {
            entityName: 'Global Trigger',
            productSectionKey: ProductSectionKey.tagManager,
        },
    ],
    // Platform
    [
        SectionKey.platform,
        {
            entityName: 'Platform',
            productSectionKey: ProductSectionKey.tagManager,
        },
    ],
    [
        SectionKey.platformEvent,
        {
            entityName: 'Event',
            productSectionKey: ProductSectionKey.tagManager,
        },
    ],
    [
        SectionKey.platformAction,
        {
            entityName: 'Action',
            productSectionKey: ProductSectionKey.tagManager,
        },
    ],
    [
        SectionKey.platformDataContainer,
        {
            entityName: 'Data Container',
            productSectionKey: ProductSectionKey.tagManager,
        },
    ],
    [
        SectionKey.customPlatformRevision,
        {
            entityName: 'Revision',
            productSectionKey: ProductSectionKey.tagManager,
        },
    ],
    [
        SectionKey.templatedPlatformRevision,
        {
            entityName: 'Revision',
            productSectionKey: ProductSectionKey.tagManager,
        },
    ],
    // Data Manager
    [
        SectionKey.dataManager,
        {
            entityName: 'Data Manager',
            productSectionKey: ProductSectionKey.dataManager,
        },
    ],
    [
        SectionKey.ingestEndpoint,
        {
            entityName: 'Ingest Endpoint',
            productSectionKey: ProductSectionKey.dataManager,
        },
    ],
    [
        SectionKey.ingestEndpointRevision,
        {
            entityName: 'Revision',
            productSectionKey: ProductSectionKey.dataManager,
        },
    ],
]);

export const platformSections = [
    SectionKey.platform,
    SectionKey.platformEvent,
    SectionKey.platformAction,
    SectionKey.platformDataContainer,
    SectionKey.customPlatformRevision,
    SectionKey.templatedPlatformRevision,
];

export const appRevisionSections = [
    SectionKey.appRevision,
    SectionKey.tag,
    SectionKey.globalAction,
    SectionKey.globalTrigger,
];

export const ingestRevisionSections = [SectionKey.ingestEndpointRevision];

export const getSectionDetails = (key: symbol): SectionDetails => {
    const section = sectionDetailsMap.get(key);
    if (section === undefined) {
        throw new Error('Invalid Section');
    }

    return section;
};

export const navigationColorFromSectionLocator = (sectionKey: symbol | undefined): string => {
    if (sectionKey === undefined) {
        return '#000000';
    }
    const sectionDetails = getSectionDetails(sectionKey);
    const productSection = getProductSection(sectionDetails.productSectionKey);
    return productSection.color;
};

export const logoFromSectionLocator = (sectionKey: symbol | undefined): FC<LogoProps> => {
    if (sectionKey === undefined) {
        return Logo;
    }
    const sectionDetails = getSectionDetails(sectionKey);
    if (sectionDetails.productSectionKey === ProductSectionKey.tagManager) {
        return TmLogo;
    }

    if (sectionDetails.productSectionKey === ProductSectionKey.dataManager) {
        return DmLogo;
    }

    return Logo;
};

export const gradientFromSectionLocator = (sectionKey: symbol | undefined): string => {
    const globalGradient = 'conic-gradient(at 0% 60%, black 5%, #9042e7 35%, black 55%)';

    if (sectionKey === undefined) {
        return globalGradient;
    }
    const sectionDetails = getSectionDetails(sectionKey);

    if (sectionDetails.productSectionKey === ProductSectionKey.admin) {
        return 'conic-gradient(at 0% 60%, black 5%, #fab300 35%, black 55%)';
    }

    if (sectionDetails.productSectionKey === ProductSectionKey.tagManager) {
        return 'conic-gradient(at 0% 60%, black 5%, #39cce0 35%, black 55%)';
    }

    if (sectionDetails.productSectionKey === ProductSectionKey.dataManager) {
        return 'conic-gradient(at 0% 60%, black 5%, #ff0084 35%, black 55%)';
    }

    return globalGradient;
};
