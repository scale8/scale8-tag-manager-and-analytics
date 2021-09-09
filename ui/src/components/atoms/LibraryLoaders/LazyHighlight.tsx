import { FC } from 'react';
import dynamic from 'next/dynamic';

export type HighlightProps = {
    language: string;
    code: string;
};

const LazyHighlight: FC<HighlightProps> = (props: HighlightProps) => {
    const DynamicComponent = dynamic(() => import('./CodeHighlight'));

    return <DynamicComponent {...props} />;
};
export default LazyHighlight;
