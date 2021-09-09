import { RefId } from '../../../../../../common/models/RefId';

describe('RefId', () => {
    it('Can return as string', () => {
        expect(new RefId('foo').toString()).toBe('foo');
    });
    it('Can compare two RefIds', () => {
        const refId = new RefId('bla');
        expect(refId.equals(new RefId('bla'))).toBe(true);
        expect(refId.equals(new RefId('foo'))).toBe(false);
    });
});
