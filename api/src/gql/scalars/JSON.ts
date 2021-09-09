import { ScalarType } from '../interfaces/ScalarType';
import { gql } from 'apollo-server-express';
import GraphQLJSON from 'graphql-type-json';

const JSON: ScalarType = {
    def: GraphQLJSON,
    type: gql`
        scalar JSON
    `,
};

export default JSON;
