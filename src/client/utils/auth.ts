import { jwtDecode } from 'jwt-decode';

export const isAuthenticated = (): boolean => {
    console.info('Checking authentication status');

    const token = localStorage.getItem('jwtToken');
    if (!token) {
        console.error('No token found in local storage');
        return false;
    }

    try {
        const decodedToken = jwtDecode(token);
        console.info('Token is valid', decodedToken);
        return true;
    } catch (error) {
        console.error('Invalid token', error);
        return false;
    }
};
