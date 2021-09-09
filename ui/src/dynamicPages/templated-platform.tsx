import { FC } from 'react';
import { DynamicPageProps } from '../pageLoader/DynamicPageLoader';
import PlatformRevisionsPage from '../components/organisms/PlatformRevisionsPage';
import { PlatformType } from '../gql/generated/globalTypes';

const TemplatedPlatformPage: FC<DynamicPageProps> = (props: DynamicPageProps) => {
    return <PlatformRevisionsPage params={props.params} type={PlatformType.TEMPLATED} />;
};

export default TemplatedPlatformPage;
