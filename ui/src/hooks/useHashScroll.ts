import { useEffect } from 'react';

const useHashScroll = (): void => {
    useEffect(() => {
        const hash = window.location.hash;
        if (hash) {
            const element = document.getElementById(hash.split('#').join(''));

            // If element present, scroll me to that part
            if (element) {
                const top = element.offsetTop;
                window.scrollTo(0, top);
            } else {
                // If element not present, scroll me to the top
                window.scrollTo(0, 0);
            }
        } else {
            // In no anchor element, scroll me to the top
            window.scrollTo(0, 0);
        }
    });
};

export { useHashScroll };
