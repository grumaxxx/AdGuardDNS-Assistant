import { useState } from "react";
import { Authorization } from "../components/Api";
import { AccessToken, TokenServerError } from "../types";
import { message } from "antd";
import { AxiosError } from "axios";

export const useAuthorization = () => {
  const [loading, setLoading] = useState(false);

  const authorize = async (username: string, password: string) => {
    setLoading(true);
    try {
      const result = await Authorization(username, password);
      if ('access_token' in result) {
        const data = result as AccessToken;
        localStorage.setItem('access_token', data.access_token);
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
        message.error(serverError.error_description);
      }
    }
  };

  return { authorize, loading };
};
