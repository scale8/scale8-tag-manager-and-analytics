import S8VarTypeValidation from '../../../src/core/S8VarTypeValidation';
import {
    DataManagerDateTimeMacros,
    DataManagerIntegerMacros,
    DataManagerStringMacros,
    DataManagerTimestampMacros,
} from '../../../src/enums/DataManagerMacros';
import { VarType } from '../../../src/enums/VarType';
import ScalarContainer from '../../../src/mongo/custom/ScalarContainer';
import { GQLScalar } from '../../../src/mongo/types/Types';

describe('S8VarTypeValidation', () => {
    const buildSC = (a: any, b: any): ScalarContainer<GQLScalar> => {
        return new ScalarContainer(a, b);
    };

    test.each`
        varType                 | defaultValue                                    | expected
        ${VarType.STRING}       | ${DataManagerStringMacros.S8_BROWSER_NAME}      | ${true}
        ${VarType.STRING}       | ${'test String'}                                | ${true}
        ${VarType.STRING}       | ${10}                                           | ${false}
        ${VarType.INT}          | ${DataManagerIntegerMacros.S8_RANDOM_INTEGER}   | ${true}
        ${VarType.INT}          | ${10}                                           | ${true}
        ${VarType.INT}          | ${10.1}                                         | ${false}
        ${VarType.INT}          | ${'test String'}                                | ${false}
        ${VarType.FLOAT}        | ${10}                                           | ${true}
        ${VarType.FLOAT}        | ${10.1}                                         | ${true}
        ${VarType.FLOAT}        | ${'test String'}                                | ${false}
        ${VarType.BOOLEAN}      | ${true}                                         | ${true}
        ${VarType.BOOLEAN}      | ${10}                                           | ${false}
        ${VarType.BOOLEAN}      | ${'test String'}                                | ${false}
        ${VarType.DATETIME}     | ${DataManagerDateTimeMacros.S8_DATE_TIME_UTC}   | ${true}
        ${VarType.DATETIME}     | ${'2021-01-01 00:00:00'}                        | ${true}
        ${VarType.DATETIME}     | ${1627426986}                                   | ${false}
        ${VarType.DATETIME}     | ${new Date()}                                   | ${false}
        ${VarType.DATETIME}     | ${10.1}                                         | ${false}
        ${VarType.DATETIME}     | ${'test String'}                                | ${false}
        ${VarType.TIMESTAMP}    | ${DataManagerTimestampMacros.S8_TIME_STAMP_UTC} | ${true}
        ${VarType.TIMESTAMP}    | ${1627426986}                                   | ${true}
        ${VarType.TIMESTAMP}    | ${'2021-01-01 00:00:00'}                        | ${false}
        ${VarType.TIMESTAMP}    | ${new Date()}                                   | ${false}
        ${VarType.TIMESTAMP}    | ${10.1}                                         | ${false}
        ${VarType.TIMESTAMP}    | ${'test String'}                                | ${false}
        ${VarType.ARRAY_STRING} | ${buildSC('s1', 's2')}                          | ${true}
        ${VarType.ARRAY_STRING} | ${buildSC('test String', 10)}                   | ${false}
        ${VarType.ARRAY_INT}    | ${buildSC(10, 20)}                              | ${true}
        ${VarType.ARRAY_INT}    | ${buildSC(10, 10.1)}                            | ${false}
        ${VarType.ARRAY_INT}    | ${buildSC(10, 'test String')}                   | ${false}
        ${VarType.ARRAY_FLOAT}  | ${buildSC(10, 20)}                              | ${true}
        ${VarType.ARRAY_FLOAT}  | ${buildSC(10, 10.1)}                            | ${true}
        ${VarType.ARRAY_FLOAT}  | ${buildSC(10, 'test String')}                   | ${false}
    `(
        'returns $expected with varType $varType and defaultValue $defaultValue',
        ({ varType, defaultValue, expected }) => {
            expect(
                S8VarTypeValidation.checkIngestVarTypeAndDefaultValueAlign(varType, defaultValue),
            ).toStrictEqual(expected);
        },
    );
});
