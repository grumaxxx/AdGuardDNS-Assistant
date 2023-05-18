import { useEffect, useState } from 'react';
import { AccessToken } from '../types';
import { RefreshToken } from '../components/Api';

const useStoredToken = (setToken: (token: string | null) => void) => {
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  const refreshStoredToken = async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      try {
        const response: AccessToken | Error = await RefreshToken(refreshToken);
        if (response instanceof Error) {
          throw response;
        }
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('refresh_token', response.refresh_token);
        localStorage.setItem('token_expires_at', (Date.now() / 1000 + response.expires_in).toString());
        setToken(response.access_token);
      } catch (error) {
        console.error(error);
        setToken(null);
      }
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    const expiresAt = localStorage.getItem('token_expires_at');

    if (accessToken && expiresAt) {
      setToken(accessToken);
      const expiresIn = Number(expiresAt) - Date.now() / 1000;
      if (expiresIn <= 0) {
        console.log(`Refreshing token`)
        refreshStoredToken();
      } else {
        console.log(`Existing token expires in ${expiresIn}s, set timer`)
        const intervalId = setTimeout(() => {
          refreshStoredToken();
        }, expiresIn * 1000);
        setRefreshInterval(intervalId);
      }
    }
  }, [setToken]);

  useEffect(() => {
    return () => {
      if (refreshInterval) {
        clearTimeout(refreshInterval);
      }
    };
  }, [refreshInterval]);
};

export default useStoredToken;
