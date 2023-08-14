import { AxiosResponse } from 'axios';
import instance from './request';
import { domain } from './env';

interface HttpResponse {
  code: number;
  success: string;
  payload: CountryItem[];
  options?: any;
}

interface CountryItem {
  id: number;
  name: string;
  nonprofit_flag: boolean;
  slug: string;
}

const fetchAPICountry = async (): Promise<HttpResponse> => {
  const response: AxiosResponse<HttpResponse> = await instance.get(
    `${domain}/countries`
  );
  return response.data;
};

export default fetchAPICountry;
