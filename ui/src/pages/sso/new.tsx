import { useEffect } from 'react';
import Loader from '../../components/organisms/Loader';
import { ComponentWithParams, ParamsLoader } from '../../components/atoms/ParamsLoader';

const SsoNew: ComponentWithParams = ({ params }) => {
    const { username, email } = params;
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

const SsoNewLoader = () => <ParamsLoader Child={SsoNew} />;

export default SsoNewLoader;
