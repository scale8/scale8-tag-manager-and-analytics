import { FC, useEffect, useRef } from 'react';
import hljs from 'highlight.js';
import { HighlightProps } from './LazyHighlight';

const CodeHighlight: FC<HighlightProps> = (props: HighlightProps) => {
    const setEl = useRef<HTMLPreElement>(null);

    useEffect(() => {
        if (setEl.current !== null) {
            const nodes = setEl.current.querySelectorAll('pre code');

            nodes.forEach((node) => {
                hljs.highlightElement(node as HTMLElement);
            });
        }
    }, [setEl]);

    return (
        <pre ref={setEl}>
            <code className={props.language}>{props.code}</code>
        </pre>
    );
};

export default CodeHighlight;
