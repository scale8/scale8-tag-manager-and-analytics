import { FC } from 'react';
import { DynamicPageProps } from '../../pageLoader/DynamicPageLoader';
import { toAppRevision } from '../../utils/NavigationPaths';
import Navigate from '../../components/atoms/Next/Navigate';

const AppRevisionAuto: FC<DynamicPageProps> = (props: DynamicPageProps) => {
    const id = props.params.id ?? '';

    return <Navigate to={toAppRevision({ id }, 'tags')} />;
};

export default AppRevisionAuto;
