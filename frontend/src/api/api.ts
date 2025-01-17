import axios from 'axios';
import { oauth2_v2 } from 'googleapis';

type TokenValidationResult = {
  valid: boolean,
  user?: oauth2_v2.Schema$Userinfo
};

export class Api {
  private baseUrl = import.meta.env.VITE_BACKEND_LOCATION;

  async validateAccessToken(): Promise<TokenValidationResult> {
    const response = await axios.post(`${this.baseUrl}/auth/validate-access-token`, undefined, { withCredentials: true });
    console.log(response);
    return response.data;
  }

  async logout(): Promise<void> {
    return axios.post(`${this.baseUrl}/auth/logout`, undefined, { withCredentials: true });
  }
}

export const api = new Api()