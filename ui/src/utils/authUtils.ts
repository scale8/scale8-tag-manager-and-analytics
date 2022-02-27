export const clearAuthSession = (): void => {
    localStorage.removeItem('uid');
    localStorage.removeItem('token');
    sessionStorage.clear();
};
