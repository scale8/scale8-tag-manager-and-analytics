import { FC } from 'react';
import { useLoggedInState } from '../../context/AppContext';
import { platformSections } from '../../containers/SectionsDetails';
import Navigate from '../../components/atoms/Next/Navigate';
import { DynamicPageProps } from '../../pageLoader/DynamicPageLoader';
import { toTagManager } from '../../utils/NavigationPaths';

const TagManagerAuto: FC<DynamicPageProps> = (props: DynamicPageProps) => {
    const accountId = props.params.id ?? '';
    const { templateInteractions } = useLoggedInState();
    const { sectionHistory } = templateInteractions;

    if (
        sectionHistory.previous !== undefined &&
        platformSections.includes(sectionHistory.previous.section)
    ) {
        return <Navigate to={toTagManager({ id: accountId }, 'platforms')} />;
    }

    return <Navigate to={toTagManager({ id: accountId }, 'apps')} />;
};

export default TagManagerAuto;
