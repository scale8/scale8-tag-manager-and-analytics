import { FC } from 'react';
import { DynamicPageProps } from '../pageLoader/DynamicPageLoader';
import PlatformRevisionsPage from '../components/organisms/PlatformRevisionsPage';
import { PlatformType } from '../gql/generated/globalTypes';

const CustomPlatformPage: FC<DynamicPageProps> = (props: DynamicPageProps) => {
    return <PlatformRevisionsPage params={props.params} type={PlatformType.CUSTOM} />;
};

export default CustomPlatformPage;
