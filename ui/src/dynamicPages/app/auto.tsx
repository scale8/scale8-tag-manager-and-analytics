import { FC } from 'react';
import { DynamicPageProps } from '../../pageLoader/DynamicPageLoader';
import { useLoggedInState } from '../../context/AppContext';
import Navigate from '../../components/atoms/Next/Navigate';
import { toApp } from '../../utils/NavigationPaths';

const AppAuto: FC<DynamicPageProps> = (props: DynamicPageProps) => {
    const id = props.params.id ?? '';
    const { templateInteractions } = useLoggedInState();
    const { sectionHasAnalytics } = templateInteractions;

    return <Navigate to={toApp({ id }, sectionHasAnalytics ? 'analytics' : 'revisions')} />;
};

export default AppAuto;
