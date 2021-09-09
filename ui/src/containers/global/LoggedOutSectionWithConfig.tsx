import { FC, useEffect } from 'react';
import { ChildrenOnlyProps } from '../../types/props/ChildrenOnlyProps';
import { ConfigQueryData } from '../../gql/generated/ConfigQueryData';
import { useQuery } from '@apollo/client';
import ConfigQuery from '../../gql/queries/ConfigQuery';
import LoggedOutSection from './LoggedOutSection';
import { useAppContext } from '../../context/AppContext';
import { configStateFromData } from '../../context/ConfigState';
import GQLError from '../../components/atoms/GqlError';
import Loader from '../../components/organisms/Loader';

const LoggedOutSectionWithConfig: FC<ChildrenOnlyProps> = (props: ChildrenOnlyProps) => {
    const { loading, error, data } = useQuery<ConfigQueryData>(ConfigQuery);

    const { setState, configState } = useAppContext();

    useEffect(() => {
        if (data) {
            setState({ configState: configStateFromData(data) });
        }
    }, [data]);

    if (error) {
        return (
            <LoggedOutSection>
                <GQLError error={error} />
            </LoggedOutSection>
        );
    }

    if (loading || !data || configState === undefined)
        return (
            <LoggedOutSection>
                <Loader />
            </LoggedOutSection>
        );

    return <LoggedOutSection>{props.children}</LoggedOutSection>;
};

export default LoggedOutSectionWithConfig;
