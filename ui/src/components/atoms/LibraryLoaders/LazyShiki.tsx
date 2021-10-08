import { FC } from 'react';
import dynamic from 'next/dynamic';

export type ShikiProps = {
    language: string;
    code: string;
    errorPosition?: {
        row: number;
        col: number;
    };
};

const LazyShiki: FC<ShikiProps> = (props: ShikiProps) => {
    const DynamicComponent = dynamic(() => import('./CodeShiki'));

    return <DynamicComponent {...props} />;
};
export default LazyShiki;
