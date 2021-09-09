import { FC, useEffect } from 'react';
import Loader from '../../components/organisms/Loader';

const SsoDuplicate: FC = () => {
    useEffect(() => {
        if (window.opener) {
            // send them to the opening window
            window.opener.postMessage(
                {
                    source: 'scale8sso',
                    error: 'User already exists in the system with that email',
                },
                window.opener.location.toString(),
            );
            // close the popup
            window.close();
        }
    });
    return (
        <>
            <Loader />
        </>
    );
};

export default SsoDuplicate;
