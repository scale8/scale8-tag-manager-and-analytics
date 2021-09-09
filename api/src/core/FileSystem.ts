import fs from 'fs';

export default class FileSystem {
    public static listDirectoryNamesIn(uri: string): string[] {
        return fs
            .readdirSync(uri, {
                withFileTypes: true,
            })
            .reduce((a: string[], c) => {
                if (c.isDirectory()) {
                    a.push(c.name);
                }
                return a;
            }, []);
    }

    public static listFileNamesIn(uri: string): string[] {
        return fs
            .readdirSync(uri, {
                withFileTypes: true,
            })
            .reduce((a: string[], c) => {
                if (c.isFile()) {
                    a.push(c.name);
                }
                return a;
            }, []);
    }
}
