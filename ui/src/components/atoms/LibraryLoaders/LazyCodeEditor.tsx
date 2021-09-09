import { FC, useEffect, useState } from 'react';
import { IAceEditorProps } from 'react-ace/lib/ace';
import dynamic from 'next/dynamic';

const LazyCodeEditor: FC<IAceEditorProps> = (props: IAceEditorProps) => {
    const [CodeEditor, setCodeEditor] = useState<any | null>(null);
    useEffect(() => {
        setCodeEditor(
            dynamic(async () => {
                const ace = await import('react-ace');
                await import('ace-builds/webpack-resolver');
                await import('ace-builds/src-noconflict/mode-javascript');
                await import('ace-builds/src-noconflict/mode-css');
                await import('ace-builds/src-noconflict/mode-html');
                await import('ace-builds/src-noconflict/mode-json');
                await import('ace-builds/src-noconflict/theme-tomorrow');
                await import('ace-builds/src-noconflict/ext-language_tools');

                return ace;
            }),
        );
    }, []);

    if (CodeEditor === null) {
        return null;
    }

    return <CodeEditor {...props} />;
};
export default LazyCodeEditor;
