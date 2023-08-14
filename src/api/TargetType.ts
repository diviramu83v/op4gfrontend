import { AxiosResponse } from 'axios';
import instance from './request';
import { domain } from './env';

interface HttpResponse {
  code: number;
  success: string;
  payload: TargetTypeItem[];
  options?: any;
}

interface TargetTypeItem {
  id: number;
  name: string;
  description: string;
}

const fetchAPITargetType = async (): Promise<TargetTypeItem[]> => {
  const response: AxiosResponse<HttpResponse> = await instance.get(
    `${domain}/target_types`
  );
  return response.data.payload;
};

export default fetchAPITargetType;
