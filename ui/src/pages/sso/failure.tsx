import { FC, useEffect } from 'react';
import Loader from '../../components/organisms/Loader';

const SsoFailure: FC = () => {
    useEffect(() => {
        if (window.opener) {
            // send them to the opening window
            window.opener.postMessage(
                {
                    source: 'scale8sso',
                    error: 'Something has gone wrong, please try again later',
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

export default SsoFailure;
