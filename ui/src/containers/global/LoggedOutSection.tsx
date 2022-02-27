import { FC, useEffect } from 'react';
import LoggedOutTemplate from '../../components/templates/containers/LoggedOutTemplate';
import { ChildrenOnlyProps } from '../../types/props/ChildrenOnlyProps';
import { clearAuthSession } from '../../utils/authUtils';

const LoggedOutSection: FC<ChildrenOnlyProps & { stayLogged?: boolean }> = ({
    children,
    stayLogged,
}) => {
    useEffect(() => {
        if (!stayLogged) {
            clearAuthSession();
        }
    }, [stayLogged]);

    return <LoggedOutTemplate>{children}</LoggedOutTemplate>;
};

export default LoggedOutSection;
