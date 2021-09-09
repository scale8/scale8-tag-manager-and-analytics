import infoJson from './info.json';

const getInfo = (infoKey: string): string => {
    if (infoJson.hasOwnProperty(infoKey)) {
        return infoJson[infoKey as keyof typeof infoJson];
    }
    return '';
};

export { getInfo };
