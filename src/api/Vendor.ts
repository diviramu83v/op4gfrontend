import { AxiosResponse } from 'axios';
import instance from './request';
import { domain } from './env';

interface HttpResponse {
  code: number;
  success: string;
  payload: VendorItem[];
  options?: any;
}

interface VendorItem {
  id: number;
  name: string;
}

const fetchAPIVendor = async (p: string): Promise<VendorItem[]> => {
  const response: AxiosResponse<HttpResponse> = await instance.get(
    `${domain}/vendors?q=${p}`
  );
  return response.data.payload;
};

export default fetchAPIVendor;
