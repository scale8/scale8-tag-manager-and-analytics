import { FC, memo } from 'react';
import dynamic from 'next/dynamic';

export type ShikiLanguages = 'js' | 'json' | 'html' | 'sh' | 'php' | 'python' | 'ruby';

export type ShikiProps = {
    language: ShikiLanguages;
    code: string;
    errorPosition?: {
        row: number;
        col: number;
    };
    smallText?: boolean;
    lineNumbers?: boolean;
};

const LazyShiki: FC<ShikiProps> = (props: ShikiProps) => {
    const DynamicComponent = dynamic(() => import('./CodeShiki'));

    return <DynamicComponent {...props} />;
};
export default memo(LazyShiki);
