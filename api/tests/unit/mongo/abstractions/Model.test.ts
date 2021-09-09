import 'reflect-metadata';
import TestUtils from '../../../utils/TestUtils';
import Model from '../../../../src/mongo/abstractions/Model';
import { ModelType } from '../../../../src/mongo/types/Types';
import Field from '../../../../src/mongo/decorators/Field';

describe('Abstract Model', () => {
    class EmptyModel extends Model {}
    class TestModel1 extends Model {
        @Field<string>({
            required: true,
            exposeToGQLAs: 'first_name',
            validation: (value) => value.match(/.+/) !== null,
        })
        private _a: string;

        @Field<string>({
            required: true,
            exposeToGQLAs: 'last_name',
            validation: (value) => value.match(/.+/) !== null,
        })
        private _b: string;

        constructor(a: string, b: string) {
            super();
            this._a = a;
            this._b = b;
        }

        get a(): string {
            return this._a;
        }

        set a(value: string) {
            this._a = value;
        }

        get b(): string {
            return this._b;
        }

        set b(value: string) {
            this._b = value;
        }
    }

    beforeEach(TestUtils.beforeEachPrepareContainerAndDate);
    afterEach(TestUtils.afterEachRestoreContainerMocksAndDate);

    const modelTypesEqual = (leftModelType?: ModelType, rightModelType?: ModelType): boolean => {
        const emptyModel = new EmptyModel();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return emptyModel.modelTypesEqual(leftModelType, rightModelType);
    };

    const testModel1 = new TestModel1('a', 'b');
    const testModel1SameContent = new TestModel1('a', 'b');

    // TODO: Consider deep equality, atm it will return false as the object are different entities with the same content
    test.each`
        left          | right                    | expected
        ${'a'}        | ${'a'}                   | ${true}
        ${'a'}        | ${'b'}                   | ${false}
        ${'a'}        | ${undefined}             | ${false}
        ${testModel1} | ${testModel1}            | ${true}
        ${testModel1} | ${testModel1SameContent} | ${false}
        ${testModel1} | ${undefined}             | ${false}
    `('modelType equality is $expected when $a is compared to $b', ({ left, right, expected }) => {
        expect(modelTypesEqual(left, right)).toBe(expected);
    });
});
