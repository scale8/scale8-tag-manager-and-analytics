import HCaptcha from '@hcaptcha/react-hcaptcha';
import { FC, RefObject } from 'react';
import { getCaptchaKey } from '../../utils/ConfigUtils';

type CaptchaProps = {
    captcha: RefObject<HCaptcha>;
    setCaptchaToken: (token: string) => void;
};

const Captcha: FC<CaptchaProps> = (props: CaptchaProps) => {
    return (
        <HCaptcha
            ref={props.captcha}
            sitekey={getCaptchaKey()}
            onVerify={(token) => props.setCaptchaToken(token)}
        />
    );
};
export default Captcha;
