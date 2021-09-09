import { FC, useEffect } from 'react';
import Loader from '../../components/organisms/Loader';
import { useParams } from '../../hooks/useParams';

const New: FC = () => {
    const { username, email } = useParams();
    useEffect(() => {
        if (window.opener && username && email) {
            // send them to the opening window
            window.opener.postMessage(
                {
                    source: 'scale8sso',
                    auth: { uid: '', token: '', is_new: true, username, email },
                },
                window.opener.location.toString(),
            );
            // close the popup
            window.close();
        }
    }, [username, email]);
    return (
        <>
            <Loader />
        </>
    );
};

export default New;
