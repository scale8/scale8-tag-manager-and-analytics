import { BuildPlatformDataMapSchema } from '../mongo/types/Types';
import ScalarContainer from '../mongo/custom/ScalarContainer';
import S8ValidatorValidation from '../core/S8ValidatorValidation';
import GQLError from '../errors/GQLError';
import User from '../mongo/models/User';
import PlatformRevision from '../mongo/models/tag/PlatformRevision';
import PlatformDataMap from '../mongo/models/tag/PlatformDataMap';
import container from '../container/IOC.config';
import RepoFromModelFactory from '../container/factoryTypes/RepoFromModelFactory';
import TYPES from '../container/IOC.types';
import { getVarTypeFromInputType } from './VarTypeUtils';
import { DataMapValue } from '../../../common/types/Types';

export const covertPlatformDataMapInputToBuildSchema = (
    dataMapInput: any,
): BuildPlatformDataMapSchema => {
    const getDefaultValue = (
        defaultValue: DataMapValue,
        defaultValues: DataMapValue[],
    ): DataMapValue | ScalarContainer<DataMapValue> | undefined => {
        if (defaultValue !== undefined) {
            return defaultValue;
        } else if (defaultValues !== undefined) {
            return new ScalarContainer(...defaultValues);
        } else {
            return undefined;
        }
    };
    const validationRules = dataMapInput.validation_rules;
    const validationRuleIssues = S8ValidatorValidation.testValidationRules(validationRules);
    if (validationRuleIssues.length > 0) {
        throw new GQLError(validationRuleIssues[0], true);
    }
    return {
        key: dataMapInput.key,
        icon: dataMapInput.icon,
        description: dataMapInput.description,
        persistence_id: dataMapInput.persistence_id,
        input_type: dataMapInput.input_type,
        default_value: getDefaultValue(dataMapInput.default_value, dataMapInput.default_values),
        child_platform_data_maps:
            dataMapInput.child_platform_data_maps === undefined
                ? []
                : dataMapInput.child_platform_data_maps.map((_: any) =>
                      covertPlatformDataMapInputToBuildSchema(_),
                  ),
        optional: dataMapInput.optional,
        option_values:
            dataMapInput.option_values === undefined
                ? undefined
                : new ScalarContainer(...dataMapInput.option_values),
        validations: validationRules,
    };
};

export const covertPlatformDataMapInputsToBuildSchema = (
    dataMapInputs?: any[],
): BuildPlatformDataMapSchema[] => {
    if (dataMapInputs === undefined) {
        return [];
    } else {
        return dataMapInputs.map((_) => covertPlatformDataMapInputToBuildSchema(_));
    }
};

export const convertBuildPlatformDataMapSchemaToPlatformDataMap = async (
    actor: User,
    buildPlatformDataMapSchema: BuildPlatformDataMapSchema,
    platformRevision: PlatformRevision,
): Promise<PlatformDataMap> => {
    const repoFactory = container.get<RepoFromModelFactory>(TYPES.RepoFromModelFactory);

    const platformDataMap = new PlatformDataMap(
        buildPlatformDataMapSchema.key,
        buildPlatformDataMapSchema.description,
        platformRevision,
        getVarTypeFromInputType(buildPlatformDataMapSchema.input_type),
        buildPlatformDataMapSchema.input_type,
        await Promise.all(
            (buildPlatformDataMapSchema.child_platform_data_maps || []).map((_) =>
                convertBuildPlatformDataMapSchemaToPlatformDataMap(actor, _, platformRevision),
            ),
        ),
        buildPlatformDataMapSchema.default_value,
        buildPlatformDataMapSchema.optional === undefined
            ? false
            : buildPlatformDataMapSchema.optional,
        buildPlatformDataMapSchema.option_values,
        buildPlatformDataMapSchema.icon,
        buildPlatformDataMapSchema.validations,
    );
    if (buildPlatformDataMapSchema.persistence_id !== undefined) {
        platformDataMap._persisting_id = buildPlatformDataMapSchema.persistence_id;
    }
    return await repoFactory(PlatformDataMap).save(platformDataMap, actor);
};
