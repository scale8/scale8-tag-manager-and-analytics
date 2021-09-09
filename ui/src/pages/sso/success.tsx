import { FC, useEffect } from 'react';
import Loader from '../../components/organisms/Loader';
import { useParams } from '../../hooks/useParams';

const SsoSuccess: FC = () => {
    const { uid, token } = useParams();
    useEffect(() => {
        if (window.opener && uid && token) {
            // send them to the opening window
            window.opener.postMessage(
                {
                    source: 'scale8sso',
                    auth: {
                        uid,
                        token,
                        is_new: false,
                        username: '',
                        email: '',
                    },
                },
                window.opener.location.toString(),
            );
            // close the popup
            window.close();
        }
    }, [uid, token]);
    return (
        <>
            <Loader />
        </>
    );
};

export default SsoSuccess;
