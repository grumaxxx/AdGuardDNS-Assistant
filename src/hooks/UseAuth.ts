import { useState } from "react";
import { Authorization } from "../components/Api";
import { AccessToken, TokenServerError } from "../types";
import { message } from "antd";
import { AxiosError } from "axios";

export const useAuthorization = () => {
  const [loading, setLoading] = useState(false);

  const authorize = async (username: string, password: string, token: string | null, setTwoFactorRequired: (required: boolean) => void) => {
    setLoading(true);
    try {
      const result = await Authorization(username, password, token);
      if ('access_token' in result) {
        const data = result as AccessToken;
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        localStorage.setItem('token_expire_in', data.expires_in.toString());
        message.success('Success');
        setLoading(false);
        return data.access_token;
      } else {
        throw result as AxiosError;
      }
    } catch (error) {
      setLoading(false);
      if (error && (error as AxiosError).response) {
        const serverError = (error as AxiosError).response?.data as TokenServerError;
        console.log(serverError.error_code)
        if (serverError.error_code == '2fa_required') {
          setTwoFactorRequired(true);
        } else {
          message.error(serverError.error_description);
        }
      }
    }
  };

  return { authorize, loading };
};
