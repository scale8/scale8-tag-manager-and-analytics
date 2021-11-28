import { FC } from 'react';
import Navigate from '../../components/atoms/Next/Navigate';
import { DynamicPageProps } from '../../pageLoader/DynamicPageLoader';
import { toTagManager } from '../../utils/NavigationPaths';

const TagManagerAuto: FC<DynamicPageProps> = (props: DynamicPageProps) => {
    const accountId = props.params.id ?? '';

    return <Navigate to={toTagManager({ id: accountId }, 'apps')} />;
};

export default TagManagerAuto;
