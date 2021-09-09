import { DataContainer } from '../types/DataMapsTypes';
import { platformDataMapsToSelectValuesFilteredWithPath } from './PlatformDataMapsUtils';
import { DataContainersFilteredPlatform } from '../components/molecules/DataMapsValueEdit';
import { AppPlatformRevision } from '../types/TagRulesTypes';
import { VarType } from '../gql/generated/globalTypes';

const buildDataContainersFilteredPlatforms = (
    appPlatformRevisions: AppPlatformRevision[] | undefined,
    varType: VarType,
    allowRawObjects = false,
): DataContainersFilteredPlatform[] => {
    return appPlatformRevisions === undefined
        ? []
        : appPlatformRevisions
              .map((_) => ({
                  id: _.platform_revision.platform.id,
                  name: _.platform_revision.platform.name,
                  containers: _.platform_revision.platform_data_containers
                      .map((dataContainer: DataContainer) => ({
                          id: dataContainer.persisting_id,
                          name: dataContainer.name,
                          allowCustom: dataContainer.allow_custom,
                          elements: platformDataMapsToSelectValuesFilteredWithPath(
                              dataContainer.platform_data_maps,
                              varType,
                              allowRawObjects,
                          ),
                      }))
                      .filter((_) => _.elements.length > 0 || _.allowCustom),
              }))
              .filter((_) => _.containers.length > 0);
};

export { buildDataContainersFilteredPlatforms };
