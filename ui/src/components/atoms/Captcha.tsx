import HCaptcha from '@hcaptcha/react-hcaptcha';
import { FC, RefObject } from 'react';
import { useConfigState } from '../../context/AppContext';

type CaptchaProps = {
    captcha: RefObject<HCaptcha>;
    setCaptchaToken: (token: string) => void;
};

const Captcha: FC<CaptchaProps> = (props: CaptchaProps) => {
    const { captchaPublishable } = useConfigState();

    return (
        <HCaptcha
            ref={props.captcha}
            sitekey={captchaPublishable}
            onVerify={(token) => props.setCaptchaToken(token)}
        />
    );
};
export default Captcha;
