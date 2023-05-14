import { useEffect } from "react";

export const useStoredToken = (setToken: (token: string) => void) => {
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setToken(token);
    }
  }, [setToken]);
};