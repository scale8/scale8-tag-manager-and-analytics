import { FC } from 'react';
import { useParams } from '../../hooks/useParams';

export type ComponentWithParams = FC<{ params: NodeJS.Dict<string> }>;

export const ParamsLoader: FC<{ Child: ComponentWithParams }> = ({ Child }) => {
    const params = useParams();

    if (params === null) {
        return <></>;
    }

    return <Child params={params} />;
};
