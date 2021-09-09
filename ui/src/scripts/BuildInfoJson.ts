import * as fs from 'fs';
import * as path from 'path';

const infoFolder = __dirname + '/../info/';

const infoObject: Record<string, any> = {};

fs.readdirSync(infoFolder, { withFileTypes: true })
    .filter((dir) => dir.isDirectory())
    .forEach((dir) => {
        const dirName = dir.name;
        const currentFolder = `${infoFolder}${dirName}/`;
        fs.readdirSync(currentFolder).forEach((file) => {
            if (path.extname(file) === '.md') {
                infoObject[dirName + path.basename(file, '.md')] = fs.readFileSync(
                    currentFolder + file,
                    'utf8',
                );
            }
        });
        const columnsFolder = `${currentFolder}columns/`;
        if (fs.existsSync(columnsFolder)) {
            fs.readdirSync(columnsFolder).forEach((file) => {
                if (path.extname(file) === '.md') {
                    infoObject[dirName + 'Column' + path.basename(file, '.md')] = fs.readFileSync(
                        columnsFolder + file,
                        'utf8',
                    );
                }
            });
        }
    });

fs.writeFileSync(infoFolder + 'info.json', JSON.stringify(infoObject, null, 2));
console.info('info.json created correctly.');
