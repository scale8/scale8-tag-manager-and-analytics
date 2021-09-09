import { FC } from 'react';
import { DynamicPageProps } from '../../pageLoader/DynamicPageLoader';
import { useLoggedInState } from '../../context/AppContext';
import { appRevisionSections } from '../../containers/SectionsDetails';
import Navigate from '../../components/atoms/Next/Navigate';
import { toApp } from '../../utils/NavigationPaths';

const AppAuto: FC<DynamicPageProps> = (props: DynamicPageProps) => {
    const id = props.params.id ?? '';
    const { templateInteractions } = useLoggedInState();
    const { sectionHistory } = templateInteractions;

    if (
        sectionHistory.previous !== undefined &&
        appRevisionSections.includes(sectionHistory.previous.section)
    ) {
        return <Navigate to={toApp({ id }, 'revisions')} />;
    }

    return <Navigate to={toApp({ id }, 'analytics')} />;
};

export default AppAuto;
