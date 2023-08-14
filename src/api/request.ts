import QueryString from 'qs';
import axios from 'axios';

const instance = axios.create({
  baseURL: `${process.env.REACT_APP_API_HOST_URL}${process.env.REACT_APP_API_VERSION}/`,
  headers: {
    'content-type': 'application/json'
  },
  paramsSerializer: {
    serialize: params => {
      return QueryString.stringify(params, { arrayFormat: 'brackets' });
    }
  }
});

instance.interceptors.request.use(request => {
  request.headers.Authorization = localStorage.getItem('jwt');

  return request;
});

export const handleRequest: (promise: Promise<any>) => Promise<any[]> = (
  promise: Promise<any>
) =>
  promise
    .then(data => [data, undefined])
    .catch(error => [undefined, error.response.data]);

export default instance;
