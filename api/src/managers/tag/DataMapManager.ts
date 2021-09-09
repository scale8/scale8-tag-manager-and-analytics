import Manager from '../../abstractions/Manager';
import { injectable } from 'inversify';
import { gql } from 'apollo-server-express';
import DataMap from '../../mongo/models/tag/DataMap';
import CTX from '../../gql/ctx/CTX';
import { ObjectID } from 'mongodb';
import ScalarContainer from '../../mongo/custom/ScalarContainer';
import RepeatedDataMap from '../../mongo/models/tag/RepeatedDataMap';
import userMessages from '../../errors/UserMessages';
import { VarType } from '../../enums/VarType';

@injectable()
export default class DataMapManager extends Manager<DataMap> {
    protected gqlSchema = gql`
        """
        @type
        Used as a container object
        """
        type DataMapValueContainerArray {
            """
            Contains a list of \`DataMapValue\`
            """
            values: [DataMapValue!]
        }
        """
        @type
        Used as a container object
        """
        type DataMapValueContainer {
            """
            Contains a \`DataMapValue\`
            """
            value: DataMapValue
        }
        """
        @type
        Used as a container object
        """
        type DataMapObject {
            """
            Contains a list of \`DataMap\`
            """
            object: [DataMap!]!
        }
        """
        @type
        Used as a container object
        """
        type DataMapObjects {
            """
            Contains a list of lists of \`DataMap\`. This implements repeated object patterns.
            """
            objects: [[DataMap!]!]!
        }

        """
        @union
        """
        union DataMapValueEntity =
              DataMapValueContainer
            | DataMapValueContainerArray
            | DataMapObject
            | DataMapObjects

        input DataMapInput {
            """
            \`DataMap\` key
            """
            key: String!
            """
            \`DataMap\` variable type (string, int, boolean, array of strings, object etc.)
            """
            var_type: VarType!
            """
            A single value, string, int, boolean etc.
            """
            value: DataMapValue
            """
            An array of values, string[], int[], boolean[] etc.
            """
            values: [DataMapValue!]
            """
            A single object, {...}
            """
            children: [DataMapInput!]
            """
            An array of objects, {...}[]
            """
            repeated_children: [[DataMapInput!]]
        }

        """
        @model
        """
        type DataMap {
            """
            \`DataMap\` ID
            """
            id: ID!
            """
            \`DataMap\` key
            """
            key: String!
            """
            \`DataMap\` variable type (string, int, boolean, array of strings, object etc.)
            """
            var_type: VarType!
            """
            \`DataMap\` value
            """
            value: DataMapValueEntity #=String, Int, Float, String[], Int[] ... && Object | Object[]
        }
    `;

    // noinspection JSUnusedGlobalSymbols
    /**
     * Custom Resolvers
     * @protected
     */
    protected gqlCustomResolvers = {
        DataMap: {
            value: async (parent: any, args: any, ctx: CTX) => {
                const dataMap = await this.repoFactory(DataMap).findByIdThrows(
                    new ObjectID(parent.id),
                    userMessages.dataMapFailed,
                );
                return this.orgAuth.asUserWithViewAccess(ctx, dataMap.orgId, async () => {
                    const value = dataMap.value;
                    if (dataMap.varType === VarType.OBJECT) {
                        //we have to sort children...
                        return {
                            object: (
                                await this.repoFactory(DataMap).findByIds(dataMap.childDataMapIds)
                            ).map((_) => _.toGQLType()),
                        };
                    } else if (dataMap.varType === VarType.ARRAY_OBJECT) {
                        const repeatedDataMaps = await this.repoFactory(RepeatedDataMap).findByIds(
                            dataMap.repeatedDataMapIds,
                        );
                        return {
                            objects: await Promise.all(
                                repeatedDataMaps.map(async (repeatedDataMap) => {
                                    return (
                                        await this.repoFactory(DataMap).findByIds(
                                            repeatedDataMap.repeatedChildDataMapIds,
                                        )
                                    ).map((_) => _.toGQLType());
                                }),
                            ),
                        };
                    } else if (value === undefined) {
                        return undefined;
                    } else if (value instanceof ScalarContainer) {
                        return { values: value.arr };
                    } else {
                        return { value: value };
                    }
                });
            },
        },
        DataMapValueEntity: {
            __resolveType: (obj: any) => {
                if (obj.values !== undefined) {
                    return 'DataMapValueContainerArray';
                } else if (obj.value !== undefined) {
                    return 'DataMapValueContainer';
                } else if (obj.object) {
                    return 'DataMapObject';
                } else if (obj.objects) {
                    return 'DataMapObjects';
                } else {
                    return null;
                }
            },
        },
    };
}
