import { FC, useEffect, useRef, useState } from 'react';
import * as shiki from 'shiki';
import { FontStyle, IThemedToken } from 'shiki';
import themeNord from 'shiki/themes/nord.json';
import langJS from 'shiki/languages/javascript.tmLanguage.json';
import langHTML from 'shiki/languages/html.tmLanguage.json';
import langJSON from 'shiki/languages/json.tmLanguage.json';
import langSH from 'shiki/languages/fish.tmLanguage.json';
import langPHP from 'shiki/languages/php.tmLanguage.json';
import langPYTHON from 'shiki/languages/python.tmLanguage.json';
import langRUBY from 'shiki/languages/ruby.tmLanguage.json';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import onigasm from 'arraybuffer-loader!shiki/dist/onigasm.wasm';
import { ShikiProps } from './LazyShiki';
import { Box } from '@mui/material';

const CodeShiki: FC<ShikiProps> = ({ code, language, errorPosition, smallText, lineNumbers }) => {
    const [tokens, setTokens] = useState<IThemedToken[][]>([]);

    const shikiRef = useRef<HTMLDivElement>(null);
    const errorRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (errorRef.current && shikiRef.current) {
            shikiRef.current.scrollTop = errorRef.current.offsetTop - 5;
        }
    });

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
                        {
                            id: 'html',
                            scopeName: langHTML.scopeName,
                            grammar: langHTML as any,
                            aliases: ['html'],
                        },
                        {
                            id: 'json',
                            scopeName: langJSON.scopeName,
                            grammar: langJSON as any,
                            aliases: ['json'],
                        },
                        {
                            id: 'sh',
                            scopeName: langSH.scopeName,
                            grammar: langSH as any,
                            aliases: ['sh'],
                        },
                        {
                            id: 'php',
                            scopeName: langPHP.scopeName,
                            grammar: langPHP as any,
                            aliases: ['php'],
                        },
                        {
                            id: 'python',
                            scopeName: langPYTHON.scopeName,
                            grammar: langPYTHON as any,
                            aliases: ['python'],
                        },
                        {
                            id: 'ruby',
                            scopeName: langRUBY.scopeName,
                            grammar: langRUBY as any,
                            aliases: ['ruby'],
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
        <Box
            sx={{
                position: 'relative',
                display: 'block',
                height: '100%',
                overflowY: 'auto',
                backgroundColor: '#2e3440ff',
                direction: 'rtl',
                '&::-webkit-scrollbar': {
                    width: '8px',
                    height: '8px',
                },
                '&::-webkit-scrollbar-track': {
                    backgroundColor: '#f1f1f1',
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: '#888',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                    backgroundColor: '#555',
                },
                fontSize: smallText ? 12 : 15,
                '& .shiki': {
                    direction: 'ltr',
                    padding: '.5rem',
                    margin: 0,
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
            }}
            ref={shikiRef}
        >
            <pre className="shiki">
                <code>
                    {tokens.map((l: IThemedToken[], index) => {
                        const rowHasError = errorPosition?.row === index + 1;
                        let prevCharCount = 0;

                        return (
                            <div key={index} className={rowHasError ? 'error-line' : undefined}>
                                {lineNumbers && <span className="line-number">{index + 1}</span>}
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
                                            <Box
                                                component="span"
                                                key={tokenIndex}
                                                sx={{
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
                                                {tokenHasError ? (
                                                    <>
                                                        {token.content.slice(
                                                            0,
                                                            relativeCharPosition - 1,
                                                        )}
                                                        <Box
                                                            component="span"
                                                            ref={errorRef}
                                                            sx={{
                                                                background: '#FF000060',
                                                            }}
                                                        >
                                                            {token.content.charAt(
                                                                relativeCharPosition - 1,
                                                            )}
                                                        </Box>
                                                        {token.content.slice(relativeCharPosition)}
                                                    </>
                                                ) : (
                                                    <>{token.content}</>
                                                )}
                                            </Box>
                                        );
                                    })}
                                </span>
                            </div>
                        );
                    })}
                </code>
            </pre>
        </Box>
    );
};

export default CodeShiki;
