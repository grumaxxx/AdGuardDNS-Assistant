import { useEffect } from "react";
import { RefreshToken } from "../components/Api";

export const useStoredToken = (setToken: (token: string) => void) => {

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      const expire = localStorage.getItem('token_expire_in');
      const refresh_token = localStorage.getItem('refresh_token');
      if (expire && refresh_token) {
        let expire_in: number = +expire;
        const current_time = Math.floor(Date.now() / 1000);
        if (expire_in > current_time) {
          try {
            const response = RefreshToken(token)
          } catch (error) {
            
          }
        }
      }
      setToken(token);
    }
  }, [setToken]);
};