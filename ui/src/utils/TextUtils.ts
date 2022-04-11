const ucFirst = (word: string): string => word.charAt(0).toUpperCase() + word.slice(1);

const snakeToTitleCase = (s: string): string =>
    s
        .toLowerCase()
        .replace(/([a-z])_([a-z])/g, '$1 $2')
        .split(' ')
        .map(ucFirst)
        .join(' ');

const kebabToTitleCase = (s: string): string =>
    s
        .toLowerCase()
        .replace(/([a-z])-([a-z])/g, '$1 $2')
        .split(' ')
        .map(ucFirst)
        .join(' ');

const camelToTitleCase = (s: string): string =>
    s
        .replace(/([A-Z])/g, ' $1')
        .split(' ')
        .map(ucFirst)
        .join(' ');

const removeStringQuotes = (s: string): string => s.replace(/^"(.*)"$/, '$1');

const buildTagInstallMarkup = (name: string, code: string, type: string): string => {
    const dataAttr = ' data-s8="true"';
    const codeAttr = ` data-code="${code}"`;
    const displayAttr = type === 'HEAD' ? ' style="display:none"' : '';

    const tagDiv = `<div${dataAttr}${codeAttr}${displayAttr}></div>`;
    return `<!-- Tag - ${name} -->\n${tagDiv}\n<!-- / Tag -->`;
};

function splitOnce(s: string, on: string): string[] {
    const [first, ...rest] = s.split(on);
    return [first, ...(rest.length > 0 ? [rest.join(on)] : [])];
}

function splitTwice(s: string, on: string): string[] {
    const [first, second, ...rest] = s.split(on);
    return [first, second, ...(rest.length > 0 ? [rest.join(on)] : [])];
}

const buildMockComponentId = (prefix: string): string => {
    return `${prefix}${Date.now()}${Math.floor(Math.random() * 1000)}`;
};

const abbreviateNumber = (value: number): string => {
    let newValue = value;

    const suffixes = ['', 'k', 'm', 'b', 't'];
    let suffixNum = 0;
    while (newValue >= 1000) {
        newValue /= 1000;
        suffixNum++;
    }

    const precisionCutValue = parseFloat(newValue.toPrecision(3));

    return `${precisionCutValue}${suffixes[suffixNum]}`;
};

const displayTime = (value: number): string => {
    const hours = Math.floor(value / 3600);
    const minutes = Math.floor((value - hours * 3600) / 60);
    const seconds = value - hours * 3600 - minutes * 60;

    const displayValue = (v: number, abbr: string) => (v < 10 ? `0${v}${abbr}` : `${v}${abbr}`);

    if (hours > 0) {
        return `${displayValue(hours, 'h')} ${displayValue(minutes, 'm')} ${displayValue(
            seconds,
            's',
        )}`;
    }

    if (minutes > 0) {
        return `${displayValue(minutes, 'm')} ${displayValue(seconds, 's')}`;
    }

    return displayValue(seconds, 's');
};

const stripHtmlTags = (str: string): string => {
    return str.replace(/<[^>]*>/g, '');
};

export {
    ucFirst,
    snakeToTitleCase,
    kebabToTitleCase,
    camelToTitleCase,
    removeStringQuotes,
    buildTagInstallMarkup,
    splitOnce,
    splitTwice,
    buildMockComponentId,
    abbreviateNumber,
    displayTime,
    stripHtmlTags,
};
