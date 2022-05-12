import { FC, useContext } from 'react';
import { DynamicPageProps } from '../../pageLoader/DynamicPageLoader';
import Navigate from '../../components/atoms/Next/Navigate';
import { toApp } from '../../utils/NavigationPaths';
import { SectionContext } from '../../containers/abstractions/Section';

const AppAuto: FC<DynamicPageProps> = (props: DynamicPageProps) => {
    const id = props.params.id ?? '';
    const { hasAnalytics } = useContext(SectionContext);
    return <Navigate to={toApp({ id }, hasAnalytics ? 'analytics' : 'revisions')} />;
};

export default AppAuto;
