type WindowArea = {
    width: number;
    height: number;
    left?: number;
    top?: number;
};

const openSignInWindow = (
    url: string,
): Promise<{
    uid: string;
    token: string;
    is_new: boolean;
    username: string;
    email: string;
}> => {
    const windowArea: WindowArea = {
        width: 1000,
        height: 700,
    };

    windowArea.left = Math.floor(window.screenX + (window.outerWidth - windowArea.width) / 2);
    windowArea.top = Math.floor(window.screenY + (window.outerHeight - windowArea.height) / 2);

    const windowOpts = `toolbar=0,scrollbars=1,status=1,resizable=1,location=1,menuBar=0,
    width=${windowArea.width},height=${windowArea.height},
    left=${windowArea.left},top=${windowArea.top}`;

    const authWindow = window.open(url, 'authWindow', windowOpts);

    // Listen to message from child window
    return new Promise((resolve, reject) => {
        window.addEventListener(
            'message',
            (e) => {
                if (e.data.source === 'scale8sso') {
                    if (e.data.auth) {
                        resolve(e.data.auth);
                        authWindow?.close();
                    } else {
                        reject(new Error(e.data.error));
                        authWindow?.close();
                    }
                }
            },
            false,
        );
    });
};

export { openSignInWindow };
