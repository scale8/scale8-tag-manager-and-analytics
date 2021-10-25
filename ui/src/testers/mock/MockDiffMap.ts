import { DiffMap } from '../../types/DiffTypes';

const mockDiffMap = {
    defaultCase: new Map([
        [
            'mainFields',
            {
                fields: [
                    {
                        field: 'different field',
                        left: ['left value'],
                        right: ['right value'],
                        leftIsArray: false,
                        rightIsArray: false,
                        isRef: false,
                    },
                    {
                        field: 'added field',
                        left: [],
                        right: ['right value'],
                        leftIsArray: false,
                        rightIsArray: false,
                        isRef: false,
                    },
                    {
                        field: 'different field',
                        left: ['left value'],
                        right: ['right value'],
                        leftIsArray: false,
                        rightIsArray: false,
                        isRef: false,
                    },
                    {
                        field: 'removed field',
                        left: ['left value'],
                        right: [],
                        leftIsArray: false,
                        rightIsArray: false,
                        isRef: false,
                    },
                    {
                        field: 'added field',
                        left: [],
                        right: ['right value'],
                        leftIsArray: false,
                        rightIsArray: false,
                        isRef: false,
                    },
                    {
                        field: 'mix1',
                        left: ['right value'],
                        right: ['First Array Element'],
                        leftIsArray: false,
                        rightIsArray: true,
                        isRef: false,
                    },
                    // {
                    //     field: 'mix2',
                    //     left: ['First Array Element'],
                    //     right: [],
                    //     leftIsArray: true,
                    //     rightIsArray: false,
                    //     isRef: false,
                    // },
                    {
                        field: 'array 1',
                        left: ['First Array Element', 'Second Array Element'],
                        right: ['First Array Element'],
                        leftIsArray: true,
                        rightIsArray: true,
                        isRef: false,
                    },
                    // {
                    //     field: 'array 2',
                    //     left: ['First Array Element', 'Second Array Element'],
                    //     right: [
                    //         'First Array Element',
                    //         'Second Array Element',
                    //         'Third Array Element',
                    //     ],
                    //     leftIsArray: true,
                    //     rightIsArray: true,
                    //     isRef: false,
                    // },
                    // {
                    //     field: 'array 3',
                    //     left: ['First Array Element', 'Second Array Element'],
                    //     right: [],
                    //     leftIsArray: true,
                    //     rightIsArray: true,
                    //     isRef: false,
                    // },
                    {
                        field: 'removed field',
                        left: ['left value'],
                        right: [],
                        leftIsArray: false,
                        rightIsArray: false,
                        isRef: false,
                    },
                    {
                        field: 'field with inner change',
                        left: ['ref changed'],
                        right: ['ref changed'],
                        leftIsArray: false,
                        rightIsArray: false,
                        isRef: true,
                    },
                    {
                        field: 'dual change',
                        left: ['ref changed', 'only nested ref changed'],
                        right: ['only nested ref changed', 'other ref changed'],
                        leftIsArray: true,
                        rightIsArray: true,
                        isRef: true,
                    },
                ],
            },
        ],
        [
            'ref changed',
            {
                fields: [
                    {
                        field: 'different field',
                        left: ['left value'],
                        right: ['right value'],
                        leftIsArray: false,
                        rightIsArray: false,
                        isRef: false,
                    },
                    {
                        field: 'name',
                        left: ['aabb'],
                        right: [],
                        leftIsArray: false,
                        rightIsArray: false,
                        isRef: false,
                    },
                ],
            },
        ],
        [
            'only nested ref changed',
            {
                fields: [
                    {
                        field: 'same field',
                        left: ['nested ref changed'],
                        right: ['nested ref changed'],
                        leftIsArray: false,
                        rightIsArray: false,
                        isRef: true,
                    },
                ],
            },
        ],
        [
            'nested ref changed',
            {
                fields: [
                    {
                        field: 'different field',
                        left: ['left value'],
                        right: ['right value'],
                        leftIsArray: false,
                        rightIsArray: false,
                        isRef: false,
                    },
                ],
            },
        ],
        [
            'other ref changed',
            {
                fields: [
                    {
                        field: 'different field',
                        left: ['left value'],
                        right: ['right value'],
                        leftIsArray: false,
                        rightIsArray: false,
                        isRef: false,
                    },
                ],
            },
        ],
        [
            'ref unchanged',
            {
                fields: [
                    {
                        field: 'same field',
                        left: ['value'],
                        right: ['value'],
                        leftIsArray: false,
                        rightIsArray: false,
                        isRef: false,
                    },
                ],
            },
        ],
        [
            'other ref unchanged',
            {
                fields: [
                    {
                        field: 'same field',
                        left: ['value'],
                        right: ['value'],
                        leftIsArray: false,
                        rightIsArray: false,
                        isRef: false,
                    },
                ],
            },
        ],
    ]) as DiffMap,
};

export { mockDiffMap };
