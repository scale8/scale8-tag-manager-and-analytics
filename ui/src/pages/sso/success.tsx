import { useEffect } from 'react';
import Loader from '../../components/organisms/Loader';
import { ComponentWithParams, ParamsLoader } from '../../components/atoms/ParamsLoader';

const SsoSuccess: ComponentWithParams = ({ params }) => {
    const { uid, token } = params;
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
    return <Loader />;
};

const SsoSuccessLoader = () => <ParamsLoader Child={SsoSuccess} />;

export default SsoSuccessLoader;
