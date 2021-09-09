import { PlatformSpec } from '../../common/interfaces/PlatformSpec';

declare const __S8_MODE: string | undefined;
declare const __S8_IS_CORE: boolean | undefined;

const registerPlatformSpec = (platformSpec: PlatformSpec) => {
    const topWindow = window.top as any;
    if (typeof __S8_MODE === 'string' && __S8_MODE === 'build') {
        topWindow.__S8_BUILD_SPEC = platformSpec;
    }
    if (typeof __S8_IS_CORE === 'undefined' || !__S8_IS_CORE) {
        (topWindow as any).___S8_API = (topWindow as any).___S8_API || [];
        (topWindow as any).___S8_API.push({
            register: { platformId: 'S8_REPLACE_PLATFORM_ID', platformSpec: platformSpec },
        });
    }
};

export default registerPlatformSpec;
