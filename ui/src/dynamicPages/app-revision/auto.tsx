import { FC } from 'react';
import { useLoggedInState } from '../../context/AppContext';
import { DynamicPageProps } from '../../pageLoader/DynamicPageLoader';
import { SectionKey } from '../../containers/SectionsDetails';
import { toAppRevision } from '../../utils/NavigationPaths';
import Navigate from '../../components/atoms/Next/Navigate';

const AppRevisionAuto: FC<DynamicPageProps> = (props: DynamicPageProps) => {
    const id = props.params.id ?? '';
    const { templateInteractions } = useLoggedInState();
    const { sectionHistory } = templateInteractions;

    if (
        sectionHistory.previous !== undefined &&
        sectionHistory.previous.section === SectionKey.globalTrigger
    ) {
        return <Navigate to={toAppRevision({ id }, 'global-triggers')} />;
    }

    if (
        sectionHistory.previous !== undefined &&
        sectionHistory.previous.section === SectionKey.globalAction
    ) {
        return <Navigate to={toAppRevision({ id }, 'global-actions')} />;
    }

    return <Navigate to={toAppRevision({ id }, 'tags')} />;
};

export default AppRevisionAuto;
