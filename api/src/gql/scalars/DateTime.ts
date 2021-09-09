import { GraphQLScalarType, Kind } from 'graphql';
import { ScalarType } from '../interfaces/ScalarType';
import { gql } from 'apollo-server-express';
import parse from 'date-fns/parse';

const parseValue = (value: string | number): number => {
    if (typeof value === 'string') {
        if (value.match(/^\d+$/) !== null) {
            return parseInt(value, 10);
        } else if (value.match(/^[+-]?\d+s$/) !== null) {
            return new Date().getTime() + parseInt(value.slice(0, -1), 10) * 1000;
        } else if (value.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/) !== null) {
            return parse(value, 'yyyy-MM-dd', new Date()).getTime();
        } else if (
            value.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}$/) !== null
        ) {
            return parse(value, 'yyyy-MM-dd HH:mm:ss', new Date()).getTime();
        } else {
            throw new Error('Invalid date input format.');
        }
    } else {
        return value;
    }
};

const DateTime: ScalarType = {
    def: new GraphQLScalarType({
        name: 'DateTime',
        description: 'Handles date-time',
        serialize: (value: Date) => value.getTime(), //to client
        parseValue: (value) => new Date(parseValue(value)), //from client
        //from literal
        parseLiteral: (ast) => {
            if (ast.kind === Kind.STRING) {
                return parseValue(ast.value);
            }
            return null;
        },
    }),
    type: gql`
        scalar DateTime
    `,
};

export default DateTime;
