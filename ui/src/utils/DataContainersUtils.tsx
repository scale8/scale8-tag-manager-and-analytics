import { AppPlatformRevision } from '../types/TagRulesTypes';
import { getDataContainersIcon, getDataMapsIcon } from './TypeIconsUtils';
import { SelectValueWithSub } from '../hooks/form/useFormValidation';
import { DataContainer, PlatformDataMap } from '../types/DataMapsTypes';
import { platformDataMapsToSubAndDeeper } from './PlatformDataMapsUtils';

export const getAvailableDataContainers = (
    appPlatformRevisions: AppPlatformRevision[] | undefined,
): DataContainer[] => {
    return appPlatformRevisions === undefined
        ? []
        : appPlatformRevisions.reduce((accumulator: DataContainer[], currentValue) => {
              return [
                  ...accumulator,
                  ...currentValue.platform_revision.platform_data_containers,
              ] as DataContainer[];
          }, []);
};

export const buildDataContainersSelectValues = (
    appPlatformRevisions: AppPlatformRevision[] | undefined,
): SelectValueWithSub[] => {
    return appPlatformRevisions === undefined
        ? []
        : appPlatformRevisions.map((_) => ({
              key: _.platform_revision.platform.id,
              text: _.platform_revision.platform.name,
              sub: _.platform_revision.platform_data_containers.map((c) => {
                  const Icon = getDataContainersIcon(c.icon);

                  return {
                      key: c.id,
                      text: c.name,
                      iconType: c.icon,
                      icon: <Icon />,
                      description: c.description,
                  };
              }) as SelectValueWithSub[],
          }));
};

export const platformDataMapsToSelectValues = (
    platformDataMaps: PlatformDataMap[],
): SelectValueWithSub[] => {
    return platformDataMapsToSubAndDeeper(platformDataMaps).map((subAndDeeper) => {
        const MainIcon = getDataMapsIcon(subAndDeeper.icon);

        return {
            key: subAndDeeper.id,
            text: subAndDeeper.keys.join('.'),
            iconType: subAndDeeper.sub === undefined ? subAndDeeper.icon ?? undefined : undefined,
            icon: subAndDeeper.sub === undefined ? <MainIcon /> : undefined,
            sub: subAndDeeper.sub?.map((sub) => {
                const SubIcon = getDataMapsIcon(sub.icon);
                return {
                    key: sub.id,
                    text: sub.key,
                    iconType: sub.icon ?? undefined,
                    icon: <SubIcon />,
                };
            }),
        };
    });
};
