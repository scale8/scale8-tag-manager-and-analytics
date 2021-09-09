import { SchemaDirectiveVisitor } from 'apollo-server-express';
import {
    defaultFieldResolver,
    GraphQLField,
    GraphQLInterfaceType,
    GraphQLObjectType,
} from 'graphql';
import CTX from '../ctx/CTX';
import PermissionsError from '../../errors/PermissionsError';
import userMessages from '../../errors/UserMessages';

export default class AuthDirective extends SchemaDirectiveVisitor {
    visitObject(object: GraphQLObjectType): GraphQLObjectType | void | null {
        super.visitObject(object);
        this.ensureFieldsWrapped(object);
        (object as any)._requiredAuthRole = this.args.requires;
        return;
    }

    visitFieldDefinition(
        field: GraphQLField<any, any>,
        details: { objectType: GraphQLObjectType | GraphQLInterfaceType },
    ): GraphQLField<any, any> | void | null {
        super.visitFieldDefinition(field, details);
        this.ensureFieldsWrapped(details.objectType);
        (field as any)._requiredAuthRole = this.args.requires;
        return;
    }

    ensureFieldsWrapped(objectType: GraphQLObjectType | GraphQLInterfaceType): void {
        if ((objectType as any)._authFieldsWrapped) {
            return;
        }
        (objectType as any)._authFieldsWrapped = true;

        const fields = objectType.getFields();

        Object.keys(fields).forEach((fieldName) => {
            const field = fields[fieldName];
            const { resolve = defaultFieldResolver } = field;

            field.resolve = async function (...args: [any, { [key: string]: any }, CTX, any]) {
                const requiredRole =
                    (field as any)._requiredAuthRole || (objectType as any)._requiredAuthRole;

                const ctx = args[2];

                const hasRequiredRole: () => boolean = () => {
                    if (requiredRole === 'ADMIN' && ctx.user !== null && ctx.user.isAdmin) {
                        return true;
                    } else if (requiredRole === 'USER' && ctx.user !== null) {
                        return true;
                    }
                    return false;
                };

                if (!hasRequiredRole()) {
                    throw new PermissionsError(
                        "AuthDirective - User doesn't meet role requirements",
                        userMessages.unmatchedRoleRequirements,
                    );
                }
                return resolve.apply(this, args);
            };
        });
    }
}
