import Hash from '../../../src/core/Hash';

describe('Hash', () => {
    it('should generate a static, final hash', () => {
        const newHash = Hash.hashString('abcdefg');
        const sameHash = Hash.hashString('abcdefg');
        expect(newHash).toBe(sameHash);
        const newHashSalted = Hash.hashString('abcdefg', 'zxy');
        const sameHashSalted = Hash.hashString('abcdefg', 'zxy');
        expect(newHashSalted).toBe(sameHashSalted);
    });
    it('should be able to generate completely random hashes, so now two are the same', () => {
        const setOfHashes: Set<string> = new Set();
        let found = false;
        for (let i = 0; i < 100000; i++) {
            const newRandomHash = Hash.randomHash();
            if (setOfHashes.has(newRandomHash)) {
                found = true;
            } else {
                setOfHashes.add(newRandomHash);
            }
        }
        expect(found).toBe(false);
    });
});
