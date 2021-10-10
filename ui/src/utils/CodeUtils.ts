import js_beautify from 'js-beautify';
import { generator, consumer } from 'js-sourcemap';

export const unMinifyCodeWithErrorCoordinatesMapping = (
    code: string,
    line: number,
    column: number,
): [string, number, number] => {
    const formattedCode = js_beautify(code, {});
    const sourcemap = generator(code, formattedCode);
    const smConsumer = consumer(sourcemap);
    const result = smConsumer.getGenerated({ line, column });
    return [formattedCode, result.line, result.column];
};
