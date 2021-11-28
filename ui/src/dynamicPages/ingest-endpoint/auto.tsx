import { FC } from 'react';
import { useLoggedInState } from '../../context/AppContext';
import { DynamicPageProps } from '../../pageLoader/DynamicPageLoader';
import { ingestRevisionSections } from '../../containers/SectionsDetails';
import { toIngestEndpoint } from '../../utils/NavigationPaths';
import Navigate from '../../components/atoms/Next/Navigate';

const IngestEndpointAuto: FC<DynamicPageProps> = (props: DynamicPageProps) => {
    const id = props.params.id ?? '';
    const { templateInteractions } = useLoggedInState();
    const { sectionHasAnalytics } = templateInteractions;

    return (
        <Navigate to={toIngestEndpoint({ id }, sectionHasAnalytics ? 'analytics' : 'revisions')} />
    );
};

export default IngestEndpointAuto;
