import { AxiosResponse } from 'axios';
import instance from './request';
import { domain } from './env';

interface HttpResponseLogin {
  code: number;
  success: string;
  payload: any;
  options?: any;
}

interface UserInput {
  employee: {
    email: string;
    password: string;
  };
}

const postLoginAPI = async (user: UserInput): Promise<HttpResponseLogin> => {
  const response: AxiosResponse<HttpResponseLogin> = await instance.post(
    `${domain}/auth/sign_in`,
    user
  );
  localStorage.setItem('jwt', response.headers['authorization']);
  return response.data;
};

export { postLoginAPI };
