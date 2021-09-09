import IngestEndpointDataMap from '../mongo/models/data/IngestEndpointDataMap';
import {
    IngestEndpointDataMapSchema,
    IngestEndpointDataMapValidationSchema,
} from '../mongo/types/Types';
import ScalarContainer from '../mongo/custom/ScalarContainer';
import container from '../container/IOC.config';
import RepoFromModelFactory from '../container/factoryTypes/RepoFromModelFactory';
import TYPES from '../container/IOC.types';
import User from '../mongo/models/User';
import IngestEndpointRevision from '../mongo/models/data/IngestEndpointRevision';
import userMessages from '../errors/UserMessages';
import GQLError from '../errors/GQLError';
import S8VarTypeValidation from '../core/S8VarTypeValidation';
import S8ValidatorValidation from '../core/S8ValidatorValidation';
import { VarType } from '../enums/VarType';
import { DataMapValue } from '../../../common/types/Types';

export const getDefaultValue = (
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

export const createIngestEndpointDataMapValidationSchema = async (
    ingestEndpointDataMaps: IngestEndpointDataMap[],
): Promise<IngestEndpointDataMapValidationSchema[]> => {
    const repoFactory = container.get<RepoFromModelFactory>(TYPES.RepoFromModelFactory);

    const convert = async (
        map: IngestEndpointDataMap,
        parentKey?: string,
    ): Promise<IngestEndpointDataMapValidationSchema[]> => {
        const combined = parentKey === undefined ? map.key : `${parentKey}.${map.key}`;
        const schema: IngestEndpointDataMapValidationSchema = {
            parent: parentKey === undefined ? null : parentKey,
            key: map.key,
            combined: combined,
            type: map.varType,
            var_type: map.varType,
            default:
                map.defaultValue instanceof ScalarContainer
                    ? map.defaultValue.arr
                    : map.defaultValue,
            default_value:
                map.defaultValue instanceof ScalarContainer
                    ? map.defaultValue.arr
                    : map.defaultValue,
            required: !map.isOptional,
            repeated: map.varType.match(/array/i) !== null,
            validations: map.validations || [],
        };
        //ARRAY_OBJECT = OBJECT + REPEATED... (in line with DB engines)
        if (map.varType === VarType.OBJECT || map.varType === VarType.ARRAY_OBJECT) {
            //if repeated, then array of objects... (Object Array)
            const childMaps = await repoFactory(IngestEndpointDataMap).findByIds(
                map.childIngestEndpointDataMapIds,
            );
            return [
                schema,
                ...(await Promise.all(childMaps.map(async (_) => convert(_, combined)))).flat(),
            ];
        } else {
            return [schema];
        }
    };
    return (await Promise.all(ingestEndpointDataMaps.map((_) => convert(_)))).flat();
};

export const createIngestEndpointDataMapFromSchemas = async (
    actor: User,
    ingestEndpointDataMapSchemas: IngestEndpointDataMapSchema[],
    attachment: IngestEndpointRevision | IngestEndpointDataMap,
): Promise<IngestEndpointDataMap[]> => {
    const repoFactory = container.get<RepoFromModelFactory>(TYPES.RepoFromModelFactory);

    const revision: IngestEndpointRevision =
        attachment instanceof IngestEndpointRevision
            ? attachment
            : await repoFactory(IngestEndpointRevision).findByIdThrows(
                  attachment.ingestEndpointRevisionId,
                  userMessages.revisionFailed,
              );

    const createIngestEndpointDataMap = async (
        schema: IngestEndpointDataMapSchema,
    ): Promise<IngestEndpointDataMap> => {
        const createChildDataMaps = async (): Promise<IngestEndpointDataMap[] | undefined> => {
            if (schema.varType === VarType.OBJECT || schema.varType === VarType.ARRAY_OBJECT) {
                //process children...
                const childSchemas = schema.children === undefined ? [] : schema.children;
                //we need to de-dupe this (filter) then map this out to create list of children...
                return Promise.all(
                    childSchemas
                        .filter(
                            (item, pos, self) => self.findIndex((_) => _.key === item.key) === pos,
                        )
                        .map((_) => createIngestEndpointDataMap(_)),
                );
            } else {
                return undefined;
            }
        };
        return await repoFactory(IngestEndpointDataMap).save(
            new IngestEndpointDataMap(
                schema.key,
                revision,
                schema.varType,
                await createChildDataMaps(),
                schema.defaultValue,
                schema.optional === undefined ? false : schema.optional,
                schema.validations,
            ),
            actor,
        );
    };

    const getExistingDataMaps = async (): Promise<IngestEndpointDataMap[]> => {
        //at the point of attachment, check key does not already exist...
        if (attachment instanceof IngestEndpointRevision) {
            //get all datamaps linked to this revision...
            return await repoFactory(IngestEndpointDataMap).findByIds(
                attachment.ingestEndpointDataMapIds,
            );
        } else {
            return await repoFactory(IngestEndpointDataMap).findByIds(
                attachment.childIngestEndpointDataMapIds,
            );
        }
    };

    //before building, a quick sanity check to de-duplicate at this level...
    const existingDataMaps = await getExistingDataMaps();

    ingestEndpointDataMapSchemas.forEach((_) => {
        if (existingDataMaps.find((existing) => _.key === existing.key) !== undefined) {
            //we already have this data map, so throw and error...
            throw new GQLError(userMessages.duplicateKey(_.key), true);
        }
    });

    const newDataMaps = await Promise.all(
        ingestEndpointDataMapSchemas.map((_) => createIngestEndpointDataMap(_)),
    );

    //finally, lets bind this back to the parent
    if (attachment instanceof IngestEndpointRevision) {
        attachment.ingestEndpointDataMapIds = [
            ...attachment.ingestEndpointDataMapIds,
            ...newDataMaps.map((_) => _.id),
        ];
        await repoFactory(IngestEndpointRevision).save(attachment, actor);
    } else {
        attachment.childIngestEndpointDataMapIds = [
            ...attachment.childIngestEndpointDataMapIds,
            ...newDataMaps.map((_) => _.id),
        ];
        await repoFactory(IngestEndpointDataMap).save(attachment, actor);
    }

    return newDataMaps;
};

export const createIngestEndpointDataMapSchemasFromGQLInput = async (
    actor: User,
    attachment: IngestEndpointRevision | IngestEndpointDataMap,
    ingestEndpointDataMapInputs: { [k: string]: any }[],
): Promise<IngestEndpointDataMap[]> => {
    const ingestEndpointDataMapInputToIngestEndpointDataMapSchema = (ingestEndpointDataMapInput: {
        [k: string]: any;
    }): IngestEndpointDataMapSchema => {
        const varType = ingestEndpointDataMapInput.var_type;
        const defaultValue = getDefaultValue(
            ingestEndpointDataMapInput.default_value,
            ingestEndpointDataMapInput.default_values,
        );
        if (!S8VarTypeValidation.checkIngestVarTypeAndDefaultValueAlign(varType, defaultValue)) {
            throw new GQLError('VarType and Default Value are not aligned');
        }
        const validationRules = ingestEndpointDataMapInput.validation_rules;
        const validationRuleIssues = S8ValidatorValidation.testValidationRules(validationRules);
        if (validationRuleIssues.length > 0) {
            throw new GQLError(validationRuleIssues[0], true);
        }
        return {
            key: ingestEndpointDataMapInput.key,
            varType: varType,
            defaultValue: defaultValue,
            children:
                ingestEndpointDataMapInput.child_ingest_endpoint_data_maps === undefined
                    ? []
                    : (
                          ingestEndpointDataMapInput.child_ingest_endpoint_data_maps as {
                              [k: string]: any;
                          }[]
                      ).map((_) => ingestEndpointDataMapInputToIngestEndpointDataMapSchema(_)),
            optional: ingestEndpointDataMapInput.optional === true,
            validations: validationRules,
        };
    };
    return createIngestEndpointDataMapFromSchemas(
        actor,
        ingestEndpointDataMapInputs.map((_) =>
            ingestEndpointDataMapInputToIngestEndpointDataMapSchema(_),
        ),
        attachment,
    );
};
