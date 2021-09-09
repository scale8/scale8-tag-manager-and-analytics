import { TypeIcon } from '../../../../../common/enums/TypeIcon';
import { InputType } from '../../../../../common/enums/InputType';
import { PlatformEventCreateData, PlatformEventTestData } from '../../../../common/types/Types';
import { getTopWindow } from '../../../../common/lib/util/WindowElement';

export const cmpCheck = {
    persistence_id: 's8-cmp-check',
    name: 'Consent Management Platform - Has Consent',
    icon: TypeIcon.CODE_EVENT,
    description:
        'This event will be triggered when the necessary consent has been met. We only support IAB compatible frameworks for both GDPR and CCPA Consent Management Platforms (CMPs). This event will trigger if not caught by GDPR or CCPA requirements (geographical restrictions listed).',
    data: [
        {
            key: 'ccpa_enabled',
            input_type: InputType.RADIO,
            option_values: ['Enabled', 'Disabled'],
            default_value: 'Enabled',
            description:
                "If your Consent Management Platform (CMP) is CCPA compliant, have you enabled it for the United States? If you select 'Enabled' we will check for compliance via the API",
            optional: false,
        },
        {
            key: 'gdpr_consent_purposes',
            input_type: InputType.CONSENT_PURPOSES,
            description:
                'A list of consent purposes to check against that apply only to GDPR. If GDPR is not applicable this list will be ignored.',
        },
        {
            key: 'gdpr_consent_vendors',
            input_type: InputType.CONSENT_VENDORS,
            description:
                'A list of vendors to check against that apply only to GDPR. If GDPR is not applicable this list will be ignored.',
        },
    ],
    create: (data: PlatformEventCreateData): void => {
        const constructBinding = () => {
            const ccpaEnabled = data.props.ccpa_enabled === 'Enabled';
            const topWindow = getTopWindow();
            if (typeof (topWindow as any).__tcfapi === 'undefined') {
                //wait for it to be ready...
                setTimeout(() => constructBinding(), 5);
            } else {
                //fire first check...
                const updateGDPRCompliance = (tcData: any) => {
                    data.state.gdpr_required =
                        tcData.gdprApplies === undefined || tcData.gdprApplies === true;
                    const purposePass = (data.props.gdpr_consent_purposes as number[]).every(
                        (purposeId) => tcData.purpose.consents[purposeId] === true,
                    );
                    const vendorPass = (data.props.gdpr_consent_vendors as number[]).every(
                        (vendorId) => tcData.vendor.consents[vendorId] === true,
                    );
                    data.state.gdpr_pass = purposePass && vendorPass;
                    data.trigger();
                };
                (topWindow as any).__tcfapi('getTCData', 2, (tcData: any) => {
                    updateGDPRCompliance(tcData);
                });
                //something could happen later so use event listener...
                (topWindow as any).__tcfapi('addEventListener', 2, (tcData: any) => {
                    updateGDPRCompliance(tcData);
                });
            }

            if (ccpaEnabled) {
                if (typeof (topWindow as any).__uspapi === 'undefined') {
                    //wait for it to be ready...
                    setTimeout(() => constructBinding(), 5);
                } else {
                    (topWindow as any).__uspapi('getUSPData', 1, (uspData: any) => {
                        const [, notice, optOut] = uspData.uspString.split('');
                        data.state.ccpa_required = notice === '';
                        data.state.ccpa_pass = notice === 'Y' && optOut === 'N';
                        data.trigger();
                    });
                }
            }
        };
        constructBinding();
    },
    test: (data: PlatformEventTestData, log: (msg: string) => void): boolean => {
        if (data.state.gdpr_required === true) {
            log('GDPR has been flagged by the CMP as being required');
            if (data.state.gdpr_pass === true) {
                log('Successfully passed GDPR checks for purposes and vendors specified');
                return true;
            } else {
                log('Failed to pass GDPR checks for purposes and vendors specified');
            }
        } else if (data.state.gdpr_required === false) {
            log('GDPR has been flagged by the CMP as NOT being required');
            if (data.state.ccpa_required === true) {
                log('CCPA has been flagged by the CMP as being required');
                if (data.state.ccpa_pass === true) {
                    log(
                        'Successfully passed CCPA checks. Notice has been given and user has not opted out',
                    );
                    return true;
                }
            }
        } else {
            log('Waiting for GDPR status...');
        }
        return false;
    },
};
