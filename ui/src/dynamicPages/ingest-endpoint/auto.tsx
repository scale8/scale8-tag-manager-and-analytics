import { FC } from 'react';
import { useLoggedInState } from '../../context/AppContext';
import { DynamicPageProps } from '../../pageLoader/DynamicPageLoader';
import { ingestRevisionSections } from '../../containers/SectionsDetails';
import { toIngestEndpoint } from '../../utils/NavigationPaths';
import Navigate from '../../components/atoms/Next/Navigate';

const IngestEndpointAuto: FC<DynamicPageProps> = (props: DynamicPageProps) => {
    const id = props.params.id ?? '';
    const { templateInteractions } = useLoggedInState();
    const { sectionHistory } = templateInteractions;

    if (
        sectionHistory.previous !== undefined &&
        ingestRevisionSections.includes(sectionHistory.previous.section)
    ) {
        return <Navigate to={toIngestEndpoint({ id }, 'revisions')} />;
    }

    return <Navigate to={toIngestEndpoint({ id }, 'analytics')} />;
};

export default IngestEndpointAuto;
