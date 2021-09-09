import { DocumentNode, GraphQLScalarType } from 'graphql';

export interface ScalarType {
    def: GraphQLScalarType;
    type: DocumentNode;
}
