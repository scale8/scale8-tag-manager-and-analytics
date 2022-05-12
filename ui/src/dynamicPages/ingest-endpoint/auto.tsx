import { FC, useContext } from 'react';
import { DynamicPageProps } from '../../pageLoader/DynamicPageLoader';
import { toIngestEndpoint } from '../../utils/NavigationPaths';
import Navigate from '../../components/atoms/Next/Navigate';
import { SectionContext } from '../../containers/abstractions/Section';

const IngestEndpointAuto: FC<DynamicPageProps> = (props: DynamicPageProps) => {
    const id = props.params.id ?? '';
    const { hasAnalytics } = useContext(SectionContext);
    return <Navigate to={toIngestEndpoint({ id }, hasAnalytics ? 'analytics' : 'revisions')} />;
};

export default IngestEndpointAuto;
