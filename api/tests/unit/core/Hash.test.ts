import Hash from '../../../src/core/Hash';

describe('Hash', () => {
    it('should generate a static, final hash', () => {
        const newHash = Hash.hashString('abcdefg', 'T3st1n9');
        const sameHash = Hash.hashString('abcdefg', 'T3st1n9');
        expect(newHash).toBe(sameHash);
        const newHashOtherSalt = Hash.hashString('abcdefg', 'zxy');
        const sameHashOtherSalt = Hash.hashString('abcdefg', 'zxy');
        expect(newHashOtherSalt).toBe(sameHashOtherSalt);
        expect(newHashOtherSalt).not.toBe(newHash);
    });
    it('should be able to generate completely random hashes, so now two are the same', () => {
        const setOfHashes: Set<string> = new Set();
        let found = false;
        for (let i = 0; i < 100000; i++) {
            const newRandomHash = Hash.randomHash('T3st1n9');
            if (setOfHashes.has(newRandomHash)) {
                found = true;
            } else {
                setOfHashes.add(newRandomHash);
            }
        }
        expect(found).toBe(false);
    });
});
