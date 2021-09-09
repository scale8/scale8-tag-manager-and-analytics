import { find, findOrElse } from '../../../../../../../common/lib/util/ObjectSearch';

describe('ObjectSearch', () => {
    it('Can find data by key in some object...', () => {
        const testData = {
            a: 1,
            b: {
                c: 2,
                e: 'foo',
                f: {
                    g: 'bla',
                    h: true,
                },
                a: 9,
                b: ['a', 'b', 'c'],
            },
            c: [
                {
                    a: 1,
                    b: 2,
                },
                {
                    a: 3,
                    b: 4,
                },
            ],
            d: [
                {
                    a: {
                        b: 3,
                    },
                },
                {
                    a: {
                        b: 4,
                    },
                },
            ],
            e: [
                {
                    a: {
                        b: [
                            {
                                c: 1,
                            },
                            {
                                c: 2,
                            },
                        ],
                    },
                },
                {
                    a: {
                        b: [
                            {
                                c: 3,
                            },
                            {
                                c: 4,
                            },
                        ],
                    },
                },
            ],
        };

        //able to find in object
        expect(find(testData, 'a')).toBe(1);
        expect(find(testData, 'b.c')).toBe(2);
        expect(find(testData, 'b.e')).toBe('foo');
        expect(find(testData, 'b.f.g')).toBe('bla');
        expect(find(testData, 'b.f.h')).toBe(true);
        expect(find(testData, 'b.a')).toBe(9);
        expect(find(testData, 'b.b')).toEqual(['a', 'b', 'c']);

        //able to find in object / object array (complex case)
        expect(find(testData, 'c.a')).toEqual([1, 3]);
        expect(find(testData, 'd.a.b')).toEqual([3, 4]);
        expect(find(testData, 'e.a.b.c')).toEqual([
            [1, 2],
            [3, 4],
        ]);

        //should be undefined
        expect(find(testData, 'b.f.h.d')).toBe(undefined);
        expect(find(testData, 'g')).toBe(undefined);
        expect(find(testData, 'g.h')).toBe(undefined);

        //find or else...
        expect(findOrElse(testData, 'g.h', 'test')).toBe('test');
        expect(findOrElse(testData, 'a', 'test')).toBe(1);
    });
});
