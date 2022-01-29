import { FC, useEffect } from 'react';
import LoggedOutTemplate from '../../components/templates/containers/LoggedOutTemplate';
import { ChildrenOnlyProps } from '../../types/props/ChildrenOnlyProps';

const LoggedOutSection: FC<ChildrenOnlyProps & { stayLogged?: boolean }> = ({
    children,
    stayLogged,
}) => {
    useEffect(() => {
        if (!stayLogged) {
            localStorage.removeItem('uid');
            localStorage.removeItem('token');
        }
    }, [stayLogged]);

    return <LoggedOutTemplate>{children}</LoggedOutTemplate>;
};

export default LoggedOutSection;
