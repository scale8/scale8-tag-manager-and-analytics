import { FC, useEffect } from 'react';
import LoggedOutTemplate from '../../components/templates/containers/LoggedOutTemplate';
import { ChildrenOnlyProps } from '../../types/props/ChildrenOnlyProps';

const LoggedOutSection: FC<ChildrenOnlyProps> = (props: ChildrenOnlyProps) => {
    useEffect(() => {
        localStorage.removeItem('uid');
        localStorage.removeItem('token');
    }, []);

    return <LoggedOutTemplate>{props.children}</LoggedOutTemplate>;
};

export default LoggedOutSection;
