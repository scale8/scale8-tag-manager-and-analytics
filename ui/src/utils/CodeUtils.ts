import * as unminify from 'unminify';

export const unMinifyCodeWithErrorCoordinatesMapping = (
    code: string,
    row: number,
    col: number,
): [string, number, number] => {
    const lineLengthThreshold = 300;

    const unMinifiedText = unminify.unminifySource(code, {
        safety: unminify.safetyLevels.USELESS,
    });

    const re = /\r\n|\n\r|\n|\r/g;
    const sourceLines: string[] = code.replace(re, '\n').split('\n');
    const unMinifiedLines: string[] = unMinifiedText.replace(re, '\n').split('\n');

    // const mustUnMinify = unMinifiedLines.some((line) => line.length > lineLengthThreshold);
    //
    // if (mustUnMinify) {
    //     return [code, row, col];
    // }

    let currentSourceLine = 1;
    let currentUnMinifiedLine = 0;
    let currentSourceCol = 1;
    let currentUnMinifiedCol = 1;
    let errorMatch = false;

    unMinifiedLines.forEach((line, index) => {
        if (errorMatch) return;
        currentUnMinifiedLine = index + 1;
        console.log(line);
        for (let i = 0; i < line.length; i++) {
            if (!errorMatch) {
                currentUnMinifiedCol = i + 1;
                const ch = line.charAt(i);
                if (!/\s/.test(ch)) {
                    let match = false;
                    while (!match) {
                        if (sourceLines[currentSourceLine - 1].length < currentSourceCol) {
                            if (sourceLines.length === currentSourceLine) {
                                // cannot find so prevent infinite loop
                                match = true;
                            } else {
                                currentSourceLine++;
                                currentSourceCol = 1;
                            }
                        }
                        const sourceLine = sourceLines[currentSourceLine - 1];
                        console.log(sourceLine);
                        if (sourceLine.charAt(currentSourceCol - 1) === ch) {
                            match = true;
                        } else {
                            currentSourceCol++;
                        }
                    }
                    if (currentSourceLine === row && currentSourceCol === col) {
                        errorMatch = true;
                    }
                }
            }
        }
    });

    return [unMinifiedText, currentUnMinifiedLine, currentUnMinifiedCol];
};
