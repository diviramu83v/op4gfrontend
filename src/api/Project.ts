import { AxiosResponse } from 'axios';
import instance from './request';
import { domain } from './env';

interface HttpResponse {
  code: number;
  success: string;
  payload: ProjectItem[];
  options?: any;
}

interface ProjectItem {
  id: number;
  name: string;
}

const fetchAPIProject = async (p: string): Promise<ProjectItem[]> => {
  const response: AxiosResponse<HttpResponse> = await instance.get(
    `${domain}/projects?q=${p}`
  );
  return response.data.payload;
};

export default fetchAPIProject;
