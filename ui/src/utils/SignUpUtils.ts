import { SignUpType } from '../gql/generated/globalTypes';

const buildSignUpType = (type?: string): SignUpType => {
    if (type === 'invite') return SignUpType.INVITE;
    if (type === 'data-manager') return SignUpType.DATA_MANAGER;
    return SignUpType.TAG_MANAGER;
};

export { buildSignUpType };
