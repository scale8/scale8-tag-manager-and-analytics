import { GraphQLScalarType, Kind } from 'graphql';
import { ScalarType } from '../interfaces/ScalarType';
import { gql } from 'apollo-server-express';
import GQLError from '../../errors/GQLError';
import userMessages from '../../errors/UserMessages';

const DataMapValue: ScalarType = {
    def: new GraphQLScalarType({
        name: 'DataMapValue',
        description:
            'Handles valid data map values. It will return either number | string | boolean. It will also accept either number | string | boolean when used in a Query/Mutation',
        serialize: (value) => {
            if (
                typeof value === 'string' ||
                typeof value === 'number' ||
                typeof value === 'boolean'
            ) {
                return value;
            } else {
                throw new GQLError(userMessages.dataMapSerialiseError, true);
            }
        }, //to client
        parseValue: (value) => {
            if (
                typeof value === 'string' ||
                typeof value === 'number' ||
                typeof value === 'boolean'
            ) {
                return value;
            } else {
                throw new GQLError(userMessages.dataMapParseError, true);
            }
        }, //from client
        //from literal
        parseLiteral: (ast) => {
            if (ast.kind === Kind.INT) {
                return parseInt(ast.value);
            } else if (ast.kind === Kind.FLOAT) {
                return parseFloat(ast.value);
            } else if (ast.kind === Kind.STRING) {
                return ast.value;
            } else if (ast.kind === Kind.BOOLEAN) {
                return ast.value;
            } else {
                return null;
            }
        },
    }),
    type: gql`
        scalar DataMapValue
    `,
};

export default DataMapValue;
