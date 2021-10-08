import { FC, useEffect, useState } from 'react';
import * as shiki from 'shiki';
import themeNord from 'shiki/themes/nord.json';
import langJS from 'shiki/languages/javascript.tmLanguage.json';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import onigasm from 'arraybuffer-loader!shiki/dist/onigasm.wasm';
import { ShikiProps } from './LazyShiki';
import { makeStyles } from '@material-ui/core/styles';
import { FontStyle, IThemedToken } from 'shiki';

const useStyles = makeStyles({
    shiki: {
        fontSize: 15,
        '& .shiki': {
            padding: '.5rem',
            // overflowX: 'scroll',
            // overflowY: 'auto',
            // '&::-webkit-scrollbar': {
            //     width: '8px',
            //     height: '8px',
            // },
            // '&::-webkit-scrollbar-track': {
            //     backgroundColor: '#f1f1f1',
            // },
            // '&::-webkit-scrollbar-thumb': {
            //     backgroundColor: '#888',
            // },
            // '&::-webkit-scrollbar-thumb:hover': {
            //     backgroundColor: '#555',
            // },
        },
        '& code': {
            '& .line': {
                whiteSpace: 'break-spaces',
                wordBreak: 'break-all',
            },
            '& .line-number': {
                width: '1rem',
                marginRight: '1.5rem',
                display: 'inline-block',
                textAlign: 'right',
                color: 'rgba(115,138,148,.8)',
            },
            '& .error-line .line-number': {
                color: '#FF0000',
            },
            '& .error-line': {
                background: '#FF000015',
            },
        },
    },
});

const CodeShiki: FC<ShikiProps> = ({ code, language, errorPosition }) => {
    const [tokens, setTokens] = useState<IThemedToken[][]>([]);

    const classes = useStyles();

    useEffect(() => {
        (async () => {
            try {
                shiki.setOnigasmWASM(onigasm);
                const highlighter = await shiki.getHighlighter({
                    themes: [themeNord as any],
                    langs: [
                        {
                            id: 'javascript',
                            scopeName: langJS.scopeName,
                            grammar: langJS as any,
                            aliases: ['js'],
                        },
                    ],
                });
                setTokens(highlighter.codeToThemedTokens(code, language));
            } catch (e) {
                console.log(e);
            }
        })();
    }, [code, language]);

    return (
        <div className={classes.shiki}>
            <pre className="shiki" style={{ backgroundColor: '#2e3440ff' }}>
                <code>
                    {tokens.map((l: IThemedToken[], index) => {
                        const rowHasError = errorPosition?.row === index + 1;
                        let prevCharCount = 0;

                        return (
                            <div key={index} className={rowHasError ? 'error-line' : undefined}>
                                <span className="line-number">{index + 1}</span>
                                <span className="line">
                                    {l.map((token, tokenIndex) => {
                                        const nextCharCount = prevCharCount + token.content.length;
                                        const relativeCharPosition =
                                            errorPosition === undefined
                                                ? 0
                                                : errorPosition.col - prevCharCount;
                                        const tokenHasError =
                                            rowHasError &&
                                            errorPosition !== undefined &&
                                            errorPosition.col > prevCharCount &&
                                            errorPosition.col <= nextCharCount;
                                        prevCharCount = nextCharCount;
                                        return (
                                            <span
                                                key={tokenIndex}
                                                style={{
                                                    color: token.color,
                                                    background: tokenHasError
                                                        ? '#FF000040'
                                                        : 'transparent',
                                                    ...(token.fontStyle === FontStyle.Italic
                                                        ? { fontStyle: 'italic' }
                                                        : {}),
                                                    ...(token.fontStyle === FontStyle.Bold
                                                        ? { fontWeight: 'bold' }
                                                        : {}),
                                                    ...(token.fontStyle === FontStyle.Underline
                                                        ? { textDecoration: 'underline' }
                                                        : {}),
                                                }}
                                            >
                                                {/*//  + "***S8---***" +*/}
                                                {/*line.charAt(targetChar-1) + "***---S8***" +*/}
                                                {/*line.slice(targetChar);*/}
                                                {tokenHasError ? (
                                                    <>
                                                        {token.content.slice(
                                                            0,
                                                            relativeCharPosition - 1,
                                                        )}
                                                        <span style={{ background: '#FF000060' }}>
                                                            {token.content.charAt(
                                                                relativeCharPosition - 1,
                                                            )}
                                                        </span>
                                                        {token.content.slice(relativeCharPosition)}
                                                    </>
                                                ) : (
                                                    <>{token.content}</>
                                                )}
                                            </span>
                                        );
                                    })}
                                </span>
                            </div>
                        );
                    })}
                </code>
            </pre>
        </div>
    );
};

export default CodeShiki;
