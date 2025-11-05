// utils/auth.ts
import Cookies from 'js-cookie';

export const setAuthToken = (token: string) => {
  Cookies.set('token', token, {
    expires: 7, // Days
    secure: true,
    sameSite: 'Lax',
    path: '/',
  });
};

export const getAuthToken = (): string | undefined => {
  return Cookies.get('token');
};

export const removeAuthToken = () => {
  Cookies.remove('token');
};
